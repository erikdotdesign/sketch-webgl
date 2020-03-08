import * as PIXI from 'pixi.js';
import chroma from 'chroma-js';

interface RenderRuleTopOptions {
  rules: PIXI.Container;
  theme: any;
  app: PIXI.Application;
  ruleSize: number;
  artboard: srm.Artboard;
}

const renderRuleTop = ({ rules, theme, app, ruleSize, artboard }: RenderRuleTopOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    const ruleTop = new PIXI.Container();
    const background = new PIXI.Graphics();
    const bottomBorder = new PIXI.Graphics();
    const ruleTopCanvas = new PIXI.Container();
    const ruleTopCanvasGraphic = new PIXI.Graphics();
    const ruleTopArtboardGraphic = new PIXI.Graphics();
    // rule dims
    const ruleOffset = ruleSize;
    const ruleWidth = app.screen.width - ruleOffset;
    const ruleHeight = ruleSize;
    ruleTop.name = 'rule-top';
    ruleTop.width = ruleWidth;
    ruleTop.height = ruleHeight;
    // events
    ruleTop.on('Zoom', (e: CustomEvent) => {
      ruleTopCanvas.scale.x = e.detail.zoom;
    });
    ruleTop.on('ZoomCenter', (e: CustomEvent) => {
      ruleTopCanvas.position.x = e.detail.x;
    });
    ruleTop.on('scroll', (e: any) => {
      ruleTopCanvas.position.x += e.wheelDeltaX;
    });
    // background
    background.beginFill(chroma(theme.background.z0).num());
    background.drawRect(ruleOffset, 0, ruleWidth, ruleHeight);
    background.endFill();
    // bottom border
    bottomBorder.beginFill(chroma(theme.background.z2).num());
    bottomBorder.drawRect(ruleOffset, ruleOffset, ruleWidth, 1);
    bottomBorder.endFill();
    // ruleTopCanvas
    ruleTopCanvas.width = app.screen.width;
    ruleTopCanvas.height = ruleHeight;
    ruleTopCanvasGraphic.beginFill(chroma(theme.background.z3).num());
    ruleTopCanvasGraphic.drawRect((app.screen.width - app.stage.width) / 2, 0, app.stage.width, ruleHeight);
    ruleTopCanvasGraphic.endFill();
    ruleTopCanvas.addChild(ruleTopCanvasGraphic);
    // ruleTopArtboard
    ruleTopArtboardGraphic.beginFill(chroma(theme.palette.primary).num(), 0.5);
    ruleTopArtboardGraphic.drawRect((app.screen.width / 2) - (artboard.frame.width / 2), 0, artboard.frame.width, ruleHeight);
    ruleTopArtboardGraphic.endFill();
    ruleTopCanvas.addChild(ruleTopArtboardGraphic);
    // rendering
    ruleTop.addChild(background);
    ruleTop.addChild(bottomBorder);
    ruleTop.addChild(ruleTopCanvas);
    rules.addChild(ruleTop);
    resolve(rules);
  });
};

export default renderRuleTop;