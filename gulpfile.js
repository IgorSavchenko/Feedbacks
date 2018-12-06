var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var autoprefixer = require('autoprefixer');
var postcss = require('gulp-postcss');
var inlineSvg = require("gulp-inline-svg");
const tinypng = require('gulp-tinypng-unlimited');

var config = {
  src:  'src',
  dist: 'dist'
}

gulp.task('minify', function() {
  return gulp.src(config.src+'/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(config.dist))
    .pipe(browserSync.stream());
});

gulp.task('inline-svg', function() {
    return gulp.src(config.src+"/assets/svg/*.svg")
        .pipe(inlineSvg())
        .pipe(gulp.dest(config.src+"/assets/scss/helpers/"))
        .pipe(browserSync.stream());
});

gulp.task('tinypng', () => {
  return gulp.src(config.src+'/assets/img/**/*.@(png|jpg|jpeg)')
    .pipe(tinypng())
    .pipe(gulp.dest(config.dist+'/assets/img/'));
});

gulp.task('scss', function () {
  return gulp.src(config.src+'/assets/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(postcss([ autoprefixer() ]))
    .pipe(rename('main.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.dist+'/assets/css/'))
    .pipe(browserSync.stream());
});

function bundle (bundler) {
  bundler
    .bundle()
    .pipe(source(config.src+'/assets/js/main.js'))
    .pipe(buffer())
    .pipe(rename('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(config.dist+'/assets/js/'))
    .pipe(browserSync.stream());
}

gulp.task('js', function () {
  const bundler = browserify(config.src+'/assets/js/main.js')
    .transform(babelify, {
      presets : ['es2015']
    });
  bundle(bundler);
});

gulp.task('watch', function() {
  browserSync.init({
    server: './'+config.dist
  });
  gulp.watch(config.src+'/*.html', ['minify']);
  gulp.watch(config.src+'/assets/svg/*.svg', ['inline-svg']);
  gulp.watch(config.src+'/assets/img/**/*.@(png|jpg|jpeg)', ['tinypng']);
  gulp.watch(config.src+'/assets/scss/**/*.scss', ['scss']);
  gulp.watch(config.src+'/assets/js/**/*.js', ['js']);
});

gulp.task('default', [ 'watch', 'tinypng', 'inline-svg', 'minify', 'scss', 'js']);
