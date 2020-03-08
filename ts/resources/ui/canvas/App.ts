import * as PIXI from 'pixi.js';
import chroma from 'chroma-js';

interface RenderAppOptions {
  theme: any;
  ruleSize: number;
}

let startGestureZoom = 0;
let gestureZoom = 1;
let gestureZoomX = 0;
let gestureZoomY = 0;

const renderApp = ({ theme, ruleSize }: RenderAppOptions): Promise<PIXI.Application> => {
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
    app.view.addEventListener('mousewheel', (ev: any) => {
      //const page = app.stage.getChildByName('page') as PIXI.Container;
      const rules = app.stage.getChildByName('rules') as PIXI.Container;
      const ruleTop = rules.getChildByName('rule-top');
      const ruleLeft = rules.getChildByName('rule-left');
      ruleTop.emit('scroll', ev);
      ruleLeft.emit('scroll', ev);
      app.stage.emit('scroll', ev);
    });
    app.view.addEventListener('gesturestart', (ev: any) => {
      app.stage.emit('gesturestart', ev);
    });
    app.view.addEventListener('gesturechange', (ev: any) => {
      app.stage.emit('gesturechange', ev);
    });
    app.view.addEventListener('gestureend', (ev: any) => {
      app.stage.emit('gestureend', ev);
    });
    app.view.addEventListener('Zoom', (ev: any) => {
      //const page = app.stage.getChildByName('page') as PIXI.Container;
      const rules = app.stage.getChildByName('rules') as PIXI.Container;
      const ruleTop = rules.getChildByName('rule-top');
      const ruleLeft = rules.getChildByName('rule-left');
      //rules.emit('Zoom', ev);
      ruleTop.emit('Zoom', ev);
      ruleLeft.emit('Zoom', ev);
    });
    app.view.addEventListener('InitialZoom', (ev: any) => {
      app.stage.emit('InitialZoom', ev);
    });
    app.view.addEventListener('ZoomCenter', (ev: any) => {
      //const page = app.stage.getChildByName('page') as PIXI.Container;
      const rules = app.stage.getChildByName('rules') as PIXI.Container;
      const ruleTop = rules.getChildByName('rule-top');
      const ruleLeft = rules.getChildByName('rule-left');
      ruleTop.emit('ZoomCenter', ev);
      ruleLeft.emit('ZoomCenter', ev);
    });
    app.stage.on('InitialZoom', (e: CustomEvent) => {
      //const page = app.stage.getChildByName('page') as PIXI.Container;
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
      gestureZoomX = canvas.position.x;
      gestureZoomY = canvas.position.y;
      const gestureZoomCenter = new CustomEvent('ZoomCenter', {
        bubbles: true,
        detail: {x: gestureZoomX, y: gestureZoomY}
      });
      const zoom = new CustomEvent('Zoom', {
        bubbles: true,
        detail: {
          zoom: gestureZoom
        }
      });
      app.view.dispatchEvent(zoom);
      app.view.dispatchEvent(gestureZoomCenter);
    });
    app.stage.on('scroll', (e: any) => {
      //const page = app.stage.getChildByName('page') as PIXI.Container;
      const canvas = app.stage.getChildByName('canvas') as PIXI.Container;
      canvas.position.x += e.wheelDeltaX;
      canvas.position.y += e.wheelDeltaY;
      scrollX = canvas.position.x;
      scrollY = canvas.position.y;
    });
    app.stage.on('gesturestart', (e: any) => {
      startGestureZoom = gestureZoom;
    });
    app.stage.on('gesturechange', (e: any) => {
      //const page = app.stage.getChildByName('page') as PIXI.Container;
      const canvas = app.stage.getChildByName('canvas') as PIXI.Container;
      const ratio = 1 - startGestureZoom * e.scale / gestureZoom;
      canvas.position.x += (e.clientX - canvas.position.x) * ratio;
      canvas.position.y += (e.clientY - canvas.position.y) * ratio;
      canvas.scale.x = startGestureZoom * e.scale;
      canvas.scale.y = startGestureZoom * e.scale;
      gestureZoom = startGestureZoom * e.scale;
      gestureZoomX = canvas.position.x;
      gestureZoomY = canvas.position.y;
      const gestureZoomCenter = new CustomEvent('ZoomCenter', {
        bubbles: true,
        detail: {x: gestureZoomX, y: gestureZoomY}
      });
      const zoom = new CustomEvent('Zoom', {
        bubbles: true,
        detail: {
          zoom: gestureZoom
        }
      });
      app.view.dispatchEvent(zoom);
      app.view.dispatchEvent(gestureZoomCenter);
      // dispatch({
      //   type: 'set-zoom',
      //   zoom: startGestureZoom * e.scale
      // });
    });
    resolve(app);
  });
};

export default renderApp;