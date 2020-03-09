import * as PIXI from 'pixi.js';

interface RenderTransformsOptions {
  layer: srm.ShapePath | srm.Shape | srm.Image | srm.Group;
  transform: srm.Transform;
  container: PIXI.Container;
}

const renderTransforms = ({ layer, transform, container }: RenderTransformsOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    const hFlip = transform.flippedHorizontally ? -1 : 1;
    const vFlip = transform.flippedVertically ? -1 : 1;
    container.scale.x = hFlip;
    container.scale.y = vFlip;
    container.rotation = (transform.rotation * (Math.PI/180)) * hFlip * vFlip;
    resolve(container);
  });
};

export default renderTransforms;