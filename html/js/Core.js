/* https://github.com/js-cookie/js-cookie */
/*!
 * JavaScript Cookie v2.2.1
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
    var registeredInModuleLoader;
    if (typeof define === 'function' && define.amd) {
        define(factory);
        registeredInModuleLoader = true;
    }
    if (typeof exports === 'object') {
        module.exports = factory();
        registeredInModuleLoader = true;
    }
    if (!registeredInModuleLoader) {
        var OldCookies = window.Cookies;
        var api = window.Cookies = factory();
        api.noConflict = function () {
            window.Cookies = OldCookies;
            return api;
        };
    }
}(function () {
    function extend () {
        var i = 0;
        var result = {};
        for (; i < arguments.length; i++) {
            var attributes = arguments[ i ];
            for (var key in attributes) {
                result[key] = attributes[key];
            }
        }
        return result;
    }

    function decode (s) {
        return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
    }

    function init (converter) {
        function api() {}

        function set (key, value, attributes) {
            if (typeof document === 'undefined') {
                return;
            }

            attributes = extend({
                path: '/'
            }, api.defaults, attributes);

            if (typeof attributes.expires === 'number') {
                attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
            }

            // We're using "expires" because "max-age" is not supported by IE
            attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

            try {
                var result = JSON.stringify(value);
                if (/^[\{\[]/.test(result)) {
                    value = result;
                }
            } catch (e) {}

            value = converter.write ?
                converter.write(value, key) :
                encodeURIComponent(String(value))
                    .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

            key = encodeURIComponent(String(key))
                .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
                .replace(/[\(\)]/g, escape);

            var stringifiedAttributes = '';
            for (var attributeName in attributes) {
                if (!attributes[attributeName]) {
                    continue;
                }
                stringifiedAttributes += '; ' + attributeName;
                if (attributes[attributeName] === true) {
                    continue;
                }

                // Considers RFC 6265 section 5.2:
                // ...
                // 3.  If the remaining unparsed-attributes contains a %x3B (";")
                //     character:
                // Consume the characters of the unparsed-attributes up to,
                // not including, the first %x3B (";") character.
                // ...
                stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
            }

            return (document.cookie = key + '=' + value + stringifiedAttributes);
        }

        function get (key, json) {
            if (typeof document === 'undefined') {
                return;
            }

            var jar = {};
            // To prevent the for loop in the first place assign an empty array
            // in case there are no cookies at all.
            var cookies = document.cookie ? document.cookie.split('; ') : [];
            var i = 0;

            for (; i < cookies.length; i++) {
                var parts = cookies[i].split('=');
                var cookie = parts.slice(1).join('=');

                if (!json && cookie.charAt(0) === '"') {
                    cookie = cookie.slice(1, -1);
                }

                try {
                    var name = decode(parts[0]);
                    cookie = (converter.read || converter)(cookie, name) ||
                        decode(cookie);

                    if (json) {
                        try {
                            cookie = JSON.parse(cookie);
                        } catch (e) {}
                    }

                    jar[name] = cookie;

                    if (key === name) {
                        break;
                    }
                } catch (e) {}
            }

            return key ? jar[key] : jar;
        }

        api.set = set;
        api.get = function (key) {
            return get(key, false /* read as raw */);
        };
        api.getJSON = function (key) {
            return get(key, true /* read as json */);
        };
        api.remove = function (key, attributes) {
            set(key, '', extend(attributes, {
                expires: -1
            }));
        };

        api.defaults = {};

        api.withConverter = init;

        return api;
    }

    return init(function () {});
}));
// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.4
var LZString = (function() {

// private property
var f = String.fromCharCode;
var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
var baseReverseDic = {};

function getBaseValue(alphabet, character) {
  if (!baseReverseDic[alphabet]) {
    baseReverseDic[alphabet] = {};
    for (var i=0 ; i<alphabet.length ; i++) {
      baseReverseDic[alphabet][alphabet.charAt(i)] = i;
    }
  }
  return baseReverseDic[alphabet][character];
}

var LZString = {
  compressToBase64 : function (input) {
    if (input == null) return "";
    var res = LZString._compress(input, 6, function(a){return keyStrBase64.charAt(a);});
    switch (res.length % 4) { // To produce valid Base64
    default: // When could this happen ?
    case 0 : return res;
    case 1 : return res+"===";
    case 2 : return res+"==";
    case 3 : return res+"=";
    }
  },

  decompressFromBase64 : function (input) {
    if (input == null) return "";
    if (input == "") return null;
    return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrBase64, input.charAt(index)); });
  },

  compressToUTF16 : function (input) {
    if (input == null) return "";
    return LZString._compress(input, 15, function(a){return f(a+32);}) + " ";
  },

  decompressFromUTF16: function (compressed) {
    if (compressed == null) return "";
    if (compressed == "") return null;
    return LZString._decompress(compressed.length, 16384, function(index) { return compressed.charCodeAt(index) - 32; });
  },

  //compress into uint8array (UCS-2 big endian format)
  compressToUint8Array: function (uncompressed) {
    var compressed = LZString.compress(uncompressed);
    var buf=new Uint8Array(compressed.length*2); // 2 bytes per character

    for (var i=0, TotalLen=compressed.length; i<TotalLen; i++) {
      var current_value = compressed.charCodeAt(i);
      buf[i*2] = current_value >>> 8;
      buf[i*2+1] = current_value % 256;
    }
    return buf;
  },

  //decompress from uint8array (UCS-2 big endian format)
  decompressFromUint8Array:function (compressed) {
    if (compressed===null || compressed===undefined){
        return LZString.decompress(compressed);
    } else {
        var buf=new Array(compressed.length/2); // 2 bytes per character
        for (var i=0, TotalLen=buf.length; i<TotalLen; i++) {
          buf[i]=compressed[i*2]*256+compressed[i*2+1];
        }

        var result = [];
        buf.forEach(function (c) {
          result.push(f(c));
        });
        return LZString.decompress(result.join(''));

    }

  },


  //compress into a string that is already URI encoded
  compressToEncodedURIComponent: function (input) {
    if (input == null) return "";
    return LZString._compress(input, 6, function(a){return keyStrUriSafe.charAt(a);});
  },

  //decompress from an output of compressToEncodedURIComponent
  decompressFromEncodedURIComponent:function (input) {
    if (input == null) return "";
    if (input == "") return null;
    input = input.replace(/ /g, "+");
    return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrUriSafe, input.charAt(index)); });
  },

  compress: function (uncompressed) {
    return LZString._compress(uncompressed, 16, function(a){return f(a);});
  },
  _compress: function (uncompressed, bitsPerChar, getCharFromInt) {
    if (uncompressed == null) return "";
    var i, value,
        context_dictionary= {},
        context_dictionaryToCreate= {},
        context_c="",
        context_wc="",
        context_w="",
        context_enlargeIn= 2, // Compensate for the first entry which should not count
        context_dictSize= 3,
        context_numBits= 2,
        context_data=[],
        context_data_val=0,
        context_data_position=0,
        ii;

    for (ii = 0; ii < uncompressed.length; ii += 1) {
      context_c = uncompressed.charAt(ii);
      if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
        context_dictionary[context_c] = context_dictSize++;
        context_dictionaryToCreate[context_c] = true;
      }

      context_wc = context_w + context_c;
      if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
        context_w = context_wc;
      } else {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
          if (context_w.charCodeAt(0)<256) {
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<8 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          } else {
            value = 1;
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1) | value;
              if (context_data_position ==bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = 0;
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<16 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
          delete context_dictionaryToCreate[context_w];
        } else {
          value = context_dictionary[context_w];
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }


        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        // Add wc to the dictionary.
        context_dictionary[context_wc] = context_dictSize++;
        context_w = String(context_c);
      }
    }

    // Output the code for w.
    if (context_w !== "") {
      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
        if (context_w.charCodeAt(0)<256) {
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<8 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        } else {
          value = 1;
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | value;
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = 0;
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<16 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        delete context_dictionaryToCreate[context_w];
      } else {
        value = context_dictionary[context_w];
        for (i=0 ; i<context_numBits ; i++) {
          context_data_val = (context_data_val << 1) | (value&1);
          if (context_data_position == bitsPerChar-1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }


      }
      context_enlargeIn--;
      if (context_enlargeIn == 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
    }

    // Mark the end of the stream
    value = 2;
    for (i=0 ; i<context_numBits ; i++) {
      context_data_val = (context_data_val << 1) | (value&1);
      if (context_data_position == bitsPerChar-1) {
        context_data_position = 0;
        context_data.push(getCharFromInt(context_data_val));
        context_data_val = 0;
      } else {
        context_data_position++;
      }
      value = value >> 1;
    }

    // Flush the last char
    while (true) {
      context_data_val = (context_data_val << 1);
      if (context_data_position == bitsPerChar-1) {
        context_data.push(getCharFromInt(context_data_val));
        break;
      }
      else context_data_position++;
    }
    return context_data.join('');
  },

  decompress: function (compressed) {
    if (compressed == null) return "";
    if (compressed == "") return null;
    return LZString._decompress(compressed.length, 32768, function(index) { return compressed.charCodeAt(index); });
  },

  _decompress: function (length, resetValue, getNextValue) {
    var dictionary = [],
        next,
        enlargeIn = 4,
        dictSize = 4,
        numBits = 3,
        entry = "",
        result = [],
        i,
        w,
        bits, resb, maxpower, power,
        c,
        data = {val:getNextValue(0), position:resetValue, index:1};

    for (i = 0; i < 3; i += 1) {
      dictionary[i] = i;
    }

    bits = 0;
    maxpower = Math.pow(2,2);
    power=1;
    while (power!=maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position == 0) {
        data.position = resetValue;
        data.val = getNextValue(data.index++);
      }
      bits |= (resb>0 ? 1 : 0) * power;
      power <<= 1;
    }

    switch (next = bits) {
      case 0:
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 1:
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 2:
        return "";
    }
    dictionary[3] = c;
    w = c;
    result.push(c);
    while (true) {
      if (data.index > length) {
        return "";
      }

      bits = 0;
      maxpower = Math.pow(2,numBits);
      power=1;
      while (power!=maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb>0 ? 1 : 0) * power;
        power <<= 1;
      }

      switch (c = bits) {
        case 0:
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }

          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 1:
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 2:
          return result.join('');
      }

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

      if (dictionary[c]) {
        entry = dictionary[c];
      } else {
        if (c === dictSize) {
          entry = w + w.charAt(0);
        } else {
          return null;
        }
      }
      result.push(entry);

      // Add w+entry[0] to the dictionary.
      dictionary[dictSize++] = w + entry.charAt(0);
      enlargeIn--;

      w = entry;

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

    }
  }
};
  return LZString;
})();

