function averageVoltage(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return 0;
  }
  const sum = values.reduce((acc, v) => acc + v, 0);
  return sum / values.length;
}

module.exports = { averageVoltage };
