module.exports = {
    ci: {
      collect: {
        staticDistDir: './',
      },
      assert: {
        assertions: {
          'categories:performance': ['error', {minScore: 0.8}],
          'categories:accessibility': ['warn', {minScore: 1}]
        }
      },
      upload: {
        target: 'temporary-public-storage',
      },
    },
  };
