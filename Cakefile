fs         = require 'fs'
{exec}     = require 'child_process'
util       = require 'util'
uglify     = require 'uglify-js'
growl      = require 'growl'
tmpl       = require 'jquery-tmpl-jst'

prodSrcCoffeeDir     = 'app'
testSrcCoffeeDir     = 'public/test/coffee'
prodTargetJsDir      = 'public/js'
templatesDir         = 'app/templates'

prodTargetFileName   = 'app'
prodTargetCoffeeFile = "#{prodSrcCoffeeDir}/#{prodTargetFileName}.coffee"
prodTargetJsFile     = "#{prodTargetJsDir}/#{prodTargetFileName}.js"
prodTargetJsMinFile  = "#{prodTargetJsDir}/#{prodTargetFileName}.min.js"

prodCoffeeOpts = "--output #{prodTargetJsDir} --compile #{prodTargetCoffeeFile}"
prodCoffeeFiles = [
  'rdio'
  'models/albums'
  'models/artist'
  'models/playlist'
  'models/track'
  'controllers/album_controller'
  'controllers/artist_controller'
  'controllers/playlist_controller'
]

prodLibs =
  libs: [
    'libs/underscore-min'
    'libs/backbone-min'
    'mylibs/jquery.tmpl.min'
    'mylibs/jquery.quicksearch'
    'mylibs/ql_cache'
    'mylibs/helper'
  ]


###
  Watch Tasks
###

task 'watch:all', 'Watch production and test CoffeeScript', ->
  invoke 'watch:templates'
  invoke 'watch'

task 'watch', 'Watch prod source files and build changes', ->
  invoke 'build'
  util.log "Watching for changes in #{prodSrcCoffeeDir}"

  for file in prodCoffeeFiles then do (file) ->
    fs.watchFile "#{prodSrcCoffeeDir}/#{file}.coffee", (curr, prev) ->
      if +curr.mtime isnt +prev.mtime
        util.log "Saw change in #{prodSrcCoffeeDir}/#{file}.coffee"
        invoke 'build'

task 'watch:templates', 'Watch prod source files and build changes', ->
    invoke 'build:templates'
    util.log "Watching for changes in #{templatesDir}"
    templates = fs.readdirSync(templatesDir)

    for file in templates then do (file) ->
        fs.watchFile "#{templatesDir}/#{file}", (curr, prev) ->
            if +curr.mtime isnt +prev.mtime
                util.log "Saw change in #{prodSrcCoffeeDir}/#{file}.coffee"
                invoke 'build:templates'

###
  Build Tasks
###

task 'build:all', 'Build production and test CoffeeScript', ->
  invoke 'build:templates'
  invoke 'build:deps'
  invoke 'build'

task 'build', 'Build a single JavaScript file from prod coffeescript files', ->
    util.log "Building #{prodTargetJsFile}"
    appContents = new Array remaining = prodCoffeeFiles.length
    util.log "Appending #{prodCoffeeFiles.length} files to #{prodTargetCoffeeFile}"

    for file, index in prodCoffeeFiles then do (file, index) ->
        fs.readFile "#{prodSrcCoffeeDir}/#{file}.coffee"
                  , 'utf8'
                  , (err, fileContents) ->
            handleError(err) if err

            appContents[index] = fileContents
            util.log "[#{index + 1}] #{file}.coffee"
            process() if --remaining is 0

    process = ->
        fs.writeFile prodTargetCoffeeFile
                   , appContents.join('\n\n')
                   , 'utf8'
                   , (err) ->
            handleError(err) if err

            exec "coffee #{prodCoffeeOpts}", (err, stdout, stderr) ->
                handleError(err) if err
                message = "Compiled #{prodTargetJsFile}"
                util.log message
                displayNotification message
                fs.unlink prodTargetCoffeeFile, (err) -> handleError(err) if err
                invoke 'uglify'



task 'build:templates', 'Pre compile jQuery Templates', ->
  tmpl.build templatesDir, ( data ) ->
    tmpl.process data, prodTargetJsDir, ->
      uglyStick( "#{prodTargetJsDir}/templates.js", "#{prodTargetJsDir}/templates.min.js", true)


task 'build:deps', 'build all dependencies for prod', ->
  util.log "minifying and concating libs"

  for name, group of prodLibs then do (name, group) ->
    output = []
    remaining = group.length

    if !remaining
      throw new Error('No files in group')

    for file, i in group then do (file, i) ->
      fs.readFile "public/js/#{file}.js", 'utf8', (err, data) ->
        output[i] = data
        util.log "\t#{name}: [#{i + 1}] #{file}.js"
        process( output, name ) if --remaining is 0

  process = ( data, nm )->
    fs.writeFile  "#{prodTargetJsDir}/src/#{nm}.js"
                , data.join('\n\n')
                , 'utf8'
                , (err) ->
      handleError(err) if err
      util.log "#{prodTargetJsDir}/src/#{nm}.js written"
      uglyStick( "#{prodTargetJsDir}/src/#{nm}.js", "#{prodTargetJsDir}/src/#{nm}.min.js")


task 'uglify', 'Minify and obfuscate', (file)->
  uglyStick prodTargetJsFile, prodTargetJsMinFile

###
  Helpers
###
uglyStick = ( file, minfile, no_squeeze ) ->
  jsp = uglify.parser
  pro = uglify.uglify

  fs.readFile file, 'utf8', (err, fileContents) ->
    #console.log(fileContents)
    ast = jsp.parse fileContents  # parse code and get the initial AST
    ast = pro.ast_mangle ast # get a new AST with mangled names
    ast = pro.ast_squeeze ast unless no_squeeze
    final_code = pro.gen_code ast # compressed code here

    fs.writeFile minfile, final_code
    #fs.unlink file, (err) -> handleError(err) if err

    message = "Uglified #{minfile}"
    util.log message
    displayNotification message

coffee = (options = "", file) ->
    util.log "Compiling #{file}"
    exec "coffee #{options} --compile #{file}", (err, stdout, stderr) ->
        handleError(err) if err
        displayNotification "Compiled #{file}"

handleError = (error) ->
    util.log error
    displayNotification error

displayNotification = (message = '') ->
    options =
        title: 'CoffeeScript'
        image: 'lib/bear-sharktopus.jpeg'
    growl.notify message, options

