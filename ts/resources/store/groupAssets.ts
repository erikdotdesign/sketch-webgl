import { processLayers } from './assets';

interface ProcessGroupLayerAssetsOpts {
  page: srm.Page;
  layer: srm.Group;
  sketch: srm.Sketch;
}

const processGroupLayerAssets = ({ page, layer, sketch }: ProcessGroupLayerAssetsOpts): Promise<srm.base64Image[]> => {
  return new Promise((resolve, reject) => {
    const layerImages: srm.base64Image[] = [];
    processLayers({
      page: page,
      layers: (layer as srm.Group).layers as srm.RelevantLayer[],
      sketch: sketch
    })
    .then((groupLayerImages) => {
      const images = groupLayerImages.reduce((imageArray: srm.base64Image[], layerImageArray: srm.base64Image[]) => {
        return [...imageArray, ...layerImageArray];
      }, []);
      layerImages.push(...images);
    })
    .finally(() => {
      resolve(layerImages);
    });
  });
};

export default processGroupLayerAssets;