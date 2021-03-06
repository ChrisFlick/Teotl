// Grabbing Modular code.
const { app, BrowserWindow } = require('electron');

app.on('ready', createWindow);
app.on('closed', exitGame);

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

function exitGame() { // On exit delete all stored variabls.
  window.localStorage.removeItem("teotlPlayer");
  window.localStorage.removeItem("teotlEnemy");

  window.localStorage.removeItem("teotlPlayerID");
  window.localStorage.removeItem("teotlEnemyID");

  window.localStorage.remoteItem("doomsday")
  window.localStorage.removeItem("enemyPick");
  win = null
}
