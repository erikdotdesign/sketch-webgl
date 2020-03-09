import * as PIXI from 'pixi.js';

import renderLayers from './Layers';
import setLayerContainer from './style/layerContainer';
import renderOpacity from './style/opacity';
import renderBlendMode from './style/blendMode';
import renderTransforms from './style/transforms';

interface RenderGroupOptions {
  layer: srm.Group;
  resources: PIXI.LoaderResource[];
  groupShadows?: srm.GroupShadows[];
}

const renderGroup = ({layer, resources, groupShadows}: RenderGroupOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    const { name, transform, id, style } = layer;
    const { shadows, opacity, blendingMode } = style;
    const layerShadows = { id, shadows };
    const compiledGroupShadows = groupShadows ? [...groupShadows, layerShadows] : [layerShadows];
    const groupContainer = new PIXI.Container();
    groupContainer.name = layer.id;
    setLayerContainer({
      layer: layer,
      container: groupContainer
    })
    .then(() => {
      return renderOpacity({
        opacity: opacity,
        container: groupContainer
      });
    })
    .then(() => {
      return renderBlendMode({
        blendMode: blendingMode,
        container: groupContainer
      });
    })
    .then(() => {
      return renderLayers({
        layers: layer.layers as srm.RelevantLayer[],
        resources: resources,
        container: groupContainer,
        groupShadows: compiledGroupShadows
      });
    })
    .then(() => {
      if (name === 'srm.mask') {
        groupContainer.mask = groupContainer.children[0] as PIXI.Container;
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