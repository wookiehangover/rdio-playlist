###
  Artists
###

class Rdio.Collections.Artists extends Backbone.Collection
  url: '/api/getArtistsInCollection'

  initialize: ->
    @model = Rdio.Models.Artist

    cached_artists = qlc('artists')

    if cached_artists?
      @reset( cached_artists )
      @view = new Rdio.Views.Artists( @ )
      return

    @fetch().success (data)=>
      qlc( 'artists', data, false, true )
      @view = new Rdio.Views.Artists( @ )


class Rdio.Models.Artist extends Backbone.Model
  initialize: ( data )->
    @set { id: @cid }

  getAlbums: ( $parent )=>
    if @ablums?
      return @albums.view.render()

    $.get "/api/getAlbumsForArtistInCollection?artist=#{@get('key')}", ( data )=>
      @albums = new Rdio.Collections.ArtistAlbums( data, $parent )

