// main.js
// 主进程：创建无边框、透明、置顶的小窗，并把图标路径传给渲染进程
const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');

let win;

function createWindow() {
  // 调小窗口尺寸（适中更小）
  const WIDTH = 112;
  const HEIGHT = 112;

  // 获取主显示器工作区（已扣除任务栏）
  const primary = screen.getPrimaryDisplay();
  const wa = primary.workArea; // { x, y, width, height }

  // 将窗口放在工作区右下角，离任务栏上方留一点边距
  const margin = 12;
  const x = Math.round(wa.x + wa.width - WIDTH - margin);
  const y = Math.round(wa.y + wa.height - HEIGHT - margin);

  win = new BrowserWindow({
    width: WIDTH,
    height: HEIGHT,
    x,
    y,
    frame: false,             // 无边框
    transparent: true,        // 透明背景
    alwaysOnTop: true,        // 置顶
    resizable: false,
    skipTaskbar: true,        // 不在任务栏显示自身
    focusable: true,          // 允许响应点击/双击
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');

  // 指定你的 Chrome 图标路径（注意转为 file:// URL，处理空格与中文）
  const iconWinPath = 'D://就很 n//P1//Chromezhuanzhuan//icon.png';
  const iconFileUrl = pathToFileURL(iconWinPath).href;

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('icon-path', iconFileUrl);
  });

  ipcMain.on('close-app', () => app.quit());
}

app.whenReady().then(() => {
  createWindow();
  app.on('window-all-closed', () => app.quit());
});
