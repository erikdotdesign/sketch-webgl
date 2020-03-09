interface ProcessMaskOptions {
  layer: srm.RelevantLayer | null;
  sketch: srm.Sketch;
}

const processMask = ({ layer, sketch }: ProcessMaskOptions): Promise<srm.RelevantLayer | null> => {
  return new Promise((resolve, reject) => {
    if (layer && layer.sketchObject.hasClippingMask()) {
      const maskIndex = layer.index;
      const maskParent = layer.parent;
      layer.sketchObject.setHasClippingMask(false);
      // create new group to mimic mask behavior
      const maskGroup = new sketch.Group({
        name: 'srm.mask',
        frame: layer.frame,
        layers: [layer.duplicate()]
      });
      // splice in mask group, splice out old mask
      maskParent.layers.splice(maskIndex, 1, maskGroup);
      // loop through mask parent layers,
      // any layer with an index higher than the mask will be masked
      // push masked layers to maskGroup
      maskGroup.parent.layers.forEach((maskedLayer: srm.SketchLayer, index: number) => {
        if (index > maskIndex) {
          maskedLayer.frame.x = maskedLayer.frame.x - maskGroup.frame.x;
          maskedLayer.frame.y = maskedLayer.frame.y - maskGroup.frame.y;
          maskGroup.layers.push(maskedLayer);
        }
      });
      resolve(maskGroup);
    } else {
      resolve(layer);
    }
  });
};

const isPathClockwise = (points: srm.CurvePoint[]): boolean => {
  let end = points.length - 1;
  let sum = points[end].point.x * points[0].point.y - points[0].point.x * points[end].point.y;
  for(let i = 0; i < end; i++) {
    const n = i + 1;
    sum += points[i].point.x * points[n].point.y - points[n].point.x * points[i].point.y;
  }
  return sum > 0;
};

interface FlattenShapePathOptions {
  layer: srm.ShapePath;
  sketch: srm.Sketch;
}

const flattenShapePath = ({ layer, sketch }: FlattenShapePathOptions): Promise<srm.ShapePath> => {
  return new Promise((resolve, reject) => {
    // due to the way PIXI draws lines
    // the path must be clockwise to render correctly
    const isClockwise = isPathClockwise((layer as srm.ShapePath).points);
    if (!isClockwise) {
      layer.sketchObject.reversePath();
    }
    const duplicate = layer.duplicate() as srm.ShapePath;
    duplicate.transform.rotation = 0;
    duplicate.transform.flippedHorizontally = false;
    duplicate.transform.flippedVertically = false;
    const svgPath = duplicate.getSVGPath();
    const flatPath = sketch.ShapePath.fromSVGPath(svgPath);
    (layer as srm.ShapePath).points = flatPath.points;
    duplicate.remove();
    resolve(layer);
  });
};

interface ProcessShapePathBorderOptions {
  layer: srm.ShapePath;
}

const processShapePathBorderOptions = ({ layer }: ProcessShapePathBorderOptions): Promise<srm.ShapePath | srm.Shape> => {
  return new Promise((resolve, reject) => {
    const { parent, index, style } = layer;
    const { borderOptions } = style;
    if (borderOptions.dashPattern.length > 0 || borderOptions.startArrowhead !== 'None' || borderOptions.endArrowhead !== 'None') {
      layer.sketchObject.layersByConvertingToOutlines();
      const outlines = parent.layers[index];
      outlines.name = `[srm.with-border-options]${layer.name}`;
      outlines.sketchObject.simplify();
      resolve(outlines as srm.ShapePath | srm.Shape);
    } else {
      resolve(layer);
    }
  });
};

interface ProcessShapePathOptions {
  layer: srm.RelevantLayer | null;
  sketch: srm.Sketch;
}

const processShapePath = ({ layer, sketch }: ProcessShapePathOptions): Promise<srm.RelevantLayer | null> => {
  return new Promise((resolve, reject) => {
    if (layer && layer.type === 'ShapePath') {
      flattenShapePath({
        layer: layer as srm.ShapePath,
        sketch: sketch
      })
      .then((layerS1) => {
        return processShapePathBorderOptions({
          layer: layerS1
        })
      })
      .then((layerS2) => {
        resolve(layerS2);
      });
    } else {
      resolve(layer);
    }
  });
};

