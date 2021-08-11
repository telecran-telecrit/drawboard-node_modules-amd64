!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var t;"undefined"!=typeof window?t=window:"undefined"!=typeof global?t=global:"undefined"!=typeof self&&(t=self),t.objectHash=e()}}(function(){return function o(i,u,a){function f(n,e){if(!u[n]){if(!i[n]){var t="function"==typeof require&&require;if(!e&&t)return t(n,!0);if(s)return s(n,!0);throw new Error("Cannot find module '"+n+"'")}var r=u[n]={exports:{}};i[n][0].call(r.exports,function(e){var t=i[n][1][e];return f(t||e)},r,r.exports,o,i,u,a)}return u[n].exports}for(var s="function"==typeof require&&require,e=0;e<a.length;e++)f(a[e]);return f}({1:[function(w,b,m){(function(e,t,s,n,r,o,i,u,a){"use strict";var f=w("crypto");function c(e,t){return function(e,t){var n;n="passthrough"!==t.algorithm?f.createHash(t.algorithm):new y;void 0===n.write&&(n.write=n.update,n.end=n.update);g(t,n).dispatch(e),n.update||n.end("");if(n.digest)return n.digest("buffer"===t.encoding?void 0:t.encoding);var r=n.read();return"buffer"!==t.encoding?r.toString(t.encoding):r}(e,t=h(e,t))}(m=b.exports=c).sha1=function(e){return c(e)},m.keys=function(e){return c(e,{excludeValues:!0,algorithm:"sha1",encoding:"hex"})},m.MD5=function(e){return c(e,{algorithm:"md5",encoding:"hex"})},m.keysMD5=function(e){return c(e,{algorithm:"md5",encoding:"hex",excludeValues:!0})};var l=f.getHashes?f.getHashes().slice():["sha1","md5"];l.push("passthrough");var d=["buffer","hex","binary","base64"];function h(e,t){t=t||{};var n={};if(n.algorithm=t.algorithm||"sha1",n.encoding=t.encoding||"hex",n.excludeValues=!!t.excludeValues,n.algorithm=n.algorithm.toLowerCase(),n.encoding=n.encoding.toLowerCase(),n.ignoreUnknown=!0===t.ignoreUnknown,n.respectType=!1!==t.respectType,n.respectFunctionNames=!1!==t.respectFunctionNames,n.respectFunctionProperties=!1!==t.respectFunctionProperties,n.unorderedArrays=!0===t.unorderedArrays,n.unorderedSets=!1!==t.unorderedSets,n.unorderedObjects=!1!==t.unorderedObjects,n.replacer=t.replacer||void 0,n.excludeKeys=t.excludeKeys||void 0,void 0===e)throw new Error("Object argument required.");for(var r=0;r<l.length;++r)l[r].toLowerCase()===n.algorithm.toLowerCase()&&(n.algorithm=l[r]);if(-1===l.indexOf(n.algorithm))throw new Error('Algorithm "'+n.algorithm+'"  not supported. supported values: '+l.join(", "));if(-1===d.indexOf(n.encoding)&&"passthrough"!==n.algorithm)throw new Error('Encoding "'+n.encoding+'"  not supported. supported values: '+d.join(", "));return n}function p(e){if("function"!=typeof e)return!1;return null!=/^function\s+\w*\s*\(\s*\)\s*{\s+\[native code\]\s+}$/i.exec(Function.prototype.toString.call(e))}function g(u,t,a){a=a||[];function f(e){return t.update?t.update(e,"utf8"):t.write(e,"utf8")}return{dispatch:function(e){u.replacer&&(e=u.replacer(e));var t=typeof e;return null===e&&(t="null"),this["_"+t](e)},_object:function(t){var e=Object.prototype.toString.call(t),n=/\[object (.*)\]/i.exec(e);n=(n=n?n[1]:"unknown:["+e+"]").toLowerCase();var r;if(0<=(r=a.indexOf(t)))return this.dispatch("[CIRCULAR:"+r+"]");if(a.push(t),void 0!==s&&s.isBuffer&&s.isBuffer(t))return f("buffer:"),f(t);if("object"===n||"function"===n||"asyncfunction"===n){var o=Object.keys(t);u.unorderedObjects&&(o=o.sort()),!1===u.respectType||p(t)||o.splice(0,0,"prototype","__proto__","constructor"),u.excludeKeys&&(o=o.filter(function(e){return!u.excludeKeys(e)})),f("object:"+o.length+":");var i=this;return o.forEach(function(e){i.dispatch(e),f(":"),u.excludeValues||i.dispatch(t[e]),f(",")})}if(!this["_"+n]){if(u.ignoreUnknown)return f("["+n+"]");throw new Error('Unknown object type "'+n+'"')}this["_"+n](t)},_array:function(e,t){t=void 0!==t?t:!1!==u.unorderedArrays;var n=this;if(f("array:"+e.length+":"),!t||e.length<=1)return e.forEach(function(e){return n.dispatch(e)});var r=[],o=e.map(function(e){var t=new y,n=a.slice();return g(u,t,n).dispatch(e),r=r.concat(n.slice(a.length)),t.read().toString()});return a=a.concat(r),o.sort(),this._array(o,!1)},_date:function(e){return f("date:"+e.toJSON())},_symbol:function(e){return f("symbol:"+e.toString())},_error:function(e){return f("error:"+e.toString())},_boolean:function(e){return f("bool:"+e.toString())},_string:function(e){f("string:"+e.length+":"),f(e.toString())},_function:function(e){f("fn:"),p(e)?this.dispatch("[native]"):this.dispatch(e.toString()),!1!==u.respectFunctionNames&&this.dispatch("function-name:"+String(e.name)),u.respectFunctionProperties&&this._object(e)},_number:function(e){return f("number:"+e.toString())},_xml:function(e){return f("xml:"+e.toString())},_null:function(){return f("Null")},_undefined:function(){return f("Undefined")},_regexp:function(e){return f("regex:"+e.toString())},_uint8array:function(e){return f("uint8array:"),this.dispatch(Array.prototype.slice.call(e))},_uint8clampedarray:function(e){return f("uint8clampedarray:"),this.dispatch(Array.prototype.slice.call(e))},_int8array:function(e){return f("uint8array:"),this.dispatch(Array.prototype.slice.call(e))},_uint16array:function(e){return f("uint16array:"),this.dispatch(Array.prototype.slice.call(e))},_int16array:function(e){return f("uint16array:"),this.dispatch(Array.prototype.slice.call(e))},_uint32array:function(e){return f("uint32array:"),this.dispatch(Array.prototype.slice.call(e))},_int32array:function(e){return f("uint32array:"),this.dispatch(Array.prototype.slice.call(e))},_float32array:function(e){return f("float32array:"),this.dispatch(Array.prototype.slice.call(e))},_float64array:function(e){return f("float64array:"),this.dispatch(Array.prototype.slice.call(e))},_arraybuffer:function(e){return f("arraybuffer:"),this.dispatch(new Uint8Array(e))},_url:function(e){return f("url:"+e.toString())},_map:function(e){f("map:");var t=Array.from(e);return this._array(t,!1!==u.unorderedSets)},_set:function(e){f("set:");var t=Array.from(e);return this._array(t,!1!==u.unorderedSets)},_blob:function(){if(u.ignoreUnknown)return f("[blob]");throw Error('Hashing Blob objects is currently not supported\n(see https://github.com/puleos/object-hash/issues/26)\nUse "options.replacer" or "options.ignoreUnknown"\n')},_domwindow:function(){return f("domwindow")},_process:function(){return f("process")},_timer:function(){return f("timer")},_pipe:function(){return f("pipe")},_tcp:function(){return f("tcp")},_udp:function(){return f("udp")},_tty:function(){return f("tty")},_statwatcher:function(){return f("statwatcher")},_securecontext:function(){return f("securecontext")},_connection:function(){return f("connection")},_zlib:function(){return f("zlib")},_context:function(){return f("context")},_nodescript:function(){return f("nodescript")},_httpparser:function(){return f("httpparser")},_dataview:function(){return f("dataview")},_signal:function(){return f("signal")},_fsevent:function(){return f("fsevent")},_tlswrap:function(){return f("tlswrap")}}}function y(){return{buf:"",write:function(e){this.buf+=e},end:function(e){this.buf+=e},read:function(){return this.buf}}}m.writeToStream=function(e,t,n){return void 0===n&&(n=t,t={}),g(t=h(e,t),n).dispatch(e)}}).call(this,w("lYpoI2"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},w("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_274613e1.js","/")},{buffer:3,crypto:5,lYpoI2:10}],2:[function(e,t,s){(function(e,t,n,r,o,i,u,a,f){!function(e){"use strict";var s="undefined"!=typeof Uint8Array?Uint8Array:Array,n="+".charCodeAt(0),r="/".charCodeAt(0),o="0".charCodeAt(0),i="a".charCodeAt(0),u="A".charCodeAt(0),a="-".charCodeAt(0),f="_".charCodeAt(0);function c(e){var t=e.charCodeAt(0);return t===n||t===a?62:t===r||t===f?63:t<o?-1:t<o+10?t-o+26+26:t<u+26?t-u:t<i+26?t-i+26:void 0}e.toByteArray=function(e){var t,n,r,o,i;if(0<e.length%4)throw new Error("Invalid string. Length must be a multiple of 4");var u=e.length;o="="===e.charAt(u-2)?2:"="===e.charAt(u-1)?1:0,i=new s(3*e.length/4-o),n=0<o?e.length-4:e.length;var a=0;function f(e){i[a++]=e}for(t=0;t<n;t+=4,3)f((16711680&(r=c(e.charAt(t))<<18|c(e.charAt(t+1))<<12|c(e.charAt(t+2))<<6|c(e.charAt(t+3))))>>16),f((65280&r)>>8),f(255&r);return 2==o?f(255&(r=c(e.charAt(t))<<2|c(e.charAt(t+1))>>4)):1==o&&(f((r=c(e.charAt(t))<<10|c(e.charAt(t+1))<<4|c(e.charAt(t+2))>>2)>>8&255),f(255&r)),i},e.fromByteArray=function(e){var t,n,r,o,i=e.length%3,u="";function a(e){return"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e)}for(t=0,r=e.length-i;t<r;t+=3)n=(e[t]<<16)+(e[t+1]<<8)+e[t+2],u+=a((o=n)>>18&63)+a(o>>12&63)+a(o>>6&63)+a(63&o);switch(i){case 1:u+=a((n=e[e.length-1])>>2),u+=a(n<<4&63),u+="==";break;case 2:u+=a((n=(e[e.length-2]<<8)+e[e.length-1])>>10),u+=a(n>>4&63),u+=a(n<<2&63),u+="="}return u}}(void 0===s?this.base64js={}:s)}).call(this,e("lYpoI2"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},e("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/gulp-browserify/node_modules/base64-js/lib/b64.js","/node_modules/gulp-browserify/node_modules/base64-js/lib")},{buffer:3,lYpoI2:10}],3:[function(D,e,O){(function(e,t,f,n,r,o,i,u,a){var s=D("base64-js"),c=D("ieee754");function f(e,t,n){if(!(this instanceof f))return new f(e,t,n);var r,o,i,u=typeof e;if("base64"===t&&"string"==u)for(e=function(e){return e.trim?e.trim():e.replace(/^\s+|\s+$/g,"")}(e);e.length%4!=0;)e+="=";if("number"==u)r=U(e);else if("string"==u)r=f.byteLength(e,t);else{if("object"!=u)throw new Error("First argument needs to be a number, array or string.");r=U(e.length)}if(f._useTypedArrays?o=f._augment(new Uint8Array(r)):((o=this).length=r,o._isBuffer=!0),f._useTypedArrays&&"number"==typeof e.byteLength)o._set(e);else if(function(e){return x(e)||f.isBuffer(e)||e&&"object"==typeof e&&"number"==typeof e.length}(e))for(i=0;i<r;i++)f.isBuffer(e)?o[i]=e.readUInt8(i):o[i]=e[i];else if("string"==u)o.write(e,0,t);else if("number"==u&&!f._useTypedArrays&&!n)for(i=0;i<r;i++)o[i]=0;return o}function l(e,t,n,r){return f._charsWritten=k(function(e){for(var t=[],n=0;n<e.length;n++)t.push(255&e.charCodeAt(n));return t}(t),e,n,r)}function d(e,t,n){var r="";n=Math.min(e.length,n);for(var o=t;o<n;o++)r+=String.fromCharCode(e[o]);return r}function h(e,t,n,r){r||(F("boolean"==typeof n,"missing or invalid endian"),F(null!=t,"missing offset"),F(t+1<e.length,"Trying to read beyond buffer length"));var o,i=e.length;if(!(i<=t))return n?(o=e[t],t+1<i&&(o|=e[t+1]<<8)):(o=e[t]<<8,t+1<i&&(o|=e[t+1])),o}function p(e,t,n,r){r||(F("boolean"==typeof n,"missing or invalid endian"),F(null!=t,"missing offset"),F(t+3<e.length,"Trying to read beyond buffer length"));var o,i=e.length;if(!(i<=t))return n?(t+2<i&&(o=e[t+2]<<16),t+1<i&&(o|=e[t+1]<<8),o|=e[t],t+3<i&&(o+=e[t+3]<<24>>>0)):(t+1<i&&(o=e[t+1]<<16),t+2<i&&(o|=e[t+2]<<8),t+3<i&&(o|=e[t+3]),o+=e[t]<<24>>>0),o}function g(e,t,n,r){if(r||(F("boolean"==typeof n,"missing or invalid endian"),F(null!=t,"missing offset"),F(t+1<e.length,"Trying to read beyond buffer length")),!(e.length<=t)){var o=h(e,t,n,!0);return 32768&o?-1*(65535-o+1):o}}function y(e,t,n,r){if(r||(F("boolean"==typeof n,"missing or invalid endian"),F(null!=t,"missing offset"),F(t+3<e.length,"Trying to read beyond buffer length")),!(e.length<=t)){var o=p(e,t,n,!0);return 2147483648&o?-1*(4294967295-o+1):o}}function w(e,t,n,r){return r||(F("boolean"==typeof n,"missing or invalid endian"),F(t+3<e.length,"Trying to read beyond buffer length")),c.read(e,t,n,23,4)}function b(e,t,n,r){return r||(F("boolean"==typeof n,"missing or invalid endian"),F(t+7<e.length,"Trying to read beyond buffer length")),c.read(e,t,n,52,8)}function m(e,t,n,r,o){o||(F(null!=t,"missing value"),F("boolean"==typeof r,"missing or invalid endian"),F(null!=n,"missing offset"),F(n+1<e.length,"trying to write beyond buffer length"),M(t,65535));var i=e.length;if(!(i<=n))for(var u=0,a=Math.min(i-n,2);u<a;u++)e[n+u]=(t&255<<8*(r?u:1-u))>>>8*(r?u:1-u)}function v(e,t,n,r,o){o||(F(null!=t,"missing value"),F("boolean"==typeof r,"missing or invalid endian"),F(null!=n,"missing offset"),F(n+3<e.length,"trying to write beyond buffer length"),M(t,4294967295));var i=e.length;if(!(i<=n))for(var u=0,a=Math.min(i-n,4);u<a;u++)e[n+u]=t>>>8*(r?u:3-u)&255}function _(e,t,n,r,o){o||(F(null!=t,"missing value"),F("boolean"==typeof r,"missing or invalid endian"),F(null!=n,"missing offset"),F(n+1<e.length,"Trying to write beyond buffer length"),N(t,32767,-32768)),e.length<=n||m(e,0<=t?t:65535+t+1,n,r,o)}function E(e,t,n,r,o){o||(F(null!=t,"missing value"),F("boolean"==typeof r,"missing or invalid endian"),F(null!=n,"missing offset"),F(n+3<e.length,"Trying to write beyond buffer length"),N(t,2147483647,-2147483648)),e.length<=n||v(e,0<=t?t:4294967295+t+1,n,r,o)}function I(e,t,n,r,o){o||(F(null!=t,"missing value"),F("boolean"==typeof r,"missing or invalid endian"),F(null!=n,"missing offset"),F(n+3<e.length,"Trying to write beyond buffer length"),Y(t,34028234663852886e22,-34028234663852886e22)),e.length<=n||c.write(e,t,n,r,23,4)}function A(e,t,n,r,o){o||(F(null!=t,"missing value"),F("boolean"==typeof r,"missing or invalid endian"),F(null!=n,"missing offset"),F(n+7<e.length,"Trying to write beyond buffer length"),Y(t,17976931348623157e292,-17976931348623157e292)),e.length<=n||c.write(e,t,n,r,52,8)}O.Buffer=f,O.SlowBuffer=f,O.INSPECT_MAX_BYTES=50,f.poolSize=8192,f._useTypedArrays=function(){try{var e=new ArrayBuffer(0),t=new Uint8Array(e);return t.foo=function(){return 42},42===t.foo()&&"function"==typeof t.subarray}catch(e){return!1}}(),f.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"raw":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},f.isBuffer=function(e){return!(null==e||!e._isBuffer)},f.byteLength=function(e,t){var n;switch(e+="",t||"utf8"){case"hex":n=e.length/2;break;case"utf8":case"utf-8":n=j(e).length;break;case"ascii":case"binary":case"raw":n=e.length;break;case"base64":n=C(e).length;break;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":n=2*e.length;break;default:throw new Error("Unknown encoding")}return n},f.concat=function(e,t){if(F(x(e),"Usage: Buffer.concat(list, [totalLength])\nlist should be an Array."),0===e.length)return new f(0);if(1===e.length)return e[0];var n;if("number"!=typeof t)for(n=t=0;n<e.length;n++)t+=e[n].length;var r=new f(t),o=0;for(n=0;n<e.length;n++){var i=e[n];i.copy(r,o),o+=i.length}return r},f.prototype.write=function(e,t,n,r){if(isFinite(t))isFinite(n)||(r=n,n=void 0);else{var o=r;r=t,t=n,n=o}t=Number(t)||0;var i,u=this.length-t;switch(n?u<(n=Number(n))&&(n=u):n=u,r=String(r||"utf8").toLowerCase()){case"hex":i=function(e,t,n,r){n=Number(n)||0;var o=e.length-n;r?o<(r=Number(r))&&(r=o):r=o;var i=t.length;F(i%2==0,"Invalid hex string"),i/2<r&&(r=i/2);for(var u=0;u<r;u++){var a=parseInt(t.substr(2*u,2),16);F(!isNaN(a),"Invalid hex string"),e[n+u]=a}return f._charsWritten=2*u,u}(this,e,t,n);break;case"utf8":case"utf-8":i=function(e,t,n,r){return f._charsWritten=k(j(t),e,n,r)}(this,e,t,n);break;case"ascii":i=l(this,e,t,n);break;case"binary":i=function(e,t,n,r){return l(e,t,n,r)}(this,e,t,n);break;case"base64":i=function(e,t,n,r){return f._charsWritten=k(C(t),e,n,r)}(this,e,t,n);break;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":i=function(e,t,n,r){return f._charsWritten=k(function(e){for(var t,n,r,o=[],i=0;i<e.length;i++)t=e.charCodeAt(i),n=t>>8,r=t%256,o.push(r),o.push(n);return o}(t),e,n,r)}(this,e,t,n);break;default:throw new Error("Unknown encoding")}return i},f.prototype.toString=function(e,t,n){var r,o=this;if(e=String(e||"utf8").toLowerCase(),t=Number(t)||0,(n=void 0!==n?Number(n):n=o.length)===t)return"";switch(e){case"hex":r=function(e,t,n){var r=e.length;(!t||t<0)&&(t=0);(!n||n<0||r<n)&&(n=r);for(var o="",i=t;i<n;i++)o+=S(e[i]);return o}(o,t,n);break;case"utf8":case"utf-8":r=function(e,t,n){var r="",o="";n=Math.min(e.length,n);for(var i=t;i<n;i++)e[i]<=127?(r+=T(o)+String.fromCharCode(e[i]),o=""):o+="%"+e[i].toString(16);return r+T(o)}(o,t,n);break;case"ascii":r=d(o,t,n);break;case"binary":r=function(e,t,n){return d(e,t,n)}(o,t,n);break;case"base64":r=function(e,t,n){return 0===t&&n===e.length?s.fromByteArray(e):s.fromByteArray(e.slice(t,n))}(o,t,n);break;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":r=function(e,t,n){for(var r=e.slice(t,n),o="",i=0;i<r.length;i+=2)o+=String.fromCharCode(r[i]+256*r[i+1]);return o}(o,t,n);break;default:throw new Error("Unknown encoding")}return r},f.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}},f.prototype.copy=function(e,t,n,r){if(n=n||0,r||0===r||(r=this.length),t=t||0,r!==n&&0!==e.length&&0!==this.length){F(n<=r,"sourceEnd < sourceStart"),F(0<=t&&t<e.length,"targetStart out of bounds"),F(0<=n&&n<this.length,"sourceStart out of bounds"),F(0<=r&&r<=this.length,"sourceEnd out of bounds"),r>this.length&&(r=this.length),e.length-t<r-n&&(r=e.length-t+n);var o=r-n;if(o<100||!f._useTypedArrays)for(var i=0;i<o;i++)e[i+t]=this[i+n];else e._set(this.subarray(n,n+o),t)}},f.prototype.slice=function(e,t){var n=this.length;if(e=L(e,n,0),t=L(t,n,n),f._useTypedArrays)return f._augment(this.subarray(e,t));for(var r=t-e,o=new f(r,void 0,!0),i=0;i<r;i++)o[i]=this[i+e];return o},f.prototype.get=function(e){return console.log(".get() is deprecated. Access using array indexes instead."),this.readUInt8(e)},f.prototype.set=function(e,t){return console.log(".set() is deprecated. Access using array indexes instead."),this.writeUInt8(e,t)},f.prototype.readUInt8=function(e,t){if(t||(F(null!=e,"missing offset"),F(e<this.length,"Trying to read beyond buffer length")),!(e>=this.length))return this[e]},f.prototype.readUInt16LE=function(e,t){return h(this,e,!0,t)},f.prototype.readUInt16BE=function(e,t){return h(this,e,!1,t)},f.prototype.readUInt32LE=function(e,t){return p(this,e,!0,t)},f.prototype.readUInt32BE=function(e,t){return p(this,e,!1,t)},f.prototype.readInt8=function(e,t){if(t||(F(null!=e,"missing offset"),F(e<this.length,"Trying to read beyond buffer length")),!(e>=this.length))return 128&this[e]?-1*(255-this[e]+1):this[e]},f.prototype.readInt16LE=function(e,t){return g(this,e,!0,t)},f.prototype.readInt16BE=function(e,t){return g(this,e,!1,t)},f.prototype.readInt32LE=function(e,t){return y(this,e,!0,t)},f.prototype.readInt32BE=function(e,t){return y(this,e,!1,t)},f.prototype.readFloatLE=function(e,t){return w(this,e,!0,t)},f.prototype.readFloatBE=function(e,t){return w(this,e,!1,t)},f.prototype.readDoubleLE=function(e,t){return b(this,e,!0,t)},f.prototype.readDoubleBE=function(e,t){return b(this,e,!1,t)},f.prototype.writeUInt8=function(e,t,n){n||(F(null!=e,"missing value"),F(null!=t,"missing offset"),F(t<this.length,"trying to write beyond buffer length"),M(e,255)),t>=this.length||(this[t]=e)},f.prototype.writeUInt16LE=function(e,t,n){m(this,e,t,!0,n)},f.prototype.writeUInt16BE=function(e,t,n){m(this,e,t,!1,n)},f.prototype.writeUInt32LE=function(e,t,n){v(this,e,t,!0,n)},f.prototype.writeUInt32BE=function(e,t,n){v(this,e,t,!1,n)},f.prototype.writeInt8=function(e,t,n){n||(F(null!=e,"missing value"),F(null!=t,"missing offset"),F(t<this.length,"Trying to write beyond buffer length"),N(e,127,-128)),t>=this.length||(0<=e?this.writeUInt8(e,t,n):this.writeUInt8(255+e+1,t,n))},f.prototype.writeInt16LE=function(e,t,n){_(this,e,t,!0,n)},f.prototype.writeInt16BE=function(e,t,n){_(this,e,t,!1,n)},f.prototype.writeInt32LE=function(e,t,n){E(this,e,t,!0,n)},f.prototype.writeInt32BE=function(e,t,n){E(this,e,t,!1,n)},f.prototype.writeFloatLE=function(e,t,n){I(this,e,t,!0,n)},f.prototype.writeFloatBE=function(e,t,n){I(this,e,t,!1,n)},f.prototype.writeDoubleLE=function(e,t,n){A(this,e,t,!0,n)},f.prototype.writeDoubleBE=function(e,t,n){A(this,e,t,!1,n)},f.prototype.fill=function(e,t,n){if(e=e||0,t=t||0,n=n||this.length,"string"==typeof e&&(e=e.charCodeAt(0)),F("number"==typeof e&&!isNaN(e),"value is not a number"),F(t<=n,"end < start"),n!==t&&0!==this.length){F(0<=t&&t<this.length,"start out of bounds"),F(0<=n&&n<=this.length,"end out of bounds");for(var r=t;r<n;r++)this[r]=e}},f.prototype.inspect=function(){for(var e=[],t=this.length,n=0;n<t;n++)if(e[n]=S(this[n]),n===O.INSPECT_MAX_BYTES){e[n+1]="...";break}return"<Buffer "+e.join(" ")+">"},f.prototype.toArrayBuffer=function(){if("undefined"==typeof Uint8Array)throw new Error("Buffer.toArrayBuffer not supported in this browser");if(f._useTypedArrays)return new f(this).buffer;for(var e=new Uint8Array(this.length),t=0,n=e.length;t<n;t+=1)e[t]=this[t];return e.buffer};var B=f.prototype;function L(e,t,n){return"number"!=typeof e?n:t<=(e=~~e)?t:0<=e?e:0<=(e+=t)?e:0}function U(e){return(e=~~Math.ceil(+e))<0?0:e}function x(e){return(Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)})(e)}function S(e){return e<16?"0"+e.toString(16):e.toString(16)}function j(e){for(var t=[],n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<=127)t.push(e.charCodeAt(n));else{var o=n;55296<=r&&r<=57343&&n++;for(var i=encodeURIComponent(e.slice(o,n+1)).substr(1).split("%"),u=0;u<i.length;u++)t.push(parseInt(i[u],16))}}return t}function C(e){return s.toByteArray(e)}function k(e,t,n,r){for(var o=0;o<r&&!(o+n>=t.length||o>=e.length);o++)t[o+n]=e[o];return o}function T(e){try{return decodeURIComponent(e)}catch(e){return String.fromCharCode(65533)}}function M(e,t){F("number"==typeof e,"cannot write a non-number as a number"),F(0<=e,"specified a negative value for writing an unsigned value"),F(e<=t,"value is larger than maximum value for type"),F(Math.floor(e)===e,"value has a fractional component")}function N(e,t,n){F("number"==typeof e,"cannot write a non-number as a number"),F(e<=t,"value larger than maximum allowed value"),F(n<=e,"value smaller than minimum allowed value"),F(Math.floor(e)===e,"value has a fractional component")}function Y(e,t,n){F("number"==typeof e,"cannot write a non-number as a number"),F(e<=t,"value larger than maximum allowed value"),F(n<=e,"value smaller than minimum allowed value")}function F(e,t){if(!e)throw new Error(t||"Failed assertion")}f._augment=function(e){return e._isBuffer=!0,e._get=e.get,e._set=e.set,e.get=B.get,e.set=B.set,e.write=B.write,e.toString=B.toString,e.toLocaleString=B.toString,e.toJSON=B.toJSON,e.copy=B.copy,e.slice=B.slice,e.readUInt8=B.readUInt8,e.readUInt16LE=B.readUInt16LE,e.readUInt16BE=B.readUInt16BE,e.readUInt32LE=B.readUInt32LE,e.readUInt32BE=B.readUInt32BE,e.readInt8=B.readInt8,e.readInt16LE=B.readInt16LE,e.readInt16BE=B.readInt16BE,e.readInt32LE=B.readInt32LE,e.readInt32BE=B.readInt32BE,e.readFloatLE=B.readFloatLE,e.readFloatBE=B.readFloatBE,e.readDoubleLE=B.readDoubleLE,e.readDoubleBE=B.readDoubleBE,e.writeUInt8=B.writeUInt8,e.writeUInt16LE=B.writeUInt16LE,e.writeUInt16BE=B.writeUInt16BE,e.writeUInt32LE=B.writeUInt32LE,e.writeUInt32BE=B.writeUInt32BE,e.writeInt8=B.writeInt8,e.writeInt16LE=B.writeInt16LE,e.writeInt16BE=B.writeInt16BE,e.writeInt32LE=B.writeInt32LE,e.writeInt32BE=B.writeInt32BE,e.writeFloatLE=B.writeFloatLE,e.writeFloatBE=B.writeFloatBE,e.writeDoubleLE=B.writeDoubleLE,e.writeDoubleBE=B.writeDoubleBE,e.fill=B.fill,e.inspect=B.inspect,e.toArrayBuffer=B.toArrayBuffer,e}}).call(this,D("lYpoI2"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},D("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/gulp-browserify/node_modules/buffer/index.js","/node_modules/gulp-browserify/node_modules/buffer")},{"base64-js":2,buffer:3,ieee754:11,lYpoI2:10}],4:[function(l,d,e){(function(e,t,u,n,r,o,i,a,f){u=l("buffer").Buffer;var s=4,c=new u(s);c.fill(0);d.exports={hash:function(e,t,n,r){return u.isBuffer(e)||(e=new u(e)),function(e,t,n){for(var r=new u(t),o=n?r.writeInt32BE:r.writeInt32LE,i=0;i<e.length;i++)o.call(r,e[i],4*i,!0);return r}(t(function(e,t){if(e.length%s!=0){var n=e.length+(s-e.length%s);e=u.concat([e,c],n)}for(var r=[],o=t?e.readInt32BE:e.readInt32LE,i=0;i<e.length;i+=s)r.push(o.call(e,i));return r}(e,r),8*e.length),n,r)}}}).call(this,l("lYpoI2"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},l("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/gulp-browserify/node_modules/crypto-browserify/helpers.js","/node_modules/gulp-browserify/node_modules/crypto-browserify")},{buffer:3,lYpoI2:10}],5:[function(w,e,b){(function(e,t,a,n,r,o,i,u,f){a=w("buffer").Buffer;var s=w("./sha"),c=w("./sha256"),l=w("./rng"),d={sha1:s,sha256:c,md5:w("./md5")},h=64,p=new a(h);function g(e,r){var o=d[e=e||"sha1"],i=[];return o||y("algorithm:",e,"is not yet supported"),{update:function(e){return a.isBuffer(e)||(e=new a(e)),i.push(e),e.length,this},digest:function(e){var t=a.concat(i),n=r?function(e,t,n){a.isBuffer(t)||(t=new a(t)),a.isBuffer(n)||(n=new a(n)),t.length>h?t=e(t):t.length<h&&(t=a.concat([t,p],h));for(var r=new a(h),o=new a(h),i=0;i<h;i++)r[i]=54^t[i],o[i]=92^t[i];var u=e(a.concat([r,n]));return e(a.concat([o,u]))}(o,r,t):o(t);return i=null,e?n.toString(e):n}}}function y(){var e=[].slice.call(arguments).join(" ");throw new Error([e,"we accept pull requests","http://github.com/dominictarr/crypto-browserify"].join("\n"))}p.fill(0),b.createHash=function(e){return g(e)},b.createHmac=function(e,t){return g(e,t)},b.randomBytes=function(e,t){if(!t||!t.call)return new a(l(e));try{t.call(this,void 0,new a(l(e)))}catch(e){t(e)}},function(e,t){for(var n in e)t(e[n],n)}(["createCredentials","createCipher","createCipheriv","createDecipher","createDecipheriv","createSign","createVerify","createDiffieHellman","pbkdf2"],function(e){b[e]=function(){y("sorry,",e,"is not implemented yet")}})}).call(this,w("lYpoI2"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},w("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/gulp-browserify/node_modules/crypto-browserify/index.js","/node_modules/gulp-browserify/node_modules/crypto-browserify")},{"./md5":6,"./rng":7,"./sha":8,"./sha256":9,buffer:3,lYpoI2:10}],6:[function(w,b,e){(function(e,t,n,r,o,i,u,a,f){var s=w("./helpers");function c(e,t){e[t>>5]|=128<<t%32,e[14+(t+64>>>9<<4)]=t;for(var n=1732584193,r=-271733879,o=-1732584194,i=271733878,u=0;u<e.length;u+=16){var a=n,f=r,s=o,c=i;r=g(r=g(r=g(r=g(r=p(r=p(r=p(r=p(r=h(r=h(r=h(r=h(r=d(r=d(r=d(r=d(r,o=d(o,i=d(i,n=d(n,r,o,i,e[u+0],7,-680876936),r,o,e[u+1],12,-389564586),n,r,e[u+2],17,606105819),i,n,e[u+3],22,-1044525330),o=d(o,i=d(i,n=d(n,r,o,i,e[u+4],7,-176418897),r,o,e[u+5],12,1200080426),n,r,e[u+6],17,-1473231341),i,n,e[u+7],22,-45705983),o=d(o,i=d(i,n=d(n,r,o,i,e[u+8],7,1770035416),r,o,e[u+9],12,-1958414417),n,r,e[u+10],17,-42063),i,n,e[u+11],22,-1990404162),o=d(o,i=d(i,n=d(n,r,o,i,e[u+12],7,1804603682),r,o,e[u+13],12,-40341101),n,r,e[u+14],17,-1502002290),i,n,e[u+15],22,1236535329),o=h(o,i=h(i,n=h(n,r,o,i,e[u+1],5,-165796510),r,o,e[u+6],9,-1069501632),n,r,e[u+11],14,643717713),i,n,e[u+0],20,-373897302),o=h(o,i=h(i,n=h(n,r,o,i,e[u+5],5,-701558691),r,o,e[u+10],9,38016083),n,r,e[u+15],14,-660478335),i,n,e[u+4],20,-405537848),o=h(o,i=h(i,n=h(n,r,o,i,e[u+9],5,568446438),r,o,e[u+14],9,-1019803690),n,r,e[u+3],14,-187363961),i,n,e[u+8],20,1163531501),o=h(o,i=h(i,n=h(n,r,o,i,e[u+13],5,-1444681467),r,o,e[u+2],9,-51403784),n,r,e[u+7],14,1735328473),i,n,e[u+12],20,-1926607734),o=p(o,i=p(i,n=p(n,r,o,i,e[u+5],4,-378558),r,o,e[u+8],11,-2022574463),n,r,e[u+11],16,1839030562),i,n,e[u+14],23,-35309556),o=p(o,i=p(i,n=p(n,r,o,i,e[u+1],4,-1530992060),r,o,e[u+4],11,1272893353),n,r,e[u+7],16,-155497632),i,n,e[u+10],23,-1094730640),o=p(o,i=p(i,n=p(n,r,o,i,e[u+13],4,681279174),r,o,e[u+0],11,-358537222),n,r,e[u+3],16,-722521979),i,n,e[u+6],23,76029189),o=p(o,i=p(i,n=p(n,r,o,i,e[u+9],4,-640364487),r,o,e[u+12],11,-421815835),n,r,e[u+15],16,530742520),i,n,e[u+2],23,-995338651),o=g(o,i=g(i,n=g(n,r,o,i,e[u+0],6,-198630844),r,o,e[u+7],10,1126891415),n,r,e[u+14],15,-1416354905),i,n,e[u+5],21,-57434055),o=g(o,i=g(i,n=g(n,r,o,i,e[u+12],6,1700485571),r,o,e[u+3],10,-1894986606),n,r,e[u+10],15,-1051523),i,n,e[u+1],21,-2054922799),o=g(o,i=g(i,n=g(n,r,o,i,e[u+8],6,1873313359),r,o,e[u+15],10,-30611744),n,r,e[u+6],15,-1560198380),i,n,e[u+13],21,1309151649),o=g(o,i=g(i,n=g(n,r,o,i,e[u+4],6,-145523070),r,o,e[u+11],10,-1120210379),n,r,e[u+2],15,718787259),i,n,e[u+9],21,-343485551),n=y(n,a),r=y(r,f),o=y(o,s),i=y(i,c)}return Array(n,r,o,i)}function l(e,t,n,r,o,i){return y(function(e,t){return e<<t|e>>>32-t}(y(y(t,e),y(r,i)),o),n)}function d(e,t,n,r,o,i,u){return l(t&n|~t&r,e,t,o,i,u)}function h(e,t,n,r,o,i,u){return l(t&r|n&~r,e,t,o,i,u)}function p(e,t,n,r,o,i,u){return l(t^n^r,e,t,o,i,u)}function g(e,t,n,r,o,i,u){return l(n^(t|~r),e,t,o,i,u)}function y(e,t){var n=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(n>>16)<<16|65535&n}b.exports=function(e){return s.hash(e,c,16)}}).call(this,w("lYpoI2"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},w("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/gulp-browserify/node_modules/crypto-browserify/md5.js","/node_modules/gulp-browserify/node_modules/crypto-browserify")},{"./helpers":4,buffer:3,lYpoI2:10}],7:[function(e,l,t){(function(e,t,n,r,o,i,u,a,f){var s,c;s=function(e){for(var t,n=new Array(e),r=0;r<e;r++)0==(3&r)&&(t=4294967296*Math.random()),n[r]=t>>>((3&r)<<3)&255;return n},l.exports=c||s}).call(this,e("lYpoI2"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},e("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/gulp-browserify/node_modules/crypto-browserify/rng.js","/node_modules/gulp-browserify/node_modules/crypto-browserify")},{buffer:3,lYpoI2:10}],8:[function(l,d,e){(function(e,t,n,r,o,i,u,a,f){var s=l("./helpers");function c(e,t){e[t>>5]|=128<<24-t%32,e[15+(t+64>>9<<4)]=t;for(var n,r=Array(80),o=1732584193,i=-271733879,u=-1732584194,a=271733878,f=-1009589776,s=0;s<e.length;s+=16){for(var c=o,l=i,d=u,h=a,p=f,g=0;g<80;g++){r[g]=g<16?e[s+g]:m(r[g-3]^r[g-8]^r[g-14]^r[g-16],1);var y=b(b(m(o,5),w(g,i,u,a)),b(b(f,r[g]),(n=g)<20?1518500249:n<40?1859775393:n<60?-1894007588:-899497514));f=a,a=u,u=m(i,30),i=o,o=y}o=b(o,c),i=b(i,l),u=b(u,d),a=b(a,h),f=b(f,p)}return Array(o,i,u,a,f)}function w(e,t,n,r){return e<20?t&n|~t&r:e<40?t^n^r:e<60?t&n|t&r|n&r:t^n^r}function b(e,t){var n=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(n>>16)<<16|65535&n}function m(e,t){return e<<t|e>>>32-t}d.exports=function(e){return s.hash(e,c,20,!0)}}).call(this,l("lYpoI2"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},l("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/gulp-browserify/node_modules/crypto-browserify/sha.js","/node_modules/gulp-browserify/node_modules/crypto-browserify")},{"./helpers":4,buffer:3,lYpoI2:10}],9:[function(l,d,e){(function(e,t,n,r,o,i,u,a,f){function B(e,t){var n=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(n>>16)<<16|65535&n}function L(e,t){return e>>>t|e<<32-t}function U(e,t){return e>>>t}function s(e,t){var n,r,o,i,u,a,f,s,c,l,d,h,p,g,y,w,b,m,v=new Array(1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298),_=new Array(1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225),E=new Array(64);e[t>>5]|=128<<24-t%32,e[15+(t+64>>9<<4)]=t;for(var I=0;I<e.length;I+=16){n=_[0],r=_[1],o=_[2],i=_[3],u=_[4],a=_[5],f=_[6],s=_[7];for(var A=0;A<64;A++)E[A]=A<16?e[A+I]:B(B(B((m=E[A-2],L(m,17)^L(m,19)^U(m,10)),E[A-7]),(b=E[A-15],L(b,7)^L(b,18)^U(b,3))),E[A-16]),c=B(B(B(B(s,L(w=u,6)^L(w,11)^L(w,25)),(y=u)&a^~y&f),v[A]),E[A]),l=B(L(g=n,2)^L(g,13)^L(g,22),(d=n)&(h=r)^d&(p=o)^h&p),s=f,f=a,a=u,u=B(i,c),i=o,o=r,r=n,n=B(c,l);_[0]=B(n,_[0]),_[1]=B(r,_[1]),_[2]=B(o,_[2]),_[3]=B(i,_[3]),_[4]=B(u,_[4]),_[5]=B(a,_[5]),_[6]=B(f,_[6]),_[7]=B(s,_[7])}return _}var c=l("./helpers");d.exports=function(e){return c.hash(e,s,32,!0)}}).call(this,l("lYpoI2"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},l("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/gulp-browserify/node_modules/crypto-browserify/sha256.js","/node_modules/gulp-browserify/node_modules/crypto-browserify")},{"./helpers":4,buffer:3,lYpoI2:10}],10:[function(e,c,t){(function(e,t,n,r,o,i,u,a,f){function s(){}(e=c.exports={}).nextTick=function(){var e="undefined"!=typeof window&&window.setImmediate,t="undefined"!=typeof window&&window.postMessage&&window.addEventListener;if(e)return function(e){return window.setImmediate(e)};if(t){var n=[];return window.addEventListener("message",function(e){var t=e.source;t!==window&&null!==t||"process-tick"!==e.data||(e.stopPropagation(),0<n.length&&n.shift()())},!0),function(e){n.push(e),window.postMessage("process-tick","*")}}return function(e){setTimeout(e,0)}}(),e.title="browser",e.browser=!0,e.env={},e.argv=[],e.on=s,e.addListener=s,e.once=s,e.off=s,e.removeListener=s,e.removeAllListeners=s,e.emit=s,e.binding=function(e){throw new Error("process.binding is not supported")},e.cwd=function(){return"/"},e.chdir=function(e){throw new Error("process.chdir is not supported")}}).call(this,e("lYpoI2"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},e("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/gulp-browserify/node_modules/process/browser.js","/node_modules/gulp-browserify/node_modules/process")},{buffer:3,lYpoI2:10}],11:[function(e,t,s){(function(e,t,n,r,o,i,u,a,f){s.read=function(e,t,n,r,o){var i,u,a=8*o-r-1,f=(1<<a)-1,s=f>>1,c=-7,l=n?o-1:0,d=n?-1:1,h=e[t+l];for(l+=d,i=h&(1<<-c)-1,h>>=-c,c+=a;0<c;i=256*i+e[t+l],l+=d,c-=8);for(u=i&(1<<-c)-1,i>>=-c,c+=r;0<c;u=256*u+e[t+l],l+=d,c-=8);if(0===i)i=1-s;else{if(i===f)return u?NaN:1/0*(h?-1:1);u+=Math.pow(2,r),i-=s}return(h?-1:1)*u*Math.pow(2,i-r)},s.write=function(e,t,n,r,o,i){var u,a,f,s=8*i-o-1,c=(1<<s)-1,l=c>>1,d=23===o?Math.pow(2,-24)-Math.pow(2,-77):0,h=r?0:i-1,p=r?1:-1,g=t<0||0===t&&1/t<0?1:0;for(t=Math.abs(t),isNaN(t)||t===1/0?(a=isNaN(t)?1:0,u=c):(u=Math.floor(Math.log(t)/Math.LN2),t*(f=Math.pow(2,-u))<1&&(u--,f*=2),2<=(t+=1<=u+l?d/f:d*Math.pow(2,1-l))*f&&(u++,f/=2),c<=u+l?(a=0,u=c):1<=u+l?(a=(t*f-1)*Math.pow(2,o),u+=l):(a=t*Math.pow(2,l-1)*Math.pow(2,o),u=0));8<=o;e[n+h]=255&a,h+=p,a/=256,o-=8);for(u=u<<o|a,s+=o;0<s;e[n+h]=255&u,h+=p,u/=256,s-=8);e[n+h-p]|=128*g}}).call(this,e("lYpoI2"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},e("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/ieee754/index.js","/node_modules/ieee754")},{buffer:3,lYpoI2:10}]},{},[1])(1)});