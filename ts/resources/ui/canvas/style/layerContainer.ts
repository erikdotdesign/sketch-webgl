import * as PIXI from 'pixi.js';

interface SetLayerContainerOptions {
  layer: srm.ShapePath | srm.Shape | srm.Image | srm.Group | srm.Text;
  container: PIXI.Container;
}

const setLayerContainer = ({ layer, container }: SetLayerContainerOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    const { frame } = layer;
    container.width = frame.width;
    container.height = frame.height;
    container.position.x = frame.x + frame.width / 2;
    container.position.y = frame.y + frame.height / 2;
    container.pivot.x = frame.width / 2;
    container.pivot.y = frame.height / 2;
    resolve(container);
  });
};

export default setLayerContainer;