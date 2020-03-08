import * as PIXI from 'pixi.js';

interface RenderCanvasOptions {
  app: PIXI.Application;
}

const renderCanvas = ({ app }: RenderCanvasOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    const canvas = new PIXI.Container();
    canvas.name = 'canvas';
    canvas.width = app.screen.width;
    canvas.height = app.screen.height;
    const background = new PIXI.Graphics();
    background.name = 'canvas-background';
    background.beginFill(0x000000, 0.001);
    background.drawRect(0, 0, app.screen.width, app.screen.height);
    background.endFill();
    canvas.addChild(background);
    app.stage.addChild(canvas);
    resolve(canvas);
  });
};

export default renderCanvas;