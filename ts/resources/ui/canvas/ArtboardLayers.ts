import * as PIXI from 'pixi.js';
import renderLayers from './Layers';

interface RenderArtboardLayersOptions {
  sketchArtboard: srm.Artboard;
  resources: PIXI.LoaderResource[];
  container: PIXI.Container;
}

const renderArtboardLayers = ({ sketchArtboard, resources, container }: RenderArtboardLayersOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    const artboardLayers = new PIXI.Container();
    artboardLayers.name = `artboard-${sketchArtboard.id}-layers`;
    const artboardLayersMask = new PIXI.Graphics();
    artboardLayersMask.name = `artboard-${sketchArtboard.id}-layers-mask`;
    renderLayers({
      layers: sketchArtboard.layers as srm.RelevantLayer[],
      resources: resources,
      container: artboardLayers
    })
    .then(() => {
      artboardLayersMask.beginFill(0x000000);
      artboardLayersMask.drawRect(0,0,sketchArtboard.frame.width, sketchArtboard.frame.height);
      artboardLayersMask.endFill();
      artboardLayers.addChild(artboardLayersMask);
      artboardLayers.mask = artboardLayersMask;
      container.addChild(artboardLayers);
    })
    .finally(() => {
      resolve(container);
    });
  });
};

export default renderArtboardLayers;