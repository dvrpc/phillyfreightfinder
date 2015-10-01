module.exports = function(grunt){
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {  
        	options: {
        		separator: ';\n'
        	}, 
		    build: {
		        src: [
		            'dev/core/dyna-icons.js',
		            'dev/vendor/*.js',
		            'dev/actions.js',
		            'dev/map.js',
		            'dev/core/core.js' 
		        ],
		        dest: 'lib/build.js',
		    },
		    d3: {
		        src: [
		            'dev/vendor/d3_2.7.0/d3.min.js',
		            'dev/vendor/d3_2.7.0/d3.csv.min.js',
		            'dev/vendor/d3_2.7.0/d3compat.min.js',
		            'dev/vendor/d3_2.7.0/circle_packer_movers.js' 
		        ],
		        dest: 'lib/d3.build.js',
		    }
		},

		uglify: {
		    build: {
		        src: 'lib/build.js',
		        dest: 'lib/build.min.js'
		    },
		    d3: {
		        src: 'lib/d3.build.js',
		        dest: 'lib/d3.build.min.js'
		    }
		},

		cssmin: {
		   dist: {
			    files: {
			         'lib/style.min.css': [
			         	'dev/core/dyna.css',
			         	'dev/css/typeahead.min.css',
			         	'dev/css/pfficons.css',
			         	'dev/css/tipsy.css',
			         	'dev/css/nouislider.min.css',
			         	'dev/css/style.css'
			         ]
			    }
		  }
		},

		clean: {
			js: ['lib/*.js', '!lib/*.min.js']
		},

		copy: {
				lib: {
					expand: true,
					cwd: 'lib/',
					src: ['**'],
					dest: 'html/lib/'
					
				},
				includes: {
					expand: true,
					cwd: 'includes/',
					dest: 'html/includes/',
					src: ['**']
				},
				data: {
					expand: true,
					cwd: 'data/',
					dest: 'html/data/',
					src: ['**']
				},
				index: {
					src: ['index.htm'],
					dest: 'html/'
				}
		},

		jshint: {
			options: {
	            reporter: require('jshint-stylish')
	        },
			tools : ['lib/tools/*.js']
		},

		imagemin:{
			png:{
				options:{
					optimizationLevel: 7
				},
				files: [
					{
						expand: true,
						cwd: 'dev/images/',
						src: ['**/*.png'],
						dest: 'lib/images/',
						ext: '.png'
					}
				]
			},
			jpeg:{
				options:{
					progressive:true
				},
				files:[
					{
						expand: true,
						cwd: 'dev/images/',
						src: ['**/*.jpg'],
						dest: 'lib/images/',
						ext: '.jpg'	
					}
				]
			}
		}
    });

    grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'clean']);
    grunt.registerTask('publish', ['default', 'imagemin', 'copy']);
    grunt.registerTask('updatecss', ['cssmin']);
    grunt.registerTask('updatejs', ['concat', 'uglify', 'clean']);
    grunt.registerTask('imageUpdates', ['imagemin']);
    grunt.registerTask('start', ['express', 'watch']);
};