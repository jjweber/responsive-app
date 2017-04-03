var gulp = require('gulp')
var sass = require('gulp-sass')
//var api = require('marvel-api')
var browserSync = require('browser-sync').create()
/*var marvel = api.createClient ({
  publicKey: 'e8c34778a471a5cc616278cd7f11145b',
  privateKey: '99e98ed7426d3038539c0e719671cdab3dee48e0'
});*/
gulp.task('default', function() {

})

gulp.task('scss', function() {
  return gulp.src('./scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.reload({
      stream:true
    }))
})

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  })
})

gulp.task('watch', ['browser-sync', 'scss'], function() {
  gulp.watch('./scss/**/*.scss', ['scss'])
})
