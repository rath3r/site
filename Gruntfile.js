module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
        '* <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '*/\n',
        clean: {
            build: {
                src: [
                    "dest",
                    ".tmp"
                ]
            }
        },
        htmltidy: {
            sites: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: '**/*.html',
                    dest: 'dest/'
                }]
            }
        },
        wkhtmltopdf: {
            dev: {
                src: 'dest/*.html',
                dest: 'dest/'
            }
        },
        assemble:{
            options: {
                assets: 'assets',
                partials: ['templates/includes/*.hbs'],
                layoutdir: 'templates/layouts'
            },
            site: {
                options: {
                    layout: 'index.hbs',
                    flatten: 'true'
                },
                src: ['templates/*.hbs'],
                dest: 'dest/'
            }
        },
        less: {
            dev: {
                src: [
                    'bower_components/bootstrap/less/bootstrap.less',
                    'assets/less/main.less',
                ],
                dest: 'dest/css/main.css',
            }
        },
        concat: {
            options: {
                stripBanners: true,
                banner: '<%= banner %>'
            },
            main: {
                src: [
                    'assets/js/app.js'
                ],
                dest: 'dest/js/app.js'
            },
            libs: {
                src: [
                    'bower_components/jquery/dist/jquery.min.js',
                    'bower_components/bootstrap/dist/js/bootstrap.min.js'
                ],
                dest: 'dest/js/libs.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            main: {
                src: ['<%= concat.main.dest %>'],
                dest: 'dest/js/app.min.js'
            },
            libs: {
                src: ['<%= concat.libs.dest %>'],
                dest: 'dest/js/libs.min.js'
            }
        },
        cssmin: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'dest/css/',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dest/css/',
                    ext: '.min.css'
                }]
            }
        },
        watch: {
            assemble: {
                files: ['templates/**/*.hbs'],
                tasks: ['assemble']
            },
            less : {
                files : 'assets/less/**',
                tasks : [ 'less:dev' ]
            },
            concat: {
                files: '<%= concat.main.src %>',
                tasks: ['concat']
            },
            uglify: {
                files: '<%= concat.main.dest %>',
                tasks: ['uglify']
            }
        }
    });

    grunt.loadNpmTasks('grunt-htmltidy');
    grunt.loadNpmTasks('grunt-wkhtmltopdf');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    //'htmltidy'
    //grunt.registerTask('htmltidy', [
    //    'htmltidy'
    //]);

    // pdf
    grunt.registerTask('pdf', [
        'wkhtmltopdf'
    ]);

    // js
    grunt.registerTask('js', [
        'concat',
        'uglify'
    ]);

    // css
    grunt.registerTask('css', [
        'less',
        'cssmin'
    ]);

    // Default task(s).
    grunt.registerTask('default', [
        'clean',
        'assemble',
        'css',
        'js'
    ]);
};