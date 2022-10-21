import { app, screen } from 'electron';
import serve from 'electron-serve';

import { createWindow, isWin } from './helpers';

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const display = screen.getPrimaryDisplay();
  const dimensions = display.workAreaSize;
  const ratio = 16 / 9;

  const mainWindow = createWindow('main', {
    title: 'APP NAME',
    titleBarStyle: isWin ? 'default' : 'hidden',
    autoHideMenuBar: true,
    frame: true,
    resizable: true,
    width: Math.min(1200, dimensions.width),
    height: Math.min(1200 / ratio, dimensions.height),
    minWidth: 1024, // OK-8215
    minHeight: 800 / ratio,
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});
