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
		    }
		},

		cssmin: {
		   dist: {
			    files: {
			         'lib/style.min.css': [
			         	//'dev/core/dyna.css',
			         	'dev/css/typeahead.min.css',
			         	//'dev/css/pfficons.css',
			         	'dev/css/tipsy.css',
			         	'dev/vendor/flexslider.css',
			         	'dev/css/nouislider.min.css',
			         	'dev/css/style_auto.css'
			         ]
			    }
		  }
		},

		clean: {
			js: ['lib/*.js', '!lib/*.min.js']
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
					cwd: 'includes/',
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
      			files: ['dev/tools/*.js'],
      			tasks: ['uglify:tools', 'copy:lib']
      		},
      		cssUpdate: {
      			files: ['dev/css/*.css'],
      			tasks: ['postcss', 'cssmin']
      		},
      		coreUpdate: {
      			files: ['dev/core/*.js', 'dev/actions.js', 'dev/map.js'],
      			tasks: ['concat:build', 'uglify:build']
      		},
      		html: {
      			files: ['*.htm'],
      			tasks: ['copy:index']
      		},
      		includes: {
      			files: ['**/*.html'],
      			tasks: ['copy:includes']
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
    grunt.registerTask('updatejs', ['concat', 'uglify', 'clean']);
    grunt.registerTask('imageUpdates', ['imagemin']);
    grunt.registerTask('start', ['express', 'watch']);
    grunt.registerTask('copy-all', ['copy']);
    grunt.registerTask('copy-noImages', ['copy:corefonts', 'copy:lib', 'copy:includes', 'copy:modals', 'copy:data', 'copy:index']);
};