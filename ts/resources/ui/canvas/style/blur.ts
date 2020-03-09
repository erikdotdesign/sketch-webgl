import * as PIXI from 'pixi.js';
import { ZoomBlurFilter } from 'pixi-filters';

interface RenderBlurOptions {
  layer: srm.ShapePath | srm.Shape | srm.Image | srm.Group;
  blur: srm.Blur;
  container: PIXI.Container
}

const renderBlur = ({ layer, blur, container }: RenderBlurOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    if (blur.enabled) {
      switch(blur.blurType) {
        case 'Gaussian':
          const gaussianBlur =  new PIXI.filters.BlurFilter();
          gaussianBlur.blur = blur.radius;
          gaussianBlur.quality = 10;
          container.filters = [gaussianBlur];
          break;
        case 'Zoom':
          const zoomBlur =  new ZoomBlurFilter();
          zoomBlur.strength = blur.radius / 100;
          zoomBlur.center = [blur.center.x * layer.frame.width, blur.center.y * layer.frame.height];
          container.filters = [zoomBlur];
          break;
        default:
          break;
      }
    }
    resolve(container);
  });
};

export default renderBlur;