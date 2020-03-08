import * as PIXI from 'pixi.js';

import {
  setBaseLayerContainer,
  renderGroupsShadows,
  renderShadows,
  renderFills,
  renderInnerShadows,
  renderBorders,
  renderTransforms,
  renderBlur
} from './Style';

interface RenderBaseImageFillOptions {
  layer: srm.Image;
  resources: PIXI.LoaderResource[];
  container: PIXI.Container;
}

const renderBaseImageFill = ({ layer, resources, container }: RenderBaseImageFillOptions) => {
  return new Promise((resolve, reject) => {
    const baseImage = new PIXI.Graphics();
    baseImage.name = 'image';
    const baseImageResource = PIXI.Texture.from(resources[`[image]${layer.id}` as any].url);
    baseImage.beginTextureFill({texture: baseImageResource});
    baseImage.drawRect(0, 0, layer.frame.width, layer.frame.height);
    baseImage.endFill();
    container.addChild(baseImage);
    resolve(container);
  });
}

interface RenderImageOptions {
  layer: srm.Image;
  resources: PIXI.LoaderResource[];
  groupShadows?: srm.GroupShadows[] | undefined;
}

const renderImage = ({ layer, resources, groupShadows }: RenderImageOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    const { style, transform } = layer;
    const { fills, borders, innerShadows, shadows, blur } = style;
    const imageContainer = new PIXI.Container();
    imageContainer.name = layer.id;
    setBaseLayerContainer({
      layer: layer,
      container: imageContainer
    })
    .then(() => {
      return renderGroupsShadows({
        layer: layer,
        groupShadows: groupShadows,
        container: imageContainer
      });
    })
    .then(() => {
      return renderShadows({
        layer: layer,
        shadows: shadows,
        container: imageContainer
      });
    })
    .then(() => {
      return renderBaseImageFill({
        layer: layer,
        resources: resources,
        container: imageContainer
      });
    })
    .then(() => {
      return renderFills({
        layer: layer,
        fills: fills,
        resources: resources,
        container: imageContainer
      });
    })
    .then(() => {
      return renderInnerShadows({
        layer: layer,
        innerShadows: innerShadows,
        container: imageContainer
      });
    })
    .then(() => {
      return renderBorders({
        layer: layer,
        borders: borders,
        resources: resources,
        container: imageContainer
      });
    })
    .then(() => {
      return renderTransforms({
        layer: layer,
        transform: transform,
        container: imageContainer
      });
    })
    .then(() => {
      return renderBlur({
        layer: layer,
        blur: blur,
        container: imageContainer
      });
    })
    .finally(() => {
      resolve(imageContainer);
    });
  });
};

export default renderImage;