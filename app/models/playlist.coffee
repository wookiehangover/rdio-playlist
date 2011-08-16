###
  Collection#Playlists
###
class Rdio.Collections.Playlists extends Backbone.Collection
  url: '/api/getPlaylists'

  initialize: ->
    @model = Rdio.Models.Playlist
    @view = new Rdio.Views.Playlists
    $.ajax({ type: 'GET', url: @url, global: false }).success ( data )=>
      @add( data.owned )


###
  Models#Playlist
###
class Rdio.Models.Playlist extends Backbone.Model
  initialize: () ->

    @tracks = new Rdio.Collections.Tracks
    @view = new Rdio.Views.Playlist({ model: @ })
    @view.render()

  getTracks: ( callback )=>
    unless @get('key')?
      return callback()

    $.get "/api/get?keys=#{@get('key')}&extras=tracks", (data) =>
      @tracks = new Rdio.Collections.Tracks( data[@get('key')].tracks )
      callback()


###
  Model#NewPlaylist
###
class Rdio.Models.NewPlaylist extends Backbone.Model
  initialize: (view) ->



