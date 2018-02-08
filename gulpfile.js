var gulp = require('gulp');
	// sass
	sass = require('gulp-sass');
	// less
	less = require('gulp-less');
	// 合并
	concat = require('gulp-concat');
	// 压缩js
	uglify = require('gulp-uglify');
	// 出错的时候，除错工具将直接显示原始代码
	sourcemaps = require('gulp-sourcemaps');
	// 定位代码出错位置
	pump = require('pump');
	// 压缩css
	minCSS = require('gulp-clean-css');
	rename = require("gulp-rename");
	// 自动注入css
	autoprefixer = require('gulp-autoprefixer');
	// 合并图片
	spritesmith = require('gulp.spritesmith');
	// 接收Vinyl File Object作为输入，然后判断其contents类型，如果是Stream就转换为Buffer。
	buffer = require('vinyl-buffer');
	// 压缩优化css
	csso = require('gulp-csso');
	// 图片压缩
	imagemin = require('gulp-imagemin');
	// 合并处理流程相同的stream
	merge = require('merge-stream');

//demo
gulp.task('hello',function(){
	console.log('hello gulp!!!');
});

//sass转css
gulp.task('sass', function(){
	return gulp.src('sass/*.scss') //匹配css文件夹下的scss文件
			.pipe(sass()) //将scss文件转换成css
			.pipe(gulp.dest('css')); //输出到css文件夹
});

//less转css
gulp.task('less', function(){
	return gulp.src('less/*.less') //匹配css文件夹下的scss文件
			.pipe(less()) //将scss文件转换成css
			.pipe(gulp.dest('css')); //输出到css文件夹
});

//合并 js
gulp.task('concatJS', function(){
	return gulp.src('js/*.js')
			.pipe(sourcemaps.init())
			.pipe(concat('all.js'))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('dist/js'));
});

//合并css
gulp.task('concatCSS', function(){
	return gulp.src('css/*.css')
			.pipe(sourcemaps.init())
			.pipe(concat('style.css'))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('dist/css'));
});

//合并压缩 js
gulp.task('compressJS', function(cb){
	// return gulp.src('dist/js/*.js')
	// 		.pipe(uglify('min.js'))
	// 		.pipe(gulp.dest('dist/js'));
	pump([
			gulp.src('js/*.js'),
			concat('all.js'),
			uglify(),
			rename({
				// dirname: "js",
				// prefix: "all-",
				// basename: "all",
				suffix: "-min1.0.1",
				// extname: ".js"
			}),
			gulp.dest('dist/js')
		],
		cb
	);
});

//合并压缩 css
gulp.task('minifyCSS', function(){
	return gulp.src('css/*.css')
			.pipe(sourcemaps.init())
			.pipe(concat('style.css'))
			.pipe(minCSS())
			.pipe(rename({suffix:'.min'}))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('dist/css'));
});

//自动添加css前缀
gulp.task('autoCSS', function(){
    gulp.src('less/*.less')
    	.pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'], //last 2 versions- 主流浏览器的最新两个版本谷歌，IE
            cascade: true
        }))
        .pipe(concat('main.css')) //合并css
        .pipe(minCSS()) //压缩css
        .pipe(rename({suffix:'.min'})) //设置压缩文件名
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('css'))
});

//合并图片
gulp.task('sprite', function () {
  var spriteData = gulp.src('images/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css'
  }));
  var imgStream = spriteData.img
    	.pipe(buffer())
    	.pipe(imagemin())
    	.pipe(gulp.dest('images/sprite'));  
  var cssStream = spriteData.css
    	.pipe(csso())
    	.pipe(gulp.dest('images/sprite'));		
  return merge(imgStream, cssStream);
});

//watch
gulp.task('watch', function(){
	gulp.watch(['sass/*.scss','less/*.less'],['sass','less']);
	gulp.watch('css/*.css',['minifyCSS']);
	gulp.watch('dist/js/*.js',['compressJS']);
});

gulp.task('default', ['less', 'sass', 'watch']);