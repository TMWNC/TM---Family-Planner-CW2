// playwright.config.js
module.exports = {
    testDir: './__tests__/IntegrationTests',
    timeout: 30000,
    reporter: [
        ['list'], // terminal output
        ['html', { open: 'never' }] // grouped HTML report
      ],
    use: {
      baseURL: 'http://localhost:3000',
      headless: false,
    },
  };
  