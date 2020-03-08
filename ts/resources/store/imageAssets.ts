import { generateImageAsset, processLayerFills, processLayerBorders } from './assets';

interface ProcessLayerImageOptions {
  page: srm.Page;
  layer: srm.Image;
  sketch: srm.Sketch;
}

const processLayerImage = ({ page, layer, sketch }: ProcessLayerImageOptions): Promise<srm.base64Image> => {
  return new Promise((resolve, reject) => {
    // create image layer from image date
    const baseImage = new sketch.Image({
      image: (<srm.Image>layer).image,
      frame: layer.frame,
      parent: page
    });
    generateImageAsset({
      layer: baseImage,
      sketch: sketch,
      id: layer.id,
      prefix: '[image]'
    })
    .then((imageAsset) => {
      // remove asset artboard from page
      baseImage.remove();
      // return base64 image
      resolve(imageAsset);
    });
  });
};

interface ProcessImageLayerAssetsOpts {
  page: srm.Page;
  layer: srm.Image;
  sketch: srm.Sketch;
}

const processImageLayerAssets = ({ page, layer, sketch }: ProcessImageLayerAssetsOpts): Promise<srm.base64Image[]> => {
  return new Promise((resolve, reject) => {
    const { style } = layer;
    const { fills, borders, shadows, innerShadows } = style;
    const layerImages: srm.base64Image[] = [];
    processLayerImage({
      page: page,
      layer: layer as srm.Image,
      sketch: sketch
    })
    .then((layerImage) => {
      layerImages.push(layerImage);
      return processLayerFills({
        page: page,
        layer: layer as srm.Image,
        sketch: sketch,
        fills: fills
      });
    })
    .then((fillImages) => {
      const newImages = fillImages.filter(fillImage => fillImage);
      layerImages.push(...newImages as srm.base64Image[]);
      return processLayerBorders({
        page: page,
        layer: layer as srm.Image,
        sketch: sketch,
        borders: borders
      });
    })
    .then((borderImages) => {
      const newImages = borderImages.filter(borderImage => borderImage);
      layerImages.push(...newImages as srm.base64Image[]);
    })
    .finally(() => {
      resolve(layerImages);
    });
  });
};

export default processImageLayerAssets;