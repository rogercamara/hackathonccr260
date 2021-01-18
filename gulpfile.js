// generated on 2021-01-16 using generator-webapp 4.0.0-8
const { src, dest, watch, series, parallel, lastRun } = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const fs = require('fs');
const mkdirp = require('mkdirp');
const Modernizr = require('modernizr');
const browserSync = require('browser-sync');
const del = require('del');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const jquery = require('jquery');
// const bootstrap = require('bootstrap');
const poppers = require('@popperjs/core')
// const firebase = require('firebase');s

// var firebase = require("firebase/app");
// require("firebase/auth");
// require("firebase/firestore");

// const admin = require('firebase-admin');

// admin.initializeApp({
//   credential: admin.credential.applicationDefault()
// });

// let db = admin.firestore();

// var config = {
//   apiKey: "AIzaSyDVm_thjfSeM6wMWUt-eJ841fI71ifzBtg",
//   authDomain: "hackaccr-d9a8c.firebaseapp.com",
//   databaseURL: "https://hackaccr-d9a8c-default-rtdb.firebaseio.com",
//   projectId: "hackaccr-d9a8c",
//   storageBucket: "hackaccr-d9a8c.appspot.com",
//   messagingSenderId: "787848637329",
//   appId: "1:787848637329:web:2b86b3297f0bae3aff8830",
//   measurementId: "G-BW9PJ80Q8M"
// };







// Add the Firebase products that you want to use
// var config = {
//   apiKey: "AIzaSyDVm_thjfSeM6wMWUt-eJ841fI71ifzBtg",
//   authDomain: "hackaccr-d9a8c.firebaseapp.com",
//   databaseURL: "https://hackaccr-d9a8c-default-rtdb.firebaseio.com",
//   projectId: "hackaccr-d9a8c",
//   storageBucket: "hackaccr-d9a8c.appspot.com",
//   messagingSenderId: "787848637329",
//   appId: "1:787848637329:web:2b86b3297f0bae3aff8830",
//   measurementId: "G-BW9PJ80Q8M"
// };
// // Initialize Firebase

// if (!firebase.apps.length) {
  // firebase.initializeApp(config);
// }

// var firebase = require("firebase/app");
// // Add additional services you want to use
// require("firebase/auth");
// require("firebase/database");
// require("firebase/firestore");
// require("firebase/messaging");
// require("firebase/functions");
// // Comment out (or don't require) services you don't want to use
// // require("firebase/storage");
// var config = {
//     apiKey: "AIzaSyDVm_thjfSeM6wMWUt-eJ841fI71ifzBtg",
//     authDomain: "hackaccr-d9a8c.firebaseapp.com",
//     databaseURL: "https://hackaccr-d9a8c-default-rtdb.firebaseio.com",
//     projectId: "hackaccr-d9a8c",
//     storageBucket: "hackaccr-d9a8c.appspot.com",
//     messagingSenderId: "787848637329",
//     appId: "1:787848637329:web:2b86b3297f0bae3aff8830",
//     measurementId: "G-BW9PJ80Q8M"
// };

// var admin = require('firebase-admin');


// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   databaseURL: "https://hackaccr-d9a8c-default-rtdb.firebaseio.com"
// });



const { argv } = require('yargs');
const $ = gulpLoadPlugins();
const server = browserSync.create();
const port = argv.port || 9000;
const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const isDev = !isProd && !isTest;


function styles() {
  return src('app/styles/*.scss', {
    sourcemaps: !isProd,
  })
    .pipe($.plumber())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.postcss([
      autoprefixer()
    ]))
    .pipe(dest('.tmp/styles', {
      sourcemaps: !isProd,
    }))
    .pipe(server.reload({stream: true}));
};

function scripts() {
  return src('app/scripts/**/*.js', {
    sourcemaps: !isProd,
  })
    .pipe($.plumber())
    .pipe($.babel())
    .pipe(dest('.tmp/scripts', {
      sourcemaps: !isProd ? '.' : false,
    }))
    .pipe(server.reload({stream: true}));
};



async function modernizr() {
  const readConfig = () => new Promise((resolve, reject) => {
    fs.readFile(`${__dirname}/modernizr.json`, 'utf8', (err, data) => {
      if (err) reject(err);
      resolve(JSON.parse(data));
    })
  })
  const createDir = () => new Promise((resolve, reject) => {
    mkdirp(`${__dirname}/.tmp/scripts`, err => {
      if (err) reject(err);
      resolve();
    })
  });
  const generateScript = config => new Promise((resolve, reject) => {
    Modernizr.build(config, content => {
      fs.writeFile(`${__dirname}/.tmp/scripts/modernizr.js`, content, err => {
        if (err) reject(err);
        resolve(content);
      });
    })
  });

  const [config] = await Promise.all([
    readConfig(),
    createDir()
  ]);
  await generateScript(config);
}

const lintBase = (files, options) => {
  return src(files)
    .pipe($.eslint(options))
    .pipe(server.reload({stream: true, once: true}))
    .pipe($.eslint.format())
    .pipe($.if(!server.active, $.eslint.failAfterError()));
}
function lint() {
  return lintBase('app/scripts/**/*.js', { fix: true })
    .pipe(dest('app/scripts'));
};
function lintTest() {
  return lintBase('test/spec/**/*.js');
};

function html() {
  return src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if(/\.js$/, $.uglify({compress: {drop_console: true}})))
    .pipe($.if(/\.css$/, $.postcss([cssnano({safe: true, autoprefixer: false})])))
    .pipe($.if(/\.html$/, $.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: {compress: {drop_console: true}},
      processConditionalComments: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    })))
    .pipe(dest('dist'));
}

function images() {
  return src('app/images/**/*', { since: lastRun(images) })
    .pipe($.imagemin())
    .pipe(dest('dist/images'));
};

function fonts() {
  return src('app/fonts/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe($.if(!isProd, dest('.tmp/fonts'), dest('dist/fonts')));
};

function extras() {
  return src([
    'app/*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(dest('dist'));
};

function clean() {
  return del(['.tmp', 'dist'])
}

function measureSize() {
  return src('dist/**/*')
    .pipe($.size({title: 'build', gzip: true}));
}

const build = series(
  clean,
  parallel(
    lint,
    series(parallel(styles, scripts, modernizr), html),
    images,
    fonts,
    extras
  ),
  measureSize,
  
);

function startAppServer() {
  server.init({
    notify: false,
    port,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  });

  watch([
    'app/*.html',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', server.reload);

  watch('app/styles/**/*.scss', styles);
  watch('app/scripts/**/*.js', scripts);
  watch('modernizr.json', modernizr);
  watch('app/fonts/**/*', fonts);
}

function startTestServer() {
  server.init({
    notify: false,
    port,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/scripts',
        '/node_modules': 'node_modules'
      }
    }
  });

  watch('test/index.html').on('change', server.reload);
  watch('app/scripts/**/*.js', scripts);
  watch('test/spec/**/*.js', lintTest);
}

function startDistServer() {
  server.init({
    notify: false,
    port,
    server: {
      baseDir: 'dist',
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  });
}

let serve;
if (isDev) {
  serve = series(clean, parallel(styles, scripts, modernizr, fonts), startAppServer);
} else if (isTest) {
  serve = series(clean, scripts, startTestServer);
} else if (isProd) {
  serve = series(build, startDistServer);
}

exports.serve = serve;
exports.build = build;
exports.default = build;
