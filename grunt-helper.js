,
		
		concat: {
			styles: {
				src: [
					'styles/foundation/foundation.min.css',
					'styles/foundation/icons/stylesheets/general_foundicons.css',
					'styles/main.css'
				],
				dest: 'dist/styles/mc-<%= pkg.version %>.css'
			},
			scripts: {
				src: [
					'js/lib/q.js',
					'js/lib/moment.js',
					'js/lib/mustache.js',
					'js/core.js',
					'js/plugins/events-manager.js',
					'js/plugins/dom.js',
					'js/plugins/dom-element.js',
					'js/plugins/ajax.js',
					'js/plugins/utils.js',
					'js/plugins/lastfm.js',
					'js/plugins/models.js',
					'js/plugins/templates.js',
					'js/plugins/goear.js',
					'js/modules/seeker.js',
					'js/modules/search-results.js',
					'js/modules/player.js'
				],
				dest: 'dist/scripts/mc-<%= pkg.version %>.js'
			}
		},

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				// src: '<%= concat.scripts.dest %>.js',
				// dest: 'dist/mc-<%= pkg.version %>.min.js'
				files: {
					'dist/scripts/mc-<%= pkg.version %>.min.js': ['dist/scripts/mc-<%= pkg.version %>.js']
				}
			}
		}