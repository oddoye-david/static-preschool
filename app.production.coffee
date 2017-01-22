js_pipeline  = require 'js-pipeline'
css_pipeline = require 'css-pipeline'
image_pipeline = require 'roots-image-pipeline'
templates = require 'client-templates'
records = require 'roots-records'
marked = require 'marked'
massageData = require './massageData'

api_url = 'https://cdn.contentful.com/spaces/' + process.env.CONTENTFUL_SPACE_ID + '/entries?access_token=' + process.env.CONTENTFUL_ACCESS_TOKEN

module.exports =
  ignores: ['readme.md', '**/layout.*', '**/_*', '.gitignore', 'ship.*conf', 'bower_components/**', 'massageData.js', '.netlify']

  locals:
      marked: marked

  extensions: [
    js_pipeline(files: 'assets/js/*.js',  out: 'js/build.js', minify: true, hash: true),
    css_pipeline(files: 'assets/css/*.scss', out: 'css/build.css', minify: true, hash: true),
    image_pipeline(files: "assets/img/**", out: 'img', compress: true)
    templates(base: 'views/templates'),
    records(questions: { url: api_url , hook: (data) -> massageData(data)})
  ]
