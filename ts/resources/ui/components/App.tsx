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
      ready: true,
      zoom: 1
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


// {/* <BackButton />
//       <TopBar />
//       <SidebarLeft />
//       <SidebarRight /> */}

// const { dispatch, centerScroll, zoom, baseZoom } = globalState;

  // const handleResize = (): void => {
  //   const viewportSize = getViewPortSize();
  //   const centerScroll = getCenterScroll(props.artboard);
  //   const artboardScale = scaleArtboardForViewport(props.artboard);
  //   dispatch({
  //     type: 'reset-viewport',
  //     zoom: artboardScale,
  //     baseZoom: artboardScale,
  //     viewportSize: viewportSize,
  //     centerScroll: centerScroll
  //   });
  //   window.scrollTo(centerScroll.x, centerScroll.y);
  // }

  // const handleKeyPress = (e: any): void => {
  //   if (e.key === '-' && e.metaKey && e.altKey && e.ctrlKey) {
  //     e.preventDefault();
  //     if (zoom - 0.1 > 0) {
  //       dispatch({
  //         type: 'set-zoom',
  //         zoom: zoom - 0.1
  //       });
  //     }
  //   } else if (e.key === '=' && e.metaKey && e.altKey && e.ctrlKey) {
  //     e.preventDefault();
  //     if (zoom + 0.1 < 5) {
  //       dispatch({
  //         type: 'set-zoom',
  //         zoom: zoom + 0.1
  //       });
  //     }
  //   } else if (e.key === 'Enter' && e.metaKey && e.altKey && e.ctrlKey) {
  //     e.preventDefault();
  //     dispatch({
  //       type: 'set-zoom',
  //       zoom: baseZoom
  //     });
  //     window.scrollTo(centerScroll.x, centerScroll.y);
  //   }
  // }

  // const handleInitialRender = (): void => {
  //   window.addEventListener('resize', handleResize);
  //   app.current?.focus();
  //   const viewportSize = getViewPortSize();
  //   const centerScroll = getCenterScroll(props.artboard);
  //   const artboardScale = scaleArtboardForViewport(props.artboard);
  //   dispatch({
  //     type: 'initialize-app',
  //     ...props,
  //     ready: true,
  //     selection: props.artboard,
  //     zoom: artboardScale,
  //     baseZoom: artboardScale,
  //     viewportSize: viewportSize,
  //     centerScroll: centerScroll
  //   });
  //   window.scrollTo(centerScroll.x, centerScroll.y);
  // }

  // useEffect(() => {
  //   handleInitialRender();
  // }, []);