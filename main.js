const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron')
const {
    Client
} = require("./networking/tcp")

function createWindow() {
    const win = new BrowserWindow({
        width: 1600,
        height: 1200,
        webPreferences: {
            nodeIntegration: true,
            worldSafeExecuteJavaScript: true
        }
    })
    win.loadFile('index.html')
    win.webContents.openDevTools()
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

ipcMain.on("connect-to-server", function (event, arg) {
    client = new Client();
})

ipcMain.on("send-voice-data", function (event, arg) {
    client.sendMessage(arg).then(function (result) {
        event.sender.send("send-voice-data", result);
    });
})