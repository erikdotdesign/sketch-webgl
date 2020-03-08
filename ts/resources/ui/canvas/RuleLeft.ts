import * as PIXI from 'pixi.js';
import chroma from 'chroma-js';

interface RenderRuleLeftOptions {
  rules: PIXI.Container;
  theme: any;
  app: PIXI.Application;
  ruleSize: number;
  artboard: srm.Artboard;
}

const renderRuleLeft = ({ rules, theme, app, ruleSize, artboard }: RenderRuleLeftOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    const ruleLeft = new PIXI.Container();
    const background = new PIXI.Graphics();
    const rightBorder = new PIXI.Graphics();
    const ruleLeftCanvas = new PIXI.Container();
    const ruleLeftCanvasGraphic = new PIXI.Graphics();
    const ruleLeftArtboardGraphic = new PIXI.Graphics();
    // rule dims
    const ruleOffset = ruleSize;
    const ruleWidth = ruleSize;
    const ruleHeight = app.screen.height - ruleOffset;
    ruleLeft.name = 'rule-left';
    ruleLeft.width = ruleWidth;
    ruleLeft.height = ruleHeight;
    // events
    ruleLeft.on('Zoom', (e: CustomEvent) => {
      ruleLeftCanvas.scale.y = e.detail.zoom;
    });
    ruleLeft.on('ZoomCenter', (e: CustomEvent) => {
      ruleLeftCanvas.position.y = e.detail.y;
    });
    ruleLeft.on('scroll', (e: any) => {
      ruleLeftCanvas.position.y += e.wheelDeltaY;
    });
    // background
    background.beginFill(chroma(theme.background.z0).num());
    background.drawRect(0, ruleOffset, ruleWidth, ruleHeight);
    background.endFill();
    // right border
    rightBorder.beginFill(chroma(theme.background.z2).num());
    rightBorder.drawRect(ruleOffset, ruleOffset, 1, ruleHeight);
    rightBorder.endFill();
    // ruleLeftCanvas
    ruleLeftCanvas.width = ruleWidth;
    ruleLeftCanvas.height = app.screen.height;
    ruleLeftCanvasGraphic.beginFill(chroma(theme.background.z3).num());
    ruleLeftCanvasGraphic.drawRect(0, (app.screen.height - app.stage.height) / 2, ruleWidth, app.stage.height);
    ruleLeftCanvasGraphic.endFill();
    ruleLeftCanvas.addChild(ruleLeftCanvasGraphic);
    // ruleLeftArtboard
    ruleLeftArtboardGraphic.beginFill(chroma(theme.palette.primary).num(), 0.5);
    ruleLeftArtboardGraphic.drawRect(0, (app.screen.height / 2) - (artboard.frame.height / 2), ruleWidth, artboard.frame.height);
    ruleLeftArtboardGraphic.endFill();
    ruleLeftCanvas.addChild(ruleLeftArtboardGraphic);
    // render
    ruleLeft.addChild(background);
    ruleLeft.addChild(rightBorder);
    ruleLeft.addChild(ruleLeftCanvas);
    rules.addChild(ruleLeft);
    resolve(rules);
  });
};

export default renderRuleLeft;