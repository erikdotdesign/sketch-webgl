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
      theme: theme,
      dispatch: dispatch
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

// let startGestureZoom = 0;
// let gestureZoom = 1;

// {/* {
//         ready
//         ? <Artboard />
//         : null
//       }
//       <div
//         className='c-canvas__escape'
//         onClick={handleClick}
//         onMouseOver={handleMouseOver} /> */}

// const handleClick = () => {
  //   dispatch({
  //     type: 'set-selection',
  //     selection: null
  //   });
  // }
  // const handleMouseOver = () => {
  //   dispatch({
  //     type: 'set-hover',
  //     selection: null
  //   });
  // }
  // const handleGestureStart = (e: any) => {
  //   e.preventDefault();
  //   dispatch({
  //     type: 'set-gesturing',
  //     gesturing: true
  //   });
  //   startGestureZoom = gestureZoom;
  // }
  // const handleGestureChange = (e: any) => {
  //   e.preventDefault();
  //   dispatch({
  //     type: 'set-zoom',
  //     zoom: startGestureZoom * e.scale
  //   });
  // }
  // const handleGestureEnd = (e: any) => {
  //   e.preventDefault();
  //   dispatch({
  //     type: 'set-gesturing',
  //     gesturing: false
  //   });
  // }
  // const handleWheel = (e: any) => {
  //   if (e.ctrlKey) {
  //     e.preventDefault();
  //     let nextZoom = gestureZoom - e.deltaY * 0.01;
  //     if (e.deltaY < 0 && nextZoom < 5) {
  //       dispatch({
  //         type: 'set-zoom',
  //         zoom: gestureZoom -= e.deltaY * 0.01
  //       });
  //     } else if (e.deltaY > 0 && nextZoom > 0) {
  //       dispatch({
  //         type: 'set-zoom',
  //         zoom: gestureZoom -= e.deltaY * 0.01
  //       });
  //     }
  //   }
  // }
  // useEffect(() => {
  //   canvas.current?.addEventListener('gesturestart', handleGestureStart);
  //   canvas.current?.addEventListener('gesturechange', handleGestureChange);
  //   canvas.current?.addEventListener('gestureend', handleGestureEnd);
  // }, []);
  // useEffect(() => {
  //   gestureZoom = zoom;
  // }, [zoom]);