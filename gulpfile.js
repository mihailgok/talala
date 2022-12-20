const {src, dest, series, watch} = require('gulp');
const htmlMin = require('gulp-htmlmin');
const svgSprite = require('gulp-svg-sprite');
const browserSync = require('browser-sync').create();
const imageMin = require('gulp-imagemin');
const del = require('del');
let sass = require('gulp-sass')(require('sass'));

const clean = () => {
   return del(['dist'])
}
 
const resources = () => {
   return src('src/fonts/**')
   .pipe(dest('dist/fonts'))
}

const styles = () => {
   return src('src/styles/*.sass')
   .pipe(sass({outputStyle: 'compressed'}))
   .pipe(dest('dist/styles'))
   .pipe(browserSync.reload({stream: true}));
}

const htmlmin = () => {
   return src('src/**/*.html')
      .pipe(htmlMin({
         collapseWhitespace: true,
      }))
      .pipe(dest('dist'))
      .pipe(browserSync.stream())
}

const svgSprites = () => {
   return src('src/img/svg/*.svg')
   .pipe(svgSprite({
      mode: {
         stack: {
            sprite: '../sprite.svg'
         }
      }
   }))
   .pipe(dest('dist/img'))
}

const images = () => {
   return src([
      'src/img/**/*.jpg',
      'src/img/**/*.jpeg',
      'src/img/**/*.png',
      'src/img/*.svg',
   ])
   .pipe(imageMin())
   .pipe(dest('dist/img'))
   .pipe(browserSync.stream())
}

const watchFiles = () => {
   browserSync.init({
      server: {
         baseDir: 'dist/'
      }
   });
}

watch('src/**/*.html', htmlmin);
watch('src/styles/*.sass', styles);
// watch('src/js/**/*.js', jsugly);
watch('src/img/svg/*.svg', svgSprites);
watch('src/fonts/**', resources);
watch([
   'src/img/**/*.jpg',
   'src/img/**/*.jpeg',
   'src/img/**/*.png',
   'src/img/*.svg',
], images);

exports.styles = styles;
exports.htmlmin = htmlmin;
exports.clean = clean;

exports.default = series(clean, resources, htmlmin, styles, svgSprites, images, watchFiles)

