/*
* Authors: Sam Breed & Taylor Beseda
*/

(function ($, window) {

// Accepts a key, a value, and flags for persistence and expires timestamps
var qlc = function (key, value, persist, expires) {

  if( typeof key == "undefined" || !qlc.canHasStorage() ) return false;

  var data,
      is_json = /^\{|\[.+\}|\]$/,
      cache_value = localStorage[key];

  // Return value if just the key is passed
  if( typeof value == "undefined" ) {
    // Detect if the string from localStorage tastes like JSON or an Array
    return ( is_json.test(cache_value) ) ? JSON.parse(cache_value): cache_value;
  }

  // Stick new value into an array with old value(s)
  if( cache_value && persist ) {

    // the best bet is to attempt to parse the old data, because
    // the is_json regex is ineffective at type persistance. this
    // solution lets us store and retrieve numbers (for timestamps) reliably
    try {
      data = JSON.parse( cache_value );
    } catch(parse_error) {
      data = cache_value;
    }

    // if its already been persisted, we don't need to wrap it in []
    if( $.isArray(data) ) {

      // Don't hold on to more than X objects in a given key,
      // only applies when we're _sure_ we have an array
      persist = ( typeof persist ==  "number" ) ? persist: 4;
      if( data.length > persist ) data.shift();

      data.push(value);
    } else {
      data = [ data, value ];
    }

  } else {
    data = value;
  }

  // Stringify any objects on the way in.
  //
  // http://jsperf.com/localstorage-direct-access-vs-native-methods
  while(true){
    try {
      localStorage[key] = ( typeof data == "object" ) ? JSON.stringify(data): data;
      break;
    } catch(storage_error){
      // If we're out of space, delete the oldest keys
      if ( storage_error.name == "QUOTA_EXCEEDED_ERR" || storage_error.name == "NS_ERROR_DOM_QUOTA_REACHED" )
        qlc.flushCache();
    }
  }

  // Set an optional expires key, useful for knowing when to refresh cache.
  // we set it with qlc() to have it honor the persitence rules, and remove
  // any previously set _expires keys when false
  if( expires ) {
    qlc( key + "_expires", ( typeof expires == "number" ) ? expires: $.now(), persist );
  } else {
    delete localStorage[ key + "_expires" ];
  }

};

qlc.kill = function(key){
  delete localStorage[key];
  delete localStorage[key +'_expires'];
};

// Removes half the oldest keys, based off of expires keys
qlc.flushCache = function(){
  var len = localStorage.length,
      expires_keys = [],
      key;

  // Find all expires keys
  for(var i = 0; i < len; i += 1) {
    key = localStorage.key(i);

    if( /_expires$/.test(key) )
      expires_keys.push(key);
  }

  // Sort the expires keys by date
  expires_keys.sort(function(a, b) {
    var date_a = localStorage[a], date_b = localStorage[b];

    if( $.isArray(date_a) ) date_a = date_a[0];
    if( $.isArray(date_b) ) date_b = date_b[0];

    return date_a < date_b ? -1 : (date_a > date_b ? +1 : 0);
  });

  // Loop thru half of expires key and remove them
  for (var j = 0; j < expires_keys.length / 2; j += 1) {
    var _key = expires_keys[j];

    delete localStorage[_key];
    delete localStorage[_key.replace(/_expires$/, "")];
  }
};


// Credit to Jeff Bail for pointing out the need for this
//  http://jeffbail.com/
qlc.canHasStorage = function(){
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch(not_supported) {
    return false;
  }
};


window.qlc = qlc;


})(jQuery, window);
/*
Copyright (c) 2011 Quick Left

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
