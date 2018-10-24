const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  globalShortcut,
} = require('electron')
const electron = require('electron');
// const os = require('os');
const storage = require('electron-json-storage');
storage.setDataPath(storage.getDefaultDataPath());
// const defaultDataPath = storage.getDefaultDataPath();
// const path = require('path')
// const url = require('url')
// console.log(storage.getDefaultDataPath())

//
const APP_WIDTH = 350;
const APP_HEIGHT = 250;

// 保持window对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.
let mainWindow
var aboutWindow
var appIcon
function createWindow() {
  let frame = true;
  new Promise(function(resolve,reject){
    storage.get('frame', function(error, data) {
      if (error) throw error;
      if(data){
        frame = data.val
      }
      resolve()
    });
  })
  .then(()=>{
    mainWindow = new BrowserWindow({
      width: APP_WIDTH,
      height: APP_HEIGHT,
      // resizable: false,
      transparent: true,
      frame: frame,
      // x:0,
      // y:0
    })

    //若無框模式啟動，則視窗懸浮與事件穿透
    if(!frame){
      mainWindow.setAlwaysOnTop(true, "floating");
      mainWindow.setIgnoreMouseEvents(true)
      // mainWindow.isVisibleOnAllWorkspaces(true)
    }

    /*
     * 加载应用-----  electron-quick-start中默认的加载入口
      mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
      }))
    */
    // 加载应用----适用于 react 项目
    mainWindow.loadURL('http://localhost:3000/');

    // 打开开发者工具，默认不打开
    // mainWindow.webContents.openDevTools()

    // 关闭window时触发下列事件.
    mainWindow.on('closed', function () {
      mainWindow = null
    })
  })
}

function openAboutWindow() {
  if (aboutWindow) {
    aboutWindow.focus()
    return
  }

  aboutWindow = new BrowserWindow({
    height: 185,
    resizable: false,
    width: 270,
    title: '',
    minimizable: false,
    fullscreenable: false,
  })

  aboutWindow.setMenu(null);

  aboutWindow.loadURL('file://' + __dirname + '/views/about.html')

  aboutWindow.on('closed', function () {
    aboutWindow = null
  })
}

function appTopMenu(){
  //系統選單
  const template = [
    {
      label: 'Monitor',
      submenu: [
        {
          label: 'About', click() {
            openAboutWindow();
          }
        },
        {
          label: 'Restart', click() {
            restartApp()
          }
        }
      ]
    },
  ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function appTray(){
  //工作列選單
  appIcon = new Tray('./public/favicon.ico')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' }
  ])
  appIcon.setContextMenu(contextMenu)
}

function restartApp() {
  app.relaunch()
  app.exit()
}

function listenHotKey(){
  //無框模式
  globalShortcut.register('CommandOrControl+1', () => {
    storage.set('frame', { val:false }, function(error) {
      if (error) throw error;
    });
    restartApp()
  })

  //有框模式
  globalShortcut.register('CommandOrControl+2', () => {
    storage.set('frame', { val:true }, function(error) {
      if (error) throw error;
    });
    restartApp()
  })

  //
  let screenSize = electron.screen.getPrimaryDisplay();
  //顯示左上
   globalShortcut.register('CommandOrControl+3', () => {
    mainWindow.setPosition(0,0)
    mainWindow.setSize(APP_WIDTH,APP_HEIGHT)
    mainWindow.webContents.focus()
  })

  //顯示右上
  globalShortcut.register('CommandOrControl+4', () => {
    mainWindow.setPosition(screenSize.size.width-APP_WIDTH,0)
    mainWindow.setSize(APP_WIDTH,APP_HEIGHT)
    mainWindow.webContents.focus()
  })

  //顯示右下
  globalShortcut.register('CommandOrControl+5', () => {
    mainWindow.setPosition(screenSize.size.width-APP_WIDTH,screenSize.size.height-APP_HEIGHT)
    mainWindow.setSize(APP_WIDTH,APP_HEIGHT)
    mainWindow.webContents.focus()
  })
}

//app 掛載完成
app.on('ready', function () {
  createWindow();
  appTopMenu();
  appTray();
  listenHotKey();
})

// 所有窗口关闭时退出应用.
app.on('window-all-closed', function () {
  // macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS中点击Dock图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
  if (mainWindow === null) {
    createWindow()
  }
})

// 你可以在这个脚本中续写或者使用require引入独立的js文件.

