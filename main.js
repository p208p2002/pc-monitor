const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  globalShortcut,
} = require('electron')
const DEV_MODE = process.argv[2] === 'development' ? true : false;
const electron = require('electron');
// const os = require('os');
const storage = require('electron-json-storage');
storage.setDataPath(storage.getDefaultDataPath());
// const defaultDataPath = storage.getDefaultDataPath();
// const path = require('path')
// const url = require('url')
// console.log(storage.getDefaultDataPath())

//
// const APP_WIDTH = 1024; //350
// const APP_HEIGHT = 768; //230
const APP_WIDTH = 350;
const APP_HEIGHT = 100;

// 多螢幕設置
var SELECT_DISPLAY = 0

// 保持window对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.
let mainWindow
let aboutWindow
let helpWindow
var appIcon
function createWindow() {
  let frame = true;
  new Promise(function (resolve, reject) {
    storage.get('frame', function (error, data) {
      if (error) throw error;
      if (data) {
        frame = data.val
      }
      resolve()
    });
  })
    .then(() => {
      mainWindow = new BrowserWindow({
        icon: __dirname + '/favicon.ico',
        width: APP_WIDTH,
        height: APP_HEIGHT,
        // resizable: false,
        transparent: true,
        frame: frame,
        // x:0,
        // y:0
      })

      //若無框模式啟動，則視窗懸浮與事件穿透
      if (!frame) {
        mainWindow.setAlwaysOnTop(true, "floating");
        mainWindow.setIgnoreMouseEvents(true)
        mainWindow.setSkipTaskbar(true)
        // mainWindow.isVisibleOnAllWorkspaces(true)
      }

      if (DEV_MODE)
        mainWindow.loadURL('http://localhost:3000/');
      else
        mainWindow.loadURL('file://' + __dirname + '/react/index.html')

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

function openHelpWindow() {
  if (helpWindow) {
    helpWindow.focus()
    return
  }

  helpWindow = new BrowserWindow({
    height: 220,
    resizable: false,
    width: 320,
    title: '',
    minimizable: false,
    fullscreenable: false,
  })

  helpWindow.setMenu(null);

  helpWindow.loadURL('file://' + __dirname + '/views/help.html')

  helpWindow.on('closed', function () {
    helpWindow = null
  })
}

function appTopMenu() {
  //系統選單
  const template = [
    {
      label: 'Monitor',
      submenu: [
        {
          label: 'Help', click() {
            openHelpWindow();
          }
        },
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

function appTray() {
  //工作列選單
  appIcon = new Tray('./public/favicon.ico');
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Help', click() {
        openHelpWindow();
      }
    },
    {
      label: 'Exit', click() {
        app.quit();
      }
    }
  ])
  appIcon.setContextMenu(contextMenu)
}

function restartApp() {
  app.relaunch()
  app.exit()
}

function listenHotKey() {
  //有框模式
  globalShortcut.register('CommandOrControl+1', () => {
    storage.set('frame', { val: true }, function (error) {
      if (error) throw error;
    });
    setTimeout(() => {
      restartApp()
    }, 1000)
  })

  //無框模式
  globalShortcut.register('CommandOrControl+2', () => {
    storage.set('frame', { val: false }, function (error) {
      if (error) throw error;
    });
    setTimeout(() => {
      restartApp()
    }, 1000)
  })

  //
  globalShortcut.register('CommandOrControl+d',()=>{
    let totalDisplay = electron.screen.getAllDisplays().length
    if(SELECT_DISPLAY === totalDisplay-1){
      SELECT_DISPLAY = 0
    }
    else{
      SELECT_DISPLAY ++
    }
    // 初始設定左上
    //
    let displays = electron.screen.getAllDisplays()
    let externalDisplay = displays[SELECT_DISPLAY]
    if (externalDisplay) {      
      mainWindow.setPosition(
        externalDisplay.bounds.x,
        externalDisplay.bounds.y
      )
      mainWindow.setPosition(
        externalDisplay.bounds.x,
        externalDisplay.bounds.y
      )
    }
    mainWindow.webContents.focus()
  })
  //顯示左上
  globalShortcut.register('CommandOrControl+3', () => {
    console.log(SELECT_DISPLAY)
     //
     let displays = electron.screen.getAllDisplays()
     let externalDisplay = displays[SELECT_DISPLAY]
     if (externalDisplay) {      
       mainWindow.setPosition(
         externalDisplay.bounds.x,
         externalDisplay.bounds.y
       )
       mainWindow.setPosition(
         externalDisplay.bounds.x,
         externalDisplay.bounds.y
       )
     }
     mainWindow.webContents.focus()
  })

  //顯示右上
  globalShortcut.register('CommandOrControl+4', () => {
     //
     let displays = electron.screen.getAllDisplays()    
     let externalDisplay = displays[SELECT_DISPLAY]
     if (externalDisplay) {      
       mainWindow.setPosition(
         externalDisplay.bounds.x,
         externalDisplay.bounds.y
       )
       mainWindow.setPosition(
         externalDisplay.bounds.x + externalDisplay.size.width - APP_WIDTH,
         externalDisplay.bounds.y
       )
     }
     mainWindow.webContents.focus()
  })

  //顯示右下
  globalShortcut.register('CommandOrControl+5', () => {
    //
    let displays = electron.screen.getAllDisplays()    
    let externalDisplay = displays[SELECT_DISPLAY]
    if (externalDisplay) {      
      mainWindow.setPosition(
        externalDisplay.bounds.x,
        externalDisplay.bounds.y
      )
      mainWindow.setPosition(
        externalDisplay.bounds.x + externalDisplay.size.width - APP_WIDTH,
        externalDisplay.bounds.y + externalDisplay.size.height - mainWindow.getSize()[1]
      )
    }
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

