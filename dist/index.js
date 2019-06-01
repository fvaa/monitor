'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Url = require('url-parse');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var Request = /** @class */ (function (_super) {
    __extends(Request, _super);
    function Request(address) {
        return _super.call(this, address, true) || this;
    }
    return Request;
}(Url));

var Response = /** @class */ (function () {
    function Response(context) {
        this.context = context;
    }
    Response.prototype.redirection = function (url, force, callback) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.context.generator(url, 'router', force, null, function (err, req, res) {
                if (err) {
                    if (_this.context.error) {
                        _this.context.error(err, req, res);
                    }
                    return resolve();
                }
                callback && callback();
                resolve();
            });
        });
    };
    // Add a history to the browser 
    // and perform the current recorded events and behaviors
    Response.prototype.redirect = function (url) {
        var _this = this;
        return this.redirection(url, false, function () {
            if (_this.context.event === 'popstate') {
                window.history.pushState(null, window.document.title, _this.context.urlencodeWithPrefix(url));
            }
            else {
                window.location.hash = _this.context.urlencodeWithPrefix(url);
            }
        });
    };
    // Replace the current history for the browser 
    // and perform the current recorded events and behaviors
    Response.prototype.replace = function (url) {
        var _this = this;
        url = this.context.urlencodeWithPrefix(url);
        return this.redirection(url, false, function () {
            if (_this.context.event === 'popstate') {
                window.history.replaceState(null, window.document.title, _this.context.urlencodeWithPrefix(url));
            }
            else {
                var i = window.location.href.indexOf('#');
                window.location.replace(window.location.href.slice(0, i >= 0 ? i : 0) + '#' + _this.context.urlencodeWithPrefix(url));
            }
        });
    };
    // Overloading events and behaviors of the current route
    Response.prototype.realod = function () {
        var _this = this;
        return this.redirection(this.request.href, true, function () {
            if (_this.context.event === 'popstate') {
                window.history.pushState(null, window.document.title, _this.context.urlencodeWithPrefix(_this.request.href));
            }
            else {
                window.location.hash = _this.context.urlencodeWithPrefix(_this.request.href);
            }
        });
    };
    return Response;
}());

function Monitor(options) {
    if (options === void 0) { options = {
        prefix: '/',
        event: 'hashchange',
    }; }
    /**
     * In the following two cases, the system will force the listen mode to be converted to `hashchange`:
     *  1. When the `popstate` listen mode is specified, but the system browser does not support.
     *  2. When loading the page using the file protocol.
     */
    if ((options.event === 'popstate' && !window.history.pushState) ||
        window.location.protocol.indexOf('file:') === 0) {
        options.event = 'hashchange';
    }
    // We agree that the `options.prefix` must end with `/`
    if (!options.prefix)
        options.prefix = '/';
    if (!options.prefix.endsWith('/'))
        options.prefix += '/';
    var context = {
        prefix: options.prefix,
        event: options.event,
        error: options.error,
        stacks: [],
        referer: null,
        // Determine the routing address 
        // by the current network address and prefix prefix
        getCurrentRequest: function () {
            var path = this.event === 'popstate'
                ? window.location.href.substring(window.location.origin.length) || this.prefix
                : (window.location.hash ? window.location.hash.substring(1) : this.prefix);
            if (path.startsWith(this.prefix))
                path = path.substring(this.prefix.length - 1) || '/';
            return path;
        },
        // Combine custom addresses with prefix to form a network address
        urlencodeWithPrefix: function (url) {
            if (url.startsWith(this.prefix))
                return url;
            if (url.startsWith('/'))
                url = url.substring(1);
            return this.prefix + url;
        },
        // Customize events and behaviors by throwing them 
        // into a rule parsing function by customizing the address.
        generator: function (url, method, force, body, callback) {
            var _this = this;
            if (!force && this.referer === url)
                return;
            var request = new Request(url);
            var response = new Response(this);
            request.body = body;
            request.referer = this.referer;
            request.method = method;
            request.response = response;
            response.request = request;
            request.context = this;
            Promise.all(context.stacks.map(function (stack) { return stack(request, response); }))
                .then(function () {
                if (method === 'router')
                    _this.referer = url;
                if (callback)
                    return callback(null, request, response);
            }).catch(function (e) { return callback && callback(e, request, response); });
        },
        // Stack throw function for multi-layer custom events and behaviors
        callback: function () {
            var _a;
            var fns = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                fns[_i] = arguments[_i];
            }
            (_a = this.stacks).push.apply(_a, fns);
            return this;
        },
        // The jump map is implemented by listening 
        // to the matched route through the parameter dictionary.
        listen: function (mapState) {
            if (mapState === void 0) { mapState = {}; }
            var path = this.getCurrentRequest();
            var response = new Response(this);
            return response.replace(mapState[path] || path);
        }
    };
    // Listen to browser default behavior
    window.addEventListener(context.event, function () {
        var path = context.getCurrentRequest();
        context.generator(path, 'router', false, null, function (e, req, res) {
            if (context.error) {
                context.error(e, req, res);
            }
        });
    });
    return function createServer() {
        var fns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fns[_i] = arguments[_i];
        }
        return context.callback.apply(context, fns);
    };
}

exports.Request = Request;
exports.Response = Response;
exports.default = Monitor;
