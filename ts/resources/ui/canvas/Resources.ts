interface LoadResourcesOptions {
  app: PIXI.Application;
  images: srm.base64Image[];
}

const loadResources = ({app, images}: LoadResourcesOptions): Promise<any> => {
  return new Promise((resolve, reject) => {
    images.forEach((image: srm.base64Image) => {
      app.loader.add(image.id, image.src);
    });
    app.loader.load((loader, resources) => {
      resolve(resources);
    });
  });
};

export default loadResources;