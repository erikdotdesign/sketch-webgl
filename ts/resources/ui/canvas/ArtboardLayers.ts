import * as PIXI from 'pixi.js';
import renderLayers from './Layers';

interface RenderArtboardLayersMaskOptions {
  sketchArtboard: srm.Artboard;
  container: PIXI.Container;
  artboardLayersMask: PIXI.Graphics;
}

const renderArtboardLayersMask = ({ sketchArtboard, artboardLayersMask, container }: RenderArtboardLayersMaskOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    artboardLayersMask.beginFill(0x000000);
    artboardLayersMask.drawRect(0, 0, sketchArtboard.frame.width, sketchArtboard.frame.height);
    artboardLayersMask.endFill();
    container.addChild(artboardLayersMask);
    resolve(container);
  });
};

interface RenderArtboardLayersOptions {
  sketchArtboard: srm.Artboard;
  resources: PIXI.LoaderResource[];
  container: PIXI.Container;
}

const renderArtboardLayers = ({ sketchArtboard, resources, container }: RenderArtboardLayersOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    const artboardLayers = new PIXI.Container();
    artboardLayers.name = 'artboard-layers';
    const artboardLayersMask = new PIXI.Graphics();
    artboardLayersMask.name = 'artboard-layers-mask';
    renderLayers({
      layers: sketchArtboard.layers as srm.RelevantLayer[],
      resources: resources,
      container: artboardLayers
    })
    .then(() => {
      return renderArtboardLayersMask({
        sketchArtboard: sketchArtboard,
        artboardLayersMask: artboardLayersMask,
        container: artboardLayers
      });
    })
    .then(() => {
      artboardLayers.mask = artboardLayersMask;
      container.addChild(artboardLayers);
    })
    .finally(() => {
      resolve(container);
    });
  });
};

export default renderArtboardLayers;