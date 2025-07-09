<<<<<<< codex/install-test-runner-and-add-sample-test
function averageVoltage(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return 0;
  }
  const sum = values.reduce((acc, v) => acc + v, 0);
  return sum / values.length;
}

module.exports = { averageVoltage };
=======
<<<<<<< codex/add-basic-authentication-support-in-main.js
// Basic polling script for inverter API
// Polls /api/status and /api/config with optional Basic authentication

const user = process.env.INVERTER_USER || '';
const pass = process.env.INVERTER_PASS || '';

const headers = {};
if (user || pass) {
  const token = Buffer.from(`${user}:${pass}`).toString('base64');
  headers['Authorization'] = `Basic ${token}`;
}

async function fetchStatus() {
  const res = await fetch('/api/status', { headers });
  return res.json();
}

async function fetchConfig() {
  const res = await fetch('/api/config', { headers });
  return res.json();
}

module.exports = { fetchStatus, fetchConfig };
=======
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const { averageVoltage } = require('./utils');

let mainWindow;
let absorbVoltage = parseFloat(process.env.DEFAULT_ABSORB || '58.2');
let floatVoltage = parseFloat(process.env.DEFAULT_FLOAT || '55.3');
let absorbHours = parseFloat(process.env.DEFAULT_HOURS || '3');


function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  });
  mainWindow.loadFile('index.html');
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('initial-config', {
      username: inverterConfig.username,
      password: inverterConfig.password,
      absorbVoltage,
      floatVoltage,
      absorbHours,
    });
  });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });

// Inverter API configuration
const inverterConfig = {
  host: process.env.INVERTER_HOST || 'http://192.168.1.1',
  username: process.env.INVERTER_USER || '',
  password: process.env.INVERTER_PASS || '',
};

const configPath = path.join(app.getPath('userData'), 'user-config.json');

function loadUserConfig() {
  try {
    const data = fs.readFileSync(configPath, 'utf8');
    const cfg = JSON.parse(data);
    if (cfg.username) inverterConfig.username = cfg.username;
    if (cfg.password) inverterConfig.password = cfg.password;
    if (cfg.absorbVoltage) absorbVoltage = parseFloat(cfg.absorbVoltage);
    if (cfg.floatVoltage) floatVoltage = parseFloat(cfg.floatVoltage);
    if (cfg.absorbHours) absorbHours = parseFloat(cfg.absorbHours);
  } catch (err) {
    // ignore missing file
  }
}

function saveUserConfig() {
  const data = {
    username: inverterConfig.username,
    password: inverterConfig.password,
    absorbVoltage,
    floatVoltage,
    absorbHours,
  };
  try {
    fs.writeFileSync(configPath, JSON.stringify(data));
  } catch (err) {
    log('Failed to save user config: ' + err.message);
  }
}

const logFile = path.join(app.getPath('userData'), 'inverter-log.txt');

function log(message) {
  const time = new Date().toISOString();
  const entry = `[${time}] ${message}\n`;
  fs.appendFileSync(logFile, entry);
  mainWindow.webContents.send('log-message', entry);
}

let voltageHistory = [];

function authHeaders() {
  if (inverterConfig.username) {
    const token = Buffer.from(`${inverterConfig.username}:${inverterConfig.password}`).toString('base64');
    return { 'Authorization': `Basic ${token}` };
  }
  return {};
}

async function readConfig() {
  try {
    const res = await fetch(`${inverterConfig.host}/api/config`, { headers: authHeaders() });
    const cfg = await res.json();
    if (cfg.absorb) absorbVoltage = parseFloat(cfg.absorb);
    if (cfg.float) floatVoltage = parseFloat(cfg.float);
    log(`Config read: Absorb ${absorbVoltage} Float ${floatVoltage}`);
  } catch (err) {
    log('Failed to read configuration: ' + err.message);
  }
}

ipcMain.on('set-config', (_event, config) => {
  if (config.username !== undefined) inverterConfig.username = config.username;
  if (config.password !== undefined) inverterConfig.password = config.password;
  absorbVoltage = parseFloat(config.absorbVoltage) || absorbVoltage;
  floatVoltage = parseFloat(config.floatVoltage) || floatVoltage;
  absorbHours = parseFloat(config.absorbHours) || absorbHours;
  saveUserConfig();
  log(`User config set: Absorb ${absorbVoltage} Float ${floatVoltage} Hours ${absorbHours}`);
});

async function pollInverter() {
  try {
    const status = await fetch(`${inverterConfig.host}/api/status`, { headers: authHeaders() }).then(res => res.json());
    const voltage = parseFloat(status.voltage);
    mainWindow.webContents.send('voltage-update', voltage);
    voltageHistory.push({ time: Date.now(), voltage });
    voltageHistory = voltageHistory.filter(v => Date.now() - v.time <= 6*60*60*1000);
    checkAbsorb();
  } catch (err) {
    log('Failed to poll inverter: ' + err.message);
  }
}

let absorbStart = null;

function checkAbsorb() {
  const avg = averageVoltage(voltageHistory, 15000); // 15 sec averaging
  if (avg >= absorbVoltage) {
    if (!absorbStart) {
      absorbStart = Date.now();
      log('Absorb started');
    }
    const elapsedHours = (Date.now() - absorbStart)/3600000;
    if (elapsedHours >= absorbHours) {
      log('Absorb time reached, switching to float');
      setFloatVoltage();
      absorbStart = null;
    }
  } else {
    absorbStart = null;
  }
}

async function setFloatVoltage() {
  try {
    const body = JSON.stringify({ absorb: floatVoltage, float: floatVoltage });
    await fetch(`${inverterConfig.host}/api/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body,
    });
    log('Inverter set to float voltage ' + floatVoltage);
  } catch (err) {
    log('Failed to write configuration: ' + err.message);
  }
}

app.whenReady().then(() => {
  loadUserConfig();
  readConfig().then(() => {
    setInterval(pollInverter, 5000);
  });
});
>>>>>>> main
>>>>>>> main
