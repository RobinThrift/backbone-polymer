var gulp     = require('gulp'),
    jshint   = require('gulp-jshint'),
    traceur  = require('gulp-traceur'),
    karma    = require('gulp-karma'),

    refresh  = require('gulp-livereload'),
    lrserver = require('tiny-lr')(),
    express  = require('express'),
    lvrel    = require('connect-livereload'),
    lrport   = 35729,
    srvport  = 5000,


    dest     = './build',

    srv, paths;

// setup the server and run when the 'server' task is triggered
srv = express();
srv.use(lvrel({
  port: lrport
}));
srv.use(express.static(dest));


paths = {
    scripts: ['src/**/*.js']
}

gulp.task('lint-scripts', function() {
    return gulp.src(paths.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .on('error', function(err) {
            throw err;
        });
});

gulp.test('test-scripts', function() {
    return gulp.src(paths.scripts)
        .pipe(traceur())
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function(err) {
            throw err;
        });
});

gulp.task('concat-scripts', ['lint-scripts', 'test-scripts'], function() {
    return gulp.src(paths.scripts)
        .pipe(traceur({ sourceMap: true }))
        .pipe(gulp.dest(dest));
});

gulp.task('scripts', ['concat-scripts']);


gulp.task('run-server', function() {
    srv.listen(srvport);
    lrserver.listen(lrport);
});

gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('server', ['default', 'run-server']);


gulp.task('default', ['scripts', 'watch']);