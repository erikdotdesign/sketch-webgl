import React, { useRef, useContext, useEffect } from 'react';
import Canvas from './Canvas';
import { store } from '../store';

interface AppProps {
  artboard: srm.Artboard;
  base64Images: srm.base64Image[];
  theme: srm.Theme;
}

const App = (props: AppProps) => {
  const app = useRef<HTMLDivElement>(null);
  const globalState = useContext(store);
  const { dispatch, ready } = globalState;

  const handleInitialRender = (): void => {
    app.current?.focus();
    dispatch({
      type: 'initialize-app',
      ...props,
      ready: true
    });
  }

  useEffect(() => {
    handleInitialRender();
  }, []);

  return (
    <div
      className='c-app'
      tabIndex={-1}
      ref={app}>
      {
        ready
        ? <Canvas />
        : null
      }
    </div>
  );
}

export default App;