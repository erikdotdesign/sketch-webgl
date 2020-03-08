import * as PIXI from 'pixi.js';
import chroma from 'chroma-js';

export const colorToFill = (sketchHex: string) => {
  const color = chroma(sketchHex).num();
  const alpha = chroma(sketchHex).alpha();
  return {color, alpha};
};

export const borderPositionToAlignment = (sketchAlignment: string) => {
  switch(sketchAlignment) {
    case 'Inside':
      return 0;
    case 'Center':
      return 0.5;
    case 'Outside':
      return 1;
  }
};

export const getBlendMode = (blendMode: srm.BlendingMode) => {
  // IMPORTANT - The WebGL renderer only supports the NORMAL, ADD, MULTIPLY and SCREEN blend modes.
  // Anything else will silently act like NORMAL.
  switch(blendMode) {
    case 'Normal':
      return PIXI.BLEND_MODES.NORMAL;
    case 'Darken':
      return PIXI.BLEND_MODES.DARKEN;
    case 'Multiply':
      return PIXI.BLEND_MODES.MULTIPLY;
    case 'ColorBurn':
      return PIXI.BLEND_MODES.COLOR_BURN;
    case 'Lighten':
      return PIXI.BLEND_MODES.LIGHTEN;
    case 'Screen':
      return PIXI.BLEND_MODES.SCREEN;
    case 'ColorDodge':
      return PIXI.BLEND_MODES.COLOR_DODGE;
    case 'Overlay':
      return PIXI.BLEND_MODES.OVERLAY;
    case 'SoftLight':
      return PIXI.BLEND_MODES.OVERLAY;
    case 'HardLight':
      return PIXI.BLEND_MODES.HARD_LIGHT;
    case 'Difference':
      return PIXI.BLEND_MODES.DIFFERENCE;
    case 'Exclusion':
      return PIXI.BLEND_MODES.EXCLUSION;
    case 'Hue':
      return PIXI.BLEND_MODES.HUE;
    case 'Saturation':
      return PIXI.BLEND_MODES.SATURATION;
    case 'Color':
      return PIXI.BLEND_MODES.COLOR;
    case 'Luminosity':
      return PIXI.BLEND_MODES.LUMINOSITY;
  }
};

export const getThickestOuterBorder = (borders: srm.Border[]) => {
  return borders.reduce((total: number, current: srm.Border) => {
    if (current.position !== 'Inside' && current.enabled) {
      switch(current.position) {
        case 'Center':
          return current.thickness / 2 > total ? current.thickness / 2 : total;
        case 'Outside':
          return current.thickness > total ? current.thickness : total;
      }
    } else {
      return total;
    }
  }, 0);
};

export const getThickestInnerBorder = (borders: srm.Border[]) => {
  return borders.reduce((total: number, current: srm.Border) => {
    if (current.position !== 'Outside' && current.enabled) {
      switch(current.position) {
        case 'Center':
          return current.thickness / 2 > total ? current.thickness / 2 : total;
        case 'Inside':
          return current.thickness > total ? current.thickness : total;
      }
    } else {
      return total;
    }
  }, 0);
};

export const getCompiledBorderThickness = (borders: srm.Border[]) => {
  const thickestOuter = getThickestOuterBorder(borders);
  const thickestInner = getThickestInnerBorder(borders);
  return thickestOuter + thickestInner;
};

export const getAbsPoints = (points: srm.CurvePoint[], frame: srm.Rectangle, move: {x: number, y: number} = {x: 0, y: 0}): srm.CurvePoint[] => {
  return points.map((curvePoint: srm.CurvePoint) => {
    curvePoint = getAbsPoint(curvePoint, frame, move);
    return curvePoint;
  });
};

export const getAbsPoint = (point: srm.CurvePoint, frame: srm.Rectangle, move: {x: number, y: number} = {x: 0, y: 0}): srm.CurvePoint => {
  return {
    ...point,
    point: {
      ...point.point,
      x: (point.point.x * frame.width) + move.x,
      y: (point.point.y * frame.height) + move.y
    },
    curveFrom: {
      ...point.curveFrom,
      x: (point.curveFrom.x * frame.width) + move.x,
      y: (point.curveFrom.y * frame.height) + move.y
    },
    curveTo: {
      ...point.curveTo,
      x: (point.curveTo.x * frame.width) + move.x,
      y: (point.curveTo.y * frame.height) + move.y
    }
  }
};

const pointIsInPoly = (point: srm.Point, pts: srm.Point[]) => {
  let x = point.x, y = point.y;
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    let xi = pts[i].x, yi = pts[i].y;
    let xj = pts[j].x, yj = pts[j].y;
    let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) {
      inside = !inside
    };
  }
  return inside;
};

const containsShapePath = (base: srm.ShapePath, shapePath: srm.ShapePath) => {
  const polyPoints = getAbsPoints(base.points, base.frame, {x: base.frame.x, y: base.frame.y}).map((shapePathPoints) => {
    return shapePathPoints.point;
  });
  return shapePath.points.some((point: srm.CurvePoint) => {
    const absPoint = getAbsPoint(point, shapePath.frame, {x: shapePath.frame.x, y: shapePath.frame.y}).point;
    return pointIsInPoly(absPoint, polyPoints);
  });
};

interface GetShapePathHolesOptions {
  shapeId: string;
  shapePath: srm.ShapePath;
  layers: srm.ShapePath[];
}

export const getShapePartialHoles = ({ shapeId, shapePath, layers }: GetShapePathHolesOptions): srm.ShapePartialHole[] => {
  const holes: srm.ShapePartialHole[] = [];
  layers.forEach((layer: srm.ShapePath) => {
    if (layer.id !== shapePath.id && containsShapePath(shapePath, layer)) {
      // when hole in hole, the hole hole is whole
      if (holes.length > 0 && containsShapePath(holes[holes.length - 1], layer)) {
        return;
      } else {
        holes.push({...layer, type: 'ShapePartialHole', shapePath: shapePath, shapeId: shapeId});
      }
    }
  });
  return holes;
};

interface GetShapePartialsOptions {
  shape: srm.Shape;
}

export const getShapePartials = ({ shape }: GetShapePartialsOptions): srm.ShapePartial[] => {
  const { layers, id } = shape;
  const shapePaths: srm.ShapePartial[] = [{
    ...layers[0],
    type: 'ShapePartial',
    shape: shape,
    holes: getShapePartialHoles({shapeId: id, shapePath: layers[0], layers: layers})
  }];
  const alreadyHole = (layer: srm.ShapePath) => {
    return shapePaths.some((shapePath) => {
      return shapePath.holes.find(hole => hole.id === layer.id);
    });
  }
  layers.forEach((layer: srm.ShapePath) => {
    const lastItem = shapePaths[shapePaths.length - 1];
    if (layer.id !== lastItem.id && !alreadyHole(layer)) {
      shapePaths.push({
        ...layer,
        type: 'ShapePartial',
        shape: shape,
        holes: getShapePartialHoles({
          shapeId: id,
          shapePath: layer,
          layers: layers
        })
      });
    }
  });
  return shapePaths;
};