// interface ProcessShapeLayersOptions {
//   layer: srm.Shape;
//   sketch: srm.Sketch;
// }

// const processShapeLayers = ({ layer, sketch }: ProcessShapeLayersOptions): Promise<srm.Shape> => {
//   return new Promise((resolve, reject) => {
//     const promises: Promise<srm.Shape | srm.ShapePath>[] = [];
//     layer.layers.forEach((shapeLayer: srm.ShapePath | srm.Shape) => {
//       switch(shapeLayer.type){
//         case 'ShapePath':
//           promises.push(processShapePath({
//             layer: shapeLayer as srm.ShapePath,
//             sketch: sketch
//           }) as Promise<srm.ShapePath>);
//           break;
//         case 'Shape':
//           promises.push(processShapeBase({
//             layer: shapeLayer as srm.Shape
//           }) as Promise<srm.Shape>);
//           break;
//       }
//     });
//     Promise.all(promises).then(() => {
//       resolve(layer);
//     });
//   });
// };

interface ProcessShapeBaseOptions {
  layer: srm.Shape;
}

const processShapeBase = ({ layer }: ProcessShapeBaseOptions): Promise<srm.Shape | srm.ShapePath> => {
  return new Promise((resolve, reject) => {
    const { style, parent, index } = layer;
    if (layer.sketchObject.canFlatten()) {
      layer.sketchObject.flatten();
      resolve(parent.layers[index] as srm.Shape);
    } else {
      if ((layer as srm.Shape).layers.length === 1) {
        layer.sketchObject.ungroup();
        const ungrouped = parent.layers[index] as srm.RelevantLayer;
        ungrouped.style = style;
        resolve(ungrouped as srm.Shape | srm.ShapePath);
      } else {
        resolve(layer);
      }
    }
  });
};

interface ProcessShapeOptions {
  layer: srm.RelevantLayer | null;
  sketch: srm.Sketch;
}

const processShape = ({ layer, sketch }: ProcessShapeOptions): Promise<srm.RelevantLayer | null> => {
  return new Promise((resolve, reject) => {
    if (layer && layer.type === 'Shape') {
      processShapeBase({
        layer: layer as srm.Shape
      })
      // .then((layerS1) => {
      //   if (layerS1.type === 'Shape') {
      //     return processShapeLayers({
      //       layer: layerS1 as srm.Shape,
      //       sketch: sketch
      //     });
      //   } else {
      //     resolve(layerS1);
      //   }
      // })
      .then((layerS2) => {
        resolve(layerS2);
      });
    } else {
      resolve(layer);
    }
  });
};

interface ProcessRelevantOptions {
  layer: srm.ArtboardLayer;
}

const processRelevant = ({ layer }: ProcessRelevantOptions): Promise<srm.RelevantLayer | srm.SymbolInstance | null> => {
  return new Promise((resolve, reject) => {
    switch(layer.type) {
      case 'Group':
      case 'Shape':
      case 'Image':
      case 'ShapePath':
      case 'Text':
      case 'SymbolInstance':
        resolve(layer as srm.RelevantLayer | srm.SymbolInstance);
        break;
      case 'HotSpot':
      case 'Slice':
        layer.remove();
        resolve(null);
        break;
    }
  });
};

interface ProcessHiddenOptions {
  layer: srm.RelevantLayer | srm.SymbolInstance | null;
}

const processHidden = ({ layer }: ProcessHiddenOptions): Promise<srm.RelevantLayer | srm.SymbolInstance | null> => {
  return new Promise((resolve, reject) => {
    const isHidden = layer && (<srm.RelevantLayer | srm.SymbolInstance>layer).hidden;
    if (isHidden) {
      (layer as srm.RelevantLayer | srm.SymbolInstance).remove();
      resolve(null);
    } else {
      resolve(layer);
    }
  });
};

interface ProcessSymbolOptions {
  layer: srm.RelevantLayer | srm.SymbolInstance | null;
}

