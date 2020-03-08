import React, {createContext, useReducer} from 'react';
import reducers from './reducers';
import getTheme, { SRM_DEFAULT_PRIMARY } from './theme';
import { Color } from 'chroma-js';

interface StateProviderProps {
  children: React.ReactNode
}

interface appState {
  ready: boolean;
  gesturing: boolean;
  theme: any;
  artboard: srm.Artboard | null;
  images: srm.ImgAsset[];
  base64Images: srm.base64Image[];
  svgs: srm.SvgAsset[];
  notes: srm.Note[];
  avgColor: Color;
  selection: srm.AppLayer | null;
  hover: srm.AppLayer | null;
  groupSelection: srm.Group | null;
  groupSelectionNest: srm.Group[] | null;
  zoom: number;
  baseZoom: number;
  centerScroll: {x: number, y: number};
  cursorPosition: null | {x: number, y: number};
  viewportSize: {width: number, height: number};
  composing: boolean;
  dispatch: any;
}

const initialState: appState = {
  ready: false,
  gesturing: false,
  theme: getTheme('dark'),
  artboard: null,
  images: [],
  base64Images: [],
  svgs: [],
  notes: [],
  avgColor: SRM_DEFAULT_PRIMARY,
  selection: null,
  hover: null,
  groupSelection: null,
  groupSelectionNest: null,
  zoom: 1,
  baseZoom: 1,
  cursorPosition: null,
  centerScroll: {x: 0, y: 0},
  viewportSize: {width: 0, height: 0},
  composing: false,
  dispatch: () => {}
};

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = (props: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducers, initialState);

  return (
    <Provider value={{ ...state, dispatch }}>
      {props.children}
    </Provider>
  )
};

export { store, StateProvider }