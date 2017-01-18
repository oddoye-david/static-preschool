js_pipeline  = require 'js-pipeline'
css_pipeline = require 'css-pipeline'
image_pipeline = require('roots-image-pipeline')
templates = require 'client-templates'
records = require 'roots-records'
config = require 'roots-config'
sass = require 'node-sass'
axios = require 'axios'

api_url = 'https://cdn.rawgit.com/oddoye-david/eebed8368e032fcb72bfbb60966d73fa/raw/73769dc5c79a97e9b9741930cb2144d69b1f6e17/questions.json'

module.exports =
  ignores: ['readme.md', '**/layout.*', '**/_*', '.gitignore', 'ship.*conf', 'bower_components/**']

  extensions: [
    js_pipeline(files: 'assets/js/*.js'),
    css_pipeline(files: 'assets/css/*.scss'),
    image_pipeline(files: "assets/img/**", out: 'img', compress: true)
    templates(base: 'views/templates'),
    records(questions: { url: api_url }),
    config(api_url: api_url, static_items: 5)
  ]
