import * as PIXI from 'pixi.js';
import renderLayer from './Layer';

interface RenderLayersOptions {
  layers: srm.RelevantLayer[];
  resources: PIXI.LoaderResource[];
  container: PIXI.Container;
  groupShadows?: srm.GroupShadows[] | undefined;
}

const renderLayers = ({ layers, resources, container, groupShadows }: RenderLayersOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    let promises: any[] = [];
    layers.forEach((layer: srm.RelevantLayer) => {
      promises.push(renderLayer({layer, resources, groupShadows}));
    });
    Promise.all(promises).then((pixiLayers) => {
      pixiLayers.forEach((pixiLayer) => {
        container.addChild(pixiLayer);
      });
      resolve(container);
    });
  });
};

export default renderLayers;