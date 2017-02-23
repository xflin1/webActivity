var gulp = require('gulp');
var fs = require('fs');
var clean = require('gulp-clean');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
gulp.task('default',['clean','pages','common','component','htmlPages','watch','complete']);

gulp.task('clean',function() {
    return gulp.src(['build/pages/'], {
            read: false
        })
        .pipe(clean({force:true}));
});

gulp.task('pages',['clean'],function () {
    return gulp.src('./src/pages/**/*.jade')
        .pipe(gulp.dest('./build/pages'));
});
gulp.task('common',['clean'],function () {
    return gulp.src('./src/common/**/*.jade')
        .pipe(gulp.dest('./build/common'));
});
gulp.task('component',['clean'],function () {
    return   gulp.src('./src/component/**/*.jade')
        .pipe(gulp.dest('./build/component'));
});
gulp.task('htmlPages',['clean'],function(){
   return gulp.src('./src/htmlPages/**/*')
       .pipe(gulp.dest('./build/pages'));
});

gulp.task('watchHtmlPage',function(){
    return gulp.src('./src/htmlPages/**/*')
        .pipe(gulp.dest('./build/pages'));
});

gulp.task('watchJade',function(){
    return gulp.src('./src/pages/**/*.jade')
        .pipe(gulp.dest('./build/pages'));
});
gulp.task('watchJade2',function(){
    return gulp.src('./src/common/*.jade')
        .pipe(gulp.dest('./build/common'));
});
gulp.task('watchJade3',function(){
    return gulp.src('./src/component/**/*.jade')
        .pipe(gulp.dest('./build/component'));
});

gulp.task('watch',function(){
    gulp.watch('./src/htmlPages/**/*',['watchHtmlPage']);
    gulp.watch('./src/pages/**/*.jade',['watchJade']);
    gulp.watch('./src/htmlPages/**/*',['watchHtmlPage']);
    gulp.watch('./src/common/**/*.jade',['watchJade2']);
    gulp.watch('./src/component/**/*.jade',['watchJade3']);
});
gulp.task('complete',['clean','pages','common','component','htmlPages'],function(){
    console.log('编译完成---------可以使用Ctrl+c停止');
});

