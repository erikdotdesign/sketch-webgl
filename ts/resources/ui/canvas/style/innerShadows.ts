import * as PIXI from 'pixi.js';
import { colorToFill } from '../utils';
import renderLayerShape from './layerShape';
import renderOpacity from './opacity';
import { renderShadowBlur } from './shadows';

interface RenderMaskedInnerShadowsOptions {
  layer: srm.ShapePath | srm.Image | srm.ShapePartial;
  innerShadows: srm.Shadow[];
  maskedContainer: PIXI.Container;
  container: PIXI.Container;
}

const renderMaskedInnerShadows = ({ layer, innerShadows, maskedContainer, container }: RenderMaskedInnerShadowsOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    const promises: Promise<PIXI.Container>[] = [];
    innerShadows.forEach((innerShadow: srm.Shadow, innerShadowIndex: number) => {
      if (innerShadow.enabled) {
        promises.push(renderInnerShadow({
          layer: layer,
          innerShadow: innerShadow,
          innerShadowIndex: innerShadowIndex,
          container: maskedContainer
        }));
      }
    });
    Promise.all(promises).then(() => {
      container.addChild(maskedContainer);
      resolve(container);
    });
  });
};

interface RenderInnerShadowsMaskOptions {
  layer: srm.ShapePath | srm.Image | srm.ShapePartial;
  maskGraphic: PIXI.Graphics;
  container: PIXI.Container;
}

const renderInnerShadowsMask = ({ layer, maskGraphic, container }: RenderInnerShadowsMaskOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    maskGraphic.beginFill(0x000000);
    renderLayerShape({
      layer: layer,
      graphic: maskGraphic
    })
    .then(() => {
      maskGraphic.endFill();
      container.addChild(maskGraphic);
    })
    .finally(() => {
      resolve(container);
    });
  });
};

interface RenderInnerShadowOptions {
  layer: srm.ShapePath | srm.Image | srm.ShapePartial;
  innerShadow: srm.Shadow;
  innerShadowIndex: number;
  container: PIXI.Container;
}

const renderInnerShadow = ({ layer, innerShadow, innerShadowIndex, container }: RenderInnerShadowOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    const innerShadowStyles = colorToFill(innerShadow.color);
    const innerShadowGraphic = new PIXI.Graphics();
    innerShadowGraphic.name = `inner-shadow-${innerShadowIndex}`;
    innerShadowGraphic.position.x = innerShadow.x;
    innerShadowGraphic.position.y = innerShadow.y;
    renderOpacity({
      opacity: innerShadowStyles.alpha,
      container: innerShadowGraphic
    })
    .then(() => {
      return renderInnerShadowBase({
        layer: layer,
        innerShadow: innerShadow,
        innerShadowGraphic: innerShadowGraphic,
        innerShadowStyles: innerShadowStyles
      });
    })
    .then(() => {
      return renderInnerShadowSpread({
        layer: layer,
        innerShadow: innerShadow,
        innerShadowGraphic: innerShadowGraphic,
        innerShadowStyles: innerShadowStyles
      });
    })
    .then(() => {
      return renderInnerShadowHoles({
        layer: layer,
        innerShadow: innerShadow,
        innerShadowGraphic: innerShadowGraphic,
        innerShadowStyles: innerShadowStyles
      });
    })
    .then(() => {
      return renderShadowBlur({
        shadowBlur: innerShadow.blur,
        shadowGraphic: innerShadowGraphic
      });
    })
    .then(() => {
      container.addChild(innerShadowGraphic);
    })
    .finally(() => {
      resolve(container);
    });
  });
};

interface RenderInnerShadowBaseOptions {
  layer: srm.ShapePath | srm.Image | srm.ShapePartial;
  innerShadow: srm.Shadow;
  innerShadowGraphic: PIXI.Graphics;
  innerShadowStyles: {color: number, alpha: number};
}

