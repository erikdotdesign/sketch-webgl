import * as PIXI from 'pixi.js';
import { colorToFill, borderPositionToAlignment } from '../utils';
import renderLayerShape from './layerShape';
import renderOpacity from './opacity';

interface RenderBorderColorOptions {
  layer: srm.ShapePath | srm.Image | srm.ShapePartial;
  border: srm.Border;
  borderIndex: number;
  container: PIXI.Container;
}

const renderBorderColor = ({ layer, border, borderIndex, container }: RenderBorderColorOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    const { color, thickness, position } = border;
    const borderColor = new PIXI.Graphics();
    borderColor.name = `border-${borderIndex}`;
    const borderStyles = colorToFill(color);
    const translatedAlignment = borderPositionToAlignment(position);
    // hole borders wont render unless there is a fill
    borderColor.beginFill(0x000000, 0.001);
    borderColor.lineStyle(thickness, borderStyles.color, 1, translatedAlignment);
    renderLayerShape({
      graphic: borderColor,
      layer: layer as srm.ShapePartial
    })
    .then(() => {
      borderColor.endFill();
      return renderOpacity({
        opacity: borderStyles.alpha,
        container: borderColor
      });
    })
    .then(() => {
      container.addChild(borderColor);
    })
    .finally(() => {
      resolve(container);
    });
  });
};

interface RenderBorderGradientOptions {
  layer: srm.ShapePath | srm.Image | srm.ShapePartial;
  border: srm.Border;
  borderIndex: number;
  resources: PIXI.LoaderResource[];
  container: PIXI.Container;
}

const renderBorderGradient = ({ layer, border, borderIndex, resources, container }: RenderBorderGradientOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    const borderGradient = new PIXI.Graphics();
    borderGradient.name = `border-${borderIndex}`;
    let gradientTexture;
    if (layer.type === 'ShapePartial') {
      const baseTexture = new PIXI.BaseTexture(resources[`[border-${borderIndex}]${(layer as srm.ShapePartial).shape.id}` as any].url);
      const frame = new PIXI.Rectangle(layer.frame.x - layer.frame.width, layer.frame.y - layer.frame.height, layer.frame.width, layer.frame.height);
      gradientTexture = new PIXI.Texture(baseTexture, frame);
    } else {
      gradientTexture = PIXI.Texture.from(resources[`[border-${borderIndex}]${layer.id}` as any].url);
    }
    // hole borders wont render unless there is a fill
    borderGradient.beginFill(0x000000, 0.001);
    borderGradient.lineTextureStyle({
      width: border.thickness,
      texture: gradientTexture,
      alignment: borderPositionToAlignment(border.position)
    });
    renderLayerShape({
      graphic: borderGradient,
      layer: layer as srm.ShapePath | srm.Image
    })
    .then((borderGradient) => {
      borderGradient.endFill();
      container.addChild(borderGradient);
    })
    .finally(() => {
      resolve(borderGradient);
    });
  });
};

interface RenderBorderOptions {
  layer: srm.ShapePath | srm.Image | srm.ShapePartial;
  border: srm.Border;
  borderIndex: number;
  resources: PIXI.LoaderResource[];
  container: PIXI.Container;
}

const renderBorder = ({ layer, border, borderIndex, resources, container }: RenderBorderOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    switch(border.fillType) {
      case 'Color':
        renderBorderColor({
          layer: layer as srm.ShapePath | srm.Image | srm.ShapePartial,
          border: border,
          borderIndex: borderIndex,
          container: container
        })
        .then((container) => {
          resolve(container);
        });
        break;
      case 'Gradient':
        renderBorderGradient({
          layer: layer as srm.ShapePath | srm.Image | srm.ShapePartial,
          border: border,
          borderIndex: borderIndex,
          resources: resources,
          container: container
        })
        .then((container) => {
          resolve(container);
        });
        break;
    }
  });
}

interface RenderBordersOptions {
  layer: srm.ShapePath | srm.Image | srm.ShapePartial;
  borders: srm.Border[];
  resources: PIXI.LoaderResource[];
  container: PIXI.Container;
}

const renderBorders = ({ layer, borders, resources, container }: RenderBordersOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    if (borders.length > 0 && borders.some(border => border.enabled)) {
      let bordersContainer = new PIXI.Container();
      bordersContainer.name = 'borders';
      let promises: Promise<PIXI.Container>[] = [];
      borders.forEach((border: srm.Border, borderIndex: number) => {
        if (border.enabled) {
          promises.push(renderBorder({
            layer: layer,
            border: border,
            borderIndex: borderIndex,
            resources: resources,
            container: bordersContainer
          }));
        }
      });
      Promise.all(promises).then(() => {
        container.addChild(bordersContainer);
        resolve(container);
      });
    } else {
      resolve(container);
    }
  });
};

export default renderBorders;