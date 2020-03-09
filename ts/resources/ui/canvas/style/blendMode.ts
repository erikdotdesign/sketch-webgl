import * as PIXI from 'pixi.js';

interface RenderBlendModeOptions {
  blendMode: srm.BlendingMode;
  container: PIXI.Container;
}

const renderBlendMode = ({ blendMode, container }: RenderBlendModeOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    if (blendMode === 'Multiply') {
      // webgl renderer only supports multiply currently
      const colorMatrix = new PIXI.filters.ColorMatrixFilter();
      colorMatrix.blendMode = PIXI.BLEND_MODES.MULTIPLY;
      container.filters = container.filters ? [...container.filters, colorMatrix] : [colorMatrix];
    }
    resolve(container);
  });
};

export default renderBlendMode;