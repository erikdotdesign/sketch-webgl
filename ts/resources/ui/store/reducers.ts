import getTheme from './theme';

const reducers = (state: any, action: any) => {
  switch(action.type) {
    case 'initialize-app': {
      return {
        ...state,
        artboard: action.artboard,
        base64Images: action.base64Images,
        theme: getTheme(action.theme, action.avgColor),
        composing: action.composing,
        ready: action.ready,
        zoom: action.zoom
      };
    }
    case 'set-gesturing':
      return {
        ...state,
        gesturing: action.gesturing
      };
    case 'set-cursor-position':
      return {
        ...state,
        cursorPosition: {
          x: Math.round(action.cursorPosition.x),
          y: Math.round(action.cursorPosition.y)
        }
      };
    case 'set-theme':
      return {
        ...state,
        theme: getTheme(action.theme.name, action.theme.color)
      };
    case 'set-theme-light':
      return {
        ...state,
        theme: getTheme('light', state.avgColor)
      };
    case 'set-theme-dark':
      return {
        ...state,
        theme: getTheme('dark', state.avgColor)
      };
    case 'set-zoom':
      return {
        ...state,
        zoom: action.zoom
      };
    case 'reset-viewport':
      return {
        ...state,
        zoom: action.zoom,
        baseZoom: action.zoom,
        viewportSize: action.viewportSize,
        centerScroll: action.centerScroll
      };
    case 'set-selection':
      return {
        ...state,
        selection: action.selection
      };
    case 'set-hover':
      return {
        ...state,
        hover: action.hover
      };
    case 'set-notes':
      return {
        ...state,
        notes: action.notes
      };
    default:
      throw new Error('Action not found');
  }
};

export default reducers;