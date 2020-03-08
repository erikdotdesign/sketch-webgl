import getTheme from './theme';

const reducers = (state: any, action: any) => {
  switch(action.type) {
    case 'initialize-app': {
      return {
        ...state,
        ready: action.ready,
        artboard: action.artboard,
        base64Images: action.base64Images,
        theme: getTheme(action.theme, action.avgColor)
      };
    }
    default:
      throw new Error('Action not found');
  }
};

export default reducers;