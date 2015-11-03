module.exports = function  (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // compass
        compass: {
            dist: {
                options: {
                    sassDir: 'public/sass',
                    cssDir: 'public/css',
                    outputStyle: 'expanded',
                    noLineComments: true
                }
            }
        },
        concat: {
            options: {
                separator: ''
            },
            dist: {
                src: ['public/css/**/*.css'],
                dest: 'public/css/bundle.css'
            }
        },
        watch: {
            sass: {
                files: ['public/sass/**/*.scss'],
                tasks: ['compass']
            }
        }
    });

    // load tasks
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // register tasks

}