const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  globalShortcut
} = require('electron')
// const path = require('path')
// const url = require('url')

//

// 保持window对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.
let mainWindow
var aboutWindow
var appIcon
function createWindow() {
  //创建浏览器窗口,宽高自定义具体大小你开心就好
  mainWindow = new BrowserWindow({
    width: 600,
    height: 450,
    resizable: false,
    transparent: true,
    frame: true,
    // x:0,
    // y:0
  })

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
  mainWindow.webContents.openDevTools()

  // 关闭window时触发下列事件.
  mainWindow.on('closed', function () {
    mainWindow = null
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

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.on('ready', function () {
  createWindow();
  // mainWindow.setAlwaysOnTop(true, "floating");
  // mainWindow.setIgnoreMouseEvents(true)

  appTopMenu()
  appTray()

  //
  globalShortcut.register('CommandOrControl+1', () => {
    console.log('CommandOrControl+1')
  })
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

