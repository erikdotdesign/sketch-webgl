import processImageLayerAssets from './imageAssets';
import processShapeLayerAssets from './shapeAssets';
import processGroupLayerAssets from './groupAssets';

interface ClearLayerStylesOptions {
  layer: srm.RelevantLayer;
  page: srm.Page;
}

export const clearLayerStyles = ({ layer, page }: ClearLayerStylesOptions): Promise<srm.RelevantLayer> => {
  return new Promise((resolve, reject) => {
    const { style, transform } = layer;
    if (layer.type === 'Text') {
      style.textColor = '#000000ff';
      layer.sketchObject.setTextBehaviour(0);
    }
    // @ts-ignore
    layer.parent = page;
    style.opacity = 1;
    style.borders = [];
    style.fills = [];
    style.shadows = [];
    style.innerShadows = [];
    style.blur = {
      blurType: 'Gaussian',
      radius: 0,
      motionAngle: 0,
      center: {x: 0, y: 0},
      enabled: false
    };
    transform.flippedHorizontally = false;
    transform.flippedVertically = false;
    transform.rotation = 0;
    resolve(layer);
  });
};

interface GenerateImageAssetOptions {
  layer: srm.SketchLayer;
  sketch: srm.Sketch;
  id: string;
  prefix?: string;
  scale?: string;
}

export const generateImageAsset = ({ layer, sketch, id, prefix, scale }: GenerateImageAssetOptions): Promise<srm.base64Image> => {
  return new Promise((resolve, reject) => {
    // create buffer from layer
    const buffer = sketch.export(layer, {
      formats: 'png',
      scales: scale ? scale : '1',
      output: false,
      ['save-for-web']: true
    });
    // create image layer from buffer
    const bufferImg: srm.Image = new sketch.Image({
      image: buffer
    });
    // get base64 from image layer nsdata
    const base64 = bufferImg.image.nsdata.base64EncodedStringWithOptions(0);
    // create base64 string
    const base64String = `data:image/png;base64,${base64}`;
    // return final image
    resolve({
      id: prefix ? `${prefix}${id}` : id,
      src: base64String,
    });
  })
};

interface CreateGradientFillImageOptions {
  page: srm.Page;
  layer: srm.Shape | srm.ShapePath | srm.Image | srm.Text;
  gradient: srm.Gradient;
  gradientOpacity: number;
  sketch: srm.Sketch;
  prefix?: string;
}

const createGradientFillImage = ({ page, layer, gradient, gradientOpacity, sketch, prefix }: CreateGradientFillImageOptions): Promise<srm.base64Image> => {
  return new Promise((resolve, reject) => {
    // create new layer with gradient
    const gradientImage = new sketch.ShapePath({
      parent: page,
      frame: layer.frame,
      style: {
        fills: [{
          fillType: 'Gradient',
          gradient: gradient
        }],
        borders: [],
        opacity: gradientOpacity
      }
    });
    // export image to temp dir
    generateImageAsset({
      layer: gradientImage,
      sketch: sketch,
      id: layer.id,
      prefix: prefix
    })
    .then((imageAsset) => {
      // remove image from page
      gradientImage.remove();
      // return final image
      resolve(imageAsset);
    });
  });
};

interface CreatePatternFillImageOptions {
  page: srm.Page;
  layer: srm.Shape | srm.ShapePath | srm.Image | srm.Text;
  pattern: srm.Pattern;
  fillOpacity: number;
  sketch: srm.Sketch;
  prefix?: string;
}

const createPatternFillImage = ({ page, layer, pattern, fillOpacity, sketch, prefix }: CreatePatternFillImageOptions): Promise<srm.base64Image> => {
  return new Promise((resolve, reject) => {
    // create image from fill pattern image
    const fillImage = new sketch.Image({
      image: pattern.image,
      parent: page,
      frame: layer.frame,
      style: {
        opacity: fillOpacity
      }
    });
    // generate base64 image from image layer
    generateImageAsset({
      layer: fillImage,
      sketch: sketch,
      id: layer.id,
      prefix: prefix
    })
    .then((imageAsset) => {
      // remove image from page
      fillImage.remove();
      // return final base64 image
      resolve(imageAsset);
    });
  });
};

