module.exports = function (grunt) {
    'use strict';

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        htmlhint: {
            build: {
                options: {
                    'tag-pair': true, // Force tags to have a closing pair
                    'tagname-lowercase': true, // Force tags to be lowercase
                    'attr-lowercase': true, // Force attribute names to be lowercase e.g. <div id="header"> is invalid
                    'attr-value-double-quotes': true, // Force attributes to have double quotes rather than single
                    'spec-char-escape': true, // Force special characters to be escaped
                    'id-unique': true, // Prevent using the same ID multiple times in a document
                    'head-script-disabled': true, // Prevent script tags being loaded in the  for performance reasons
                    'img-alt-require': true, // Force img to have alt attr
                    'doctype-html5': true, // Force html to have html5 doctype
                    'style-disabled': true, // Disable inline style
                    'id-class-value': 'dash' // Allow only dash in class/id names
                },
                src: ['application/index.html', 'application/partials/*.html']
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'application/partials/',
                        src: ['**/*.html'],
                        dest: 'application/partials/',
                        ext: '.html'
                    }
                ]
            }
        },
        // htmlbuild: {
        //     dist: {
        //         src: 'client/indexGruntTemplate.html',
        //         dest: 'client/index.html',
        //         options: {
        //             beautify: true,
        //             /* scripts: {
        //              bundle: [
        //              'scripts*//*.js',
        //              '!**//*main.js',
        //              ],
        //              main: 'scripts/main.js'
        //              },*/
        //             styles: {
        //                 bundle: [
        //                     'client/css/application.min.css'
        //                 ]
        //             }
        //         }
        //     },
        //     dev: {
        //         src: 'client/indexGruntTemplate.html',
        //         dest: 'client/index.html',
        //         options: {
        //             beautify: true,
        //             /* scripts: {
        //              bundle: [
        //              'scripts*//*.js',
        //              '!**//*main.js',
        //              ],
        //              main: 'scripts/main.js'
        //              },*/
        //             styles: {
        //                 bundle: [
        //                     'client/css/**/*.css'
        //                 ]
        //             }
        //         }
        //     }
        // },
        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'application/styles/scss/',
                        src: ['**/*.scss'],
                        dest: 'application/styles/',
                        ext: '.css'
                    }
                ]
            },
            dev: {
                options: {
                    style: 'nested',
                    debugInfo: true,
                    trace: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'application/styles/scss/',
                        src: ['**/*.scss'],
                        dest: 'application/styles/',
                        ext: '.css'
                    }
                ]
            }
        },
        cssmin: {
            build: {
                files: {
                    'application/styles/turan.min.css': [ 'application/styles/**/*.css' ]
                }
            }
        },
        // uglify is not working
        // uglify: {
        //     dist: {
        //         options: {
        //             compress: true
        //         },
        //         my_target: {
        //             files: [
        //                 {
        //                     expand: true,
        //                     cwd: 'client/app/**/',
        //                     src: ['**/*.js'],
        //                     dest: 'client/app/**/',
        //                     ext: '.min.js'
        //                 }
        //             ]
        //         }
        //     },
        //     dev: {
        //         options: {
        //             beautify: true
        //         },
        //         my_target: {
        //             files: [
        //                 {
        //                     expand: true,
        //                     cwd: 'client/app/**/',
        //                     src: ['**/*.js'],
        //                     dest: 'client/app/**/',
        //                     ext: '.js'
        //                 }
        //             ]
        //         }
        //     }
        // },
        clean: {
            dist: {
                build: {
                    src: ['application/styles/**/*.css', '!application/styles/**/*.min.css']
                }
            },
            dev: {
                build: {
                    src: ['application/styles/turan.min.css']
                }
            }
        },
        watch: {
            html: {
                files: ['application/partials/*.html', 'application/index.html'],
                tasks: ['htmlhint']
            },
            sass: {
                files: ['application/styles/scss/**/*.scss'],
                tasks: ['sass:dev']
            }
        }
    });


    /********************  Development ********************/
    grunt.registerTask('dev', ['sass:dev', 'clean:dev'/*, 'htmlbuild:dev'*/]);
    //grunt.registerTask('checkCss', ['sass:dev', 'csslint']);

    /********************  Production ********************/
    //grunt.registerTask('production', ['sass:dist', 'cssmin', 'clean:dist', 'htmlbuild:dist', 'htmlmin:dist', 'uglify:dist']);
};