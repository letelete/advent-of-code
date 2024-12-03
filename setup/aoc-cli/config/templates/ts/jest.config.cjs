module.exports = {
  verbose: true,
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          target: 'es2022',
        },
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};
