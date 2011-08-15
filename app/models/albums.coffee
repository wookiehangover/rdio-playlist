###
  Collections#Albums
###
class Rdio.Collections.ArtistAlbums extends Backbone.Collection
  initialize: ( data, $parent )->
    @model = Rdio.Models.Album
    @view = new Rdio.Views.ArtistAlbums( @, $parent )

###
  Models#Album
###
class Rdio.Models.Album extends Backbone.Model
  initialize: (data)->
    @set { id: data.albumKey }

