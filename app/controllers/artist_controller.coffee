###
  Artists ViewController
###
class Rdio.Views.Artists extends Backbone.View
  el: $('#artists-page')

  initialize: (collection)->
    @collection = collection
    @render()
    @text_filter = @$('#filter-artists').quicksearch '#artists-page .tree li'

  render: =>
    @el.html JST.artist( { artists: @collection.toJSON() } )

  events:
    "click .artist": "loadArtistAlbums"

  loadArtistAlbums: (e)=>
    e.preventDefault()

    $this = $(e.target)
    $parent = $this.parent().toggleClass('active')

    if $parent.find('.tree-2').length > 0
      $parent.find('.tree-2').slideToggle()
      return

    artist = @collection.getByCid( $this.data('cid') )
    artist.getAlbums( $this.parent() )

    #Rdio.router.navigate( $this.attr('href') )


