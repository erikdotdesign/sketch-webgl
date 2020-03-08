import * as PIXI from 'pixi.js';
import chroma from 'chroma-js';

interface RenderRuleCornerstoneOptions {
  rules: PIXI.Container;
  theme: any;
  ruleSize: number;
}

const renderRuleCornerstone = ({ rules, theme, ruleSize }: RenderRuleCornerstoneOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    const ruleConerstone = new PIXI.Container();
    const background = new PIXI.Graphics();
    const rightBorder = new PIXI.Graphics();
    const bottomBorder = new PIXI.Graphics();
    ruleConerstone.name = 'rule-cornerstone';
    ruleConerstone.width = ruleSize;
    ruleConerstone.height = ruleSize;
    background.beginFill(chroma(theme.background.z0).num());
    background.drawRect(0, 0, ruleSize, ruleSize);
    background.endFill();
    rightBorder.beginFill(chroma(theme.background.z2).num());
    rightBorder.drawRect(ruleSize, 0, 1, ruleSize);
    rightBorder.endFill();
    bottomBorder.beginFill(chroma(theme.background.z2).num());
    bottomBorder.drawRect(0, ruleSize, ruleSize, 1);
    bottomBorder.endFill();
    ruleConerstone.addChild(background);
    ruleConerstone.addChild(rightBorder);
    ruleConerstone.addChild(bottomBorder);
    rules.addChild(ruleConerstone);
    resolve(rules);
  });
};

export default renderRuleCornerstone;