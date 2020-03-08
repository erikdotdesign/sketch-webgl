import * as PIXI from 'pixi.js';
import { colorToFill } from './utils';

interface RenderArtboardCanvasOptions {
  container: PIXI.Container;
  sketchArtboard: srm.Artboard;
}

const renderArtboardCanvas = ({container, sketchArtboard}: RenderArtboardCanvasOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    const artboardCanvas = new PIXI.Graphics();
    artboardCanvas.name = 'artboard-canvas';
    artboardCanvas.beginFill(0xFFFFFF);
    artboardCanvas.drawRect(0, 0, sketchArtboard.frame.width, sketchArtboard.frame.height);
    artboardCanvas.endFill();
    container.addChild(artboardCanvas);
    resolve(container);
  });
};

interface RenderArtboardBackgroundOptions {
  container: PIXI.Container;
  sketchArtboard: srm.Artboard;
}

const renderArtboardBackground = ({container, sketchArtboard}: RenderArtboardBackgroundOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    if (sketchArtboard.background.enabled) {
      const artboardBackground = new PIXI.Graphics();
      artboardBackground.name = 'artboard-background';
      const fill = colorToFill(sketchArtboard.background.color);
      artboardBackground.beginFill(fill.color, fill.alpha);
      artboardBackground.drawRect(0, 0, sketchArtboard.frame.width, sketchArtboard.frame.height);
      artboardBackground.endFill();
      container.addChild(artboardBackground);
    }
    resolve(container);
  });
};

interface RenderArtboardOptions {
  canvas: PIXI.Container;
  sketchArtboard: srm.Artboard;
}

const renderArtboard = ({canvas, sketchArtboard}: RenderArtboardOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    const artboard = new PIXI.Container();
    artboard.name = `artboard-${sketchArtboard.id}`;
    artboard.width = sketchArtboard.frame.width;
    artboard.height = sketchArtboard.frame.height;
    artboard.position.x = (canvas.width / 2) - (sketchArtboard.frame.width / 2);
    artboard.position.y = (canvas.height / 2) - (sketchArtboard.frame.height / 2);
    renderArtboardCanvas({
      container: artboard,
      sketchArtboard: sketchArtboard
    })
    .then(() => {
      return renderArtboardBackground({
        container: artboard,
        sketchArtboard: sketchArtboard
      });
    })
    .then(() => {
      canvas.addChild(artboard);
    })
    .finally(() => {
      resolve(artboard);
    });
  });
};

export default renderArtboard;