import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { StateProvider } from './store';

// @ts-ignore
// ignores window.renderApp
window.renderApp = (artboard: srm.Artboard, images: srm.base64Image[], theme: srm.Theme) => {
  ReactDOM.render(
    <StateProvider>
      <App
        artboard={artboard}
        base64Images={images}
        theme={theme} />
    </StateProvider>,
    document.getElementById('root')
  );
};