'use strict';
const events = require('events');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const copy = require('gulp-copy');
const browserify = require('gulp-browserify');
const babelify = require('babelify');
const uglify = require('gulp-uglify');
const ngAnnotate = require('gulp-ng-annotate');
const pipemin = require('gulp-pipemin');
const cleanCSS = require('gulp-clean-css');
const flatten = require('gulp-flatten');
const connect = require('gulp-connect');
const merge = require('merge-stream');
const es = require('event-stream');
const _ = require('./node_modules/lodash/index');
const gulp = require('gulp');
const rename = require('gulp-rename');
const fs = require('fs');
const replace = require('gulp-replace');
const gutil = require('gulp-util');
const confirm = require('gulp-confirm');
const path = require('path');
const concat = require('gulp-concat');
const gulpReplacePath = require('gulp-replace-path');

const PARAMETERS_PATH = 'parameters.json';
const CONFIG_DIST_PATH = 'config.js.dist';
const CONFIG_DEST_PATH = './src';
var GENERATED_CONFIG = null;

events.EventEmitter.prototype._maxListeners = 100;

gulp.task('config', ['generateConfig'], () => {
    var src = gulp.src(CONFIG_DIST_PATH);
    return src.pipe(replace('{$$jsonConfig}', GENERATED_CONFIG))
        .pipe(rename(path => {
            path.extname = ""
        }))
        .pipe(gulp.dest(CONFIG_DEST_PATH))
});

gulp.task('generateConfig', () => {
    var src = gulp.src(CONFIG_DIST_PATH);
    var params = '{}';
    var jsonParams;
    var definedKeys = [];
    var definedKeysLength = 0;
    var prod = !!gutil.env.prod;


    return new Promise(resolve => {
        let green = gutil.colors.green;
        let red = gutil.colors.red;
        let magenta = gutil.colors.magenta;
        let yellow = gutil.colors.yellow;

        let askQuestion = key => {
            src.pipe(confirm({
                question: `${magenta(definedKeys[key])} (default: ${green(jsonParams[definedKeys[key]])})`,
                proceed: answer => {
                    if (answer && answer !== '') {
                        jsonParams[definedKeys[key]] = answer;
                    }
                    if (key === definedKeysLength - 1) {
                        GENERATED_CONFIG = JSON.stringify(jsonParams);
                        resolve();
                    }
                    return true;
                }
            }));
        };

        try {
            //noinspection JSUnresolvedFunction
            fs.readFileSync(CONFIG_DIST_PATH);
        } catch (err) {
            let warn = red('ERROR: No such file: ');
            let file = magenta(CONFIG_DIST_PATH);
            gutil.log(warn + file);
        }

        try {
            //noinspection JSUnresolvedFunction
            params = fs.readFileSync(PARAMETERS_PATH);
        } catch (err) {
            let warn = yellow('WARN: No such file: ');
            let file = magenta(PARAMETERS_PATH);
            gutil.log(warn + file);
        }
        try {
            jsonParams = JSON.parse(params);
            definedKeys = Object.keys(jsonParams);
            definedKeysLength = Object.keys(jsonParams).length;
        } catch (err) {
            let warn = red('WARN: Invalid json: ');
            let file = magenta(PARAMETERS_PATH);
            gutil.log(warn + file);
        }

        gutil.log(green('Configure local parameters'));

        if (!prod && definedKeysLength) {
            for (let i = 0; i < definedKeysLength; i++) {
                askQuestion(i);
            }
        } else {
            if (prod) {
                gutil.log(green('PROD flag detected, using defaults'));
            }
            if (process.env.API_HOST) {
                gutil.log(green('Using ENV API url variable'));
                jsonParams.apiUrl = process.env.API_HOST
            }
            GENERATED_CONFIG = JSON.stringify(jsonParams);

            resolve();
        }
    })
});

