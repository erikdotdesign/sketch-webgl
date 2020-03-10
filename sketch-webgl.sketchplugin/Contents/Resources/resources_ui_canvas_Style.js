/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./resources/ui/canvas/Style.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/ui/canvas/Style.js":
/*!**************************************!*\
  !*** ./resources/ui/canvas/Style.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // import * as PIXI from 'pixi.js';
// import chroma from 'chroma-js';
// import { ZoomBlurFilter } from 'pixi-filters';
// import { colorToFill, borderPositionToAlignment, getAbsPoint, getCompiledBorderThickness, getBlendMode } from './utils';
// interface RenderShapePathPointOptions {
//   currentPoint: srm.CurvePoint;
//   nextPoint: srm.CurvePoint;
//   graphic: PIXI.Graphics;
// }
// export const renderShapePathPoint = ({ currentPoint, nextPoint, graphic }: RenderShapePathPointOptions) => {
//   if (currentPoint.pointType === 'Straight') {
//     if (nextPoint.pointType === 'Straight') {
//       graphic.lineTo(nextPoint.point.x, nextPoint.point.y);
//     } else {
//       graphic.quadraticCurveTo(nextPoint.curveTo.x, nextPoint.curveTo.y, nextPoint.point.x, nextPoint.point.y);
//     }
//   } else {
//     if (nextPoint.pointType === 'Straight') {
//       graphic.quadraticCurveTo(currentPoint.curveFrom.x, currentPoint.curveFrom.y, nextPoint.point.x, nextPoint.point.y);
//     } else {
//       graphic.bezierCurveTo(currentPoint.curveFrom.x, currentPoint.curveFrom.y, nextPoint.curveTo.x, nextPoint.curveTo.y, nextPoint.point.x, nextPoint.point.y);
//     }
//   }
// }
// interface RenderShapePathShapeOptions {
//   layer: srm.ShapePath | srm.ShapePartialHole;
//   graphic: PIXI.Graphics;
//   move?: {x: number, y: number};
// }
// export const renderShapePathShape = ({ layer, graphic, move }: RenderShapePathShapeOptions): Promise<PIXI.Graphics> => {
//   return new Promise((resolve, reject) => {
//     const { frame, points, closed } = layer;
//     points.forEach((curvePoint: srm.CurvePoint, index: number) => {
//       const currentPoint = getAbsPoint(curvePoint, frame, move);
//       const onFirstPoint = index === 0;
//       const onLastPoint = index === points.length - 1;
//       if (onFirstPoint) {
//         graphic.moveTo(currentPoint.point.x, currentPoint.point.y);
//       }
//       if (!onLastPoint) {
//         const nextPoint = getAbsPoint(points[index + 1], frame, move);
//         renderShapePathPoint({
//           currentPoint: currentPoint,
//           nextPoint: nextPoint,
//           graphic: graphic
//         });
//       }
//       if (onLastPoint && closed) {
//         const firstPoint = getAbsPoint(points[0], frame, move);
//         renderShapePathPoint({
//           currentPoint: currentPoint,
//           nextPoint: firstPoint,
//           graphic: graphic
//         });
//         graphic.closePath();
//       }
//     });
//     resolve(graphic);
//   });
// }
// interface RenderShapePartialHolesOptions {
//   layer: srm.ShapePartial;
//   graphic: PIXI.Graphics;
// }
// export const renderShapePartialHoles = ({ layer, graphic }: RenderShapePartialHolesOptions) => {
//   return new Promise((resolve, reject) => {
//     const { holes } = layer;
//     if (holes.length > 0) {
//       const promises: Promise<any>[] = [];
//       holes.forEach((hole: srm.ShapePath) => {
//         promises.push(renderShapePathShape({
//           graphic: graphic,
//           layer: hole,
//           move: {
//             x: hole.frame.x - layer.frame.x,
//             y: hole.frame.y - layer.frame.y
//           }
//         }));
//       });
//       Promise.all(promises).then(() => {
//         resolve();
//       });
//     } else {
//       resolve();
//     }
//   });
// };
// interface RenderShapePartialShapeOptions {
//   layer: srm.ShapePartial;
//   graphic: PIXI.Graphics;
//   move?: {x: number, y: number};
// }
// export const renderShapePartialShape = ({ layer, graphic, move }: RenderShapePartialShapeOptions): Promise<PIXI.Graphics> => {
//   return new Promise((resolve, reject) => {
//     renderShapePathShape({
//       graphic: graphic,
//       layer: layer,
//       move: move
//     })
//     .then(() => {
//       graphic.beginHole();
//       return renderShapePartialHoles({
//         layer: layer,
//         graphic: graphic
//       });
//     })
//     .then(() => {
//       graphic.endHole();
//       resolve(graphic);
//     });
//   });
// }
// interface DrawLayerShapeOptions {
//   layer: srm.ShapePath | srm.Image | srm.ShapePartial | srm.ShapePartialHole | srm.Shape | srm.Group | srm.Text;
//   graphic: PIXI.Graphics;
//   move?: {x: number, y: number};
// }
// export const drawLayerShape = ({ layer, graphic, move }: DrawLayerShapeOptions): Promise<PIXI.Graphics> => {
//   return new Promise((resolve, reject) => {
//     switch(layer.type) {
//       case 'ShapePath':
//       case 'ShapePartialHole':
//         renderShapePathShape({
//           graphic: graphic,
//           layer: layer as srm.ShapePath | srm.ShapePartialHole,
//           move: move
//         })
//         .then(() => {
//           resolve(graphic);
//         });
//         break;
//       case 'ShapePartial':
//         renderShapePartialShape({
//           graphic: graphic,
//           layer: layer as srm.ShapePartial,
//           move: move
//         })
//         .then(() => {
//           resolve(graphic);
//         });
//         break;
//       case 'Image':
//       case 'Shape':
//       case 'Group':
//       case 'Text':
//         graphic.drawRect(0, 0, layer.frame.width, layer.frame.height);
//         resolve(graphic);
//         break;
//     }
//   });
// }
// interface RenderBorderColorOptions {
//   layer: srm.ShapePath | srm.Image | srm.ShapePartial;
//   border: srm.Border;
//   borderIndex: number;
//   container: PIXI.Container;
// }
// export const renderBorderColor = ({ layer, border, borderIndex, container }: RenderBorderColorOptions): Promise<PIXI.Container> => {
//   return new Promise((resolve, reject) => {
//     const { color, thickness, position } = border;
//     const borderColor = new PIXI.Graphics();
//     borderColor.name = `border-${borderIndex}`;
//     const borderStyles = colorToFill(color);
//     const translatedAlignment = borderPositionToAlignment(position);
//     // hole borders wont render unless there is a fill
//     borderColor.beginFill(0x000000, 0.001);
//     borderColor.lineStyle(thickness, borderStyles.color, 1, translatedAlignment);
//     drawLayerShape({
//       graphic: borderColor,
//       layer: layer as srm.ShapePartial
//     })
//     .then(() => {
//       borderColor.endFill();
//       return renderOpacity({
//         opacity: borderStyles.alpha,
//         container: borderColor
//       });
//     })
//     .then(() => {
//       container.addChild(borderColor);
//     })
//     .finally(() => {
//       resolve(container);
//     });
//   });
// };
// interface RenderBorderGradientOptions {
//   layer: srm.ShapePath | srm.Image | srm.ShapePartial;
//   border: srm.Border;
//   borderIndex: number;
//   resources: PIXI.LoaderResource[];
//   container: PIXI.Container;
// }
// export const renderBorderGradient = ({ layer, border, borderIndex, resources, container }: RenderBorderGradientOptions): Promise<PIXI.Container> => {
//   return new Promise((resolve, reject) => {
//     const borderGradient = new PIXI.Graphics();
//     borderGradient.name = `border-${borderIndex}`;
//     let gradientTexture;
//     if (layer.type === 'ShapePartial') {
//       const baseTexture = new PIXI.BaseTexture(resources[`[border-${borderIndex}]${(layer as srm.ShapePartial).shape.id}` as any].url);
//       const frame = new PIXI.Rectangle(layer.frame.x - layer.frame.width, layer.frame.y - layer.frame.height, layer.frame.width, layer.frame.height);
//       gradientTexture = new PIXI.Texture(baseTexture, frame);
//     } else {
//       gradientTexture = PIXI.Texture.from(resources[`[border-${borderIndex}]${layer.id}` as any].url);
//     }
//     // hole borders wont render unless there is a fill
//     borderGradient.beginFill(0x000000, 0.001);
//     borderGradient.lineTextureStyle({
//       width: border.thickness,
//       texture: gradientTexture,
//       alignment: borderPositionToAlignment(border.position)
//     });
//     drawLayerShape({
//       graphic: borderGradient,
//       layer: layer as srm.ShapePath | srm.Image
//     })
//     .then((borderGradient) => {
//       borderGradient.endFill();
//       container.addChild(borderGradient);
//     })
//     .finally(() => {
//       resolve(borderGradient);
//     });
//   });
// };
// interface RenderBorderOptions {
//   layer: srm.ShapePath | srm.Image | srm.ShapePartial;
//   border: srm.Border;
//   borderIndex: number;
//   resources: PIXI.LoaderResource[];
//   container: PIXI.Container;
// }
// const renderBorder = ({ layer, border, borderIndex, resources, container }: RenderBorderOptions): Promise<PIXI.Container> => {
//   return new Promise((resolve, reject) => {
//     switch(border.fillType) {
//       case 'Color':
//         renderBorderColor({
//           layer: layer as srm.ShapePath | srm.Image | srm.ShapePartial,
//           border: border,
//           borderIndex: borderIndex,
//           container: container
//         })
//         .then((container) => {
//           resolve(container);
//         });
//         break;
//       case 'Gradient':
//         renderBorderGradient({
//           layer: layer as srm.ShapePath | srm.Image | srm.ShapePartial,
//           border: border,
//           borderIndex: borderIndex,
//           resources: resources,
//           container: container
//         })
//         .then((container) => {
//           resolve(container);
//         });
//         break;
//     }
//   });
// }
// interface RenderBordersOptions {
//   layer: srm.ShapePath | srm.Image | srm.ShapePartial;
//   borders: srm.Border[];
//   resources: PIXI.LoaderResource[];
//   container: PIXI.Container;
// }
// export const renderBorders = ({ layer, borders, resources, container }: RenderBordersOptions): Promise<PIXI.Container> => {
//   return new Promise((resolve, reject) => {
//     if (borders.length > 0 && borders.some(border => border.enabled)) {
//       let bordersContainer = new PIXI.Container();
//       bordersContainer.name = 'borders';
//       let promises: Promise<PIXI.Container>[] = [];
//       borders.forEach((border: srm.Border, borderIndex: number) => {
//         if (border.enabled) {
//           promises.push(renderBorder({
//             layer: layer,
//             border: border,
//             borderIndex: borderIndex,
//             resources: resources,
//             container: bordersContainer
//           }));
//         }
//       });
//       Promise.all(promises).then(() => {
//         container.addChild(bordersContainer);
//         resolve(container);
//       });
//     } else {
//       resolve(container);
//     }
//   });
// };
// interface RenderFillColorOptions {
//   layer: srm.ShapePath | srm.Image | srm.ShapePartial | srm.Text;
//   fill: srm.Fill;
//   fillIndex: number;
//   container: PIXI.Container;
// }
// export const renderFillColor = ({ layer, fill, fillIndex, container }: RenderFillColorOptions): Promise<PIXI.Container> => {
//   return new Promise((resolve, reject) => {
//     const fillColor = new PIXI.Graphics();
//     fillColor.name = `fill-${fillIndex}`;
//     const fillStyles = colorToFill(fill.color);
//     fillColor.beginFill(fillStyles.color, fillStyles.alpha);
//     drawLayerShape({
//       layer: layer,
//       graphic: fillColor
//     })
//     .then((fillColor) => {
//       fillColor.endFill();
//       container.addChild(fillColor);
//       resolve(container);
//     });
//   });
// };
// interface RenderFillImageOptions {
//   layer: srm.ShapePath | srm.Image | srm.ShapePartial | srm.Text;
//   fillIndex: number;
//   resources: PIXI.LoaderResource[];
//   container: PIXI.Container;
// }
// export const renderFillImage = ({ layer, fillIndex, resources, container }: RenderFillImageOptions): Promise<PIXI.Container> => {
//   return new Promise((resolve, reject) => {
//     const fillImage = new PIXI.Graphics();
//     fillImage.name = `fill-${fillIndex}`;
//     let fillTexture;
//     if (layer.type === 'ShapePartial') {
//       const baseTexture = new PIXI.BaseTexture(resources[`[fill-${fillIndex}]${(layer as srm.ShapePartial).shape.id}` as any].url);
//       const frame = new PIXI.Rectangle(layer.frame.x, layer.frame.y, layer.frame.width, layer.frame.height);
//       fillTexture = new PIXI.Texture(baseTexture, frame);
//     } else {
//       fillTexture = PIXI.Texture.from(resources[`[fill-${fillIndex}]${layer.id}` as any].url);
//     }
//     fillImage.beginTextureFill({texture: fillTexture});
//     drawLayerShape({
//       layer: layer,
//       graphic: fillImage
//     })
//     .then((fillImage) => {
//       fillImage.endFill();
//       container.addChild(fillImage);
//       resolve(container);
//     });
//   });
// };
// interface RenderFillOptions {
//   layer: srm.ShapePath | srm.Image | srm.ShapePartial | srm.Text;
//   fill: srm.Fill;
//   fillIndex: number;
//   resources: PIXI.LoaderResource[];
//   container: PIXI.Container;
// }
// const renderFill = ({ layer, fill, fillIndex, resources, container }: RenderFillOptions): Promise<PIXI.Container> => {
//   return new Promise((resolve, reject) => {
//     switch(fill.fillType) {
//       case 'Color':
//         renderFillColor({
//           layer: layer,
//           fill: fill,
//           fillIndex: fillIndex,
//           container: container
//         })
//         .then(() => {
//           resolve(container);
//         });
//         break;
//       case 'Pattern':
//       case 'Gradient':
//         renderFillImage({
//           layer: layer,
//           fillIndex: fillIndex,
//           resources: resources,
//           container: container
//         })
//         .then(() => {
//           resolve(container);
//         });
//         break;
//     }
//   });
// }
// interface RenderFillsOptions {
//   layer: srm.ShapePath | srm.Image | srm.ShapePartial | srm.Text;
//   fills: srm.Fill[];
//   resources: PIXI.LoaderResource[];
//   container: PIXI.Container;
// }
// export const renderFills = ({ layer, fills, resources, container }: RenderFillsOptions): Promise<PIXI.Container> => {
//   return new Promise((resolve, reject) => {
//     if (fills.length > 0 && fills.some(fill => fill.enabled)) {
//       let fillsContainer = new PIXI.Container();
//       fillsContainer.name = 'fills';
//       let promises: Promise<PIXI.Container>[] = [];
//       fills.forEach((fill: srm.Fill, fillIndex: number) => {
//         if (fill.enabled) {
//           promises.push(renderFill({
//             layer: layer,
//             fill: fill,
//             fillIndex: fillIndex,
//             resources: resources,
//             container: fillsContainer
//           }));
//         }
//       });
//       Promise.all(promises).then(() => {
//         container.addChild(fillsContainer);
//         resolve(container);
//       });
//     } else {
//       resolve(container);
//     }
//   });
// };
// interface RenderTransformsOptions {
//   layer: srm.ShapePath | srm.Shape | srm.Image | srm.Group;
//   transform: srm.Transform;
//   container: PIXI.Container;
// }
// export const renderTransforms = ({ layer, transform, container }: RenderTransformsOptions): Promise<PIXI.Container> => {
//   return new Promise((resolve, reject) => {
//     const hFlip = transform.flippedHorizontally ? -1 : 1;
//     const vFlip = transform.flippedVertically ? -1 : 1;
//     container.scale.x = hFlip;
//     container.scale.y = vFlip;
//     container.rotation = (transform.rotation * (Math.PI/180)) * hFlip * vFlip;
//     resolve(container);
//   });
// };
// interface SetBaseLayerContainerOptions {
//   layer: srm.ShapePath | srm.Shape | srm.Image | srm.Group | srm.Text;
//   container: PIXI.Container;
// }
// export const setBaseLayerContainer = ({ layer, container }: SetBaseLayerContainerOptions): Promise<PIXI.Container> => {
//   return new Promise((resolve, reject) => {
//     const { frame } = layer;
//     container.width = frame.width;
//     container.height = frame.height;
//     container.position.x = frame.x + frame.width / 2;
//     container.position.y = frame.y + frame.height / 2;
//     container.pivot.x = frame.width / 2;
//     container.pivot.y = frame.height / 2;
//     resolve(container);
//   });
// };
// interface RenderBlurOptions {
//   layer: srm.ShapePath | srm.Shape | srm.Image | srm.Group;
//   blur: srm.Blur;
//   container: PIXI.Container
// }
// export const renderBlur = ({ layer, blur, container }: RenderBlurOptions): Promise<PIXI.Container> => {
//   return new Promise((resolve, reject) => {
//     if (blur.enabled) {
//       switch(blur.blurType) {
//         case 'Gaussian':
//           const gaussianBlur =  new PIXI.filters.BlurFilter();
//           gaussianBlur.blur = blur.radius;
//           gaussianBlur.quality = 10;
//           container.filters = [gaussianBlur];
//           break;
//         case 'Zoom':
//           const zoomBlur =  new ZoomBlurFilter();
//           zoomBlur.strength = blur.radius / 100;
//           zoomBlur.center = [blur.center.x * layer.frame.width, blur.center.y * layer.frame.height];
//           container.filters = [zoomBlur];
//           break;
//         default:
//           break;
//       }
//     }
//     resolve(container);
//   });
// };
// interface RenderGroupsShadowsOptions {
//   layer: srm.ShapePath | srm.Image | srm.ShapePartial;
//   groupShadows?: srm.GroupShadows[] | undefined;
//   container: PIXI.Container;
// }
// export const renderGroupsShadows = ({ layer, groupShadows, container }: RenderGroupsShadowsOptions): Promise<PIXI.Container> => {
//   return new Promise((resolve, reject) => {
//     if (groupShadows) {
//       const groupsShadowsContainer = new PIXI.Container();
//       groupsShadowsContainer.name = 'group-shadows';
//       const promises: Promise<PIXI.Container>[] = [];
//       groupShadows.forEach((groupShadow) => {
//         promises.push(renderGroupShadows({
//           layer: layer,
//           groupShadows: groupShadow,
//           container: groupsShadowsContainer
//         }));
//       })
//       Promise.all(promises).then(() => {
//         container.addChild(groupsShadowsContainer);
//         resolve(container);
//       });
//     } else {
//       resolve(container);
//     }
//   });
// };
// interface RenderGroupShadowsOptions {
//   layer: srm.ShapePath | srm.Image | srm.ShapePartial;
//   groupShadows: srm.GroupShadows;
//   container: PIXI.Container;
// }
// export const renderGroupShadows = ({ layer, groupShadows, container }: RenderGroupShadowsOptions): Promise<PIXI.Container> => {
//   return new Promise((resolve, reject) => {
//     const promises: Promise<PIXI.Container>[] = [];
//     const groupShadowsContainer = new PIXI.Container();
//     groupShadowsContainer.name = groupShadows.id;
//     groupShadows.shadows.forEach((shadow: srm.Shadow, shadowIndex: number) => {
//       if (shadow.enabled) {
//         promises.push(renderShadow({
//           layer: layer,
//           shadow: shadow,
//           shadowIndex: shadowIndex,
//           container: groupShadowsContainer
//         }));
//       }
//     });
//     Promise.all(promises).then(() => {
//       container.addChild(groupShadowsContainer);
//       resolve(container);
//     });
//   });
// };
// interface RenderShadowsOptions {
//   layer: srm.ShapePath | srm.Image | srm.ShapePartial;
//   shadows: srm.Shadow[];
//   container: PIXI.Container;
// }
// export const renderShadows = ({ layer, shadows, container }: RenderShadowsOptions): Promise<PIXI.Container> => {
//   return new Promise((resolve, reject) => {
//     if (shadows.length > 0 && shadows.some(shadow => shadow.enabled)) {
//       let shadowsContainer = new PIXI.Container();
//       shadowsContainer.name = 'shadows';
//       const promises: Promise<PIXI.Container>[] = [];
//       shadows.forEach((shadow: srm.Shadow, shadowIndex: number) => {
//         if (shadow.enabled) {
//           promises.push(renderShadow({
//             layer: layer,
//             shadow: shadow,
//             shadowIndex: shadowIndex,
//             container: shadowsContainer
//           }));
//         }
//       });
//       Promise.all(promises).then(() => {
//         container.addChild(shadowsContainer);
//         resolve(container);
//       });
//     } else {
//       resolve(container);
//     }
//   });
// };
// interface RenderShadowOptions {
//   layer: srm.ShapePath | srm.Image | srm.ShapePartial;
//   shadow: srm.Shadow;
//   shadowIndex: number;
//   container: PIXI.Container;
// }
// export const renderShadow = ({ layer, shadow, shadowIndex, container }: RenderShadowOptions): Promise<PIXI.Container> => {
//   return new Promise((resolve, reject) => {
//     const shadowStyles = colorToFill(shadow.color);
//     const shadowGraphic = new PIXI.Graphics();
//     shadowGraphic.name = `shadow-${shadowIndex}`;
//     shadowGraphic.position.x = shadow.x;
//     shadowGraphic.position.y = shadow.y;
//     renderOpacity({
//       opacity: shadowStyles.alpha,
//       container: shadowGraphic
//     })
//     .then(() => {
//       return renderShadowBase({
//         layer: layer,
//         shadowStyles: shadowStyles,
//         shadowSpread: shadow.spread,
//         shadowGraphic: shadowGraphic
//       });
//     })
//     .then(() => {
//       return renderShadowBlur({
//         shadowBlur: shadow.blur,
//         shadowGraphic: shadowGraphic
//       });
//     })
//     .then(() => {
//       container.addChild(shadowGraphic);
//     })
//     .finally(() => {
//       resolve(container);
//     });
//   });
// };
// interface RenderShadowBaseOptions {
//   layer: srm.ShapePath | srm.Image | srm.ShapePartial;
//   shadowStyles: {color: number, alpha: number};
//   shadowSpread: number;
//   shadowGraphic: PIXI.Graphics;
// }
// export const renderShadowBase = ({ layer, shadowStyles, shadowSpread, shadowGraphic }: RenderShadowBaseOptions): Promise<PIXI.Graphics> => {
//   return new Promise((resolve, reject) => {
//     const layerFills = layer.type === 'ShapePartial' ? (layer as srm.ShapePartial).shape.style.fills : layer.style.fills;
//     const layerBorders = layer.type === 'ShapePartial' ? (layer as srm.ShapePartial).shape.style.borders : layer.style.borders
//     const activeFills = layerFills.some(fill => fill.enabled);
//     const activeBorders = layerBorders.some(border => border.enabled);
//     const borderSize = getCompiledBorderThickness(layerBorders);
//     if (activeFills || !activeBorders || layer.type === 'Image') {
//       shadowGraphic.beginFill(shadowStyles.color, 1);
//       shadowGraphic.lineStyle(borderSize / 2 + shadowSpread, shadowStyles.color, 1, 1);
//     } else {
//       shadowGraphic.beginFill(shadowStyles.color, 0.001);
//       shadowGraphic.lineStyle(borderSize + shadowSpread, shadowStyles.color);
//     }
//     drawLayerShape({
//       layer: layer,
//       graphic: shadowGraphic
//     })
//     .then(() => {
//       shadowGraphic.endFill();
//     })
//     .finally(() => {
//       resolve(shadowGraphic);
//     });
//   });
// };
// interface RenderShadowBlurOptions {
//   shadowBlur: number;
//   shadowGraphic: PIXI.Graphics;
// }
// export const renderShadowBlur = ({ shadowBlur, shadowGraphic }: RenderShadowBlurOptions): Promise<PIXI.Graphics> => {
//   return new Promise((resolve, reject) => {
//     if (shadowBlur > 0) {
//       const blurFilter =  new PIXI.filters.BlurFilter();
//       blurFilter.blur = shadowBlur;
//       blurFilter.quality = 10;
//       blurFilter.autoFit = true;
//       shadowGraphic.filters = shadowGraphic.filters ? [...shadowGraphic.filters, blurFilter] : [blurFilter];
//     }
//     resolve(shadowGraphic);
//   });
// };
// interface RenderInnerShadowsOptions {
//   layer: srm.ShapePath | srm.Image | srm.ShapePartial;
//   innerShadows: srm.Shadow[];
//   container: PIXI.Container;
// }
// export const renderInnerShadows = ({ layer, innerShadows, container }: RenderInnerShadowsOptions): Promise<PIXI.Container> => {
//   return new Promise((resolve, reject) => {
//     if (innerShadows.length > 0 && innerShadows.some(innerShadow => innerShadow.enabled)) {
//       const innerShadowsContainer = new PIXI.Container();
//       innerShadowsContainer.name = 'inner-shadows';
//       const maskedContainer = new PIXI.Container();
//       maskedContainer.name = 'masked-inner-shadows';
//       const maskGraphic = new PIXI.Graphics();
//       maskGraphic.name = 'inner-shadows-mask';
//       renderMaskedInnerShadows({
//         layer: layer,
//         innerShadows: innerShadows,
//         maskedContainer: maskedContainer,
//         container: innerShadowsContainer
//       })
//       .then(() => {
//         return renderInnerShadowsMask({
//           layer: layer,
//           maskGraphic: maskGraphic,
//           container: innerShadowsContainer
//         });
//       })
//       .then(() => {
//         maskedContainer.mask = maskGraphic;
//         container.addChild(innerShadowsContainer);
//       })
//       .finally(() => {
//         resolve(container);
//       });
//     } else {
//       resolve(container);
//     }
//   });
// };
// interface RenderMaskedInnerShadowsOptions {
//   layer: srm.ShapePath | srm.Image | srm.ShapePartial;
//   innerShadows: srm.Shadow[];
//   maskedContainer: PIXI.Container;
//   container: PIXI.Container;
// }
// export const renderMaskedInnerShadows = ({ layer, innerShadows, maskedContainer, container }: RenderMaskedInnerShadowsOptions): Promise<PIXI.Container> => {
//   return new Promise((resolve, reject) => {
//     const promises: Promise<PIXI.Container>[] = [];
//     innerShadows.forEach((innerShadow: srm.Shadow, innerShadowIndex: number) => {
//       if (innerShadow.enabled) {
//         promises.push(renderInnerShadow({
//           layer: layer,
//           innerShadow: innerShadow,
//           innerShadowIndex: innerShadowIndex,
//           container: maskedContainer
//         }));
//       }
//     });
//     Promise.all(promises).then(() => {
//       container.addChild(maskedContainer);
//       resolve(container);
//     });
//   });
// };
// interface RenderInnerShadowsMaskOptions {
//   layer: srm.ShapePath | srm.Image | srm.ShapePartial;
//   maskGraphic: PIXI.Graphics;
//   container: PIXI.Container;
// }
// export const renderInnerShadowsMask = ({ layer, maskGraphic, container }: RenderInnerShadowsMaskOptions): Promise<PIXI.Container> => {
//   return new Promise((resolve, reject) => {
//     maskGraphic.beginFill(0x000000);
//     drawLayerShape({
//       layer: layer,
//       graphic: maskGraphic
//     })
//     .then(() => {
//       maskGraphic.endFill();
//       container.addChild(maskGraphic);
//     })
//     .finally(() => {
//       resolve(container);
//     });
//   });
// };
// interface RenderInnerShadowOptions {
//   layer: srm.ShapePath | srm.Image | srm.ShapePartial;
//   innerShadow: srm.Shadow;
//   innerShadowIndex: number;
//   container: PIXI.Container;
// }
// export const renderInnerShadow = ({ layer, innerShadow, innerShadowIndex, container }: RenderInnerShadowOptions): Promise<PIXI.Container> => {
//   return new Promise((resolve, reject) => {
//     const innerShadowStyles = colorToFill(innerShadow.color);
//     const innerShadowGraphic = new PIXI.Graphics();
//     innerShadowGraphic.name = `inner-shadow-${innerShadowIndex}`;
//     innerShadowGraphic.position.x = innerShadow.x;
//     innerShadowGraphic.position.y = innerShadow.y;
//     renderOpacity({
//       opacity: innerShadowStyles.alpha,
//       container: innerShadowGraphic
//     })
//     .then(() => {
//       return renderInnerShadowBase({
//         layer: layer,
//         innerShadow: innerShadow,
//         innerShadowGraphic: innerShadowGraphic,
//         innerShadowStyles: innerShadowStyles
//       });
//     })
//     .then(() => {
//       return renderInnerShadowSpread({
//         layer: layer,
//         innerShadow: innerShadow,
//         innerShadowGraphic: innerShadowGraphic,
//         innerShadowStyles: innerShadowStyles
//       });
//     })
//     .then(() => {
//       return renderInnerShadowHoles({
//         layer: layer,
//         innerShadow: innerShadow,
//         innerShadowGraphic: innerShadowGraphic,
//         innerShadowStyles: innerShadowStyles
//       });
//     })
//     .then(() => {
//       return renderShadowBlur({
//         shadowBlur: innerShadow.blur,
//         shadowGraphic: innerShadowGraphic
//       });
//     })
//     .then(() => {
//       container.addChild(innerShadowGraphic);
//     })
//     .finally(() => {
//       resolve(container);
//     });
//   });
// };
// interface RenderInnerShadowBaseOptions {
//   layer: srm.ShapePath | srm.Image | srm.ShapePartial;
//   innerShadow: srm.Shadow;
//   innerShadowGraphic: PIXI.Graphics;
//   innerShadowStyles: {color: number, alpha: number};
// }
// export const renderInnerShadowBase = ({ layer, innerShadow, innerShadowStyles, innerShadowGraphic }: RenderInnerShadowBaseOptions): Promise<PIXI.Graphics> => {
//   return new Promise((resolve, reject) => {
//     const maxSize = innerShadow.y + innerShadow.x + 3;
//     innerShadowGraphic.lineStyle(maxSize, innerShadowStyles.color, 1, 1);
//     drawLayerShape({
//       layer: layer,
//       graphic: innerShadowGraphic
//     })
//     .finally(() => {
//       resolve(innerShadowGraphic);
//     });
//   });
// };
// interface RenderInnerShadowSpreadOptions {
//   layer: srm.ShapePath | srm.Image | srm.ShapePartial;
//   innerShadow: srm.Shadow;
//   innerShadowGraphic: PIXI.Graphics;
//   innerShadowStyles: {color: number, alpha: number};
// }
// export const renderInnerShadowSpread = ({ layer, innerShadow, innerShadowStyles, innerShadowGraphic }: RenderInnerShadowSpreadOptions): Promise<PIXI.Graphics> => {
//   return new Promise((resolve, reject) => {
//     if (innerShadow.spread > 0) {
//       innerShadowGraphic.lineStyle(innerShadow.spread, innerShadowStyles.color, 1, 0);
//       drawLayerShape({
//         layer: layer,
//         graphic: innerShadowGraphic
//       })
//       .finally(() => {
//         resolve(innerShadowGraphic);
//       });
//     } else {
//       resolve(innerShadowGraphic);
//     }
//   });
// };
// interface RenderInnerShadowHolesOptions {
//   layer: srm.ShapePath | srm.Image | srm.ShapePartial;
//   innerShadow: srm.Shadow;
//   innerShadowGraphic: PIXI.Graphics;
//   innerShadowStyles: {color: number, alpha: number};
// }
// export const renderInnerShadowHoles = ({ layer, innerShadow, innerShadowStyles, innerShadowGraphic }: RenderInnerShadowHolesOptions): Promise<PIXI.Graphics> => {
//   return new Promise((resolve, reject) => {
//     if (layer.type === 'ShapePartial' && (layer as srm.ShapePartial).holes.length > 0) {
//       const promises: Promise<PIXI.Graphics>[] = [];
//       innerShadowGraphic.beginFill(innerShadowStyles.color);
//       // pixi is bugged, this should be linestyle alignment 1
//       innerShadowGraphic.lineStyle(innerShadow.spread, innerShadowStyles.color, 1, 0);
//       (layer as srm.ShapePartial).holes.forEach((hole: srm.ShapePartialHole) => {
//         promises.push(drawLayerShape({
//           layer: hole,
//           graphic: innerShadowGraphic,
//           move: {x: hole.frame.x - hole.shapePath.frame.x, y: hole.frame.y - hole.shapePath.frame.y}
//         }));
//       });
//       Promise.all(promises).then(() => {
//         innerShadowGraphic.endFill();
//         resolve(innerShadowGraphic);
//       });
//     } else {
//       resolve(innerShadowGraphic);
//     }
//   });
// };
// interface RenderOpacityOptions {
//   opacity: number;
//   container: PIXI.Container | PIXI.Graphics;
// }
// export const renderOpacity = ({ opacity, container }: RenderOpacityOptions): Promise<PIXI.Container | PIXI.Graphics> => {
//   return new Promise((resolve, reject) => {
//     if (opacity < 1) {
//       const alphaFilter = new PIXI.filters.AlphaFilter(opacity);
//       container.filters = container.filters ? [...container.filters, alphaFilter] : [alphaFilter];
//     }
//     resolve(container);
//   });
// };
// interface RenderBlendModeOptions {
//   blendMode: srm.BlendingMode;
//   container: PIXI.Container;
// }
// export const renderBlendMode = ({ blendMode, container }: RenderBlendModeOptions): Promise<PIXI.Container> => {
//   return new Promise((resolve, reject) => {
//     if (blendMode === 'Multiply') {
//       // webgl renderer only supports multiply currently
//       const colorMatrix = new PIXI.filters.ColorMatrixFilter();
//       colorMatrix.blendMode = PIXI.BLEND_MODES.MULTIPLY;
//       container.filters = container.filters ? [...container.filters, colorMatrix] : [colorMatrix];
//     }
//     resolve(container);
//   });
// };

/***/ })

/******/ });
//# sourceMappingURL=resources_ui_canvas_Style.js.map