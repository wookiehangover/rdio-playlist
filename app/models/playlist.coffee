###
  Collection#Playlists
###
class Rdio.Collections.Playlists extends Backbone.Collection
  url: '/api/getPlaylists?extras=tracks'

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

    @view = new Rdio.Views.Playlist( @ )
    @view.render()

  getTracks: ( callback )=>
    if @get('tracks')?
      @tracks = new Rdio.Collections.Tracks( @get('tracks') )

    callback()

###
  Model#NewPlaylist
###
class Rdio.Models.NewPlaylist extends Backbone.Model
  initialize: (view) ->



