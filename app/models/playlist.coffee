###
  Collection#Playlists
###
class Rdio.Collections.Playlists extends Backbone.Collection
  url: '/api/getPlaylists?extras=trackKeys'

  initialize: ->
    @model = Rdio.Models.Playlist
    @view = new Rdio.Views.Playlists

    $.get( @url ).success ( data )=>
      @add( data.owned )


###
  Models#Playlist
###
class Rdio.Models.Playlist extends Backbone.Model
  initialize: ->
    @view = new Rdio.Views.Playlist( @ )

  getTracks: ( callback )=>
    @tracks = new Rdio.Collections.Tracks( null, @get('trackKeys') )
    @tracks.fetch( callback )

###
  Model#NewPlaylist
###
class Rdio.Models.NewPlaylist extends Backbone.Model
  initialize: (view) ->
    @tracks = new Rdio.Collections.Tracks
    @view = Rdio.editPlaylist
    @view.render()

    @tracks.bind 'add', =>
      @view.render({ tracks: @tracks.toJSON() })


