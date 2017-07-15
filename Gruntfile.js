module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      
      build: {
        src: 'src/js/main.js',
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
          dist: {
              src: 'src/css/*.css',
              dest: 'build/build.css'
          }
      },
      clean: ['build/build.css'],
      handlebars: {
          
      }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'concat', 'postcss', 'clean', 'handlebars']);
};