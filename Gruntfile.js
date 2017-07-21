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

  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify', 'postcss', 'clean']);
};