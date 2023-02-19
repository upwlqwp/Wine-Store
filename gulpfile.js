const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const svgSprite = require('gulp-svg-sprite');
const gulpCheerio = require('gulp-cheerio');
const gulpReplace = require('gulp-replace');
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require('gulp-sourcemaps');
const browsersync = require('browser-sync').create();
const del = require('del');


const paths = {

  html: {
    src: 'src/*.html',
    dest: 'dist'
  },

  styles: {
    src: 'src/assets/styles/**/*.scss',
    dest: 'dist/css'
  },

  scripts: {
    src: 'src/assets/js/**/*.js',
    dest: 'dist/js'
  },
  images: {
    src: 'src/assets/images/**',
    dest: 'dist/images'
  },

  svgSprite: {
    src: "src/assets/images/icons/**.svg",
    dest: "dist/images/icons",
  }

};


function clean() {
  return del(['dist '])
}

function html() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'))
    .pipe(browsersync.stream())
}

function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browsersync.stream())
}

function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browsersync.stream())
}


function images() {
  return gulp.src(paths.images.src)
    .pipe(imagemin())
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(gulp.dest(paths.images.dest))


}

function svgSprites() {
  return gulp
    .src(paths.svgSprite.src)
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: "../sprite.svg",
          },
        },
      })
    )

    .pipe(
      gulpCheerio({
        run: ($) => {
          $("[fill]").removeAttr("fill");
          $("[stroke]").removeAttr("stroke");
          $("[style]").removeAttr("style");
        },
        parserOptions: { xmlMode: true },
      })
    )

    .pipe(gulpReplace("&gt;", ">"))
    .pipe(gulp.dest(paths.images.dest))
}

function watch() {
  browsersync.init({
    server: {
      baseDir: "./dist/"
    }
  })
  gulp.watch(paths.html.dest).on('change', browsersync.reload)
  gulp.watch(paths.html.src, html)
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.styles.src, scripts)
  gulp.watch(paths.images.src, images)
}

const build = gulp.series(clean, html, gulp.parallel(styles, scripts, images, svgSprites), watch)

exports.clean = clean
exports.style = styles
exports.watch = watch
exports.scripts = scripts
exports.images = images
exports.svgSprites = svgSprites
exports.html = html
exports.build = build
exports.default = build