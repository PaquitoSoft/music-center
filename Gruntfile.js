module.exports = function(grunt) {

	// show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: ['dist'],

		copy: {
			main: {
				files: [
					{
						src: ['index.html', 'styles/img/*'],
						dest: 'dist/'
					},
					{
						src: ['styles/fonts/general_foundicons.eot'],
						dest: 'dist/fonts/general_foundicons.eot'
					},
					{
						src: ['styles/fonts/general_foundicons.svg'],
						dest: 'dist/fonts/general_foundicons.svg'
					},
					{
						src: ['styles/fonts/general_foundicons.ttf'],
						dest: 'dist/fonts/general_foundicons.ttf'
					},
					{
						src: ['styles/fonts/general_foundicons.woff'],
						dest: 'dist/fonts/general_foundicons.woff'
					}
				]
			}
		},

		rev: {
			files: {
				src: [
					'dist/js/**/*.js',
					'dist/styles/**/*.css',
					'dist/styles/**/*.{gif,png}'
				]
			}
		},

		useminPrepare: {
			html: 'index.html',
			options: {
				dest: 'dist'
			}
		},

		usemin: {
			html: 'dist/index.html',
			css: 'dist/styles/**/*.css',
			options: {
				dirs: ['dist']
			}
		},

		jshint: {
			files: ['js/**/*.js'],
			options: {
				ignores: ['js/lib/**/*.js'],
				globals: {
					console: true
				}
			}
		}

	});


	// Build deployment version
	grunt.registerTask('build', ['jshint', 'clean', 'copy', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'rev', 'usemin']);

	// Default task(s).
	grunt.registerTask('default', ['jshint']);

};