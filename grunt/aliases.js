// Pojmenovane Grunt ulohy
// =======================

'use strict';

module.exports = {

  css: [
    'less:default',
    'postcss'
  ],

  css_components: [
    'less:components',
    'postcss:components'
  ],

  content_img: [
    'imagemin:content',
    'imagemin:content_nonprogressive',
    'imagemin:content_mozjpeg',
    'imagemin:content_guetzli',
    'imagemin:content_webp'
  ],

  js: [
    'uglify'
  ],

  dist: [
    'copy',
    'css',
    'js'
  ],

  default: [
    'copy',
    'browserSync',
    'watch'
  ]

};

