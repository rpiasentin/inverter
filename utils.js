function averageVoltage(readings, durationMs) {
  const cutoff = Date.now() - durationMs;
  const entries = readings.filter(v => v.time >= cutoff);
  if (entries.length === 0) return 0;
  const total = entries.reduce((sum, v) => sum + v.voltage, 0);
  return total / entries.length;
}
module.exports = { averageVoltage };

