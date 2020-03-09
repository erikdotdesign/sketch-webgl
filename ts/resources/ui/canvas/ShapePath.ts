import * as PIXI from 'pixi.js';

import setLayerContainer from './style/layerContainer';
import renderShadows from './style/shadows';
import renderOpacity from './style/opacity';
import renderBlendMode from './style/blendMode';
import renderGroupsShadows from './style/groupShadows';
import renderFills from './style/fills';
import renderInnerShadows from './style/innerShadows';
import renderBorders from './style/borders';
import renderTransforms from './style/transforms';
import renderBlur from './style/blur';

interface RenderShapePathOptions {
  layer: srm.ShapePath;
  resources: PIXI.LoaderResource[];
  groupShadows?: srm.GroupShadows[] | undefined;
}

const renderShapePath = ({layer, resources, groupShadows}: RenderShapePathOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    const { style, transform } = layer;
    const { fills, borders, shadows, innerShadows, blur, blendingMode, opacity } = style;
    const shapePathContainer = new PIXI.Container();
    shapePathContainer.name = layer.id;
    setLayerContainer({
      layer: layer,
      container: shapePathContainer
    })
    .then(() => {
      return renderOpacity({
        opacity: opacity,
        container: shapePathContainer
      });
    })
    .then(() => {
      return renderBlendMode({
        blendMode: blendingMode,
        container: shapePathContainer
      });
    })
    .then(() => {
      return renderGroupsShadows({
        layer: layer,
        groupShadows: groupShadows,
        container: shapePathContainer
      });
    })
    .then(() => {
      return renderShadows({
        layer: layer,
        shadows: shadows,
        container: shapePathContainer
      });
    })
    .then(() => {
      return renderFills({
        layer: layer,
        fills: fills,
        resources: resources,
        container: shapePathContainer
      });
    })
    .then(() => {
      return renderInnerShadows({
        layer: layer,
        innerShadows: innerShadows,
        container: shapePathContainer
      });
    })
    .then(() => {
      return renderBorders({
        layer: layer,
        borders: borders,
        resources: resources,
        container: shapePathContainer
      });
    })
    .then(() => {
      return renderTransforms({
        layer: layer,
        transform: transform,
        container: shapePathContainer
      });
    })
    .then(() => {
      return renderBlur({
        layer: layer,
        blur: blur,
        container: shapePathContainer
      });
    })
    .finally(() => {
      resolve(shapePathContainer);
    });
  });
};

export default renderShapePath;