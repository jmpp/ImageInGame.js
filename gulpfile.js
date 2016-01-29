var gulp   = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var clean  = require('gulp-clean');

gulp.task('clean', function() {
	return gulp.src('./build', {read: false})
		.pipe(clean());
});

gulp.task('build', function() {
	return gulp.src(['./src/IIG.js', './src/ImageManager.js', './src/Animation.js', './src/Image.js', './src/Utils.js'])
					.pipe(concat('IIG.js'))
					.pipe(gulp.dest('./build/'))
					.pipe(uglify())
					.pipe(rename({suffix:'.min'}))
					.pipe(gulp.dest('./build/'));
});

gulp.task('watch', function() {
	gulp.watch('./src/*.js', ['clean', 'build']);
});

gulp.task('default', ['clean', 'build', 'watch']);