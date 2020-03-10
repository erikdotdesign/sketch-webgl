![icon](images/icon.png)

# Sketch WebGL

A sketch plugin that renders your designs to HTML Canvas with WebGL.

## Getting Started

1. Select an artboard in your sketch file
2. Run plugin
3. `Scroll`, `wheel`, and `pinch` to traverse render
4. `right click` to reload or inspect window

### Canvas Components

- **App**
  - type: `PIXI.Application`
  - children:
    - `Canvas`
- **Canvas**
  - type: `PIXI.Container`
  - children:
    - `Artboard`
- **Artboard**
  - type: `PIXI.Container`
  - children:
    - `ArtboardLayers`
- **ArtboardLayers**
  - type: `PIXI.Container`
  - children:
    - `(Group | Image | Shape | ShapePath)[]`
- **Group**
  - type: `PIXI.Container`
  - children:
    - `(Group | Image | Shape | ShapePath)[]`
- **Image**
  - type: `PIXI.Container`
  - children:
    - `GroupsShadows`
    - `Shadows`
    - `BaseImage`
    - `Fills`
    - `InnerShadows`
    - `Borders`
- **BaseImage**
  - type: `PIXI.Sprite`
- **Shape**
  - type: `PIXI.Container`
  - children:
    - `ShapePartial[]`
- **ShapePartial**
  - type: `PIXI.Container`
  - children:
    - `GroupsShadows`
    - `Shadows`
    - `Fills`
    - `InnerShadows`
    - `Borders`
- **ShapePath**
  - type: `PIXI.Container`
  - children:
    - `GroupsShadows`
    - `Shadows`
    - `Fills`
    - `InnerShadows`
    - `Borders`
- **GroupsShadows**
  - type: `PIXI.Container`
  - children:
    - `GroupShadows[]`
- **GroupShadows**
  - type: `PIXI.Container`
  - children:
    - `Shadow[]`
- **Shadows**
  - type: `PIXI.Container`
  - children:
    - `Shadow[]`
- **Shadow**
  - type: `PIXI.Graphics`
- **Fills**
  - type: `PIXI.Container`
  - children:
    - `Fill[]`
- **Fill**
  - type: `PIXI.Graphics`
- **InnerShadows**
  - type: `PIXI.Container`
  - children:
    - `InnerShadow[]`
- **InnerShadow**
  - type: `PIXI.Container`
  - children:
    - `InnerShadowsMask`
    - `MaskedInnerShadows`
- **InnerShadowsMask**
  - type: `PIXI.Graphics`
- **MaskedInnerShadows**
  - type: `PIXI.Container`
  - children:
    - `MaskedInnerShadow[]`
- **MaskedInnerShadow**
  - type: `PIXI.Graphics`
- **Borders**
  - type: `PIXI.Container`
  - children:
    - `Border[]`
- **Border**
  - type: `PIXI.Graphics`

### Supports

- Layers
  - Shapes `all`
  - ShapePaths `all`
  - Text `all`
    - Converted to outlines, rendered as Shape or ShapePath
  - Images `all`
  - Symbols `all`
  - Groups `all`
- Styles
  - Fills `all`
  - Borders `all`
  - Border Options `all`
  - Opacity
  - Blend Modes `Normal, Multiply`
  - Shadows `all`
  - Inner Shadows `all`
  - Blur `Gaussian, Zoom`
  - Transforms `rotation, horizontal flip, vertical flip`
- Masks
- Light Theme
- Dark Theme

### Prerequisites

- Sketch: v.61.2

### Installing

1. Download or clone repo
2. Open `sketch-webgl.sketchplugin`