const renderInnerShadowBase = ({ layer, innerShadow, innerShadowStyles, innerShadowGraphic }: RenderInnerShadowBaseOptions): Promise<PIXI.Graphics> => {
  return new Promise((resolve, reject) => {
    const maxSize = innerShadow.y + innerShadow.x + 3;
    innerShadowGraphic.lineStyle(maxSize, innerShadowStyles.color, 1, 1);
    renderLayerShape({
      layer: layer,
      graphic: innerShadowGraphic
    })
    .finally(() => {
      resolve(innerShadowGraphic);
    });
  });
};

interface RenderInnerShadowSpreadOptions {
  layer: srm.ShapePath | srm.Image | srm.ShapePartial;
  innerShadow: srm.Shadow;
  innerShadowGraphic: PIXI.Graphics;
  innerShadowStyles: {color: number, alpha: number};
}

const renderInnerShadowSpread = ({ layer, innerShadow, innerShadowStyles, innerShadowGraphic }: RenderInnerShadowSpreadOptions): Promise<PIXI.Graphics> => {
  return new Promise((resolve, reject) => {
    if (innerShadow.spread > 0) {
      innerShadowGraphic.lineStyle(innerShadow.spread, innerShadowStyles.color, 1, 0);
      renderLayerShape({
        layer: layer,
        graphic: innerShadowGraphic
      })
      .finally(() => {
        resolve(innerShadowGraphic);
      });
    } else {
      resolve(innerShadowGraphic);
    }
  });
};

interface RenderInnerShadowHolesOptions {
  layer: srm.ShapePath | srm.Image | srm.ShapePartial;
  innerShadow: srm.Shadow;
  innerShadowGraphic: PIXI.Graphics;
  innerShadowStyles: {color: number, alpha: number};
}

const renderInnerShadowHoles = ({ layer, innerShadow, innerShadowStyles, innerShadowGraphic }: RenderInnerShadowHolesOptions): Promise<PIXI.Graphics> => {
  return new Promise((resolve, reject) => {
    if (layer.type === 'ShapePartial' && (layer as srm.ShapePartial).holes.length > 0) {
      const promises: Promise<PIXI.Graphics>[] = [];
      innerShadowGraphic.beginFill(innerShadowStyles.color);
      // pixi is bugged, this should be linestyle alignment 1
      innerShadowGraphic.lineStyle(innerShadow.spread, innerShadowStyles.color, 1, 0);
      (layer as srm.ShapePartial).holes.forEach((hole: srm.ShapePartialHole) => {
        promises.push(renderLayerShape({
          layer: hole,
          graphic: innerShadowGraphic,
          move: {x: hole.frame.x - hole.shapePath.frame.x, y: hole.frame.y - hole.shapePath.frame.y}
        }));
      });
      Promise.all(promises).then(() => {
        innerShadowGraphic.endFill();
        resolve(innerShadowGraphic);
      });
    } else {
      resolve(innerShadowGraphic);
    }
  });
};

interface RenderInnerShadowsOptions {
  layer: srm.ShapePath | srm.Image | srm.ShapePartial;
  innerShadows: srm.Shadow[];
  container: PIXI.Container;
}

const renderInnerShadows = ({ layer, innerShadows, container }: RenderInnerShadowsOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    if (innerShadows.length > 0 && innerShadows.some(innerShadow => innerShadow.enabled)) {
      const innerShadowsContainer = new PIXI.Container();
      innerShadowsContainer.name = 'inner-shadows';
      const maskedContainer = new PIXI.Container();
      maskedContainer.name = 'masked-inner-shadows';
      const maskGraphic = new PIXI.Graphics();
      maskGraphic.name = 'inner-shadows-mask';
      renderMaskedInnerShadows({
        layer: layer,
        innerShadows: innerShadows,
        maskedContainer: maskedContainer,
        container: innerShadowsContainer
      })
      .then(() => {
        return renderInnerShadowsMask({
          layer: layer,
          maskGraphic: maskGraphic,
          container: innerShadowsContainer
        });
      })
      .then(() => {
        maskedContainer.mask = maskGraphic;
        container.addChild(innerShadowsContainer);
      })
      .finally(() => {
        resolve(container);
      });
    } else {
      resolve(container);
    }
  });
};

export default renderInnerShadows;