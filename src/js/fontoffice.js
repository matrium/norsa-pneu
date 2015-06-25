/* jshint ignore:start */

/**
 * @param {?} input
 * @param {number} multiplier
 * @return {?}
 */
function str_repeat(input, multiplier) {
  /** @type {Array} */
  var output = [];
  for (;multiplier > 0;output[--multiplier] = input) {
  }
  return output.join("");
}
/**
 * @return {?}
 */
function sprintf() {
  var arg;
  var match;
  var pad;
  var pad_character;
  var pad_length;
  /** @type {number} */
  var current = 0;
  var _fmt = arguments[current++];
  /** @type {Array} */
  var tagNameArr = [];
  for (;_fmt;) {
    if (match = /^[^\x25]+/.exec(_fmt)) {
      tagNameArr.push(match[0]);
    } else {
      if (match = /^\x25{2}/.exec(_fmt)) {
        tagNameArr.push("%");
      } else {
        if (!(match = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt))) {
          throw "Huh ?!";
        }
        if (null == (arg = arguments[match[1] || current++]) || void 0 == arg) {
          throw "Too few arguments.";
        }
        if (/[^s]/.test(match[7]) && "number" != typeof arg) {
          throw "Expecting number but found " + typeof arg;
        }
        switch(match[7]) {
          case "b":
            arg = arg.toString(2);
            break;
          case "c":
            /** @type {string} */
            arg = String.fromCharCode(arg);
            break;
          case "d":
            /** @type {number} */
            arg = parseInt(arg);
            break;
          case "e":
            arg = match[6] ? arg.toExponential(match[6]) : arg.toExponential();
            break;
          case "f":
            /** @type {(number|string)} */
            arg = match[6] ? parseFloat(arg).toFixed(match[6]) : parseFloat(arg);
            break;
          case "o":
            arg = arg.toString(8);
            break;
          case "s":
            /** @type {string} */
            arg = (arg = String(arg)) && match[6] ? arg.substring(0, match[6]) : arg;
            break;
          case "u":
            /** @type {number} */
            arg = Math.abs(arg);
            break;
          case "x":
            arg = arg.toString(16);
            break;
          case "X":
            arg = arg.toString(16).toUpperCase();
        }
        arg = /[def]/.test(match[7]) && (match[2] && arg > 0) ? "+" + arg : arg;
        /** @type {string} */
        pad_character = match[3] ? "0" == match[3] ? "0" : match[3].charAt(1) : " ";
        /** @type {number} */
        pad_length = match[5] - String(arg).length;
        pad = match[5] ? str_repeat(pad_character, pad_length) : "";
        tagNameArr.push(match[4] ? arg + pad : pad + arg);
      }
    }
    _fmt = _fmt.substring(match[0].length);
  }
  return tagNameArr.join("");
}
/**
 * @param {Function} recurring
 * @param {Array} locations
 * @param {Object} opt_options
 * @return {undefined}
 */
function MarkerClusterer(recurring, locations, opt_options) {
  this.extend(MarkerClusterer, google.maps.OverlayView);
  /** @type {Function} */
  this.map_ = recurring;
  /** @type {Array} */
  this.markers_ = [];
  /** @type {Array} */
  this.clusters_ = [];
  /** @type {Array} */
  this.sizes = [53, 56, 66, 78, 90];
  /** @type {Array} */
  this.styles_ = [];
  /** @type {boolean} */
  this.ready_ = false;
  var options = opt_options || {};
  this.markerClass = options.styles[0]["markerClass"];
  this.shadowClass = options.styles[0]["shadowClass"];
  this.gridSize_ = options["gridSize"] || 60;
  this.maxZoom_ = options["maxZoom"] || null;
  this.styles_ = options["styles"] || [];
  this.imagePath_ = options["imagePath"] || this.MARKER_CLUSTER_IMAGE_PATH_;
  this.imageExtension_ = options["imageExtension"] || this.MARKER_CLUSTER_IMAGE_EXTENSION_;
  this.zoomOnClick_ = options["zoomOnClick"] || true;
  this.setupStyles_();
  this.setMap(recurring);
  this.prevZoom_ = this.map_.getZoom();
  var that = this;
  google.maps.event.addListener(this.map_, "zoom_changed", function() {
    var maxZoom = that.map_.mapTypes[that.map_.getMapTypeId()].maxZoom;
    var zoom = that.map_.getZoom();
    if (!(0 > zoom || zoom > maxZoom) && that.prevZoom_ != zoom) {
      that.prevZoom_ = that.map_.getZoom();
      that.resetViewport();
    }
  });
  google.maps.event.addListener(this.map_, "bounds_changed", function() {
    that.redraw();
  });
  if (locations) {
    if (locations.length) {
      this.addMarkers(locations, false);
    }
  }
}
/**
 * @param {?} markerClusterer
 * @return {undefined}
 */
function Cluster(markerClusterer) {
  this.markerClusterer_ = markerClusterer;
  this.map_ = markerClusterer.getMap();
  this.gridSize_ = markerClusterer.getGridSize();
  /** @type {null} */
  this.center_ = null;
  /** @type {Array} */
  this.markers_ = [];
  /** @type {null} */
  this.bounds_ = null;
  this.clusterIcon_ = new ClusterIcon(this, markerClusterer.getStyles(), markerClusterer.getGridSize());
}
/**
 * @param {?} cluster
 * @param {Array} styles
 * @param {number} opt_padding
 * @return {undefined}
 */
function ClusterIcon(cluster, styles, opt_padding) {
  cluster.getMarkerClusterer().extend(ClusterIcon, google.maps.OverlayView);
  /** @type {Array} */
  this.styles_ = styles;
  this.padding_ = opt_padding || 0;
  this.cluster_ = cluster;
  /** @type {null} */
  this.center_ = null;
  this.map_ = cluster.getMap();
  /** @type {null} */
  this.div_ = null;
  /** @type {null} */
  this.sums_ = null;
  /** @type {boolean} */
  this.visible_ = false;
  this.setMap(this.map_);
}
/**
 * @param {string} str
 * @return {?}
 */
function parseUri(str) {
  var o = parseUri.options;
  var matcher = o.parser[o.strictMode ? "strict" : "loose"].exec(str);
  var uri = {};
  /** @type {number} */
  var i = 14;
  for (;i--;) {
    uri[o.key[i]] = matcher[i] || "";
  }
  uri[o.q.name] = {};
  uri[o.key[12]].replace(o.q.parser, function(dataAndEvents, $1, $2) {
    if ($1) {
      uri[o.q.name][$1] = $2;
    }
  });
  return uri;
}
/**
 * @return {undefined}
 */
function initializePointsOfSaleJSON() {
  var $form = jQuery("select[class=redirects]");
  var targets = jQuery("#lf_listmap_canvas");
  lf.app.searchForm = new lf.SearchForm(jQuery("#lf_search")[0]);
  if ($form.length > 0 || targets.length > 0) {
    jQuery.getJSON("/points_of_sale.json").done(function($timeout) {
      app.front_office = $timeout;
      if ($form.length > 0) {
        lf.app.searchForm.populateSelectorFromData(app.front_office.points_of_sale);
      }
      if (targets.length > 0) {
        lf.app.listMap = new lf.ListMap(targets[0]);
        app.mapMarkers = {
          /**
           * @param {?} timeoutKey
           * @return {undefined}
           */
          locateOnMap : function(timeoutKey) {
            lf.app.listMap.showMarkerByIndex(timeoutKey);
          }
        };
      }
    });
  }
}
/**
 * @return {undefined}
 */
function initializeAppDependentObjects() {
  jQuery("#lf_product_search").each(function() {
    lf.app.productSearchForm = new lf.ProductSearchForm(this);
  });
  jQuery("#lf_accessmap_canvas").each(function() {
    var mm = lf.app.getApiModule();
    var $form = jQuery(this);
    lf.app.accessMap = new mm.Map(this, function(recurring) {
      lf.app.accessMapMarker = new mm.SingleMarker(posMarkerCoordinates);
      lf.app.accessMapMarker.setMap(recurring);
      recurring.setCenter(posMarkerCoordinates);
      recurring.setZoom(recurring.getPointOfSaleZoomLevel());
      recurring.redraw();
      $form.trigger("lf.mapReady", [recurring]);
    });
  });
}
/**
 * @return {undefined}
 */
function initializeFormObjects() {
  /** @type {Array} */
  lf.app.posForms = [];
  jQuery("#lf_contactform form, #lf_coordinatesrequest form, #lf_newsletter form, #lf_reservation_form form").each(function() {
    lf.app.posForms.push(new lf.AjaxSubmissionForm(this));
  });
}
/**
 * @param {Object} cmp
 * @return {undefined}
 */
function detectCountry(cmp) {
  var $select = cmp.find("form").find("#country");
  /** @type {(Array.<string>|null)} */
  var i = (new RegExp("[\\?&]country=([^&#]*)")).exec(window.location.href);
  if (i) {
    $select.find("option[value=" + i[1] + "]").attr("selected", true);
  } else {
    jQuery.getJSON("/geocode.json", function($rootScope) {
      $select.find("option[value=" + $rootScope.country_code + "]").attr("selected", true);
      if ("function" == typeof $select.selectmenu) {
        if ($select.is(":visible")) {
          $select.selectmenu("refresh");
        }
      }
    });
  }
}
/**
 * @return {undefined}
 */
var Base = function() {
};
/**
 * @param {?} opt_attributes
 * @param {?} replacementHash
 * @return {?}
 */
Base.extend = function(opt_attributes, replacementHash) {
  /** @type {function (?, Function): ?} */
  var extend = Base.prototype.extend;
  /** @type {boolean} */
  Base._prototyping = true;
  var proto = new this;
  extend.call(proto, opt_attributes);
  /**
   * @return {undefined}
   */
  proto.base = function() {
  };
  delete Base._prototyping;
  /** @type {function (): ?} */
  var constructor = proto.constructor;
  /** @type {function (): ?} */
  var klass = proto.constructor = function() {
    if (!Base._prototyping) {
      if (this._constructing || this.constructor == klass) {
        /** @type {boolean} */
        this._constructing = true;
        constructor.apply(this, arguments);
        delete this._constructing;
      } else {
        if (null != arguments[0]) {
          return(arguments[0].extend || extend).call(arguments[0], proto);
        }
      }
    }
  };
  klass.ancestor = this;
  klass.extend = this.extend;
  klass.forEach = this.forEach;
  klass.implement = this.implement;
  klass.prototype = proto;
  klass.toString = this.toString;
  /**
   * @param {string} object
   * @return {?}
   */
  klass.valueOf = function(object) {
    return "object" == object ? klass : constructor.valueOf();
  };
  extend.call(klass, replacementHash);
  if ("function" == typeof klass.init) {
    klass.init();
  }
  return klass;
};
Base.prototype = {
  /**
   * @param {?} opt_attributes
   * @param {Function} value
   * @return {?}
   */
  extend : function(opt_attributes, value) {
    if (arguments.length > 1) {
      var tmp = this[opt_attributes];
      if (tmp && ("function" == typeof value && ((!tmp.valueOf || tmp.valueOf() != value.valueOf()) && /\bbase\b/.test(value)))) {
        /** @type {*} */
        var matcherFunction = value.valueOf();
        /**
         * @return {?}
         */
        value = function() {
          var previous = this.base || Base.prototype.base;
          this.base = tmp;
          var props = matcherFunction.apply(this, arguments);
          this.base = previous;
          return props;
        };
        /**
         * @param {string} object
         * @return {?}
         */
        value.valueOf = function(object) {
          return "object" == object ? value : matcherFunction;
        };
        /** @type {function (this:Function): string} */
        value.toString = Base.toString;
      }
      /** @type {Function} */
      this[opt_attributes] = value;
    } else {
      if (opt_attributes) {
        /** @type {function (?, Function): ?} */
        var extend = Base.prototype.extend;
        if (!Base._prototyping) {
          if (!("function" == typeof this)) {
            extend = this.extend || extend;
          }
        }
        var proto = {
          toSource : null
        };
        /** @type {Array} */
        var hidden = ["constructor", "toString", "valueOf"];
        /** @type {number} */
        var i = Base._prototyping ? 0 : 1;
        for (;key = hidden[i++];) {
          if (opt_attributes[key] != proto[key]) {
            extend.call(this, key, opt_attributes[key]);
          }
        }
        var key;
        for (key in opt_attributes) {
          if (!proto[key]) {
            extend.call(this, key, opt_attributes[key]);
          }
        }
      }
    }
    return this;
  }
};
Base = Base.extend({
  /**
   * @return {undefined}
   */
  constructor : function() {
    this.extend(arguments[0]);
  }
}, {
  /** @type {function (new:Object, *=): ?} */
  ancestor : Object,
  version : "1.1",
  /**
   * @param {Object} obj
   * @param {Function} f
   * @param {?} opt_obj
   * @return {undefined}
   */
  forEach : function(obj, f, opt_obj) {
    var key;
    for (key in obj) {
      if (void 0 === this.prototype[key]) {
        f.call(opt_obj, obj[key], key, obj);
      }
    }
  },
  /**
   * @return {?}
   */
  implement : function() {
    /** @type {number} */
    var i = 0;
    for (;i < arguments.length;i++) {
      if ("function" == typeof arguments[i]) {
        arguments[i](this.prototype);
      } else {
        this.prototype.extend(arguments[i]);
      }
    }
    return this;
  },
  /**
   * @return {?}
   */
  toString : function() {
    return String(this.valueOf());
  }
});
if (!Array.prototype.indexOf) {
  /**
   * @param {string} obj
   * @return {number}
   * @template T
   */
  Array.prototype.indexOf = function(obj) {
    if (void 0 === this || null === this) {
      throw new TypeError;
    }
    var arr = Object(this);
    /** @type {number} */
    var len = arr.length >>> 0;
    if (0 === len) {
      return-1;
    }
    /** @type {number} */
    var n = 0;
    if (arguments.length > 0) {
      /** @type {number} */
      n = Number(arguments[1]);
      if (n !== n) {
        /** @type {number} */
        n = 0;
      } else {
        if (0 !== n) {
          if (1 / 0 !== n) {
            if (n !== -1 / 0) {
              /** @type {number} */
              n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
          }
        }
      }
    }
    if (n >= len) {
      return-1;
    }
    /** @type {number} */
    var i = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
    for (;len > i;i++) {
      if (i in arr && arr[i] === obj) {
        return i;
      }
    }
    return-1;
  };
}
var I18n = I18n || {};
/** @type {string} */
I18n.defaultLocale = "en";
/** @type {boolean} */
I18n.fallbacks = true;
/** @type {string} */
I18n.defaultSeparator = ".";
/** @type {null} */
I18n.locale = null;
/** @type {RegExp} */
I18n.PLACEHOLDER = /(?:\{\{|%\{)(.*?)(?:\}\}?)/gm;
I18n.fallbackRules = {};
I18n.pluralizationRules = {
  /**
   * @param {number} n
   * @return {?}
   */
  en : function(n) {
    return 0 == n ? ["zero", "none", "other"] : 1 == n ? "one" : "other";
  }
};
/**
 * @param {string} locale
 * @return {?}
 */
I18n.getFallbacks = function(locale) {
  if (locale === I18n.defaultLocale) {
    return[];
  }
  if (!I18n.fallbackRules[locale]) {
    /** @type {Array} */
    var rules = [];
    var parts = locale.split("-");
    /** @type {number} */
    var i = 1;
    for (;i < parts.length;i++) {
      rules.push(parts.slice(0, i).join("-"));
    }
    rules.push(I18n.defaultLocale);
    /** @type {Array} */
    I18n.fallbackRules[locale] = rules;
  }
  return I18n.fallbackRules[locale];
};
/**
 * @param {Object} obj
 * @param {string} name
 * @param {?} s
 * @return {?}
 */
I18n.isValidNode = function(obj, name, s) {
  return null !== obj[name] && obj[name] !== s;
};
/**
 * @param {string} scope
 * @param {Object} options
 * @return {?}
 */
I18n.lookup = function(scope, options) {
  var currentScope;
  options = options || {};
  /** @type {string} */
  var lookupInitialScope = scope;
  var translations = this.prepareOptions(I18n.translations);
  var locale = options.locale || I18n.currentLocale();
  var messages = translations[locale] || {};
  options = this.prepareOptions(options);
  if ("object" == typeof scope) {
    scope = scope.join(this.defaultSeparator);
  }
  if (options.scope) {
    scope = options.scope.toString() + this.defaultSeparator + scope;
  }
  scope = scope.split(this.defaultSeparator);
  for (;messages && scope.length > 0;) {
    currentScope = scope.shift();
    messages = messages[currentScope];
  }
  if (!messages) {
    if (I18n.fallbacks) {
      var fallbacks = this.getFallbacks(locale);
      /** @type {number} */
      var fallback = 0;
      for (;fallback < fallbacks.length;fallbacks++) {
        messages = I18n.lookup(lookupInitialScope, this.prepareOptions({
          locale : fallbacks[fallback]
        }, options));
        if (messages) {
          break;
        }
      }
    }
    if (!messages) {
      if (this.isValidNode(options, "defaultValue")) {
        messages = options.defaultValue;
      }
    }
  }
  return messages;
};
/**
 * @return {?}
 */
I18n.prepareOptions = function() {
  var attrs;
  var el = {};
  /** @type {number} */
  var l = arguments.length;
  /** @type {number} */
  var i = 0;
  for (;l > i;i++) {
    attrs = arguments[i];
    if (attrs) {
      var attr;
      for (attr in attrs) {
        if (!this.isValidNode(el, attr)) {
          el[attr] = attrs[attr];
        }
      }
    }
  }
  return el;
};
/**
 * @param {string} message
 * @param {Object} options
 * @return {?}
 */
I18n.interpolate = function(message, options) {
  options = this.prepareOptions(options);
  var placeholder;
  var value;
  var name;
  var matches = message.match(this.PLACEHOLDER);
  if (!matches) {
    return message;
  }
  /** @type {number} */
  var i = 0;
  for (;placeholder = matches[i];i++) {
    name = placeholder.replace(this.PLACEHOLDER, "$1");
    value = options[name];
    if (!this.isValidNode(options, name)) {
      /** @type {string} */
      value = "[missing " + placeholder + " value]";
    }
    /** @type {RegExp} */
    regex = new RegExp(placeholder.replace(/\{/gm, "\\{").replace(/\}/gm, "\\}"));
    message = message.replace(regex, value);
  }
  return message;
};
/**
 * @param {string} scope
 * @param {Object} options
 * @return {?}
 */
I18n.translate = function(scope, options) {
  options = this.prepareOptions(options);
  var translation = this.lookup(scope, options);
  try {
    return "object" == typeof translation ? "number" == typeof options.count ? this.pluralize(options.count, scope, options) : translation : this.interpolate(translation, options);
  } catch (n) {
    return this.missingTranslation(scope);
  }
};
/**
 * @param {string} scope
 * @param {(number|string)} value
 * @return {?}
 */
I18n.localize = function(scope, value) {
  switch(scope) {
    case "currency":
      return this.toCurrency(value);
    case "number":
      scope = this.lookup("number.format");
      return this.toNumber(value, scope);
    case "percentage":
      return this.toPercentage(value);
    default:
      return scope.match(/^(date|time)/) ? this.toTime(scope, value) : value.toString();
  }
};
/**
 * @param {string} val
 * @return {?}
 */
I18n.parseDate = function(val) {
  var matches;
  var ret;
  if ("object" == typeof val) {
    return val;
  }
  matches = val.toString().match(/(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}):(\d{2}))?(Z|\+0000)?/);
  if (matches) {
    /** @type {number} */
    var i = 1;
    for (;6 >= i;i++) {
      /** @type {number} */
      matches[i] = parseInt(matches[i], 10) || 0;
    }
    matches[2] -= 1;
    /** @type {Date} */
    ret = matches[7] ? new Date(Date.UTC(matches[1], matches[2], matches[3], matches[4], matches[5], matches[6])) : new Date(matches[1], matches[2], matches[3], matches[4], matches[5], matches[6]);
  } else {
    if ("number" == typeof val) {
      /** @type {Date} */
      ret = new Date;
      ret.setTime(val);
    } else {
      if (val.match(/\d+ \d+:\d+:\d+ [+-]\d+ \d+/)) {
        /** @type {Date} */
        ret = new Date;
        ret.setTime(Date.parse(val));
      } else {
        /** @type {Date} */
        ret = new Date;
        ret.setTime(Date.parse(val));
      }
    }
  }
  return ret;
};
/**
 * @param {string} scope
 * @param {string} d
 * @return {?}
 */
I18n.toTime = function(scope, d) {
  var date = this.parseDate(d);
  var format = this.lookup(scope);
  return date.toString().match(/invalid/i) ? date.toString() : format ? this.strftime(date, format) : date.toString();
};
/**
 * @param {Date} date
 * @param {string} format
 * @return {?}
 */
I18n.strftime = function(date, format) {
  var options = this.lookup("date");
  if (!options) {
    return date.toString();
  }
  options.meridian = options.meridian || ["AM", "PM"];
  var weekDay = date.getDay();
  var mins = date.getDate();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var hour12 = date.getHours();
  var hour = hour12;
  /** @type {number} */
  var meridian = hour12 > 11 ? 1 : 0;
  var day = date.getSeconds();
  var secs = date.getMinutes();
  var offset = date.getTimezoneOffset();
  /** @type {number} */
  var b = Math.floor(Math.abs(offset / 60));
  /** @type {number} */
  var dstUri = Math.abs(offset) - 60 * b;
  /** @type {string} */
  var timezoneoffset = (offset > 0 ? "-" : "+") + (b.toString().length < 2 ? "0" + b : b) + (dstUri.toString().length < 2 ? "0" + dstUri : dstUri);
  if (hour > 12) {
    hour -= 12;
  } else {
    if (0 === hour) {
      /** @type {number} */
      hour = 12;
    }
  }
  /**
   * @param {?} n
   * @return {?}
   */
  var padding = function(n) {
    var headBuffer = "0" + n.toString();
    return headBuffer.substr(headBuffer.length - 2);
  };
  /** @type {string} */
  var f = format;
  f = f.replace("%a", options.abbr_day_names[weekDay]);
  f = f.replace("%A", options.day_names[weekDay]);
  f = f.replace("%b", options.abbr_month_names[month]);
  f = f.replace("%B", options.month_names[month]);
  f = f.replace("%d", padding(mins));
  f = f.replace("%e", mins);
  f = f.replace("%-d", mins);
  f = f.replace("%H", padding(hour12));
  f = f.replace("%-H", hour12);
  f = f.replace("%I", padding(hour));
  f = f.replace("%-I", hour);
  f = f.replace("%m", padding(month));
  f = f.replace("%-m", month);
  f = f.replace("%M", padding(secs));
  f = f.replace("%-M", secs);
  f = f.replace("%p", options.meridian[meridian]);
  f = f.replace("%S", padding(day));
  f = f.replace("%-S", day);
  f = f.replace("%w", weekDay);
  f = f.replace("%y", padding(year));
  f = f.replace("%-y", padding(year).replace(/^0+/, ""));
  f = f.replace("%Y", year);
  f = f.replace("%z", timezoneoffset);
  return f;
};
/**
 * @param {string} value
 * @param {Object} options
 * @return {?}
 */
I18n.toNumber = function(value, options) {
  options = this.prepareOptions(options, this.lookup("number.format"), {
    precision : 3,
    separator : ".",
    delimiter : ",",
    strip_insignificant_zeros : false
  });
  var part;
  var formattedNumber;
  /** @type {boolean} */
  var s = 0 > value;
  /** @type {string} */
  var uHostName = Math.abs(value).toFixed(options.precision).toString();
  /** @type {Array.<string>} */
  var parts = uHostName.split(".");
  /** @type {Array} */
  var list = [];
  /** @type {string} */
  value = parts[0];
  /** @type {string} */
  part = parts[1];
  for (;value.length > 0;) {
    list.unshift(value.substr(Math.max(0, value.length - 3), 3));
    /** @type {string} */
    value = value.substr(0, value.length - 3);
  }
  /** @type {string} */
  formattedNumber = list.join(options.delimiter);
  if (options.precision > 0) {
    formattedNumber += options.separator + parts[1];
  }
  if (s) {
    /** @type {string} */
    formattedNumber = "-" + formattedNumber;
  }
  if (options.strip_insignificant_zeros) {
    var regex = {
      separator : new RegExp(options.separator.replace(/\./, "\\.") + "$"),
      zeros : /0+$/
    };
    /** @type {string} */
    formattedNumber = formattedNumber.replace(regex.zeros, "").replace(regex.separator, "");
  }
  return formattedNumber;
};
/**
 * @param {(number|string)} number
 * @param {Object} options
 * @return {?}
 */
I18n.toCurrency = function(number, options) {
  options = this.prepareOptions(options, this.lookup("number.currency.format"), this.lookup("number.format"), {
    unit : "$",
    precision : 2,
    format : "%u%n",
    delimiter : ",",
    separator : "."
  });
  number = this.toNumber(number, options);
  number = options.format.replace("%u", options.unit).replace("%n", number);
  return number;
};
/**
 * @param {number} number
 * @param {Object} options
 * @return {?}
 */
I18n.toHumanSize = function(number, options) {
  var guess;
  var precision;
  /** @type {number} */
  var jump = 1024;
  /** @type {number} */
  var size = number;
  /** @type {number} */
  var iterations = 0;
  for (;size >= jump && 4 > iterations;) {
    size /= jump;
    iterations += 1;
  }
  if (0 === iterations) {
    guess = this.t("number.human.storage_units.units.byte", {
      count : size
    });
    /** @type {number} */
    precision = 0;
  } else {
    guess = this.t("number.human.storage_units.units." + [null, "kb", "mb", "gb", "tb"][iterations]);
    /** @type {number} */
    precision = size - Math.floor(size) === 0 ? 0 : 1;
  }
  options = this.prepareOptions(options, {
    precision : precision,
    format : "%n%u",
    delimiter : ""
  });
  number = this.toNumber(size, options);
  number = options.format.replace("%u", guess).replace("%n", number);
  return number;
};
/**
 * @param {string} number
 * @param {Error} options
 * @return {?}
 */
I18n.toPercentage = function(number, options) {
  options = this.prepareOptions(options, this.lookup("number.percentage.format"), this.lookup("number.format"), {
    precision : 3,
    separator : ".",
    delimiter : ""
  });
  number = this.toNumber(number, options);
  return number + "%";
};
/**
 * @param {?} locale
 * @return {?}
 */
I18n.pluralizer = function(locale) {
  pluralizer = this.pluralizationRules[locale];
  return void 0 !== pluralizer ? pluralizer : this.pluralizationRules["en"];
};
/**
 * @param {Array} keys
 * @param {Error} translation
 * @return {?}
 */
I18n.findAndTranslateValidNode = function(keys, translation) {
  /** @type {number} */
  i = 0;
  for (;i < keys.length;i++) {
    key = keys[i];
    if (this.isValidNode(translation, key)) {
      return translation[key];
    }
  }
  return null;
};
/**
 * @param {(number|string)} count
 * @param {string} scope
 * @param {Object} options
 * @return {?}
 */
I18n.pluralize = function(count, scope, options) {
  var translation;
  try {
    translation = this.lookup(scope, options);
  } catch (s) {
  }
  if (!translation) {
    return this.missingTranslation(scope);
  }
  var message;
  options = this.prepareOptions(options);
  options.count = count.toString();
  pluralizer = this.pluralizer(this.currentLocale());
  key = pluralizer(Math.abs(count));
  /** @type {Array} */
  keys = "object" == typeof key && key instanceof Array ? key : [key];
  message = this.findAndTranslateValidNode(keys, translation);
  if (null == message) {
    message = this.missingTranslation(scope, keys[0]);
  }
  return this.interpolate(message, options);
};
/**
 * @return {?}
 */
I18n.missingTranslation = function() {
  var message = '[missing "' + this.currentLocale();
  /** @type {number} */
  var argLength = arguments.length;
  /** @type {number} */
  var elementArgumentPos = 0;
  for (;argLength > elementArgumentPos;elementArgumentPos++) {
    message += "." + arguments[elementArgumentPos];
  }
  message += '" translation]';
  return message;
};
/**
 * @return {?}
 */
I18n.currentLocale = function() {
  return I18n.locale || I18n.defaultLocale;
};
/** @type {function (string, Object): ?} */
I18n.t = I18n.translate;
/** @type {function (string, (number|string)): ?} */
I18n.l = I18n.localize;
/** @type {function ((number|string), string, Object): ?} */
I18n.p = I18n.pluralize;
!function(win) {
  /**
   * @param {?} selector
   * @return {?}
   */
  function init(selector) {
    return $(selector).parents().andSelf().map(function() {
      var str = this.tagName;
      /** @type {string} */
      var indent = "";
      if (this.className) {
        indent = this.className.split(/\s+/).map(function(dataAndEvents) {
          return "." + dataAndEvents;
        }).join("");
      }
      /** @type {string} */
      var selector = "";
      if (this.id) {
        /** @type {string} */
        selector = "#" + this.id;
      }
      return str + indent + selector;
    }).toArray().join(" > ");
  }
  /**
   * @param {?} items
   * @return {?}
   */
  function join(items) {
    var which = $(items).map(function() {
      return init(this);
    }).toArray();
    /** @type {Array} */
    var elems = [];
    $.each(which, function() {
      if (-1 === $.inArray(this, elems)) {
        elems.push(this);
      }
    });
    return elems.join(", ");
  }
  var $ = win.jQuery;
  /**
   * @return {undefined}
   */
  $.fn.printElement = function() {
    var $label = $("#jquery-print-element");
    if (0 === $label.length) {
      $label = $('<style id="jquery-print-element">');
      $("body").append($label);
    }
    $label.text(["@media print {", "html { height: 100%; }", "body { background: white !important; padding: 0 !importnat; margin: 0 !important; min-height: 100%; position: relative; }", join(this.parents().andSelf().siblings()) + " { display: none !important; }", join(this.parents()) + " { display: block !important; background: white !important; padding: 0 !important; margin: 0 !important; position: static !important; float: none !important; }", join(this) + " { display: block !important; position: statis !important; overflow: hidden !important; margin: 2em !important; }",
    "}"].join(" "));
    print();
  };
}(window);
!function($) {
  /**
   * @param {Object} el
   * @param {Object} opts
   * @return {undefined}
   */
  function install(el, opts) {
    /** @type {boolean} */
    var full = el == window;
    var msg = opts && void 0 !== opts.message ? opts.message : void 0;
    opts = $.extend({}, $.blockUI.defaults, opts || {});
    opts.overlayCSS = $.extend({}, $.blockUI.defaults.overlayCSS, opts.overlayCSS || {});
    var themedCSS = $.extend({}, $.blockUI.defaults.css, opts.css || {});
    var css = $.extend({}, $.blockUI.defaults.themedCSS, opts.themedCSS || {});
    msg = void 0 === msg ? opts.message : msg;
    if (full) {
      if (pageBlock) {
        remove(window, {
          fadeOut : 0
        });
      }
    }
    if (msg && ("string" != typeof msg && (msg.parentNode || msg.jquery))) {
      var node = msg.jquery ? msg[0] : msg;
      var data = {};
      $(el).data("blockUI.history", data);
      data.el = node;
      data.parent = node.parentNode;
      data.display = node.style.display;
      data.position = node.style.position;
      if (data.parent) {
        data.parent.removeChild(node);
      }
    }
    var lyr3;
    var s;
    var z = opts.baseZ;
    var lyr1 = opts.forceIframe ? $('<iframe class="blockUI" style="z-index:' + z++ + ';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="' + opts.iframeSrc + '"></iframe>') : $('<div class="blockUI" style="display:none"></div>');
    var lyr2 = $('<div class="blockUI blockOverlay" style="z-index:' + z++ + ';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');
    /** @type {string} */
    s = opts.theme && full ? '<div class="blockUI blockMsg blockPage ui-dialog ui-widget ui-corner-all" style="z-index:' + z + ';display:none;position:fixed"><div class="ui-widget-header ui-dialog-titlebar blockTitle">' + (opts.title || "&nbsp;") + '</div><div class="ui-widget-content ui-dialog-content"></div></div>' : opts.theme ? '<div class="blockUI blockMsg blockElement ui-dialog ui-widget ui-corner-all" style="z-index:' + z + ';display:none;position:absolute"><div class="ui-widget-header ui-dialog-titlebar blockTitle">' +
    (opts.title || "&nbsp;") + '</div><div class="ui-widget-content ui-dialog-content"></div></div>' : full ? '<div class="blockUI blockMsg blockPage" style="z-index:' + z + ';display:none;position:fixed"></div>' : '<div class="blockUI blockMsg blockElement" style="z-index:' + z + ';display:none;position:absolute"></div>';
    lyr3 = $(s);
    if (msg) {
      if (opts.theme) {
        lyr3.css(css);
        lyr3.addClass("ui-widget-content");
      } else {
        lyr3.css(themedCSS);
      }
    }
    /*if (!(opts.applyPlatformOpacityRules && ($.browser.mozilla && /Linux/.test(navigator.platform)))) {
      lyr2.css(opts.overlayCSS);
    }*/
    lyr2.css("position", full ? "fixed" : "absolute");
    if (opts.forceIframe) {
      lyr1.css("opacity", 0);
    }
    /** @type {Array} */
    var layers = [lyr1, lyr2, lyr3];
    var $par = full ? $("body") : $(el);
    $.each(layers, function() {
      this.appendTo($par);
    });
    if (opts.theme) {
      if (opts.draggable) {
        if ($.fn.draggable) {
          lyr3.draggable({
            handle : ".ui-dialog-titlebar",
            cancel : "li"
          });
        }
      }
    }
    var expr = setExpr && (!$.boxModel || $("object,embed", full ? null : el).length > 0);
    if (ie6 || expr) {
      if (full) {
        if (opts.allowBodyStretch) {
          if ($.boxModel) {
            $("html,body").css("height", "100%");
          }
        }
      }
      if ((ie6 || !$.boxModel) && !full) {
        var L = sz(el, "borderTopWidth");
        var l = sz(el, "borderLeftWidth");
        /** @type {(number|string)} */
        var modurl = L ? "(0 - " + L + ")" : 0;
        /** @type {(number|string)} */
        var fixL = l ? "(0 - " + l + ")" : 0;
      }
      $.each([lyr1, lyr2, lyr3], function(dataAndEvents, li) {
        var style = li[0].style;
        /** @type {string} */
        style.position = "absolute";
        if (2 > dataAndEvents) {
          if (full) {
            style.setExpression("height", "Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.boxModel?0:" + opts.quirksmodeOffsetHack + ') + "px"');
          } else {
            style.setExpression("height", 'this.parentNode.offsetHeight + "px"');
          }
          if (full) {
            style.setExpression("width", 'jQuery.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"');
          } else {
            style.setExpression("width", 'this.parentNode.offsetWidth + "px"');
          }
          if (fixL) {
            style.setExpression("left", fixL);
          }
          if (modurl) {
            style.setExpression("top", modurl);
          }
        } else {
          if (opts.centerY) {
            if (full) {
              style.setExpression("top", '(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');
            }
            /** @type {number} */
            style.marginTop = 0;
          } else {
            if (!opts.centerY && full) {
              /** @type {number} */
              var s = opts.css && opts.css.top ? parseInt(opts.css.top) : 0;
              /** @type {string} */
              var timingFunction = "((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + " + s + ') + "px"';
              style.setExpression("top", timingFunction);
            }
          }
        }
      });
    }
    if (msg) {
      if (opts.theme) {
        lyr3.find(".ui-widget-content").append(msg);
      } else {
        lyr3.append(msg);
      }
      if (msg.jquery || msg.nodeType) {
        $(msg).show();
      }
    }
    if (opts.forceIframe) {
      if (opts.showOverlay) {
        lyr1.show();
      }
    }
    if (opts.fadeIn) {
      var cb = opts.onBlock ? opts.onBlock : noOp;
      var cb1 = opts.showOverlay && !msg ? cb : noOp;
      var cb2 = msg ? cb : noOp;
      if (opts.showOverlay) {
        lyr2._fadeIn(opts.fadeIn, cb1);
      }
      if (msg) {
        lyr3._fadeIn(opts.fadeIn, cb2);
      }
    } else {
      if (opts.showOverlay) {
        lyr2.show();
      }
      if (msg) {
        lyr3.show();
      }
      if (opts.onBlock) {
        opts.onBlock();
      }
    }
    bind(1, el, opts);
    if (full) {
      pageBlock = lyr3[0];
      pageBlockEls = $(":input:enabled:visible", pageBlock);
      if (opts.focusInput) {
        setTimeout(focus, 20);
      }
    } else {
      center(lyr3[0], opts.centerX, opts.centerY);
    }
    if (opts.timeout) {
      /** @type {number} */
      var to = setTimeout(function() {
        if (full) {
          $.unblockUI(opts);
        } else {
          $(el).unblock(opts);
        }
      }, opts.timeout);
      $(el).data("blockUI.timeout", to);
    }
  }
  /**
   * @param {Window} el
   * @param {Object} opts
   * @return {undefined}
   */
  function remove(el, opts) {
    /** @type {boolean} */
    var full = el == window;
    var $el = $(el);
    var pdataCur = $el.data("blockUI.history");
    var to = $el.data("blockUI.timeout");
    if (to) {
      clearTimeout(to);
      $el.removeData("blockUI.timeout");
    }
    opts = $.extend({}, $.blockUI.defaults, opts || {});
    bind(0, el, opts);
    var els;
    els = full ? $("body").children().filter(".blockUI").add("body > .blockUI") : $(".blockUI", el);
    if (full) {
      /** @type {null} */
      pageBlock = pageBlockEls = null;
    }
    if (opts.fadeOut) {
      els.fadeOut(opts.fadeOut);
      setTimeout(function() {
        reset(els, pdataCur, opts, el);
      }, opts.fadeOut);
    } else {
      reset(els, pdataCur, opts, el);
    }
  }
  /**
   * @param {string} els
   * @param {Object} data
   * @param {Object} opts
   * @param {Object} el
   * @return {undefined}
   */
  function reset(els, data, opts, el) {
    els.each(function() {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    });
    if (data && data.el) {
      data.el.style.display = data.display;
      data.el.style.position = data.position;
      if (data.parent) {
        data.parent.appendChild(data.el);
      }
      $(el).removeData("blockUI.history");
    }
    if ("function" == typeof opts.onUnblock) {
      opts.onUnblock(el, opts);
    }
  }
  /**
   * @param {string} fn
   * @param {Object} el
   * @param {Function} arg
   * @return {undefined}
   */
  function bind(fn, el, arg) {
    /** @type {boolean} */
    var full = el == window;
    var $elem = $(el);
    if (fn || (!full || pageBlock) && (full || $elem.data("blockUI.isBlocked"))) {
      if (!full) {
        $elem.data("blockUI.isBlocked", fn);
      }
      if (arg.bindEvents && (!fn || arg.showOverlay)) {
        /** @type {string} */
        var event = "mousedown mouseup keydown keypress";
        if (fn) {
          $(document).bind(event, arg, handler);
        } else {
          $(document).unbind(event, handler);
        }
      }
    }
  }
  /**
   * @param {Event} e
   * @return {?}
   */
  function handler(e) {
    if (e.keyCode && (9 == e.keyCode && (pageBlock && e.data.constrainTabKey))) {
      var els = pageBlockEls;
      /** @type {boolean} */
      var fwd = !e.shiftKey && e.target == els[els.length - 1];
      var back = e.shiftKey && e.target == els[0];
      if (fwd || back) {
        setTimeout(function() {
          focus(back);
        }, 10);
        return false;
      }
    }
    return $(e.target).parents("div.blockMsg").length > 0 ? true : 0 == $(e.target).parents().children().filter("div.blockUI").length;
  }
  /**
   * @param {boolean} back
   * @return {undefined}
   */
  function focus(back) {
    if (pageBlockEls) {
      var e = pageBlockEls[back === true ? pageBlockEls.length - 1 : 0];
      if (e) {
        e.focus();
      }
    }
  }
  /**
   * @param {Element} el
   * @param {?} optionalTarget
   * @param {?} noY
   * @return {undefined}
   */
  function center(el, optionalTarget, noY) {
    var p = el.parentNode;
    var s = el.style;
    /** @type {number} */
    var t = (p.offsetWidth - el.offsetWidth) / 2 - sz(p, "borderLeftWidth");
    /** @type {number} */
    var l = (p.offsetHeight - el.offsetHeight) / 2 - sz(p, "borderTopWidth");
    if (optionalTarget) {
      /** @type {string} */
      s.left = t > 0 ? t + "px" : "0";
    }
    if (noY) {
      /** @type {string} */
      s.top = l > 0 ? l + "px" : "0";
    }
  }
  /**
   * @param {Object} el
   * @param {string} p
   * @return {?}
   */
  function sz(el, p) {
    return parseInt($.css(el, p)) || 0;
  }
  if (/1\.(0|1|2)\.(0|1|2)/.test($.fn.jquery) || /^1.1\./.test($.fn.jquery)) {
    alert("blockUI requires jQuery v1.2.3 or later!  You are using v" + $.fn.jquery);
  } else {
    $.fn._fadeIn = $.fn.fadeIn;
    /**
     * @return {undefined}
     */
    var noOp = function() {
    };
    var u = document.documentMode || 0;
    var setExpr = undefined;
    var ie6 = undefined;
    /**
     * @param {Object} opts
     * @return {undefined}
     */
    $.blockUI = function(opts) {
      install(window, opts);
    };
    /**
     * @param {Object} opts
     * @return {undefined}
     */
    $.unblockUI = function(opts) {
      remove(window, opts);
    };
    /**
     * @param {string} message
     * @param {string} title
     * @param {number} timeout
     * @param {?} onClose
     * @return {undefined}
     */
    $.growlUI = function(message, title, timeout, onClose) {
      var output = $('<div class="growlUI"></div>');
      if (message) {
        output.append("<h1>" + message + "</h1>");
      }
      if (title) {
        output.append("<h2>" + title + "</h2>");
      }
      if (void 0 == timeout) {
        /** @type {number} */
        timeout = 3E3;
      }
      $.blockUI({
        message : output,
        fadeIn : 700,
        fadeOut : 1E3,
        centerY : false,
        timeout : timeout,
        showOverlay : false,
        onUnblock : onClose,
        css : $.blockUI.defaults.growlCSS
      });
    };
    /**
     * @param {Object} opts
     * @return {?}
     */
    $.fn.block = function(opts) {
      return this.unblock({
        fadeOut : 0
      }).each(function() {
        if ("static" == $.css(this, "position")) {
          /** @type {string} */
          this.style.position = "relative";
        }
        /*if ($.browser.msie) {
          // @type {number}
          this.style.zoom = 1;
        }*/
        install(this, opts);
      });
    };
    /**
     * @param {Object} opts
     * @return {?}
     */
    $.fn.unblock = function(opts) {
      return this.each(function() {
        remove(this, opts);
      });
    };
    /** @type {number} */
    $.blockUI.version = 2.33;
    $.blockUI.defaults = {
      message : "<h1>Please wait...</h1>",
      title : null,
      draggable : true,
      theme : false,
      css : {
        padding : 0,
        margin : 0,
        width : "30%",
        top : "40%",
        left : "35%",
        textAlign : "center",
        color : "#000",
        border : "3px solid #aaa",
        backgroundColor : "#fff",
        cursor : "wait"
      },
      themedCSS : {
        width : "30%",
        top : "40%",
        left : "35%"
      },
      overlayCSS : {
        backgroundColor : "#000",
        opacity : 0.6,
        cursor : "wait"
      },
      growlCSS : {
        width : "350px",
        top : "10px",
        left : "",
        right : "10px",
        border : "none",
        padding : "5px",
        opacity : 0.6,
        cursor : "default",
        color : "#fff",
        backgroundColor : "#000",
        "-webkit-border-radius" : "10px",
        "-moz-border-radius" : "10px",
        "border-radius" : "10px"
      },
      iframeSrc : /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank",
      forceIframe : false,
      baseZ : 1E3,
      centerX : true,
      centerY : true,
      allowBodyStretch : true,
      bindEvents : true,
      constrainTabKey : true,
      fadeIn : 200,
      fadeOut : 400,
      timeout : 0,
      showOverlay : true,
      focusInput : true,
      applyPlatformOpacityRules : true,
      onBlock : null,
      onUnblock : null,
      quirksmodeOffsetHack : 4
    };
    /** @type {null} */
    var pageBlock = null;
    /** @type {Array} */
    var pageBlockEls = [];
  }
}(jQuery);
/**
 * @param {string} callback
 * @return {?}
 */
