import * as PIXI from 'pixi.js';

interface RenderOpacityOptions {
  opacity: number;
  container: PIXI.Container | PIXI.Graphics;
}

const renderOpacity = ({ opacity, container }: RenderOpacityOptions): Promise<PIXI.Container | PIXI.Graphics> => {
  return new Promise((resolve, reject) => {
    if (opacity < 1) {
      const alphaFilter = new PIXI.filters.AlphaFilter(opacity);
      container.filters = container.filters ? [...container.filters, alphaFilter] : [alphaFilter];
    }
    resolve(container);
  });
};

export default renderOpacity;