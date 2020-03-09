import * as PIXI from 'pixi.js';
import { colorToFill, getThickestInnerBorder, getThickestOuterBorder } from '../utils';
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
    const layerFills = layer.type === 'ShapePartial' ? (layer as srm.ShapePartial).shape.style.fills : layer.style.fills;
    const layerBorders = layer.type === 'ShapePartial' ? (layer as srm.ShapePartial).shape.style.borders : layer.style.borders;
    const activeFills = layerFills.some(fill => fill.enabled);
    const activeBorders = layerBorders.some(border => border.enabled);
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
      return renderShadowFill({
        layer: layer,
        activeFills: activeFills,
        shadowColor: shadowStyles.color,
        shadowGraphic: shadowGraphic
      });
    })
    .then(() => {
      return renderShadowBorders({
        layer: layer,
        activeBorders: activeBorders,
        activeFills: activeFills,
        borders: layerBorders,
        shadowColor: shadowStyles.color,
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

interface RenderShadowBordersOptions {
  layer: srm.ShapePath | srm.Image | srm.ShapePartial;
  activeFills: boolean;
  activeBorders: boolean;
  borders: srm.Border[];
  shadowColor: number;
  shadowSpread: number;
  shadowGraphic: PIXI.Graphics;
}

const renderShadowBorders = ({ layer, activeFills, activeBorders, borders, shadowColor, shadowSpread, shadowGraphic }: RenderShadowBordersOptions): Promise<PIXI.Graphics> => {
  return new Promise((resolve, reject) => {
    if (activeBorders || shadowSpread > 0) {
      const thickestInnerBorder = getThickestInnerBorder(borders);
      const thickestOuterBorder = getThickestOuterBorder(borders);
      renderShadowBorder({
        layer: layer,
        borderThickness: thickestInnerBorder + (activeFills ? shadowSpread : (shadowSpread / 2)),
        borderPosition: 0,
        shadowColor: shadowColor,
        shadowGraphic: shadowGraphic
      })
      .then(() => {
        return renderShadowBorder({
          layer: layer,
          borderThickness: thickestOuterBorder + (activeFills ? shadowSpread : (shadowSpread / 2)),
          borderPosition: 1,
          shadowColor: shadowColor,
          shadowGraphic: shadowGraphic
        });
      })
      .finally(() => {
        resolve(shadowGraphic);
      });
    } else {
      resolve(shadowGraphic);
    }
  });
};

interface RenderShadowBorderOptions {
  layer: srm.ShapePath | srm.Image | srm.ShapePartial;
  borderThickness: number;
  borderPosition: number;
  shadowColor: number;
  shadowGraphic: PIXI.Graphics;
}

const renderShadowBorder = ({ layer, borderThickness, borderPosition, shadowColor, shadowGraphic }: RenderShadowBorderOptions): Promise<PIXI.Graphics> => {
  return new Promise((resolve, reject) => {
    // PIXI wont render holes unless there is a fill
    shadowGraphic.beginFill(shadowColor, 0.001);
    shadowGraphic.lineStyle(borderThickness, shadowColor, 1, borderPosition);
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

interface RenderShadowFillOptions {
  layer: srm.ShapePath | srm.Image | srm.ShapePartial;
  activeFills: boolean;
  shadowColor: number;
  shadowGraphic: PIXI.Graphics;
}

const renderShadowFill = ({ layer, activeFills, shadowColor, shadowGraphic }: RenderShadowFillOptions): Promise<PIXI.Graphics> => {
  return new Promise((resolve, reject) => {
    if (activeFills) {
      shadowGraphic.beginFill(shadowColor, 1);
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
    } else {
      resolve(shadowGraphic);
    }
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