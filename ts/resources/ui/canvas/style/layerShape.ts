import * as PIXI from 'pixi.js';
import { getAbsPoint } from '../utils';

interface RenderShapePathPointOptions {
  currentPoint: srm.CurvePoint;
  nextPoint: srm.CurvePoint;
  graphic: PIXI.Graphics;
}

const renderShapePathPoint = ({ currentPoint, nextPoint, graphic }: RenderShapePathPointOptions) => {
  if (currentPoint.pointType === 'Straight') {
    if (nextPoint.pointType === 'Straight') {
      graphic.lineTo(nextPoint.point.x, nextPoint.point.y);
    } else {
      graphic.quadraticCurveTo(nextPoint.curveTo.x, nextPoint.curveTo.y, nextPoint.point.x, nextPoint.point.y);
    }
  } else {
    if (nextPoint.pointType === 'Straight') {
      graphic.quadraticCurveTo(currentPoint.curveFrom.x, currentPoint.curveFrom.y, nextPoint.point.x, nextPoint.point.y);
    } else {
      graphic.bezierCurveTo(currentPoint.curveFrom.x, currentPoint.curveFrom.y, nextPoint.curveTo.x, nextPoint.curveTo.y, nextPoint.point.x, nextPoint.point.y);
    }
  }
};

interface RenderShapePathShapeOptions {
  layer: srm.ShapePath | srm.ShapePartialHole;
  graphic: PIXI.Graphics;
  move?: {x: number, y: number};
}

const renderShapePathShape = ({ layer, graphic, move }: RenderShapePathShapeOptions): Promise<PIXI.Graphics> => {
  return new Promise((resolve, reject) => {
    const { frame, points, closed } = layer;
    points.forEach((curvePoint: srm.CurvePoint, index: number) => {
      const currentPoint = getAbsPoint(curvePoint, frame, move);
      const onFirstPoint = index === 0;
      const onLastPoint = index === points.length - 1;
      if (onFirstPoint) {
        graphic.moveTo(currentPoint.point.x, currentPoint.point.y);
      }
      if (!onLastPoint) {
        const nextPoint = getAbsPoint(points[index + 1], frame, move);
        renderShapePathPoint({
          currentPoint: currentPoint,
          nextPoint: nextPoint,
          graphic: graphic
        });
      }
      if (onLastPoint && closed) {
        const firstPoint = getAbsPoint(points[0], frame, move);
        renderShapePathPoint({
          currentPoint: currentPoint,
          nextPoint: firstPoint,
          graphic: graphic
        });
        graphic.closePath();
      }
    });
    resolve(graphic);
  });
};

interface RenderShapePartialHolesOptions {
  layer: srm.ShapePartial;
  graphic: PIXI.Graphics;
}

const renderShapePartialHoles = ({ layer, graphic }: RenderShapePartialHolesOptions) => {
  return new Promise((resolve, reject) => {
    const { holes } = layer;
    if (holes.length > 0) {
      const promises: Promise<any>[] = [];
      holes.forEach((hole: srm.ShapePath) => {
        promises.push(renderShapePathShape({
          graphic: graphic,
          layer: hole,
          move: {
            x: hole.frame.x - layer.frame.x,
            y: hole.frame.y - layer.frame.y
          }
        }));
      });
      Promise.all(promises).then(() => {
        resolve();
      });
    } else {
      resolve();
    }
  });
};

interface RenderShapePartialShapeOptions {
  layer: srm.ShapePartial;
  graphic: PIXI.Graphics;
  move?: {x: number, y: number};
}

const renderShapePartialShape = ({ layer, graphic, move }: RenderShapePartialShapeOptions): Promise<PIXI.Graphics> => {
  return new Promise((resolve, reject) => {
    renderShapePathShape({
      graphic: graphic,
      layer: layer,
      move: move
    })
    .then(() => {
      graphic.beginHole();
      return renderShapePartialHoles({
        layer: layer,
        graphic: graphic
      });
    })
    .then(() => {
      graphic.endHole();
      resolve(graphic);
    });
  });
};

interface RenderLayerShapeOptions {
  layer: srm.ShapePath | srm.Image | srm.ShapePartial | srm.ShapePartialHole | srm.Shape | srm.Group | srm.Text;
  graphic: PIXI.Graphics;
  move?: {x: number, y: number};
}

const renderLayerShape = ({ layer, graphic, move }: RenderLayerShapeOptions): Promise<PIXI.Graphics> => {
  return new Promise((resolve, reject) => {
    switch(layer.type) {
      case 'ShapePath':
      case 'ShapePartialHole':
        renderShapePathShape({
          graphic: graphic,
          layer: layer as srm.ShapePath | srm.ShapePartialHole,
          move: move
        })
        .then(() => {
          resolve(graphic);
        });
        break;
      case 'ShapePartial':
        renderShapePartialShape({
          graphic: graphic,
          layer: layer as srm.ShapePartial,
          move: move
        })
        .then(() => {
          resolve(graphic);
        });
        break;
      case 'Image':
      case 'Shape':
      case 'Group':
      case 'Text':
        graphic.drawRect(0, 0, layer.frame.width, layer.frame.height);
        resolve(graphic);
        break;
    }
  });
};

export default renderLayerShape;