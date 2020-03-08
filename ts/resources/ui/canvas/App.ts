import * as PIXI from 'pixi.js';
import chroma from 'chroma-js';

interface RenderAppOptions {
  theme: any;
}

let startGestureZoom = 0;
let gestureZoom = 1;

const renderApp = ({ theme }: RenderAppOptions): Promise<PIXI.Application> => {
  return new Promise((resolve, reject) => {
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: chroma(theme.background.z0).num(),
      transparent: true,
      resizeTo: window,
      antialias: true,
      resolution: window.devicePixelRatio || 1
    });
    app.view.addEventListener('mousewheel', (e: any) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const canvas = app.stage.getChildByName('canvas') as PIXI.Container;
        const nextZoom = gestureZoom - e.deltaY * 0.01;
        const ratio = 1 - nextZoom / gestureZoom;
        if (e.deltaY < 0 && nextZoom < 5) {
          gestureZoom -= e.deltaY * 0.01;
          canvas.position.x += (e.clientX - canvas.position.x) * ratio;
          canvas.position.y += (e.clientY - canvas.position.y) * ratio;
          canvas.scale.x = gestureZoom;
          canvas.scale.y = gestureZoom;
        } else if (e.deltaY > 0 && nextZoom > 0) {
          gestureZoom -= e.deltaY * 0.01;
          canvas.position.x += (e.clientX - canvas.position.x) * ratio;
          canvas.position.y += (e.clientY - canvas.position.y) * ratio;
          canvas.scale.x = gestureZoom;
          canvas.scale.y = gestureZoom;
        }
      } else {
        app.stage.emit('scroll', e);
      }
    });
    app.view.addEventListener('gesturestart', (e: any) => {
      app.stage.emit('gesturestart', e);
    });
    app.view.addEventListener('gesturechange', (e: any) => {
      app.stage.emit('gesturechange', e);
    });
    app.view.addEventListener('gestureend', (e: any) => {
      app.stage.emit('gestureend', e);
    });
    app.view.addEventListener('InitialZoom', (e: any) => {
      app.stage.emit('InitialZoom', e);
    });
    app.stage.on('InitialZoom', (e: CustomEvent) => {
      const canvas = app.stage.getChildByName('canvas') as PIXI.Container;
      const appWidth = app.screen.width;
      const appHeight = app.screen.height;
      const canvasWidth = app.screen.width * e.detail.initialZoom;
      const canvasHeight = app.screen.height * e.detail.initialZoom;
      canvas.position.x = (appWidth - canvasWidth) / 2;
      canvas.position.y = (appHeight - canvasHeight) / 2;
      canvas.scale.x = e.detail.initialZoom;
      canvas.scale.y = e.detail.initialZoom;
      gestureZoom = e.detail.initialZoom;
    });
    app.stage.on('scroll', (e: any) => {
      const canvas = app.stage.getChildByName('canvas') as PIXI.Container;
      canvas.position.x += e.wheelDeltaX;
      canvas.position.y += e.wheelDeltaY;
    });
    app.stage.on('gesturestart', (e: any) => {
      startGestureZoom = gestureZoom;
    });
    app.stage.on('gesturechange', (e: any) => {
      const canvas = app.stage.getChildByName('canvas') as PIXI.Container;
      const ratio = 1 - startGestureZoom * e.scale / gestureZoom;
      canvas.position.x += (e.clientX - canvas.position.x) * ratio;
      canvas.position.y += (e.clientY - canvas.position.y) * ratio;
      canvas.scale.x = startGestureZoom * e.scale;
      canvas.scale.y = startGestureZoom * e.scale;
      gestureZoom = startGestureZoom * e.scale;
    });
    resolve(app);
  });
};

export default renderApp;