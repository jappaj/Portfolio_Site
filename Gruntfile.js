module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n$(function() {',
        footer: '});'
      },
      
      index: {
        src: 'build/temp/js/index.js',
        dest: 'build/js/index.min.js'
      },
      single: {
        src: 'build/temp/js/single.js',
        dest: 'build/js/single.min.js'
      },
      list: {
        src: 'build/temp/js/list.js',
        dest: 'build/js/list.min.js'
      }
    },
    postcss: {
          options: {
              processors: [
                  require('autoprefixer')(),
                  require('pixrem')(),
                  require('cssnano')()
              ]
          },
          dist: {
              src: 'build/css/build.css',
              dest: 'build/css/<%= pkg.name %>.min.css'
          }
      },
      exec: {
        listDigital: {
            cmd: "mustache -p src/templates/footer.mustache -p src/templates/header.mustache src/templates/templateDataDigital.json src/templates/template.mustache digital/digital.html"
        },
        listPrint: {
            cmd: "mustache -p src/templates/footer.mustache -p src/templates/header.mustache src/templates/templateData.json src/templates/template.mustache print/print.html"
        },
        batchDigital: {
            cmd: "python src/templates/mustache_gen.py src/templates/templateDataDigital.json \"mustache -p src/templates/footer.mustache -p src/templates/header.mustache %s src/templates/project-single.mustache digital/project/%s\""
        },
        batchPrint: {
            cmd: "python src/templates/mustache_gen.py src/templates/templateData.json \"mustache -p src/templates/footer.mustache -p src/templates/header.mustache %s src/templates/project-single.mustache print/project/%s\""
        },
        about: {
            cmd: "mustache -p src/templates/footer.mustache -p src/templates/header.mustache src/templates/templateData.json src/templates/about.mustache about.html"
        }
      },
      concat: {
          css: {
              src: 'src/css/*.css',
              dest: 'build/css/build.css'
          },
          js: {
              files: {
                  'build/temp/js/index.js': ['src/js/index.js', 'src/js/registration-effect.js'],
                  'build/temp/js/single.js': ['src/js/individual.js', 'src/js/registration-effect.js', 'src/js/template.js'],
                  'build/temp/js/list.js': ['src/js/template.js', 'src/js/registration-effect.js'],
              }
          },
      },
      clean: {
          css: ['build/css/build.css'],
          js: ['build/temp/js/*.js']  
      },
      watch: {
          css: {
              files: ['src/css/*.css'],
              tasks: ['concat:css', 'postcss', 'clean:css']
          },
          js: {
              files: ['src/js/*.js'],
              tasks: ['concat:js', 'uglify', 'clean:js']
          },
          mustache: {
              files: ['src/templates/*.mustache'],
              tasks: ['exec']
          }
      }
      
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');

  // Default task(s).
  grunt.registerTask('default', ['exec', 'concat', 'uglify', 'postcss', 'clean']);
};