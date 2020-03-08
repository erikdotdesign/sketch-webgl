import * as PIXI from 'pixi.js';
import renderShapePath from './ShapePath';
import renderGroup from './Group';
import renderShape from './Shape';
import renderImage from './Image';

interface RenderLayerOptions {
  layer: srm.RelevantLayer;
  resources: PIXI.LoaderResource[];
  groupShadows?: srm.GroupShadows[] | undefined;
}

const renderLayer = ({ layer, resources, groupShadows }: RenderLayerOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    switch(layer.type) {
      case 'ShapePath':
        console.log('Rendering ShapePath');
        renderShapePath({
          layer: layer as srm.ShapePath,
          resources: resources,
          groupShadows: groupShadows
        })
        .then((shapePathContainer) => {
          console.log('ShapePath Rendered');
          resolve(shapePathContainer);
        });
        break;
      case 'Shape':
        console.log('Rendering Shape');
        renderShape({
          layer: layer as srm.Shape,
          resources: resources,
          groupShadows: groupShadows
        })
        .then((shapeContainer) => {
          console.log('Shape Rendered');
          resolve(shapeContainer);
        });
        break;
      case 'Image':
        console.log('Rendering Image');
        renderImage({
          layer: layer as srm.Image,
          resources: resources,
          groupShadows: groupShadows
        })
        .then((imageContainer) => {
          console.log('Image Rendered');
          resolve(imageContainer);
        });
        break;
      case 'Group':
        console.log('Rendering Group');
        renderGroup({
          layer: layer as srm.Group,
          resources: resources,
          groupShadows: groupShadows
        })
        .then((groupContainer) => {
          console.log('Group Rendered');
          resolve(groupContainer);
        });
        break;
      default:
        console.error('unknown layer type');
        break;
    }
  });
};

export default renderLayer;

// interface RenderLayerOptions {
//   layer: srm.RelevantLayer;
//   resources: PIXI.LoaderResource[];
//   groupShadows?: srm.GroupShadows[] | undefined;
// }

// const renderLayer = ({ layer, resources, groupShadows }: RenderLayerOptions): Promise<PIXI.Container> => {
//   return new Promise((resolve, reject) => {
//     let interactiveContainer: PIXI.Container;
//     renderInteractiveLayer({
//       layer: layer,
//     })
//     .then((interactiveLayerContainer) => {
//       interactiveContainer = interactiveLayerContainer;
//       switch(layer.type) {
//         case 'ShapePath':
//           console.log('Rendering ShapePath');
//           renderShapePath({
//             layer: layer as srm.ShapePath,
//             resources: resources,
//             container: interactiveContainer,
//             groupShadows: groupShadows
//           })
//           .then((interactiveContainer) => {
//             console.log('ShapePath Rendered');
//             resolve(interactiveContainer);
//           });
//           break;
//         case 'Shape':
//           console.log('Rendering Shape');
//           renderShape({
//             layer: layer as srm.Shape,
//             resources: resources,
//             container: interactiveContainer,
//             groupShadows: groupShadows
//           })
//           .then((interactiveContainer) => {
//             console.log('Shape Rendered');
//             resolve(interactiveContainer);
//           });
//           break;
//         case 'Image':
//           console.log('Rendering Image');
//           renderImage({
//             layer: layer as srm.Image,
//             resources: resources,
//             container: interactiveContainer,
//             groupShadows: groupShadows
//           })
//           .then((interactiveContainer) => {
//             console.log('Image Rendered');
//             resolve(interactiveContainer);
//           });
//           break;
//         case 'Group':
//           console.log('Rendering Group');
//           renderGroup({
//             layer: layer as srm.Group,
//             resources: resources,
//             container: interactiveContainer,
//             groupShadows: groupShadows
//           })
//           .then((interactiveContainer) => {
//             console.log('Group Rendered');
//             resolve(interactiveContainer);
//           });
//           break;
//         default:
//           console.error('unknown layer type');
//           break;
//       }
//     })
//   });
// };