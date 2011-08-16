###
  Views#Search
###
class Rdio.Views.Search extends Backbone.View
  el: $('#search-page')

  initialize: ->

  events:
    "submit #search": "search"
    "click .artist": "loadArtistAlbums"
    "click #clear": "clear"

  search: (e) =>
    $form = $(e.target)

    $.get "/api/search?query=#{$form.find('#search-query').val()}&types=Artist", ( data )=>
      @$('#clear').show()
      @$('##search-results').html(JST.artist_list( { artists: data.results } ))
    return false

  loadArtistAlbums: (e)=>
    e.preventDefault()

    $this = $(e.target)
    $parent = $this.parent().toggleClass('active')

    if $parent.find('.tree-2').length > 0
      $parent.find('.tree-2').slideToggle()
      return

    $.get "/api/getAlbumsForArtist?artist=#{$this.data('key')}&extras=tracks", ( data )=>
      @albums = new Rdio.Collections.ArtistAlbums( data, $parent )

  clear: =>
    @$('#clear').hide()
    @$('#search-results').empty()
    return false
