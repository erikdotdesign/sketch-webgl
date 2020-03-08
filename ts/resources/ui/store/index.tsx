import React, {createContext, useReducer} from 'react';
import reducers from './reducers';
import getTheme, { SRM_DEFAULT_PRIMARY } from './theme';
import { Color } from 'chroma-js';

interface StateProviderProps {
  children: React.ReactNode
}

interface appState {
  ready: boolean;
  theme: any;
  artboard: srm.Artboard | null;
  base64Images: srm.base64Image[];
  zoom: number;
  baseZoom: number;
  dispatch: any;
}

const initialState: appState = {
  ready: false,
  theme: getTheme('dark'),
  artboard: null,
  base64Images: [],
  zoom: 1,
  baseZoom: 1,
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