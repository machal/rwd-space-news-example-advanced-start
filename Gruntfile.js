/*

Ukoly nad assety: kombilace CSS, JS, zmensovani IMG…
=====================================================

*/

module.exports = function(grunt) {
  "use strict";

  // zjistujeme cas behu tasku
  require('time-grunt')(grunt);

  // jit-grunt pro zrychleni nacitani gruntu a behu tasku
  require('jit-grunt')(grunt);


  // Nastaveni tasku
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // Copy
    // ====

    copy: {
      fancybox: {
        files: [
          {
            expand: true,
            cwd: 'node_modules/fancybox/dist/css/',
            src: ['jquery.fancybox.css'],
            dest: 'src/less/lib/',
            rename: function(dest, src) {
              return dest + src.replace(/\.css$/, ".less");
            }
          },
          {
            expand: true,
            cwd: 'node_modules/fancybox/dist/img/',
            src: ['*.*'],
            dest: 'src/img/'
          },
        ]
      },
      respond: {
        files: {
          'dist/js/lib/respond.min.js': 'node_modules/respond.js/dest/respond.min.js'
        }
      }
    },

    // CSS
    // ===

    // LESS kompilace
    // --------------

    less: {
      default: {
        files: {
          'dist/css/style.css': 'src/less/index.less'
        }
      },
      sourcemaps: {
        files: {
          'dist/css/style.css': 'src/less/index.less'
        },
        options: {
          sourceMap: true,
          sourceMapFilename: 'dist/css/style.css.map',
          sourceMapURL: 'style.css.map',
          sourceMapRootpath: '/'
        }
      }
    },

    // Autoprefixer
    // ------------

    // Automaticky pridava browser prefixy co vykompilovaneho CSS.

    autoprefixer: {
      options: {
        browsers: ['last 3 versions', 'ios 6', 'ie 7', 'ie 8', 'ie 9'],
        map: true // Updatni SourceMap
      },
      style: {
          src: 'dist/css/style.css',
          dest: 'dist/css/style.css'
      }
    },


    // CSSmin
    // ------

    // Minifikujeme inlinované CSSka.
    // Nepoužíváme na style.css, protože odstraňuje SourceMapy. Ale bylo
    // by to efektivnější než minifikovat LESSem.

    cssmin: {
      css: {
        files: {
          'dist/css/style.min.css': 'dist/css/style.css'
        }
      }
    },

    // Javascript
    // ==========

    browserify : {
      main : {
        files : { 'dist/js/script.js' : ['src/js/index.js'] }
      },
      options: {
        transform: ['debowerify'],
        debug: true
      }
    },

    // Concat: spojovani JS
    // --------------------

    concat: {
      mainJS: {
          src: [
            'node_modules/jquery/dist/jquery.js',
            'node_modules/fancybox/dist/js/jquery.fancybox.js'
          ],
          dest: 'dist/js/script.js'
      },
    },

    // Uglify: minifikace JS
    // ---------------------

    uglify: {
      script: {
          src: 'dist/js/script.js',
          dest: 'dist/js/script.min.js'
      }
    },

    // responsive_images
    // -----------------
    // Vyroba zmensenin obrazku po potreby <img srcset>.

    responsive_images: {
      options: {
        sizes: [
        {
          name: "small",
          width: 400,
          height: 225
        },
        {
          name: "medium",
          width: 1024,
          height: 576
        },
        {
          name: "large",
          width: 1600,
          height: 900
        }
        ]
      },
      files: {
        expand: true,
        src: ['**.jpg'],
        cwd: 'src/img/content/',
        dest: 'dist/img/content/'
      },
    },

    // 4) browserSync a watch
    // ======================

    // browserSync
    // -----------

    // Spusti server na http://localhost:3000/, externe pak na
    // adrese, kterou zobrazi pri startu.
    // Injectuje zmeny v bsFiles bez nutnosti reloadu.
    // Synchronizuje zobrazeni napric zarizenimi.

    browserSync: {
      dev: {
          bsFiles: {
              src : [
                'dist/css/*.css'
              ]
          },
          options: {
              watchTask: true,
              proxy: 'sites.localhost'
          }
      }
    },

    // watch
    // -----

    // Sleduje zmeny v LESS a JS souborech a spousti souvisejici tasky.

    watch: {
      less: {
        files: 'src/less/**/*.less',
        tasks: ['css']
      },
      js: {
        files: 'src/js/*.js',
        tasks: ['js']
      }
    },

  });


  // 5) Alias tasky
  // ==============

  grunt.registerTask('css', ['less:default', 'autoprefixer', 'cssmin']);
  grunt.registerTask('js', ['concat', 'uglify']);
  grunt.registerTask('default', ['copy', 'css', 'js', 'browserSync', 'watch']);

};
