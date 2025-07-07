const { averageVoltage } = require('./main');

test('averageVoltage computes average of array', () => {
  const voltages = [1, 5, 9];
  expect(averageVoltage(voltages)).toBeCloseTo(5);
});