interface ProcessLayerBorderGradient {
  page: srm.Page;
  layer: srm.Shape | srm.ShapePath | srm.Image | srm.Text;
  border: srm.Border;
  borderIndex: number;
  sketch: srm.Sketch;
}

const processLayerBorderGradient = ({ page, layer, border, borderIndex, sketch }: ProcessLayerBorderGradient): Promise<srm.base64Image> => {
  return new Promise((resolve, reject) => {
    createGradientFillImage({
      page: page,
      layer: layer,
      gradient: border.gradient,
      gradientOpacity: border.sketchObject.contextSettings().opacity(),
      sketch: sketch,
      prefix: `[border-${borderIndex}]`
    })
    .then((gradientBorderImage) => {
      resolve(gradientBorderImage);
    });
  });
};

interface ProcessLayerFillGradient {
  page: srm.Page;
  layer: srm.Shape | srm.ShapePath | srm.Image | srm.Text;
  fill: srm.Fill;
  fillIndex: number;
  sketch: srm.Sketch;
}

const processLayerFillGradient = ({ page, layer, fill, fillIndex, sketch }: ProcessLayerFillGradient): Promise<srm.base64Image> => {
  return new Promise((resolve, reject) => {
    createGradientFillImage({
      page: page,
      layer: layer,
      gradient: fill.gradient,
      gradientOpacity: fill.sketchObject.contextSettings().opacity(),
      sketch: sketch,
      prefix: `[fill-${fillIndex}]`
    })
    .then((gradientFillImage) => {
      resolve(gradientFillImage);
    });
  });
};

interface ProcessLayerFillPatternOptions {
  page: srm.Page;
  layer: srm.Shape | srm.ShapePath | srm.Image | srm.Text;
  fill: srm.Fill;
  fillIndex: number;
  sketch: srm.Sketch;
}

const processLayerFillPattern = ({ page, layer, fill, fillIndex, sketch }: ProcessLayerFillPatternOptions): Promise<srm.base64Image | null> => {
  return new Promise((resolve, reject) => {
    if (fill.pattern.image) {
      createPatternFillImage({
        page: page,
        layer: layer,
        pattern: fill.pattern,
        fillOpacity: fill.sketchObject.contextSettings().opacity(),
        sketch: sketch,
        prefix: `[fill-${fillIndex}]`
      })
      .then((patternFillImage) => {
        resolve(patternFillImage);
      });
    } else {
      resolve(null);
    }
  });
};

interface ProcessLayerFillOptions {
  page: srm.Page;
  layer: srm.Shape | srm.ShapePath | srm.Image | srm.Text;
  fill: srm.Fill;
  fillIndex: number;
  sketch: srm.Sketch;
}

const processLayerFill = ({ page, layer, fill, fillIndex, sketch }: ProcessLayerFillOptions): Promise<srm.base64Image | null> => {
  return new Promise((resolve, reject) => {
    switch(fill.fillType) {
      case 'Pattern':
        processLayerFillPattern({
          page: page,
          layer: layer,
          fill: fill,
          fillIndex: fillIndex,
          sketch: sketch
        })
        .then((layerImage) => {
          resolve(layerImage);
        });
        break;
      case 'Gradient':
        processLayerFillGradient({
          page: page,
          layer: layer,
          fill: fill,
          fillIndex: fillIndex,
          sketch: sketch
        })
        .then((layerImage) => {
          resolve(layerImage);
        });
        break;
      case 'Color':
        resolve(null);
        break;
    }
  });
};

interface ProcessLayerFillsOptions {
  page: srm.Page;
  layer: srm.Shape | srm.ShapePath | srm.Image | srm.Text;
  sketch: srm.Sketch;
  fills: srm.Fill[];
}

export const processLayerFills = ({ page, layer, sketch, fills }: ProcessLayerFillsOptions): Promise<(srm.base64Image | null)[]> => {
  let promises: Promise<srm.base64Image | null>[] = [];
  fills.forEach((fill: srm.Fill, fillIndex: number) => {
    if (fill.enabled) {
      promises.push(processLayerFill({
        page: page,
        layer: layer,
        fill: fill,
        fillIndex: fillIndex,
        sketch: sketch
      }));
    }
  });
  return Promise.all(promises);
};

