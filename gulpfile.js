const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const del = require('del');


const paths = {
  styles: {
    src: 'src/assets/styles/**/*.scss',
    dest: 'dist/css'
  },

  scripts: {
        src: 'src/assets/js/**/*.js',
    dest: 'dist/js'
  }
}


function clean(){
  return del (['dist '])
}

function styles(){
  return gulp.src(paths.styles.src)
  .pipe(sass())
  .pipe(cleanCSS())
  .pipe(rename({
    basename: 'main',
    suffix: '.min'
  }))
  .pipe(gulp.dest(paths.styles.dest))
}

function scripts(){
  return gulp.src(paths.scripts.src, {
    sourcemaps: true
  })
  .pipe(babel())
  .pipe(uglify())
  .pipe(concat('main.min.js'))
  .pipe(gulp.dest(paths.scripts.dest))
}

function watch() {
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.styles.src, scripts)
}

const build = gulp.series(clean, gulp.parallel(styles, scripts), watch)

exports.clean = clean
exports.styles = styles
exports.watch = watch
exports.scripts = scripts
exports.build = build
exports.default = build