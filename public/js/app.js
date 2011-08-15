(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window.Rdio = {
    Models: {},
    Collections: {},
    Views: {},
    user: {},
    config: {}
  };
  $('#loader').ajaxStop(function() {
    return $(this).fadeOut();
  }).ajaxStart(function() {
    return $(this).fadeIn();
  });
  /*
    App ViewController
  */
  Rdio.Views.app = (function() {
    __extends(app, Backbone.View);
    function app() {
      app.__super__.constructor.apply(this, arguments);
    }
    app.prototype.el = $('body');
    app.prototype.initialize = function() {
      Rdio.user.artists = new Rdio.Collections.Artists;
      return Rdio.user.playlists = new Rdio.Collections.Playlists;
    };
    return app;
  })();
  /*
    Router
  */
  Rdio.Routes = (function() {
    __extends(Routes, Backbone.Router);
    function Routes() {
      Routes.__super__.constructor.apply(this, arguments);
    }
    Routes.prototype.routes = {
      "artist/:name": "getArtist"
    };
    Routes.prototype.getArtist = function(url_frag) {
      var artist;
      artist = Rdio.user.artists.find(function(artist) {
        if (artist.get('url') === ("/artist/" + url_frag + "/")) {
          return true;
        }
      });
      $("#" + (artist.get('artistKey'))).trigger('click');
    };
    return Routes;
  })();
  /*
    Bootstrap
  */
  $(function() {
    new Rdio.Views.app;
    Rdio.router = new Rdio.Routes;
    Backbone.history.start({
      pushState: true
    });
    if (location.pathname.length > 1) {
      return Rdio.router.navigate(location.pathname, true);
    }
  });
  /*
    Collections#Albums
  */
  Rdio.Collections.ArtistAlbums = (function() {
    __extends(ArtistAlbums, Backbone.Collection);
    function ArtistAlbums() {
      ArtistAlbums.__super__.constructor.apply(this, arguments);
    }
    ArtistAlbums.prototype.initialize = function(data, $parent) {
      this.model = Rdio.Models.Album;
      return this.view = new Rdio.Views.ArtistAlbums(this, $parent);
    };
    return ArtistAlbums;
  })();
  /*
    Models#Album
  */
  Rdio.Models.Album = (function() {
    __extends(Album, Backbone.Model);
    function Album() {
      Album.__super__.constructor.apply(this, arguments);
    }
    Album.prototype.initialize = function(data) {
      return this.set({
        id: data.albumKey
      });
    };
    return Album;
  })();
  /*
    Artists
  */
  Rdio.Collections.Artists = (function() {
    __extends(Artists, Backbone.Collection);
    function Artists() {
      Artists.__super__.constructor.apply(this, arguments);
    }
    Artists.prototype.url = '/api/getArtistsInCollection';
    Artists.prototype.initialize = function() {
      var cached_artists;
      this.model = Rdio.Models.Artist;
      cached_artists = qlc('artists');
      if (cached_artists != null) {
        this.reset(cached_artists);
        this.view = new Rdio.Views.Artists(this);
        return;
      }
      return this.fetch().success(__bind(function(data) {
        qlc('artists', data, false, true);
        return this.view = new Rdio.Views.Artists(this);
      }, this));
    };
    return Artists;
  })();
  Rdio.Models.Artist = (function() {
    __extends(Artist, Backbone.Model);
    function Artist() {
      this.getAlbums = __bind(this.getAlbums, this);
      Artist.__super__.constructor.apply(this, arguments);
    }
    Artist.prototype.initialize = function(data) {
      return this.set({
        id: this.cid
      });
    };
    Artist.prototype.getAlbums = function($parent) {
      if (this.ablums != null) {
        return this.albums.view.render();
      }
      return $.get("/api/getAlbumsForArtistInCollection?artist=" + (this.get('key')), __bind(function(data) {
        return this.albums = new Rdio.Collections.ArtistAlbums(data, $parent);
      }, this));
    };
    return Artist;
  })();
  /*
    Collection#Playlists
  */
  Rdio.Collections.Playlists = (function() {
    __extends(Playlists, Backbone.Collection);
    function Playlists() {
      Playlists.__super__.constructor.apply(this, arguments);
    }
    Playlists.prototype.url = '/api/getPlaylists?extras=trackKeys';
    Playlists.prototype.initialize = function() {
      this.model = Rdio.Models.Playlist;
      this.view = new Rdio.Views.Playlists;
      return $.get(this.url).success(__bind(function(data) {
        return this.add(data.owned);
      }, this));
    };
    return Playlists;
  })();
  /*
    Models#Playlist
  */
  Rdio.Models.Playlist = (function() {
    __extends(Playlist, Backbone.Model);
    function Playlist() {
      this.getTracks = __bind(this.getTracks, this);
      Playlist.__super__.constructor.apply(this, arguments);
    }
    Playlist.prototype.initialize = function() {
      return this.view = new Rdio.Views.Playlist(this);
    };
    Playlist.prototype.getTracks = function(callback) {
      this.tracks = new Rdio.Collections.Tracks(null, this.get('trackKeys'));
      return this.tracks.fetch(callback);
    };
    return Playlist;
  })();
  /*
    Model#NewPlaylist
  */
  Rdio.Models.NewPlaylist = (function() {
    __extends(NewPlaylist, Backbone.Model);
    function NewPlaylist() {
      NewPlaylist.__super__.constructor.apply(this, arguments);
    }
    NewPlaylist.prototype.initialize = function(view) {
      this.tracks = new Rdio.Collections.Tracks;
      this.view = Rdio.editPlaylist;
      this.view.render();
      return this.tracks.bind('add', __bind(function() {
        return this.view.render({
          tracks: this.tracks.toJSON()
        });
      }, this));
    };
    return NewPlaylist;
  })();
  /*
    Models#Track
  */
  Rdio.Models.Track = (function() {
    __extends(Track, Backbone.Model);
    function Track() {
      Track.__super__.constructor.apply(this, arguments);
    }
    return Track;
  })();
  /*
    Collections#Tracks
  */
  Rdio.Collections.Tracks = (function() {
    __extends(Tracks, Backbone.Collection);
    function Tracks() {
      this.addTrack = __bind(this.addTrack, this);
      this.fetch = __bind(this.fetch, this);
      Tracks.__super__.constructor.apply(this, arguments);
    }
    Tracks.prototype.url = function() {
      return "/api/get?keys=" + (this.keys.join(','));
    };
    Tracks.prototype.initialize = function(data, keys) {
      if (keys != null) {
        this.keys = keys;
      }
      return this.model = Rdio.Models.Track;
    };
    Tracks.prototype.fetch = function(callback) {
      return $.get(this.url(), __bind(function(data) {
        this.add(_(data).values());
        if (_.isFunction(callback)) {
          return callback();
        }
      }, this));
    };
    Tracks.prototype.addTrack = function(key) {
      return $.get("/api/get?keys=" + key, __bind(function(data) {
        return this.add(_(data).values());
      }, this));
    };
    return Tracks;
  })();
  /*
    Albums ViewController
  */
  Rdio.Views.ArtistAlbums = (function() {
    __extends(ArtistAlbums, Backbone.View);
    function ArtistAlbums() {
      this.addToPlaylist = __bind(this.addToPlaylist, this);
      this.openAlbum = __bind(this.openAlbum, this);
      this.render = __bind(this.render, this);
      ArtistAlbums.__super__.constructor.apply(this, arguments);
    }
    ArtistAlbums.prototype.className = "tree-2";
    ArtistAlbums.prototype.initialize = function(collection, $parent) {
      this.collection = collection;
      this.parent = $parent;
      return this.render();
    };
    ArtistAlbums.prototype.render = function() {
      var body;
      if (this.parent.find('.tree-2').length > 1) {
        return;
      }
      body = JST.albums({
        albums: this.collection.toJSON()
      });
      return $(this.el).html(body).appendTo(this.parent);
    };
    ArtistAlbums.prototype.events = {
      "click .album": "openAlbum",
      "click .add-to-playlist": "addToPlaylist"
    };
    ArtistAlbums.prototype.openAlbum = function() {
      return false;
    };
    ArtistAlbums.prototype.addToPlaylist = function(e) {
      var $this;
      $this = $(e.target);
      if (Rdio.current_playlist != null) {
        Rdio.current_playlist.tracks.addTrack($this.data('track'));
      }
      return false;
    };
    return ArtistAlbums;
  })();
  /*
    Artists ViewController
  */
  Rdio.Views.Artists = (function() {
    __extends(Artists, Backbone.View);
    function Artists() {
      this.loadArtistAlbums = __bind(this.loadArtistAlbums, this);
      this.render = __bind(this.render, this);
      Artists.__super__.constructor.apply(this, arguments);
    }
    Artists.prototype.el = $('#artists-page');
    Artists.prototype.initialize = function(collection) {
      this.collection = collection;
      this.render();
      return this.text_filter = this.$('#filter-artists').quicksearch('#artists-page .tree li');
    };
    Artists.prototype.render = function() {
      return this.el.html(JST.artist({
        artists: this.collection.toJSON()
      }));
    };
    Artists.prototype.events = {
      "click .artist": "loadArtistAlbums"
    };
    Artists.prototype.loadArtistAlbums = function(e) {
      var $parent, $this, artist;
      e.preventDefault();
      $this = $(e.target);
      $parent = $this.parent().toggleClass('active');
      if ($parent.find('.tree-2').length > 0) {
        $parent.find('.tree-2').slideToggle();
        return;
      }
      artist = this.collection.getByCid($this.data('cid'));
      return artist.getAlbums($this.parent());
    };
    return Artists;
  })();
  /*
    Views#Playlists
  */
  Rdio.Views.Playlists = (function() {
    __extends(Playlists, Backbone.View);
    function Playlists() {
      this.newPlaylist = __bind(this.newPlaylist, this);
      Playlists.__super__.constructor.apply(this, arguments);
    }
    Playlists.prototype.el = $('#playlist-page');
    Playlists.prototype.initialize = function() {
      return Rdio.editPlaylist = new Rdio.Views.EditPlaylist;
    };
    Playlists.prototype.events = {
      "click .new": "newPlaylist"
    };
    Playlists.prototype.newPlaylist = function() {
      Rdio.current_playlist = new Rdio.Models.NewPlaylist;
      return false;
    };
    return Playlists;
  })();
  /*
    Views#Playlist
  */
  Rdio.Views.Playlist = (function() {
    __extends(Playlist, Backbone.View);
    function Playlist() {
      this.edit = __bind(this.edit, this);
      Playlist.__super__.constructor.apply(this, arguments);
    }
    Playlist.prototype.tagName = 'li';
    Playlist.prototype.initialize = function(model) {
      this.model = model;
      return this.render();
    };
    Playlist.prototype.render = function() {
      return $(this.el).html(JST.playlist(this.model.toJSON())).appendTo('#playlists');
    };
    Playlist.prototype.events = {
      "click a": "edit"
    };
    Playlist.prototype.edit = function() {
      this.model.getTracks(__bind(function() {
        return Rdio.editPlaylist.render({
          playlist: this.model.toJSON(),
          tracks: this.model.tracks.toJSON()
        });
      }, this));
      return false;
    };
    return Playlist;
  })();
  /*
    Views#EditPlaylist
  */
  Rdio.Views.EditPlaylist = (function() {
    __extends(EditPlaylist, Backbone.View);
    function EditPlaylist() {
      this.savePlaylist = __bind(this.savePlaylist, this);
      this.close = __bind(this.close, this);
      this.render = __bind(this.render, this);
      EditPlaylist.__super__.constructor.apply(this, arguments);
    }
    EditPlaylist.prototype.el = $('.edit-playlist');
    EditPlaylist.prototype.render = function(data) {
      return this.el.html(JST.playlist_edit(data)).addClass('active');
    };
    EditPlaylist.prototype.events = {
      "click button": "close",
      'click input[type="submit"]': "savePlaylist"
    };
    EditPlaylist.prototype.close = function() {
      this.el.removeClass('active');
      return false;
    };
    EditPlaylist.prototype.savePlaylist = function() {
      var desc, name, tracks;
      tracks = Rdio.current_playlist.tracks.map(function(t) {
        return t.get('key');
      });
      name = this.el.find('#playlist-name');
      desc = this.el.find('#playlist-desc');
      $.get("/api/createPlaylist?name=" + (name.val()) + "&description=" + (desc.val()) + "&tracks=" + (tracks.join(',')), __bind(function(data) {
        console.log(data);
        return Rdio.user.playlists = new Rdio.Collections.Playlists;
      }, this));
      return false;
    };
    return EditPlaylist;
  })();
}).call(this);
