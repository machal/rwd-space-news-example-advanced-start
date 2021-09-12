// PostCSS
// =======

'use strict';

module.exports = {

  options: {
    map: true,
    processors: [
      // pridani vendor prefixu
      require('autoprefixer')(),
      // media queries z px do em
      require('postcss-em-media-query')({ }),
      // minifikace CSS
      require('cssnano')()
    ]
  },

  default: {
    dist: {
      src: 'dist/css/bundle/style.css'
    }
  },

  components: {
    files: [{
      expand: true,
      cwd: 'dis/css/standalone/',
      src: ['**/*.css'],
      dest: 'dist/css/standalone/',
      ext: '.min.css'
    }]
  }


};
