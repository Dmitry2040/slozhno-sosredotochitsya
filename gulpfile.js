const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create(); 
const build = gulp.series(clean, gulp.parallel(html, css, images));
const watchapp = gulp.parallel(build, watchFiles, serve);
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mediaquery = require('postcss-combine-media-query');
const htmlMinify = require('html-minifier'); 

function html() {
      const options = {
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            sortClassName: true,
            useShortDoctype: true,
            collapseWhitespace: true,
            minifyCSS: true,
            keepClosingSlash: true
      };
    return gulp.src('src/**/*.html')
        .pipe(plumber())
              .on('data', function(file) {
            const buferFile = Buffer.from(htmlMinify.minify(file.contents.toString(), options))
            return file.contents = buferFile
        })
            .pipe(gulp.dest('dist/'))
            .pipe(browserSync.reload({stream: true}));
  }
  
function css() {
  const plugins = [
      autoprefixer(),
      mediaquery()
  ];
  return gulp.src('src/**/*.css')
        .pipe(plumber())
        .pipe(concat('bundle.css'))
        .pipe(postcss(plugins))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}));
}

function images() {
    return gulp.src('src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}')
              .pipe(gulp.dest('dist/images'))
  }

function fonts() {
   return gulp.src('src/fonts/**/*.{ttf,otf,woff,woff2}')
             .pipe(gulp.dest('dist/fonts'))
             .pipe(browserSync.reload({stream: true}));
 }

function videos() {
   return gulp.src('src/videos/**/*.{mp4,ogg,ogv,webm}')
             .pipe(gulp.dest('dist/fonts'))
             .pipe(browserSync.reload({stream: true}));
 }

function clean() {
   return del('dist');
 }
  
function watchFiles() {
   gulp.watch(['src/**/*.html'], html);
   gulp.watch(['src/blocks/**/*.css'], css);
   gulp.watch(['src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}'], images);
 }

function serve() {
   browserSync.init({
     server: {
       baseDir: './dist'
     }
   });
 }   
   

exports.html = html;
exports.css = css; 
exports.images = images;
exports.fonts = fonts;
exports.videos = videos;
exports.clean = clean; 

exports.build = build;
exports.watchapp = watchapp;
exports.default = watchapp;  