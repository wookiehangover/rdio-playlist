/*global describe, beforeEach, afterEach, it, expect, spyOn */
var sinon = require('sinon')
  , Rdio = require('../lib/rdio');

describe('Rdio', function(){

  describe('Basic Requirements', function(){

    it('should construct an object', function(){
      this.api = new Rdio('key','secret');
      expect( this.api ).toBeDefined();
      expect( typeof this.api == 'object' ).toBeTruthy();
    });

    it('should set basic parameters', function(){
      this.api = new Rdio('key','secret');
      expect( this.api.url_base ).toBeDefined();
    });

  });

  describe('Rdio#initialize', function(){

    beforeEach(function(){
      this.spy = sinon.spy( Rdio.prototype, 'initialize' );
      this.api = new Rdio('key','secret');
    });

    afterEach(function(){
      this.spy.restore();
    });

    it('should be called from constructor', function(){
      expect( this.spy.called ).toBeTruthy();
    });

    it('should add the key / secret to the Rdio object', function(){
      expect( this.api._key ).toBe('key');
      expect( this.api._secret ).toBe('secret');
    });

    it('should expose oauth', function(){
      expect( this.api.oauth ).toBeDefined();
    });


  });

  describe('Rdio#getRequestToken', function(){

    beforeEach(function(){
      this.api = new Rdio('key', 'secret');
      this.spy = sinon.spy( this.api.oauth, 'getOAuthRequestToken');
    });

    afterEach(function(){
      this.spy.restore();
    });

    it('should call the oauth lib', function(){
      this.api.getRequestToken();
      expect( this.spy.called ).toBeTruthy();
    });

    it('should attach the response to a user object', function(){
      this.api.getRequestToken();
      var spyCall = this.spy.getCall(0);
      spyCall.args[1].call(this.api);

      expect( this.api.user ).toBeDefined();
    });

  });



});
