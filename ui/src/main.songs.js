import loadMain from './main';
import globalLoader from 'src/global-loader/songs';
import routes from 'src/routes/songs';
import app from 'src/app/songs';

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
