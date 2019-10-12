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

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var Request = /** @class */ (function (_super) {
    __extends(Request, _super);
    function Request(ctx, address, body) {
        var _this = _super.call(this, address, true) || this;
        _this.body = null;
        _this.state = null;
        _this.params = {};
        _this.ctx = ctx;
        _this.state = body;
        return _this;
    }
    return Request;
}(Url));

var Response = /** @class */ (function () {
    function Response(ctx) {
        this.ctx = ctx;
    }
    Response.prototype.http = function (url, force, method, body, callback) {
        var _this = this;
        return this.ctx.ref.generator(url, method, force, body, function (err, ctx) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!err) return [3 /*break*/, 3];
                        if (!this.ctx.ref.error) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.resolve(this.ctx.ref.error(err, ctx))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: throw err;
                    case 3:
                        callback && callback(ctx);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Response.prototype.redirection = function (url, force, body, callback) {
        var _this = this;
        if (this.ctx.ref.routing) {
            this.ctx.ref.pushTask(function () { return _this.http(url, force, 'router', body, callback); });
        }
        else {
            this.http(url, force, 'router', body, callback);
        }
    };
    // Add a history to the browser 
    // and perform the current recorded events and behaviors
    Response.prototype.redirect = function (url) {
        var _this = this;
        return this.redirection(url, false, null, function () {
            if (_this.ctx.ref.event === 'popstate') {
                window.history.pushState(null, _this.ctx.title || window.document.title, _this.ctx.ref.urlencodeWithPrefix(url));
            }
            else {
                window.location.hash = _this.ctx.ref.urlencodeWithPrefix(url);
                window.document.title = _this.ctx.title || window.document.title;
            }
        });
    };
    // Replace the current history for the browser 
    // and perform the current recorded events and behaviors
    Response.prototype.replace = function (url) {
        var _this = this;
        url = this.ctx.ref.urlencodeWithPrefix(url);
        return this.redirection(url, false, null, function () {
            if (_this.ctx.ref.event === 'popstate') {
                window.history.replaceState(null, _this.ctx.title || window.document.title, _this.ctx.ref.urlencodeWithPrefix(url));
            }
            else {
                var i = window.location.href.indexOf('#');
                window.location.replace(window.location.href.slice(0, i >= 0 ? i : 0) + '#' + _this.ctx.ref.urlencodeWithPrefix(url));
                window.document.title = _this.ctx.title || window.document.title;
            }
        });
    };
    // Overloading events and behaviors of the current route
    Response.prototype.realod = function () {
        var _this = this;
        return this.redirection(this.ctx.req.href, true, null, function () {
            if (_this.ctx.ref.event === 'popstate') {
                window.history.pushState(null, _this.ctx.title || window.document.title, _this.ctx.ref.urlencodeWithPrefix(_this.ctx.req.href));
            }
            else {
                window.location.hash = _this.ctx.ref.urlencodeWithPrefix(_this.ctx.req.href);
                window.document.title = _this.ctx.title || window.document.title;
            }
        });
    };
    Response.prototype.get = function (url) {
        return this.http(url, true, 'get', null);
    };
    Response.prototype.post = function (url, data) {
        return this.http(url, true, 'post', data);
    };
    Response.prototype.put = function (url, data) {
        return this.http(url, true, 'put', data);
    };
    Response.prototype.delete = function (url) {
        return this.http(url, true, 'delete', null);
    };
    return Response;
}());

var Context = /** @class */ (function () {
    function Context(url, method, body, reference) {
        this.title = window.document.title;
        this.ref = reference;
        this.req = new Request(this, url, body);
        this.res = new Response(this);
        this.req.method = method;
    }
    Object.defineProperty(Context.prototype, "auth", {
        get: function () {
            return this.req.auth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "hash", {
        get: function () {
            return this.req.hash;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "host", {
        get: function () {
            return this.req.host;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "hostname", {
        get: function () {
            return this.req.hostname;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "href", {
        get: function () {
            return this.req.href;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "origin", {
        get: function () {
            return this.req.origin;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "password", {
        get: function () {
            return this.req.password;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "pathname", {
        get: function () {
            return this.req.pathname;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "port", {
        get: function () {
            return this.req.port;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "protocol", {
        get: function () {
            return this.req.protocol;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "slashes", {
        get: function () {
            return this.req.slashes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "method", {
        get: function () {
            return this.req.method;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "username", {
        get: function () {
            return this.req.username;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "isApi", {
        get: function () {
            return this.method !== 'router';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "query", {
        get: function () {
            return this.req.query;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "state", {
        get: function () {
            return this.req.state;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "params", {
        get: function () {
            return this.req.params;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "referer", {
        get: function () {
            return this.req.referer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "path", {
        get: function () {
            return this.req.pathname;
        },
        enumerable: true,
        configurable: true
    });
    Context.prototype.redirect = function (url) {
        return this.res.redirect(url);
    };
    Context.prototype.replace = function (url) {
        return this.res.replace(url);
    };
    Context.prototype.reload = function () {
        return this.res.realod();
    };
    Context.prototype.get = function (url) {
        return this.res.get(url);
    };
    Context.prototype.post = function (url, data) {
        return this.res.post(url, data);
    };
    Context.prototype.put = function (url, data) {
        return this.res.put(url, data);
    };
    Context.prototype.delete = function (url) {
        return this.res.delete(url);
    };
    return Context;
}());

var VPCExpection = /** @class */ (function (_super) {
    __extends(VPCExpection, _super);
    function VPCExpection(message, status) {
        var _this = _super.call(this, message) || this;
        _this.name = 'VPCExpection';
        _this.status = status;
        return _this;
    }
    return VPCExpection;
}(Error));
function Monitor(options) {
    var _this = this;
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
    var reference = {
        prefix: options.prefix,
        event: options.event,
        error: options.error,
        start: options.start,
        stop: options.stop,
        stacks: [],
        ctx: null,
        microTask: [],
        routing: false,
        get referer() {
            return reference.ctx ? reference.ctx.req.referer : null;
        },
        // Determine the routing address 
        // by the current network address and prefix prefix
        getCurrentRequest: function () {
            var path = reference.event === 'popstate'
                ? window.location.href.substring(window.location.origin.length) || reference.prefix
                : (window.location.hash ? window.location.hash.substring(1) : reference.prefix);
            if (path.startsWith(reference.prefix))
                path = path.substring(reference.prefix.length - 1) || '/';
            return path;
        },
        // Combine custom addresses with prefix to form a network address
        urlencodeWithPrefix: function (url) {
            if (url.startsWith(reference.prefix))
                return url;
            if (url.startsWith('/'))
                url = url.substring(1);
            return reference.prefix + url;
        },
        // Customize events and behaviors by throwing them 
        // into a rule parsing function by customizing the address.
        generator: function (url, method, force, body, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var ctx, isRouter, _a, stopInvoked;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!force && reference.referer === url)
                                return [2 /*return*/];
                            ctx = new Context(url, method, body, reference);
                            isRouter = method === 'router';
                            if (isRouter) {
                                reference.ctx = ctx;
                                reference.routing = true;
                            }
                            _a = reference.start;
                            if (!_a) return [3 /*break*/, 2];
                            return [4 /*yield*/, reference.start(ctx)];
                        case 1:
                            _a = (_b.sent());
                            _b.label = 2;
                        case 2:
                            stopInvoked = false;
                            return [4 /*yield*/, Promise.all(reference.stacks.map(function (stack) { return Promise.resolve(stack(ctx)); }))
                                    .then(function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (isRouter)
                                                    reference.ctx.req.referer = url;
                                                if (!reference.stop) return [3 /*break*/, 2];
                                                return [4 /*yield*/, reference.stop(ctx)];
                                            case 1:
                                                _a.sent();
                                                stopInvoked = true;
                                                _a.label = 2;
                                            case 2:
                                                if (!callback) return [3 /*break*/, 4];
                                                return [4 /*yield*/, callback(null, ctx)];
                                            case 3:
                                                _a.sent();
                                                _a.label = 4;
                                            case 4:
                                                if (isRouter)
                                                    reference.routing = false;
                                                return [2 /*return*/, ctx.body];
                                        }
                                    });
                                }); })
                                    .catch(function (e) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                if (!(!stopInvoked && reference.stop)) return [3 /*break*/, 2];
                                                return [4 /*yield*/, reference.stop(ctx)];
                                            case 1:
                                                _b.sent();
                                                _b.label = 2;
                                            case 2:
                                                _a = callback;
                                                if (!_a) return [3 /*break*/, 4];
                                                return [4 /*yield*/, callback(e, ctx)];
                                            case 3:
                                                _a = (_b.sent());
                                                _b.label = 4;
                                            case 4:
                                                if (isRouter)
                                                    reference.routing = false;
                                                return [2 /*return*/, Promise.reject(e)];
                                        }
                                    });
                                }); })
                                    .then(function (data) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, reference.execTask()];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/, data];
                                        }
                                    });
                                }); })
                                    .catch(function (e) { })
                                    .finally(function () {
                                    if (isRouter)
                                        reference.routing = false;
                                })];
                        case 3: return [2 /*return*/, _b.sent()];
                    }
                });
            });
        },
        pushTask: function (fn) {
            reference.microTask.push(fn);
        },
        execTask: function () {
            return __awaiter(this, void 0, void 0, function () {
                var tasks;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!reference.microTask.length)
                                return [2 /*return*/];
                            tasks = reference.microTask.slice(0);
                            reference.microTask = [];
                            return [4 /*yield*/, Promise.all(tasks.map(function (task) { return Promise.resolve(task()); }))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
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
            return reference.bootstrap(mapState[path] || path);
        },
        bootstrap: function (url) {
            var _this = this;
            url = reference.urlencodeWithPrefix(url);
            return reference.generator(url, 'router', false, null, function (err, ctx) { return __awaiter(_this, void 0, void 0, function () {
                var i;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!err) return [3 /*break*/, 3];
                            if (!reference.error) return [3 /*break*/, 2];
                            return [4 /*yield*/, Promise.resolve(reference.error(err, ctx))];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: throw err;
                        case 3:
                            if (reference.event === 'popstate') {
                                window.history.replaceState(null, ctx.title || window.document.title, reference.urlencodeWithPrefix(url));
                            }
                            else {
                                i = window.location.href.indexOf('#');
                                window.location.replace(window.location.href.slice(0, i >= 0 ? i : 0) + '#' + reference.urlencodeWithPrefix(url));
                                window.document.title = ctx.title || window.document.title;
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    // Listen to browser default behavior
    window.addEventListener(reference.event, function () {
        var path = reference.getCurrentRequest();
        reference.generator(path, 'router', false, null, function (e, ctx) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!e) return [3 /*break*/, 3];
                        if (!reference.error) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.resolve(reference.error(e, ctx))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: throw e;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    });
    return function createServer() {
        var fns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fns[_i] = arguments[_i];
        }
        return reference.callback.apply(reference, fns);
    };
}

exports.Context = Context;
exports.Request = Request;
exports.Response = Response;
exports.VPCExpection = VPCExpection;
exports.default = Monitor;
