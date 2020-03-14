const { app, BrowserWindow, ipcMain } = require('electron');
const {
	default: installExtension,
	REACT_DEVELOPER_TOOLS,
} = require('electron-devtools-installer');

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1000,
		height: 800,
		webPreferences: { nodeIntegration: true },
	});

	mainWindow.loadURL(
		isDev
			? 'http://localhost:3000'
			: `file://${path.join(__dirname, '../build/index.html')}`,
	);
	mainWindow.on('closed', (e, args) => console.log(args));
}

const installExtensions = async () => {
	installExtension(REACT_DEVELOPER_TOOLS)
		.then(name => console.log(`Added Extension:  ${name}`))
		.catch(err => console.log('An error occurred: ', err));
};

ipcMain.on('closed', _ => {
	mainWindow = null;
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('ready', async () => {
	if (isDev && process.argv.indexOf('--noDevServer') === -1) {
		await installExtensions();
	}
	createWindow();
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});
