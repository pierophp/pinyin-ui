import loadMain from './main';
import globalLoader from 'src/global-loader/editor';
import routes from 'src/routes/editor';
import app from 'src/app/editor';

async function tryLoadMain() {
  try {
    if (window.frames['iframe-storage'].get) {
      loadMain(routes, app, globalLoader);
    } else {
      setTimeout(() => {
        tryLoadMain().then();
      }, 50);
    }
  } catch (e) {
    setTimeout(() => {
      tryLoadMain().then();
    }, 50);
  }
}

tryLoadMain().then();
