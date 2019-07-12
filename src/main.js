const { app, BrowserWindow } = require('electron');

app.on('ready', createWindow);
app.on('closed', exitGame)


// Internal functions
function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 1584,
    height: 1000,
    webPreferences: {
      nodeIntegration: true
    }
  })
  //win.removeMenu();
  win.loadFile('src/levels/logo.html');
}

function exitGame() {
  window.localStorage.removeItem("teotlPlayer");
  window.localStorage.removeItem("teotlPlayerID");
  win = null;
}