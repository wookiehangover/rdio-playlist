window.Rdio =
  Models: {}
  Collections: {}
  Views: {}
  user: {}
  config: {}

$('#loader')
  .ajaxStop( -> $(@).fadeOut() )
  .ajaxStart( -> $(@).fadeIn() )

###
  App ViewController
###

class Rdio.Views.app extends Backbone.View
  el: $('body')

  initialize: ->
    $('.tip').tipsy
      gravity: $.fn.tipsy.autoNS
      title: 'data-tip'
      live: true

    Rdio.user.artists   = new Rdio.Collections.Artists
    Rdio.user.playlists = new Rdio.Collections.Playlists

###
  Router
###

class Rdio.Routes extends Backbone.Router
  routes:
    "artist/:name": "getArtist"

  getArtist: (url_frag)->
    artist = Rdio.user.artists.find (artist) ->
      if artist.get('url') is "/artist/#{url_frag}/"
        return true

    $("##{artist.get('artistKey')}").trigger('click')

    return

###
  Bootstrap
###
$ ->
  MBP.scaleFix()

  new Rdio.Views.app

  Rdio.search = new Rdio.Views.Search

  Rdio.router = new Rdio.Routes
  Backbone.history.start({ pushState: true })

  if location.pathname.length > 1
    Rdio.router.navigate( location.pathname, true )


