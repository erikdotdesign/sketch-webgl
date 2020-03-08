// @ts-ignore
import sketch from 'sketch/dom';
// @ts-ignore
import ui from 'sketch/ui';
// @ts-ignore
import BrowserWindow from 'sketch-module-web-view';
// @ts-ignore
import { getWebview } from 'sketch-module-web-view/remote';

import getStore from '../resources/store';

const appWindowIdentifier = 'srm.appWindow';
const loadingWindowIdentifier = 'srm.loadingWindow';

export default (context: any) => {
  // close any existing windows
  const existingAppWindow = getWebview(appWindowIdentifier);
  const existingLoadingWindow = getWebview(loadingWindowIdentifier);
  if (existingAppWindow) {
    existingAppWindow.close();
  } else if (existingLoadingWindow) {
    existingLoadingWindow.close();
  }
  // get sketch document
  const document: srm.Document = sketch.getSelectedDocument();
  // get sketch selected page
  const page: srm.Page = document.selectedPage;
  // get sketch selected layers
  const selectedLayers: srm.Selection = document.selectedLayers;
  // get sketch selected artboard
  const selectedArtboard: srm.Artboard | undefined = selectedLayers.layers.find((layer: srm.PageLayer) => {
    return layer.type === 'Artboard' && layer.selected;
  }) as srm.Artboard | undefined;
  // if artboard selected, run command
  if (selectedArtboard) {
    var start = new Date().getTime();
    // set base store
    let store: srm.AppStore | null = null;
    // set theme
    const theme: srm.Theme = ui.getTheme();
    // set loading modal window
    const loadingWindow = new BrowserWindow({
      identifier: loadingWindowIdentifier,
      parent: document,
      modal: true,
      show: false
    });
    // set app window
    const appWindow = new BrowserWindow({
      identifier: appWindowIdentifier,
      width: 1200,
      height: 900,
      fullscreenable: false,
      show: false
    });
    // set loading window contents
    const loadingWebContents = loadingWindow.webContents;
    // set app window contents
    const appWebContents = appWindow.webContents;
    // load loading.html in loading modal
    loadingWindow.loadURL(require(`../resources/ui/loading.html`));
    // display loading modal when loaded
    loadingWebContents.on('did-finish-load', () => {
      // before showing loading window, set window styles based on theme
      loadingWebContents.executeJavaScript(
        `setLoadingColor('${theme}')`
      )
      // after setting styles, show window and load app
      .then(() => {
        loadingWindow.show();
        appWindow.loadURL(require('../resources/ui/index.html'));
      });
    });
    // wait till app index finished loading
    appWebContents.on('did-finish-load', () => {
      // get store when index loads
      getStore({
        page: page,
        artboard: selectedArtboard,
        sketch: sketch
      })
      // set plugin store && update loading text
      .then((appStore) => {
        store = appStore;
        return loadingWebContents.executeJavaScript(
          `setLoadingText('Rendering', 'Building spec')`
        );
      })
      // maximize app window size && render app
      .then(() => {
        appWindow.maximize();
        appWindow.center();
        return appWebContents.executeJavaScript(
          `renderApp(
            ${JSON.stringify((store as srm.AppStore).artboard)},
            ${JSON.stringify((store as srm.AppStore).images)},
            ${JSON.stringify(theme)}
          )`
        );
      })
      // close loading window && open app window
      .finally(() => {
        var end = new Date().getTime();
        var time = end - start;
        console.log(time / 1000);
        loadingWindow.close();
        appWindow.show();
      });
    });
    // if app failed to load,
    // close windows and display alert
    appWebContents.on('did-fail-load', () => {
      loadingWindow.close();
      appWindow.close();
      ui.alert('Error', 'Spec failed to load.');
    });
  } else {
    // if artboard not selected, alert user
    ui.alert('Invalid Selection', 'Select an artboard to export.');
  }
}

export const onShutdown = () => {
  const existingAppWindow = getWebview(appWindowIdentifier);
  const existingLoadingWindow = getWebview(loadingWindowIdentifier);
  if (existingAppWindow) {
    existingAppWindow.close();
  } else if (existingLoadingWindow) {
    existingLoadingWindow.close();
  }
}