import * as PIXI from 'pixi.js';
import { renderShadow } from './shadows';

interface RenderGroupShadowsOptions {
  layer: srm.ShapePath | srm.Image | srm.ShapePartial;
  groupShadows: srm.GroupShadows;
  container: PIXI.Container;
}

const renderGroupShadows = ({ layer, groupShadows, container }: RenderGroupShadowsOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    const promises: Promise<PIXI.Container>[] = [];
    const groupShadowsContainer = new PIXI.Container();
    groupShadowsContainer.name = groupShadows.id;
    groupShadows.shadows.forEach((shadow: srm.Shadow, shadowIndex: number) => {
      if (shadow.enabled) {
        promises.push(renderShadow({
          layer: layer,
          shadow: shadow,
          shadowIndex: shadowIndex,
          container: groupShadowsContainer
        }));
      }
    });
    Promise.all(promises).then(() => {
      container.addChild(groupShadowsContainer);
      resolve(container);
    });
  });
};

interface RenderGroupsShadowsOptions {
  layer: srm.ShapePath | srm.Image | srm.ShapePartial;
  groupShadows?: srm.GroupShadows[] | undefined;
  container: PIXI.Container;
}

const renderGroupsShadows = ({ layer, groupShadows, container }: RenderGroupsShadowsOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    if (groupShadows) {
      const groupsShadowsContainer = new PIXI.Container();
      groupsShadowsContainer.name = 'group-shadows';
      const promises: Promise<PIXI.Container>[] = [];
      groupShadows.forEach((groupShadow) => {
        promises.push(renderGroupShadows({
          layer: layer,
          groupShadows: groupShadow,
          container: groupsShadowsContainer
        }));
      })
      Promise.all(promises).then(() => {
        container.addChild(groupsShadowsContainer);
        resolve(container);
      });
    } else {
      resolve(container);
    }
  });
};

export default renderGroupsShadows;