const processSymbol = ({ layer }: ProcessSymbolOptions): Promise<srm.RelevantLayer | null> => {
  return new Promise((resolve, reject) => {
    if (layer && layer.type === 'SymbolInstance') {
      resolve((<srm.SymbolInstance>layer).detach({
        recursively: true
      }));
    } else {
      resolve(layer as srm.RelevantLayer);
    }
  });
};

interface ProcessTextOptions {
  layer: srm.RelevantLayer | null;
  sketch: srm.Sketch;
}

const processText = ({ layer, sketch }: ProcessTextOptions): Promise<srm.RelevantLayer | null> => {
  return new Promise((resolve, reject) => {
    if (layer && layer.type === 'Text') {
      if ((layer as srm.Text).text.trim().length === 0) {
        layer.remove();
        resolve(null);
      } else {
        const layerIndex = layer.index;
        const parent = layer.parent;
        layer.sketchObject.layersByConvertingToOutlines();
        const outlines = parent.layers[layerIndex];
        outlines.name = `[srm.text]${layer.name}`;
        // because sketch is bugged
        outlines.sketchObject.simplify();
        // because pixi is bugged
        outlines.sketchObject.reversePath();
        resolve(outlines as srm.ShapePath | srm.Shape);
      }
    } else {
      resolve(layer);
    }
  });
};

// interface RoundFrameDimensionsOptions {
//   layer: srm.RelevantLayer | null;
// }

// const roundFrameDimensions = ({ layer }: RoundFrameDimensionsOptions): Promise<srm.RelevantLayer | null> => {
//   return new Promise((resolve, reject) => {
//     if (layer) {
//       layer.frame.x = Math.round(layer.frame.x);
//       layer.frame.y = Math.round(layer.frame.y);
//       layer.frame.width = Math.round(layer.frame.width);
//       layer.frame.height = Math.round(layer.frame.height);
//     }
//     resolve(layer);
//   });
// };

interface ProcessLayerOptions {
  layer: srm.ArtboardLayer;
  sketch: srm.Sketch;
  page: srm.Page;
}

const processLayer = ({ layer, sketch, page }: ProcessLayerOptions): Promise<srm.RelevantLayer> => {
  return new Promise((resolve, reject) => {
    processRelevant({
      layer: layer
    })
    .then((layerS1) => {
      return processHidden({
        layer: layerS1 as srm.RelevantLayer | srm.SymbolInstance | null
      });
    })
    .then((layerS2) => {
      return processSymbol({
        layer: layerS2 as srm.RelevantLayer | null
      });
    })
    .then((layerS3) => {
      return processShape({
        layer: layerS3 as srm.RelevantLayer | null,
        sketch: sketch
      });
    })
    .then((layerS4) => {
      return processShapePath({
        layer: layerS4 as srm.RelevantLayer | null,
        sketch: sketch
      });
    })
    .then((layerS5) => {
      return processMask({
        layer: layerS5 as srm.RelevantLayer | null,
        sketch: sketch
      });
    })
    .then((layerS6) => {
      return processText({
        layer: layerS6 as srm.RelevantLayer | null,
        sketch: sketch
      });
    })
    .then((layerS7) => {
      if (layerS7 && layerS7.type === 'Group') {
        processLayers({
          layers: (layerS7 as srm.Group).layers,
          sketch: sketch,
          page: page
        })
        .then(() => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  });
};

interface ProcessLayersOptions {
  layers: srm.ArtboardLayer[];
  sketch: srm.Sketch;
  page: srm.Page;
}

const processLayers = ({ layers, sketch, page }: ProcessLayersOptions): Promise<srm.RelevantLayer[]> => {
  const promises: Promise<srm.RelevantLayer>[] = [];
  layers.forEach((layer: srm.ArtboardLayer) => {
    promises.push(processLayer({
      layer: layer,
      sketch: sketch,
      page: page
    }));
  });
  return Promise.all(promises);
};

interface GetArtboardOptions {
  artboard: srm.Artboard;
  sketch: srm.Sketch;
  page: srm.Page;
}

const getArtboard = ({ artboard, sketch, page }: GetArtboardOptions): Promise<srm.Artboard> => {
  return new Promise((resolve, reject) => {
    processLayers({
      layers: artboard.layers,
      sketch: sketch,
      page: page
    })
    .then(() => {
      resolve();
    });
  });
};

export default getArtboard;