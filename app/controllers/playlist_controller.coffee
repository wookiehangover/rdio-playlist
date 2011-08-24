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

  initialize: ->
    @render()

  render: ->
    $(@el)
      .html( JST.playlist( @model.toJSON() ) )
      .appendTo('#playlists')

  events:
    "click a": "edit"

  edit: =>
    Rdio.current_playlist = @model
    $('.edit-playlist').remove()
    @model.getTracks =>
      unless @edit?
        @edit.render()
      else
        @edit = new Rdio.Views.EditPlaylist({ model: @model })
    return false


###
  Views#EditPlaylist
###
class Rdio.Views.EditPlaylist extends Backbone.View
  tagName: 'form'

  className: 'edit-playlist'

  initialize: =>
    Rdio.current_playlist = @

    if @model.tracks.length is 0
      @isNew = true

    @model.tracks.bind 'add', (track)=>
      @tracks.push(track.get('key'))
      @render()

    @render()

  tracks: []

  render: =>
    body =
      playlist: @model.toJSON()
      tracks: @model.tracks.toJSON()
      isNew: @isNew || false

    unless window.orientation?
      height = $(window).height() - ( $('#playlist-page').height() + 72 )

    $(@el)
      .html( JST.playlist_edit( body ) )
      .appendTo('#playlist-page')
      .addClass('active')

    $(@el).css({ height: 'auto', 'max-height': height }) if height?

  events:
    "click .closer":              "close"
    "click .delete":              "deletePlaylist"
    'click input[type="submit"]': "savePlaylist"
    "change .playlist-name":      "updatedField"

  updatedField: =>
    @model.set { name: @$('.playlist-name').val() }
    @hasChanged = true

  close: =>
    $(@el).removeClass('active')
    @remove()
    return false

  deletePlaylist: =>
    console.log('wut')
    c = confirm "Are you sure you want to do that?"
    if c
      $.get "/api/deletePlaylist?playlist=#{@model.get('key')}", =>
        @close()
        Rdio.user.playlists.remove( @model )

    return false

  savePlaylist: =>
    @$(':text').blur()
    if @isNew
      @create()
    else
      @update()

    return false


  update: =>
    if @tracks.length > 0
      $.get "/api/addToPlaylist?playlist=#{@model.get('key')}&tracks=#{@tracks.join(',')}"

    if @hasChanged is true
      $.get "/api/setPlaylistFields?playlist=#{@model.get('key')}&name=#{@$('.playlist-name').val()}&description=#{@$('.playlist-name').val()}"



  create: =>
    name = @$('.playlist-name')

    $.get "/api/createPlaylist?name=#{name.val()}&description=test&tracks=#{@tracks.join(',')}"



