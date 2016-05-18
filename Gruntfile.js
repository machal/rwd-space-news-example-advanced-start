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

    // Rename
    // ======

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
      },
      picturefill: {
        files: {
          'dist/js/lib/picturefill.min.js': 'node_modules/picturefill/dist/picturefill.min.js'
        }
      },
      fontfaceobserver: {
        files: {
          'dist/js/lib/fontfaceobserver.min.js': 'node_modules/fontfaceobserver/fontfaceobserver.standalone.js'
        }
      },
      ajaxInclude: {
        files: {
          'dist/js/lib/ajaxinclude.min.js': 'node_modules/ajaxInclude/dist/ajaxInclude.min.js'
        }
      },
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
          // sourceMapFilename:
          // Pokud nastaveno, zapise se SM do
          // externiho souboru. Uvadi se zde cesta k nemu.
          sourceMapFilename: 'dist/css/style.css.map',
          // sourceMapURL:
          // Prepise vychozi url pro soubor se SM,
          // tak jak se vola na konci zkompilovaneho CSS souboru.
          // Vychozi je obsah `sourceMapFilename`, tady jde prepsat.
          sourceMapURL: 'style.css.map',
          // sourceMapRootpath:
          // Cesta k LESS souborum jek budou volany ze souboru se SM.
          sourceMapRootpath: '/',
          // Komprimovat timto? contrib-css odstranoval sourcemapy
          //compress: true,
        }
      }
    },


    // PostCSS: pridani prefixu

    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({browsers: ['last 3 versions', 'ios 6', 'ie 7', 'ie 8', 'ie 9']}),
        ]
      },
      dist: {
        src: 'dist/css/style.css'
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
      },
      critical: {
        files: {
          'dist/css/critical.min.css': 'dist/css/critical.css'
        }
      }
    },

    // CriticalCSS
    // -----------

    // Vytahuje část CSS nad zlomem pro potřeby inlinování.

    criticalcss: {
        custom: {
            options: {
                url: "http://localhost:3030/",
                width: 1200,
                height: 900,
                outputfile: "dist/css/critical.css",
                filename: "dist/css/style.css",
                ignoreConsole: false
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
            'node_modules/fancybox/dist/js/jquery.fancybox.js',
            'node_modules/ajaxInclude/dist/ajaxInclude.js'
          ],
          dest: 'dist/js/script.js'
      },
    },

    // Uglify: minifikace JS
    // ---------------------

    uglify: {
      mainJS: {
          src: 'dist/js/script.js',
          dest: 'dist/js/script.min.js'
      }
    },

    // 3) Obrazky
    // ==========

    // Imagemin: zmensovani datoveho objemu obrazku
    // --------------------------------------------

    imagemin: {
      // Root
      root: {
        files: [{
          expand: true,
          cwd: 'src/img/',
          src: ['**/*.jpg','**/*.png','**/*.gif'],
          dest: 'dist/img/'
        }]
      },
      // Bitmapy v designu
      bitmap: {
        files: [{
          expand: true,
          cwd: 'src/img/bitmap/',
          src: ['**/*.jpg','**/*.png','**/*.gif'],
          dest: 'dist/img/bitmap/'
        }]
      },
      // Obrazky v obsahu
      content_img: {
        files: [{
          expand: true,
          cwd: 'src/img/content/',
          src: ['**/*.jpg','**/*.png','**/*.gif'],
          dest: 'dist/img/content/'
        }]
      },
      // Vektory
      vector: {
        files: [{
          expand: true,
          cwd: 'src/img/vector/',
          src: ['**/*.svg'],
          dest: 'dist/img/vector/'
        }]
      },
    },

    // SVG2PNG
    // -------
    // Z SVG obrazku dela PNG kopie pro fallbacky.

    svg2png: {
      images: {
        files: [
            { cwd: 'dist/img/vector/', src: ['**/*.svg'] }
        ]
      }
    },

    // responsive_images
    // -----------------
    // Vyroba zmensenin obrazku po potreby <img srcset>.

    responsive_images: {
      options: {
        sizes: [
        {
          name: "xs",
          width: 400,
          height: 225
        },
        {
          name: "sm",
          width: 768,
          height: 432
        },
        {
          name: "md",
          width: 1024,
          height: 576
        },
        {
          name: "lg",
          width: 1300,
          height: 731
        },
        {
          name: "xl",
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
              server: './',
              port: 3030
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

  grunt.registerTask('css', ['less:default', 'postcss', 'cssmin']);
  grunt.registerTask('critical', ['criticalcss', 'cssmin:critical']);
  grunt.registerTask('img', ['imagemin', 'svg2png']);
  grunt.registerTask('js', ['concat', 'uglify']);
  grunt.registerTask('default', ['copy:fancybox', 'css', 'js', 'browserSync', 'watch']);

};
