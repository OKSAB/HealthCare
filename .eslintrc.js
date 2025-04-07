module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      // Override for test files
      files: ['**/__tests__/**/*.{js,jsx,ts,tsx}', '**/?(*.)+(spec|test).{js,jsx,ts,tsx}'],
      env: {
        jest: true,
      },
    },
  ],
};
