###
  Models#Track
###
class Rdio.Models.Track extends Backbone.Model


###
  Collections#Tracks
###
class Rdio.Collections.Tracks extends Backbone.Collection
  url: ->
    "/api/get?keys=#{@keys.join(',')}"

  initialize: ( data, keys )->
    if keys?
      @keys  = keys

    @model = Rdio.Models.Track

  fetch: (callback)=>
    $.get @url(), (data)=>
      @add _(data).values()

      if _.isFunction( callback )
        callback()

  addTrack: ( key ) =>
    $.get "/api/get?keys=#{key}", (data) =>
      @add _(data).values()

