"use strict";

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var maps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();

// Compile js
gulp.task("concatScripts", function() {
	return gulp.src([
		'js/ie10-viewport-bug-workaround.js',
		'js/offcanvas.js',
		'js/search.js',
		'js/transformer-tabs.js'
		])
	.pipe(maps.init()) // js source map 1/2
	.pipe(concat('lib-main.js'))
	.pipe(maps.write('./')) // js source map 2/2
	.pipe(gulp.dest('js'));
});

// Minify js
gulp.task("minifyScripts", ["concatScripts"], function() {
	return gulp.src("js/lib-main.js")
		.pipe(uglify())
		.pipe(rename('lib-main.min.js'))
		.pipe(gulp.dest('js'));
});

//Compile Sass to css
gulp.task('compileSass', function() {
	return gulp.src('scss/lib-main.scss')
		.pipe(maps.init()) // Sass source map 1/2
		.pipe(sass())
		.pipe(maps.write('./')) // Sass source map 2/2
		.pipe(gulp.dest('css'))
	.pipe(browserSync.reload({
      stream: true
    }))
});

// Watch Files
gulp.task('watchFiles', ['browserSync', 'compileSass'], function() {
	gulp.watch('scss/**/*.scss', ['compileSass']);
	gulp.watch('lib-main.js', ['concatScripts']);
	gulp.watch('*.html', browserSync.reload);
});

// Load and refresh on local
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './'
    },
  })
})


//gulp.task('serve', ['watchFiles']);

gulp.task("build", ['minifyScripts', 'compileSass', 'watchFiles']);

gulp.task("default", ['build']);