if (typeof define === 'function' && define.amd) {
  define(function () { return LZString; });
} else if( typeof module !== 'undefined' && module != null ) {
  module.exports = LZString
}

(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    rawHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = 'status' in options ? options.status : 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

// CloudFramework Core Class to facilitate communication with APIs
Core = new function () {
    this.version = '2020.01.04';
    this.debug = true;
    this.authActive = false;
    this.authCookieName = 'cfauth';

    this.url = new function () {
        this.params = function(pos) {
            var path = window.location.pathname.split('/');
            path.shift();
            if(typeof pos == 'undefined') {
                return path;
            } else {
                return (path[pos])?path[pos]:null;
            }
        }
        this.formParams = function(name, url) {
            let _url = url || window.location.href;
            if(typeof name == 'undefined') {
                var results = new RegExp('[\?&](.*)').exec(_url);
                if(null == results) return '';
                else return results[1] || 0;
            }
            // Else search for the field
            else {
                var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(_url);
                if (results == null) {
                    results = new RegExp('[\?&](' + name + ')[&#$]*').exec(_url);
                    if (results == null) return null;
                    else return true;
                } else {
                    return results[1] || '';
                }
            }
        }

        this.deleteFormParam = function(param){
          if(!param) return;

          let url = window.location.href;
          var newAdditionalURL = "";
            var tempArray = url.split("?");
            var baseURL = tempArray[0];
            var additionalURL = tempArray[1];
            var temp = "";
            if (additionalURL) {
                tempArray = additionalURL.split("&");
                for (var i=0; i<tempArray.length; i++){
                    if(tempArray[i].split('=')[0] != param){
                        newAdditionalURL += temp + tempArray[i];
                        temp = "&";
                    }
                }
                window.history.pushState(baseURL + "?" + newAdditionalURL, '', baseURL + "?" + newAdditionalURL);
            }

        }

        this.updateFormParam = function(params){
          var url = params.url || window.location.href;
          var param = params.param;
          var paramVal = params.paramVal
          var urlUpdate = params.update || null;
    
                var newAdditionalURL = "";
                var tempArray = url.split("?");
                var baseURL = tempArray[0];
                var additionalURL = tempArray[1];
                var temp = "";
                if (additionalURL) {
                    tempArray = additionalURL.split("&");
                    for (var i=0; i<tempArray.length; i++){
                        if(tempArray[i].split('=')[0] != param){
                            newAdditionalURL += temp + tempArray[i];
                            temp = "&";
                        }
                    }
                }
                var rows_txt = temp + "" + param + "=" + paramVal;
                if(urlUpdate){
                    window.history.pushState(baseURL + "?" + newAdditionalURL + rows_txt, '', baseURL + "?" + newAdditionalURL + rows_txt);
                    // window.history.replaceState('', '', baseURL + "?" + newAdditionalURL + rows_txt);
                }else{
                    return baseURL + "?" + newAdditionalURL + rows_txt;
                }
        }
        // hash, host, hostname, href, origin, pathname, port, protocol
        this.parts = function(part) {
            if(typeof part=='undefined') return window.location;
            else return window.location[part];
        }
    };

    // Log class control. printDebug requires debug = true
    this.log =  new function () {
        this.debug = true;
        this.type = 'console';

        // Print if debug == false
        this.printDebug = function(title,content,separator) {
            // If no debug return
            if (!Core.log.debug) return;
            // Core.log.print('[DEBUG] '+title,content,separator);
        };

        // Print in console.
        this.print = function (title, content,separator) {

            // If no title, print:
            if (typeof title == 'undefined') title = 'print:';

            // If no content: ''
            if (typeof content == 'undefined') content = false;



            // ECHO INFO
            // in console
            if (Core.log.type == 'console') {

                console.log(content);

                if (typeof title == 'object') title = JSON.parse(JSON.stringify(title));
                if (typeof content == 'object')  content = JSON.parse(JSON.stringify(content));

                // console.log(title);
                if (title) {
                    console.log(title,content);
                }
            }
            // in the dom
            else {

                if (typeof title == 'object') title = JSON.stringify(title);
                if (typeof content == 'object')  content = JSON.stringify(content);

                // Separator
                if (typeof separator == 'undefined') separator = false;

                // Echo
                var output = title;
                if(content)  output +=content;
                if(separator)  output +="\n-----------\n";

                if((element = document.getElementById(Core.log.type))!=null) {
                    element.innerHTML = element.innerHTML+output;
                } else {
                    console.log('Core.log.type values '+Core.log.type+' and it does not exist as a id dom');
                    console.log(output);
                }

            }
        };

    };

    // Error class control.
    this.error = new function () {
        this.add = function (title, content,separator) {
            // If no title, print:
            if (typeof title == 'undefined') title = '[Core.error]:';
            else if(typeof title =='string') title = '[Core.error]: '+title;
            Core.log.print(title,content,true);
        };
    };

    // No persistent data. If reload page the info will be lost.
    this.data = new function () {

        this.info = {};

        this.add = function(data) {

            if (Core.debug) Core.log.printDebug('Core.data.add(' + JSON.stringify(varname)+');');

            if(typeof data !='object') {
                Core.error.add('Core.data.add(data)','data is not an object');
                return false;
            }

            for(k in data) {
                Core.data.info[k] = data[k];
            }
            return true;
        }

        this.set = function(key,value) {

            if (Core.debug) Core.log.printDebug('Core.data.set("'+key+'",' + JSON.stringify(value)+');');

            if(typeof key !='string') {
                Core.error.add('Core.data.set(key,value)','key is not a string');
                return false;
            }

            Core.data.info[key] = value;
            return true;
        }

        this.get = function(key) {
            if (Core.debug) Core.log.printDebug('Core.data.get("'+key+'");');

            if(typeof key =='undefined') return;

            return(Core.data.info[key]);
        }

        this.reset = function() {
            Core.data.info = {};
        }
    };

    // Manage Cookies based on js-cookies
    this.cookies =  new function () {
        this.path = {path: '/'};
        this.remove = function (varname) {
            if (typeof varname != 'undefined') {
                Cookies.remove(varname, {...Core.cookies.path, 'SameSite':'None','Secure':true} );
                if (Core.debug) Core.log.printDebug('Core.cookies.remove("' + varname+'");');
            }
        };
        /*
          varname:  id for the cookie
          data:     value for the cookie
          expDate:  expiration value, in days
         */
        this.set = function (varname, data, expDate) {
          Cookies.set(varname, data, {...Core.cookies.path, expires: expDate || null, 'SameSite':'None','Secure':true});
          if (Core.debug) Core.log.printDebug('Core.cookies.set("' + varname+'","'+data+'");');
        };
        this.get = function (varname) {
            return Cookies.get(varname);
        };
    };

    // Persistent data. Reloading the page the info will be kept in the localStorage compressed if the browser support it
    // It requires LZString: bower install lz-string --save
    this.cache =  new function () {

        this.isAvailable = true;

        if (typeof(Storage) == "undefined") {
            Core.error.add('Cache is not supported in this browser');
            this.available = false;
        };

        /*
          key:          key to stored item
          value:        value to stored item
          expiration:   expiration value, in milliseconds
        */
        this.set = function (key, value, expiration) {
            if (Core.debug) Core.log.printDebug('Core.cache.set("' + key+'",'+JSON.stringify(value)+')');
            if (Core.cache.isAvailable) {
                key = 'CloudFrameWorkCache_'+key;
                if(typeof value == 'object') value = JSON.stringify(value);
                else value = JSON.stringify({__object:value});
                // Compress
                value = LZString.compressToUTF16(value);
                localStorage.setItem(key, value);
                if(expiration){
                  localStorage.setItem(key+'_expiration', LZString.compressToUTF16(JSON.stringify(new Date().getTime() + expiration)));
                }
                // Return
                return true;
            }
            return false;
        };
        this.get = function (key) {
            if (Core.debug) Core.log.printDebug('Core.cache.get("' + key+'")');

            if (Core.cache.isAvailable) {
                var key_cf = 'CloudFrameWorkCache_'+key;
                var ret = localStorage.getItem(key_cf);
                let ret_exp = localStorage.getItem(key_cf+'_expiration');

                if(typeof ret_exp != undefined && ret_exp != null) {
                  const now = new Date();
                  if (now.getTime() > JSON.parse(LZString.decompressFromUTF16(ret_exp))) {
                    localStorage.removeItem(key_cf);
                    localStorage.removeItem(key_cf+'_expiration');
                    return undefined;
                  }
                }

                if(typeof ret != undefined && ret != null) {
                  ret = JSON.parse(LZString.decompressFromUTF16(ret));
                    // if this is ret the content is corrupted and we have to delete the key
                    if(ret === null) {
                        Core.cache.delete(key);
                        return null;
                    }
                    if(typeof ret['__object'] != 'undefined') ret = ret['__object'];
                }
                return ret;

            }
            return false;
        };

        this.delete = function (key) {
            if (Core.debug) Core.log.printDebug('Core.cache.delete("' + key+'",..)');
            if (Core.cache.isAvailable) {
                key = 'CloudFrameWorkCache_'+key;
                localStorage.removeItem(key);
                return true;
            }
            return false;
        };
    };

    // It requires fetch polyfill: bower install fetch --save
    this.request = new function () {
        this.token = ''; // X-DS-TOKEN sent in all calls
        this.key = ''; // X-WEB-KEY sent in all calls
        this.headers = {};
        this.base = 'https://api.cloudframework.io';

        // Object into query string
        this.serialize = function (obj, prefix) {
            var str = [], p;
            for(p in obj) {
                if (obj.hasOwnProperty(p)) {
                    var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
                    str.push((v !== null && typeof v === "object") ?
                        Core.request.serialize(v, k) :
                        encodeURIComponent(k) + "=" + encodeURIComponent(v));
                }
            }
            return str.join("&");
        };

        // Ajax Call
        this.call = function call(payload,callback, errorcallback) {

            // IF url does not start with http..this.base will be prepended.
            if(typeof payload['url'] == 'undefined') return Core.error.add('request.call(payload,..): missing payload["url"].');

            // GET, POST, PUT, DELETE
            if(typeof payload['method'] == 'undefined') payload['method'] ='GET';

            // ACCEPTED VALUES:form or json
            //if(typeof payload['contentType'] == 'undefined') payload['contentType'] ='json';

            // ACCEPTED VALUES: html,json
            if(typeof payload['responseType'] == 'undefined') payload['responseType'] ='json';

            // Add prefix to url
            if(typeof payload['base'] == 'undefined') payload['base'] = Core.request.base;

            // OK CALLBACK
            if (typeof callback == 'undefined' || callback==null) {
                callback = function(response) {
                    console.log(response);
                }
            }

            // ERROR CALLBACK
            if (typeof errorcallback == 'undefined' || errorcallback==null)
                errorcallback = callback;

            // ADD GLOBAL HEADERS IR THE VALUES DOES NOT EXIST
            if(typeof payload['headers'] == 'undefined') payload['headers'] = {};
            for (var k in Core.request.headers) {
                if(typeof payload['headers'][k] == 'undefined')
                    payload['headers'][k] = Core.request.headers[k];
            }

            // CLOUDFRAMEWORK ADDONS: X-DS-TOKEN, X-WEB-KEY
            if (typeof Core.request.token != 'undefined' && Core.request.token != '')
                payload['headers']['X-DS-TOKEN'] = Core.request.token;
            if (typeof Core.request.key != 'undefined' && Core.request.key != '' && !payload['headers']['X-WEB-KEY'])
                payload['headers']['X-WEB-KEY'] = Core.request.key;

            // END-POINT URL generation
            var endpoint = payload['url'];
            if(endpoint.search('http') !== 0) {
                endpoint = payload['base']+endpoint;
            }

            // Mode of the call: cors, no-cors, same-origin
            if(typeof payload['mode'] == 'undefined') {
                // payload['mode'] = 'cors';
            }
            else {
                if((payload['mode']!='cors') && (payload['mode']!='no-cors') && (payload['mode']!='same-origin'))
                    payload['credentials'] = 'cors';
            }

            // Credentials of the call: include, same-origin, omit.. other value crash on mobile browsers
            if(typeof payload['credentials'] == 'undefined') {
                // payload['credentials'] = 'omit';
            }
            else {
                if((payload['credentials']!='include') && (payload['credentials']!='same-origin'))
                    payload['credentials'] = 'omit';
            }

            // cache for the call: default, no-store, reload, no-cache, force-cache, or only-if-cached
            if(typeof payload['cache'] == 'undefined') {
                // payload['cache'] = 'default';
            }
            else {
                if((payload['cache']!='no-store') && (payload['cache']!='reload') && (payload['cache']!='no-cache') && (payload['cache']!='force-cache') && (payload['cache']!='only-if-cached'))
                    payload['cache'] = 'default';
            }

            if(typeof payload['params'] == 'undefined') payload['params'] = {};


            // TRANSFORM DATA
            if(payload['method']=='GET') {
                payload['body'] = null;
                var serialize = '';
                if(Object.keys(payload['params']).length) serialize = Core.request.serialize(payload['params']);
                if(serialize) {
                    if(endpoint.search('[\?]')==-1) endpoint+='?';
                    else endpoint+='&';
                    endpoint+=serialize;
                }
            } else if(payload['method']!='DELETE') {
                // Preparing the content type
                if(payload['contentType']=='json') {
                    payload['headers']['Content-Type'] = 'application/json';
                    payload['body'] = JSON.stringify(payload['params']);
                }
                // Using formData
                else {
                    if(payload['contentType']=='form')
                        payload['headers']['Content-Type'] = 'application/x-www-form-urlencoded';
                    var form_data = new FormData();
                    for(var k in payload['params'])
                        form_data.append(k,payload['params'][k]);

                    payload['body'] = form_data;

                }
            }

            // Debug
            if(Core.debug) Core.log.printDebug('Core.request.call',payload,true);

            // Int the call
            var call = {
                method: payload['method'],
                headers: payload.headers
            };

            // Avoid to add extram params if they do not exist
            if(typeof payload['mode'] != 'undefined') call['mode'] = payload['mode'];
            if(typeof payload['cache'] != 'undefined') call['cache'] = payload['cache'];
            if(typeof payload['credentials'] != 'undefined') call['credentials'] = payload['credentials'];
            if(typeof payload['body'] != 'undefined' && payload['body']!= null) call['body'] = payload['body'];

            fetch(endpoint, call).then(function (response) {
              if(Core.debug) Core.log.printDebug('Core.request.call returning from: '+endpoint+' and transforming result from: '+payload['responseType']);                              
              if(payload['mode']=='no-cors') {
                  return(response);
              } else {
                  // Transform Reutrn
                  if(payload['responseType'] == 'json')
                      return(response.json());
                  else
                      return(response.text());
              }
                              
            }).then(function (response) {
              //Error 401 missing credentials
              if (!response.ok && response.status == 401 && Core.url.parts().pathname != "/"){
                if(!Core.url.formParams('missingaauth')){
                  Core.user.setAuth(false);
                  window.location.replace(`/?redirect=${btoa(window.location.href)}&missingaauth`);
                }                
              }else {
                callback(response);
              }                
            }).catch(function (e) {
                if(typeof e == 'undefined') e = '';
                Core.error.add('[Core.request] fetch(' + endpoint+') ',e.message);
                errorcallback({success:false,errors:['see console']});
            });


        }
        this.get = function (endpoint, callback, errorcallback, typeReturnedExpected) {
            Core.request.call({method:'GET',url:endpoint,responseType:typeReturnedExpected}, callback, errorcallback);
        };

        // Headers manipulations
        this.addHeader = function(varname,value) {
            if(Core.debug) Core.log.printDebug('Core.request.addHeader("'+varname+'","'+value+'")');
            Core.request.headers[varname] = value;
        };
        this.removeHeader = function(varname) {
            if(Core.debug) Core.log.printDebug('Core.request.removeHeader("'+varname+'")');
            delete Core.request.headers[varname];
        };
        this.resetHeader = function() {
            if(Core.debug) Core.log.printDebug('Core.request.resetHeader()');
            Core.request.headers = {};
        };
    };

    // Define services to use with Core.request
    this.services = new function() {
        var binds = {};

        // Reset the Bind
        this.reset = function(service) {
            Core.log.printDebug('Bloombees services: reset.'+service);
            if(typeof binds[service] != 'undefined') {
                binds[service]= {config:binds[service]['config']};
            }
        };

        // Add Service
        // config requires:
        // url:
        // method:
        // data:
        this.set = function(service,config) {
            binds[service]=[];
            if(typeof config['url'] == 'undefined') return Core.error.add('Core.services.set("'+service+'",config): missing config["url"].');
            if(typeof config['method'] == 'undefined') return Core.error.add('Core.services.set("'+service+'",config): missing config["method"].');
            binds[service]['config'] = config;
            if(Core.debug) Core.log.printDebug('Core.services.set("'+service+'","'+JSON.stringify(config)+'"): done');
        }

        // Bind the function for a service
        this.bind = function (service,function_definition) {

            // If there is not function return the result into log
            if(typeof binds[service]=='undefined') return(Core.error.add('service.bind("'+service+'",..) does not exist. Use Core.service.set to initialize'));
            if(typeof binds[service]['config']=='undefined') return(Core.error.add('service.bind("'+service+'",..) does not exist. Use Core.service.set to initialize'));

            // Log
            if(Core.debug) Core.log.printDebug("Binding to '"+service+"':");

            // Service can not be undefined. convert into string
            if(typeof service=='undefined') service='undefined';

            // If there is not function return the result into log
            if(typeof function_definition=='undefined') function_definition= function (data) {
                Core.log.print('Core.services.bind automatic created function: '+service,data);
            };

            // If the bind does not exist. Create it
            if(typeof binds[service] == 'undefined') binds[service] = [];

            // If we have returned the data
            if(typeof binds[service]['data'] != 'undefined') {
                if(Core.debug) Core.log.printDebug('service.bind("'+service+'",..) returning data from previous call');
                function_definition(binds[service]['data']);
                return;
            }

            // If the bind callbacks does not exist. Create it
            if(typeof binds[service]['callbacks'] == 'undefined') binds[service]['callbacks'] = [];
            binds[service]['callbacks'].push(function_definition);
            if(Core.debug) Core.log.printDebug('Bingding callback');

            // Callbacks function when the call has been defined
            if(typeof binds[service]['function'] == 'undefined') {

                // Function to receive the response.
                binds[service]['function'] = function(data) {
                    if(Core.debug) Core.log.printDebug('Receiving response from: '+service,'',true);
                    binds[service]['data'] = data;
                    var arrayLength = binds[service]['callbacks'].length;
                    for (var i = 0; i < arrayLength; i++) {
                        binds[service]['callbacks'][i](data);
                    }

                };
                Core.request.call(binds[service]['config'],binds[service]['function']);
            }
        }
    };

    // deprecated
    this.dom = new function() {

        // Search the element in the dom
        this.element = function(id) {
            var element = document.getElementById(id);
            if(null == element ) {
                Core.log.print("'"+id+"' does not exist in any 'id' attribute of the dom's elements");
                return null;
            } else {
                return(element);
            }
        }

        // Add content
        this.setHTML = function (id,value,append) {
            //if(Core.debug) Core.log.printDebug('Core.dom.setHTMLL("'+id+'","'+value+'")');
            Core.dom._setHTML(id,value);
        }
        this.setText = function (id,value,append) {
            Core.dom._setText(id,value);
        }
        // Add content
        this.addHTML = function (id,value) {
            Core.dom._setHTML(id,value,true);
        }
        // Add content
        this.addText = function (id,value) {
            Core.dom._setText(id,value,true);
        }



        // inject the content in HTML
        this._setHTML = function (id,value,append) {
            if(element = Core.dom.element(id)) {
                if(typeof append != 'undefined')
                    element.innerHTML = element.innerHTML+value;
                else
                    element.innerHTML = value;
            }
        }

        // inject the content in TXT
        this._setText = function (id,value,append) {
            if(element = Core.dom.element(id)) {
                if(typeof append != 'undefined')
                    element.innerText = element.innerText+value;
                else
                    element.innerText = value;
            }
        }




    };

    // Manage configuration. It takes <body coore-config='JSON' ..> to init
    this.config = new function () {
        this.config = {};
        this.get = function(configvar) {
            if(Core.debug) Core.log.printDebug('Core.debug.get("'+configvar+'")','',true);
            if(typeof  configvar == 'undefined') {
                return Core.config.config;
            } else {
                return (Core.config.config[configvar])?Core.config.config[configvar]:null;
            }
        }
        this.set = function(configvar,value) {
            if(Core.debug) Core.log.printDebug('Core.debug.set("'+configvar+'","'+value+'")','',true);
            Core.config.config[configvar]=value;
            return true;
        }
    };

    // Localize contents
    this.localize = new function () {
        this.dics = null;
        this.lang = 'en';
        this.dics={};
        // Return a dictionary tag
        this.get = function(localizevar) {
            if(Core.debug) Core.log.printDebug('Core.localize.get("'+localizevar+'")','',true);
            if(typeof  localizevar == 'undefined') {
                return Core.localize.dics;
            } else {
                if(Core.url.formParams('_debugDics')) return localizevar
                else return (typeof Core.localize.dics[localizevar] != 'undefined')?Core.localize.dics[localizevar]:localizevar;

            }
        }

        this.set = function(localizevar,value) {
            if(Core.debug) Core.log.printDebug('Core.debug.set("'+localizevar+'","'+value+'")','',true);
            Core.localize.dics[localizevar]=value;
            return true;
        }

        this.addFromId = function(id) {
            if((element = document.getElementById(id))) {
                if(localize = element.getAttribute("core-localize")) {
                    return(Core.localize.add(JSON.parse(localize)));
                }
            }
            return false;
        }

        this.add = function(dic) {
            if(Core.debug) Core.log.printDebug('Core.debug.set("'+JSON.stringify(dic)+'","'+value+'")','',true)
            for(k in dic) {
                Core.localize.dics[k]=dic[k];
            }
            return true;
        }
    };

    // Managin User info
    this.user = new function () {
        this.auth = false;      // Authenticated true or false
        this.info = {};         // User information when authenticated
        this.cookieVar = null;  // Cookie to use for authentication id

        // If you want to recover data avoiding to do extra call.. use init
        this.init = function (cookieVar) {

            if(!Core.authActive) {
                Core.error.add('Core.user.init: Core.authActive is false');
                return;
            }

            // Calculationg cookieVar if it is not passed
            if(typeof cookieVar =='undefined') {
                if(Core.debug) Core.log.printDebug('Core.user.init: using Core.authCookieName ['+Core.authCookieName+']');
                Core.user.cookieVar = Core.authCookieName;
                cookieVar = Core.user.cookieVar;
            } else {
                Core.user.cookieVar = cookieVar;
            }

            if(typeof cookieVar == null) {
                Core.error.add('Core.user.init: missing cookieVar')
                return;
            }

            if(Core.debug) Core.log.printDebug('Core.user.init("'+cookieVar+'");');
            var value = Core.cookies.get(cookieVar);
            if(!value) {
                if(Core.debug) Core.log.printDebug('Core.user.init: '+cookieVar+' cookie does not have any value.. so Core.user.setAuth(false)');
                if(Core.user.auth) Core.user.setAuth(false);
            } else {
                var cache = null;
                // getting CloudFrameWorkAuthUser
                if(cache = Core.cache.get('CloudFrameWorkAuthUser')) {
                    if(typeof cache['__id'] == undefined || cache['__id']!=value) {
                        if(Core.debug) Core.log.printDebug('Core.user.init: CloudFrameWorkAuthUser {__id:value } DOES NOT MATCH with the value of the cookie '+cookieVar+', so... restart');
                        Core.user.setAuth(true);
                    } else {
                        if(Core.debug) Core.log.printDebug('Core.user.init: CloudFrameWorkAuthUser {__id:value} match with the value of the cookie '+cookieVar);
                        Core.user.auth=true;
                        Core.user.info = cache;
                    }
                }
                // The cookie exist but it has not been generated by setAuth because CloudFrameWorkAuthUser does not exist.. So generate it now.
                else {
                    if(Core.debug) Core.log.printDebug('Core.user.init: Generating a CloudFrameWorkAuthUser {__id:value} for cookie '+cookieVar);
                    Core.user.setAuth(true);
                }
            }
            if(Core.debug) Core.log.printDebug('Core.isAuth(): '+Core.user.isAuth());

        }

        // Set Authentication to true of false
        this.setAuth = function(val) {

            // Assign the current cookie var
            cookieVar = Core.user.cookieVar;

            if(typeof cookieVar =='undefined' || cookieVar == null) {
                Core.error.add('Core.user.setAuth: missing Core.user.cookieVar. Try use Core.init()');
                return;
            }

            if(Core.debug) Core.log.printDebug('Core.user.setAuth('+val+') for cookie: '+cookieVar);

            // No authentication values by default
            Core.user.info = {};
            Core.user.credentials = {};
            Core.user.auth=false;
            Core.cache.set('CloudFrameWorkAuthUser',{});

            // Activating Authentication
            cookieValue = Core.cookies.get(cookieVar);
            if(val) {
                if(typeof cookieValue == 'undefined' || !cookieValue) {
                    Core.error.add('Core.user.setAuth(true), cookieVar does not exist: '+cookieVar);
                    return false;
                } else {
                    Core.user.auth=true;
                    Core.cache.set('CloudFrameWorkAuthUser',{__id:cookieValue});
                    Core.cache.set('_last_auth',new Date().getTime());
                    Core.user.info = {__id:cookieValue};
                    if(Core.debug) Core.log.printDebug('Core.user.setAuth: saved CloudFrameWorkAuthUser in cache with value '+JSON.stringify(Core.cache.get('CloudFrameWorkAuthUser')));
                }
            }
            // Finalizing deactivating authentication
            else {
                // Delete cookieVar if it is passed
                if(typeof cookieValue != 'undefined') Core.cookies.remove(cookieVar);
            }
            return true;

        };

        // Says if a user is auth
        this.isAuth = function() {
            return (Core.user.auth==true);
        }

        this.getCookieValue = function() {
            if(Core.user.cookieVar) return Core.cookies.get(Core.user.cookieVar);
            else return null;
        }

        this.add = function(data) {

            if(typeof data !='object') {
                Core.error.add('Core.user.add(data)','data is not an object');
                return false;
            }
            if(Core.user.isAuth()) {
                for(k in data) {
                    Core.user.info[k] = data[k];
                }
                Core.cache.set('CloudFrameWorkAuthUser',Core.user.info);
                return true;
            } else {
                Core.error.add('Core.user.add','Core.user.isAuth() is false');
                return false;
            }
        }

        this.set = function(key,value) {

            if(typeof key !='string') {
                Core.error.add('Core.user.set(key,value)','key is not a string');
                return false;
            }

            if(Core.user.isAuth()) {
                if(key=='__id') {
                    Core.error.add('Core.user.set(key,value)','key can not be __id');
                    return false;
                }
                Core.user.info[key] = value;
                Core.cache.set('CloudFrameWorkAuthUser',Core.user.info);
                return true;
            } else {
                Core.error.add('Core.user.set(key,value)','Core.user.isAuth() is false');
                return false;
            }
        }

        this.get = function(key) {
            if(typeof key =='undefined') return;

            if(Core.user.isAuth()) {
                return(Core.user.info[key]);

            } else {
                Core.error.add('Core.user.get','Core.user.isAuth() is false');
                return false;
            }
        }

        this.reset = function() {
            if(Core.user.isAuth()) {
                Core.user.info = {__id:Core.user.info['__id']};
                Core.cache.set('CloudFrameWorkAuthUser',Core.user.info);
                return true;
            } else {
                Core.error.add('Core.user.set(key,value)','Core.user.isAuth() is false');
                return false;
            }
        }
    };

    // Bind function based on promises
    this.bind = function(functions,callback,errorcallback) {

        // OK CALLBACK
        if (typeof callback == 'undefined' || callback==null) {
            callback = function(response) {
                console.log(response);
            }
        }

        // ERROR CALLBACK
        if (typeof errorcallback == 'undefined' || errorcallback==null)
            errorcallback = callback;

        var states = [];
        if(typeof functions == 'function') functions = [functions];
        // Execute all the function generating a promise for each of them
        for(k in functions) {
            states[k] = new Promise(functions[k]);
        }

        //
        var promises = Promise.all(states);
        promises.then(function(){
            callback({success:true});
        }, function() {
            errorcallback({success:false});
        })
    };

    // load dynamically scripts
    this.dynamic = new function() {
        this.urls = {};

        this.load = function(data,callback) {

            var script = '';
            var template = '';

            if(typeof data == 'object' && typeof data.script == 'object' && typeof data.script.url == 'string')  script = data.script.url;
            if(typeof data == 'object' && typeof data.template == 'object' && typeof data.template.url == 'string')  template = data.template.url;

            if(script=='' && template=='') {
                Core.error.add('Core.dynamic.load(data,callback) Missing a right value for data. use {[script:{url:"url"}][,template:{url:"url"}]}');
                if(typeof callback) callback();
            } else {
                // Load first the template and after that the script if it applies
                if(template!='') {
                    var localCallBack = function() {
                        if(script!='')    {
                            Core.dynamic.loadScript(data,callback);
                        } else {
                            if(typeof callback!='undefined') callback();
                        }
                    }
                    Core.dynamic.loadTemplate(data,localCallBack);
                } else {
                    Core.dynamic.loadScript(data,callback);
                }
            }
        }

        this.loadScript = function(data,callback) {

            var url = '';
            var id = '';
            var type = 'text/javascript';
            var dom = document.head;

            if(typeof data.script == 'object') {
                if(typeof data.script.url == 'string')  url = data.script.url;
                if(typeof data.script.type == 'string')  type = data.script.type;
                if(typeof data.script.id == 'string')  id = data.script.id;
                if(typeof data.script.dom == 'object')  dom = data.script.dom;
            }
            if(url=='') {
                Core.error.add('Core.dynamic.loadTemplate(data,callback) Missing a right value for data. use {template:url}');
                if(typeof callback) callback();
            } else {
                if(typeof Core.dynamic.urls[url] == 'undefined') {
                    if(Core.debug) Core.log.printDebug('Core.dynamic.loadScript("'+JSON.stringify(data)+'") injecting script');
                    Core.dynamic.urls[url] =  document.createElement('script');
                    Core.dynamic.urls[url].type = type;
                    if(id!='') Core.dynamic.urls[url].id = id;
                    Core.dynamic.urls[url].onload = function( ret) {
                        Core.log.print('Core.dynamic.loadScript("'+url+'") loaded');
                        if(typeof callback=='undefined') {
                            Core.log.print(url+' loaded');
                        } else {
                            callback();
                        }
                    }
                    Core.dynamic.urls[url].src = url;
                    dom.appendChild(Core.dynamic.urls[url]);

                } else {
                    if(Core.debug) Core.log.printDebug('Core.dynamic.loadScript("'+url+'") already loaded');
                    if(typeof callback!='undefined') {
                        callback();
                    }
                }
            }
        }

        this.loadTemplate = function(data,callback) {

            var url = '';
            var object = 'div';
            var id = '';
            var type = '';
            var dom = document.body;

            if(typeof data.template == 'object') {
                if(typeof data.template.url == 'string')  url = data.template.url;
                if(typeof data.template.object == 'string')  object = data.template.object;
                if(typeof data.template.id == 'string')  id = data.template.id;
                if(typeof data.template.type == 'string')  type = data.template.type;
                if(typeof data.template.dom == 'object')  dom = data.template.dom;
            }
            if(url=='') {
                Core.error.add('Core.dynamic.loadTemplate(data,callback) Missing a right value for data. use {template:url}');
                if(typeof callback) callback();
            } else {

                if(typeof Core.dynamic.urls[url] == 'undefined') {
                    if(Core.debug) Core.log.printDebug('Core.dynamic.loadTemplate("'+JSON.stringify(data)+',callback") injecting html');
                    Core.request.call({method:'GET',url:url,responseType:'html',base:''}, function(response) {

                        Core.log.print('Core.dynamic.loadTemplate("'+url+'") loaded');
                        Core.dynamic.urls[url] =  document.createElement(object);
                        if(id!='') Core.dynamic.urls[url].id = id;
                        if(type!='') Core.dynamic.urls[url].type = type;
                        Core.dynamic.urls[url].innerHTML = response;
                        dom.appendChild(Core.dynamic.urls[url]);
                        if(typeof callback!='undefined') {
                            callback();
                        }
                    });

                    //document.head.appendChild(Core.dynamic.urls[url]);
                } else {
                    if(Core.debug) Core.log.printDebug('Core.dynamic.loadTemplate("'+url+'") already loaded');
                    if(typeof callback!='undefined') {
                        callback();
                    }
                }

            }
        }
    }

    // File input helper
    // field expeted a dom.input of type file
    this.fileInput = function (field,payloads) {
        var ret = {length:0,error:false,errorMsg:'',params:[],files:[]};
        if(typeof field =='object') {
            if (field.files.length) {
                for (k = 0; k < field.files.length; k++) {
                    ret.params['files[' + k + ']'] = field.files[k];
                    ret.files[k] = {
                        name: field.files[k].name,
                        size: field.files[k].size,
                        type: field.files[k].type,
                        lastModified: field.files[k].lastModified,
                        lastModifiedDate: field.files[k].lastModifiedDate
                    };
                }
            } else {
                ret.error=true;
                ret.errorMsg ='Not found files';
            }
        }
        return ret;
    }

    // Init the frameWork
    this.init = function(functions,callback) {

        if(Core.debug) Core.log.printDebug('Core.init('+typeof functions+','+typeof callback+')');

        // Check auth
        if(Core.authActive) {
            Core.user.init(Core.authCookieName);
        }

        if(typeof functions == 'function' || typeof functions == 'array' || typeof functions == 'object') {
            Core.bind(functions,function(response) {
                if(typeof callback == 'function')  callback(response);
            });
        } else {
            if(typeof callback == 'function') callback({success:true});
        }

    }

    // It generates a popup avoiding blocking and execute callback once it has finished.
    this.oauthpopup = function(options) {
        options.windowName = options.windowName ||  'ConnectWithOAuth'; // should not include space for IE
        options.windowOptions = options.windowOptions || 'location=0,status=0,width=800,height=400';
        options.callback = options.callback || function(){ window.location.reload(); };
        var that = this;
        console.log(options.path);
        that._oauthWindow = window.open(options.path, options.windowName, options.windowOptions);
        that._oauthWindow.focus();
        that._oauthInterval = window.setInterval(function(){
            if (that._oauthWindow.closed) {
                window.clearInterval(that._oauthInterval);
                options.callback();
            } else {
                that._oauthWindow.focus();
            }

        }, 1000);
    };

};