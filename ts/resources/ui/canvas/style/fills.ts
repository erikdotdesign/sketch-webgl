import * as PIXI from 'pixi.js';
import { colorToFill, getFillTexture } from '../utils';
import renderLayerShape from './layerShape';

interface RenderFillColorOptions {
  layer: srm.ShapePath | srm.Image | srm.ShapePartial | srm.Text;
  fill: srm.Fill;
  fillIndex: number;
  container: PIXI.Container;
}

const renderFillColor = ({ layer, fill, fillIndex, container }: RenderFillColorOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    const fillColor = new PIXI.Graphics();
    fillColor.name = `fill-${fillIndex}`;
    const fillStyles = colorToFill(fill.color);
    fillColor.beginFill(fillStyles.color, fillStyles.alpha);
    renderLayerShape({
      layer: layer,
      graphic: fillColor
    })
    .then((fillColor) => {
      fillColor.endFill();
      container.addChild(fillColor);
      resolve(container);
    });
  });
};

interface RenderFillImageOptions {
  layer: srm.ShapePath | srm.Image | srm.ShapePartial;
  fillIndex: number;
  resources: PIXI.LoaderResource[];
  container: PIXI.Container;
}

const renderFillImage = ({ layer, fillIndex, resources, container }: RenderFillImageOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    const fillTexture = getFillTexture({layer, fillIndex, resources});
    const fillImage = new PIXI.Graphics();
    fillImage.name = `fill-${fillIndex}`;
    fillImage.beginTextureFill({texture: fillTexture});
    renderLayerShape({
      layer: layer,
      graphic: fillImage
    })
    .then((fillImage) => {
      fillImage.endFill();
      container.addChild(fillImage);
      resolve(container);
    });
  });
};

interface RenderFillOptions {
  layer: srm.ShapePath | srm.Image | srm.ShapePartial;
  fill: srm.Fill;
  fillIndex: number;
  resources: PIXI.LoaderResource[];
  container: PIXI.Container;
}

const renderFill = ({ layer, fill, fillIndex, resources, container }: RenderFillOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    switch(fill.fillType) {
      case 'Color':
        renderFillColor({
          layer: layer,
          fill: fill,
          fillIndex: fillIndex,
          container: container
        })
        .then(() => {
          resolve(container);
        });
        break;
      case 'Pattern':
      case 'Gradient':
        renderFillImage({
          layer: layer,
          fillIndex: fillIndex,
          resources: resources,
          container: container
        })
        .then(() => {
          resolve(container);
        });
        break;
    }
  });
};

interface RenderFillsOptions {
  layer: srm.ShapePath | srm.Image | srm.ShapePartial;
  fills: srm.Fill[];
  resources: PIXI.LoaderResource[];
  container: PIXI.Container;
}

const renderFills = ({ layer, fills, resources, container }: RenderFillsOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    if (fills.length > 0 && fills.some(fill => fill.enabled)) {
      let fillsContainer = new PIXI.Container();
      fillsContainer.name = 'fills';
      let promises: Promise<PIXI.Container>[] = [];
      fills.forEach((fill: srm.Fill, fillIndex: number) => {
        if (fill.enabled) {
          promises.push(renderFill({
            layer: layer,
            fill: fill,
            fillIndex: fillIndex,
            resources: resources,
            container: fillsContainer
          }));
        }
      });
      Promise.all(promises).then(() => {
        container.addChild(fillsContainer);
        resolve(container);
      });
    } else {
      resolve(container);
    }
  });
};

export default renderFills;