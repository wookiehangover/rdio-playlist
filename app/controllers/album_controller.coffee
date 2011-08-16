###
  Albums ViewController
###

class Rdio.Views.ArtistAlbums extends Backbone.View
  className: "tree-2"

  initialize: ( collection, $parent )->
    @collection = collection
    @parent = $parent
    @render()

  render: =>
    if @parent.find('.tree-2').length > 1
      return

    body = JST.albums( { albums: @collection.toJSON() } )
    $(@el).html( body )
      .appendTo( @parent )

  events:
    "click .album": "openAlbum"
    "click .add-to-playlist": "addToPlaylist"

  openAlbum: =>
    return false

  addToPlaylist: (e) =>
    $this = $(e.target)

    if Rdio.current_playlist?
      Rdio.current_playlist.model.tracks.addTrack( $this.data('track') )

    return false