jQuery.fn.inspect = function(callback) {
  jQuery.inspect($(this), callback);
  return this;
};
/**
 * @param {string} obj
 * @param {string} callback
 * @return {?}
 */
jQuery.inspect = function(obj, callback) {
  callback = callback ? callback : "alert";
  /** @type {string} */
  var ret = "";
  /** @type {null} */
  var taskComplete = null;
  /** @type {null} */
  var join = null;
  switch(callback) {
    case "console":
      /** @type {function (string, string): ?} */
      taskComplete = jQuery.inspect._buildText;
      /** @type {function (string): undefined} */
      join = jQuery.inspect._console;
      break;
    case "window":
      /** @type {function (string, string): ?} */
      taskComplete = jQuery.inspect._buildHTML;
      /** @type {function (string): undefined} */
      join = jQuery.inspect._window;
      break;
    default:
      /** @type {function (string, string): ?} */
      taskComplete = jQuery.inspect._buildText;
      /** @type {function (string): undefined} */
      join = jQuery.inspect._alert;
  }
  switch(typeof obj) {
    case "string":
      /** @type {string} */
      ret = "String: " + obj;
      break;
    case "number":
      /** @type {string} */
      ret = "Number: " + obj;
      break;
    case "boolean":
      /** @type {string} */
      ret = "Boolean: " + obj;
      break;
    case "undefined":
      alert("Object is undefined");
      return true;
    default:
      ret = jQuery.inspect._parseObject(obj, taskComplete);
  }
  join(ret);
};
/**
 * @param {(Object|string)} obj
 * @param {Array} fn
 * @return {?}
 */
jQuery.inspect._parseObject = function(obj, fn) {
  /** @type {string} */
  var transform = "";
  for (field in obj) {
    try {
      transform += fn(field, obj[field]);
    } catch (n) {
    }
  }
  return transform;
};
/**
 * @param {string} otag
 * @param {string} ctag
 * @return {?}
 */
jQuery.inspect._buildText = function(otag, ctag) {
  return otag + ":" + ctag + "\n";
};
/**
 * @param {string} dataAndEvents
 * @param {string} deepDataAndEvents
 * @return {?}
 */
jQuery.inspect._buildHTML = function(dataAndEvents, deepDataAndEvents) {
  return "<tr><td>" + dataAndEvents + "</td><td>" + deepDataAndEvents + "</td></tr>\n";
};
/**
 * @param {string} first
 * @return {undefined}
 */
jQuery.inspect._console = function(first) {
  console.log(first);
};
/**
 * @param {string} msg
 * @return {undefined}
 */
jQuery.inspect._alert = function(msg) {
  alert(msg);
};
/**
 * @param {string} results
 * @return {undefined}
 */
jQuery.inspect._window = function(results) {
  /** @type {string} */
  results = "<html><head>" + jQuery.inspect._windowSettings.styles + "</head><body><table>" + results + "</table></body></html>";
  /** @type {(Window|null)} */
  dump_window = window.open("", "", jQuery.inspect._windowSettings.config);
  dump_window.document.write(results);
  dump_window.document.close();
  dump_window.focus();
};
jQuery.inspect._windowSettings = jQuery.extend({
  width : 800,
  height : 600
});
/** @type {string} */
jQuery.inspect._windowSettings.styles = "<style> \t* { \t  margin: 0; \t} \thtml, body { \t  height: 100%; \t  text-align: center; \t  margin-bottom: 1px; \t  font-family: verdana,helvetica,sans-serif; \t} \ttable { \t\twidth: " + (jQuery.inspect._windowSettings.width - 20) + "px; \t\tborder: 1px solid black;   }   td {     vertical-align: top;   } </style>";
/** @type {string} */
jQuery.inspect._windowSettings.config = "width=" + jQuery.inspect._windowSettings.width + ",height=" + jQuery.inspect._windowSettings.height + ",scrollbars=yes,location=no,menubar=no,toolbar=no";
/**
 * @param {string} callback
 * @return {?}
 */
jQuery.fn.inspect = function(callback) {
  jQuery.inspect($(this), callback);
  return this;
};
/**
 * @param {string} obj
 * @param {string} callback
 * @return {?}
 */
jQuery.inspect = function(obj, callback) {
  callback = callback ? callback : "alert";
  /** @type {string} */
  var ret = "";
  /** @type {null} */
  var taskComplete = null;
  /** @type {null} */
  var join = null;
  switch(callback) {
    case "console":
      /** @type {function (string, string): ?} */
      taskComplete = jQuery.inspect._buildText;
      /** @type {function (string): undefined} */
      join = jQuery.inspect._console;
      break;
    case "window":
      /** @type {function (string, string): ?} */
      taskComplete = jQuery.inspect._buildHTML;
      /** @type {function (string): undefined} */
      join = jQuery.inspect._window;
      break;
    default:
      /** @type {function (string, string): ?} */
      taskComplete = jQuery.inspect._buildText;
      /** @type {function (string): undefined} */
      join = jQuery.inspect._alert;
  }
  switch(typeof obj) {
    case "string":
      /** @type {string} */
      ret = "String: " + obj;
      break;
    case "number":
      /** @type {string} */
      ret = "Number: " + obj;
      break;
    case "boolean":
      /** @type {string} */
      ret = "Boolean: " + obj;
      break;
    case "undefined":
      alert("Object is undefined");
      return true;
    default:
      ret = jQuery.inspect._parseObject(obj, taskComplete);
  }
  join(ret);
};
/**
 * @param {(Object|string)} obj
 * @param {Array} fn
 * @return {?}
 */
jQuery.inspect._parseObject = function(obj, fn) {
  /** @type {string} */
  var transform = "";
  for (field in obj) {
    try {
      transform += fn(field, obj[field]);
    } catch (n) {
    }
  }
  return transform;
};
/**
 * @param {string} otag
 * @param {string} ctag
 * @return {?}
 */
jQuery.inspect._buildText = function(otag, ctag) {
  return otag + ":" + ctag + "\n";
};
/**
 * @param {string} dataAndEvents
 * @param {string} deepDataAndEvents
 * @return {?}
 */
jQuery.inspect._buildHTML = function(dataAndEvents, deepDataAndEvents) {
  return "<tr><td>" + dataAndEvents + "</td><td>" + deepDataAndEvents + "</td></tr>\n";
};
/**
 * @param {string} first
 * @return {undefined}
 */
jQuery.inspect._console = function(first) {
  console.log(first);
};
/**
 * @param {string} msg
 * @return {undefined}
 */
jQuery.inspect._alert = function(msg) {
  //alert(msg);
};
/**
 * @param {string} results
 * @return {undefined}
 */