interface ProcessLayerBorderOptions {
  page: srm.Page;
  layer: srm.Shape | srm.ShapePath | srm.Image | srm.Text;
  border: srm.Border;
  borderIndex: number;
  sketch: srm.Sketch;
}

const processLayerBorder = ({ page, layer, border, borderIndex, sketch }: ProcessLayerBorderOptions): Promise<srm.base64Image | null> => {
  return new Promise((resolve, reject) => {
    switch(border.fillType) {
      case 'Gradient':
        processLayerBorderGradient({
          page: page,
          layer: layer,
          border: border,
          borderIndex: borderIndex,
          sketch: sketch
        })
        .then((layerImage) => {
          resolve(layerImage);
        });
        break;
      case 'Pattern':
      case 'Color':
        resolve(null);
        break;
    }
  });
};

interface ProcessLayerBordersOptions {
  page: srm.Page;
  layer: srm.Shape | srm.ShapePath | srm.Image | srm.Text;
  sketch: srm.Sketch;
  borders: srm.Border[];
}

export const processLayerBorders = ({ page, layer, sketch, borders }: ProcessLayerBordersOptions): Promise<(srm.base64Image | null)[]> => {
  let promises: Promise<srm.base64Image | null>[] = [];
  borders.forEach((border: srm.Border, borderIndex: number) => {
    if (border.enabled) {
      promises.push(processLayerBorder({
        page: page,
        layer: layer,
        border: border,
        borderIndex: borderIndex,
        sketch: sketch
      }));
    }
  });
  return Promise.all(promises);
};

interface ProcessLayerOptions {
  page: srm.Page;
  layer: srm.RelevantLayer;
  sketch: srm.Sketch;
}

const processLayer = ({ page, layer, sketch }: ProcessLayerOptions): Promise<srm.base64Image[]> => {
  return new Promise((resolve, reject) => {
    const layerImages: srm.base64Image[] = [];
    switch(layer.type) {
      case 'Image':
        processImageLayerAssets({
          page: page,
          layer: layer as srm.Image,
          sketch: sketch
        })
        .then((imageLayerImages) => {
          layerImages.push(...imageLayerImages);
        })
        .finally(() => {
          resolve(layerImages);
        });
        break;
      case 'Shape':
      case 'ShapePath':
        processShapeLayerAssets({
          page: page,
          layer: layer as srm.Shape | srm.ShapePath,
          sketch: sketch
        })
        .then((shapeLayerImages) => {
          layerImages.push(...shapeLayerImages);
        })
        .finally(() => {
          resolve(layerImages);
        });
        break;
      case 'Group':
        processGroupLayerAssets({
          page: page,
          layer: layer as srm.Group,
          sketch: sketch
        })
        .then((groupLayerImages) => {
          layerImages.push(...groupLayerImages as srm.base64Image[]);
        })
        .finally(() => {
          resolve(layerImages);
        });
        break;
      default:
        resolve(layerImages);
    }
  });
};

interface ProcessLayersOptions {
  page: srm.Page;
  layers: srm.RelevantLayer[];
  sketch: srm.Sketch;
}

export const processLayers = ({ page, layers, sketch }: ProcessLayersOptions) => {
  const promises: Promise<srm.base64Image[]>[] = [];
  layers.forEach((layer: srm.RelevantLayer) => {
    promises.push(processLayer({
      page: page,
      layer: layer,
      sketch: sketch
    }));
  });
  return Promise.all(promises);
};

interface GetAssetsOptions {
  page: srm.Page;
  artboard: srm.Artboard;
  sketch: srm.Sketch;
}

export const getAssets = ({ page, artboard, sketch }: GetAssetsOptions): Promise<srm.base64Image[]> => {
  return new Promise((resolve, reject) => {
    processLayers({
      page: page,
      layers: artboard.layers as srm.RelevantLayer[],
      sketch: sketch
    })
    .then((layerImages) => {
      const images = layerImages.reduce((imageArray: srm.base64Image[], layerImageArray: srm.base64Image[]) => {
        return [...imageArray, ...layerImageArray];
      }, []);
      resolve(images);
    });
  });
};

export default getAssets;