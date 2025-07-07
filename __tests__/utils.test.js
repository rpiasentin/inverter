const { averageVoltage } = require('../utils');

test('averageVoltage averages readings within duration', () => {
  const now = Date.now();
  jest.spyOn(Date, 'now').mockReturnValue(now);
  const readings = [
    { time: now - 1000, voltage: 58 },
    { time: now - 2000, voltage: 60 },
    { time: now - 20000, voltage: 50 },
  ];
  const result = averageVoltage(readings, 5000);
  expect(result).toBeCloseTo(59);
});