jQuery.inspect._window = function(results) {
  /** @type {string} */
  results = "<html><head>" + jQuery.inspect._windowSettings.styles + "</head><body><table>" + results + "</table></body></html>";
  /** @type {(Window|null)} */
  dump_window = window.open("", "", jQuery.inspect._windowSettings.config);
  dump_window.document.write(results);
  dump_window.document.close();
  dump_window.focus();
};
jQuery.inspect._windowSettings = jQuery.extend({
  width : 800,
  height : 600
});
/** @type {string} */
jQuery.inspect._windowSettings.styles = "<style> * { margin: 0; } html, body { height: 100%; text-align: center; margin-bottom: 1px; font-family: verdana,helvetica,sans-serif; } table { width: " + (jQuery.inspect._windowSettings.width - 20) + "px; border: 1px solid black; } td { vertical-align: top; } </style>";
/** @type {string} */
jQuery.inspect._windowSettings.config = "width=" + jQuery.inspect._windowSettings.width + ",height=" + jQuery.inspect._windowSettings.height + ",scrollbars=yes,location=no,menubar=no,toolbar=no";
jQuery.easing["jswing"] = jQuery.easing["swing"];
jQuery.extend(jQuery.easing, {
  def : "easeOutQuad",
  /**
   * @param {?} diff
   * @param {?} p
   * @param {?} firstNum
   * @param {?} n
   * @param {?} swing
   * @return {?}
   */
  swing : function(diff, p, firstNum, n, swing) {
    return jQuery.easing[jQuery.easing.def](diff, p, firstNum, n, swing);
  },
  /**
   * @param {?} t
   * @param {number} diff
   * @param {number} firstNum
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  easeInQuad : function(t, diff, firstNum, c, d) {
    return c * (diff /= d) * diff + firstNum;
  },
  /**
   * @param {?} b
   * @param {number} time
   * @param {number} x
   * @param {?} diff
   * @param {number} dur
   * @return {?}
   */
  easeOutQuad : function(b, time, x, diff, dur) {
    return-diff * (time /= dur) * (time - 2) + x;
  },
  /**
   * @param {?} b
   * @param {number} time
   * @param {number} beg
   * @param {number} diff
   * @param {number} dur
   * @return {?}
   */
  easeInOutQuad : function(b, time, beg, diff, dur) {
    return(time /= dur / 2) < 1 ? diff / 2 * time * time + beg : -diff / 2 * (--time * (time - 2) - 1) + beg;
  },
  /**
   * @param {?} b
   * @param {number} t
   * @param {number} cx
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  easeInCubic : function(b, t, cx, c, d) {
    return c * (t /= d) * t * t + cx;
  },
  /**
   * @param {?} b
   * @param {number} t
   * @param {number} beg
   * @param {number} diff
   * @param {number} d
   * @return {?}
   */
  easeOutCubic : function(b, t, beg, diff, d) {
    return diff * ((t = t / d - 1) * t * t + 1) + beg;
  },
  /**
   * @param {?} b
   * @param {number} t
   * @param {number} c
   * @param {number} x
   * @param {number} d
   * @return {?}
   */
  easeInOutCubic : function(b, t, c, x, d) {
    return(t /= d / 2) < 1 ? x / 2 * t * t * t + c : x / 2 * ((t -= 2) * t * t + 2) + c;
  },
  /**
   * @param {?} b
   * @param {number} t
   * @param {number} cx
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  easeInQuart : function(b, t, cx, c, d) {
    return c * (t /= d) * t * t * t + cx;
  },
  /**
   * @param {?} b
   * @param {number} t
   * @param {number} c
   * @param {?} x
   * @param {number} d
   * @return {?}
   */
  easeOutQuart : function(b, t, c, x, d) {
    return-x * ((t = t / d - 1) * t * t * t - 1) + c;
  },
  /**
   * @param {?} b
   * @param {number} t
   * @param {number} c
   * @param {number} d
   * @param {number} x
   * @return {?}
   */
  easeInOutQuart : function(b, t, c, d, x) {
    return(t /= x / 2) < 1 ? d / 2 * t * t * t * t + c : -d / 2 * ((t -= 2) * t * t * t - 2) + c;
  },
  /**
   * @param {?} t
   * @param {number} currentTime
   * @param {number} b
   * @param {number} changeInValue
   * @param {number} totalTime
   * @return {?}
   */
  easeInQuint : function(t, currentTime, b, changeInValue, totalTime) {
    return changeInValue * (currentTime /= totalTime) * currentTime * currentTime * currentTime * currentTime + b;
  },
  /**
   * @param {?} b
   * @param {number} t
   * @param {number} beg
   * @param {number} diff
   * @param {number} d
   * @return {?}
   */
  easeOutQuint : function(b, t, beg, diff, d) {
    return diff * ((t = t / d - 1) * t * t * t * t + 1) + beg;
  },
  /**
   * @param {?} x
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  easeInOutQuint : function(x, t, b, c, d) {
    return(t /= d / 2) < 1 ? c / 2 * t * t * t * t * t + b : c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
  },
  /**
   * @param {?} t
   * @param {number} a
   * @param {?} h
   * @param {number} x
   * @param {number} b
   * @return {?}
   */
  easeInSine : function(t, a, h, x, b) {
    return-x * Math.cos(a / b * (Math.PI / 2)) + x + h;
  },
  /**
   * @param {?} t
   * @param {number} a
   * @param {number} beg
   * @param {number} diff
   * @param {number} b
   * @return {?}
   */
  easeOutSine : function(t, a, beg, diff, b) {
    return diff * Math.sin(a / b * (Math.PI / 2)) + beg;
  },
  /**
   * @param {?} b
   * @param {number} pos
   * @param {number} c
   * @param {?} t
   * @param {number} d
   * @return {?}
   */
  easeInOutSine : function(b, pos, c, t, d) {
    return-t / 2 * (Math.cos(Math.PI * pos / d) - 1) + c;
  },
  /**
   * @param {?} t
   * @param {number} time
   * @param {number} b
   * @param {number} c
   * @param {number} dur
   * @return {?}
   */
  easeInExpo : function(t, time, b, c, dur) {
    return 0 == time ? b : c * Math.pow(2, 10 * (time / dur - 1)) + b;
  },
  /**
   * @param {?} t
   * @param {number} ms
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  easeOutExpo : function(t, ms, b, c, d) {
    return ms == d ? b + c : c * (-Math.pow(2, -10 * ms / d) + 1) + b;
  },
  /**
   * @param {?} t
   * @param {number} time
   * @param {number} beg
   * @param {number} diff
   * @param {number} dur
   * @return {?}
   */
  easeInOutExpo : function(t, time, beg, diff, dur) {
    return 0 == time ? beg : time == dur ? beg + diff : (time /= dur / 2) < 1 ? diff / 2 * Math.pow(2, 10 * (time - 1)) + beg : diff / 2 * (-Math.pow(2, -10 * --time) + 2) + beg;
  },
  /**
   * @param {?} pos
   * @param {number} t
   * @param {number} b
   * @param {?} x
   * @param {number} d
   * @return {?}
   */
  easeInCirc : function(pos, t, b, x, d) {
    return-x * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
  },
  /**
   * @param {?} b
   * @param {number} t
   * @param {number} beg
   * @param {number} diff
   * @param {number} d
   * @return {?}
   */
  easeOutCirc : function(b, t, beg, diff, d) {
    return diff * Math.sqrt(1 - (t = t / d - 1) * t) + beg;
  },
  /**
   * @param {?} b
   * @param {number} t
   * @param {number} x
   * @param {number} dataAndEvents
   * @param {number} d
   * @return {?}
   */
  easeInOutCirc : function(b, t, x, dataAndEvents, d) {
    return(t /= d / 2) < 1 ? -dataAndEvents / 2 * (Math.sqrt(1 - t * t) - 1) + x : dataAndEvents / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + x;
  },
  /**
   * @param {?} t
   * @param {number} x
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  easeInElastic : function(t, x, b, c, d) {
    /** @type {number} */
    var s = 1.70158;
    /** @type {number} */
    var p = 0;
    /** @type {number} */
    var a = c;
    if (0 == x) {
      return b;
    }
    if (1 == (x /= d)) {
      return b + c;
    }
    if (!p) {
      /** @type {number} */
      p = 0.3 * d;
    }
    if (a < Math.abs(c)) {
      /** @type {number} */
      a = c;
      /** @type {number} */
      s = p / 4;
    } else {
      /** @type {number} */
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return-(a * Math.pow(2, 10 * (x -= 1)) * Math.sin(2 * (x * d - s) * Math.PI / p)) + b;
  },
  /**
   * @param {?} x
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  easeOutElastic : function(x, t, b, c, d) {
    /** @type {number} */
    var s = 1.70158;
    /** @type {number} */
    var p = 0;
    /** @type {number} */
    var a = c;
    if (0 == t) {
      return b;
    }
    if (1 == (t /= d)) {
      return b + c;
    }
    if (!p) {
      /** @type {number} */
      p = 0.3 * d;
    }
    if (a < Math.abs(c)) {
      /** @type {number} */
      a = c;
      /** @type {number} */
      s = p / 4;
    } else {
      /** @type {number} */
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return a * Math.pow(2, -10 * t) * Math.sin(2 * (t * d - s) * Math.PI / p) + c + b;
  },
  /**
   * @param {?} t
   * @param {number} time
   * @param {number} b
   * @param {number} c
   * @param {number} dur
   * @return {?}
   */
  easeInOutElastic : function(t, time, b, c, dur) {
    /** @type {number} */
    var s = 1.70158;
    /** @type {number} */
    var p = 0;
    /** @type {number} */
    var a = c;
    if (0 == time) {
      return b;
    }
    if (2 == (time /= dur / 2)) {
      return b + c;
    }
    if (!p) {
      /** @type {number} */
      p = 0.3 * dur * 1.5;
    }
    if (a < Math.abs(c)) {
      /** @type {number} */
      a = c;
      /** @type {number} */
      s = p / 4;
    } else {
      /** @type {number} */
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return 1 > time ? -0.5 * a * Math.pow(2, 10 * (time -= 1)) * Math.sin(2 * (time * dur - s) * Math.PI / p) + b : a * Math.pow(2, -10 * (time -= 1)) * Math.sin(2 * (time * dur - s) * Math.PI / p) * 0.5 + c + b;
  },
  /**
   * @param {?} b
   * @param {number} t
   * @param {number} x
   * @param {number} c
   * @param {number} d
   * @param {number} s
   * @return {?}
   */
  easeInBack : function(b, t, x, c, d, s) {
    if (void 0 == s) {
      /** @type {number} */
      s = 1.70158;
    }
    return c * (t /= d) * t * ((s + 1) * t - s) + x;
  },
  /**
   * @param {?} b
   * @param {number} t
   * @param {number} x
   * @param {number} d
   * @param {number} c
   * @param {number} s
   * @return {?}
   */
  easeOutBack : function(b, t, x, d, c, s) {
    if (void 0 == s) {
      /** @type {number} */
      s = 1.70158;
    }
    return d * ((t = t / c - 1) * t * ((s + 1) * t + s) + 1) + x;
  },
  /**
   * @param {?} b
   * @param {number} pos
   * @param {number} d
   * @param {number} x
   * @param {number} t
   * @param {number} s
   * @return {?}
   */
  easeInOutBack : function(b, pos, d, x, t, s) {
    if (void 0 == s) {
      /** @type {number} */
      s = 1.70158;
    }
    return(pos /= t / 2) < 1 ? x / 2 * pos * pos * (((s *= 1.525) + 1) * pos - s) + d : x / 2 * ((pos -= 2) * pos * (((s *= 1.525) + 1) * pos + s) + 2) + d;
  },
  /**
   * @param {?} x
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  easeInBounce : function(x, t, b, c, d) {
    return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
  },
  /**
   * @param {?} v00
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  easeOutBounce : function(v00, t, b, c, d) {
    return(t /= d) < 1 / 2.75 ? 7.5625 * c * t * t + b : 2 / 2.75 > t ? c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b : 2.5 / 2.75 > t ? c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b : c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
  },
  /**
   * @param {?} x
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  easeInOutBounce : function(x, t, b, c, d) {
    return d / 2 > t ? 0.5 * jQuery.easing.easeInBounce(x, 2 * t, 0, c, d) + b : 0.5 * jQuery.easing.easeOutBounce(x, 2 * t - d, 0, c, d) + 0.5 * c + b;
  }
});
!function() {
  /**
   * @param {?} options
   * @return {?}
   */
  jQuery.fn.pngFix = function(options) {
    options = jQuery.extend({
      blankgif : "blank.gif"
    }, options);
    /** @type {boolean} */
    var ie55 = "Microsoft Internet Explorer" == navigator.appName && (4 == parseInt(navigator.appVersion) && -1 != navigator.appVersion.indexOf("MSIE 5.5"));
    /** @type {boolean} */
    var ie6 = "Microsoft Internet Explorer" == navigator.appName && (4 == parseInt(navigator.appVersion) && -1 != navigator.appVersion.indexOf("MSIE 6.0"));
    if (jQuery.browser.msie && (ie55 || ie6)) {
      jQuery(this).find("img[src$='.png']").each(function() {
        jQuery(this).attr("width", jQuery(this).width());
        jQuery(this).attr("height", jQuery(this).height());
        /** @type {string} */
        var val = "";
        /** @type {string} */
        var strNewHTML = "";
        /** @type {string} */
        var s = jQuery(this).attr("id") ? 'id="' + jQuery(this).attr("id") + '" ' : "";
        /** @type {string} */
        var inner = jQuery(this).attr("class") ? 'class="' + jQuery(this).attr("class") + '" ' : "";
        /** @type {string} */
        var g = jQuery(this).attr("title") ? 'title="' + jQuery(this).attr("title") + '" ' : "";
        /** @type {string} */
        var b = jQuery(this).attr("alt") ? 'alt="' + jQuery(this).attr("alt") + '" ' : "";
        /** @type {string} */
        var nameSuffix = jQuery(this).attr("align") ? "float:" + jQuery(this).attr("align") + ";" : "";
        /** @type {string} */
        var failureMessage = jQuery(this).parent().attr("href") ? "cursor:hand;" : "";
        if (this.style.border) {
          val += "border:" + this.style.border + ";";
          /** @type {string} */
          this.style.border = "";
        }
        if (this.style.padding) {
          val += "padding:" + this.style.padding + ";";
          /** @type {string} */
          this.style.padding = "";
        }
        if (this.style.margin) {
          val += "margin:" + this.style.margin + ";";
          /** @type {string} */
          this.style.margin = "";
        }
        var imgStyle = this.style.cssText;
        strNewHTML += "<span " + s + inner + g + b;
        strNewHTML += 'style="position:relative;white-space:pre-line;display:inline-block;background:transparent;' + nameSuffix + failureMessage;
        strNewHTML += "width:" + jQuery(this).width() + "px;height:" + jQuery(this).height() + "px;";
        strNewHTML += "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + jQuery(this).attr("src") + "', sizingMethod='scale');";
        strNewHTML += imgStyle + '"></span>';
        if ("" != val) {
          /** @type {string} */
          strNewHTML = '<span style="position:relative;display:inline-block;' + val + failureMessage + "width:" + jQuery(this).width() + "px;height:" + jQuery(this).height() + 'px;">' + strNewHTML + "</span>";
        }
        jQuery(this).hide();
        jQuery(this).after(strNewHTML);
      });
      jQuery(this).find("*").each(function() {
        var bgIMG = jQuery(this).css("background-image");
        if (-1 != bgIMG.indexOf(".png")) {
          var e = bgIMG.split('url("')[1].split('")')[0];
          jQuery(this).css("background-image", "none");
          /** @type {string} */
          jQuery(this).get(0).runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + e + "',sizingMethod='scale')";
        }
      });
      jQuery(this).find("input[src$='.png']").each(function() {
        var htmlStartTag = jQuery(this).attr("src");
        /** @type {string} */
        jQuery(this).get(0).runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + htmlStartTag + "', sizingMethod='scale');";
        jQuery(this).attr("src", options.blankgif);
      });
    }
    return jQuery;
  };
}(jQuery);
var FlashDetect = new function() {
  var self = this;
  /** @type {boolean} */
  self.installed = false;
  /** @type {string} */
  self.raw = "";
  /** @type {number} */
  self.major = -1;
  /** @type {number} */
  self.minor = -1;
  /** @type {number} */
  self.revision = -1;
  /** @type {string} */
  self.revisionStr = "";
  /** @type {Array} */
  var codeSegments = [{
    name : "ShockwaveFlash.ShockwaveFlash.7",
    /**
     * @param {?} obj
     * @return {?}
     */
    version : function(obj) {
      return getActiveXVersion(obj);
    }
  }, {
    name : "ShockwaveFlash.ShockwaveFlash.6",
    /**
     * @param {?} obj
     * @return {?}
     */
    version : function(obj) {
      /** @type {string} */
      var version = "6,0,21";
      try {
        /** @type {string} */
        obj.AllowScriptAccess = "always";
        version = getActiveXVersion(obj);
      } catch (i) {
      }
      return version;
    }
  }, {
    name : "ShockwaveFlash.ShockwaveFlash",
    /**
     * @param {?} obj
     * @return {?}
     */
    version : function(obj) {
      return getActiveXVersion(obj);
    }
  }];
  /**
   * @param {?} activeXObj
   * @return {?}
   */
  var getActiveXVersion = function(activeXObj) {
    /** @type {number} */
    var version = -1;
    try {
      version = activeXObj.GetVariable("$version");
    } catch (i) {
    }
    return version;
  };
  /**
   * @param {?} name
   * @return {?}
   */
  var getActiveXObject = function(name) {
    /** @type {number} */
    var obj = -1;
    try {
      obj = new ActiveXObject(name);
    } catch (i) {
      obj = {
        activeXError : true
      };
    }
    return obj;
  };
  /**
   * @param {string} str
   * @return {?}
   */
  var parseActiveXVersion = function(str) {
    var versionArray = str.split(",");
    return{
      raw : str,
      major : parseInt(versionArray[0].split(" ")[1], 10),
      minor : parseInt(versionArray[1], 10),
      revision : parseInt(versionArray[2], 10),
      revisionStr : versionArray[2]
    };
  };
  /**
   * @param {Function} str
   * @return {?}
   */
  var parseStandardVersion = function(str) {
    var descParts = str.split(/ +/);
    var octalLiteral = descParts[2].split(/\./);
    var revisionStr = descParts[3];
    return{
      /** @type {Function} */
      raw : str,
      major : parseInt(octalLiteral[0], 10),
      minor : parseInt(octalLiteral[1], 10),
      revisionStr : revisionStr,
      revision : parseRevisionStrToInt(revisionStr)
    };
  };
  /**
   * @param {string} str
   * @return {?}
   */
  var parseRevisionStrToInt = function(str) {
    return parseInt(str.replace(/[a-zA-Z]/g, ""), 10) || self.revision;
  };
  /**
   * @param {?} version
   * @return {?}
   */
  self.majorAtLeast = function(version) {
    return self.major >= version;
  };
  /**
   * @param {?} version
   * @return {?}
   */
  self.minorAtLeast = function(version) {
    return self.minor >= version;
  };
  /**
   * @param {?} version
   * @return {?}
   */
  self.revisionAtLeast = function(version) {
    return self.revision >= version;
  };
  /**
   * @return {?}
   */
  self.versionAtLeast = function() {
    /** @type {Array} */
    var properties = [self.major, self.minor, self.revision];
    /** @type {number} */
    var k = Math.min(properties.length, arguments.length);
    /** @type {number} */
    i = 0;
    for (;k > i;i++) {
      if (properties[i] >= arguments[i]) {
        if (k > i + 1 && properties[i] == arguments[i]) {
          continue;
        }
        return true;
      }
      return false;
    }
  };
  self.FlashDetect = function() {
    if (navigator.plugins && navigator.plugins.length > 0) {
      /** @type {string} */
      var type = "application/x-shockwave-flash";
      /** @type {(MimeTypeArray|null)} */
      var mimeTypes = navigator.mimeTypes;
      if (mimeTypes && (mimeTypes[type] && (mimeTypes[type].enabledPlugin && mimeTypes[type].enabledPlugin.description))) {
        var version = mimeTypes[type].enabledPlugin.description;
        var versionObj = parseStandardVersion(version);
        self.raw = versionObj.raw;
        self.major = versionObj.major;
        self.minor = versionObj.minor;
        self.revisionStr = versionObj.revisionStr;
        self.revision = versionObj.revision;
        /** @type {boolean} */
        self.installed = true;
      }
    } else {
      if (-1 == navigator.appVersion.indexOf("Mac") && window.execScript) {
        /** @type {number} */
        version = -1;
        /** @type {number} */
        var i = 0;
        for (;i < codeSegments.length && -1 == version;i++) {
          var obj = getActiveXObject(codeSegments[i].name);
          if (!obj.activeXError) {
            /** @type {boolean} */
            self.installed = true;
            version = codeSegments[i].version(obj);
            if (-1 != version) {
              versionObj = parseActiveXVersion(version);
              self.raw = versionObj.raw;
              self.major = versionObj.major;
              self.minor = versionObj.minor;
              self.revision = versionObj.revision;
              self.revisionStr = versionObj.revisionStr;
            }
          }
        }
      }
    }
  }();
};
/** @type {string} */
FlashDetect.JS_RELEASE = "1.0.4";
$(document).ready(function() {
  if (!FlashDetect.versionAtLeast(9)) {
    $(".maps-frame").html("<a href='http://www.adobe.com/go/getflashplayer'><img src='/shared/images/get_flash_player.gif'></a>");
  }
});
var swfobject = function() {
  /**
   * @return {undefined}
   */
  function callDomLoadFunctions() {
    if (!isDomLoaded) {
      try {
        var tabPage = doc.getElementsByTagName("body")[0].appendChild(createElement("span"));
        tabPage.parentNode.removeChild(tabPage);
      } catch (e) {
        return;
      }
      /** @type {boolean} */
      isDomLoaded = true;
      /** @type {number} */
      var dl = domLoadFnArr.length;
      /** @type {number} */
      var i = 0;
      for (;dl > i;i++) {
        domLoadFnArr[i]();
      }
    }
  }
  /**
   * @param {Function} fn
   * @return {undefined}
   */
  function addDomLoadEvent(fn) {
    if (isDomLoaded) {
      fn();
    } else {
      /** @type {Function} */
      domLoadFnArr[domLoadFnArr.length] = fn;
    }
  }
  /**
   * @param {Function} fn
   * @return {undefined}
   */
  function addLoadEvent(fn) {
    if (typeof win.addEventListener != UNDEF) {
      win.addEventListener("load", fn, false);
    } else {
      if (typeof doc.addEventListener != UNDEF) {
        doc.addEventListener("load", fn, false);
      } else {
        if (typeof win.attachEvent != UNDEF) {
          addListener(win, "onload", fn);
        } else {
          if ("function" == typeof win.onload) {
            var fnOld = win.onload;
            /**
             * @return {undefined}
             */
            win.onload = function() {
              fnOld();
              fn();
            };
          } else {
            /** @type {Function} */
            win.onload = fn;
          }
        }
      }
    }
  }
  /**
   * @return {undefined}
   */
  function main() {
    if (F) {
      testPlayerVersion();
    } else {
      matchVersions();
    }
  }
  /**
   * @return {undefined}
   */
  function testPlayerVersion() {
    var head = doc.getElementsByTagName("body")[0];
    var o = createElement(OBJECT);
    o.setAttribute("type", FLASH_MIME_TYPE);
    var t = head.appendChild(o);
    if (t) {
      /** @type {number} */
      var n = 0;
      !function() {
        if (typeof t.GetVariable != UNDEF) {
          var d = t.GetVariable("$version");
          if (d) {
            d = d.split(" ")[1].split(",");
            /** @type {Array} */
            ua.pv = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
          }
        } else {
          if (10 > n) {
            n++;
            setTimeout(arguments.callee, 10);
            return;
          }
        }
        head.removeChild(o);
        /** @type {null} */
        t = null;
        matchVersions();
      }();
    } else {
      matchVersions();
    }
  }
  /**
   * @return {undefined}
   */
  function matchVersions() {
    /** @type {number} */
    var l = regObjArr.length;
    if (l > 0) {
      /** @type {number} */
      var i = 0;
      for (;l > i;i++) {
        var id = regObjArr[i].id;
        var cb = regObjArr[i].callbackFn;
        var cbObj = {
          success : false,
          id : id
        };
        if (ua.pv[0] > 0) {
          var obj = getElementById(id);
          if (obj) {
            if (!hasPlayerVersion(regObjArr[i].swfVersion) || ua.wk && ua.wk < 312) {
              if (regObjArr[i].expressInstall && canExpressInstall()) {
                var att = {};
                att.data = regObjArr[i].expressInstall;
                att.width = obj.getAttribute("width") || "0";
                att.height = obj.getAttribute("height") || "0";
                if (obj.getAttribute("class")) {
                  att.styleclass = obj.getAttribute("class");
                }
                if (obj.getAttribute("align")) {
                  att.align = obj.getAttribute("align");
                }
                var par = {};
                var p = obj.getElementsByTagName("param");
                var pl = p.length;
                /** @type {number} */
                var m = 0;
                for (;pl > m;m++) {
                  if ("movie" != p[m].getAttribute("name").toLowerCase()) {
                    par[p[m].getAttribute("name")] = p[m].getAttribute("value");
                  }
                }
                showExpressInstall(att, par, id, cb);
              } else {
                displayAltContent(obj);
                if (cb) {
                  cb(cbObj);
                }
              }
            } else {
              setVisibility(id, true);
              if (cb) {
                /** @type {boolean} */
                cbObj.success = true;
                cbObj.ref = getObjectById(id);
                cb(cbObj);
              }
            }
          }
        } else {
          setVisibility(id, true);
          if (cb) {
            var o = getObjectById(id);
            if (o && typeof o.SetVariable != UNDEF) {
              /** @type {boolean} */
              cbObj.success = true;
              cbObj.ref = o;
            }
            cb(cbObj);
          }
        }
      }
    }
  }
  /**
   * @param {string} objectIdStr
   * @return {?}
   */
  function getObjectById(objectIdStr) {
    /** @type {null} */
    var r = null;
    var o = getElementById(objectIdStr);
    if (o && "OBJECT" == o.nodeName) {
      if (typeof o.SetVariable != UNDEF) {
        r = o;
      } else {
        var tmp = o.getElementsByTagName(OBJECT)[0];
        if (tmp) {
          r = tmp;
        }
      }
    }
    return r;
  }
  /**
   * @return {?}
   */
  function canExpressInstall() {
    return!U && (hasPlayerVersion("6.0.65") && ((ua.win || ua.mac) && !(ua.wk && ua.wk < 312)));
  }
  /**
   * @param {Object} att
   * @param {?} par
   * @param {string} replaceElemIdStr
   * @param {(Element|string)} callbackFn
   * @return {undefined}
   */
  function showExpressInstall(att, par, replaceElemIdStr, callbackFn) {
    /** @type {boolean} */
    U = true;
    storedCallbackFn = callbackFn || null;
    storedCallbackObj = {
      success : false,
      id : replaceElemIdStr
    };
    var obj = getElementById(replaceElemIdStr);
    if (obj) {
      if ("OBJECT" == obj.nodeName) {
        storedAltContent = abstractAltContent(obj);
        /** @type {null} */
        storedAltContentId = null;
      } else {
        storedAltContent = obj;
        /** @type {string} */
        storedAltContentId = replaceElemIdStr;
      }
      /** @type {string} */
      att.id = EXPRESS_INSTALL_ID;
      if (typeof att.width == UNDEF || !/%$/.test(att.width) && parseInt(att.width, 10) < 310) {
        /** @type {string} */
        att.width = "310";
      }
      if (typeof att.height == UNDEF || !/%$/.test(att.height) && parseInt(att.height, 10) < 137) {
        /** @type {string} */
        att.height = "137";
      }
      /** @type {string} */
      doc.title = doc.title.slice(0, 47) + " - Flash Player Installation";
      /** @type {string} */
      var pt = ua.ie && ua.win ? "ActiveX" : "PlugIn";
      /** @type {string} */
      var fv = "MMredirectURL=" + win.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + pt + "&MMdoctitle=" + doc.title;
      if (typeof par.flashvars != UNDEF) {
        par.flashvars += "&" + fv;
      } else {
        /** @type {string} */
        par.flashvars = fv;
      }
      if (ua.ie && (ua.win && 4 != obj.readyState)) {
        var newObj = createElement("div");
        replaceElemIdStr += "SWFObjectNew";
        newObj.setAttribute("id", replaceElemIdStr);
        obj.parentNode.insertBefore(newObj, obj);
        /** @type {string} */
        obj.style.display = "none";
        !function() {
          if (4 == obj.readyState) {
            obj.parentNode.removeChild(obj);
          } else {
            setTimeout(arguments.callee, 10);
          }
        }();
      }
      createSWF(att, par, replaceElemIdStr);
    }
  }
  /**
   * @param {Object} obj
   * @return {undefined}
   */
  function displayAltContent(obj) {
    if (ua.ie && (ua.win && 4 != obj.readyState)) {
      var el = createElement("div");
      obj.parentNode.insertBefore(el, obj);
      el.parentNode.replaceChild(abstractAltContent(obj), el);
      /** @type {string} */
      obj.style.display = "none";
      !function() {
        if (4 == obj.readyState) {
          obj.parentNode.removeChild(obj);
        } else {
          setTimeout(arguments.callee, 10);
        }
      }();
    } else {
      obj.parentNode.replaceChild(abstractAltContent(obj), obj);
    }
  }
  /**
   * @param {Node} obj
   * @return {?}
   */
  function abstractAltContent(obj) {
    var ac = createElement("div");
    if (ua.win && ua.ie) {
      ac.innerHTML = obj.innerHTML;
    } else {
      var nestedObj = obj.getElementsByTagName(OBJECT)[0];
      if (nestedObj) {
        var c = nestedObj.childNodes;
        if (c) {
          var l = c.length;
          /** @type {number} */
          var i = 0;
          for (;l > i;i++) {
            if (!(1 == c[i].nodeType && "PARAM" == c[i].nodeName)) {
              if (!(8 == c[i].nodeType)) {
                ac.appendChild(c[i].cloneNode(true));
              }
            }
          }
        }
      }
    }
    return ac;
  }
  /**
   * @param {Object} attObj
   * @param {Object} parObj
   * @param {string} id
   * @return {?}
   */
  function createSWF(attObj, parObj, id) {
    var r;
    var el = getElementById(id);
    if (ua.wk && ua.wk < 312) {
      return r;
    }
    if (el) {
      if (typeof attObj.id == UNDEF) {
        /** @type {string} */
        attObj.id = id;
      }
      if (ua.ie && ua.win) {
        /** @type {string} */
        var optsData = "";
        var i;
        for (i in attObj) {
          if (attObj[i] != Object.prototype[i]) {
            if ("data" == i.toLowerCase()) {
              parObj.movie = attObj[i];
            } else {
              if ("styleclass" == i.toLowerCase()) {
                optsData += ' class="' + attObj[i] + '"';
              } else {
                if ("classid" != i.toLowerCase()) {
                  optsData += " " + i + '="' + attObj[i] + '"';
                }
              }
            }
          }
        }
        /** @type {string} */
        var urlConfigHtml = "";
        var j;
        for (j in parObj) {
          if (parObj[j] != Object.prototype[j]) {
            urlConfigHtml += '<param name="' + j + '" value="' + parObj[j] + '" />';
          }
        }
        /** @type {string} */
        el.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + optsData + ">" + urlConfigHtml + "</object>";
        objIdArr[objIdArr.length] = attObj.id;
        r = getElementById(attObj.id);
      } else {
        var o = createElement(OBJECT);
        o.setAttribute("type", FLASH_MIME_TYPE);
        var m;
        for (m in attObj) {
          if (attObj[m] != Object.prototype[m]) {
            if ("styleclass" == m.toLowerCase()) {
              o.setAttribute("class", attObj[m]);
            } else {
              if ("classid" != m.toLowerCase()) {
                o.setAttribute(m, attObj[m]);
              }
            }
          }
        }
        var n;
        for (n in parObj) {
          if (parObj[n] != Object.prototype[n]) {
            if ("movie" != n.toLowerCase()) {
              createObjParam(o, n, parObj[n]);
            }
          }
        }
        el.parentNode.replaceChild(o, el);
        r = o;
      }
    }
    return r;
  }
  /**
   * @param {Element} el
   * @param {string} pName
   * @param {?} pValue
   * @return {undefined}
   */
  function createObjParam(el, pName, pValue) {
    var p = createElement("param");
    p.setAttribute("name", pName);
    p.setAttribute("value", pValue);
    el.appendChild(p);
  }
  /**
   * @param {string} id
   * @return {undefined}
   */
  function removeSWF(id) {
    var el = getElementById(id);
    if (el && "OBJECT" == el.nodeName) {
      if (ua.ie && ua.win) {
        /** @type {string} */
        el.style.display = "none";
        !function() {
          if (4 == el.readyState) {
            removeObjectInIE(id);
          } else {
            setTimeout(arguments.callee, 10);
          }
        }();
      } else {
        el.parentNode.removeChild(el);
      }
    }
  }
  /**
   * @param {string} id
   * @return {undefined}
   */
  function removeObjectInIE(id) {
    var obj = getElementById(id);
    if (obj) {
      var prop;
      for (prop in obj) {
        if ("function" == typeof obj[prop]) {
          /** @type {null} */
          obj[prop] = null;
        }
      }
      obj.parentNode.removeChild(obj);
    }
  }
  /**
   * @param {string} id
   * @return {?}
   */
  function getElementById(id) {
    /** @type {null} */
    var el = null;
    try {
      /** @type {(HTMLElement|null)} */
      el = doc.getElementById(id);
    } catch (i) {
    }
    return el;
  }
  /**
   * @param {string} el
   * @return {?}
   */
  function createElement(el) {
    return doc.createElement(el);
  }
  /**
   * @param {Object} target
   * @param {string} eventType
   * @param {Function} fn
   * @return {undefined}
   */
  function addListener(target, eventType, fn) {
    target.attachEvent(eventType, fn);
    /** @type {Array} */
    listenersArr[listenersArr.length] = [target, eventType, fn];
  }
  /**
   * @param {string} rv
   * @return {?}
   */
  function hasPlayerVersion(rv) {
    var pv = ua.pv;
    var v = rv.split(".");
    /** @type {number} */
    v[0] = parseInt(v[0], 10);
    /** @type {number} */
    v[1] = parseInt(v[1], 10) || 0;
    /** @type {number} */
    v[2] = parseInt(v[2], 10) || 0;
    return pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1] || pv[0] == v[0] && (pv[1] == v[1] && pv[2] >= v[2])) ? true : false;
  }
  /**
   * @param {string} sel
   * @param {string} decl
   * @param {string} media
   * @param {?} deepDataAndEvents
   * @return {undefined}
   */
  function createCSS(sel, decl, media, deepDataAndEvents) {
    if (!ua.ie || !ua.mac) {
      var svg = doc.getElementsByTagName("head")[0];
      if (svg) {
        var m = media && "string" == typeof media ? media : "screen";
        if (deepDataAndEvents) {
          /** @type {null} */
          dynamicStylesheet = null;
          /** @type {null} */
          dynamicStylesheetMedia = null;
        }
        if (!dynamicStylesheet || dynamicStylesheetMedia != m) {
          var s = createElement("style");
          s.setAttribute("type", "text/css");
          s.setAttribute("media", m);
          dynamicStylesheet = svg.appendChild(s);
          if (ua.ie) {
            if (ua.win) {
              if (typeof doc.styleSheets != UNDEF) {
                if (doc.styleSheets.length > 0) {
                  dynamicStylesheet = doc.styleSheets[doc.styleSheets.length - 1];
                }
              }
            }
          }
          dynamicStylesheetMedia = m;
        }
        if (ua.ie && ua.win) {
          if (dynamicStylesheet) {
            if (typeof dynamicStylesheet.addRule == OBJECT) {
              dynamicStylesheet.addRule(sel, decl);
            }
          }
        } else {
          if (dynamicStylesheet) {
            if (typeof doc.createTextNode != UNDEF) {
              dynamicStylesheet.appendChild(doc.createTextNode(sel + " {" + decl + "}"));
            }
          }
        }
      }
    }
  }
  /**
   * @param {string} id
   * @param {boolean} recurring
   * @return {undefined}
   */
  function setVisibility(id, recurring) {
    if (q) {
      /** @type {string} */
      var v = recurring ? "visible" : "hidden";
      if (isDomLoaded && getElementById(id)) {
        /** @type {string} */
        getElementById(id).style.visibility = v;
      } else {
        createCSS("#" + id, "visibility:" + v);
      }
    }
  }
  /**
   * @param {?} s
   * @return {?}
   */
  function urlEncodeIfNecessary(s) {
    /** @type {RegExp} */
    var re = /[\\\"<>\.;]/;
    /** @type {boolean} */
    var hasBadChars = null != re.exec(s);
    return hasBadChars && typeof encodeURIComponent != UNDEF ? encodeURIComponent(s) : s;
  }
  var storedAltContent;
  var storedAltContentId;
  var storedCallbackFn;
  var storedCallbackObj;
  var dynamicStylesheet;
  var dynamicStylesheetMedia;
  /** @type {string} */
  var UNDEF = "undefined";
  /** @type {string} */
  var OBJECT = "object";
  /** @type {string} */
  var SHOCKWAVE_FLASH = "Shockwave Flash";
  /** @type {string} */
  var SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash";
  /** @type {string} */
  var FLASH_MIME_TYPE = "application/x-shockwave-flash";
  /** @type {string} */
  var EXPRESS_INSTALL_ID = "SWFObjectExprInst";
  /** @type {string} */
  var ON_READY_STATE_CHANGE = "onreadystatechange";
  /** @type {Window} */
  var win = window;
  /** @type {HTMLDocument} */
  var doc = document;
  /** @type {(Navigator|null)} */
  var nav = navigator;
  /** @type {boolean} */
  var F = false;
  /** @type {Array} */
  var domLoadFnArr = [main];
  /** @type {Array} */
  var regObjArr = [];
  /** @type {Array} */
  var objIdArr = [];
  /** @type {Array} */
  var listenersArr = [];
  /** @type {boolean} */
  var isDomLoaded = false;
  /** @type {boolean} */
  var U = false;
  /** @type {boolean} */
  var q = true;
  var ua = function() {
    /** @type {boolean} */
    var w3cdom = typeof doc.getElementById != UNDEF && (typeof doc.getElementsByTagName != UNDEF && typeof doc.createElement != UNDEF);
    /** @type {string} */
    var out = nav.userAgent.toLowerCase();
    /** @type {string} */
    var p = nav.platform.toLowerCase();
    /** @type {boolean} */
    var windows = p ? /win/.test(p) : /win/.test(out);
    /** @type {boolean} */
    var mac = p ? /mac/.test(p) : /mac/.test(out);
    /** @type {(boolean|number)} */
    var webkit = /webkit/.test(out) ? parseFloat(out.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false;
    /** @type {boolean} */
    var ie = false;
    /** @type {Array} */
    var playerVersion = [0, 0, 0];
    /** @type {null} */
    var d = null;
    if (typeof nav.plugins != UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] == OBJECT) {
      d = nav.plugins[SHOCKWAVE_FLASH].description;
      if (d && (typeof nav.mimeTypes == UNDEF || (!nav.mimeTypes[FLASH_MIME_TYPE] || nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin))) {
        /** @type {boolean} */
        F = true;
        /** @type {boolean} */
        ie = false;
        d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
        /** @type {number} */
        playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
        /** @type {number} */
        playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
        /** @type {number} */
        playerVersion[2] = /[a-zA-Z]/.test(d) ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
      }
    } else {
      if (typeof win.ActiveXObject != UNDEF) {
        try {
          var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
          if (a) {
            d = a.GetVariable("$version");
            if (d) {
              /** @type {boolean} */
              ie = true;
              d = d.split(" ")[1].split(",");
              /** @type {Array} */
              playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
            }
          }
        } catch (u) {
        }
      }
    }
    return{
      w3 : w3cdom,
      pv : playerVersion,
      wk : webkit,
      ie : ie,
      win : windows,
      mac : mac
    };
  }();
  !function() {
    if (ua.w3) {
      if (typeof doc.readyState != UNDEF && "complete" == doc.readyState || typeof doc.readyState == UNDEF && (doc.getElementsByTagName("body")[0] || doc.body)) {
        callDomLoadFunctions();
      }
      if (!isDomLoaded) {
        if (typeof doc.addEventListener != UNDEF) {
          doc.addEventListener("DOMContentLoaded", callDomLoadFunctions, false);
        }
        if (ua.ie && ua.win) {
          doc.attachEvent(ON_READY_STATE_CHANGE, function() {
            if ("complete" == doc.readyState) {
              doc.detachEvent(ON_READY_STATE_CHANGE, arguments.callee);
              callDomLoadFunctions();
            }
          });
          if (win == top) {
            !function() {
              if (!isDomLoaded) {
                try {
                  doc.documentElement.doScroll("left");
                } catch (e) {
                  setTimeout(arguments.callee, 0);
                  return;
                }
                callDomLoadFunctions();
              }
            }();
          }
        }
        if (ua.wk) {
          !function() {
            if (!isDomLoaded) {
              if (/loaded|complete/.test(doc.readyState)) {
                callDomLoadFunctions();
              } else {
                setTimeout(arguments.callee, 0);
              }
            }
          }();
        }
        addLoadEvent(callDomLoadFunctions);
      }
    }
  }();
  (function() {
    if (ua.ie) {
      if (ua.win) {
        window.attachEvent("onunload", function() {
          /** @type {number} */
          var ll = listenersArr.length;
          /** @type {number} */
          var i = 0;
          for (;ll > i;i++) {
            listenersArr[i][0].detachEvent(listenersArr[i][1], listenersArr[i][2]);
          }
          /** @type {number} */
          var spaces = objIdArr.length;
          /** @type {number} */
          var j = 0;
          for (;spaces > j;j++) {
            removeSWF(objIdArr[j]);
          }
          var k;
          for (k in ua) {
            /** @type {null} */
            ua[k] = null;
          }
          /** @type {null} */
          ua = null;
          var l;
          for (l in swfobject) {
            /** @type {null} */
            swfobject[l] = null;
          }
          /** @type {null} */
          swfobject = null;
        });
      }
    }
  })();
  return{
    /**
     * @param {string} objectIdStr
     * @param {boolean} swfVersionStr
     * @param {?} xiSwfUrlStr
     * @param {?} callbackFn
     * @return {undefined}
     */
    registerObject : function(objectIdStr, swfVersionStr, xiSwfUrlStr, callbackFn) {
      if (ua.w3 && (objectIdStr && swfVersionStr)) {
        var regObj = {};
        /** @type {string} */
        regObj.id = objectIdStr;
        /** @type {boolean} */
        regObj.swfVersion = swfVersionStr;
        regObj.expressInstall = xiSwfUrlStr;
        regObj.callbackFn = callbackFn;
        regObjArr[regObjArr.length] = regObj;
        setVisibility(objectIdStr, false);
      } else {
        if (callbackFn) {
          callbackFn({
            success : false,
            id : objectIdStr
          });
        }
      }
    },
    /**
     * @param {string} objectIdStr
     * @return {?}
     */
    getObjectById : function(objectIdStr) {
      return ua.w3 ? getObjectById(objectIdStr) : void 0;
    },
    /**
     * @param {Object} swfUrlStr
     * @param {string} replaceElemIdStr
     * @param {string} widthStr
     * @param {string} heightStr
     * @param {Function} swfVersionStr
     * @param {Object} xiSwfUrlStr
     * @param {Object} flashvarsObj
     * @param {Object} parObj
     * @param {Object} attObj
     * @param {(Element|string)} callbackFn
     * @return {undefined}
     */
    embedSWF : function(swfUrlStr, replaceElemIdStr, widthStr, heightStr, swfVersionStr, xiSwfUrlStr, flashvarsObj, parObj, attObj, callbackFn) {
      var callbackObj = {
        success : false,
        id : replaceElemIdStr
      };
      if (ua.w3 && (!(ua.wk && ua.wk < 312) && (swfUrlStr && (replaceElemIdStr && (widthStr && (heightStr && swfVersionStr)))))) {
        setVisibility(replaceElemIdStr, false);
        addDomLoadEvent(function() {
          widthStr += "";
          heightStr += "";
          var att = {};
          if (attObj && typeof attObj === OBJECT) {
            var i;
            for (i in attObj) {
              att[i] = attObj[i];
            }
          }
          /** @type {Object} */
          att.data = swfUrlStr;
          /** @type {string} */
          att.width = widthStr;
          /** @type {string} */
          att.height = heightStr;
          var par = {};
          if (parObj && typeof parObj === OBJECT) {
            var j;
            for (j in parObj) {
              par[j] = parObj[j];
            }
          }
          if (flashvarsObj && typeof flashvarsObj === OBJECT) {
            var k;
            for (k in flashvarsObj) {
              if (typeof par.flashvars != UNDEF) {
                par.flashvars += "&" + k + "=" + flashvarsObj[k];
              } else {
                par.flashvars = k + "=" + flashvarsObj[k];
              }
            }
          }
          if (hasPlayerVersion(swfVersionStr)) {
            var obj = createSWF(att, par, replaceElemIdStr);
            if (att.id == replaceElemIdStr) {
              setVisibility(replaceElemIdStr, true);
            }
            /** @type {boolean} */
            callbackObj.success = true;
            callbackObj.ref = obj;
          } else {
            if (xiSwfUrlStr && canExpressInstall()) {
              /** @type {Object} */
              att.data = xiSwfUrlStr;
              showExpressInstall(att, par, replaceElemIdStr, callbackFn);
              return;
            }
            setVisibility(replaceElemIdStr, true);
          }
          if (callbackFn) {
            callbackFn(callbackObj);
          }
        });
      } else {
        if (callbackFn) {
          callbackFn(callbackObj);
        }
      }
    },
    /**
     * @return {undefined}
     */
    switchOffAutoHideShow : function() {
      /** @type {boolean} */
      q = false;
    },
    ua : ua,
    /**
     * @return {?}
     */
    getFlashPlayerVersion : function() {
      return{
        major : ua.pv[0],
        minor : ua.pv[1],
        release : ua.pv[2]
      };
    },
    /** @type {function (string): ?} */
    hasFlashPlayerVersion : hasPlayerVersion,
    /**
     * @param {Object} attObj
     * @param {Object} parObj
     * @param {string} replaceElemIdStr
     * @return {?}
     */
    createSWF : function(attObj, parObj, replaceElemIdStr) {
      return ua.w3 ? createSWF(attObj, parObj, replaceElemIdStr) : void 0;
    },
    /**
     * @param {Object} att
     * @param {?} par
     * @param {string} replaceElemIdStr
     * @param {(Element|string)} callbackFn
     * @return {undefined}
     */
    showExpressInstall : function(att, par, replaceElemIdStr, callbackFn) {
      if (ua.w3) {
        if (canExpressInstall()) {
          showExpressInstall(att, par, replaceElemIdStr, callbackFn);
        }
      }
    },
    /**
     * @param {string} objElemIdStr
     * @return {undefined}
     */
    removeSWF : function(objElemIdStr) {
      if (ua.w3) {
        removeSWF(objElemIdStr);
      }
    },
    /**
     * @param {string} selStr
     * @param {string} declStr
     * @param {string} mediaStr
     * @param {?} deepDataAndEvents
     * @return {undefined}
     */
    createCSS : function(selStr, declStr, mediaStr, deepDataAndEvents) {
      if (ua.w3) {
        createCSS(selStr, declStr, mediaStr, deepDataAndEvents);
      }
    },
    /** @type {function (Function): undefined} */
    addDomLoadEvent : addDomLoadEvent,
    /** @type {function (Function): undefined} */
    addLoadEvent : addLoadEvent,
    /**
     * @param {string} param
     * @return {?}
     */
    getQueryParamValue : function(param) {
      /** @type {string} */
      var q = doc.location.search || doc.location.hash;
      if (q) {
        if (/\?/.test(q)) {
          /** @type {string} */
          q = q.split("?")[1];
        }
        if (null == param) {
          return urlEncodeIfNecessary(q);
        }
        /** @type {Array.<string>} */
        var parms = q.split("&");
        /** @type {number} */
        var i = 0;
        for (;i < parms.length;i++) {
          if (parms[i].substring(0, parms[i].indexOf("=")) == param) {
            return urlEncodeIfNecessary(parms[i].substring(parms[i].indexOf("=") + 1));
          }
        }
      }
      return "";
    },
    /**
     * @return {undefined}
     */
    expressInstallCallback : function() {
      if (U) {
        var obj = getElementById(EXPRESS_INSTALL_ID);
        if (obj && storedAltContent) {
          obj.parentNode.replaceChild(storedAltContent, obj);
          if (storedAltContentId) {
            setVisibility(storedAltContentId, true);
            if (ua.ie) {
              if (ua.win) {
                /** @type {string} */
                storedAltContent.style.display = "block";
              }
            }
          }
          if (storedCallbackFn) {
            storedCallbackFn(storedCallbackObj);
          }
        }
        /** @type {boolean} */
        U = false;
      }
    }
  };
}();
/** @type {string} */
MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_PATH_ = "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m";
/** @type {string} */
MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_EXTENSION_ = "png";
/**
 * @param {?} opt_attributes
 * @param {?} replacementHash
 * @return {?}
 */
MarkerClusterer.prototype.extend = function(opt_attributes, replacementHash) {
  return function(object) {
    for (property in object.prototype) {
      this.prototype[property] = object.prototype[property];
    }
    return this;
  }.apply(opt_attributes, [replacementHash]);
};
/**
 * @return {undefined}
 */
MarkerClusterer.prototype.onAdd = function() {
  this.setReady_(true);
};
/**
 * @return {undefined}
 */
MarkerClusterer.prototype.idle = function() {
};
/**
 * @return {undefined}
 */
MarkerClusterer.prototype.draw = function() {
};
/**
 * @return {undefined}
 */
MarkerClusterer.prototype.setupStyles_ = function() {
  var size;
  /** @type {number} */
  var i = 0;
  for (;size = this.sizes[i];i++) {
    this.styles_.push({
      url : this.imagePath_ + (i + 1) + "." + this.imageExtension_,
      height : size,
      width : size
    });
  }
};
/**
 * @param {Array} styles
 * @return {undefined}
 */
MarkerClusterer.prototype.setStyles = function(styles) {
  /** @type {Array} */
  this.styles_ = styles;
};
/**
 * @return {?}
 */
MarkerClusterer.prototype.getStyles = function() {
  return this.styles_;
};
/**
 * @return {?}
 */
MarkerClusterer.prototype.isZoomOnClick = function() {
  return this.zoomOnClick_;
};
/**
 * @return {?}
 */
MarkerClusterer.prototype.getMarkers = function() {
  return this.markers_;
};
/**
 * @return {?}
 */
MarkerClusterer.prototype.getTotalMarkers = function() {
  return this.markers_;
};
/**
 * @param {number} value
 * @return {undefined}
 */
MarkerClusterer.prototype.setMaxZoom = function(value) {
  /** @type {number} */
  this.maxZoom_ = value;
};
/**
 * @return {?}
 */
MarkerClusterer.prototype.getMaxZoom = function() {
  return this.maxZoom_ || this.map_.mapTypes[this.map_.getMapTypeId()].maxZoom;
};
/**
 * @param {Array} markers
 * @param {?} numStyles
 * @return {?}
 */
MarkerClusterer.prototype.calculator_ = function(markers, numStyles) {
  /** @type {number} */
  var index = 0;
  var count = markers.length;
  var dv = count;
  for (;0 !== dv;) {
    /** @type {number} */
    dv = parseInt(dv / 10, 10);
    index++;
  }
  /** @type {number} */
  index = Math.min(index, numStyles);
  return{
    text : count,
    index : index
  };
};
/**
 * @param {Function} calculator
 * @return {undefined}
 */
MarkerClusterer.prototype.setCalculator = function(calculator) {
  /** @type {Function} */
  this.calculator_ = calculator;
};
/**
 * @return {?}
 */
MarkerClusterer.prototype.getCalculator = function() {
  return this.calculator_;
};
/**
 * @param {Array} locations
 * @param {boolean} recurring
 * @return {undefined}
 */
MarkerClusterer.prototype.addMarkers = function(locations, recurring) {
  var marker;
  /** @type {number} */
  var i = 0;
  for (;marker = locations[i];i++) {
    this.pushMarkerTo_(marker);
  }
  if (!recurring) {
    this.redraw();
  }
};
/**
 * @param {Object} marker
 * @return {undefined}
 */
MarkerClusterer.prototype.pushMarkerTo_ = function(marker) {
  marker.setVisible(false);
  marker.setMap(null);
  /** @type {boolean} */
  marker.isAdded = false;
  if (marker["draggable"]) {
    var that = this;
    google.maps.event.addListener(marker, "dragend", function() {
      /** @type {boolean} */
      marker.isAdded = false;
      that.resetViewport();
      that.redraw();
    });
  }
  this.markers_.push(marker);
};
/**
 * @param {Error} marker
 * @param {boolean} dataAndEvents
 * @return {undefined}
 */
MarkerClusterer.prototype.addMarker = function(marker, dataAndEvents) {
  this.pushMarkerTo_(marker);
  if (!dataAndEvents) {
    this.redraw();
  }
};
/**
 * @param {Object} marker
 * @return {?}
 */
MarkerClusterer.prototype.removeMarker = function(marker) {
  /** @type {number} */
  var index = -1;
  if (this.markers_.indexOf) {
    index = this.markers_.indexOf(marker);
  } else {
    var m;
    /** @type {number} */
    var i = 0;
    for (;m = this.markers_[i];i++) {
      if (!(m != marker)) {
        /** @type {number} */
        index = i;
      }
    }
  }
  if (-1 == index) {
    return false;
  }
  this.markers_.splice(index, 1);
  marker.setVisible(false);
  marker.setMap(null);
  this.resetViewport();
  this.redraw();
  return true;
};
/**
 * @return {undefined}
 */
MarkerClusterer.prototype.fitMapToMarkers = function() {
  var marker;
  var markers = this.getMarkers();
  var bounds = new google.maps.LatLngBounds;
  /** @type {number} */
  var i = 0;
  for (;marker = markers[i];i++) {
    bounds.extend(marker.getPosition());
  }
  this.map_.fitBounds(bounds);
};
/**
 * @param {boolean} dataAndEvents
 * @return {undefined}
 */
MarkerClusterer.prototype.setReady_ = function(dataAndEvents) {
  if (!this.ready_) {
    /** @type {boolean} */
    this.ready_ = dataAndEvents;
    this.createClusters_();
  }
};
/**
 * @return {?}
 */
MarkerClusterer.prototype.getTotalClusters = function() {
  return this.clusters_.length;
};
/**
 * @return {?}
 */
MarkerClusterer.prototype.getMap = function() {
  return this.map_;
};
/**
 * @param {Function} recurring
 * @return {undefined}
 */
MarkerClusterer.prototype.setMap = function(recurring) {
  /** @type {Function} */
  this.map_ = recurring;
};
/**
 * @return {?}
 */
MarkerClusterer.prototype.getGridSize = function() {
  return this.gridSize_;
};
/**
 * @param {?} size
 * @return {undefined}
 */
MarkerClusterer.prototype.setGridSize = function(size) {
  this.gridSize_ = size;
};
/**
 * @param {?} bounds
 * @return {?}
 */
MarkerClusterer.prototype.getExtendedBounds = function(bounds) {
  var projection = this.getProjection();
  var tr = new google.maps.LatLng(bounds.getNorthEast().lat(), bounds.getNorthEast().lng());
  var bl = new google.maps.LatLng(bounds.getSouthWest().lat(), bounds.getSouthWest().lng());
  var trPix = projection.fromLatLngToDivPixel(tr);
  trPix.x += this.gridSize_;
  trPix.y -= this.gridSize_;
  var blPix = projection.fromLatLngToDivPixel(bl);
  blPix.x -= this.gridSize_;
  blPix.y += this.gridSize_;
  var attributes = projection.fromDivPixelToLatLng(trPix);
  var opt_attributes = projection.fromDivPixelToLatLng(blPix);
  bounds.extend(attributes);
  bounds.extend(opt_attributes);
  return bounds;
};
/**
 * @param {number} marker
 * @param {Object} bounds
 * @return {?}
 */
MarkerClusterer.prototype.isMarkerInBounds_ = function(marker, bounds) {
  return bounds.contains(marker.getPosition());
};
/**
 * @return {undefined}
 */
MarkerClusterer.prototype.clearMarkers = function() {
  this.resetViewport();
  /** @type {Array} */
  this.markers_ = [];
};
/**
 * @return {undefined}
 */
MarkerClusterer.prototype.resetViewport = function() {
  var cluster;
  /** @type {number} */
  var i = 0;
  for (;cluster = this.clusters_[i];i++) {
    cluster.remove();
  }
  var marker;
  /** @type {number} */
  i = 0;
  for (;marker = this.markers_[i];i++) {
    /** @type {boolean} */
    marker.isAdded = false;
    marker.setMap(null);
    marker.setVisible(false);
  }
  /** @type {Array} */
  this.clusters_ = [];
};
/**
 * @return {undefined}
 */
MarkerClusterer.prototype.redraw = function() {
  this.createClusters_();
};
/**
 * @return {undefined}
 */
MarkerClusterer.prototype.createClusters_ = function() {
  if (this.ready_) {
    var marker;
    var mapBounds = new google.maps.LatLngBounds(this.map_.getBounds().getSouthWest(), this.map_.getBounds().getNorthEast());
    var bounds = this.getExtendedBounds(mapBounds);
    /** @type {number} */
    var i = 0;
    for (;marker = this.markers_[i];i++) {
      /** @type {boolean} */
      var s = false;
      if (!marker.isAdded && this.isMarkerInBounds_(marker, bounds)) {
        var cluster;
        /** @type {number} */
        var j = 0;
        for (;cluster = this.clusters_[j];j++) {
          if (!s && (cluster.getCenter() && cluster.isMarkerInClusterBounds(marker))) {
            /** @type {boolean} */
            s = true;
            cluster.addMarker(marker);
            break;
          }
        }
        if (!s) {
          cluster = new Cluster(this);
          cluster.addMarker(marker);
          this.clusters_.push(cluster);
        }
      }
    }
  }
};
/**
 * @param {string} marker
 * @return {?}
 */
Cluster.prototype.isMarkerAlreadyAdded = function(marker) {
  if (this.markers_.indexOf) {
    return-1 != this.markers_.indexOf(marker);
  }
  var m;
  /** @type {number} */
  var i = 0;
  for (;m = this.markers_[i];i++) {
    if (m == marker) {
      return true;
    }
  }
  return false;
};
/**
 * @param {Object} marker
 * @return {?}
 */
Cluster.prototype.addMarker = function(marker) {
  if (this.isMarkerAlreadyAdded(marker)) {
    return false;
  }
  if (!this.center_) {
    this.center_ = marker.getPosition();
    this.calculateBounds_();
  }
  if (0 == this.markers_.length) {
    marker.setMap(this.map_);
    marker.setVisible(true);
  } else {
    if (1 == this.markers_.length) {
      this.markers_[0].setMap(null);
      this.markers_[0].setVisible(false);
    }
  }
  /** @type {boolean} */
  marker.isAdded = true;
  this.markers_.push(marker);
  this.updateIcon();
  return true;
};
/**
 * @return {?}
 */
Cluster.prototype.getMarkerClusterer = function() {
  return this.markerClusterer_;
};
/**
 * @return {?}
 */
Cluster.prototype.getBounds = function() {
  this.calculateBounds_();
  return this.bounds_;
};
/**
 * @return {undefined}
 */
Cluster.prototype.remove = function() {
  this.clusterIcon_.remove();
  delete this.markers_;
};
/**
 * @return {?}
 */
Cluster.prototype.getCenter = function() {
  return this.center_;
};
/**
 * @return {undefined}
 */
Cluster.prototype.calculateBounds_ = function() {
  var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
  this.bounds_ = this.markerClusterer_.getExtendedBounds(bounds);
};
/**
 * @param {number} marker
 * @return {?}
 */
Cluster.prototype.isMarkerInClusterBounds = function(marker) {
  return this.bounds_.contains(marker.getPosition());
};
/**
 * @return {?}
 */
Cluster.prototype.getMap = function() {
  return this.map_;
};
/**
 * @return {undefined}
 */
Cluster.prototype.updateIcon = function() {
  var a = this.map_.getZoom();
  var b = this.markerClusterer_.getMaxZoom();
  if (a > b) {
    var marker;
    /** @type {number} */
    var i = 0;
    for (;marker = this.markers_[i];i++) {
      marker.setMap(this.map_);
      marker.setVisible(true);
    }
  } else {
    if (this.markers_.length < 2) {
      this.clusterIcon_.hide();
    } else {
      var numStyles = this.markerClusterer_.getStyles().length;
      var sums = this.markerClusterer_.getCalculator()(this.markers_, numStyles);
      this.clusterIcon_.setCenter(this.center_);
      this.clusterIcon_.setSums(sums);
      this.clusterIcon_.show();
    }
  }
};
/**
 * @return {undefined}
 */
ClusterIcon.prototype.triggerClusterClick = function() {
  var markerClusterer = this.cluster_.getMarkerClusterer();
  if (markerClusterer.isZoomOnClick()) {
    this.map_.panTo(this.cluster_.getCenter());
    this.map_.setZoom(this.map_.getZoom() + 1);
  }
};
/**
 * @return {undefined}
 */
ClusterIcon.prototype.onAdd = function() {
  /** @type {Element} */
  this.div_ = document.createElement("DIV");
  /** @type {Element} */
  this.shadow_ = document.createElement("DIV");
  if (this.visible_) {
    var pos = this.getPosFromLatLng_(this.center_);
    var v = this.createCss(pos);
    this.div_.setAttribute("class", this.styles_[0].markerClass);
    this.div_.setAttribute("className", this.styles_[0].markerClass);
    /** @type {string} */
    this.div_.innerHTML = "x" + this.sums_.text;
    this.div_.style.cssText = v;
    this.shadow_.setAttribute("class", this.styles_[0].shadowClass);
    this.shadow_.setAttribute("className", this.styles_[0].shadowClass);
    this.shadow_.style.cssText = v;
  }
  var panes = this.getPanes();
  panes.overlayImage.appendChild(this.shadow_);
  panes.overlayImage.appendChild(this.div_);
  var that = this;
  google.maps.event.addDomListener(this.div_, "click", function() {
    that.triggerClusterClick();
  });
};
/**
 * @param {?} latlng
 * @return {?}
 */
ClusterIcon.prototype.getPosFromLatLng_ = function(latlng) {
  var pos = this.getProjection().fromLatLngToDivPixel(latlng);
  pos.x -= parseInt(this.width_ / 2, 10);
  pos.y -= parseInt(this.height_ / 2, 10);
  return pos;
};
/**
 * @return {undefined}
 */
ClusterIcon.prototype.draw = function() {
  if (this.visible_) {
    var pos = this.getPosFromLatLng_(this.center_);
    /** @type {string} */
    this.div_.style.top = pos.y + "px";
    /** @type {string} */
    this.div_.style.left = pos.x + "px";
  }
};
/**
 * @return {undefined}
 */
ClusterIcon.prototype.hide = function() {
  if (this.div_) {
    /** @type {string} */
    this.div_.style.display = "none";
  }
  if (this.shadow_) {
    /** @type {string} */
    this.shadow_.style.display = "none";
  }
  /** @type {boolean} */
  this.visible_ = false;
};
/**
 * @return {undefined}
 */
ClusterIcon.prototype.show = function() {
  if (this.div_) {
    var pos = this.getPosFromLatLng_(this.center_);
    this.div_.style.cssText = this.createCss(pos);
    /** @type {string} */
    this.div_.style.display = "";
    this.div_.setAttribute("class", this.styles_[0].markerClass);
    this.div_.setAttribute("className", this.styles_[0].markerClass);
  }
  if (this.shadow_) {
    pos = this.getPosFromLatLng_(this.center_);
    this.shadow_.style.cssText = this.createCss(pos);
    /** @type {string} */
    this.shadow_.style.display = "";
    this.shadow_.setAttribute("class", this.styles_[0].shadowClass);
    this.shadow_.setAttribute("className", this.styles_[0].shadowClass);
  }
  /** @type {boolean} */
  this.visible_ = true;
};
/**
 * @return {undefined}
 */
ClusterIcon.prototype.remove = function() {
  this.setMap(null);
};
/**
 * @return {undefined}
 */
ClusterIcon.prototype.onRemove = function() {
  if (this.div_ && this.div_.parentNode) {
    this.hide();
    this.div_.parentNode.removeChild(this.div_);
    /** @type {null} */
    this.div_ = null;
  }
};
/**
 * @param {Object} sums
 * @return {undefined}
 */
ClusterIcon.prototype.setSums = function(sums) {
  /** @type {Object} */
  this.sums_ = sums;
  this.text_ = sums.text;
  this.index_ = sums.index;
  if (this.div_) {
    this.div_.innerHTML = sums.text;
  }
  this.useStyle();
};
/**
 * @return {undefined}
 */
ClusterIcon.prototype.useStyle = function() {
  /** @type {number} */
  var index = Math.max(0, this.sums_.index - 1);
  /** @type {number} */
  index = Math.min(this.styles_.length - 1, index);
  var style = this.styles_[index];
  this.url_ = style.url;
  this.height_ = style.height;
  this.width_ = style.width;
  this.anchor = style.opt_anchor;
  this.textSize_ = style.opt_textSize;
};
/**
 * @param {Error} center
 * @return {undefined}
 */
ClusterIcon.prototype.setCenter = function(center) {
  /** @type {Error} */
  this.center_ = center;
};
/**
 * @param {?} pos
 * @return {?}
 */
ClusterIcon.prototype.createCss = function(pos) {
  /** @type {Array} */
  var tagNameArr = [];
  tagNameArr.push(" position:absolute; cursor:pointer; top:" + pos.y + "px; left:" + pos.x + "px;");
  return tagNameArr.join("");
};
/** @type {function (Function, Array, Object): undefined} */
window["MarkerClusterer"] = MarkerClusterer;
/** @type {function (Error, boolean): undefined} */
MarkerClusterer.prototype["addMarker"] = MarkerClusterer.prototype.addMarker;
/** @type {function (Array, boolean): undefined} */
MarkerClusterer.prototype["addMarkers"] = MarkerClusterer.prototype.addMarkers;
/** @type {function (): undefined} */
MarkerClusterer.prototype["clearMarkers"] = MarkerClusterer.prototype.clearMarkers;
/** @type {function (): ?} */
MarkerClusterer.prototype["getCalculator"] = MarkerClusterer.prototype.getCalculator;
/** @type {function (): ?} */
MarkerClusterer.prototype["getGridSize"] = MarkerClusterer.prototype.getGridSize;
/** @type {function (): ?} */
MarkerClusterer.prototype["getMap"] = MarkerClusterer.prototype.getMap;
/** @type {function (): ?} */
MarkerClusterer.prototype["getMarkers"] = MarkerClusterer.prototype.getMarkers;
/** @type {function (): ?} */
MarkerClusterer.prototype["getMaxZoom"] = MarkerClusterer.prototype.getMaxZoom;
/** @type {function (): ?} */
MarkerClusterer.prototype["getStyles"] = MarkerClusterer.prototype.getStyles;
/** @type {function (): ?} */
MarkerClusterer.prototype["getTotalClusters"] = MarkerClusterer.prototype.getTotalClusters;
/** @type {function (): ?} */
MarkerClusterer.prototype["getTotalMarkers"] = MarkerClusterer.prototype.getTotalMarkers;
/** @type {function (): undefined} */
MarkerClusterer.prototype["redraw"] = MarkerClusterer.prototype.redraw;
/** @type {function (Object): ?} */
MarkerClusterer.prototype["removeMarker"] = MarkerClusterer.prototype.removeMarker;
/** @type {function (): undefined} */
MarkerClusterer.prototype["resetViewport"] = MarkerClusterer.prototype.resetViewport;
/** @type {function (Function): undefined} */
MarkerClusterer.prototype["setCalculator"] = MarkerClusterer.prototype.setCalculator;
/** @type {function (?): undefined} */
MarkerClusterer.prototype["setGridSize"] = MarkerClusterer.prototype.setGridSize;
/** @type {function (): undefined} */
MarkerClusterer.prototype["onAdd"] = MarkerClusterer.prototype.onAdd;
/** @type {function (): undefined} */
MarkerClusterer.prototype["draw"] = MarkerClusterer.prototype.draw;
/** @type {function (): undefined} */
MarkerClusterer.prototype["idle"] = MarkerClusterer.prototype.idle;
/** @type {function (): undefined} */
ClusterIcon.prototype["onAdd"] = ClusterIcon.prototype.onAdd;
/** @type {function (): undefined} */
ClusterIcon.prototype["draw"] = ClusterIcon.prototype.draw;
/** @type {function (): undefined} */
ClusterIcon.prototype["onRemove"] = ClusterIcon.prototype.onRemove;
!function($) {
  /** @type {Array} */
  var row = [];
  /**
   * @param {Array} sources
   * @param {?} next
   * @return {undefined}
   */
  $.loadImages = function(sources, next) {
    if (!(sources instanceof Array)) {
      /** @type {Array} */
      sources = [sources];
    }
    var l = sources.length;
    /** @type {number} */
    var f = 0;
    var i = l;
    for (;i--;) {
      /** @type {Element} */
      var img = document.createElement("img");
      /**
       * @return {undefined}
       */
      img.onload = function() {
        f++;
        if (f >= l) {
          if ($.isFunction(next)) {
            next();
          }
        }
      };
      img.src = sources[i];
      row.push(img);
    }
  };
}(jQuery);
parseUri.options = {
  strictMode : false,
  key : ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
  q : {
    name : "queryKey",
    parser : /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser : {
    strict : /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose : /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};
lf = {};
lf.maps = {};
lf.maps.bing = {};
lf.maps.google = {};
lf.maps.leaflet = {};
lf.maps.mappy = {};
lf.maps.viamichelin = {};
lf.app = {};
gui = {};
/**
 * @return {undefined}
 */
Class = function() {
};
/**
 * @return {?}
 */
Class.getGlobalObject = function() {
  return function() {
    return this;
  }.call(null);
};
/**
 * @param {?} test
 * @param {Function} target
 * @return {undefined}
 */
Class.mixin = function(test, target) {
  if (target.__mixing) {
    target.__mixing(test);
  }
  var codeSegments = Class.instanceMethods(target.prototype);
  /** @type {number} */
  var i = 0;
  for (;i < codeSegments.length;i += 1) {
    test.prototype[codeSegments[i]] = target.prototype[codeSegments[i]];
  }
  if (target.__mixed) {
    target.__mixed(test);
  }
};
/**
 * @param {Object} descs
 * @return {?}
 */
Class.instanceVariables = function(descs) {
  /** @type {Array} */
  var props = [];
  var prop;
  for (prop in descs) {
    if (descs.hasOwnProperty(prop)) {
      if ("function" != typeof descs[prop]) {
        props.push(prop);
      }
    }
  }
  return props;
};
/**
 * @param {Object} object
 * @return {?}
 */
Class.instanceMethods = function(object) {
  /** @type {Array} */
  var sels = [];
  var directive = object.constructor === Function ? object : object.constructor.prototype;
  var sel;
  for (sel in directive) {
    if (directive.hasOwnProperty(sel)) {
      if ("function" == typeof directive[sel]) {
        sels.push(sel);
      }
    }
  }
  return sels;
};
/**
 * @param {Object} props
 * @return {?}
 */
Class.duplicate = function(props) {
  /** @type {(Array|{})} */
  var dup = props instanceof Array ? [] : {};
  var i;
  for (i in props) {
    dup[i] = props[i] && "object" == typeof props[i] ? Class.duplicate(props[i]) : props[i];
  }
  return dup;
};
/**
 * @param {string} path
 * @param {?} base
 * @return {?}
 */
Class.resolvePath = function(path, base) {
  base = base || Class.getGlobalObject();
  var codeSegments = path.split(".");
  var current = base;
  /** @type {number} */
  var i = 0;
  for (;i < codeSegments.length;i += 1) {
    current = current[codeSegments[i]];
    if ("undefined" == typeof current) {
      throw new Error("component '%s' in path '%s' is not defined".format(codeSegments[i], path));
    }
  }
  return current;
};
/**
 * @return {undefined}
 */
Delegatable = function() {
};
/**
 * @param {string} syncFnName
 * @param {Array} checkSet
 * @param {?} dataAndEvents
 * @return {?}
 */
Delegatable.prototype.callDelegateMethod = function(syncFnName, checkSet, dataAndEvents) {
  return this.delegate && this.delegate[syncFnName] ? this.delegate[syncFnName].apply(this.delegate, checkSet) : dataAndEvents;
};
gui.Backdrop = Base.extend({
  /**
   * @return {undefined}
   */
  constructor : function() {
    var $body = jQuery("body");
    this.__background = jQuery("<div/>").addClass("backdrop").hide().appendTo($body);
    this.__indicator = jQuery("<div/>").addClass("backdrop_indicator").hide().appendTo($body);
    this.__text = jQuery("<div/>").addClass("text").appendTo(this.__indicator);
    var __resize = this;
    jQuery(window).resize(function() {
      __resize.__resize();
    }).trigger("resize");
  },
  /**
   * @return {undefined}
   */
  __resize : function() {
    var containerHeight = jQuery(window).height();
    var docWinWidth = jQuery(window).width();
    var statusHeight = this.__indicator.outerHeight();
    var pickWinWidth = this.__indicator.outerWidth();
    /** @type {number} */
    var pickWinTop = containerHeight / 2 - statusHeight / 2;
    /** @type {number} */
    var pickWinLeft = docWinWidth / 2 - pickWinWidth / 2;
    /** @type {number} */
    var dropTop = containerHeight / 2 + 20;
    /** @type {number} */
    var leftSpace = docWinWidth / 2 - this.__text.width() / 2;
    this.__background.css({
      width : docWinWidth,
      height : containerHeight
    });
    this.__indicator.css({
      top : pickWinTop,
      left : pickWinLeft
    });
    this.__text.css({
      top : dropTop,
      left : leftSpace
    });
  },
  /**
   * @param {number} millis
   * @return {undefined}
   */
  __showWithIndicator : function(millis) {
    millis = millis ? millis : 0;
    this.__background.fadeIn(millis);
    this.__indicator.fadeIn(millis);
  },
  /**
   * @param {number} delay
   * @return {undefined}
   */
  __showWithoutIndicator : function(delay) {
    delay = delay ? delay : 0;
    this.__indicator.hide();
    this.__background.fadeIn(delay);
  },
  /**
   * @param {number} speed
   * @return {undefined}
   */
  hide : function(speed) {
    speed = speed ? speed : 0;
    this.__background.fadeOut(speed);
    this.__indicator.fadeOut(speed);
  },
  /**
   * @param {string} status
   * @param {?} $match
   * @return {undefined}
   */
  __setIndicator : function(status, $match) {
    this.__indicator.removeClass("loading failure success");
    this.__indicator.addClass(status);
    this.__text.html($match);
  },
  /**
   * @param {number} timestep
   * @return {undefined}
   */
  showWithoutIndicator : function(timestep) {
    this.__showWithoutIndicator(timestep);
  },
  /**
   * @param {number} millis
   * @return {undefined}
   */
  showLoadingIndicator : function(millis) {
    this.__setIndicator("loading", I18n.translate("bridge.index.loading"));
    this.__showWithIndicator(millis);
    this.__resize();
  },
  /**
   * @param {?} $match
   * @param {number} millis
   * @return {undefined}
   */
  showFailureIndicator : function($match, millis) {
    this.__setIndicator("failure", $match);
    this.__showWithIndicator(millis);
    this.__resize();
  },
  /**
   * @param {?} $match
   * @param {number} millis
   * @return {undefined}
   */
  showSuccessIndicator : function($match, millis) {
    this.__setIndicator("success", $match);
    this.__showWithIndicator(millis);
    this.__resize();
  }
}, {
  /**
   * @return {?}
   */
  sharedInstance : function() {
    if (!gui.Backdrop.__sharedInstance) {
      gui.Backdrop.__sharedInstance = new gui.Backdrop;
    }
    return gui.Backdrop.__sharedInstance;
  }
});
/**
 * @return {?}
 */
lf.app.uniqueId = function() {
  /** @type {string} */
  var id = "__lfid_" + lf.app.uniqueId.__next;
  lf.app.uniqueId.__next += 1;
  return id;
};
/** @type {number} */
lf.app.uniqueId.__next = 0;
/**
 * @return {?}
 */
lf.app.getApiModule = function() {
  var frame = jQuery("script#lf_mapping_api");
  var sel = frame.data().lfApiModule;
  var memory = frame.data().lfConfiguration;
  /** @type {Array} */
  var selection = ["tomtom", "yandex", "baidu"];
  if (-1 !== jQuery.inArray(sel, selection)) {
    /** @type {string} */
    sel = "leaflet";
  }
  if (!sel) {
    switch(parseUri(frame.attr("src")).host) {
      case "ecn.dev.virtualearth.net":
        /** @type {string} */
        sel = "bing";
        break;
      case "secure-apijs.viamichelin.com":
        /** @type {string} */
        sel = "viamichelin";
        break;
      default:
        /** @type {string} */
        sel = "google";
    }
  }
  var config = lf.maps[sel];
  if (config.initialize) {
    config.initialize(memory);
  }
  return config;
};
lf.maps.Bounds = Base.extend({
  /**
   * @param {Object} args
   * @param {Object} center
   * @return {undefined}
   */
  constructor : function(args, center) {
    this.ne = {
      lat : center.lat,
      lng : center.lng
    };
    this.sw = {
      lat : args.lat,
      lng : args.lng
    };
  },
  /**
   * @param {Object} ne
   * @return {?}
   */
  contains : function(ne) {
    /** @type {boolean} */
    var a = this.sw.lat <= ne.lat && ne.lat <= this.ne.lat;
    /** @type {boolean} */
    var b = this.sw.lng <= ne.lng && ne.lng <= this.ne.lng;
    return a && b;
  },
  /**
   * @param {?} opt_attributes
   * @return {undefined}
   */
  extend : function(opt_attributes) {
    if (opt_attributes.lat > this.ne.lat) {
      this.ne.lat = opt_attributes.lat;
    }
    if (opt_attributes.lat < this.sw.lat) {
      this.sw.lat = opt_attributes.lat;
    }
    if (opt_attributes.lng > this.ne.lng) {
      this.ne.lng = opt_attributes.lng;
    }
    if (opt_attributes.lng < this.sw.lng) {
      this.sw.lng = opt_attributes.lng;
    }
  },
  /**
   * @return {?}
   */
  getCenterPoint : function() {
    /** @type {number} */
    var newRes = this.ne.lat - this.sw.lat;
    /** @type {number} */
    var factor = this.ne.lng - this.sw.lng;
    var lat = this.sw.lat + 0.5 * newRes;
    var lng = this.sw.lng + 0.5 * factor;
    return{
      lat : lat,
      lng : lng
    };
  },
  /**
   * @return {?}
   */
  getNorthWest : function() {
    return{
      lat : this.ne.lat,
      lng : this.sw.lng
    };
  },
  /**
   * @return {?}
   */
  getSouthEast : function() {
    return{
      lat : this.sw.lat,
      lng : this.ne.lng
    };
  },
  /**
   * @return {?}
   */
  getVisualizationUrl : function() {
    /** @type {string} */
    var t = [this.ne.lat, this.ne.lng].join(",");
    /** @type {string} */
    var e = [this.sw.lat, this.sw.lng].join(",");
    return "https://maps.google.com/maps/api/staticmap?zoom=4&size=512x512&maptype=roadmap&markers=color:blue|label:N|" + t + "&markers=color:green|label:S|" + e + "&sensor=false";
  }
});
lf.maps.Cluster = Base.extend({
  /**
   * @param {?} config
   * @return {undefined}
   */
  constructor : function(config) {
    this.markerClusterer = config;
    this.map = this.markerClusterer.getMap();
    /** @type {null} */
    this.center = null;
    /** @type {Array} */
    this.markers = [];
    /** @type {null} */
    this.bounds = null;
    this.clusterIcon = new (config.getClusterIconClass())({
      lat : 0,
      lng : 0
    });
    var vars = this;
    this.clusterIcon.bind("click", function() {
      vars.map.fitBounds(vars.getMarkerBounds());
    });
  },
  /**
   * @param {Object} marker
   * @return {?}
   */
  addMarker : function(marker) {
    if (this.isMarkerAlreadyAdded(marker)) {
      return false;
    }
    if (!this.center) {
      this.center = marker.getPosition();
      this.calculateBounds();
    }
    if (0 === this.markers.length) {
      marker.setMap(this.map);
      marker.setVisible(true);
    } else {
      this.markers[0].setMap(null);
      this.markers[0].setVisible(false);
    }
    /** @type {boolean} */
    marker.isAdded = true;
    this.markers.push(marker);
    this.updateIcon();
    return true;
  },
  /**
   * @return {?}
   */
  getCenter : function() {
    return this.center;
  },
  /**
   * @return {?}
   */
  getMarkerBounds : function() {
    if (0 === this.markers.length) {
      return new lf.maps.Bounds({
        lat : 0,
        lng : 0
      }, {
        lat : 0,
        lng : 0
      });
    }
    var value = this.markers[0].getPosition();
    var node = new lf.maps.Bounds(value, value);
    /** @type {number} */
    var i = 0;
    for (;i < this.markers.length;i += 1) {
      node.extend(this.markers[i].getPosition());
    }
    return node;
  },
  /**
   * @param {Object} marker
   * @return {?}
   */
  isMarkerAlreadyAdded : function(marker) {
    if (this.markers.indexOf) {
      return-1 !== this.markers.indexOf(marker);
    }
    /** @type {number} */
    var i = 0;
    for (;i < this.markers.length;i += 1) {
      if (this.markers[i] === marker) {
        return true;
      }
    }
    return false;
  },
  /**
   * @param {number} marker
   * @return {?}
   */
  isMarkerInClusterBounds : function(marker) {
    return this.bounds.contains(marker.getPosition());
  },
  /**
   * @return {undefined}
   */
  remove : function() {
    if (this.clusterIcon) {
      this.clusterIcon.setMap(null);
    }
    delete this.markers;
  },
  /**
   * @param {boolean} recurring
   * @return {undefined}
   */
  setPositioningMarkerVisible : function(recurring) {
    /** @type {number} */
    var i = 0;
    for (;i < this.markers.length;i += 1) {
      this.markers[i].setPositioningMarkerVisible(recurring);
    }
    if (this.clusterIcon) {
      this.clusterIcon.setPositioningMarkerVisible(recurring);
    }
  },
  /**
   * @return {undefined}
   */
  calculateBounds : function() {
    var bounds = new lf.maps.Bounds(this.center, this.center);
    this.bounds = this.markerClusterer.getExtendedBounds(bounds);
  },
  /**
   * @return {undefined}
   */
  updateIcon : function() {
    var a = this.map.getZoom();
    var b = this.markerClusterer.getMaxZoom();
    if (a > b) {
      /** @type {number} */
      var i = 0;
      for (;i < this.markers.length;i += 1) {
        this.markers[i].setMap(this.map);
        this.markers[i].setVisible(true);
      }
    } else {
      if (this.markers.length < 2) {
        this.clusterIcon.setVisible(false);
        this.clusterIcon.setMap(null);
      } else {
        this.clusterIcon.setPosition(this.center);
        this.clusterIcon.setLabel(this.markers.length);
        this.clusterIcon.setVisible(true);
        this.clusterIcon.setMap(this.map);
      }
    }
  }
});
lf.maps.MarkerClusterer = Base.extend({
  /**
   * @param {?} map
   * @param {?} config
   * @return {undefined}
   */
  constructor : function(map, config) {
    this.map = map;
    /** @type {Array} */
    this.markers = [];
    /** @type {Array} */
    this.clusters = [];
    /** @type {number} */
    this.gridSize = 60;
    /** @type {null} */
    this.maxZoom = null;
    /** @type {boolean} */
    this.ready = false;
    this.prevZoom = this.map.getZoom();
    this.clusterIconClass = config;
    this.bindEvents();
  },
  /**
   * @param {Array} locations
   * @param {boolean} recurring
   * @return {undefined}
   */
  addMarkers : function(locations, recurring) {
    /** @type {number} */
    var i = 0;
    for (;i < locations.length;i += 1) {
      this.addMarker(locations[i]);
    }
    if (!recurring) {
      this.redraw();
    }
  },
  /**
   * @param {Error} marker
   * @param {boolean} dataAndEvents
   * @return {undefined}
   */
  addMarker : function(marker, dataAndEvents) {
    this.pushMarker(marker);
    if (!dataAndEvents) {
      this.redraw();
    }
  },
  /**
   * @return {undefined}
   */
  clearMarkers : function() {
    this.resetViewport();
    /** @type {Array} */
    this.markers = [];
  },
  /**
   * @return {?}
   */
  getClusterIconClass : function() {
    return this.clusterIconClass;
  },
  /**
   * @param {?} bounds
   * @return {?}
   */
  getExtendedBounds : function(bounds) {
    var latlng = {
      lat : bounds.ne.lat,
      lng : bounds.ne.lng
    };
    var center = {
      lat : bounds.sw.lat,
      lng : bounds.sw.lng
    };
    var x1 = this.map.getPixelForLatLng(latlng);
    x1.x += this.gridSize;
    x1.y -= this.gridSize;
    var x = this.map.getPixelForLatLng(center);
    x.x -= this.gridSize;
    x.y += this.gridSize;
    var p1 = this.map.getLatLngForPixel(x1);
    var a = this.map.getLatLngForPixel(x);
    return new lf.maps.Bounds(a, p1);
  },
  /**
   * @return {?}
   */
  getGridSize : function() {
    return this.gridSize;
  },
  /**
   * @return {?}
   */
  getMap : function() {
    return this.map;
  },
  /**
   * @return {?}
   */
  getMarkers : function() {
    return this.markers;
  },
  /**
   * @return {?}
   */
  getMarkerBounds : function() {
    if (0 === this.markers.length) {
      return new lf.maps.Bounds({
        lat : 0,
        lng : 0
      }, {
        lat : 0,
        lng : 0
      });
    }
    var value = this.markers[0].getPosition();
    var node = new lf.maps.Bounds(value, value);
    /** @type {number} */
    var i = 1;
    for (;i < this.markers.length;i += 1) {
      node.extend(this.markers[i].getPosition());
    }
    return node;
  },
  /**
   * @return {?}
   */
  getClusterBounds : function() {
    if (0 === this.clusters.length) {
      return new lf.maps.Bounds({
        lat : 0,
        lng : 0
      }, {
        lat : 0,
        lng : 0
      });
    }
    var rect = this.clusters[0];
    var queue = new lf.maps.Bounds(rect.bounds.sw, rect.bounds.ne);
    /** @type {number} */
    var i = 1;
    for (;i < this.clusters.length;i += 1) {
      queue.extend(this.clusters[i].bounds.sw);
      queue.extend(this.clusters[i].bounds.ne);
    }
    return queue;
  },
  /**
   * @return {?}
   */
  getMaxZoom : function() {
    return "number" == typeof this.maxZoom ? this.maxZoom : this.map.getMaxZoom();
  },
  /**
   * @return {?}
   */
  getTotalClusters : function() {
    return this.clusters.length;
  },
  /**
   * @return {?}
   */
  getTotalMarkers : function() {
    return this.markers;
  },
  /**
   * @return {undefined}
   */
  redraw : function() {
    this.createClusters();
  },
  /**
   * @return {undefined}
   */
  resetViewport : function() {
    var i;
    /** @type {number} */
    i = 0;
    for (;i < this.clusters.length;i += 1) {
      this.clusters[i].remove();
    }
    /** @type {number} */
    i = 0;
    for (;i < this.markers.length;i += 1) {
      /** @type {boolean} */
      this.markers[i].isAdded = false;
      this.markers[i].setMap(null);
      this.markers[i].setVisible(false);
    }
    /** @type {Array} */
    this.clusters = [];
  },
  /**
   * @param {Blob} gridSize
   * @return {undefined}
   */
  setGridSize : function(gridSize) {
    /** @type {Blob} */
    this.gridSize = gridSize;
  },
  /**
   * @param {Function} recurring
   * @return {undefined}
   */
  setMap : function(recurring) {
    /** @type {Function} */
    this.map = recurring;
  },
  /**
   * @param {number} value
   * @return {undefined}
   */
  setMaxZoom : function(value) {
    /** @type {number} */
    this.maxZoom = value;
  },
  /**
   * @param {boolean} recurring
   * @return {undefined}
   */
  setPositioningMarkerVisible : function(recurring) {
    /** @type {number} */
    var i = 0;
    for (;i < this.clusters.length;i += 1) {
      this.clusters[i].setPositioningMarkerVisible(recurring);
    }
  },
  /**
   * @return {undefined}
   */
  bindEvents : function() {
    var that = this;
    this.map.bind("zoom_changed", function() {
      var b = that.map.getMaxZoom();
      var a = that.map.getZoom();
      if (!(0 > a || a > b) && that.prevZoom !== a) {
        that.prevZoom = that.map.getZoom();
        that.resetViewport();
      }
    });
    this.map.bind("bounds_changed", function() {
      that.redraw();
    });
    this.map.bind("tilesloaded", function() {
      if (!that.ready) {
        /** @type {boolean} */
        that.ready = true;
        that.createClusters();
      }
    });
  },
  /**
   * @return {undefined}
   */
  createClusters : function() {
    if (this.ready) {
      var bounds = this.getExtendedBounds(this.map.getViewportBounds());
      /** @type {boolean} */
      this.hasPlottedMarkers = false;
      /** @type {number} */
      var i = 0;
      for (;i < this.markers.length;i += 1) {
        var marker = this.markers[i];
        if (!marker.isAdded && bounds.contains(marker.getPosition())) {
          this.insertMarkerIntoClusters(marker);
          /** @type {boolean} */
          this.hasPlottedMarkers = true;
        }
      }
    }
  },
  /**
   * @param {undefined} marker
   * @return {?}
   */
  insertMarkerIntoClusters : function(marker) {
    /** @type {number} */
    var i = 0;
    for (;i < this.clusters.length;i += 1) {
      var map = this.clusters[i];
      if (map.getCenter() && map.isMarkerInClusterBounds(marker)) {
        map.addMarker(marker);
        return map;
      }
    }
    var cluster = new lf.maps.Cluster(this);
    cluster.addMarker(marker);
    this.clusters.push(cluster);
    return cluster;
  },
  /**
   * @param {Object} marker
   * @return {undefined}
   */
  pushMarker : function(marker) {
    marker.setVisible(false);
    marker.setMap(null);
    /** @type {boolean} */
    marker.isAdded = false;
    this.markers.push(marker);
  }
});
lf.maps.bing.Map = Base.extend({
  /**
   * @param {?} root
   * @param {?} config
   * @return {undefined}
   */
  constructor : function(root, config) {
    this.root = jQuery(root);
    this.root.append('<div class="map-container" style="position:absolute;"></div>');
    this.container = jQuery(".map-container", this.root);
    this.container.width(this.root.innerWidth());
    this.container.height(this.root.innerHeight());
    /** @type {boolean} */
    this.loaded = false;
    this.loadedCallback = config;
    this.callbacks = {};
    /** @type {null} */
    var credentials = null;
    credentials = "undefined" != typeof lf_mapping_config ? lf_mapping_config.credentials : lf_bing_settings.credentials;
    this.map = new Microsoft.Maps.Map(this.container.get(0), {
      animate : false,
      credentials : credentials,
      mapTypeId : Microsoft.Maps.MapTypeId.road,
      zoom : 13,
      enableClickableLogo : false,
      enableSearchLogo : false
    });
    Microsoft.Maps.Events.addHandler(this.map, "tiledownloadcomplete", jQuery.proxy(this.tilesLoaded, this));
    Microsoft.Maps.Events.addHandler(this.map, "viewchangeend", jQuery.proxy(this.zoomLevelChanged, this));
    /** @type {boolean} */
    this.loaded = true;
    this.loadedCallback(this);
  },
  /**
   * @param {?} bounds
   * @param {number} outstandingDataSize
   * @param {number} opt_attributes
   * @return {undefined}
   */
  fitBounds : function(bounds, outstandingDataSize, opt_attributes) {
    var l1 = bounds.getNorthWest();
    var vertex2 = bounds.getSouthEast();
    var defaultBounds = Microsoft.Maps.LocationRect.fromCorners(new Microsoft.Maps.Location(l1.lat, l1.lng), new Microsoft.Maps.Location(vertex2.lat, vertex2.lng));
    this.map.setView({
      animate : false,
      bounds : defaultBounds,
      padding : opt_attributes
    });
    this.center = bounds.getCenterPoint();
    this.centerPointChanged();
    this.zoomLevelChanged();
  },
  /**
   * @return {undefined}
   */
  redraw : function() {
    this.container.width(this.root.innerWidth());
    this.container.height(this.root.innerHeight());
  },
  /**
   * @return {?}
   */
  getCenter : function() {
    return this.center;
  },
  /**
   * @return {?}
   */
  getZoom : function() {
    return this.map.getZoom();
  },
  /**
   * @return {?}
   */
  getMaxZoom : function() {
    return this.map.getZoomRange.max;
  },
  /**
   * @return {?}
   */
  getPointOfSaleZoomLevel : function() {
    return 13;
  },
  /**
   * @return {?}
   */
  getMaxZIndex : function() {
    return 1E6;
  },
  /**
   * @param {Object} latlng
   * @return {?}
   */
  getPixelForLatLng : function(latlng) {
    var newCenter = new Microsoft.Maps.Location(latlng.lat, latlng.lng);
    var center = this.map.tryLocationToPixel(newCenter);
    return{
      x : center.x,
      y : center.y
    };
  },
  /**
   * @param {?} name
   * @return {?}
   */
  getLatLngForPixel : function(name) {
    var loc = this.map.tryPixelToLocation(name);
    var latlng = {
      lat : loc.latitude,
      lng : loc.longitude
    };
    return latlng;
  },
  /**
   * @return {?}
   */
  getViewportBounds : function() {
    var getWest = this.map.getBounds();
    var position = {
      lng : getWest.getWest(),
      lat : getWest.getSouth()
    };
    var minY = {
      lng : getWest.getEast(),
      lat : getWest.getNorth()
    };
    return new lf.maps.Bounds(position, minY);
  },
  /**
   * @param {Object} center
   * @return {undefined}
   */
  setCenter : function(center) {
    /** @type {Object} */
    this.center = center;
    var map_center = new Microsoft.Maps.Location(center.lat, center.lng);
    this.map.setView({
      animate : false,
      center : map_center
    });
    this.centerPointChanged();
  },
  /**
   * @param {number} zoom
   * @return {undefined}
   */
  setZoom : function(zoom) {
    this.map.setView({
      animate : false,
      zoom : zoom
    });
  },
  /**
   * @param {string} event
   * @param {Function} fn
   * @return {?}
   */
  bind : function(event, fn) {
    if ("undefined" == typeof this.callbacks[event]) {
      /** @type {Array} */
      this.callbacks[event] = [];
    }
    var expected = {
      id : lf.app.uniqueId(),
      event : event,
      /** @type {Function} */
      fn : fn
    };
    this.callbacks[event].push(expected);
    return expected;
  },
  /**
   * @param {Object} listener
   * @return {undefined}
   */
  unbind : function(listener) {
    var ary = this.callbacks[listener.event];
    /** @type {number} */
    var i = 0;
    for (;i < ary.length;i += 1) {
      var member = ary[i];
      if (member.id === listener.id) {
        ary.splice(i, 1);
        break;
      }
    }
  },
  /**
   * @return {undefined}
   */
  centerPointChanged : function() {
    this.notifyCallbacksForEvent("bounds_changed");
  },
  /**
   * @return {undefined}
   */
  zoomLevelChanged : function() {
    this.notifyCallbacksForEvent("zoom_changed");
    this.notifyCallbacksForEvent("bounds_changed");
  },
  /**
   * @return {undefined}
   */
  mapLoaded : function() {
    if (this.loadedCallback) {
      this.loadedCallback.call(null, this);
    }
    this.tilesLoaded();
  },
  /**
   * @return {undefined}
   */
  tilesLoaded : function() {
    this.notifyCallbacksForEvent("tilesloaded");
  },
  /**
   * @param {string} event
   * @return {undefined}
   */
  notifyCallbacksForEvent : function(event) {
    var callbacks = this.callbacks[event];
    if (callbacks) {
      /** @type {number} */
      var i = 0;
      for (;i < callbacks.length;i += 1) {
        callbacks[i].fn();
      }
    }
  }
});
lf.maps.bing.FrontOfficeMarker = Base.extend({
  /**
   * @param {Object} pos
   * @return {undefined}
   */
  constructor : function(pos) {
    this.callbacks = {};
    this.setPosition(pos);
    this.build();
  },
  /**
   * @param {number} z
   * @return {undefined}
   */
  setZIndex : function(z) {
    this.marker.setOptions({
      zIndex : z
    });
  },
  /**
   * @return {?}
   */
  getZIndex : function() {
    return this.marker.getZIndex();
  },
  /**
   * @param {string} keepData
   * @return {undefined}
   */
  showText : function(keepData) {
    if (!this.popup) {
      this.popup = new Microsoft.Maps.Infobox(this.latlng, {
        visible : false,
        offset : new Microsoft.Maps.Point(0, 20)
      });
      this.map.map.entities.push(this.popup);
    }
    /** @type {string} */
    var groupDescription = '<div class="lf_mapbubble_text">' + keepData + "</div>";
    this.popup.setOptions({
      description : groupDescription,
      visible : true,
      offset : this.getMarkerSettings().infoboxOffset,
      zIndex : this.getZIndex() + 1
    });
    var popup = this;
    /**
     * @return {undefined}
     */
    var init = function() {
      var ix = jQuery(".lf_mapbubble_text").innerHeight();
      var self = jQuery(".infobox-info:visible");
      /** @type {number} */
      var t = self.outerHeight(true) - self.height();
      var b = ix + t;
      popup.popup.setOptions({
        height : b
      });
      var link = jQuery(".infobox-close:visible");
      if (!link.data("hasClickHandler")) {
        link.click(function(types) {
          types.preventDefault();
        });
        link.data("hasClickHandler", "true");
      }
    };
    var logger = Microsoft.Maps.Events.addHandler(this.map.map, "viewchangeend", function() {
      Microsoft.Maps.Events.removeHandler(logger);
      init();
      popup.scrollInfoBoxIntoView(popup.popup, 30);
    });
    init();
    this.scrollInfoBoxIntoView(popup.popup, 30);
  },
  /**
   * @return {undefined}
   */
  hideText : function() {
    if (this.popup) {
      this.popup.setOptions({
        visible : false
      });
    }
  },
  /**
   * @param {Object} recurring
   * @return {undefined}
   */
  setMap : function(recurring) {
    var m = this.map;
    /** @type {Object} */
    this.map = recurring;
    if (this.marker) {
      if (this.map) {
        if (m) {
          m.map.entities.remove(this.marker);
        }
        this.map.map.entities.push(this.marker);
      } else {
        if (m) {
          m.map.entities.remove(this.marker);
        }
      }
    }
  },
  /**
   * @param {number} label
   * @return {undefined}
   */
  setLabel : function(label) {
    /** @type {number} */
    this.label = label;
    if (this.marker) {
      this.marker.setOptions({
        text : label
      });
    }
  },
  /**
   * @param {Object} pos
   * @return {undefined}
   */
  setPosition : function(pos) {
    this.latlng = new Microsoft.Maps.Location(pos.lat, pos.lng);
    if (this.marker) {
      this.marker.setLocation(this.latlng);
    }
  },
  /**
   * @return {?}
   */
  getPosition : function() {
    var loc = this.marker.getLocation();
    return{
      lat : loc.latitude,
      lng : loc.longitude
    };
  },
  /**
   * @param {boolean} recurring
   * @return {undefined}
   */
  setVisible : function(recurring) {
    this.marker.setOptions({
      visible : recurring
    });
  },
  /**
   * @param {boolean} recurring
   * @return {undefined}
   */
  setPositioningMarkerVisible : function(recurring) {
    this.marker.setOptions({
      visible : recurring
    });
  },
  /**
   * @param {string} event
   * @param {Function} fn
   * @param {Function} callback
   * @return {undefined}
   */
  bind : function(event, fn, callback) {
    if ("undefined" == typeof this.callbacks[event]) {
      /** @type {Array} */
      this.callbacks[event] = [];
    }
    if (2 === arguments.length) {
      callback = arguments[1];
      /** @type {null} */
      fn = null;
    }
    this.callbacks[event].push([callback, fn]);
  },
  /**
   * @return {undefined}
   */
  build : function() {
    this.marker = new Microsoft.Maps.Pushpin(this.latlng, this.getMarkerSettings());
    var tableview = this;
    Microsoft.Maps.Events.addHandler(this.marker, "click", function() {
      tableview.notifyCallbacksForEvent("click");
    });
  },
  /**
   * @param {string} event
   * @return {undefined}
   */
  notifyCallbacksForEvent : function(event) {
    var codeSegments = this.callbacks[event];
    if (codeSegments) {
      /** @type {number} */
      var i = 0;
      for (;i < codeSegments.length;i += 1) {
        codeSegments[i][0].call(null, {
          data : codeSegments[i][1]
        });
      }
    }
  },
  /**
   * @return {?}
   */
  getMarkerSettings : function() {
    var name = this.settingsKey;
    if ("undefined" == typeof lf.maps.bing.markerSettingsCache) {
      lf.maps.bing.markerSettingsCache = {};
    }
    if ("undefined" == typeof lf.maps.bing.markerSettingsCache[name]) {
      var item = lf_bing_settings[name];
      lf.maps.bing.markerSettingsCache[name] = {
        anchor : this.getMarkerSettingsForPoint(item.anchor),
        icon : item.icon,
        width : item.width,
        height : item.height,
        textOffset : this.getMarkerSettingsForPoint(item.textOffset),
        infoboxOffset : this.getMarkerSettingsForPoint(item.infoboxOffset)
      };
    }
    return lf.maps.bing.markerSettingsCache[name];
  },
  /**
   * @param {Node} point
   * @return {?}
   */
  getMarkerSettingsForPoint : function(point) {
    return point && ("number" == typeof point.x && "number" == typeof point.y) ? new Microsoft.Maps.Point(point.x, point.y) : null;
  },
  /**
   * @param {?} el
   * @param {number} a
   * @return {undefined}
   */
  scrollInfoBoxIntoView : function(el, a) {
    var map = this.map.map;
    var p2 = el.getOffset();
    var offsetCoordinate = el.getAnchor();
    var p1 = map.tryLocationToPixel(el.getLocation(), Microsoft.Maps.PixelReference.control);
    /** @type {number} */
    var b = p1.x + p2.x - offsetCoordinate.x;
    /** @type {number} */
    var y = p1.y - 25 - offsetCoordinate.y;
    if (a > y) {
      y *= -1;
      y += a;
    } else {
      /** @type {number} */
      y = 0;
    }
    if (a > b) {
      b *= -1;
      b += a;
    } else {
      /** @type {number} */
      b = map.getWidth() - p1.x + offsetCoordinate.x - el.getWidth();
      if (b > a) {
        /** @type {number} */
        b = 0;
      } else {
        b -= a;
      }
    }
    if (0 !== b || 0 !== y) {
      map.setView({
        animate : false,
        centerOffset : new Microsoft.Maps.Point(b, y),
        center : map.getCenter()
      });
    }
  }
});
lf.maps.bing.ClusterMarker = lf.maps.bing.FrontOfficeMarker.extend({
  /**
   * @param {?} name
   * @return {undefined}
   */
  constructor : function(name) {
    /** @type {string} */
    this.settingsKey = "clusterMarker";
    this.base(name);
    this.marker.setOptions({
      text : "0",
      typeName : "lf_marker cluster"
    });
    this.setVisible(true);
  },
  /**
   * @param {number} label
   * @return {undefined}
   */
  setLabel : function(label) {
    this.base("x " + label);
  }
});
lf.maps.bing.InactiveClusterMarker = lf.maps.bing.FrontOfficeMarker.extend({
  /**
   * @param {?} name
   * @return {undefined}
   */
  constructor : function(name) {
    /** @type {string} */
    this.settingsKey = "inactiveClusterMarker";
    this.base(name);
    this.marker.setOptions({
      text : "0",
      typeName : "lf_marker inactive_cluster"
    });
    this.setVisible(true);
  },
  /**
   * @param {number} label
   * @return {undefined}
   */
  setLabel : function(label) {
    this.base("x " + label);
  }
});
lf.maps.bing.InactiveMarker = lf.maps.bing.FrontOfficeMarker.extend({
  /**
   * @param {?} name
   * @return {undefined}
   */
  constructor : function(name) {
    /** @type {string} */
    this.settingsKey = "inactiveMarker";
    this.base(name);
    this.marker.setOptions({
      text : "0",
      typeName : "lf_marker inactive_number"
    });
    this.setVisible(true);
  }
});
lf.maps.bing.NumberMarker = lf.maps.bing.FrontOfficeMarker.extend({
  /**
   * @param {?} config
   * @param {?} name
   * @return {undefined}
   */
  constructor : function(config, name) {
    /** @type {string} */
    this.settingsKey = "numberMarker";
    this.base(name);
    this.marker.setOptions({
      text : config.toString(),
      typeName : "lf_marker active_number"
    });
    this.setVisible(true);
  }
});
lf.maps.bing.SingleMarker = lf.maps.bing.FrontOfficeMarker.extend({
  /**
   * @param {?} name
   * @return {undefined}
   */
  constructor : function(name) {
    /** @type {string} */
    this.settingsKey = "singleMarker";
    this.base(name);
    this.marker.setOptions({
      typeName : "lf_marker active_current"
    });
    this.setVisible(true);
  }
});
lf.maps.bing.DirectionsService = Base.extend({
  /**
   * @param {?} del
   * @param {?} origin
   * @param {Object} config
   * @param {?} on
   * @return {undefined}
   */
  constructor : function(del, origin, config, on) {
    this.delegate = del;
    this.origin = origin;
    /** @type {Object} */
    this.destination = config;
    var failuresLink = this;
    /**
     * @return {undefined}
     */
    var cb = function() {
      on(failuresLink);
    };
    Microsoft.Maps.loadModule("Microsoft.Maps.Directions", {
      /** @type {function (): undefined} */
      callback : cb
    });
  },
  /**
   * @return {undefined}
   */
  process : function() {
    var node = new Microsoft.Maps.Directions.DirectionsManager(this.delegate.map.map);
    node.setRequestOptions({
      distanceUnit : Microsoft.Maps.Directions.DistanceUnit.kilometers
    });
    var isDefault = new Microsoft.Maps.Directions.Waypoint({
      address : this.origin
    });
    node.addWaypoint(isDefault);
    var message = {};
    if (this.destination.latitude) {
      message.location = this.destination;
    } else {
      message.address = this.destination;
    }
    var error = new Microsoft.Maps.Directions.Waypoint(message);
    node.addWaypoint(error);
    var self = this;
    Microsoft.Maps.Events.addHandler(node, "directionsError", function() {
      node.dispose();
      self.callDelegateMethod("didReceiveFailingDirections", [self]);
    });
    Microsoft.Maps.Events.addHandler(node, "directionsUpdated", function(dataAndEvents) {
      var height = self.convertResult(node, dataAndEvents);
      node.dispose();
      self.callDelegateMethod("didReceiveSuccessfulDirections", [self, height]);
    });
    node.setRenderOptions({
      autoDisplayDisambiguation : false,
      autoUpdateMapView : false
    });
    node.calculateDirections();
  },
  /**
   * @param {?} dataAndEvents
   * @return {?}
   */
  resultMatchesGeolocation : function(dataAndEvents) {
    var evt = dataAndEvents.route[0].routeLegs[0].endWaypointLocation;
    return this.delegate.resultMatchesGeolocation(evt.latitude, evt.longitude);
  },
  /**
   * @param {?} deepDataAndEvents
   * @param {?} dataAndEvents
   * @return {?}
   */
  convertResult : function(deepDataAndEvents, dataAndEvents) {
    var e = dataAndEvents.routeSummary[0];
    var syntax = dataAndEvents.route[0];
    if (1 === syntax.routeLegs.length && this.resultMatchesGeolocation(dataAndEvents)) {
      var jQuery = syntax.routeLegs[0];
      /** @type {Array} */
      var steps = [];
      /** @type {number} */
      var o = 0;
      for (;o < jQuery.itineraryItems.length;o += 1) {
        var options = jQuery.itineraryItems[o];
        if (options.maneuver !== Microsoft.Maps.Directions.Maneuver.arriveFinish) {
          steps.push({
            description : options.formattedText,
            distance : options.distance
          });
        }
      }
      /** @type {Array} */
      var output = [];
      /** @type {number} */
      var i = 0;
      for (;i < jQuery.subLegs.length;i += 1) {
        var scope = jQuery.subLegs[i];
        var idsToCancel = scope.routePath.decodedLatitudes;
        var coords = scope.routePath.decodedLongitudes;
        /** @type {number} */
        var j = 0;
        for (;j < idsToCancel.length;j += 1) {
          output.push({
            lat : idsToCancel[j],
            lng : coords[j]
          });
        }
      }
      return{
        copyrights : "",
        estimatedDistance : e.distance,
        estimatedDuration : e.time,
        steps : steps,
        points : output
      };
    }
    this.callDelegateMethod("didReceiveFailingDirections", [this]);
  }
});
/**
 * @param {Object} dataAndEvents
 * @param {boolean} regex
 * @param {Object} l1
 * @param {boolean} deepDataAndEvents
 * @return {?}
 */
lf.maps.bing.DirectionsService.routeForPoint = function(dataAndEvents, regex, l1, deepDataAndEvents) {
  var s = new Microsoft.Maps.Location(l1.lat, l1.lng);
  return new lf.maps.bing.DirectionsService(dataAndEvents, regex, s, deepDataAndEvents);
};
/**
 * @param {Element} dataAndEvents
 * @param {number} callback
 * @param {number} regex
 * @param {Function} deepDataAndEvents
 * @return {?}
 */
lf.maps.bing.DirectionsService.routeForAddress = function(dataAndEvents, callback, regex, deepDataAndEvents) {
  return new lf.maps.bing.DirectionsService(dataAndEvents, callback, regex, deepDataAndEvents);
};
Class.mixin(lf.maps.bing.DirectionsService, Delegatable);
lf.maps.bing.PolygonLine = Base.extend({
  /**
   * @param {Function} recurring
   * @param {Object} config
   * @return {undefined}
   */
  constructor : function(recurring, config) {
    this.setMap(recurring);
    this.points = config.points;
    this.color = config.color;
    this.line = new Microsoft.Maps.Polyline(this.pointsToBing(config.points), {
      strokeColor : this.colorToBing(config.color)
    });
    this.map.map.entities.push(this.line);
  },
  /**
   * @param {Function} recurring
   * @return {undefined}
   */
  setMap : function(recurring) {
    /** @type {Function} */
    this.map = recurring;
    if (this.line) {
      this.line.setMap(this.map);
    }
  },
  /**
   * @return {?}
   */
  getMap : function() {
    return this.map;
  },
  /**
   * @param {Object} color
   * @return {undefined}
   */
  setColor : function(color) {
    /** @type {Object} */
    this.color = color;
    if (this.line) {
      this.line.setOptions({
        strokeColor : this.colorToBing(color)
      });
    }
  },
  /**
   * @return {?}
   */
  getColor : function() {
    return this.color;
  },
  /**
   * @param {Array} points
   * @return {undefined}
   */
  setPoints : function(points) {
    /** @type {Array} */
    this.points = points;
    if (this.line) {
      this.line.setLocations(this.pointsToBing(points));
    }
  },
  /**
   * @return {?}
   */
  getPoints : function() {
    return this.points;
  },
  /**
   * @param {Object} color
   * @return {?}
   */
  colorToBing : function(color) {
    /** @type {number} */
    var hex = parseInt(255 * color.a, 10);
    /** @type {number} */
    var g = parseInt(255 * color.r, 10);
    /** @type {number} */
    var b = parseInt(255 * color.g, 10);
    /** @type {number} */
    var charCodeToReplace = parseInt(255 * color.b, 10);
    return new Microsoft.Maps.Color(hex, g, b, charCodeToReplace);
  },
  /**
   * @param {Array} ca
   * @return {?}
   */
  pointsToBing : function(ca) {
    /** @type {Array} */
    var eventPath = [];
    /** @type {number} */
    var i = 0;
    for (;i < ca.length;i += 1) {
      var c = ca[i];
      eventPath.push(new Microsoft.Maps.Location(c.lat, c.lng));
    }
    return eventPath;
  }
});
lf.maps.google.Map = Base.extend({
  /**
   * @param {string} id
   * @param {?} config
   * @return {undefined}
   */
  constructor : function(id, config) {
    this.loadedCallback = config;
    /** @type {Array} */
    var mapTypeIds = [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID];
    this.map = new google.maps.Map(id, {
      zoom : 13,
      center : new google.maps.LatLng(0, 0),
      mapTypeId : google.maps.MapTypeId.ROADMAP,
      scrollwheel : false,
      mapTypeControlOptions : {
        mapTypeIds : mapTypeIds,
        style : google.maps.MapTypeControlStyle.HORIZONTAL_BAR
      }
    });
    var mapLoaded = this;
    this.overlay = new google.maps.OverlayView;
    this.overlay.setMap(this.map);
    /**
     * @return {undefined}
     */
    this.overlay.onAdd = function() {
      mapLoaded.mapLoaded();
    };
    /**
     * @return {undefined}
     */
    this.overlay.draw = function() {
    };
  },
  /**
   * @param {?} b
   * @param {number} zoom
   * @return {undefined}
   */
  fitBounds : function(b, zoom) {
    var southWest = new google.maps.LatLng(b.sw.lat, b.sw.lng);
    var ne = new google.maps.LatLng(b.ne.lat, b.ne.lng);
    var bounds = new google.maps.LatLngBounds(southWest, ne);
    if (zoom) {
      google.maps.event.addListenerOnce(this.map, "bounds_changed", function() {
        if (this.getZoom() > zoom) {
          this.setZoom(zoom);
        }
      });
    }
    this.map.fitBounds(bounds);
  },
  /**
   * @return {undefined}
   */
  redraw : function() {
    google.maps.event.trigger(this.map, "resize");
  },
  /**
   * @return {?}
   */
  getCenter : function() {
    var vertex2 = this.map.getCenter();
    return{
      lat : vertex2.lat(),
      lng : vertex2.lng()
    };
  },
  /**
   * @return {?}
   */
  getZoom : function() {
    return this.map.getZoom();
  },
  /**
   * @return {?}
   */
  getMaxZoom : function() {
    return this.map.mapTypes[this.map.getMapTypeId()].maxZoom;
  },
  /**
   * @return {?}
   */
  getPointOfSaleZoomLevel : function() {
    return 13;
  },
  /**
   * @return {?}
   */
  getMaxZIndex : function() {
    return google.maps.Marker.MAX_ZINDEX;
  },
  /**
   * @param {Object} latlng
   * @return {?}
   */
  getPixelForLatLng : function(latlng) {
    var projection = this.overlay.getProjection();
    if (!projection) {
      return{
        x : 0,
        y : 0
      };
    }
    var googleCoordinates = new google.maps.LatLng(latlng.lat, latlng.lng);
    var scrollCoord = projection.fromLatLngToDivPixel(googleCoordinates);
    return{
      x : scrollCoord.x,
      y : scrollCoord.y
    };
  },
  /**
   * @param {?} x1
   * @return {?}
   */
  getLatLngForPixel : function(x1) {
    var map = this.overlay.getProjection();
    if (!map) {
      return{
        lat : 0,
        lng : 0
      };
    }
    var ne = new google.maps.Point(x1.x, x1.y);
    var vertex2 = map.fromDivPixelToLatLng(ne);
    return{
      lat : vertex2.lat(),
      lng : vertex2.lng()
    };
  },
  /**
   * @return {?}
   */
  getViewportBounds : function() {
    var bounds = this.map.getBounds();
    var vertex2 = bounds.getNorthEast();
    var vertex1 = bounds.getSouthWest();
    var latlng = {
      lat : vertex1.lat(),
      lng : vertex1.lng()
    };
    var mkr_point = {
      lat : vertex2.lat(),
      lng : vertex2.lng()
    };
    return new lf.maps.Bounds(latlng, mkr_point);
  },
  /**
   * @param {Object} center
   * @return {undefined}
   */
  setCenter : function(center) {
    this.map.setCenter(new google.maps.LatLng(center.lat, center.lng));
  },
  /**
   * @param {number} zoom
   * @return {undefined}
   */
  setZoom : function(zoom) {
    this.map.setZoom(zoom);
  },
  /**
   * @param {string} event
   * @param {Function} fn
   * @return {?}
   */
  bind : function(event, fn) {
    return google.maps.event.addListener(this.map, event, fn);
  },
  /**
   * @param {string} listener
   * @return {undefined}
   */
  unbind : function(listener) {
    google.maps.event.removeListener(listener);
  },
  /**
   * @return {undefined}
   */
  mapLoaded : function() {
    if (!this.loaded) {
      /** @type {boolean} */
      this.loaded = true;
      if (this.loadedCallback) {
        this.loadedCallback.call(null, this);
      }
    }
  }
});
lf.maps.google.Overlay = Base.extend({
  /**
   * @param {(Function|string)} label
   * @param {Object} pos
   * @return {undefined}
   */
  constructor : function(label, pos) {
    this.setLabel(label || "");
    this.setPosition(pos);
    this.build();
  },
  /**
   * @param {Function} recurring
   * @return {undefined}
   */
  setMap : function(recurring) {
    /** @type {Function} */
    this.map = recurring;
    if (this.overlay) {
      this.overlay.setMap(recurring);
    }
  },
  /**
   * @param {number} label
   * @return {undefined}
   */
  setLabel : function(label) {
    /** @type {number} */
    this.label = label;
    if (this.overlay) {
      this.icon.html(label);
    }
  },
  /**
   * @param {Object} pos
   * @return {undefined}
   */
  setPosition : function(pos) {
    /** @type {Object} */
    this.position = pos;
    if (this.overlay) {
      if (this.ready) {
        this.draw();
      }
    }
  },
  /**
   * @param {boolean} recurring
   * @return {undefined}
   */
  setVisible : function(recurring) {
    if (recurring) {
      this.root.show();
    } else {
      this.root.hide();
    }
  },
  /**
   * @param {boolean} recurring
   * @return {undefined}
   */
  setActive : function(recurring) {
    /** @type {boolean} */
    this.isActive = recurring;
    if (this.overlay) {
      this.icon.attr("class", this.getIconClass());
      this.setZIndex(this.zIndex);
    }
  },
  /**
   * @return {?}
   */
  getZIndex : function() {
    return this.zIndex;
  },
  /**
   * @param {number} index
   * @return {undefined}
   */
  setZIndex : function(index) {
    /** @type {number} */
    this.zIndex = index;
    this._setZIndex(index);
  },
  /**
   * @param {number} index
   * @return {undefined}
   */
  _setZIndex : function(index) {
    if (this.marker) {
      if ("number" == typeof index) {
        this.marker.setZIndex(index);
      }
    }
    if (this.overlay && (this.isActive && "number" == typeof index)) {
      this.icon.css("z-index", index);
    } else {
      this.icon.css("z-index", "auto");
    }
  },
  /**
   * @param {Object} key
   * @return {undefined}
   */
  setStyle : function(key) {
    /** @type {Object} */
    this.style = key;
    if (this.overlay) {
      this.icon.attr("class", this.getIconClass());
      this.shadow.attr("class", this.getShadowClass());
    }
  },
  /**
   * @return {?}
   */
  getShadowClass : function() {
    return this.style + "_shadow";
  },
  /**
   * @return {?}
   */
  getIconClass : function() {
    return(this.isActive ? "active" : "inactive") + "_" + this.style;
  },
  /**
   * @return {undefined}
   */
  bind : function() {
    this.icon.bind.apply(this.icon, arguments);
  },
  /**
   * @return {undefined}
   */
  build : function() {
    this.overlay = new google.maps.OverlayView;
    this.root = jQuery("<span/>").addClass("lf_marker").css("position", "absolute");
    this.shadow = jQuery("<span/>").addClass(this.getShadowClass()).appendTo(this.root);
    this.icon = jQuery("<span/>").addClass(this.getIconClass()).css("cursor", "pointer").html(this.label).appendTo(this.root);
    var layer = this;
    /**
     * @return {undefined}
     */
    this.overlay.onAdd = function() {
      layer.onAdd();
    };
    /**
     * @return {undefined}
     */
    this.overlay.draw = function() {
      layer.draw();
    };
    /**
     * @return {undefined}
     */
    this.overlay.onRemove = function() {
      layer.onRemove();
    };
  },
  /**
   * @return {undefined}
   */
  onAdd : function() {
    var args = this.overlay.getPanes();
    this.root.appendTo(args.floatShadow);
    /** @type {boolean} */
    this.ready = true;
  },
  /**
   * @return {undefined}
   */
  draw : function() {
    this.createPrintIcon();
    var test = this.overlay.getProjection().fromLatLngToDivPixel(this.position);
    this.root.css({
      left : test.x - this.root.width() / 2,
      top : test.y - this.root.height()
    });
  },
  /**
   * @return {undefined}
   */
  onRemove : function() {
    this.root.detach();
    /** @type {boolean} */
    this.ready = false;
  },
  /**
   * @return {undefined}
   */
  createPrintIcon : function() {
    if (!this.printIcon) {
      var attrList = this.icon.css("background-image").match(/^url\((.+)\)$/);
      if (attrList) {
        this.printIcon = jQuery("<img/>").attr("src", attrList[1].replace(/[\"]/g, "")).appendTo(this.root);
      }
    }
  }
});
lf.maps.google.FrontOfficeMarker = Base.extend({
  /**
   * @param {Object} pos
   * @return {undefined}
   */
  constructor : function(pos) {
    this.setPosition(pos);
    this.build();
  },
  /**
   * @param {number} index
   * @return {undefined}
   */
  setZIndex : function(index) {
    /** @type {number} */
    this.zIndex = index;
    this.marker.setZIndex(index);
    this.overlay.setZIndex(index);
  },
  /**
   * @return {?}
   */
  getZIndex : function() {
    return this.zIndex;
  },
  /**
   * @param {string} keepData
   * @return {undefined}
   */
  showText : function(keepData) {
    if (!this.popup) {
      this.popup = new google.maps.InfoWindow;
    }
    this.popup.setContent("<div class='lf_mapbubble_text' style='overflow-y:hidden;padding-right:15px;'>" + keepData + "</div>");
    this.popup.open(this.marker.getMap(), this.marker);
  },
  /**
   * @return {undefined}
   */
  hideText : function() {
    if (this.popup) {
      this.popup.close();
    }
  },
  /**
   * @param {Function} recurring
   * @return {undefined}
   */
  setMap : function(recurring) {
    /** @type {Function} */
    this.map = recurring;
    if (this.marker) {
      if (this.map) {
        this.marker.setMap(this.map.map);
        this.overlay.setMap(this.map.map);
      } else {
        this.marker.setMap(null);
        this.overlay.setMap(null);
      }
    }
  },
  /**
   * @param {Function} label
   * @return {undefined}
   */
  setLabel : function(label) {
    /** @type {Function} */
    this.label = label;
    if (this.marker) {
      this.overlay.setLabel(this.label);
    }
  },
  /**
   * @param {Object} pos
   * @return {undefined}
   */
  setPosition : function(pos) {
    this.latlng = new google.maps.LatLng(pos.lat, pos.lng);
    if (this.marker) {
      this.marker.setPosition(this.latlng);
      this.overlay.setPosition(this.latlng);
    }
  },
  /**
   * @return {?}
   */
  getPosition : function() {
    var vertex2 = this.marker.getPosition();
    return{
      lat : vertex2.lat(),
      lng : vertex2.lng()
    };
  },
  /**
   * @param {boolean} recurring
   * @return {undefined}
   */
  setVisible : function(recurring) {
    this.overlay.setVisible(recurring);
  },
  /**
   * @param {boolean} recurring
   * @return {undefined}
   */
  setPositioningMarkerVisible : function(recurring) {
    this.marker.setVisible(recurring);
  },
  /**
   * @return {undefined}
   */
  bind : function() {
    this.overlay.bind.apply(this.overlay, arguments);
  },
  /**
   * @return {undefined}
   */
  build : function() {
    this.marker = new google.maps.Marker({
      flat : true,
      position : this.latlng,
      visible : false
    });
    this.overlay = new lf.maps.google.Overlay(this.label, this.latlng);
  }
});
lf.maps.google.InactiveMarker = lf.maps.google.FrontOfficeMarker.extend({
  /**
   * @param {?} name
   * @return {undefined}
   */
  constructor : function(name) {
    this.base(name);
    this.overlay.setActive(false);
    this.overlay.setStyle("number");
  }
});
lf.maps.google.NumberMarker = lf.maps.google.FrontOfficeMarker.extend({
  /**
   * @param {number} o
   * @param {?} name
   * @return {undefined}
   */
  constructor : function(o, name) {
    /** @type {number} */
    this.number = o;
    this.base(name);
    this.overlay.setLabel(o);
    this.overlay.setActive(true);
    this.overlay.setStyle("number");
  }
});
lf.maps.google.ClusterMarker = lf.maps.google.FrontOfficeMarker.extend({
  /**
   * @param {?} name
   * @return {undefined}
   */
  constructor : function(name) {
    this.base(name);
    this.overlay.setLabel(0);
    this.overlay.setActive(true);
    this.overlay.setStyle("cluster");
  },
  /**
   * @param {number} label
   * @return {undefined}
   */
  setLabel : function(label) {
    this.base("x " + label);
  }
});
lf.maps.google.InactiveClusterMarker = lf.maps.google.FrontOfficeMarker.extend({
  /**
   * @param {?} name
   * @return {undefined}
   */
  constructor : function(name) {
    this.base(name);
    this.overlay.setLabel(0);
    this.overlay.setActive(false);
    this.overlay.setStyle("cluster");
  },
  /**
   * @param {number} label
   * @return {undefined}
   */
  setLabel : function(label) {
    this.base("x " + label);
  }
});
lf.maps.google.SingleMarker = lf.maps.google.FrontOfficeMarker.extend({
  /**
   * @param {?} name
   * @return {undefined}
   */
  constructor : function(name) {
    this.base(name);
    this.overlay.setActive(true);
    this.overlay.setStyle("current");
  }
});
lf.maps.google.PolygonLine = Base.extend({
  /**
   * @param {Function} recurring
   * @param {Object} options
   * @return {undefined}
   */
  constructor : function(recurring, options) {
    this.setMap(recurring);
    this.setColor(options.color || {
      r : 1,
      g : 0,
      b : 0,
      a : 1
    });
    this.line = new google.maps.Polyline(this.getGoogleMapOptions(this.pointsToGMap(options.points)));
  },
  /**
   * @param {Function} recurring
   * @return {undefined}
   */
  setMap : function(recurring) {
    /** @type {Function} */
    this.map = recurring;
    if (this.line) {
      this.line.setMap(this.map);
    }
  },
  /**
   * @return {?}
   */
  getMap : function() {
    return this.map;
  },
  /**
   * @param {?} color
   * @return {undefined}
   */
  setColor : function(color) {
    this.color = color;
    if (this.line) {
      this.line.setOptions(this.getGoogleMapOptions());
    }
  },
  /**
   * @return {?}
   */
  getColor : function() {
    return this.color;
  },
  /**
   * @param {Array} points
   * @return {undefined}
   */
  setPoints : function(points) {
    /** @type {Array} */
    this.points = points;
    if (this.line) {
      this.line.setPath(this.pointsToGMap(points));
    }
  },
  /**
   * @return {?}
   */
  getPoints : function() {
    return this.points;
  },
  /**
   * @param {string} ps
   * @return {?}
   */
  getGoogleMapOptions : function(ps) {
    return{
      map : this.map.map,
      strokeColor : this.getRGBString(),
      strokeOpacity : this.getColor().a,
      path : ps
    };
  },
  /**
   * @return {?}
   */
  getRGBString : function() {
    /**
     * @param {string} str
     * @param {number} opt_attributes
     * @return {?}
     */
    function endsWith(str, opt_attributes) {
      /** @type {string} */
      var code = "" + str;
      for (;code.length < opt_attributes;) {
        /** @type {string} */
        code = "0" + code;
      }
      return code;
    }
    /** @type {string} */
    var errStr = parseInt(255 * this.color.r, 10).toString(16);
    /** @type {string} */
    var fileNameLowercase = parseInt(255 * this.color.g, 10).toString(16);
    /** @type {string} */
    var simple = parseInt(255 * this.color.b, 10).toString(16);
    return sprintf("#%s%s%s", endsWith(errStr, 2), endsWith(fileNameLowercase, 2), endsWith(simple, 2));
  },
  /**
   * @param {Array} points
   * @return {?}
   */
  pointsToGMap : function(points) {
    /** @type {Array} */
    var eventPath = [];
    /** @type {number} */
    var i = 0;
    for (;i < points.length;i += 1) {
      var point = points[i];
      eventPath.push(new google.maps.LatLng(point.lat, point.lng));
    }
    return eventPath;
  }
});
lf.maps.google.DirectionsService = Base.extend({
  /**
   * @param {?} del
   * @param {?} origin
   * @param {?} config
   * @param {?} beforeExit
   * @return {undefined}
   */
  constructor : function(del, origin, config, beforeExit) {
    this.delegate = del;
    this.origin = origin;
    this.destination = config;
    this.service = new google.maps.DirectionsService;
    beforeExit(this);
  },
  /**
   * @return {undefined}
   */
  process : function() {
    var self = this;
    this.service.route({
      destination : this.destination,
      origin : this.origin,
      travelMode : google.maps.DirectionsTravelMode.DRIVING,
      unitSystem : google.maps.UnitSystem.METRIC
    }, function(dataAndEvents, status) {
      if (status === google.maps.DirectionsStatus.OK && self.resultMatchesGeolocation(dataAndEvents)) {
        var tree = self.convertResult(dataAndEvents);
        self.callDelegateMethod("didReceiveSuccessfulDirections", [self, tree]);
      } else {
        self.callDelegateMethod("didReceiveFailingDirections", [self]);
      }
    });
  },
  /**
   * @param {?} dataAndEvents
   * @return {?}
   */
  resultMatchesGeolocation : function(dataAndEvents) {
    var vertex2 = dataAndEvents.routes[0].legs[0].end_location;
    return this.delegate.resultMatchesGeolocation(vertex2.lat(), vertex2.lng());
  },
  /**
   * @param {?} dataAndEvents
   * @return {?}
   */
  convertResult : function(dataAndEvents) {
    var itin = dataAndEvents.routes[0];
    if (1 === itin.legs.length) {
      var that = itin.legs[0];
      /** @type {Array} */
      var steps = [];
      /** @type {Array} */
      var output = [];
      /** @type {number} */
      var i = 0;
      for (;i < that.steps.length;i += 1) {
        var self = that.steps[i];
        /** @type {number} */
        var n = 0;
        for (;n < self.path.length;n += 1) {
          var entry = self.path[n];
          output.push({
            lat : entry.lat(),
            lng : entry.lng()
          });
        }
        steps.push({
          description : self.instructions,
          distance : self.distance.value / 1E3
        });
      }
      return{
        copyrights : itin.copyrights,
        estimatedDistance : that.distance.value / 1E3,
        estimatedDuration : that.duration.value,
        steps : steps,
        points : output
      };
    }
    this.callDelegateMethod("didReceiveFailingDirections", [this]);
  }
});
/**
 * @param {string} dataAndEvents
 * @param {string} regex
 * @param {Object} vertex2
 * @param {boolean} deepDataAndEvents
 * @return {?}
 */
lf.maps.google.DirectionsService.routeForPoint = function(dataAndEvents, regex, vertex2, deepDataAndEvents) {
  /** @type {string} */
  var s = [vertex2.lat, vertex2.lng].join(",");
  return new lf.maps.google.DirectionsService(dataAndEvents, regex, s, deepDataAndEvents);
};
/**
 * @param {Object} dataAndEvents
 * @param {boolean} callback
 * @param {boolean} regex
 * @param {boolean} deepDataAndEvents
 * @return {?}
 */
lf.maps.google.DirectionsService.routeForAddress = function(dataAndEvents, callback, regex, deepDataAndEvents) {
  return new lf.maps.google.DirectionsService(dataAndEvents, callback, regex, deepDataAndEvents);
};
Class.mixin(lf.maps.google.DirectionsService, Delegatable);
/**
 * @param {Object} options
 * @return {undefined}
 */
lf.maps.leaflet.initialize = function(options) {
  options = jQuery.extend({
    posZoomLevel : 13,
    clusterMarker : {},
    inactiveClusterMarker : {},
    inactiveMarker : {},
    numberMarker : {},
    singleMarker : {}
  }, options);
  this.loadConfiguration(options);
};

/**
 * @param {Object} namespace
 * @return {undefined}
 */
lf.maps.leaflet.loadConfiguration = function(namespace) {
  this.configuration = {};

  var prependTemplateAssetPath = function () {
    var configuration = jQuery.extend({}, namespace);

    jQuery.each(configuration, function(key, value) {
      if(value.prependTemplateAssetPathFor !== undefined) {
        jQuery.each(value.prependTemplateAssetPathFor, function(i, keyUrl) {
          value[keyUrl] = lf_asset_base + value[keyUrl];
          value.prependTemplateAssetPathFor.splice(i, 1);
        });
      }
    });

    return configuration;
  };

  this.rawConfiguration = prependTemplateAssetPath();
  
  /**
   * @param {string} prop
   * @return {?}
   */
  var testPropsAll = function(prop) {
    return prop.charAt(0).toUpperCase() + prop.slice(1);
  };
  /** @type {null} */
  var data = null;
  var prop;
  for (prop in namespace) {
    data = namespace[prop];
    if (data && ("object" == typeof data && /\w+Marker$/.test(prop))) {
      var tile = this[testPropsAll(prop)];
      if (tile) {
        tile.Icon = this.createIconClass(data);
      }
    } else {
      this.configuration[prop] = data;
    }
  }
};
/**
 * @param {Object} nodes
 * @return {?}
 */
lf.maps.leaflet.createIconClass = function(nodes) {
  var store = {};
  /** @type {null} */
  var node = null;
  var name;
  for (name in nodes) {
    node = nodes[name];
    if (node) {
      if (node.hasOwnProperty("x")) {
        if (node.hasOwnProperty("y")) {
          node = new L.Point(Number(node.x), Number(node.y));
        }
      }
    }
    if (node) {
      if (lf_asset_base) {
        if (/\w+Url$/.test(name)) {
          node = lf_asset_base + node;
        }
      }
    }
    store[name] = node;
  }
  return this.LabelIcon.extend({
    options : store
  });
};
if ("undefined" != typeof L) {
  lf.maps.leaflet.LabelIcon = L.Icon.extend({
    options : {
      iconUrl : "/javascripts/leaflet-0.7.2/images/marker-icon.png",
      shadowUrl : "/javascripts/leaflet-0.7.2/images/marker-shadow.png",
      iconSize : new L.Point(25, 41),
      shadowSize : new L.Point(41, 41),
      iconAnchor : new L.Point(13, 41),
      popupAnchor : new L.Point(0, -33),
      text : null,
      textAnchor : new L.Point(0, 0),
      className : null
    },
    /**
     * @param {string} keepData
     * @param {?} edge
     * @return {?}
     */
    _createLabelAndIconIE6 : function(keepData, edge) {
      /** @type {Element} */
      var div = document.createElement("div");
      /** @type {string} */
      div.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + keepData + '")';
      /** @type {string} */
      div.style.textAlign = "center";
      /** @type {Element} */
      var element = document.createElement("span");
      element.innerHTML = this.options.text;
      /** @type {string} */
      element.className = "leaflet-marker-icon-label";
      /** @type {string} */
      element.style.display = "inline-block";
      if (edge) {
        element.style.paddingTop = this.options.textAnchor.y.toString() + "px";
      }
      div.appendChild(element);
      return div;
    },
    /**
     * @param {?} src
     * @param {?} edge
     * @return {?}
     */
    _createLabelAndIcon : function(src, edge) {
      /** @type {Element} */
      var el = document.createElement("div");
      var ext = this._createImg(src);
      el.appendChild(ext);
      /** @type {Element} */
      var div = document.createElement("div");
      div.innerHTML = this.options.text;
      /** @type {string} */
      div.className = "leaflet-marker-icon-label";
      /** @type {string} */
      div.style.position = "relative";
      if (edge) {
        /** @type {string} */
        div.style.top = 0 - edge.y + "px";
        /** @type {string} */
        div.style.width = 0 - edge.x + "px";
        div.style.paddingTop = this.options.textAnchor.y.toString() + "px";
      }
      /** @type {string} */
      div.style.textAlign = "center";
      el.appendChild(div);
      return el;
    },
    /**
     * @param {string} name
     * @return {?}
     */
    _createIcon : function(name) {
      var e = this.options[name + "Size"];
      var key = this.options[name + "Url"];
      if (!key && "shadow" === name) {
        return null;
      }
      var element;
      element = "icon" === name && this.options.text ? L.Browser.ie6 ? this._createLabelAndIconIE6(key, e) : this._createLabelAndIcon(key, e) : key ? this._createImg(key) : this._createDiv();
      /** @type {string} */
      var className = "leaflet-marker-" + name;
      if (this.options.className) {
        /** @type {string} */
        className = className + " " + this.options.className;
      }
      /** @type {string} */
      element.className = className;
      /** @type {string} */
      element.style.marginLeft = -this.options.iconAnchor.x + "px";
      /** @type {string} */
      element.style.marginTop = -this.options.iconAnchor.y + "px";
      if (e) {
        /** @type {string} */
        element.style.width = e.x + "px";
        /** @type {string} */
        element.style.height = e.y + "px";
      }
      return element;
    }
  });
}
if ("undefined" != typeof L) {
  lf.maps.leaflet.TomtomTileLayer = L.TileLayer.WMS.extend({
    defaultWmsParams : {
      service : "WMS",
      request : "GetMap",
      version : "1.1.1",
      layers : "basic",
      styles : "",
      format : "image/png",
      transparent : false
    },
    /**
     * @param {?} tilePoint
     * @param {?} zoom
     * @return {?}
     */
    getTileUrl : function(tilePoint, zoom) {
      var map = this._map;
      var me = map.options.crs;
      var tileSize = this.options.tileSize;
      var nwPoint = tilePoint.multiplyBy(tileSize);
      var ne = nwPoint.add(new L.Point(tileSize, tileSize));
      var nw = map.unproject(nwPoint, zoom, true);
      var center = map.unproject(ne, zoom, true);
      var ul = me.project(nw);
      var newCenter = me.project(center);
      /** @type {string} */
      var value = [ul.x, newCenter.y, newCenter.x, ul.y].join(",");
      var r20 = {};
      var letter;
      for (letter in this.wmsParams) {
        r20[letter.toUpperCase()] = this.wmsParams[letter];
      }
      /** @type {string} */
      var tval = this._url + L.Util.getParamString(r20) + "&BBOX=" + value;
      return tval;
    },
    /**
     * @param {Object} map
     * @param {?} index
     * @return {undefined}
     */
    onAdd : function(map, index) {
      L.TileLayer.WMS.prototype.onAdd.call(this, map, index);
      map.on("moveend", this._updateViewportInfo, this);
      this._updateViewportInfo();
    },
    /**
     * @return {undefined}
     */
    _updateViewportInfo : function() {
      var map = this._map;
      var maxBounds = map.getBounds();
      var that = map.options.crs;
      var se = maxBounds.getNorthWest();
      var end = maxBounds.getSouthEast();
      var lr = that.project(se);
      var step = that.project(end);
      var camelKey = {
        bbox : [step.y, lr.x, lr.y, step.x].join(","),
        zoomLevel : map.getZoom(),
        key : this.options.apikey
      };
      var data = this._applyTemplate("http://lbs.tomtom.com/lbs/services/wbrp/1/viewportDesc/{bbox}/{zoomLevel}/{bbox}/{zoomLevel}/true/jsonp/{key}?jsonp=?", camelKey);
      if (!this._vpCache) {
        this._vpCache = {};
      }
      if (this._vpCache[data]) {
        this._setViewportInfo(this._vpCache[data]);
      } else {
        var console = this;
        jQuery.getJSON(data, function(dateLocale) {
          var fmt = dateLocale.viewpResp;
          console._vpCache[data] = fmt;
          console._setViewportInfo(fmt);
        });
      }
    },
    /**
     * @param {string} messageFormat
     * @param {Array} value
     * @return {?}
     */
    _applyTemplate : function(messageFormat, value) {
      return messageFormat.replace(/\{(\w*)\}/g, function(dataAndEvents, arrayIndex) {
        return value[arrayIndex];
      });
    },
    /**
     * @param {?} err
     * @return {undefined}
     */
    _setViewportInfo : function(err) {
      this._constrainZoom(err.canZoomIn);
      this._setAttribution(err.copyrightIds.replace(/\^/g, " "));
    },
    /**
     * @param {boolean} dataAndEvents
     * @return {undefined}
     */
    _constrainZoom : function(dataAndEvents) {
      var map = this._map;
      map.options.maxZoom = dataAndEvents ? 1 / 0 : map.getZoom();
    },
    /**
     * @param {?} clone
     * @return {undefined}
     */
    _setAttribution : function(clone) {
      if (!this._currentAttribution || this._currentAttribution !== clone) {
        var container = this._map.attributionControl;
        this._map.attributionControl._attributions = {};
        container.addAttribution(clone);
        this._currentAttribution = clone;
      }
    }
  });
}
if ("undefined" != typeof L) {
  lf.maps.leaflet.YandexTileLayer = L.TileLayer.WMS.extend({
    includes : L.Mixin.Events,
    options : {
      minZoom : 0,
      maxZoom : 18,
      attribution : "",
      opacity : 1,
      traffic : false,
      routePoints : []
    },
    /**
     * @param {string} data
     * @param {?} options
     * @return {undefined}
     */
    initialize : function(data, options) {
      L.Util.setOptions(this, options);
      /** @type {string} */
      this._type = "yandex#" + (data || "map");
      if (this.options.routePoints.length > 0) {
        /** @type {string} */
        this.from = [this.options.routePoints[0].lat, this.options.routePoints[0].lng].join(",");
        /** @type {string} */
        this.to = [this.options.routePoints[1].lat, this.options.routePoints[1].lng].join(",");
      }
    },
    /**
     * @param {Object} map
     * @param {?} ds
     * @return {undefined}
     */
    onAdd : function(map, ds) {
      /** @type {Object} */
      this._map = map;
      this._insertAtTheBottom = ds;
      this._initContainer();
      this._initMapObject();
      map.on("viewreset", this._resetCallback, this);
      this._limitedUpdate = L.Util.limitExecByInterval(this._update, 150, this);
      map.on("move", this._update, this);
      this._reset();
      this._update(true);
    },
    /**
     * @return {undefined}
     */
    onRemove : function() {
      this._map._container.removeChild(this._container);
      this._map.off("viewreset", this._resetCallback, this);
      this._map.off("move", this._update, this);
    },
    /**
     * @return {?}
     */
    getAttribution : function() {
      return this.options.attribution;
    },
    /**
     * @param {number} opacity
     * @return {undefined}
     */
    setOpacity : function(opacity) {
      /** @type {number} */
      this.options.opacity = opacity;
      if (1 > opacity) {
        L.DomUtil.setOpacity(this._container, opacity);
      }
    },
    /**
     * @param {?} el
     * @param {?} newSize
     * @return {undefined}
     */
    setElementSize : function(el, newSize) {
      /** @type {string} */
      el.style.width = newSize.x + "px";
      /** @type {string} */
      el.style.height = newSize.y + "px";
    },
    /**
     * @return {undefined}
     */
    _initContainer : function() {
      var container = this._map._container;
      var text = container.firstChild;
      if (!this._container) {
        this._container = L.DomUtil.create("div", "leaflet-yandex-layer leaflet-top leaflet-left");
        this._container.id = "_YMapContainer_" + L.Util.stamp(this);
        /** @type {string} */
        this._container.style.zIndex = "auto";
      }
      if (this.options.overlay) {
        text = this._map._container.getElementsByClassName("leaflet-map-pane")[0];
        text = text.nextSibling;
        if (L.Browser.opera) {
          this._container.className += " leaflet-objects-pane";
        }
      }
      container.insertBefore(this._container, text);
      this.setOpacity(this.options.opacity);
      this.setElementSize(this._container, this._map.getSize());
    },
    /**
     * @return {undefined}
     */
    _initMapObject : function() {
      if (!this._yandex) {
        this.loadRequiredPackages();
        var self = new ymaps.Map(this._container, {
          center : [0, 0],
          zoom : 0,
          behaviors : []
        });
        if (this.options.traffic) {
          self.controls.add(new ymaps.control.TrafficControl({
            shown : true
          }));
        }
        if ("yandex#null" === this._type) {
          this._type = new ymaps.MapType("null", []);
          /** @type {string} */
          self.container.getElement().style.background = "transparent";
        }
        if (this.options.routePoints.length > 0) {
          this.displayItinerary(self);
        }
        self.setType(this._type);
        this._yandex = self;
        this._update(true);
      }
    },
    /**
     * @param {?} e
     * @return {undefined}
     */
    _resetCallback : function(e) {
      this._reset(e.hard);
    },
    /**
     * @return {undefined}
     */
    _reset : function() {
      this._initContainer();
    },
    /**
     * @param {boolean} deepDataAndEvents
     * @return {undefined}
     */
    _update : function(deepDataAndEvents) {
      if (this._yandex) {
        this._resize(deepDataAndEvents);
        var vertex2 = this._map.getCenter();
        /** @type {Array} */
        var newCenter = [vertex2.lat, vertex2.lng];
        var zoom = this._map.getZoom();
        if (deepDataAndEvents || this._yandex.getZoom() !== zoom) {
          this._yandex.setZoom(zoom);
        }
        this._yandex.panTo(newCenter, {
          duration : 0,
          delay : 0
        });
      }
    },
    /**
     * @param {boolean} deepDataAndEvents
     * @return {undefined}
     */
    _resize : function(deepDataAndEvents) {
      var newSize = this._map.getSize();
      var style = this._container.style;
      if (style.width !== newSize.x + "px" || (style.height !== newSize.y + "px" || deepDataAndEvents === true)) {
        this.setElementSize(this._container, newSize);
        var bounds = this._map.getBounds();
        bounds.getSouthWest();
        bounds.getNorthEast();
        this._yandex.container.fitToViewport();
      }
    },
    /**
     * @return {?}
     */
    loadRequiredPackages : function() {
      return void 0 === ymaps.Map ? ymaps.load(["package.map"], this._initMapObject, this) : this.options.routePoints.length > 0 && void 0 === ymaps.route ? ymaps.load(["package.route"], this._initMapObject, this) : !this.options.traffic || void 0 !== ymaps.control && void 0 !== ymaps.control.TrafficControl ? void 0 : ymaps.load(["package.traffic", "package.controls"], this._initMapObject, this);
    },
    /**
     * @param {?} core
     * @return {undefined}
     */
    displayItinerary : function(core) {
      ymaps.route([this.from, this.to], {
        avoidTrafficJams : true
      }).then(function(dest) {

        var points = dest.getWayPoints(),
            config = lf.maps.leaflet.rawConfiguration,
            startMarker = jQuery.extend({}, config.yandexStartMarker),
            endMarker = jQuery.extend({}, config.yandexEndMarker),
            startWayPoint = points.get(0),
            endWayPoint = points.get(points.getLength() - 1);

        startWayPoint.options.set(startMarker);
        endWayPoint.options.set(endMarker);

        core.geoObjects.add(dest);

      }, function(m1) {
        alert("Error occurred: " + m1.message);
      });
    }
  });
}
if ("undefined" != typeof L) {
  lf.maps.leaflet.BaiduTileLayer = L.TileLayer.WMS.extend({
    includes : L.Mixin.Events,
    options : {
      minZoom : 0,
      maxZoom : 18,
      attribution : "",
      opacity : 1,
      traffic : false,
      routePoints : []
    },
    /**
     * @param {string} data
     * @param {?} options
     * @return {undefined}
     */
    initialize : function(data, options) {
      L.Util.setOptions(this, options);
      /** @type {string} */
      this._type = "baidu#" + (data || "map");
      if (this.options.routePoints.length > 0) {
        this.from = new BMap.Point(this.options.routePoints[0].lng, this.options.routePoints[0].lat);
        this.to = new BMap.Point(this.options.routePoints[1].lng, this.options.routePoints[1].lat);
      }
    },
    /**
     * @param {Object} map
     * @param {?} ds
     * @return {undefined}
     */
    onAdd : function(map, ds) {
      /** @type {Object} */
      this._map = map;
      this._insertAtTheBottom = ds;
      this._initContainer();
      this._initMapObject();
      map.on("viewreset", this._resetCallback, this);
      this._limitedUpdate = L.Util.limitExecByInterval(this._update, 150, this);
      map.on("move", this._update, this);
      this._reset();
      this._update();
    },
    /**
     * @return {undefined}
     */
    onRemove : function() {
      this._map._container.removeChild(this._container);
      this._map.off("viewreset", this._resetCallback, this);
      this._map.off("move", this._update, this);
    },
    /**
     * @return {?}
     */
    getAttribution : function() {
      return this.options.attribution;
    },
    /**
     * @param {number} opacity
     * @return {undefined}
     */
    setOpacity : function(opacity) {
      /** @type {number} */
      this.options.opacity = opacity;
      if (1 > opacity) {
        L.DomUtil.setOpacity(this._container, opacity);
      }
    },
    /**
     * @param {?} el
     * @param {?} newSize
     * @return {undefined}
     */
    setElementSize : function(el, newSize) {
      /** @type {string} */
      el.style.width = newSize.x + "px";
      /** @type {string} */
      el.style.height = newSize.y + "px";
    },
    /**
     * @return {undefined}
     */
    _initContainer : function() {
      var container = this._map._container;
      var text = container.firstChild;
      if (!this._container) {
        this._container = L.DomUtil.create("div", "leaflet-baidu-layer leaflet-top leaflet-left");
        this._container.id = "_BMapContainer_" + L.Util.stamp(this);
        /** @type {string} */
        this._container.style.zIndex = "auto";
      }
      container.insertBefore(this._container, text);
      this.setOpacity(this.options.opacity);
      this.setElementSize(this._container, this._map.getSize());
    },
    /**
     * @return {undefined}
     */
    _initMapObject : function() {
      if (!this._baidu) {
        this._baidu = new BMap.Map(this._container);
        this._baidu.addControl(new BMap.MapTypeControl({
          mapTypes : [BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP]
        }));
        var center = this._map.getCenter();
        var r20 = new BMap.Point(center.lng, center.lat);
        var restoreScript = this._map.getZoom();
        this._baidu.centerAndZoom(r20, restoreScript);
        if (this.options.routePoints.length > 0) {
          this.displayItinerary(this._baidu);
        }
        this._update();
      }
    },
    /**
     * @param {?} e
     * @return {undefined}
     */
    _resetCallback : function(e) {
      this._reset(e.hard);
    },
    /**
     * @return {undefined}
     */
    _reset : function() {
      this._initContainer();
    },
    /**
     * @return {undefined}
     */
    _update : function() {
      if (this._baidu) {
        var center = this._map.getCenter();
        var newCenter = new BMap.Point(center.lng, center.lat);
        var zoom = this._map.getZoom();
        this._baidu.setZoom(zoom);
        this._baidu.panTo(newCenter, {
          noAnimation : true
        });
        /** @type {number} */
        var n = 0;
        for (;Object.keys(this._map._layers).length > 1;n += 1) {
          var marker = this._map._layers[Object.keys(this._map._layers)[1]];
          var objectToMock = new BMap.Point(marker._latlng.lng, marker._latlng.lat);
          var iconUrl = jQuery("script#lf_mapping_api").data();
          var contentSize = iconUrl.lfConfiguration.numberMarker.iconSize;
          var pixelOffsetSetting = iconUrl.lfConfiguration.numberMarker.iconAnchor;
          var infoBoxClearanceSetting = iconUrl.lfConfiguration.numberMarker.textAnchor;
          var imgpath = new BMap.Icon(iconUrl.lfFoPath + iconUrl.lfConfiguration.numberMarker.iconUrl, new BMap.Size(contentSize.x, contentSize.y), {
            anchor : new BMap.Size(pixelOffsetSetting.x, pixelOffsetSetting.y),
            infoWindowAnchor : new BMap.Size(10, 0)
          });
          var m = new BMap.Marker(objectToMock, {
            icon : imgpath
          });
          var o = new BMap.Label(marker._icon.textContent, {
            offset : new BMap.Size(infoBoxClearanceSetting.x, infoBoxClearanceSetting.y)
          });
          o.setStyle({
            border : 0
          });
          m.setLabel(o);
          if (void 0 !== marker.pos_url) {
            this.addEventOnClick(m, marker);
          }
          this._map.removeLayer(marker);
          this.addOffsetToMarker(m);
        }
      }
    },
    /**
     * @param {?} marker
     * @return {undefined}
     */
    addOffsetToMarker : function(marker) {
      jQuery.ajax({
        url : this.baiduURL(marker.point),
        dataType : "jsonp",
        success : function(data) {
          var pos = new BMap.Point(atob(data.x), atob(data.y));
          marker.setPosition(pos);
          this._baidu.addOverlay(marker);
        }.bind(this)
      });
    },
    /**
     * @param {Object} vertex2
     * @return {?}
     */
    baiduURL : function(vertex2) {
      return "http://api.map.baidu.com/ag/coord/convert?from=2&to=4&x=" + vertex2.lng + "&y=" + vertex2.lat;
    },
    /**
     * @return {undefined}
     */
    displayItinerary : function() {
      var R = new BMap.DrivingRoute("\u4e2d\u56fd", {
        renderOptions : {
          map : this._baidu
        }
      });
      R.search(this.from, this.to);
    },
    /**
     * @param {HTMLElement} m1
     * @param {?} object
     * @return {undefined}
     */
    addEventOnClick : function(m1, object) {
      m1.addEventListener("click", function() {
        var materialArgs = object.pos_url.split("-")[0];
        jQuery.ajax({
          url : "/popup/" + materialArgs,
          dataType : "text",
          success : function(dataAndEvents) {
            this.openInfoWindow(new BMap.InfoWindow(dataAndEvents));
          }.bind(this)
        });
      });
    }
  });
}
lf.maps.leaflet.Map = Base.extend({
  /**
   * @param {?} root
   * @param {?} config
   * @param {?} options
   * @return {undefined}
   */
  constructor : function(root, config, options) {
    this.root = jQuery(root);
    var x = this.generateContainerId();
    this.root.append('<div id="' + x + '"></div>');
    this.container = jQuery("#" + x, this.root);
    this.container.width(this.root.innerWidth());
    this.container.height(this.root.innerHeight());
    /** @type {boolean} */
    this.loaded = false;
    this.loadedCallback = config;
    this.callbacks = {};
    this.map = new L.Map(this.container.attr("id"), options);
    this.map.attributionControl.setPrefix(null);
    this.service = jQuery("script#lf_mapping_api").data().lfApiModule;
    var $scope = this;
    this.map.on("load", function() {
      var relief = $scope.initLeafletLayer();
      $scope.map.addLayer(relief);
      /** @type {boolean} */
      $scope.loaded = true;
      $scope.mapLoaded();
    });
    this.map.on("move", function() {
      $scope.centerPointChanged();
    });
    this.map.on("zoomend", function() {
      $scope.zoomLevelChanged();
    });
    this.map.on("click", function() {
      $scope.mapClicked();
    });
    this.map.setView(new L.LatLng(0, 0), this.getPointOfSaleZoomLevel());
  },
  /**
   * @return {?}
   */
  initLeafletLayer : function() {
    return "tomtom" === this.service ? new lf.maps.leaflet.TomtomTileLayer("http://lbs.tomtom.com/lbs/wms/1213610065958", {
      apikey : lf.maps.leaflet.configuration.apikey,
      minZoom : 2,
      maxZoom : 17
    }) : "yandex" === this.service ? new lf.maps.leaflet.YandexTileLayer : "baidu" === this.service ? new lf.maps.leaflet.BaiduTileLayer : void 0;
  },
  /**
   * @param {?} bbox
   * @return {undefined}
   */
  fitBounds : function(bbox) {
    var bounds = new L.LatLngBounds(bbox.sw, bbox.ne);
    this.map.fitBounds(bounds);
    this.center = bbox.getCenterPoint();
    this.centerPointChanged();
    this.zoomLevelChanged();
  },
  /**
   * @return {undefined}
   */
  redraw : function() {
    this.container.width(this.root.innerWidth());
    this.container.height(this.root.innerHeight());
    this.map.invalidateSize();
  },
  /**
   * @return {?}
   */
  getCenter : function() {
    return this.center;
  },
  /**
   * @return {?}
   */
  getZoom : function() {
    return this.map.getZoom();
  },
  /**
   * @return {?}
   */
  getMaxZoom : function() {
    return this.map.getMaxZoom();
  },
  /**
   * @return {?}
   */
  getPointOfSaleZoomLevel : function() {
    return lf.maps.leaflet.configuration.posZoomLevel;
  },
  /**
   * @return {?}
   */
  getMaxZIndex : function() {
    return 1E6;
  },
  /**
   * @param {?} latlng
   * @return {?}
   */
  getPixelForLatLng : function(latlng) {
    var scrollCoord = this.map.layerPointToContainerPoint(this.map.latLngToLayerPoint(this.getLatLng(latlng)));
    return{
      x : scrollCoord.x,
      y : scrollCoord.y
    };
  },
  /**
   * @param {?} min
   * @return {?}
   */
  getLatLngForPixel : function(min) {
    var previous = new L.Point(min.x, min.y);
    var loc = this.map.unproject(previous.add(this.map._getTopLeftPoint()));
    var latlng = {
      lat : loc.lat,
      lng : loc.lng
    };
    return latlng;
  },
  /**
   * @return {?}
   */
  getViewportBounds : function() {
    var bounds = this.map.getBounds();
    var loc = bounds.getSouthWest();
    var center = bounds.getNorthEast();
    var o = {
      lng : loc.lng,
      lat : loc.lat
    };
    var opts = {
      lng : center.lng,
      lat : center.lat
    };
    var d = new lf.maps.Bounds(o, opts);
    return d;
  },
  /**
   * @param {?} center
   * @return {undefined}
   */
  setCenter : function(center) {
    this.center = center;
    this.map.setView(this.getLatLng(this.center), this.getZoom(), false);
    this.centerPointChanged();
  },
  /**
   * @param {?} latlng
   * @return {?}
   */
  getLatLng : function(latlng) {
    return new L.LatLng(latlng.lat, latlng.lng);
  },
  /**
   * @param {number} zoom
   * @return {undefined}
   */
  setZoom : function(zoom) {
    this.map.setZoom(zoom);
  },
  /**
   * @param {string} event
   * @param {Function} fn
   * @return {?}
   */
  bind : function(event, fn) {
    if ("undefined" == typeof this.callbacks[event]) {
      /** @type {Array} */
      this.callbacks[event] = [];
    }
    var expected = {
      id : lf.app.uniqueId(),
      event : event,
      /** @type {Function} */
      fn : fn
    };
    this.callbacks[event].push(expected);
    return expected;
  },
  /**
   * @param {Object} listener
   * @return {undefined}
   */
  unbind : function(listener) {
    var ary = this.callbacks[listener.event];
    /** @type {number} */
    var i = 0;
    for (;i < ary.length;i += 1) {
      var member = ary[i];
      if (member.id === listener.id) {
        ary.splice(i, 1);
        break;
      }
    }
  },
  /**
   * @param {(Array|number)} points
   * @return {undefined}
   */
  displayRoute : function(points) {
    if (this.routeLayer) {
      this.map.removeLayer(this.routeLayer);
    }
    if ("tomtom" === this.service) {
      this.routeLayer = new lf.maps.leaflet.TomtomTileLayer("http://lbs.tomtom.com/lbs/wms/1213610065958", {
        apikey : lf.maps.leaflet.configuration.apikey,
        minZoom : 2,
        maxZoom : 17,
        layers : "canvas",
        format : "image/gif",
        routekey : points.routeKey
      });
    } else {
      if ("yandex" === this.service) {
        this.removeLayers();
        this.routeLayer = new lf.maps.leaflet.YandexTileLayer("map", {
          routePoints : [points[0], points[points.length - 1]]
        });
      } else {
        if ("baidu" === this.service) {
          this.removeLayers();
          this.routeLayer = new lf.maps.leaflet.BaiduTileLayer("map", {
            routePoints : points
          });
        }
      }
    }
    this.map.addLayer(this.routeLayer);
  },
  /**
   * @param {Text} elements
   * @return {undefined}
   */
  visualizeBounds : function(elements) {
    if (this.visualizedBounds) {
      this.map.removeLayer(this.visualizedBounds);
    }
    if (elements) {
      elements = jQuery.makeArray(elements);
      this.visualizedBounds = new L.LayerGroup;
      var options = this;
      jQuery.each(elements, function() {
        /** @type {Array} */
        var latLngs = [this.getLatLng(this.sw), this.getLatLng(this.getNorthWest()), this.getLatLng(this.ne), this.getLatLng(this.getSouthEast()), this.getLatLng(this.sw)];
        var polyline = new L.Polyline(latLngs, {
          fillColor : "#ff7800",
          color : "#000000",
          opacity : 1,
          weight : 2,
          clickable : false
        });
        options.visualizedBounds.addLayer(polyline);
      });
      this.map.addLayer(this.visualizedBounds);
    }
  },
  /**
   * @return {undefined}
   */
  centerPointChanged : function() {
    this.notifyCallbacksForEvent("bounds_changed");
  },
  /**
   * @return {undefined}
   */
  zoomLevelChanged : function() {
    this.notifyCallbacksForEvent("zoom_changed");
    this.notifyCallbacksForEvent("bounds_changed");
  },
  /**
   * @return {undefined}
   */
  mapClicked : function() {
    this.notifyCallbacksForEvent("clicked");
  },
  /**
   * @return {undefined}
   */
  mapLoaded : function() {
    if (this.loadedCallback) {
      this.loadedCallback.call(null, this);
    }
    this.tilesLoaded();
  },
  /**
   * @return {undefined}
   */
  tilesLoaded : function() {
    if ("baidu" !== this.service) {
      this.notifyCallbacksForEvent("tilesloaded");
    }
  },
  /**
   * @param {string} event
   * @return {undefined}
   */
  notifyCallbacksForEvent : function(event) {
    var callbacks = this.callbacks[event];
    if (callbacks) {
      /** @type {number} */
      var i = 0;
      for (;i < callbacks.length;i += 1) {
        callbacks[i].fn();
      }
    }
  },
  /**
   * @return {?}
   */
  generateContainerId : function() {
    if (!lf.maps.leaflet.Map.instanceCount) {
      /** @type {number} */
      lf.maps.leaflet.Map.instanceCount = 0;
    }
    lf.maps.leaflet.Map.instanceCount = lf.maps.leaflet.Map.instanceCount + 1;
    return "lf-leaflet-map-container-" + lf.maps.leaflet.Map.instanceCount.toString();
  },
  /**
   * @return {undefined}
   */
  removeLayers : function() {
    /** @type {number} */
    var t = 0;
    for (;Object.keys(this.map._layers).length;t += 1) {
      var marker = this.map._layers[Object.keys(this.map._layers)[0]];
      this.map.removeLayer(marker);
    }
  }
});
lf.maps.leaflet.FrontOfficeMarker = Base.extend({
  /**
   * @param {Object} pos
   * @param {?} options
   * @return {undefined}
   */
  constructor : function(pos, options) {
    this.callbacks = {};
    this.setPosition(pos);
    this.build(pos, options);
  },
  /**
   * @param {number} index
   * @return {undefined}
   */
  setZIndex : function(index) {
    this.marker.setZIndexOffset(index);
  },
  /**
   * @return {?}
   */
  getZIndex : function() {
    return this.marker.options.zIndexOffset;
  },
  /**
   * @param {Object} text
   * @return {undefined}
   */
  showText : function(text) {
    this.marker.bindPopup(text);
    this.marker.openPopup();
  },
  /**
   * @return {undefined}
   */
  hideText : function() {
    if (this.map) {
      this.map.map.closePopup();
    }
  },
  /**
   * @param {Object} recurring
   * @return {undefined}
   */
  setMap : function(recurring) {
    var m = this.map;
    /** @type {Object} */
    this.map = recurring;
    if (this.marker) {
      if (this.map) {
        if (m) {
          m.map.removeLayer(this.marker);
        }
        if (this.isVisible) {
          this.map.map.addLayer(this.marker);
        }
      } else {
        if (m) {
          m.map.removeLayer(this.marker);
        }
      }
    }
  },
  /**
   * @param {number} label
   * @return {undefined}
   */
  setLabel : function(label) {
    /** @type {number} */
    this.label = label;
    if (this.marker) {
      /** @type {number} */
      this.marker.options.icon.options.text = label;
      if (this.marker._icon) {
        var button = jQuery(".leaflet-marker-icon-label", this.marker._icon);
        button.text(label);
      }
    }
  },
  /**
   * @param {Object} pos
   * @return {undefined}
   */
  setPosition : function(pos) {
    this.latlng = new L.LatLng(pos.lat, pos.lng);
    if (this.marker) {
      this.marker.setLatLng(this.latlng);
    }
  },
  /**
   * @return {?}
   */
  getPosition : function() {
    return this.latlng;
  },
  /**
   * @param {boolean} recurring
   * @return {undefined}
   */
  setVisible : function(recurring) {
    if (!this.isVisible && recurring) {
      if (this.map) {
        this.map.map.addLayer(this.marker);
      }
      /** @type {boolean} */
      this.isVisible = true;
    } else {
      if (this.isVisible && !recurring) {
        if (this.map) {
          this.map.map.removeLayer(this.marker);
        }
        /** @type {boolean} */
        this.isVisible = false;
      }
    }
  },
  /**
   * @param {boolean} recurring
   * @return {undefined}
   */
  setPositioningMarkerVisible : function(recurring) {
    this.setVisible(recurring);
  },
  /**
   * @param {string} event
   * @param {Function} fn
   * @param {Function} callback
   * @return {undefined}
   */
  bind : function(event, fn, callback) {
    if ("undefined" == typeof this.callbacks[event]) {
      /** @type {Array} */
      this.callbacks[event] = [];
    }
    if (2 === arguments.length) {
      callback = arguments[1];
      /** @type {null} */
      fn = null;
    }
    this.callbacks[event].push([callback, fn]);
  },
  /**
   * @param {Object} pattern
   * @param {?} options
   * @return {undefined}
   */
  build : function(pattern, options) {
    this.marker = new L.Marker(this.latlng, options);
    this.marker.pos_url = pattern.url;
    /** @type {boolean} */
    this.isVisible = false;
    var tableview = this;
    this.marker.on("click", function() {
      tableview.notifyCallbacksForEvent("click");
    });
  },
  /**
   * @param {string} event
   * @return {undefined}
   */
  notifyCallbacksForEvent : function(event) {
    var codeSegments = this.callbacks[event];
    if (codeSegments) {
      /** @type {number} */
      var i = 0;
      for (;i < codeSegments.length;i += 1) {
        codeSegments[i][0].call(null, {
          data : codeSegments[i][1]
        });
      }
    }
  }
});
lf.maps.leaflet.ClusterMarker = lf.maps.leaflet.FrontOfficeMarker.extend({
  /**
   * @param {?} name
   * @return {undefined}
   */
  constructor : function(name) {
    var $this = new lf.maps.leaflet.ClusterMarker.Icon;
    /** @type {string} */
    $this.options.text = "x";
    this.base(name, {
      icon : $this
    });
    this.setVisible(true);
  },
  /**
   * @param {number} label
   * @return {undefined}
   */
  setLabel : function(label) {
    this.base("x " + label);
  }
});
lf.maps.leaflet.InactiveClusterMarker = lf.maps.leaflet.FrontOfficeMarker.extend({
  /**
   * @param {?} name
   * @param {Object} container
   * @return {undefined}
   */
  constructor : function(name, container) {
    var $this = new lf.maps.leaflet.InactiveClusterMarker.Icon;
    /** @type {string} */
    $this.options.text = "x";
    this.base(name, {
      icon : $this
    });
    if (null !== container) {
      if (void 0 !== container) {
        container.addLayer(this.marker);
      }
    }
    this.setVisible(true);
  },
  /**
   * @param {number} label
   * @return {undefined}
   */
  setLabel : function(label) {
    this.base("x " + label);
  }
});
lf.maps.leaflet.InactiveMarker = lf.maps.leaflet.FrontOfficeMarker.extend({
  /**
   * @param {?} name
   * @param {Object} container
   * @return {undefined}
   */
  constructor : function(name, container) {
    var imgpath = new lf.maps.leaflet.InactiveMarker.Icon;
    this.base(name, {
      icon : imgpath
    });
    if (null !== container) {
      if (void 0 !== container) {
        container.addLayer(this.marker);
      }
    }
    this.setVisible(false);
  }
});
lf.maps.leaflet.NumberMarker = lf.maps.leaflet.FrontOfficeMarker.extend({
  /**
   * @param {?} config
   * @param {?} name
   * @param {Object} container
   * @return {undefined}
   */
  constructor : function(config, name, container) {
    var $this = new lf.maps.leaflet.NumberMarker.Icon;
    $this.options.text = config.toString();
    this.base(name, {
      icon : $this
    });
    if (null !== container) {
      if (void 0 !== container) {
        container.addLayer(this.marker);
      }
    }
    this.setVisible(true);
  }
});
lf.maps.leaflet.SingleMarker = lf.maps.leaflet.FrontOfficeMarker.extend({
  /**
   * @param {?} name
   * @return {undefined}
   */
  constructor : function(name) {
    var imgpath = new lf.maps.leaflet.SingleMarker.Icon;
    this.base(name, {
      icon : imgpath
    });
    this.setVisible(true);
  }
});
lf.maps.leaflet.DirectionsService = Base.extend({
  /**
   * @param {?} del
   * @param {Object} origin
   * @param {?} info
   * @param {?} beforeExit
   * @return {undefined}
   */
  constructor : function(del, origin, info, beforeExit) {
    this.delegate = del;
    /** @type {Object} */
    this.origin = origin;
    this.destination = info;
    if (info.lat) {
      this.biasPoint = info;
    }
    beforeExit(this);
  },
  /**
   * @return {undefined}
   */
  process : function() {
    if ("string" == typeof this.destination) {
      this.geocode("destination");
    }
    if ("string" == typeof this.origin) {
      this.geocode("origin");
    }
    this.processIfPossible();
  },
  /**
   * @return {undefined}
   */
  processIfPossible : function() {
    if ("string" != typeof this.origin) {
      if ("string" != typeof this.destination) {
        this.calculateRoute();
      }
    }
  },
  /**
   * @param {?} dataAndEvents
   * @return {?}
   */
  resultMatchesGeolocation : function(dataAndEvents) {
    var evt = dataAndEvents.route[0].routeLegs[0].endWaypointLocation;
    return this.delegate.resultMatchesGeolocation(evt.latitude, evt.longitude);
  }
});
/**
 * @param {?} dataAndEvents
 * @param {?} regex
 * @param {?} ignoreMethodDoesntExist
 * @param {?} deepDataAndEvents
 * @return {?}
 */
lf.maps.leaflet.DirectionsService.routeForPoint = function(dataAndEvents, regex, ignoreMethodDoesntExist, deepDataAndEvents) {
  var lfApiModule = jQuery("script#lf_mapping_api").data().lfApiModule;
  return "tomtom" === lfApiModule ? new lf.maps.leaflet.TomtomDirectionsService(dataAndEvents, regex, ignoreMethodDoesntExist, deepDataAndEvents) : "yandex" === lfApiModule ? new lf.maps.leaflet.YandexDirectionsService(dataAndEvents, regex, ignoreMethodDoesntExist, deepDataAndEvents) : "baidu" === lfApiModule ? new lf.maps.leaflet.BaiduDirectionsService(dataAndEvents, regex, ignoreMethodDoesntExist, deepDataAndEvents) : void 0;
};
/**
 * @param {?} dataAndEvents
 * @param {?} callback
 * @param {?} regex
 * @param {?} deepDataAndEvents
 * @return {?}
 */
lf.maps.leaflet.DirectionsService.routeForAddress = function(dataAndEvents, callback, regex, deepDataAndEvents) {
  var lfApiModule = jQuery("script#lf_mapping_api").data().lfApiModule;
  return "tomtom" === lfApiModule ? new lf.maps.leaflet.TomtomDirectionsService(dataAndEvents, callback, regex, deepDataAndEvents) : "yandex" === lfApiModule ? new lf.maps.leaflet.YandexDirectionsService(dataAndEvents, callback, regex, deepDataAndEvents) : "baidu" === lfApiModule ? new lf.maps.leaflet.BaiduDirectionsService(dataAndEvents, callback, regex, deepDataAndEvents) : void 0;
};
Class.mixin(lf.maps.leaflet.DirectionsService, Delegatable);
lf.maps.leaflet.PolygonLine = Base.extend({
  /**
   * @param {Function} recurring
   * @param {Object} config
   * @return {undefined}
   */
  constructor : function(recurring, config) {
    this.setMap(recurring);
    this.points = config.points;
    this.color = config.color;
    this.line = new L.Polyline(this.pointsToLeaflet(config.points), this.getLeafletOptions());
    this.map.map.addLayer(this.line);
  },
  /**
   * @param {Function} recurring
   * @return {undefined}
   */
  setMap : function(recurring) {
    var m = this.map;
    /** @type {Function} */
    this.map = recurring;
    if (this.line) {
      if (this.map) {
        if (m) {
          m.map.removeLayer(this.line);
        }
        this.map.map.addLayer(this.line);
      } else {
        if (m) {
          m.map.removeLayer(this.line);
        }
      }
    }
  },
  /**
   * @return {?}
   */
  getMap : function() {
    return this.map;
  },
  /**
   * @param {?} color
   * @return {undefined}
   */
  setColor : function(color) {
    this.color = color;
    if (this.line) {
      this.line.setStyle(this.getLeafletOptions());
    }
  },
  /**
   * @return {?}
   */
  getColor : function() {
    return this.color;
  },
  /**
   * @param {Array} points
   * @return {undefined}
   */
  setPoints : function(points) {
    /** @type {Array} */
    this.points = points;
    if (this.line) {
      this.line.setLatLngs(this.pointsToLeaflet(points));
    }
  },
  /**
   * @return {?}
   */
  getPoints : function() {
    return this.points;
  },
  /**
   * @return {?}
   */
  getLeafletOptions : function() {
    return{
      color : this.colorToRGBString(this.color),
      opacity : this.color.a,
      clickable : false,
      smoothFactor : false
    };
  },
  /**
   * @param {Node} rgba
   * @return {?}
   */
  colorToRGBString : function(rgba) {
    /**
     * @param {string} str
     * @param {number} opt_attributes
     * @return {?}
     */
    function endsWith(str, opt_attributes) {
      /** @type {string} */
      var code = "" + str;
      for (;code.length < opt_attributes;) {
        /** @type {string} */
        code = "0" + code;
      }
      return code;
    }
    /** @type {string} */
    var errStr = parseInt(255 * rgba.r, 10).toString(16);
    /** @type {string} */
    var fileNameLowercase = parseInt(255 * rgba.g, 10).toString(16);
    /** @type {string} */
    var simple = parseInt(255 * rgba.b, 10).toString(16);
    return sprintf("#%s%s%s", endsWith(errStr, 2), endsWith(fileNameLowercase, 2), endsWith(simple, 2));
  },
  /**
   * @param {Array} points
   * @return {?}
   */
  pointsToLeaflet : function(points) {
    /** @type {Array} */
    var eventPath = [];
    /** @type {number} */
    var i = 0;
    for (;i < points.length;i += 1) {
      var point = points[i];
      eventPath.push(new L.LatLng(point.lat, point.lng));
    }
    return eventPath;
  }
});
lf.maps.leaflet.BaiduDirectionsService = lf.maps.leaflet.DirectionsService.extend({
  /**
   * @param {string} prop
   * @return {undefined}
   */
  geocode : function(prop) {
    var encodedValue = jQuery.trim(this[prop]);
    var apikey = lf.maps.leaflet.configuration.apikey;
    /** @type {string} */
    var which = "http://api.map.baidu.com/geocoder/v2/?address=" + encodeURIComponent(encodedValue) + "&output=json&ak=" + apikey + "&callback=?";
    var self = this;
    jQuery.getJSON(which, function(details) {
      var message = details.result;
      if (void 0 === message || 0 === message.length) {
        self.callDelegateMethod("didReceiveFailingDirections", [self]);
      } else {
        self[prop] = {
          lat : message.location.lat,
          lng : message.location.lng
        };
        self.processIfPossible();
      }
    });
  },
  /**
   * @return {undefined}
   */
  calculateRoute : function() {
    /** @type {string} */
    var ns = [this.origin.lat, this.origin.lng].join(",");
    /** @type {string} */
    var name = [this.destination.lat, this.destination.lng].join(",");
    var footer = (encodeURIComponent(ns + ":" + name), lf.maps.leaflet.configuration.apikey);
    /** @type {string} */
    var src = 'http://api.map.baidu.com/direction/v1?origin=' + ns + '&destination=' + name + '&origin_region=中国&destination_region=中国&output=json&ak=' + footer + '&callback=?';
    var self = this;
    jQuery.getJSON(src, function(res) {
      var data = res.result;
      if (void 0 === data || 0 === data.length) {
        self.callDelegateMethod("didReceiveFailingDirections", [self]);
      } else {
        self.callDelegateMethod("didReceiveSuccessfulDirections", [self, self.convertRoute(data)]);
      }
    });
  },
  /**
   * @param {Object} result
   * @return {?}
   */
  convertRoute : function(result) {
    var test = result.routes[0];
    var codeSegments = test.steps;
    /** @type {Array} */
    var steps = [];
    /** @type {Array} */
    var points = [result.origin.originPt, result.destination.destinationPt];
    /** @type {number} */
    var i = 0;
    for (;i < codeSegments.length;i += 1) {
      var self = codeSegments[i];
      steps.push({
        description : self.instructions,
        distance : self.distance / 1E3
      });
    }
    return{
      copyrights : "",
      estimatedDistance : test.distance / 1E3,
      estimatedDuration : test.duration,
      steps : steps,
      points : points
    };
  }
});
lf.maps.leaflet.TomtomDirectionsService = lf.maps.leaflet.DirectionsService.extend({
  /**
   * @param {string} prop
   * @return {undefined}
   */
  geocode : function(prop) {
    var encodedValue = jQuery.trim(this[prop]);
    if (0 !== encodedValue.length) {
      /** @type {string} */
      var optsData = "";
      if (this.biasPoint) {
        /** @type {string} */
        optsData = ";biasPoint=" + this.biasPoint.lat + "," + this.biasPoint.lng;
      }
      var apikey = lf.maps.leaflet.configuration.apikey;
      /** @type {string} */
      var which = "http://lbs.tomtom.com/lbs/services/geocode/1/query/" + encodeURIComponent(encodedValue) + "/jsonp/" + apikey + ";language=" + I18n.locale + optsData + "?jsonp=?";
      var self = this;
      jQuery.getJSON(which, function(a) {
        var al = a.geoResponse;
        if (al["@count"] > 0 && al.geoResult) {
          /** @type {null} */
          var loc = null;
          loc = 1 === al["@count"] ? al.geoResult : al.geoResult[0];
          if (!loc.latitude) {
            self.callDelegateMethod("didReceiveFailingDirections", [self]);
          }
          self[prop] = {
            lat : loc.latitude,
            lng : loc.longitude
          };
          self.processIfPossible();
        } else {
          self.callDelegateMethod("didReceiveFailingDirections", [self]);
        }
      });
    } else {
      this.callDelegateMethod("didReceiveFailingDirections", [this]);
    }
  },
  /**
   * @return {undefined}
   */
  calculateRoute : function() {
    var apikey = lf.maps.leaflet.configuration.apikey;
    /** @type {string} */
    var ns = [this.origin.lat, this.origin.lng].join(",");
    /** @type {string} */
    var name = [this.destination.lat, this.destination.lng].join(",");
    /** @type {string} */
    var redirect_uri = encodeURIComponent(ns + ":" + name);
    /** @type {string} */
    var which = "http://lbs.tomtom.com/lbs/services/route/1/" + redirect_uri + "/Quickest/jsonp/" + apikey + ";language=" + I18n.locale + ";iqRoutes=2;avoidTraffic=true;includeTraffic=true?jsonp=?";
    var test = this;
    jQuery.getJSON(which, function(compiled) {
      if (compiled.route) {
        var nested = test.convertRoute(compiled.route);
        test.callDelegateMethod("didReceiveSuccessfulDirections", [test, nested]);
      } else {
        test.callDelegateMethod("didReceiveFailingDirections", [test]);
      }
    });
  },
  /**
   * @param {Object} prev
   * @return {?}
   */
  convertRoute : function(prev) {
    var result;
    var codeSegments = prev.instructions.instruction;
    /** @type {Array} */
    var steps = [];
    /** @type {Array} */
    var output = [];
    /** @type {number} */
    var totalRadius = 0;
    /** @type {number} */
    var i = 0;
    for (;i < codeSegments.length;i += 1) {
      result = codeSegments[i];
      steps.push({
        description : [result.text, result.roadName, result.roadNumber].join(" "),
        distance : result.distanceMeters / 1E3 - totalRadius
      });
      /** @type {number} */
      totalRadius = result.distanceMeters / 1E3;
      output.push({
        lat : result.point.latitude,
        lng : result.point.longitude
      });
    }
    output.routeKey = prev.summary.routeKey;
    return{
      copyrights : "",
      estimatedDistance : prev.summary.totalDistanceMeters / 1E3,
      estimatedDuration : prev.summary.totalTimeSeconds,
      steps : steps,
      points : output
    };
  }
});
lf.maps.leaflet.YandexDirectionsService = lf.maps.leaflet.DirectionsService.extend({
  /**
   * @param {string} prop
   * @return {undefined}
   */
  geocode : function(prop) {
    var self = this;
    ymaps.geocode(jQuery.trim(this[prop])).then(function(res) {
      var ll = res.geoObjects.get(0).geometry.getCoordinates();
      self[prop] = {
        lat : ll[0],
        lng : ll[1]
      };
      self.processIfPossible();
    }, function() {
      self.callDelegateMethod("didReceiveFailingDirections", [self]);
    });
  },
  /**
   * @return {undefined}
   */
  calculateRoute : function() {
    /** @type {string} */
    this.startPoint = [this.origin.lat, this.origin.lng].join(",");
    /** @type {string} */
    this.endPoint = [this.destination.lat, this.destination.lng].join(",");
    var self = this;
    ymaps.route([this.startPoint, this.endPoint], {
      avoidTrafficJams : true
    }).then(function(prev) {
      self.callDelegateMethod("didReceiveSuccessfulDirections", [self, self.convertRoute(prev)]);
    }, function() {
      self.callDelegateMethod("didReceiveFailingDirections", [self]);
    });
  },
  /**
   * @param {Object} obj
   * @return {?}
   */
  convertRoute : function(obj) {
    var codeSegments = obj.getPaths().get(0).getSegments();
    /** @type {Array} */
    var steps = [];
    /** @type {Array} */
    var output = [];
    /** @type {number} */
    var container = 0;
    /** @type {number} */
    var i = 0;
    for (;i < codeSegments.length;i += 1) {
      container = codeSegments[i];
      steps.push({
        description : [container.getHumanAction(), container.getStreet()].join(" "),
        distance : container.getLength() / 1E3
      });
      output.push({
        lat : container.getCoordinates()[0][0],
        lng : container.getCoordinates()[0][1]
      });
    }
    return{
      copyrights : "",
      estimatedDistance : obj.getPaths().get(0).getLength() / 1E3,
      estimatedDuration : obj.getPaths().get(0).getTime(),
      steps : steps,
      points : output,
      from : this.startPoint,
      to : this.endPoint
    };
  }
});
/**
 * @param {Object} options
 * @return {undefined}
 */
lf.maps.mappy.initialize = function(options) {
  options = jQuery.extend({
    posZoomLevel : 13,
    clusterMarker : {},
    inactiveClusterMarker : {},
    inactiveMarker : {},
    numberMarker : {},
    singleMarker : {}
  }, options);
  this.loadConfiguration(options);
  L.Mappy.setToken(this.configuration.apikey);
};
/**
 * @param {Object} namespace
 * @return {undefined}
 */
lf.maps.mappy.loadConfiguration = function(namespace) {
  this.configuration = {};
  /**
   * @param {string} prop
   * @return {?}
   */
  var testPropsAll = function(prop) {
    return prop.charAt(0).toUpperCase() + prop.slice(1);
  };
  /** @type {null} */
  var data = null;
  var prop;
  for (prop in namespace) {
    data = namespace[prop];
    if (data && ("object" == typeof data && /\w+Marker$/.test(prop))) {
      var tile = this[testPropsAll(prop)];
      if (tile) {
        tile.Icon = this.createIconClass(data);
      }
    } else {
      this.configuration[prop] = data;
    }
  }
};
/**
 * @param {Object} nodes
 * @return {?}
 */
lf.maps.mappy.createIconClass = function(nodes) {
  var store = {};
  /** @type {null} */
  var node = null;
  var name;
  for (name in nodes) {
    node = nodes[name];
    if (node) {
      if (node.hasOwnProperty("x")) {
        if (node.hasOwnProperty("y")) {
          node = new L.Point(Number(node.x), Number(node.y));
        }
      }
    }
    if (node) {
      if (lf_asset_base) {
        if (/\w+Url$/.test(name)) {
          node = lf_asset_base + node;
        }
      }
    }
    store[name] = node;
  }
  return this.LabelIcon.extend({
    options : store
  });
};
lf.maps.mappy.ClusterMarker = lf.maps.leaflet.FrontOfficeMarker.extend({
  /**
   * @param {?} name
   * @return {undefined}
   */
  constructor : function(name) {
    var $this = new lf.maps.mappy.ClusterMarker.Icon;
    /** @type {string} */
    $this.options.text = "x";
    this.base(name, {
      icon : $this
    });
    this.setVisible(true);
  },
  /**
   * @param {number} label
   * @return {undefined}
   */
  setLabel : function(label) {
    this.base("x " + label);
  }
});
lf.maps.mappy.DirectionsService = Base.extend({
  /**
   * @param {?} del
   * @param {Object} origin
   * @param {?} config
   * @param {?} beforeExit
   * @return {undefined}
   */
  constructor : function(del, origin, config, beforeExit) {
    this.delegate = del;
    /** @type {Object} */
    this.origin = origin;
    this.destination = config;
    beforeExit(this);
  },
  /**
   * @return {undefined}
   */
  process : function() {
    var self = this;
    var handleFoo = {
      vehicle : L.Mappy.RouteModes.CAR,
      cost : "length",
      gascost : 1,
      gas : "petrol",
      nopass : 0,
      notoll : 0,
      caravane : 0,
      infotraffic : 0
    };
    this.normalizeLocation(this.origin, function(dataAndEvents) {
      self.normalizeLocation(self.destination, function(finish) {
        L.Mappy.Services.route([dataAndEvents, finish], handleFoo, function(dataAndEvents) {
          var status = self.convertResult(dataAndEvents);
          self.callDelegateMethod("didReceiveSuccessfulDirections", [self, status]);
        }, function() {
          self.callDelegateMethod("didReceiveFailingDirections", [self]);
        });
      }, function() {
        self.callDelegateMethod("didReceiveFailingDirections", [self]);
      });
    }, function() {
      self.callDelegateMethod("didReceiveFailingDirections", [self]);
    });
  },
  /**
   * @param {?} dataAndEvents
   * @return {?}
   */
  convertResult : function(dataAndEvents) {
    var data = dataAndEvents.routes.route;
    var codeSegments = data.actions.action;
    /** @type {Array} */
    var steps = [];
    /** @type {Array} */
    var points = [];
    /** @type {number} */
    var i = 0;
    for (;i < codeSegments.length;i += 1) {
      var item = codeSegments[i];
      points.push({
        lng : item.x,
        lat : item.y
      });
      steps.push({
        description : item.label,
        distance : item.meter / 1E3
      });
    }
    points.polyline = L.polyline(data["polyline-definition"].polyline);
    return{
      estimatedDistance : data.summary.length / 1E3,
      estimatedDuration : data.summary.time,
      steps : steps,
      points : points
    };
  },
  /**
   * @param {Object} o
   * @param {Function} callback
   * @param {Function} $sanitize
   * @return {undefined}
   */
  normalizeLocation : function(o, callback, $sanitize) {
    if ("undefined" != typeof o.lat && "undefined" != typeof o.lng) {
      callback(o);
    } else {
      if ("string" == typeof o) {
        L.Mappy.Services.geocode(o, function(dataAndEvents) {
          var obj = dataAndEvents[0].Point.coordinates.split(",").reverse();
          callback(L.latLng(obj));
        }, function() {
          $sanitize();
        });
      } else {
        $sanitize();
      }
    }
  }
});
/**
 * @param {Object} dataAndEvents
 * @param {boolean} regex
 * @param {boolean} deepDataAndEvents
 * @param {boolean} ignoreMethodDoesntExist
 * @return {?}
 */
lf.maps.mappy.DirectionsService.routeForPoint = function(dataAndEvents, regex, deepDataAndEvents, ignoreMethodDoesntExist) {
  return new lf.maps.mappy.DirectionsService(dataAndEvents, regex, deepDataAndEvents, ignoreMethodDoesntExist);
};
/**
 * @param {Element} dataAndEvents
 * @param {number} callback
 * @param {number} regex
 * @param {Function} deepDataAndEvents
 * @return {?}
 */
lf.maps.mappy.DirectionsService.routeForAddress = function(dataAndEvents, callback, regex, deepDataAndEvents) {
  return new lf.maps.mappy.DirectionsService(dataAndEvents, callback, regex, deepDataAndEvents);
};
Class.mixin(lf.maps.mappy.DirectionsService, Delegatable);
lf.maps.mappy.InactiveClusterMarker = lf.maps.leaflet.FrontOfficeMarker.extend({
  /**
   * @param {?} name
   * @param {Object} container
   * @return {undefined}
   */
  constructor : function(name, container) {
    var $this = new lf.maps.mappy.InactiveClusterMarker.Icon;
    /** @type {string} */
    $this.options.text = "x";
    this.base(name, {
      icon : $this
    });
    if (null !== container) {
      if (void 0 !== container) {
        container.addLayer(this.marker);
      }
    }
    this.setVisible(true);
  }
});
lf.maps.mappy.InactiveMarker = lf.maps.leaflet.FrontOfficeMarker.extend({
  /**
   * @param {?} name
   * @param {Object} container
   * @return {undefined}
   */
  constructor : function(name, container) {
    var imgpath = new lf.maps.mappy.InactiveMarker.Icon;
    this.base(name, {
      icon : imgpath
    });
    if (null !== container) {
      if (void 0 !== container) {
        container.addLayer(this.marker);
      }
    }
    this.setVisible(false);
  }
});
if ("undefined" != typeof L) {
  lf.maps.mappy.LabelIcon = lf.maps.leaflet.LabelIcon.extend({});
}
lf.maps.mappy.Map = lf.maps.leaflet.Map.extend({
  /**
   * @param {?} root
   * @param {?} config
   * @param {Object} options
   * @return {undefined}
   */
  constructor : function(root, config, options) {
    this.root = jQuery(root);
    var x = this.generateContainerId();
    this.root.append('<div id="' + x + '"></div>');
    this.container = jQuery("#" + x, this.root);
    this.container.width(this.root.innerWidth());
    this.container.height(this.root.innerHeight());
    /** @type {boolean} */
    this.loaded = false;
    this.loadedCallback = config;
    this.callbacks = {};
    this.map = new L.Mappy.Map(this.container.attr("id"), jQuery.extend({
      logoControl : {
        dir : "/javascripts/mappy/images/"
      },
      scrollWheelZoom : false
    }, options || {}));
    var $scope = this;
    this.map.on("load", function() {
      /** @type {boolean} */
      $scope.loaded = true;
      $scope.mapLoaded();
    });
    this.map.on("move", function() {
      $scope.centerPointChanged();
    });
    this.map.on("zoomend", function() {
      $scope.zoomLevelChanged();
    });
    this.map.on("click", function() {
      $scope.mapClicked();
    });
    this.map.setView(new L.LatLng(0, 0), this.getPointOfSaleZoomLevel());
  },
  /**
   * @return {?}
   */
  getPointOfSaleZoomLevel : function() {
    return lf.maps.mappy.configuration.posZoomLevel;
  },
  /**
   * @param {?} latlng
   * @return {?}
   */
  getLatLng : function(latlng) {
    return new L.LatLng(latlng.lat, latlng.lng);
  },
  /**
   * @param {Array} points
   * @return {undefined}
   */
  displayRoute : function(points) {
    if (this.routeLayer) {
      this.map.removeLayer(this.routeLayer);
    }
    this.routeLayer = new lf.maps.mappy.PolygonLine(this, {
      points : points,
      color : {
        r : 1,
        g : 0,
        b : 1,
        a : 0.5
      }
    });
    this.map.addLayer(this.routeLayer);
  },
  /**
   * @return {undefined}
   */
  tilesLoaded : function() {
    this.notifyCallbacksForEvent("tilesloaded");
  },
  /**
   * @return {?}
   */
  generateContainerId : function() {
    if (!lf.maps.mappy.Map.instanceCount) {
      /** @type {number} */
      lf.maps.mappy.Map.instanceCount = 0;
    }
    lf.maps.mappy.Map.instanceCount = lf.maps.mappy.Map.instanceCount + 1;
    return "lf-mappy-map-container-" + lf.maps.mappy.Map.instanceCount.toString();
  }
});
lf.maps.mappy.NumberMarker = lf.maps.leaflet.FrontOfficeMarker.extend({
  /**
   * @param {?} config
   * @param {?} name
   * @param {Object} container
   * @return {undefined}
   */
  constructor : function(config, name, container) {
    var $this = new lf.maps.mappy.NumberMarker.Icon;
    $this.options.text = config.toString();
    this.base(name, {
      icon : $this
    });
    if (null !== container) {
      if (void 0 !== container) {
        container.addLayer(this.marker);
      }
    }
    this.setVisible(true);
  }
});
lf.maps.mappy.PolygonLine = lf.maps.leaflet.PolygonLine.extend({
  /**
   * @param {Function} recurring
   * @param {Object} config
   * @return {undefined}
   */
  constructor : function(recurring, config) {
    this.setMap(recurring);
    this.points = config.points;
    this.color = config.color;
    this.line = this.points.polyline || new L.Polyline(this.pointsToLeaflet(config.points), this.getLeafletOptions());
  },
  /**
   * @return {undefined}
   */
  onRemove : function() {
    this.map.map.removeLayer(this.line);
  },
  /**
   * @return {undefined}
   */
  onAdd : function() {
    this.map.map.addLayer(this.line);
  }
});
lf.maps.mappy.SingleMarker = lf.maps.leaflet.FrontOfficeMarker.extend({
  /**
   * @param {?} name
   * @return {undefined}
   */
  constructor : function(name) {
    var imgpath = new lf.maps.mappy.SingleMarker.Icon;
    this.base(name, {
      icon : imgpath
    });
    this.setVisible(true);
  }
});
lf.maps.viamichelin.Map = Base.extend({
  /**
   * @param {Object} root
   * @param {?} config
   * @return {undefined}
   */
  constructor : function(root, config) {
    this.root = jQuery(root);
    this.loadedCallback = config;
    this.callbacks = {};
    var mod = this;
    this.center = {
      lat : 0,
      lng : 0
    };
    var wrapError = VMLaunch;
    var options = {
      container : root,
      scrollwheel : false,
      zoom : 13,
      mapTypeControlOptions : {
        type : ViaMichelin.Api.Constants.Map.TYPE.LIGHT
      }
    };
    this.root.click(function() {
      var t = mod.getActiveMarker();
      if (t) {
        mod.activeMarker.markerClicked();
      }
    });
    if (/mobile/i.test(navigator.userAgent)) {
      /** @type {boolean} */
      options.mapToolsControl = false;
      options.skin = ViaMichelin.Api.Constants.Map.SKIN.MOBILE.SMALL;
      options.navigationMode = ViaMichelin.Api.Constants.Map.NAVIGATION.STATIC;
    }
    wrapError("ViaMichelin.Api.Map", options, {
      /**
       * @param {Object} options
       * @return {undefined}
       */
      onSuccess : function(options) {
        /** @type {Object} */
        mod.map = options;
        mod.mapLoaded();
      },
      /**
       * @param {?} err
       * @return {undefined}
       */
      onError : function(err) {
        if (console) {
          if (console.error) {
            console.error(err.errorMsg, err);
          }
        }
      },
      /**
       * @return {undefined}
       */
      onZoomChanged : function() {
        mod.zoomLevelChanged();
      },
      /**
       * @return {undefined}
       */
      onMapCenterChanged : function() {
        mod.centerPointChanged();
      }
    });
  },
  /**
   * @param {?} bounds
   * @return {undefined}
   */
  fitBounds : function(bounds) {
    var p2 = bounds.getNorthWest();
    var p1 = bounds.getSouthEast();
    var item = {};
    item.no = {
      lat : p2.lat,
      lon : p2.lng
    };
    item.se = {
      lat : p1.lat,
      lon : p1.lng
    };
    this.map.drawMap({
      geoBoundaries : item
    });
    this.center = bounds.getCenterPoint();
    this.centerPointChanged();
    this.zoomLevelChanged();
  },
  /**
   * @return {undefined}
   */
  redraw : function() {
    var newCenter = this.root.width();
    var H = this.root.height();
    this.map.resizeTo(newCenter, H);
    this.root.css({
      height : "",
      width : ""
    });
  },
  /**
   * @return {?}
   */
  getCenter : function() {
    return this.center;
  },
  /**
   * @return {?}
   */
  getZoom : function() {
    return this.map.getZoomLevel();
  },
  /**
   * @return {?}
   */
  getMaxZoom : function() {
    return 16;
  },
  /**
   * @return {?}
   */
  getPointOfSaleZoomLevel : function() {
    return 13;
  },
  /**
   * @return {?}
   */
  getMaxZIndex : function() {
    return 1E6;
  },
  /**
   * @param {Object} obj
   * @return {?}
   */
  getPixelForLatLng : function(obj) {
    var stopData = {
      lat : obj.lat,
      lon : obj.lng
    };
    var scrollCoord = this.map.convertGeoToPixel(stopData);
    return{
      x : scrollCoord.x,
      y : scrollCoord.y
    };
  },
  /**
   * @param {?} x1
   * @return {?}
   */
  getLatLngForPixel : function(x1) {
    var p1 = this.map.convertPixelToGeo(x1);
    return{
      lat : p1.lat,
      lng : p1.lon
    };
  },
  /**
   * @return {?}
   */
  getViewportBounds : function() {
    var loc = this.map.getSouthWest();
    var item = this.map.getNorthEast();
    var latlng = {
      lat : loc.latitude,
      lng : loc.longitude
    };
    var mkr_point = {
      lat : item.latitude,
      lng : item.longitude
    };
    return new lf.maps.Bounds(latlng, mkr_point);
  },
  /**
   * @param {Object} center
   * @return {undefined}
   */
  setCenter : function(center) {
    /** @type {Object} */
    this.center = center;
    this.map.moveTo({
      lat : center.lat,
      lon : center.lng
    });
    this.centerPointChanged();
  },
  /**
   * @param {number} zoom
   * @return {undefined}
   */
  setZoom : function(zoom) {
    this.map.setZoomLevel(zoom);
  },
  /**
   * @param {string} event
   * @param {Function} fn
   * @return {?}
   */
  bind : function(event, fn) {
    if ("undefined" == typeof this.callbacks[event]) {
      /** @type {Array} */
      this.callbacks[event] = [];
    }
    var expected = {
      id : lf.app.uniqueId(),
      event : event,
      /** @type {Function} */
      fn : fn
    };
    this.callbacks[event].push(expected);
    return expected;
  },
  /**
   * @param {Object} listener
   * @return {undefined}
   */
  unbind : function(listener) {
    var ary = this.callbacks[listener.event];
    /** @type {number} */
    var i = 0;
    for (;i < ary.length;i += 1) {
      var member = ary[i];
      if (member.id === listener.id) {
        ary.splice(i, 1);
        break;
      }
    }
  },
  /**
   * @param {?} keepData
   * @return {undefined}
   */
  setActiveMarker : function(keepData) {
    this.activeMarker = keepData;
  },
  /**
   * @return {?}
   */
  getActiveMarker : function() {
    return this.activeMarker;
  },
  /**
   * @return {undefined}
   */
  centerPointChanged : function() {
    this.notifyCallbacksForEvent("bounds_changed");
  },
  /**
   * @return {undefined}
   */
  zoomLevelChanged : function() {
    this.notifyCallbacksForEvent("zoom_changed");
    this.notifyCallbacksForEvent("bounds_changed");
  },
  /**
   * @return {undefined}
   */
  mapLoaded : function() {
    if (this.loadedCallback) {
      this.loadedCallback.call(null, this);
    }
    this.notifyCallbacksForEvent("tilesloaded");
  },
  /**
   * @param {string} event
   * @return {undefined}
   */
  notifyCallbacksForEvent : function(event) {
    var callbacks = this.callbacks[event];
    if (callbacks) {
      /** @type {number} */
      var i = 0;
      for (;i < callbacks.length;i += 1) {
        callbacks[i].fn();
      }
    }
  }
});
lf.maps.viamichelin.FrontOfficeMarker = Base.extend({
  /**
   * @param {Object} pos
   * @return {undefined}
   */
  constructor : function(pos) {
    this.callbacks = {};
    /** @type {boolean} */
    this.isAdded = false;
    this.marker = new ViaMichelin.Api.Map.Marker(this.getMarkerSettings(pos));
    this.setPosition(pos);
    var key = this;
    this.marker.addEventListener("onExpandOpen", function() {
      key.bubbleOpened();
    });
    this.marker.addEventListener("onMouseover", function(oEvent) {
      if (key.hasEventHandler("click")) {
        jQuery(oEvent.currentTarget).css("cursor", "pointer");
        key.map.setActiveMarker(key);
      }
    });
    this.marker.addEventListener("onMouseout", function() {
      key.map.setActiveMarker(null);
    });
  },
  /**
   * @param {number} index
   * @return {undefined}
   */
  setZIndex : function(index) {
    this.marker.setZindex(index);
  },
  /**
   * @return {?}
   */
  getZIndex : function() {
    return this.marker.getZindex();
  },
  /**
   * @param {Function} keepData
   * @return {undefined}
   */
  showText : function(keepData) {
    if (this.bubbleId) {
      /** @type {Function} */
      this.bubbleText = keepData;
      this.marker.openExpandLayer();
    }
  },
  /**
   * @return {undefined}
   */
  hideText : function() {
    if (this.bubbleId) {
      this.marker.closeExpandLayer();
    }
  },
  /**
   * @param {Object} recurring
   * @return {undefined}
   */
  setMap : function(recurring) {
    if (this.map !== recurring) {
      if (this.isAdded) {
        this.detachMarker();
      }
      /** @type {Object} */
      this.map = recurring;
      if (this.map) {
        this.attachMarker();
      }
    }
  },
  /**
   * @param {Object} label
   * @return {undefined}
   */
  setLabel : function(label) {
    /** @type {Object} */
    this.labelText = label;
    if (this.marker && this.labelText) {
      if (this.labelId) {
        jQuery("#" + this.labelId).html(this.labelText);
      } else {
        this.labelId = lf.app.uniqueId();
        this.marker.setOverlayText("<span id='" + this.labelId + "'>" + this.labelText + "</span>");
      }
    }
  },
  /**
   * @param {Object} pos
   * @return {undefined}
   */
  setPosition : function(pos) {
    /** @type {Object} */
    this.position = pos;
    if (this.marker) {
      this.marker.setPosition({
        lat : pos.lat,
        lon : pos.lng
      });
    }
  },
  /**
   * @return {?}
   */
  getPosition : function() {
    return this.position;
  },
  /**
   * @param {boolean} recurring
   * @return {undefined}
   */
  setVisible : function(recurring) {
    if (this.marker) {
      this.marker.setVisibility(recurring);
    }
  },
  /**
   * @return {undefined}
   */
  setPositioningMarkerVisible : function() {
  },
  /**
   * @param {string} event
   * @param {Function} fn
   * @param {Function} callback
   * @return {undefined}
   */
  bind : function(event, fn, callback) {
    if ("undefined" == typeof this.callbacks[event]) {
      /** @type {Array} */
      this.callbacks[event] = [];
    }
    if (2 === arguments.length) {
      callback = arguments[1];
      /** @type {null} */
      fn = null;
    }
    this.callbacks[event].push([callback, fn]);
  },
  /**
   * @param {string} eventName
   * @return {?}
   */
  hasEventHandler : function(eventName) {
    return "undefined" != typeof this.callbacks[eventName] && this.callbacks[eventName].length > 0;
  },
  /**
   * @param {Object} p1
   * @return {?}
   */
  getMarkerSettings : function(p1) {
    var options = Class.duplicate(this.getSettingsObject());
    /** @type {string} */
    options.overlayText.text = "";
    return{
      coords : {
        lat : p1.lat,
        lon : p1.lng
      },
      icon : options.icon,
      size : options.size,
      overlayText : options.overlayText,
      visibility : true
    };
  },
  /**
   * @return {undefined}
   */
  markerClicked : function() {
    this.notifyCallbacksForEvent("click");
  },
  /**
   * @return {undefined}
   */
  bubbleOpened : function() {
    var $link = jQuery("#" + this.bubbleId);
    $link.html(this.bubbleText);
    $link.closest(".sMapBubble").parent("div").css("z-index", this.getZIndex());
  },
  /**
   * @param {string} event
   * @return {undefined}
   */
  notifyCallbacksForEvent : function(event) {
    var codeSegments = this.callbacks[event];
    if (codeSegments) {
      /** @type {number} */
      var i = 0;
      for (;i < codeSegments.length;i += 1) {
        codeSegments[i][0].call(null, {
          data : codeSegments[i][1]
        });
      }
    }
  },
  /**
   * @return {undefined}
   */
  attachMarker : function() {
    this.map.map.addLayer(this.marker);
    /** @type {boolean} */
    this.isAdded = true;
  },
  /**
   * @return {undefined}
   */
  detachMarker : function() {
    if (this.map) {
      this.map.map.removeLayer(this.marker);
    }
    /** @type {boolean} */
    this.isAdded = false;
  }
});
lf.maps.viamichelin.ClusterMarker = lf.maps.viamichelin.FrontOfficeMarker.extend({
  /**
   * @param {?} name
   * @return {undefined}
   */
  constructor : function(name) {
    this.base(name);
  },
  /**
   * @param {number} label
   * @return {undefined}
   */
  setLabel : function(label) {
    this.base("x " + label);
  },
  /**
   * @return {?}
   */
  getSettingsObject : function() {
    return lf_viamichelin_settings.clusterMarker;
  }
});
lf.maps.viamichelin.InactiveClusterMarker = lf.maps.viamichelin.FrontOfficeMarker.extend({
  /**
   * @param {?} name
   * @return {undefined}
   */
  constructor : function(name) {
    this.base(name);
  },
  /**
   * @param {number} label
   * @return {undefined}
   */
  setLabel : function(label) {
    this.base("x " + label);
  },
  /**
   * @return {?}
   */
  getSettingsObject : function() {
    return lf_viamichelin_settings.inactiveClusterMarker;
  }
});
lf.maps.viamichelin.InactiveMarker = lf.maps.viamichelin.FrontOfficeMarker.extend({
  /**
   * @param {?} name
   * @return {undefined}
   */
  constructor : function(name) {
    this.base(name);
  },
  /**
   * @param {Object} name
   * @return {?}
   */
  getMarkerSettings : function(name) {
    var bitmap = this.base(name);
    this.bubbleId = lf.app.uniqueId();
    /** @type {string} */
    this.bubbleText = "";
    /** @type {string} */
    bitmap.htm = "<div id='" + this.bubbleId + "' style='width:250px;'></div>";
    return bitmap;
  },
  /**
   * @return {?}
   */
  getSettingsObject : function() {
    return lf_viamichelin_settings.inactiveMarker;
  }
});
lf.maps.viamichelin.NumberMarker = lf.maps.viamichelin.FrontOfficeMarker.extend({
  /**
   * @param {number} o
   * @param {?} name
   * @return {undefined}
   */
  constructor : function(o, name) {
    this.base(name);
    /** @type {number} */
    this.number = o;
    this.setLabel(o);
  },
  /**
   * @param {Object} name
   * @return {?}
   */
  getMarkerSettings : function(name) {
    var bitmap = this.base(name);
    this.bubbleId = lf.app.uniqueId();
    /** @type {string} */
    this.bubbleText = "";
    /** @type {string} */
    bitmap.htm = "<div id='" + this.bubbleId + "' class='lf_mapbubble_text'></div>";
    return bitmap;
  },
  /**
   * @return {?}
   */
  getSettingsObject : function() {
    return lf_viamichelin_settings.numberMarker;
  }
});
lf.maps.viamichelin.SingleMarker = lf.maps.viamichelin.FrontOfficeMarker.extend({
  /**
   * @param {?} name
   * @return {undefined}
   */
  constructor : function(name) {
    this.base(name);
  },
  /**
   * @return {?}
   */
  getSettingsObject : function() {
    return lf_viamichelin_settings.singleMarker;
  }
});
lf.maps.viamichelin.DirectionsService = Base.extend({
  /**
   * @param {?} del
   * @param {Object} origin
   * @param {?} config
   * @param {?} beforeExit
   * @return {undefined}
   */
  constructor : function(del, origin, config, beforeExit) {
    this.delegate = del;
    /** @type {Object} */
    this.origin = origin;
    this.destination = config;
    beforeExit(this);
  },
  /**
   * @return {undefined}
   */
  process : function() {
    if ("string" == typeof this.destination) {
      this.geocode("destination");
    }
    if ("string" == typeof this.origin) {
      this.geocode("origin");
    }
    this.processIfPossible();
  },
  /**
   * @return {undefined}
   */
  processDirections : function() {
    var self = this;
    var coords = {
      lat : this.origin.lat,
      lon : this.origin.lng
    };
    var stopData = {
      lat : this.destination.lat,
      lon : this.destination.lng
    };
    var addProperties = VMLaunch;
    addProperties("ViaMichelin.Api.Itinerary", {
      steps : [{
        coords : coords
      }, {
        coords : stopData
      }],
      distUnit : ViaMichelin.Api.Constants.Itinerary.DIST_UNIT.METERS
    }, {
      /**
       * @param {Object} data
       * @return {undefined}
       */
      onSuccess : function(data) {
        var status = self.convertResponse(data);
        self.callDelegateMethod("didReceiveSuccessfulDirections", [self, status]);
      },
      /**
       * @param {?} m
       * @return {undefined}
       */
      onError : function(m) {
        if (console) {
          if (console.error) {
            console.error("viamichelin error:", m);
          }
        }
        self.callDelegateMethod("didReceiveFailingDirections", [self]);
      }
    });
  },
  /**
   * @return {undefined}
   */
  processIfPossible : function() {
    if ("string" != typeof this.origin) {
      if ("string" != typeof this.destination) {
        this.processDirections();
      }
    }
  },
  /**
   * @param {Object} d
   * @return {?}
   */
  convertResponse : function(d) {
    /**
     * @param {number} elem
     * @param {Object} err
     * @return {undefined}
     */
    function next(elem, err) {
      if (err.details.length > 0) {
        /** @type {number} */
        var i = 0;
        for (;i < err.details.length;i += 1) {
          next(elem, err.details[i]);
        }
      } else {
        if ("string" == typeof err.description && err.description.length > 0) {
          var params = {
            description : err.description
          };
          var attrList = err.totalDistance.match(/(\d|\.|\,)+/g);
          if (attrList) {
            /** @type {number} */
            params.distance = parseFloat(attrList[0].replace(",", ""));
          }
          elem.steps.push(params);
        }
      }
    }
    var self = {};
    /** @type {string} */
    self.copyrights = "";
    /** @type {number} */
    self.estimatedDistance = parseFloat(d.header.summaries[0].totalDist) / 1E3;
    /** @type {number} */
    self.estimatedDuration = parseInt(d.header.summaries[0].totalTime, 10);
    /** @type {Array} */
    self.steps = [];
    /** @type {Array} */
    self.points = [];
    /** @type {number} */
    var i = 0;
    for (;i < d.roadSheet.steps.length;i += 1) {
      next(self, d.roadSheet.steps[i]);
    }
    var seg = d.getLayer().layers[0].getPath();
    /** @type {number} */
    var k = 0;
    for (;k < seg.length;k += 1) {
      self.points.push({
        lat : seg[k].lat,
        lng : seg[k].lon
      });
    }
    return self;
  },
  /**
   * @param {string} key
   * @return {undefined}
   */
  geocode : function(key) {
    var self = this;
    this.loadGoogleMaps(function() {
      (new google.maps.Geocoder).geocode({
        address : self[key]
      }, function(results) {
        if (results.length > 0) {
          var place = results[0].geometry.location;
          self[key] = {
            lat : place.lat(),
            lng : place.lng()
          };
        } else {
          self.callDelegateMethod("didReceiveFailingDirections", [self]);
        }
        self.processIfPossible();
      });
    });
  },
  /**
   * @param {Function} next_callback
   * @return {?}
   */
  loadGoogleMaps : function(next_callback) {
    if ("undefined" != typeof google || lfLoadGoogleApiForViamichelin.loaded) {
      return next_callback.call();
    }
    lfLoadGoogleApiForViamichelin.callbacks.push(next_callback);
    if (!this.loadingGoogleMaps) {
      /** @type {boolean} */
      this.loadingGoogleMaps = true;
      /** @type {Element} */
      var theScriptTag = document.createElement("script");
      /** @type {string} */
      theScriptTag.type = "text/javascript";
      /** @type {string} */
      theScriptTag.src = "https://maps.google.com/maps/api/js?sensor=false&callback=lfLoadGoogleApiForViamichelin";
      document.body.appendChild(theScriptTag);
    }
  }
}, {
  /**
   * @param {Element} dataAndEvents
   * @param {number} regex
   * @param {number} deepDataAndEvents
   * @param {Function} ignoreMethodDoesntExist
   * @return {?}
   */
  routeForPoint : function(dataAndEvents, regex, deepDataAndEvents, ignoreMethodDoesntExist) {
    return new lf.maps.viamichelin.DirectionsService(dataAndEvents, regex, deepDataAndEvents, ignoreMethodDoesntExist);
  },
  /**
   * @param {Object} dataAndEvents
   * @param {boolean} callback
   * @param {boolean} regex
   * @param {boolean} deepDataAndEvents
   * @return {?}
   */
  routeForAddress : function(dataAndEvents, callback, regex, deepDataAndEvents) {
    return new lf.maps.viamichelin.DirectionsService(dataAndEvents, callback, regex, deepDataAndEvents);
  }
});
Class.mixin(lf.maps.viamichelin.DirectionsService, Delegatable);
/**
 * @return {undefined}
 */
lfLoadGoogleApiForViamichelin = function() {
  /** @type {boolean} */
  lfLoadGoogleApiForViamichelin.loaded = true;
  /** @type {number} */
  var idx = 0;
  for (;idx < lfLoadGoogleApiForViamichelin.callbacks.length;idx += 1) {
    lfLoadGoogleApiForViamichelin.callbacks[idx].call();
  }
  /** @type {Array} */
  lfLoadGoogleApiForViamichelin.callbacks = [];
};
/** @type {boolean} */
lfLoadGoogleApiForViamichelin.loaded = false;
/** @type {Array} */
lfLoadGoogleApiForViamichelin.callbacks = [];
lf.maps.viamichelin.PolygonLine = Base.extend({
  /**
   * @param {Function} recurring
   * @param {Object} options
   * @return {undefined}
   */
  constructor : function(recurring, options) {
    this.line = new ViaMichelin.Api.Map.PolyLine({
      strokeWeight : 5,
      strokeColor : "#0000FF",
      strokeOpacity : 0.5,
      coords : this.pointsToViaMichelin(options.points)
    });
    this.setColor(options.color || {
      r : 0,
      g : 0,
      b : 1,
      a : 0.75
    });
    this.setMap(recurring);
  },
  /**
   * @param {Function} recurring
   * @return {undefined}
   */
  setMap : function(recurring) {
    /** @type {Function} */
    this.map = recurring;
    if (this.line) {
      if (this.map) {
        this.map.map.addLayer(this.line);
      } else {
        this.map.map.removeLayer(this.line);
      }
    }
  },
  /**
   * @return {?}
   */
  getMap : function() {
    return this.map;
  },
  /**
   * @param {?} color
   * @return {undefined}
   */
  setColor : function(color) {
    this.color = color;
    if (this.line) {
      this.line.setStrokeColor(this.getRGBString());
      this.line.setStrokeOpacity(this.color.a);
    }
  },
  /**
   * @return {?}
   */
  getColor : function() {
    return this.color;
  },
  /**
   * @param {Array} points
   * @return {undefined}
   */
  setPoints : function(points) {
    /** @type {Array} */
    this.points = points;
    if (this.line) {
      this.line.setPath(this.pointsToViaMichelin(points));
    }
  },
  /**
   * @return {?}
   */
  getPoints : function() {
    return this.points;
  },
  /**
   * @return {?}
   */
  getRGBString : function() {
    /**
     * @param {string} str
     * @param {number} opt_attributes
     * @return {?}
     */
    function endsWith(str, opt_attributes) {
      /** @type {string} */
      var code = "" + str;
      for (;code.length < opt_attributes;) {
        /** @type {string} */
        code = "0" + code;
      }
      return code;
    }
    /** @type {string} */
    var errStr = parseInt(255 * this.color.r, 10).toString(16);
    /** @type {string} */
    var fileNameLowercase = parseInt(255 * this.color.g, 10).toString(16);
    /** @type {string} */
    var simple = parseInt(255 * this.color.b, 10).toString(16);
    return sprintf("#%s%s%s", endsWith(errStr, 2), endsWith(fileNameLowercase, 2), endsWith(simple, 2));
  },
  /**
   * @param {Array} points
   * @return {?}
   */
  pointsToViaMichelin : function(points) {
    /** @type {Array} */
    var map = [];
    /** @type {number} */
    var i = 0;
    for (;i < points.length;i += 1) {
      var p2 = points[i];
      map.push({
        lat : p2.lat,
        lon : p2.lng
      });
    }
    return map;
  }
});
/**
 * @param {Object} root
 * @return {undefined}
 */
DrivingDirectionsPopup = function(root) {
  /** @type {Object} */
  this.root = root;
  /** @type {string} */
  this.distanceUnit = "km";
  this.from = root.find('input[name="lf_ddfrom"]');
  this.posAddress = root.find("#lf_ddto address");
  this.calculateButton = root.find("#lf_ddcalculate button, #lf_ddcalculate a");
  this.resultsDiv = root.find("#lf_ddresults");
  this.directionsList = root.find("#lf_ddroutesteps");
  this.originText = root.find("#lf_ddorigin");
  this.estimate = root.find("#lf_ddestimate");
  this.mapDiv = root.find("#lf_ddmap");
  this.mapCopyright = root.find("#lf_ddcopyright");
  this.printButton = root.find("#lf_ddprint");
  this.closeButton = root.find("#lf_ddclose");
  /** @type {null} */
  this.map = null;
  /** @type {null} */
  this.mapOriginMarker = null;
  /** @type {null} */
  this.mapDestinationMarker = null;
  /** @type {null} */
  this.mapRouteLine = null;
  var self = this;
  this.from.keypress(function(event) {
    if (13 === event.which) {
      self.from.blur();
      self.calculateButton.focus().click();
    }
  });
  this.calculateButton.bind("click", function() {
    self.processRequest();
  });
  this.closeButton.bind("click", function() {
    self.hide();
  });
  this.printButton.bind("click", function() {
    self.root.printElement({
      printMode : "popup",
      leaveOpen : true
    });
  });
  jQuery(window).bind("resize", function() {
    self.reposition();
  }).trigger("resize");
};
/**
 * @return {?}
 */
DrivingDirectionsPopup.sharedInstance = function() {
  if (!DrivingDirectionsPopup.__sharedInstance) {
    var targets = jQuery("#lf_drivingdirections");
    if (0 === targets.length) {
      throw new Error("#lf_drivingdirections is not present");
    }
    DrivingDirectionsPopup.__sharedInstance = new DrivingDirectionsPopup(targets);
  }
  return DrivingDirectionsPopup.__sharedInstance;
};
/**
 * @return {undefined}
 */
DrivingDirectionsPopup.prototype.reposition = function() {
  /** @type {number} */
  var pickWinLeft = jQuery(window).width() / 2 - this.root.width() / 2;
  this.root.css({
    left : pickWinLeft
  });
};
/**
 * @return {undefined}
 */
DrivingDirectionsPopup.prototype.show = function() {
  this.root.show();
  this.root.trigger("shown");
};
/**
 * @return {undefined}
 */
DrivingDirectionsPopup.prototype.hide = function() {
  this.root.hide();
  this.root.trigger("hidden");
};
/**
 * @return {undefined}
 */
DrivingDirectionsPopup.prototype.bind = function() {
  this.root.bind.apply(this.root, arguments);
};
/**
 * @return {undefined}
 */
DrivingDirectionsPopup.prototype.unbind = function() {
  this.root.unbind.apply(this.root, arguments);
};
/**
 * @return {undefined}
 */
DrivingDirectionsPopup.prototype.print = function() {
  this.root.printElement({
    printMode : "popup",
    leaveOpen : true
  });
};
/**
 * @return {?}
 */
DrivingDirectionsPopup.prototype.getPointOfSaleAddress = function() {
  return this.posAddress.text().replace(/^\s+/g, "").replace(/\s+jQuery/g, "").replace(/[\n\t]/g, "");
};
/**
 * @return {undefined}
 */
DrivingDirectionsPopup.prototype.processRequest = function() {
  if ("" !== this.from.val().replace(/\s/g, "")) {
    /** @type {null} */
    this.geocodingAttempt = null;
    this.estimate.empty();
    this.directionsList.empty();
    this.setStartAddressText(this.from.val());
    this.showResults();
    var mm = lf.app.getApiModule();
    var settings = this;
    if (this.map) {
      settings.processRequestUsingAddress();
    } else {
      this.map = new mm.Map(this.mapDiv[0], function(me) {
        me.setCenter(posMarkerCoordinates);
        settings.processRequestUsingAddress();
        jQuery(settings.mapDiv[0]).trigger("lf.mapReady", [me]);
      });
    }
  } else {
    window.alert(I18n.translate("frontoffice.pos.directions.empty_field_error"));
    this.from.focus();
  }
};
/**
 * @return {undefined}
 */
DrivingDirectionsPopup.prototype.processRequestUsingAddress = function() {
  var $googlemaps = lf.app.getApiModule();
  var restoreScript = this.from.val();
  var r20 = this.getPointOfSaleAddress();
  /** @type {string} */
  this.geocodingAttempt = "address";
  $googlemaps.DirectionsService.routeForAddress(this, restoreScript, r20, function(reader) {
    reader.process();
  });
};
/**
 * @return {undefined}
 */
DrivingDirectionsPopup.prototype.processRequestUsingLatLng = function() {
  var $googlemaps = lf.app.getApiModule();
  var r20 = this.from.val();
  var deepDataAndEvents = posMarkerCoordinates;
  /** @type {string} */
  this.geocodingAttempt = "latlng";
  $googlemaps.DirectionsService.routeForPoint(this, r20, deepDataAndEvents, function(reader) {
    reader.process();
  });
};
/**
 * @param {?} dataAndEvents
 * @param {?} deepDataAndEvents
 * @return {?}
 */
DrivingDirectionsPopup.prototype.resultMatchesGeolocation = function(dataAndEvents, deepDataAndEvents) {
  if ("latlng" === this.geocodingAttempt) {
    return true;
  }
  /** @type {number} */
  var z0 = 69.1 * (dataAndEvents - posMarkerCoordinates.lat);
  /** @type {number} */
  var z1 = 53 * (deepDataAndEvents - posMarkerCoordinates.lng);
  /** @type {number} */
  var s = Math.sqrt(z0 * z0 + z1 * z1);
  return 0.0622 > s;
};
/**
 * @return {undefined}
 */
DrivingDirectionsPopup.prototype.didReceiveFailingDirections = function() {
  if ("address" === this.geocodingAttempt) {
    this.processRequestUsingLatLng();
  } else {
    this.hideResults();
    window.alert(I18n.translate("frontoffice.pos.directions.calculate_error"));
  }
};
/**
 * @param {?} dataAndEvents
 * @param {Object} stage
 * @return {undefined}
 */
DrivingDirectionsPopup.prototype.didReceiveSuccessfulDirections = function(dataAndEvents, stage) {
  this.showResults();
  this.setCopyrightText(stage.copyrights);
  this.setEstimateText(sprintf("%s (%s)", this.distanceString(this.convertDistanceForDisplay(stage.estimatedDistance), this.distanceUnit), this.durationString(stage.estimatedDuration)));
  this.setDirectionsList(stage.steps);
  this.showResults();
  this.displayRoute(stage.points);
};
/**
 * @param {(number|string)} v11
 * @return {undefined}
 */
DrivingDirectionsPopup.prototype.setDistanceUnit = function(v11) {
  /** @type {(number|string)} */
  this.distanceUnit = v11;
};
/**
 * @return {undefined}
 */
DrivingDirectionsPopup.prototype.hideResults = function() {
  this.resultsDiv.hide();
};
/**
 * @return {undefined}
 */
DrivingDirectionsPopup.prototype.showResults = function() {
  this.resultsDiv.show();
};
/**
 * @param {Array} resultItems
 * @return {undefined}
 */
DrivingDirectionsPopup.prototype.setDirectionsList = function(resultItems) {
  this.directionsList.empty();
  /** @type {number} */
  var i = 0;
  for (;i < resultItems.length;i += 1) {
    var result = resultItems[i];
    var $sandbox = jQuery("<li/>").appendTo(this.directionsList);
    jQuery("<div/>").addClass("lf_ddstepdescription").html(result.description).appendTo($sandbox);
    if (result.distance) {
      jQuery("<div/>").addClass("lf_ddstepdistance").html(this.distanceString(this.convertDistanceForDisplay(result.distance), this.distanceUnit)).appendTo($sandbox);
    }
  }
};
/**
 * @param {?} $match
 * @return {undefined}
 */
DrivingDirectionsPopup.prototype.setCopyrightText = function($match) {
  this.mapCopyright.html($match);
};
/**
 * @param {number} a
 * @return {?}
 */
DrivingDirectionsPopup.prototype.durationString = function(a) {
  /** @type {number} */
  var d = 60;
  /** @type {number} */
  var b = 60 * d;
  /** @type {number} */
  var i = Math.floor(a / b);
  /** @type {number} */
  var r = a % b;
  /** @type {number} */
  var text = Math.round(r / d);
  return 0 === i ? [text, I18n.pluralize(text, "frontoffice.datetime.minute")].join(" ") : [i, I18n.pluralize(i, "frontoffice.datetime.hour"), text, I18n.pluralize(text, "frontoffice.datetime.minute")].join(" ");
};
/**
 * @param {number} actualObject
 * @return {?}
 */
DrivingDirectionsPopup.prototype.convertDistanceForDisplay = function(actualObject) {
  /** @type {number} */
  var object = actualObject;
  if ("mi" === this.distanceUnit) {
    /** @type {number} */
    object = 0.621371192 * actualObject;
  }
  return object;
};
/**
 * @param {?} n
 * @param {?} y
 * @param {boolean} isXML
 * @return {?}
 */
DrivingDirectionsPopup.prototype.distanceString = function(n, y, isXML) {
  /** @type {null} */
  var part = null;
  /** @type {(number|string)} */
  part = isXML ? Math.round(parseFloat(n)) : parseFloat(n).toFixed(1);
  return[part.toString().replace(/\.0$/, ""), y].join(" ");
};
/**
 * @param {?} $match
 * @return {undefined}
 */
DrivingDirectionsPopup.prototype.setEstimateText = function($match) {
  this.estimate.html($match);
};
/**
 * @param {?} node
 * @return {undefined}
 */
DrivingDirectionsPopup.prototype.setStartAddressText = function(node) {
  var distanceToUserValue = jQuery("<div/>").text(node).html();
  this.originText.html(distanceToUserValue);
};
/**
 * @return {?}
 */
DrivingDirectionsPopup.prototype.mapIsLoaded = function() {
  return null !== this.map;
};
/**
 * @param {Array} points
 * @return {undefined}
 */
DrivingDirectionsPopup.prototype.displayRoute = function(points) {
  var bounds = new lf.maps.Bounds(points[0], points[0]);
  /** @type {number} */
  var i = 1;
  for (;i < points.length;i += 1) {
    bounds.extend(points[i]);
  }
  var pos = points[0];
  var node = points[points.length - 1];
  if (this.mapOriginMarker) {
    this.mapOriginMarker.setPosition(pos);
    this.mapDestinationMarker.setPosition(node);
    if (this.map.displayRoute) {
      this.map.displayRoute(points);
    } else {
      this.mapRouteLine.setPoints(points);
    }
  } else {
    var L = lf.app.getApiModule();
    this.mapOriginMarker = new L.NumberMarker("A", pos);
    this.mapOriginMarker.setMap(this.map);
    this.mapDestinationMarker = new L.NumberMarker("B", node);
    this.mapDestinationMarker.setMap(this.map);
    if (this.map.displayRoute) {
      this.map.displayRoute(points);
    } else {
      this.mapRouteLine = new L.PolygonLine(this.map, {
        points : points,
        color : {
          r : 0,
          g : 0,
          b : 1,
          a : 0.5
        }
      });
    }
  }
  this.map.fitBounds(bounds, null, 15);
};
jQuery(document).ready(function() {
  jQuery(document).on("click", "*[data-bind='driving_directions_show']", function(types) {
    types.preventDefault();
    var y = jQuery(this).data("distance-unit");
    if ("undefined" != typeof y) {
      DrivingDirectionsPopup.sharedInstance().setDistanceUnit(y);
    }
    gui.Backdrop.sharedInstance().showWithoutIndicator(250);
    DrivingDirectionsPopup.sharedInstance().show();
    jQuery(window).scrollTop(0);
    /**
     * @return {undefined}
     */
    var task = function() {
      gui.Backdrop.sharedInstance().hide(250);
      DrivingDirectionsPopup.sharedInstance().unbind("hidden", task);
    };
    DrivingDirectionsPopup.sharedInstance().bind("hidden", task);
    return false;
  });
});
lf.ListMap = Base.extend({
  /**
   * @param {Element} el
   * @return {undefined}
   */
  constructor : function(el) {
    this.markers = {};
    this.markersByIndex = {};
    /** @type {Element} */
    this.canvas = el;
    /** @type {Array} */
    this.activeMarkers = [];
    /** @type {Array} */
    this.inactiveMarkers = [];
    /** @type {boolean} */
    this.showInactiveMarkers = true;
    if ("undefined" != typeof show_inactive_markers) {
      this.showInactiveMarkers = show_inactive_markers;
    }
    /** @type {boolean} */
    this.useAggressiveMarkerClustering = true;
    if ("undefined" != typeof use_aggressive_marker_clustering) {
      this.useAggressiveMarkerClustering = use_aggressive_marker_clustering;
    }
    var mod = this;
    var hs = lf.app.getApiModule();
    new hs.Map(el, function(options) {
      mod.map = options;
      mod.mapWasLoaded(options);
      jQuery(el).trigger("lf.mapReady", [options]);
    });
  },
  /**
   * @param {Array} locations
   * @return {undefined}
   */
  loadActiveMarkers : function(locations) {
    /** @type {Array} */
    this.activeMarkers = locations;
    this.activeClusterer.clearMarkers();
    this.activeClusterer.addMarkers(locations, true);
  },
  /**
   * @param {?} $sanitize
   * @return {undefined}
   */
  filterMarkers : function($sanitize) {
    /** @type {Array} */
    var bucket = [];
    jQuery.each(lf.app.listMap.activeMarkers, function(dataAndEvents, value) {
      if ($sanitize(value)) {
        bucket.push(value);
      }
    });
    this.loadActiveMarkers(bucket);
  },
  /**
   * @param {?} optionsString
   * @return {undefined}
   */
  mapWasLoaded : function(optionsString) {
    var MarkerClusterer = lf.app.getApiModule();
    /** @type {number} */
    var pdataOld = optionsString.getPointOfSaleZoomLevel() - 1;
    this.activeClusterer = new lf.maps.MarkerClusterer(optionsString, MarkerClusterer.ClusterMarker);
    this.activeClusterer.setMaxZoom(this.useAggressiveMarkerClustering ? pdataOld : 7);
    this.inactiveClusterer = new lf.maps.MarkerClusterer(optionsString, MarkerClusterer.InactiveClusterMarker);
    this.inactiveClusterer.setMaxZoom(pdataOld);
    this.buildMarkers();
    this.bindMarkerEvents();
    this.inactiveClusterer.redraw();
    this.activeClusterer.redraw();
    optionsString.fitBounds(this.activeClusterer.getMarkerBounds(), 16);
    this.fixViaMichelinMarkers();
  },
  /**
   * @return {undefined}
   */
  bindMarkerEvents : function() {
    var task;
    var angular = this;
    /**
     * @param {MessageEvent} elem
     * @return {undefined}
     */
    var restoreScript = function(elem) {
      angular.showMarkerInfo(elem.data);
    };
    /** @type {number} */
    var i = 0;
    for (;i < this.activeMarkers.length;i += 1) {
      task = this.activeMarkers[i];
      task.bind("click", task, restoreScript);
    }
    /** @type {number} */
    var p = 0;
    for (;p < this.inactiveMarkers.length;p += 1) {
      task = this.inactiveMarkers[p];
      task.bind("click", task, restoreScript);
    }
  },
  /**
   * @return {undefined}
   */
  buildMarkers : function() {
    var self = this;
    var jasmine = lf.app.getApiModule();
    var attributes = {};
    jQuery.each(app.front_office.countries, function(dataAndEvents, key2) {
      jQuery.extend(attributes, app.front_office.points_of_sale[key2]);
    });
    /** @type {null} */
    var description = null;
    if ("baidu" === this.map.service) {
      description = this.map.map;
    }
    jQuery.each(active_markers, function(arg, index) {
      var type = attributes[index];
      if ("undefined" != typeof type) {
        var marker = new jasmine.NumberMarker(arg + 1, type, description);
        if (!self.useAggressiveMarkerClustering) {
          marker.setZIndex(self.map.getMaxZIndex() - arg);
        }
        marker.pos_id = index;
        self.activeClusterer.addMarker(marker, true);
        self.markers[index] = marker;
        self.markersByIndex[arg + 1] = marker;
        self.activeMarkers.push(marker);
      }
    });
    if (this.showInactiveMarkers) {
      jQuery.each(attributes, function(i) {
        if (!self.markers[i]) {
          var values = attributes[i];
          var marker = new jasmine.InactiveMarker(values, description);
          marker.pos_id = i;
          self.inactiveClusterer.addMarker(marker, true);
          self.markers[i] = marker;
          self.inactiveMarkers.push(marker);
        }
      });
    }
  },
  /**
   * @return {undefined}
   */
  closeOpenMarkers : function() {
    /**
     * @param {?} modal
     * @return {undefined}
     */
    var open = function(modal) {
      if (modal.isOpen) {
        modal.hideText();
        /** @type {boolean} */
        modal.isOpen = false;
        if (modal.initialZIndex) {
          modal.setZIndex(modal.initialZIndex);
        }
      }
    };
    /** @type {number} */
    var conditionIndex = 0;
    for (;conditionIndex < this.activeMarkers.length;conditionIndex += 1) {
      open(this.activeMarkers[conditionIndex]);
    }
    /** @type {number} */
    var i = 0;
    for (;i < this.inactiveMarkers.length;i += 1) {
      open(this.inactiveMarkers[i]);
    }
  },
  /**
   * @return {?}
   */
  getErrorText : function() {
    return'<b style="color:red">' + I18n.translate("frontoffice.maps.info_window.loading_error") + "</b>";
  },
  /**
   * @return {?}
   */
  getLoadingText : function() {
    return "<b>" + I18n.translate("frontoffice.maps.info_window.loading_info") + "</b>";
  },
  /**
   * @param {Object} item
   * @return {undefined}
   */
  showMarkerInfo : function(item) {
    this.closeOpenMarkers();
    var self = this;
    /**
     * @return {undefined}
     */
    var init = function() {
      self.map.setCenter(item.getPosition());
      item.setMap(self.map);
      item.setVisible(true);
      if (!self.useAggressiveMarkerClustering) {
        item.initialZIndex = item.getZIndex();
        item.setZIndex(self.map.getMaxZIndex());
      }
      item.showText(self.getLoadingText());
      /** @type {boolean} */
      item.isOpen = true;
      jQuery.ajax({
        url : "/popup/" + item.pos_id,
        dataType : "text",
        /**
         * @param {Object} name
         * @return {undefined}
         */
        success : function(name) {
          item.showText(name);
        },
        /**
         * @return {undefined}
         */
        error : function() {
          item.showText(self.getLoadingText());
        }
      });
    };
    var zoom = this.map.getPointOfSaleZoomLevel();
    if (this.map.getZoom() < zoom) {
      var onWindowHashChange = this.map.bind("zoom_changed", function() {
        self.map.unbind(onWindowHashChange);
        init();
      });
      this.map.setZoom(zoom);
    } else {
      init();
    }
    jQuery(this.canvas).trigger("lf.markerInfoShown", [item]);
  },
  /**
   * @param {?} timeoutKey
   * @return {undefined}
   */
  showMarkerByIndex : function(timeoutKey) {
    if (this.markersByIndex[timeoutKey]) {
      this.showMarkerInfo(this.markersByIndex[timeoutKey]);
    }
  },
  /**
   * @param {boolean} recurring
   * @return {undefined}
   */
  setPositioningMarkerVisible : function(recurring) {
    this.inactiveClusterer.setPositioningMarkerVisible(recurring);
    this.activeClusterer.setPositioningMarkerVisible(recurring);
  },
  /**
   * @return {undefined}
   */
  fixViaMichelinMarkers : function() {
    if ("undefined" != typeof VMLaunch) {
      var edge = this;
      /** @type {number} */
      var interval = window.setInterval(function() {
        if (edge.activeClusterer.hasPlottedMarkers) {
          window.clearInterval(interval);
        } else {
          edge.inactiveClusterer.redraw();
          edge.activeClusterer.redraw();
        }
      }, 300);
    }
  }
});
lf.TabArray = Base.extend({
  /**
   * @param {?} root
   * @return {undefined}
   */
  constructor : function(root) {
    this.root = jQuery(root);
    var rule = this;
    var uriParts = parseUri(window.location.href);
    var regPaths = {};
    this.root.find("a").each(function() {
      var uri = parseUri(this.href);
      if (uri.anchor) {
        regPaths[uri.anchor] = this;
        jQuery.data(this, "lf_tab_content_selector", "#" + uri.anchor);
      }
      if (uri.path === uriParts.path) {
        jQuery(this).click(function(types) {
          types.preventDefault();
          rule.activateLocalTab(this);
        });
      }
    });
    this.root.find("a:not(.active)").each(function() {
      jQuery(jQuery.data(this, "lf_tab_content_selector")).hide();
    });
    var paths = regPaths[uriParts.anchor];
    if (paths) {
      rule.activateLocalTab(paths);
      /** @type {string} */
      window.location.hash = "";
      window.scrollTo(0, 0);
    }
  },
  /**
   * @param {?} target
   * @return {undefined}
   */
  activateLocalTab : function(target) {
    this.root.find("a.active").each(function() {
      jQuery(this).removeClass("active");
      jQuery(jQuery.data(this, "lf_tab_content_selector")).hide();
    });
    jQuery(target).addClass("active");
    jQuery(jQuery.data(target, "lf_tab_content_selector")).each(function() {
      jQuery(this).show();
      if (jQuery(this).find("#lf_accessmap_canvas").length && lf.app.accessMap) {
        lf.app.accessMap.redraw();
        lf.app.accessMap.setCenter(posMarkerCoordinates);
      }
    });
  }
});
lf.SearchForm = Base.extend({
  /**
   * @param {?} root
   * @return {undefined}
   */
  constructor : function(root) {
    this.root = jQuery(root);
    this.form = this.root.find("form");
    this.queryField = this.form.find("#query");
    this.queryError = this.root.find(".search_error");
    this.querySubmit = this.form.find(".submit");
    /** @type {boolean} */
    this.isInitialQuery = true;
    this.initialQueryValue = this.queryField.val();
    this.selector = this.form.find("select[class=redirects]");
    var field = this;
    this.queryField.bind("focusin", function() {
      if (field.isInitialQuery) {
        /** @type {boolean} */
        field.isInitialQuery = false;
        field.queryField.val("");
      }
    });
    this.queryField.bind("focusout", function() {
      if (0 === field.queryField.val().replace(/^\s+/, "").replace(/\s+$/, "").length) {
        /** @type {boolean} */
        field.isInitialQuery = true;
        field.queryField.val(field.initialQueryValue);
      }
    });
    this.queryField.bind("keyUp", function() {
      field.validateQuery();
    });
    this.form.bind("submit", function() {
      if (!field.validateQuery()) {
        field.queryError.show();
        return false;
      }
      return true;
    });
    this.selector.bind("change", function() {
      field.checkForRedirect();
    });
  },
  /**
   * @return {?}
   */
  validateQuery : function() {
    return "" === this.queryField.val().replace(/^\s+/, "").replace(/\s+$/, "") ? false : true;
  },
  /**
   * @return {undefined}
   */
  checkForRedirect : function() {
    if (this.selector.val()) {
      this.selector.attr("disabled", true);
      window.location = this.selector.val();
    }
  },
  /**
   * @param {Function} a
   * @param {Function} b
   * @return {?}
   */
  comparator : function(a, b) {
    return a.postal_code === b.postal_code ? a.name < b.name ? -1 : 1 : a.postal_code < b.postal_code ? -1 : 1;
  },
  /**
   * @param {Array} a
   * @return {undefined}
   */
  populateSelectorFromData : function(a) {
    this.selector.empty();
    jQuery("<option/>").html(app.front_office.select).appendTo(this.selector);
    /** @type {Array} */
    var aProperties = [];
    jQuery.each(a, function(i) {
      aProperties.push(i);
    });
    var self = this;
    jQuery.each(aProperties.sort(), function(dataAndEvents, i) {
      var ol = self.selector;
      if (aProperties.length > 1) {
        ol = jQuery("<optgroup/>").html(i).attr("label", i).appendTo(ol);
      }
      /** @type {Array} */
      var arr = [];
      jQuery.each(a[i], function(dataAndEvents, chunk) {
        arr.push(chunk);
      });
      jQuery.each(arr.sort(self.comparator), function(dataAndEvents, args) {
        if (args.pos_type_has_page === true || "t" === args.pos_type_has_page) {
          /** @type {string} */
          var tpl = args.postal_code + " - " + args.name;
          /** @type {string} */
          var src = "/" + args.url;
          jQuery("<option/>").html(tpl).attr("value", src).appendTo(ol);
        }
      });
    });
  }
});
lf.AjaxSubmissionForm = Base.extend({
  /**
   * @param {?} root
   * @return {undefined}
   */
  constructor : function(root) {
    this.root = jQuery(root);
    this.submitButton = this.root.find(":submit");
    this.spinner = jQuery("<span class='loading'><img width='20' height='20' src='/shared/images/loading.gif' alt='loading'></span>").hide().insertAfter(this.submitButton);
    this.successRequest = this.root.find(".success_request").hide();
    this.errorRequest = this.root.find(".errors_request").hide();
    this.root.find("div.error").hide();
    var data = this;
    this.root.bind("submit", function() {
      data.submit();
      return false;
    });
  },
  /**
   * @return {undefined}
   */
  reset : function() {
    this.root[0].reset();
  },
  /**
   * @return {undefined}
   */
  submit : function() {
    this.successRequest.hide();
    this.errorRequest.hide();
    this.submitButton.addClass("loading").attr("disabled", true);
    this.spinner.show();
    var model = this;
    jQuery.ajax({
      url : this.root.attr("action"),
      type : "POST",
      data : this.root.serialize(),
      dataType : "json",
      /**
       * @param {Function} data
       * @param {?} json
       * @param {?} resp
       * @return {undefined}
       */
      success : function(data, json, resp) {
        model.done(data, json, resp);
      },
      /**
       * @param {Object} xhr
       * @return {undefined}
       */
      complete : function(xhr) {
        if (202 === xhr.status) {
          model.displayVerificationChallenge(xhr.getResponseHeader("Location"));
        } else {
          if (404 === xhr.status) {
            window.location.reload();
          }
        }
      }
    });
  },
  /**
   * @param {Function} data
   * @return {undefined}
   */
  done : function(data) {
    var that = this;
    this.successRequest.empty();
    this.errorRequest.empty();
    this.root.find("div.error").empty();
    if (data) {
      if (data.redirect_to) {
        window.location = data.redirect_to;
      }
    }
    if (data && data.notice) {
      this.successRequest.html(data.notice).show();
      this.reset();
      setTimeout(function() {
        that.successRequest.fadeOut(1E3);
      }, 1E4);
    }
    if (data && data.warning) {
      this.errorRequest.html(data.warning).show();
    } else {
      this.root.trigger("lf.ajax_form_completed");
    }
    if (data) {
      if (data.errors) {
        jQuery.each(data.errors, function(dataAndEvents, which) {
          var ul = jQuery(document.createElement("ul"));
          jQuery.each(which, function(deepDataAndEvents, dataAndEvents) {
            jQuery("<li>" + dataAndEvents + "</li>").appendTo(ul);
          });
          that.root.find("div." + dataAndEvents + "_errors").html(ul).show();
        });
      }
    }
    this.submitButton.removeClass("loading").attr("disabled", false);
    this.spinner.hide();
  },
  /**
   * @param {string} dataAndEvents
   * @return {undefined}
   */
  displayVerificationChallenge : function(dataAndEvents) {
    var timer = this;
    /** @type {string} */
    var output = '<div style="width: 600px; height: 300px; padding: 0px; margin: 0px; border: none; background: transparent;"><iframe id="lf_css_buster" src="' + dataAndEvents + '" type="text/html" width="100%" height="100%" frameborder="0"></iframe></div>';
    jQuery.blockUI({
      message : output,
      css : {
        border : "none",
        padding : "0",
        background : "transparent",
        width : "600px",
        height : "300px",
        top : "150px",
        left : (jQuery(window).width() - 600) / 2 + "px"
      }
    });
    jQuery(document).one("lf.ham_verification.success", function(dataAndEvents, fn) {
      jQuery.unblockUI();
      timer.done(fn);
    }).one("lf.ham_verification.cancel", function() {
      jQuery.unblockUI();
      timer.done();
    });
  }
});
lf.ProductSearchForm = Base.extend({
  /**
   * @param {?} root
   * @return {undefined}
   */
  constructor : function(root) {
    this.root = jQuery(root);
    this.initialState = this.root.html();
    /** @type {boolean} */
    this.loading = false;
    /** @type {boolean} */
    this.cascadingChanges = false;
    var self = this;
    this.root.on("change", "select", function() {
      self.loadResults(self.buildFilterURL());
    });
    this.root.on("change", ":checkbox", function() {
      if (!self.cascadingChanges) {
        /** @type {boolean} */
        self.cascadingChanges = true;
        var $el = jQuery(this);
        self.root.find("input[name=" + $el.attr("name") + "]:checked").not($el).attr("checked", false);
        self.loadResults(self.buildFilterURL());
      }
    }).on("doneLoading", function() {
      /** @type {boolean} */
      self.cascadingChanges = false;
    });
    this.root.on("click", "#pagination a", function(types) {
      types.preventDefault();
      self.loadResults(jQuery(this).attr("href"));
    });
    this.root.on("submit", function(types) {
      types.preventDefault();
      self.loadResults(self.buildFilterURL());
    });
    window.addEventListener("popstate", jQuery.proxy(this.handleBackButton, this));
  },
  /**
   * @param {?} text
   * @return {undefined}
   */
  displayResults : function(text) {
    this.root.html(text);
  },
  /**
   * @param {string} uri
   * @return {undefined}
   */
  loadResults : function(uri) {
    if (!this.loading) {
      /** @type {boolean} */
      this.loading = true;
      this.root.trigger("loading");
      var scope = this;
      /** @type {string} */
      var requestUrl = [uri, uri.indexOf("?") >= 0 ? "&" : "?", "ajax=1"].join("");
      jQuery.ajax({
        url : requestUrl
      }).success(function(option) {
        var json = jQuery(option).html();
        scope.displayResults(json);
        if (window.history.pushState) {
          window.history.pushState(json, null, uri);
        }
      }).complete(function() {
        /** @type {boolean} */
        scope.loading = false;
        scope.root.trigger("doneLoading");
      });
    }
  },
  /**
   * @return {?}
   */
  buildFilterURL : function() {
    var $form = this.root.find("form");
    /** @type {string} */
    var buildFilterURL = [$form.attr("action").split("?")[0], $form.serialize()].join("?");
    return buildFilterURL;
  },
  /**
   * @param {Object} _xhr
   * @return {undefined}
   */
  handleBackButton : function(_xhr) {
    this.displayResults(_xhr.state || this.initialState);
  }
});
/**
 * @param {Object} defaults
 * @return {undefined}
 */
LFListMapScroller = function(defaults) {
  this.init(defaults);
};
jQuery.extend(LFListMapScroller.prototype, {
  /**
   * @param {Object} s
   * @return {undefined}
   */
  init : function(s) {
    this.resultsCol = jQuery(s.resultsCol || ".lf_column1");
    this.map = jQuery(s.map || "#lf_listmap");
    this.canvas = jQuery(s.canvas || "#lf_listmap_canvas");
    this.mapCol = jQuery(s.mapCol || ".lf_column2");
    this.sizeButton = jQuery(s.sizeButton || "#lf_enlargemap");
    this.legendButton = jQuery(s.legendButton || "#lf_showlegend");
    this.legend = jQuery(s.legend || "#lf_listmaplegend").hide();
    this.legendClose = jQuery(s.legend || "#lf_listmaplegend > span");
    this.mapButtons = jQuery(s.mapButtons || "#lf_listmap_buttons");
    this.results = s.results ? jQuery(s.results) : jQuery("#lf_results2").length > 0 ? jQuery("#lf_results2") : jQuery("#lf_results");
    /** @type {boolean} */
    this.wide = false;
    this.scrollTarget = this.map;
    var toggleSize = this;
    this.sizeButton.bind("click", function() {
      toggleSize.toggleSize();
      return false;
    });
    this.legendButton.bind("click", function() {
      toggleSize.toggleLegend();
      return false;
    });
    this.legendClose.bind("click", function() {
      toggleSize.closeLegend();
      return false;
    });
    jQuery(window).bind("scroll", function() {
      toggleSize.userScrolled();
    });
    this.spacer = jQuery('<div id="spacer" style="height:0"></li>');
    this.map.before(this.spacer);
  },
  /**
   * @return {undefined}
   */
  closeLegend : function() {
    this.legend.hide();
  },
  /**
   * @return {undefined}
   */
  toggleLegend : function() {
    if (this.legend.is(":visible")) {
      this.closeLegend();
      this.legendButton.html(I18n.translate("frontoffice.maps.links.legend.show"));
    } else {
      this.legend.show();
      this.legendButton.html(I18n.translate("frontoffice.maps.links.legend.hide"));
    }
    this.userScrolled();
  },
  /**
   * @return {undefined}
   */
  toggleSize : function() {
    var center;
    if (lf.app.listMap) {
      center = lf.app.listMap.map.getCenter();
    }
    this.mapCol.toggleClass("wide");
    this.resultsCol.toggleClass("wide");
    if (this.mapCol.hasClass("wide")) {
      /** @type {boolean} */
      this.wide = true;
      this.sizeButton.html(I18n.translate("frontoffice.maps.links.map.shrink"));
      this.sizeButton.toggleClass("close");
      this.spacer.css("height", 0);
    } else {
      /** @type {boolean} */
      this.wide = false;
      this.sizeButton.html(I18n.translate("frontoffice.maps.links.map.increase"));
      this.sizeButton.toggleClass("close");
    }
    if (lf.app.listMap) {
      lf.app.listMap.map.redraw();
      lf.app.listMap.map.setCenter(center);
    }
    this.userScrolled();
  },
  /**
   * @return {undefined}
   */
  userScrolled : function() {
    if (!this.wide) {
      var right;
      /** @type {number} */
      var left = (this.map.offset().top, parseInt(this.map.innerHeight(), 10));
      var b = this.results.offset().top;
      /** @type {number} */
      var count = parseInt(this.results.innerHeight(), 10);
      var a = jQuery(window).scrollTop();
      jQuery(window).height();
      if (a > b) {
        /** @type {number} */
        right = a - b + 10;
        if (right + left > count) {
          /** @type {number} */
          right = count - left;
        }
      } else {
        /** @type {number} */
        right = 0;
      }
      jQuery("#lf_listmap_legend").html("offset:" + right + ", mapHeight:" + left + ", resultsHeight:" + count);
      this.spacer.animate({
        height : right
      }, {
        duration : 500,
        easing : "easeOutQuint",
        queue : false
      });
    }
  }
});
jQuery(document).ready(function() {
  if ("undefined" == typeof lf_asset_base) {
    /** @type {string} */
    lf_asset_base = "";
  }
  if ("undefined" == typeof lf_viamichelin_settings) {
    lf_viamichelin_settings = {};
    lf_viamichelin_settings.numberMarker = {
      icon : {
        url : lf_asset_base + "/images/markers/active_number.png",
        offsetX : 0,
        offsetY : 0
      },
      size : {
        width : 36,
        height : 44
      },
      overlayText : {
        offsetX : 0,
        offsetY : 0,
        style : {
          color : "#FFD900",
          fontSize : "11pt",
          lineHeight : "52px",
          textAlign : "center",
          width : "36px",
          height : "44px"
        }
      }
    };
    lf_viamichelin_settings.inactiveMarker = {
      icon : {
        url : lf_asset_base + "/images/markers/inactive_number.png",
        offsetX : 0,
        offsetY : 0
      },
      size : {
        width : 36,
        height : 44
      },
      overlayText : {
        offsetX : 0,
        offsetY : 0,
        style : {
          color : "#FFD900",
          fontSize : "11pt",
          lineHeight : "52px",
          textAlign : "center",
          width : "36px",
          height : "44px"
        }
      }
    };
    lf_viamichelin_settings.clusterMarker = {
      icon : {
        url : lf_asset_base + "/images/markers/active_cluster.png",
        offsetX : 0,
        offsetY : 0
      },
      size : {
        width : 47,
        height : 53
      },
      overlayText : {
        offsetX : 0,
        offsetY : 0,
        style : {
          color : "#FFD900",
          fontSize : "11pt",
          lineHeight : "52px",
          textAlign : "center",
          width : "47px",
          height : "53px"
        }
      }
    };
    lf_viamichelin_settings.inactiveClusterMarker = {
      icon : {
        url : lf_asset_base + "/images/markers/inactive_cluster.png",
        offsetX : 0,
        offsetY : 0
      },
      size : {
        width : 47,
        height : 53
      },
      overlayText : {
        offsetX : 0,
        offsetY : 0,
        style : {
          color : "#FFD900",
          fontSize : "11pt",
          lineHeight : "52px",
          textAlign : "center",
          width : "47px",
          height : "53px"
        }
      }
    };
    lf_viamichelin_settings.singleMarker = {
      icon : {
        url : lf_asset_base + "/images/markers/marker.png",
        offsetX : 0,
        offsetY : 0
      },
      size : {
        width : 51,
        height : 47
      },
      overlayText : {
        offsetX : 0,
        offsetY : 0,
        style : {
          color : "#FFD900",
          fontSize : "11pt",
          lineHeight : "52px",
          textAlign : "center",
          width : "51px",
          height : "47px"
        }
      }
    };
  }
});
var app = {};
jQuery(document).ready(function() {
  initializeFormObjects();
  jQuery("#lf_postabs").each(function() {
    lf.app.tabs = new lf.TabArray(this);
  });
  jQuery(".lf_event a").click(function() {
    if (jQuery(this).data("new_window")) {
      window.open(jQuery(this).attr("href"));
      return false;
    }
  });
  jQuery("body.print #lf_printbutton a").bind("click", function() {
    window.print();
    return false;
  });
  detectCountry(jQuery("#lf_search, #lf_search2"));
  jQuery(window).load(function() {
    initializeAppDependentObjects();
    initializePointsOfSaleJSON();
    jQuery.getJSON("/javascripts/translations.json", function(dataAndEvents) {
      I18n.translations = dataAndEvents;
    });
    I18n.locale = 0 === jQuery("html[lang]").length ? "fr" : jQuery("html").attr("lang") || jQuery("html").attr("xml:lang");
    if (jQuery("#lf_openinghours").length) {
      /** @type {number} */
      var t = (new Date).getDay() || 7;
      var ui = jQuery(".lf_openinghoursdays .lf_days > li:nth-child(" + t + ")");
      if (ui.length) {
        ui.addClass("today");
      }
    }
    if (jQuery("#lf_listmap").length) {
      new LFListMapScroller({});
    }
  });
});
/* jshint ignore:end */
