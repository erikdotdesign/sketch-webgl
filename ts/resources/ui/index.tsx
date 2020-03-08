import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { StateProvider } from './store';

// @ts-ignore
// ignores window.renderApp
window.renderApp = (artboard: srm.Artboard, images: srm.base64Image[], theme: srm.Theme) => {
  console.log(artboard.layers);
  ReactDOM.render(
    <StateProvider>
      <App
        composing={true}
        artboard={artboard}
        base64Images={images}
        theme={theme} />
    </StateProvider>,
    document.getElementById('root')
  );
};