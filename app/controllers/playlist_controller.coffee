###
  Views#Playlists
###
class Rdio.Views.Playlists extends Backbone.View
  el: $('#playlist-page')

  initialize: ->
    Rdio.editPlaylist = new Rdio.Views.EditPlaylist

  events:
    "click .new": "newPlaylist"

  newPlaylist: =>
    Rdio.current_playlist = new Rdio.Models.NewPlaylist
    return false

###
  Views#Playlist
###
class Rdio.Views.Playlist extends Backbone.View
  tagName: 'li'

  initialize: (model)->
    @model = model
    @render()

  render: ->
    $(@el)
      .html( JST.playlist( @model.toJSON() ) )
      .appendTo('#playlists')

  events:
    "click a": "edit"

  edit: =>
    Rdio.current_playlist = @model
    @model.getTracks =>
      Rdio.editPlaylist.render({ playlist: @model.toJSON(),tracks: @model.tracks.toJSON() })
    return false


###
  Views#EditPlaylist
###
class Rdio.Views.EditPlaylist extends Backbone.View
  el: $('.edit-playlist')

  render: (data)=>
    @el
      .html( JST.playlist_edit(data) )
      .addClass('active')

  events:
    "click button": "close"
    'click input[type="submit"]': "savePlaylist"

  close: =>
    @el.removeClass('active')
    return false

  savePlaylist: =>
    tracks = Rdio.current_playlist.tracks.map (t) ->
      return t.get('key')

    name = @el.find('#playlist-name')
    desc = @el.find('#playlist-desc')

    $.get "/api/createPlaylist?name=#{name.val()}&description=#{desc.val()}&tracks=#{tracks.join(',')}", (data)=>
      $('#playlist-page ul').remove()
      Rdio.user.playlists = new Rdio.Collections.Playlists

    return false
