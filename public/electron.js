const { app, BrowserWindow, remote } = require('electron');

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
	const installer = require('electron-devtools-installer');
	const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
	const extensions = ['REACT_DEVELOPER_TOOLS', 'DEVTRON'];

	return Promise.all(
		extensions.map(name =>
			installer.default(installer[name] || name, forceDownload),
		),
	).catch(console.log);
};

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
