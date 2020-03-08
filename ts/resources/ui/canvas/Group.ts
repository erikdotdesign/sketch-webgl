import * as PIXI from 'pixi.js';

import renderLayers from './Layers';
import { setBaseLayerContainer, renderTransforms } from './Style';

interface RenderGroupOptions {
  layer: srm.Group;
  resources: PIXI.LoaderResource[];
  groupShadows?: srm.GroupShadows[];
}

const renderGroup = ({layer, resources, groupShadows}: RenderGroupOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    const { name, transform, id, style } = layer;
    const { shadows } = style;
    const layerShadows = { id, shadows };
    const compiledGroupShadows = groupShadows ? [...groupShadows, layerShadows] : [layerShadows];
    const groupContainer = new PIXI.Container();
    const groupLayers = new PIXI.Container();
    groupContainer.name = layer.id;
    groupLayers.name = 'layers';
    setBaseLayerContainer({
      layer: layer,
      container: groupContainer
    })
    .then(() => {
      return renderLayers({
        layers: layer.layers as srm.RelevantLayer[],
        resources: resources,
        container: groupLayers,
        groupShadows: compiledGroupShadows
      });
    })
    .then(() => {
      groupContainer.addChild(groupLayers);
      if (name === 'srm.mask') {
        groupLayers.mask = groupLayers.children[0] as PIXI.Container;
      }
      return renderTransforms({
        layer: layer,
        transform: transform,
        container: groupContainer
      });
    })
    .finally(() => {
      resolve(groupContainer);
    });
  });
};

export default renderGroup;