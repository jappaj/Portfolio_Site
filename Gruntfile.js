module.exports = function (grunt) {
	let printSinglePrefix = 'print/project';
	let digitalSinglePrefix = 'digital/project';

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
		htmlmin: {
			options: {
				removeComments: true,
				collapseWhitespace: true
			},

			dist: {
				files: [{
					expand: true,
					src: ['*.html', 'print/*.html', `${printSinglePrefix}/*.html`, `${digitalSinglePrefix}/*.html`]
				}]
			}
		},
		imagemin: {
			dist: {
				options: {
					optimizationLevel: 5
				},
				files: [{
					expand: true,
					src: ['img/*.{png,jpg,gif}', 'img/**/*.jpg'],
				}]
			}
		},
		exec: {
			listDigital: {
				cmd: "mustache -p src/templates/footer.mustache -p src/templates/header.mustache src/templates/data/templateDataDigital.json src/templates/template.mustache digital/digital.html"
			},
			listPrint: {
				cmd: "mustache -p src/templates/footer.mustache -p src/templates/header.mustache src/templates/data/templateDataPrint.json src/templates/template.mustache print/print.html"
			},
			batchDigital: {
				cmd: `python src/templates/scripts/mustache_gen.py src/templates/data/templateDataDigital.json \"mustache -p src/templates/footer.mustache -p src/templates/header.mustache %s src/templates/project-single.mustache ${digitalSinglePrefix}/%s\"`
			},
			batchPrint: {
				cmd: `python src/templates/scripts/mustache_gen.py src/templates/data/templateDataPrint.json \"mustache -p src/templates/footer.mustache -p src/templates/header.mustache %s src/templates/project-single.mustache ${printSinglePrefix}/%s\"`
			},
			about: {
				cmd: "mustache -p src/templates/footer.mustache -p src/templates/header.mustache src/templates/data/templateDataPrint.json src/templates/about.mustache about.html"
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

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-postcss');

	// Default task(s).
	grunt.registerTask('default', ['exec', 'concat', 'uglify', 'postcss', 'clean']);
	grunt.registerTask('prod', ['exec', 'htmlmin' , 'imagemin', 'concat', 'uglify', 'postcss', 'clean']);
};
