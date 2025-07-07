const voltageDisplay = document.getElementById('voltage-display');
const logOutput = document.getElementById('log-output');

document.getElementById('setConfig').addEventListener('click', () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const absorbVoltage = document.getElementById('absorbVoltage').value;
  const floatVoltage = document.getElementById('floatVoltage').value;
  const absorbHours = document.getElementById('absorbHours').value;
  window.electronAPI.setConfig({ username, password, absorbVoltage, floatVoltage, absorbHours });
});

window.electronAPI.onInitialConfig(cfg => {
  document.getElementById('username').value = cfg.username || '';
  document.getElementById('password').value = cfg.password || '';
  document.getElementById('absorbVoltage').value = cfg.absorbVoltage || '';
  document.getElementById('floatVoltage').value = cfg.floatVoltage || '';
  document.getElementById('absorbHours').value = cfg.absorbHours || '';
});

window.electronAPI.onVoltageUpdate(voltage => {
  voltageDisplay.textContent = voltage.toFixed(2) + ' V';
});

window.electronAPI.onLogMessage(message => {
  logOutput.textContent += message;
  logOutput.scrollTop = logOutput.scrollHeight;
});
