import getArtboard from './artboard';
import getAssets from './assets';

interface GetStoreOptions {
  page: srm.Page;
  artboard: srm.Artboard;
  sketch: srm.Sketch;
}

const getStore = ({ page, artboard, sketch }: GetStoreOptions): Promise<srm.AppStore> => {
  return new Promise((resolve, reject) => {
    // create new page for clean asset generation
    const srmPage = new sketch.Page({
      name: `srm.page`,
      parent: page.parent
    });
    // duplicate selected artboard and set on new page
    const srmArtboard = artboard.duplicate();
    srmArtboard.parent = srmPage;
    srmArtboard.frame.x = 0;
    srmArtboard.frame.y = 0;
    srmArtboard.background.includedInExport = true;
    console.log('Processing Artboard');
    getArtboard({
      artboard: srmArtboard,
      sketch: sketch,
      page: page
    })
    .then(() => {
      console.log('Processing Assets');
      return getAssets({
        page: srmPage,
        artboard: srmArtboard,
        sketch: sketch
      });
    })
    .then(images => {
      console.log('Assets Created');
      // remove page
      srmPage.remove();
      // select original page
      page.selected = true;
      // return final store
      resolve({
        artboard: srmArtboard,
        images: images
      });
    });
  });
};

export default getStore;