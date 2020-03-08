import { processLayerFills, processLayerBorders } from './assets';

interface ProcessShapeLayerAssetsOpts {
  page: srm.Page;
  layer: srm.Shape | srm.ShapePath;
  sketch: srm.Sketch;
}

const processShapeLayerAssets = ({ page, layer, sketch }: ProcessShapeLayerAssetsOpts): Promise<srm.base64Image[]> => {
  return new Promise((resolve, reject) => {
    const { style } = layer;
    const { fills, borders, shadows, innerShadows } = style;
    const layerImages: srm.base64Image[] = [];
    processLayerFills({
      page: page,
      layer: layer,
      sketch: sketch,
      fills: fills
    })
    .then((fillImages) => {
      const newImages = fillImages.filter(fillImage => fillImage);
      layerImages.push(...newImages as srm.base64Image[]);
      return processLayerBorders({
        page: page,
        layer: layer as srm.Shape | srm.ShapePath,
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

export default processShapeLayerAssets;