###
  Views#Playlists
###
class Rdio.Views.Playlists extends Backbone.View
  el: $('#playlist-page')

  events:
    "click .new": "newPlaylist"

  newPlaylist: =>
    p = new Rdio.Models.Playlist()
    p.view.edit()

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
      unless @edit?
        @edit.render()
      else
        @edit = new Rdio.Views.EditPlaylist( @model )
    return false


###
  Views#EditPlaylist
###
class Rdio.Views.EditPlaylist extends Backbone.View
  tagName: 'form'

  className: 'edit-playlist'

  initialize: ( model )=>
    Rdio.current_playlist = @
    @model = model

    if @model.tracks.length is 0
      @isNew = true

    @model.tracks.bind 'add', (track)=>
      @tracks.push(track.get('key'))
      @render()

    @render()

  tracks: []

  render: =>
    body = { playlist: @model.toJSON(),tracks: @model.tracks.toJSON() }
    $(@el)
      .html( JST.playlist_edit( body ) )
      .appendTo('#playlist-page')
      .addClass('active')

  events:
    "click .closer": "close"
    'click input[type="submit"]': "savePlaylist"

  close: =>
    $(@el).removeClass('active')
    @remove()
    return false

  savePlaylist: =>
    if @isNew
      @create()
    else
      @update()

    return false


  update: =>
    $.get "/api/addToPlaylist?playlist=#{@model.get('key')}&tracks=#{@tracks.join(',')}"


  create: =>
    name = @$('.playlist-name')

    $.get "/api/createPlaylist?name=#{name.val()}&description=test&tracks=#{@tracks.join(',')}"



