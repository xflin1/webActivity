var gulp = require('gulp');
var fs = require('fs');
var clean = require('gulp-clean');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
gulp.task('default',['clean','pages','common','component','watch']);

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
    gulp.watch('./src/pages/**/*.jade',['watchJade']);
    gulp.watch('./src/common/**/*.jade',['watchJade2']);
    gulp.watch('./src/component/**/*.jade',['watchJade3']);
});

