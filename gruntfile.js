module.exports = function(grunt){
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

       postcss: {
		  options: {
		    map: true,
		    processors: [
		      require('autoprefixer')({browsers: ['> 1% in US', 'last 3 versions', 'IE >= 8']})
		    ]
		  },
		  dist: {
		    src: 'dev/css/style.css',
		    dest: 'dev/css/style_auto.css'
		  }
		},

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
		            //'dev/vendor/d3_2.7.0/d3.csv.min.js',
		            'dev/vendor/d3_2.7.0/d3compat.min.js',
		            'dev/vendor/d3_2.7.0/circle_packer_movers.js' 
		        ],
		        dest: 'lib/d3.build.js',
			},
			FC: {
				src: [
					'dev/vendor/scrollstory.min.js',
		            'dev/vendor/d3v4/d3-custom.min.js',
		            'dev/tools/freight_story/bubble_chart.js',
		            'dev/tools/freight_story/story-controls.js'
				],
				dest: 'lib/freight-story.js'
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
		    },
		    tools: {
		    	files: [{
		    		expand:true,
		    		cwd: 'dev/tools/',
		    		src:['**/*.js'],
		    		dest: 'lib/tools/',
		    		ext: '.js'
		    	}]
			},
			FC: {
				src: 'lib/freight-story.js',
		        dest: 'html/lib/tools/freight-story/freight-story.min.js'
			},
			geo: {
				src: 'dev/tools/freight_story/geo-distribution.js',
				dest: 'html/lib/tools/freight-story/geo-distribution.js'
			}
		},

		cssmin: {
		   dist: {
			    files: {
			         'lib/style.min.css': [
			         	//'dev/core/dyna.css',
			         	'dev/css/typeahead.min.css',
			         	//'dev/css/pfficons.css',
			         	'dev/vendor/flexslider.css',
			         	'dev/css/nouislider.min.css',
			         	'dev/css/style_auto.css'
			         ]
			    }
		  },
		  FC: {
			  files: {
				'html/lib/tools/freight-story/freight-story.min.css': [
					// 'dev/locals/bootstrap.min.css',
					'dev/css/scss/freight-story.min.css'
				]	
			  }
		  }
		},

		clean: {
			js: ['lib/*.js', '!lib/*.min.js'],
			css: ['dev/css/style_auto.css']
		},

		copy: {
				
				corefonts: {
					expand: true,
					cwd: 'dev/core/fonts/',
					dest: './lib/fonts/',
					src: '**'
				},
				images:{
					expand: true,
					cwd: 'dev/images/',
					dest: './lib/images/',
					src: ['**']
				},
				lib: {
					expand: true,
					cwd: 'lib/',
					src: ['**'],
					dest: './html/lib/'
					
				},
				includes: {
					expand: true,
					cwd: './includes/',
					dest: './html/includes/',
					src: ['**']
				},
				modals: {
					expand: true,
					cwd: 'modals/',
					dest: './html/modals/',
					src: ['**']
				},
				data: {
					expand: true,
					cwd: 'data/',
					dest: './html/data/',
					src: ['**']
				},
				index: {
					src: ['index.htm'],
					dest: './html/'
				},
				FC: {
					src: ['freight-center-story.html'],
					dest: './html/'
				},
				bootstrap: {
					expand: true,
					cwd: './dev/tools/freight_story/',
					src: 'bootstrap.min.js',
					dest: './html/lib/tools/freight-story/'
				}

				

			
		},
		sass: {
			options: {
				sourceMap: true,
				outputStyle: 'compressed'
			},
			dist: {
				files: {
					'dev/css/scss/freight-story.min.css': 'dev/css/scss/freight-story.scss'
				}
			}
		},

		jshint: {
			options: {
	            reporter: require('jshint-stylish')
	        },
			tools : ['lib/tools/*.js']
		},

		watch: {
			toolscripts: {
      			files: ['dev/tools/**/*.js'],
      			tasks: ['uglify:tools', 'copy:lib']
      		},
      		cssUpdate: {
      			files: ['dev/css/*.css', '!dev/css/style_auto.css'],
      			tasks: ['postcss', 'cssmin', 'copy:lib', 'clean:css']
      		},
      		coreUpdate: {
      			files: ['dev/core/*.js', 'dev/actions.js', 'dev/map.js'],
      			tasks: ['concat:build', 'uglify:build', 'copy:lib']

      		},
      		html: {
      			files: ['*.htm'],
      			tasks: ['copy:index']
      		},
      		includes: {
      			files: ['**/*.html'],
      			tasks: ['copy:includes']
      		},
			FCtool: {
				files: ['dev/tools/freight_story/*'],
				tasks: ['concat:FC', 'uglify:FC', 'uglify:geo', 'cssmin:FC','copy:FC' ]
			},
			FChtml: {
				files: ['./*.html'],
				tasks: ['copy:FC']
			}, 
			fcCss: {
				files: ['dev/css/**/*.scss'],
				tasks: ['sass', 'cssmin:FC']
			}
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
			},
			gif:{
				options:{
					interlaced:true
				},
				files:[
					{
						expand: true,
						cwd: 'dev/images/',
						src: ['**/*.gif'],
						dest: 'lib/images/',
						ext: '.gif'	
					}
				]
			}
		}
    });

    grunt.registerTask('default', ['concat', 'uglify', 'postcss', 'cssmin', 'clean']);
    grunt.registerTask('publish', ['default', 'imagemin', 'copy-noImages']);
    grunt.registerTask('quickPublish', ['default', 'copy']);
    grunt.registerTask('updatecss', ['postcss', 'cssmin']);
    grunt.registerTask('updatejs', ['concat', 'uglify', 'clean:js']);
    grunt.registerTask('imageUpdates', ['imagemin']);
    grunt.registerTask('start', ['express', 'watch']);
    grunt.registerTask('copy-all', ['copy']);
	grunt.registerTask('copy-noImages', ['copy:corefonts', 'copy:lib', 'copy:includes', 'copy:modals', 'copy:data', 'copy:index']);
	grunt.registerTask('fc-story', ['sass', 'concat:FC', 'uglify:FC', 'uglify:geo', 'cssmin:FC','copy:FC','copy:bootstrap' ]);
};