gulp.task('sass', function () {
    return gulp.src('./src/style/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/style/'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('serverAdminDev', function () {
    connect.server({
        name: 'Admin app',
        root: ['./dist/admin'],
        port: 3000,
        livereload: true
    });
});

gulp.task('serverCustomerDev', function () {
    connect.server({
        name: 'Customer app',
        root: ['./dist/client'],
        port: 3001,
        livereload: true
    });
});

gulp.task('serverSellerDev', function () {
    connect.server({
        name: 'Seller app',
        root: ['./dist/pos'],
        port: 3002,
        livereload: true
    });
});

gulp.task('serverAdmin', function () {
    connect.server({
        name: 'Admin app',
        root: ['./dist/admin'],
        port: 3000
    });
});

gulp.task('serverCustomer', function () {
    connect.server({
        name: 'Customer app',
        root: ['./dist/client'],
        port: 3001
    });
});

gulp.task('serverSeller', function () {
    connect.server({
        name: 'Seller app',
        root: ['./dist/pos'],
        port: 3002
    });
});

gulp.task('copyTemplatesAdmin', function () {
    return gulp.src(['./src/modules/admin.*/templates/**/*.html', './src/component/global/*/templates/**/*.html'])
        .pipe(copy('./dist/admin/templates', {prefix: 5}))
});

gulp.task('copyTemplatesCustomer', function () {
    return gulp.src(['./src/modules/client.*/templates/**/*.html', './src/component/global/*/templates/**/*.html'])
        .pipe(copy('./dist/client/templates', {prefix: 5}))
});

gulp.task('copyTemplatesSeller', function () {
    return gulp.src(['./src/modules/pos.*/templates/**/*.html', './src/component/global/*/templates/**/*.html'])
        .pipe(copy('./dist/pos/templates', {prefix: 5}))
});

gulp.task('copyCustomerIndex', ['copyScripts'], function () {
    return gulp.src("./src/index.html")
        .pipe(pipemin({
            css: function (stream, concat) {
                return stream
                    .pipe(cleanCSS())
                    .pipe(concat);
            },
            js: function (stream, concat) {
                return stream
                    .pipe(concat)
            }
        }))
        .pipe(flatten())
        .pipe(gulp.dest('./dist/customer'));
});

gulp.task('copySellerIndex', ['copyScripts'], function () {
    return gulp.src("./src/pos.html")
        .pipe(pipemin({
            css: function (stream, concat) {
                return stream
                    .pipe(cleanCSS())
                    .pipe(concat);
            },
            js: function (stream, concat) {
                return stream
                    .pipe(concat)
            }
        }))
        .pipe(flatten())
        .pipe(gulp.dest('./dist/pos'));
});


gulp.task('copyIndex', ['copyScripts'], function () {
    return gulp.src("./src/admin.html")
        .pipe(pipemin({
            css: function (stream, concat) {
                return stream
                    .pipe(cleanCSS())
                    .pipe(concat);
            },
            js: function (stream, concat) {
                return stream
                    .pipe(concat)
            }
        }))
        .pipe(flatten())
        .pipe(gulp.dest('./dist/admin/'));
});

gulp.task('fonts', function () {
    return gulp.src('./src/fonts/**/*.+(eot|svg|ttf|woff|woff2)')
        .pipe(gulp.dest('./dist/fonts'))
});

gulp.task('copyScripts', function () {
    return gulp.src('./src/scripts/main.js')
        .pipe(gulp.dest('./dist/scripts/'))
});

gulp.task('img', function () {
    return gulp.src('./src/img/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(gulp.dest('./dist/img'))
});

gulp.task('appAdmin', function () {
    var sources = browserify({
        debug: true,
        transform: [
            babelify.configure({
                presets: ["es2015"],
                sourceMaps: false
            })
        ]
    });

    return gulp.src(['./src/appAdmin.js'])
        .pipe(sources)
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rename('app.js'))
        .pipe(gulp.dest('./dist/admin'));
});

gulp.task('appCustomer', function () {
    var sources = browserify({
        debug: true,
        transform: [
            babelify.configure({
                presets: ["es2015"],
                sourceMaps: false
            })
        ]
    });

    return gulp.src(['./src/appCustomer.js'])
        .pipe(sources)
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rename('app.js'))
        .pipe(gulp.dest('./dist/client'));
});

gulp.task('appSeller', function () {
    var sources = browserify({
        debug: true,
        transform: [
            babelify.configure({
                presets: ["es2015"],
                sourceMaps: false
            })
        ]
    });

    return gulp.src(['./src/appSeller.js'])
        .pipe(sources)
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rename('app.js'))
        .pipe(gulp.dest('./dist/pos'));
});

gulp.task('copyAssetsAdmin', [
    'sass',
    'appAdmin',
    'copyTemplatesAdmin',
    'fonts',
    'img'], function () {
    return gulp.src(['./dist/style/**/*', './dist/scripts/**/*', './dist/fonts/**/*', './dist/img/**/*', './dist/scripts'])
        .pipe(copy('./dist/admin', {prefix: 1}))
});

gulp.task('copyAssetsCustomer', [
    'sass',
    'appCustomer',
    'copyTemplatesCustomer',
    'fonts',
    'img'], function () {
    return gulp.src(['./dist/style/**/*', './dist/scripts/**/*', './dist/fonts/**/*', './dist/img/**/*', './dist/scripts'])
        .pipe(copy('./dist/client', {prefix: 1}))
});

gulp.task('copyAssetsSeller', [
    'sass',
    'appSeller',
    'copyTemplatesSeller',
    'fonts',
    'img'], function () {
    return gulp.src(['./dist/style/**/*', './dist/scripts/**/*', './dist/fonts/**/*', './dist/img/**/*', './dist/scripts'])
        .pipe(copy('./dist/pos', {prefix: 1}))
});

gulp.task('base', [
    'copyAssetsAdmin',
    'copyAssetsCustomer',
    'copyAssetsSeller',
], function () {
});


gulp.task('compile', ['admin', 'client', 'pos', 'base', 'copyAdminIndex', 'copyClientIndex', 'copySellerIndex'], function () {
    let renameAdmin = () => {
        return gulp.src('./dist/admin/admin.html')
            .pipe(rename('index.html'))
            .pipe(gulp.dest('./dist/admin/'))
    };
    let renameClient = () => {
        return gulp.src('./dist/client/client.html')
            .pipe(rename('index.html'))
            .pipe(gulp.dest('./dist/client/'))
    };
    let renamePos = () => {
        return gulp.src('./dist/pos/pos.html')
            .pipe(rename('index.html'))
            .pipe(gulp.dest('./dist/pos/'))
    };

    return es.merge(renameAdmin(), renameClient(), renamePos())
});

gulp.task('prod', [
    'serverAdmin',
    'serverCustomer',
    'serverSeller'
]);

gulp.task('dev', [
    'serverAdminDev',
    'serverCustomerDev',
    'serverSellerDev'
]);

/*****************MODULES***********************/

var scriptsPath = './src/modules';

function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function (file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

gulp.task('buildAdminModules', () => {
    return gulp.src('./src/modules/admin.*/**/*.js')
        .pipe(gulp.dest('./dist/admin/build'));
});

gulp.task('buildClientModules', () => {
    return gulp.src('./src/modules/client.*/**/*.js')
        .pipe(gulp.dest('./dist/client/build'));
});

gulp.task('buildSellerModules', () => {
    return gulp.src('./src/modules/pos.*/**/*.js')
        .pipe(gulp.dest('./dist/pos/build'));
});

gulp.task('copyAdminConfig', () => {
    return gulp.src('./src/config.js')
        .pipe(gulp.dest('./dist/admin/build'))
});

gulp.task('copyClientConfig', () => {
    return gulp.src('./src/config.js')
        .pipe(gulp.dest('./dist/client/build'))
});

gulp.task('copySellerConfig', () => {
    return gulp.src('./src/config.js')
        .pipe(gulp.dest('./dist/pos/build'))
});

gulp.task('copyAdminModulesTemplates', () => {
    return gulp.src('./src/modules/admin.*/**/*.html')
        .pipe(gulp.dest('./dist/admin/build'))
});

gulp.task('copyClientModulesTemplates', () => {
    return gulp.src('./src/modules/client.*/**/*.html')
        .pipe(gulp.dest('./dist/client/build'))
});

gulp.task('copySellerModulesTemplates', () => {
    return gulp.src('./src/modules/pos.*/**/*.html')
        .pipe(gulp.dest('./dist/pos/build'))
});

gulp.task('copyAdminIndex', ['copyScripts'], function () {
    return gulp.src("./src/admin.html")
        .pipe(pipemin({
            css: function (stream, concat) {
                return stream
                    .pipe(cleanCSS())
                    .pipe(concat);
            },
            js: function (stream, concat) {
                return stream
                    .pipe(concat)
            }
        }))
        .pipe(flatten())
        .pipe(gulp.dest('./dist/admin/'));
});

gulp.task('copyClientIndex', ['copyScripts'], function () {
    return gulp.src("./src/client.html")
        .pipe(pipemin({
            css: function (stream, concat) {
                return stream
                    .pipe(cleanCSS())
                    .pipe(concat);
            },
            js: function (stream, concat) {
                return stream
                    .pipe(concat)
            }
        }))
        .pipe(flatten())
        .pipe(gulp.dest('./dist/client/'));
});

gulp.task('admin', ['buildAdminModules', 'copyAdminModulesTemplates', 'copyAdminConfig']);
gulp.task('client', ['buildClientModules', 'copyClientModulesTemplates', 'copyClientConfig']);
gulp.task('pos', ['buildSellerModules', 'copySellerModulesTemplates', 'copySellerConfig']);

gulp.task('watch', function () {
    gulp.watch('./src/component/admin/**/*', ['copyAssetsAdmin']);
    gulp.watch('./src/component/customer/**/*', ['copyAssetsCustomer']);
    gulp.watch('./src/component/seller/**/*', ['copyAssetsSeller']);
    gulp.watch('./src/component/global/**/*', ['copyAssetsSeller', 'copyAssetsAdmin', 'copyAssetsSeller'])
});