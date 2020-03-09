import * as PIXI from 'pixi.js';
import { colorToFill, getCompiledBorderThickness } from '../utils';
import renderLayerShape from './layerShape';
import renderOpacity from './opacity';

interface RenderShadowOptions {
  layer: srm.ShapePath | srm.Image | srm.ShapePartial;
  shadow: srm.Shadow;
  shadowIndex: number;
  container: PIXI.Container;
}

export const renderShadow = ({ layer, shadow, shadowIndex, container }: RenderShadowOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    const shadowStyles = colorToFill(shadow.color);
    const shadowGraphic = new PIXI.Graphics();
    shadowGraphic.name = `shadow-${shadowIndex}`;
    shadowGraphic.position.x = shadow.x;
    shadowGraphic.position.y = shadow.y;
    renderOpacity({
      opacity: shadowStyles.alpha,
      container: shadowGraphic
    })
    .then(() => {
      return renderShadowBase({
        layer: layer,
        shadowStyles: shadowStyles,
        shadowSpread: shadow.spread,
        shadowGraphic: shadowGraphic
      });
    })
    .then(() => {
      return renderShadowBlur({
        shadowBlur: shadow.blur,
        shadowGraphic: shadowGraphic
      });
    })
    .then(() => {
      container.addChild(shadowGraphic);
    })
    .finally(() => {
      resolve(container);
    });
  });
};

interface RenderShadowBaseOptions {
  layer: srm.ShapePath | srm.Image | srm.ShapePartial;
  shadowStyles: {color: number, alpha: number};
  shadowSpread: number;
  shadowGraphic: PIXI.Graphics;
}

const renderShadowBase = ({ layer, shadowStyles, shadowSpread, shadowGraphic }: RenderShadowBaseOptions): Promise<PIXI.Graphics> => {
  return new Promise((resolve, reject) => {
    const layerFills = layer.type === 'ShapePartial' ? (layer as srm.ShapePartial).shape.style.fills : layer.style.fills;
    const layerBorders = layer.type === 'ShapePartial' ? (layer as srm.ShapePartial).shape.style.borders : layer.style.borders
    const activeFills = layerFills.some(fill => fill.enabled);
    const activeBorders = layerBorders.some(border => border.enabled);
    const borderSize = getCompiledBorderThickness(layerBorders);
    if (activeFills || !activeBorders || layer.type === 'Image') {
      shadowGraphic.beginFill(shadowStyles.color, 1);
      shadowGraphic.lineStyle(borderSize / 2 + shadowSpread, shadowStyles.color, 1, 1);
    } else {
      shadowGraphic.beginFill(shadowStyles.color, 0.001);
      shadowGraphic.lineStyle(borderSize + shadowSpread, shadowStyles.color);
    }
    renderLayerShape({
      layer: layer,
      graphic: shadowGraphic
    })
    .then(() => {
      shadowGraphic.endFill();
    })
    .finally(() => {
      resolve(shadowGraphic);
    });
  });
};

interface RenderShadowBlurOptions {
  shadowBlur: number;
  shadowGraphic: PIXI.Graphics;
}

export const renderShadowBlur = ({ shadowBlur, shadowGraphic }: RenderShadowBlurOptions): Promise<PIXI.Graphics> => {
  return new Promise((resolve, reject) => {
    if (shadowBlur > 0) {
      const blurFilter =  new PIXI.filters.BlurFilter();
      blurFilter.blur = shadowBlur;
      blurFilter.quality = 10;
      blurFilter.autoFit = true;
      shadowGraphic.filters = shadowGraphic.filters ? [...shadowGraphic.filters, blurFilter] : [blurFilter];
    }
    resolve(shadowGraphic);
  });
};

interface RenderShadowsOptions {
  layer: srm.ShapePath | srm.Image | srm.ShapePartial;
  shadows: srm.Shadow[];
  container: PIXI.Container;
}

const renderShadows = ({ layer, shadows, container }: RenderShadowsOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    if (shadows.length > 0 && shadows.some(shadow => shadow.enabled)) {
      let shadowsContainer = new PIXI.Container();
      shadowsContainer.name = 'shadows';
      const promises: Promise<PIXI.Container>[] = [];
      shadows.forEach((shadow: srm.Shadow, shadowIndex: number) => {
        if (shadow.enabled) {
          promises.push(renderShadow({
            layer: layer,
            shadow: shadow,
            shadowIndex: shadowIndex,
            container: shadowsContainer
          }));
        }
      });
      Promise.all(promises).then(() => {
        container.addChild(shadowsContainer);
        resolve(container);
      });
    } else {
      resolve(container);
    }
  });
};

export default renderShadows;