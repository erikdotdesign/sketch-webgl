import * as PIXI from 'pixi.js';
import renderApp from './App';
import loadResources from './Resources';
import renderRules from './Rules';
import renderCanvas from './Canvas';
import renderArtboard from './Artboard';
import renderArtboardLayers from './ArtboardLayers';

interface RenderPixiCanvasOptions {
  sketchArtboard: srm.Artboard;
  base64Images: srm.base64Image[],
  theme: any;
  dispatch: any;
}

const getInitialZoom = ({ app }: {app: PIXI.Application}): any => {
  return new Promise((resolve, reject) => {
    const maxWidth: number = Math.min(app.screen.width, app.stage.width);
    const maxHeight: number = Math.min(app.screen.height, app.stage.height);
    const maxRatio: number = maxWidth / maxHeight;
    const stageRatio: number = app.stage.width / app.stage.height;
    // dims of artboard scaled to fit in viewport
    if (maxRatio > stageRatio) {
      // height is the constraining dimension
      resolve(maxHeight / app.stage.height);
    } else {
      // width is the constraining dimension
      resolve(maxWidth / app.stage.width);
    }
  })
};

const renderPixiCanvas = ({sketchArtboard, base64Images, theme, dispatch}: RenderPixiCanvasOptions): Promise<PIXI.Application> => {
  return new Promise((resolve, reject) => {
    let ruleSize: number = 28;
    let app: PIXI.Application;
    let resources: PIXI.LoaderResource[];
    let canvas: PIXI.Container;
    let artboard: PIXI.Container;
    let rules: PIXI.Container;
    console.log('rendering app');
    // render app
    renderApp({
      theme: theme,
      ruleSize: ruleSize
    })
    // load resources
    .then((appContainer) => {
      console.log('loading resources');
      app = appContainer;
      return loadResources({
        app: app,
        images: base64Images
      });
    })
    // render canvas
    .then((appResources) => {
      console.log('rendering canvas');
      resources = appResources;
      return renderCanvas({
        app: app,
        ruleSize: ruleSize
      });
    })
    // render artboard
    .then((canvasContainer) => {
      console.log('rendering artboard');
      canvas = canvasContainer;
      return renderArtboard({
        canvas: canvas,
        sketchArtboard: sketchArtboard
      });
    })
    // render artboard layers
    .then(artboardContainer => {
      console.log('rendering layers');
      artboard = artboardContainer;
      return renderArtboardLayers({
        sketchArtboard: sketchArtboard,
        resources: resources,
        container: artboard
      });
    })
    // render rules
    .then(() => {
      console.log('rendering rules');
      return renderRules({
        app: app,
        artboard: sketchArtboard,
        theme: theme,
        ruleSize: ruleSize
      });
    })
    // get initial zoom
    .then((rulesContainer) => {
      console.log('setting initial zoom');
      rules = rulesContainer;
      return getInitialZoom({
        app: app
      });
    })
    // set initial zoom
    .then((initialZoom) => {
      const initialZoomEvent = new CustomEvent('InitialZoom', {
        bubbles: true,
        detail: {
          initialZoom: initialZoom
        }
      });
      app.view.dispatchEvent(initialZoomEvent);
    })
    // return app
    .finally(() => {
      console.log('canvas built');
      resolve(app);
    });
  });
}

export default renderPixiCanvas;