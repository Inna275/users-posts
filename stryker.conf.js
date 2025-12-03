export default {
  mutate: ['src/modules/**/*.js'],
  testRunner: 'command',
  commandRunner: {
    command:
      'node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand',
  },
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress'],
  coverageAnalysis: 'off',
  concurrency: 1,
};
