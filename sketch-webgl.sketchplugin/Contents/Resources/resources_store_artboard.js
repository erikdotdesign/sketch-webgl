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
/******/ 	return __webpack_require__(__webpack_require__.s = "./resources/store/artboard.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/store/artboard.js":
/*!*************************************!*\
  !*** ./resources/store/artboard.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var processMask = function processMask(_ref) {
  var layer = _ref.layer,
      sketch = _ref.sketch;
  return new Promise(function (resolve, reject) {
    if (layer && layer.sketchObject.hasClippingMask()) {
      var maskIndex = layer.index;
      var maskParent = layer.parent;
      layer.sketchObject.setHasClippingMask(false); // create new group to mimic mask behavior

      var maskGroup = new sketch.Group({
        name: 'srm.mask',
        frame: layer.frame,
        layers: [layer.duplicate()]
      }); // splice in mask group, splice out old mask

      maskParent.layers.splice(maskIndex, 1, maskGroup); // loop through mask parent layers,
      // any layer with an index higher than the mask will be masked
      // push masked layers to maskGroup

      maskGroup.parent.layers.forEach(function (maskedLayer, index) {
        if (index > maskIndex) {
          maskedLayer.frame.x = maskedLayer.frame.x - maskGroup.frame.x;
          maskedLayer.frame.y = maskedLayer.frame.y - maskGroup.frame.y;
          maskGroup.layers.push(maskedLayer);
        }
      });
      resolve(maskGroup);
    } else {
      resolve(layer);
    }
  });
};

var isPathClockwise = function isPathClockwise(points) {
  var end = points.length - 1;
  var sum = points[end].point.x * points[0].point.y - points[0].point.x * points[end].point.y;

  for (var i = 0; i < end; i++) {
    var n = i + 1;
    sum += points[i].point.x * points[n].point.y - points[n].point.x * points[i].point.y;
  }

  return sum > 0;
};

var flattenShapePath = function flattenShapePath(_ref2) {
  var layer = _ref2.layer,
      sketch = _ref2.sketch;
  return new Promise(function (resolve, reject) {
    // due to the way PIXI draws lines
    // the path must be clockwise to render correctly
    var isClockwise = isPathClockwise(layer.points);

    if (!isClockwise) {
      layer.sketchObject.reversePath();
    }

    var duplicate = layer.duplicate();
    duplicate.transform.rotation = 0;
    duplicate.transform.flippedHorizontally = false;
    duplicate.transform.flippedVertically = false;
    var svgPath = duplicate.getSVGPath();
    var flatPath = sketch.ShapePath.fromSVGPath(svgPath);
    layer.points = flatPath.points;
    duplicate.remove();
    resolve(layer);
  });
};

var processShapePathBorderOptions = function processShapePathBorderOptions(_ref3) {
  var layer = _ref3.layer;
  return new Promise(function (resolve, reject) {
    var parent = layer.parent,
        index = layer.index,
        style = layer.style;
    var borderOptions = style.borderOptions;

    if (borderOptions.dashPattern.length > 0 || borderOptions.startArrowhead !== 'None' || borderOptions.endArrowhead !== 'None') {
      layer.sketchObject.layersByConvertingToOutlines();
      var outlines = parent.layers[index];
      outlines.name = "[srm.with-border-options]".concat(layer.name);
      outlines.sketchObject.simplify();
      resolve(outlines);
    } else {
      resolve(layer);
    }
  });
};

var processShapePath = function processShapePath(_ref4) {
  var layer = _ref4.layer,
      sketch = _ref4.sketch;
  return new Promise(function (resolve, reject) {
    if (layer && layer.type === 'ShapePath') {
      flattenShapePath({
        layer: layer,
        sketch: sketch
      }).then(function (layerS1) {
        return processShapePathBorderOptions({
          layer: layerS1
        });
      }).then(function (layerS2) {
        resolve(layerS2);
      });
    } else {
      resolve(layer);
    }
  });
};

var processShapeBase = function processShapeBase(_ref5) {
  var layer = _ref5.layer;
  return new Promise(function (resolve, reject) {
    var style = layer.style,
        parent = layer.parent,
        index = layer.index;

    if (layer.sketchObject.canFlatten()) {
      layer.sketchObject.flatten();
      resolve(parent.layers[index]);
    } else {
      if (layer.layers.length === 1) {
        layer.sketchObject.ungroup();
        var ungrouped = parent.layers[index];
        ungrouped.style = style;
        resolve(ungrouped);
      } else {
        resolve(layer);
      }
    }
  });
};

var processShape = function processShape(_ref6) {
  var layer = _ref6.layer,
      sketch = _ref6.sketch;
  return new Promise(function (resolve, reject) {
    if (layer && layer.type === 'Shape') {
      processShapeBase({
        layer: layer
      }) // .then((layerS1) => {
      //   if (layerS1.type === 'Shape') {
      //     return processShapeLayers({
      //       layer: layerS1 as srm.Shape,
      //       sketch: sketch
      //     });
      //   } else {
      //     resolve(layerS1);
      //   }
      // })
      .then(function (layerS2) {
        resolve(layerS2);
      });
    } else {
      resolve(layer);
    }
  });
};

var processRelevant = function processRelevant(_ref7) {
  var layer = _ref7.layer;
  return new Promise(function (resolve, reject) {
    switch (layer.type) {
      case 'Group':
      case 'Shape':
      case 'Image':
      case 'ShapePath':
      case 'Text':
      case 'SymbolInstance':
        resolve(layer);
        break;

      case 'HotSpot':
      case 'Slice':
        layer.remove();
        resolve(null);
        break;
    }
  });
};

var processHidden = function processHidden(_ref8) {
  var layer = _ref8.layer;
  return new Promise(function (resolve, reject) {
    var isHidden = layer && layer.hidden;

    if (isHidden) {
      layer.remove();
      resolve(null);
    } else {
      resolve(layer);
    }
  });
};

var processSymbol = function processSymbol(_ref9) {
  var layer = _ref9.layer;
  return new Promise(function (resolve, reject) {
    if (layer && layer.type === 'SymbolInstance') {
      resolve(layer.detach({
        recursively: true
      }));
    } else {
      resolve(layer);
    }
  });
};

var processText = function processText(_ref10) {
  var layer = _ref10.layer,
      sketch = _ref10.sketch;
  return new Promise(function (resolve, reject) {
    if (layer && layer.type === 'Text') {
      if (layer.text.trim().length === 0) {
        layer.remove();
        resolve(null);
      } else {
        var layerIndex = layer.index;
        var parent = layer.parent;
        layer.sketchObject.layersByConvertingToOutlines();
        var outlines = parent.layers[layerIndex];
        outlines.name = "[srm.text]".concat(layer.name); // because sketch is bugged

        outlines.sketchObject.simplify(); // because pixi is bugged

        outlines.sketchObject.reversePath();
        resolve(outlines);
      }
    } else {
      resolve(layer);
    }
  });
};

var processLayer = function processLayer(_ref11) {
  var layer = _ref11.layer,
      sketch = _ref11.sketch,
      page = _ref11.page;
  return new Promise(function (resolve, reject) {
    processRelevant({
      layer: layer
    }).then(function (layerS1) {
      return processHidden({
        layer: layerS1
      });
    }).then(function (layerS2) {
      return processSymbol({
        layer: layerS2
      });
    }).then(function (layerS3) {
      return processShape({
        layer: layerS3,
        sketch: sketch
      });
    }).then(function (layerS4) {
      return processShapePath({
        layer: layerS4,
        sketch: sketch
      });
    }).then(function (layerS5) {
      return processMask({
        layer: layerS5,
        sketch: sketch
      });
    }).then(function (layerS6) {
      return processText({
        layer: layerS6,
        sketch: sketch
      });
    }).then(function (layerS7) {
      if (layerS7 && layerS7.type === 'Group') {
        processLayers({
          layers: layerS7.layers,
          sketch: sketch,
          page: page
        }).then(function () {
          resolve();
        });
      } else {
        resolve();
      }
    });
  });
};

var processLayers = function processLayers(_ref12) {
  var layers = _ref12.layers,
      sketch = _ref12.sketch,
      page = _ref12.page;
  var promises = [];
  layers.forEach(function (layer) {
    promises.push(processLayer({
      layer: layer,
      sketch: sketch,
      page: page
    }));
  });
  return Promise.all(promises);
};

var getArtboard = function getArtboard(_ref13) {
  var artboard = _ref13.artboard,
      sketch = _ref13.sketch,
      page = _ref13.page;
  return new Promise(function (resolve, reject) {
    processLayers({
      layers: artboard.layers,
      sketch: sketch,
      page: page
    }).then(function () {
      resolve();
    });
  });
};

/* harmony default export */ __webpack_exports__["default"] = (getArtboard);

/***/ })

/******/ });
//# sourceMappingURL=resources_store_artboard.js.map