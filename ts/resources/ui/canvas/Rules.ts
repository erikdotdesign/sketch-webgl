import * as PIXI from 'pixi.js';
import renderRuleCornerstone from './RuleCornerstone';
import renderRuleTop from './RuleTop';
import renderRuleLeft from './RuleLeft';

interface RenderRulesOptions {
  app: PIXI.Application;
  artboard: srm.Artboard;
  theme: any;
  ruleSize: number;
}

const renderRules = ({ app, theme, artboard, ruleSize }: RenderRulesOptions): Promise<PIXI.Container> => {
  return new Promise((resolve, reject) => {
    const rules = new PIXI.Container();
    rules.name = 'rules';
    rules.width = app.screen.width;
    rules.height = app.screen.height;
    renderRuleTop({
      rules: rules,
      theme: theme,
      app: app,
      ruleSize: ruleSize,
      artboard: artboard
    })
    .then(() => {
      return renderRuleLeft({
        rules: rules,
        theme: theme,
        app: app,
        ruleSize: ruleSize,
        artboard: artboard
      });
    })
    .then(() => {
      return renderRuleCornerstone({
        rules: rules,
        theme: theme,
        ruleSize: ruleSize
      });
    })
    .then(() => {
      app.stage.addChild(rules);
      resolve(rules);
    });
  });
};

export default renderRules;