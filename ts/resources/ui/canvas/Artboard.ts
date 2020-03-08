import * as PIXI from 'pixi.js';
import { colorToFill } from './utils';

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
    const canvasBackground = new PIXI.Graphics();
    canvasBackground.name = `artboard-${sketchArtboard.id}-canvas`;
    canvasBackground.beginFill(0xFFFFFF);
    canvasBackground.drawRect(0, 0, sketchArtboard.frame.width, sketchArtboard.frame.height);
    canvasBackground.endFill();
    artboard.addChild(canvasBackground);
    if (sketchArtboard.background.enabled) {
      const artboardBackground = new PIXI.Graphics();
      artboardBackground.name = `artboard-${sketchArtboard.id}-background`;
      const fill = colorToFill(sketchArtboard.background.color);
      artboardBackground.beginFill(fill.color, fill.alpha);
      artboardBackground.drawRect(0, 0, sketchArtboard.frame.width, sketchArtboard.frame.height);
      artboardBackground.endFill();
      artboard.addChild(artboardBackground);
    }
    canvas.addChild(artboard);
    resolve(artboard);
  });
};

export default renderArtboard;