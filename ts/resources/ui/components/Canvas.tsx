import React, { useRef, useEffect, useContext, useState } from 'react';
import { store } from '../store';
import renderPixiCanvas from '../canvas';

const Canvas = () => {
  const [pixiApp, setPixiApp] = useState<PIXI.Application | null>(null);
  const globalState = useContext(store);
  const { dispatch, theme, artboard, base64Images, zoom } = globalState;
  const canvas = useRef<HTMLDivElement>(null);

  const handleResize = () => {
    if (pixiApp) {
      pixiApp.resize();
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    canvas.current?.addEventListener("wheel", function(event){
      event.preventDefault();
    });
    renderPixiCanvas({
      sketchArtboard: artboard as srm.Artboard,
      base64Images: base64Images,
      theme: theme
    })
    .then(app => {
      setPixiApp(app);
      canvas.current?.appendChild(app.view);
    });
  }, []);

  return (
    <div
      id='canvas'
      className='c-canvas'
      ref={canvas}
      style={{background: theme.background.z0}} />
  );
}

export default Canvas;