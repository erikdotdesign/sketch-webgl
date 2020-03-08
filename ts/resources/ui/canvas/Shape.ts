import * as PIXI from 'pixi.js';

import {
  setBaseLayerContainer,
  setShapeLayerContainer,
  renderGroupsShadows,
  renderShadows,
  renderFills,
  renderInnerShadows,
  renderBorders,
  renderTransforms,
  renderBlur
} from './Style';

import { getShapePartials } from './utils';

interface RenderShapePartialOptions {
  layer: srm.ShapePartial;
  borders: srm.Border[];
  fills: srm.Fill[];
  groupShadows: srm.GroupShadows[] | undefined;
  shadows: srm.Shadow[];
  innerShadows: srm.Shadow[];
  resources: PIXI.LoaderResource[];
  container: PIXI.Container;
}

const renderShapePartial = ({ layer, borders, fills, groupShadows, shadows, innerShadows, resources, container }: RenderShapePartialOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    const shapePartialContainer = new PIXI.Container();
    shapePartialContainer.name = 'shape-partial';
    setShapeLayerContainer({
      layer: layer,
      container: shapePartialContainer
    })
    .then(() => {
      return renderGroupsShadows({
        layer: layer,
        groupShadows: groupShadows,
        container: shapePartialContainer
      });
    })
    .then(() => {
      return renderShadows({
        layer: layer,
        shadows: shadows,
        container: shapePartialContainer
      });
    })
    .then(() => {
      return renderFills({
        layer: layer,
        fills: fills,
        resources: resources,
        container: shapePartialContainer
      });
    })
    .then(() => {
      return renderInnerShadows({
        layer: layer,
        innerShadows: innerShadows,
        container: shapePartialContainer
      });
    })
    .then(() => {
      return renderBorders({
        layer: layer,
        borders: borders,
        resources: resources,
        container: shapePartialContainer
      });
    })
    .then(() => {
      container.addChild(shapePartialContainer);
      resolve(shapePartialContainer);
    });
  });
}

interface RenderShapePartialsOptions {
  layers: srm.ShapePartial[];
  borders: srm.Border[];
  fills: srm.Fill[];
  groupShadows: srm.GroupShadows[] | undefined;
  shadows: srm.Shadow[];
  innerShadows: srm.Shadow[];
  resources: PIXI.LoaderResource[];
  container: PIXI.Container;
}

const renderShapePartials = ({ layers, borders, fills, groupShadows, shadows, innerShadows, resources, container }: RenderShapePartialsOptions): Promise<PIXI.Container[]> => {
  const promises: Promise<PIXI.Container>[] = [];
  layers.forEach((layer: srm.ShapePartial) => {
    promises.push(renderShapePartial({
      layer: layer,
      fills: fills,
      borders: borders,
      groupShadows: groupShadows,
      shadows: shadows,
      innerShadows: innerShadows,
      resources: resources,
      container: container
    }));
  });
  return Promise.all(promises);
}

interface RenderShapeOptions {
  layer: srm.Shape;
  resources: PIXI.LoaderResource[];
  groupShadows?: srm.GroupShadows[] | undefined;
}

const renderShape = ({ layer, resources, groupShadows }: RenderShapeOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    const { transform, style } = layer;
    const { blur, shadows, innerShadows, fills, borders, blendingMode } = style;
    const shapePartials = getShapePartials({shape: layer});
    const shapeContainer = new PIXI.Container();
    shapeContainer.name = layer.id;
    setBaseLayerContainer({
      layer: layer,
      container: shapeContainer
    })
    .then(() => {
      return renderShapePartials({
        layers: shapePartials,
        fills: fills,
        borders: borders,
        groupShadows: groupShadows,
        shadows: shadows,
        innerShadows: innerShadows,
        resources: resources,
        container: shapeContainer
      });
    })
    .then(() => {
      return renderTransforms({
        layer: layer,
        transform: transform,
        container: shapeContainer
      });
    })
    .then(() => {
      return renderBlur({
        layer: layer,
        blur: blur,
        container: shapeContainer
      });
    })
    .finally(() => {
      resolve(shapeContainer);
    });
  });
};

export default renderShape;