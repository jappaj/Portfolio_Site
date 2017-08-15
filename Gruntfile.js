module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      
      build: {
        src: 'build/build.js',
        dest: 'build/<%= pkg.name %>.min.js'
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
              src: 'build/build.css',
              dest: 'build/<%= pkg.name %>.min.css'
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
            cmd: "python src/templates/mustache_gen.py src/templates/templateDataDigital.json \"mustache -p src/templates/footer.mustache -p src/templates/header.mustache %s src/templates/project-single.mustache digital/%s\""
        },
        batchPrint: {
            cmd: "python src/templates/mustache_gen.py src/templates/templateData.json \"mustache -p src/templates/footer.mustache -p src/templates/header.mustache %s src/templates/project-single.mustache print/%s\""
        },
        about: {
            cmd: "mustache -p src/templates/footer.mustache -p src/templates/header.mustache src/templates/templateData.json src/templates/about.mustache about.html"
        }
      },
      concat: {
          css: {
              src: 'src/css/*.css',
              dest: 'build/build.css'
          },
          js: {
              src: 'src/js/*.js',
              dest: 'build/build.js',
              options: {
                  banner: '$(function() {',
                  footer: '});'
              }
          },
      },
      clean: {
          css: ['build/build.css'],
          js: ['build/build.js']  
      },
      watch: {
          css: {
              files: ['src/css/*.css'],
              tasks: ['concat:css', 'postcss', 'clean:css']
          },
          js: {
              files: ['src/js/*.js'],
              tasks: ['concat:js', 'uglify', 'clean:js']
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