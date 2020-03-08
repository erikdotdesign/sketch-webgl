interface CheckIfMaskOptions {
  layer: srm.RelevantLayer | null;
  sketch: srm.Sketch;
}

const checkIfMask = ({ layer, sketch }: CheckIfMaskOptions): Promise<srm.RelevantLayer | null> => {
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

interface CheckIfShapePathOptions {
  layer: srm.RelevantLayer | null;
  sketch: srm.Sketch;
}

const checkIfShapePath = ({ layer, sketch }: CheckIfShapePathOptions): Promise<srm.RelevantLayer | null> => {
  return new Promise((resolve, reject) => {
    if (layer && layer.type === 'ShapePath') {
      const { style, parent, index } = layer;
      const { borderOptions } = style;
      const duplicate = layer.duplicate() as srm.ShapePath;
      duplicate.transform.rotation = 0;
      duplicate.transform.flippedHorizontally = false;
      duplicate.transform.flippedVertically = false;
      const svgPath = duplicate.getSVGPath();
      const flatPath = sketch.ShapePath.fromSVGPath(svgPath);
      (layer as srm.ShapePath).points = flatPath.points;
      duplicate.remove();
      if (borderOptions.dashPattern.length > 0 || borderOptions.startArrowhead !== 'None' || borderOptions.endArrowhead !== 'None') {
        layer.sketchObject.layersByConvertingToOutlines();
        const outlines = parent.layers[index];
        outlines.name = `[srm.with-border-options]${layer.name}`;
        outlines.sketchObject.simplify();
        resolve(outlines as srm.ShapePath | srm.Shape);
      } else {
        resolve(layer);
      }
    } else {
      resolve(layer);
    }
  });
};

interface CheckIfShapeOptions {
  layer: srm.RelevantLayer | null;
  sketch: srm.Sketch;
  page: srm.Page;
}

const checkIfShape = ({ layer, sketch, page }: CheckIfShapeOptions): Promise<srm.RelevantLayer | null> => {
  return new Promise((resolve, reject) => {
    if (layer && layer.type === 'Shape') {
      const { style, parent, index } = layer;
      if (layer.sketchObject.canFlatten()) {
        layer.sketchObject.flatten();
        resolve(parent.layers[index] as srm.Shape);
      } else {
        if ((layer as srm.Shape).layers.length === 1) {
          layer.sketchObject.ungroup();
          const ungrouped = parent.layers[index] as srm.RelevantLayer;
          ungrouped.style = style;
          resolve(ungrouped);
        } else {
          resolve(layer);
        }
      }
    } else {
      resolve(layer);
    }
  });
};

interface CheckIfRelevantOptions {
  layer: srm.ArtboardLayer;
}

const checkIfRelevant = ({ layer }: CheckIfRelevantOptions): Promise<srm.RelevantLayer | srm.SymbolInstance | null> => {
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

interface CheckIfHiddenOptions {
  layer: srm.RelevantLayer | srm.SymbolInstance | null;
}

const checkIfHidden = ({ layer }: CheckIfHiddenOptions): Promise<srm.RelevantLayer | srm.SymbolInstance | null> => {
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

interface CheckIfSymbolOptions {
  layer: srm.RelevantLayer | srm.SymbolInstance | null;
}

const checkIfSymbol = ({ layer }: CheckIfSymbolOptions): Promise<srm.RelevantLayer | null> => {
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

interface CheckIfTextOptions {
  layer: srm.RelevantLayer | null;
  sketch: srm.Sketch;
}

const checkIfText = ({ layer, sketch }: CheckIfTextOptions): Promise<srm.RelevantLayer | null> => {
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

interface RoundFrameDimensionsOptions {
  layer: srm.RelevantLayer | null;
}

const roundFrameDimensions = ({ layer }: RoundFrameDimensionsOptions): Promise<srm.RelevantLayer | null> => {
  return new Promise((resolve, reject) => {
    if (layer) {
      layer.frame.x = Math.round(layer.frame.x);
      layer.frame.y = Math.round(layer.frame.y);
      layer.frame.width = Math.round(layer.frame.width);
      layer.frame.height = Math.round(layer.frame.height);
    }
    resolve(layer);
  });
};

interface ProcessLayerOptions {
  layer: srm.ArtboardLayer;
  sketch: srm.Sketch;
  page: srm.Page;
}

const processLayer = ({ layer, sketch, page }: ProcessLayerOptions): Promise<srm.RelevantLayer> => {
  return new Promise((resolve, reject) => {
    checkIfRelevant({
      layer: layer
    })
    .then((layerS1) => {
      return checkIfHidden({
        layer: layerS1 as srm.RelevantLayer | srm.SymbolInstance | null
      });
    })
    .then((layerS2) => {
      return checkIfSymbol({
        layer: layerS2 as srm.RelevantLayer | null
      });
    })
    .then((layerS3) => {
      return checkIfShape({
        layer: layerS3 as srm.RelevantLayer | null,
        sketch: sketch,
        page: page
      });
    })
    .then((layerS4) => {
      return checkIfShapePath({
        layer: layerS4 as srm.RelevantLayer | null,
        sketch: sketch
      });
    })
    .then((layerS5) => {
      return checkIfMask({
        layer: layerS5 as srm.RelevantLayer | null,
        sketch: sketch
      });
    })
    .then((layerS6) => {
      return checkIfText({
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