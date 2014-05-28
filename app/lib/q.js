(function(definition) {
    if ("function" == typeof bootstrap) bootstrap("promise", definition); else if ("object" == typeof exports) module.exports = definition(); else if ("function" == typeof define && define.amd) define(definition); else if ("undefined" != typeof ses) {
        if (!ses.ok()) return;
        ses.makeQ = definition;
    } else Q = definition();
})(function() {
    "use strict";
    function uncurryThis(f) {
        var call = Function.call;
        return function() {
            return call.apply(f, arguments);
        };
    }
    function isObject(value) {
        return value === Object(value);
    }
    function isStopIteration(exception) {
        return "[object StopIteration]" === object_toString(exception) || exception instanceof QReturnValue;
    }
    function makeStackTraceLong(error, promise) {
        hasStacks && promise.stack && "object" == typeof error && null !== error && error.stack && -1 === error.stack.indexOf(STACK_JUMP_SEPARATOR) && (error.stack = filterStackString(error.stack) + "\n" + STACK_JUMP_SEPARATOR + "\n" + filterStackString(promise.stack));
    }
    function filterStackString(stackString) {
        var lines = stackString.split("\n");
        var desiredLines = [];
        for (var i = 0; lines.length > i; ++i) {
            var line = lines[i];
            isInternalFrame(line) || isNodeFrame(line) || !line || desiredLines.push(line);
        }
        return desiredLines.join("\n");
    }
    function isNodeFrame(stackLine) {
        return -1 !== stackLine.indexOf("(module.js:") || -1 !== stackLine.indexOf("(node.js:");
    }
    function getFileNameAndLineNumber(stackLine) {
        var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
        if (attempt1) return [ attempt1[1], Number(attempt1[2]) ];
        var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
        if (attempt2) return [ attempt2[1], Number(attempt2[2]) ];
        var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
        if (attempt3) return [ attempt3[1], Number(attempt3[2]) ];
    }
    function isInternalFrame(stackLine) {
        var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);
        if (!fileNameAndLineNumber) return false;
        var fileName = fileNameAndLineNumber[0];
        var lineNumber = fileNameAndLineNumber[1];
        return fileName === qFileName && lineNumber >= qStartingLine && qEndingLine >= lineNumber;
    }
    function captureLine() {
        if (!hasStacks) return;
        try {
            throw new Error();
        } catch (e) {
            var lines = e.stack.split("\n");
            var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
            var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
            if (!fileNameAndLineNumber) return;
            qFileName = fileNameAndLineNumber[0];
            return fileNameAndLineNumber[1];
        }
    }
    function Q(value) {
        return resolve(value);
    }
    function defer() {
        function become(promise) {
            resolvedPromise = promise;
            array_reduce(pending, function(undefined, pending) {
                nextTick(function() {
                    promise.promiseDispatch.apply(promise, pending);
                });
            }, void 0);
            pending = void 0;
            progressListeners = void 0;
        }
        var resolvedPromise, pending = [], progressListeners = [];
        var deferred = object_create(defer.prototype);
        var promise = object_create(makePromise.prototype);
        promise.promiseDispatch = function(resolve, op, operands) {
            var args = array_slice(arguments);
            if (pending) {
                pending.push(args);
                "when" === op && operands[1] && progressListeners.push(operands[1]);
            } else nextTick(function() {
                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
            });
        };
        promise.valueOf = function() {
            if (pending) return promise;
            var nearer = valueOf(resolvedPromise);
            isPromise(nearer) && (resolvedPromise = nearer);
            return nearer;
        };
        if (Q.longStackJumpLimit > 0 && hasStacks) try {
            throw new Error();
        } catch (e) {
            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
        }
        deferred.promise = promise;
        deferred.resolve = function(value) {
            if (resolvedPromise) return;
            become(resolve(value));
        };
        deferred.fulfill = function(value) {
            if (resolvedPromise) return;
            become(fulfill(value));
        };
        deferred.reject = function(reason) {
            if (resolvedPromise) return;
            become(reject(reason));
        };
        deferred.notify = function(progress) {
            if (resolvedPromise) return;
            array_reduce(progressListeners, function(undefined, progressListener) {
                nextTick(function() {
                    progressListener(progress);
                });
            }, void 0);
        };
        return deferred;
    }
    function promise(resolver) {
        if ("function" != typeof resolver) throw new TypeError("resolver must be a function.");
        var deferred = defer();
        fcall(resolver, deferred.resolve, deferred.reject, deferred.notify).fail(deferred.reject);
        return deferred.promise;
    }
    function makePromise(descriptor, fallback, valueOf, exception, isException) {
        void 0 === fallback && (fallback = function(op) {
            return reject(new Error("Promise does not support operation: " + op));
        });
        var promise = object_create(makePromise.prototype);
        promise.promiseDispatch = function(resolve, op, args) {
            var result;
            try {
                result = descriptor[op] ? descriptor[op].apply(promise, args) : fallback.call(promise, op, args);
            } catch (exception) {
                result = reject(exception);
            }
            resolve && resolve(result);
        };
        valueOf && (promise.valueOf = valueOf);
        isException && (promise.exception = exception);
        return promise;
    }
    function valueOf(value) {
        if (isPromise(value)) return value.valueOf();
        return value;
    }
    function isPromise(object) {
        return isObject(object) && "function" == typeof object.promiseDispatch;
    }
    function isPromiseAlike(object) {
        return isObject(object) && "function" == typeof object.then;
    }
    function isPending(object) {
        return !isFulfilled(object) && !isRejected(object);
    }
    function isFulfilled(object) {
        return !isPromiseAlike(valueOf(object));
    }
    function isRejected(object) {
        object = valueOf(object);
        return isPromise(object) && "exception" in object;
    }
    function displayUnhandledReasons() {
        unhandledReasonsDisplayed || "undefined" == typeof window || window.Touch || !window.console || console.warn("[Q] Unhandled rejection reasons (should be empty):", unhandledReasons);
        unhandledReasonsDisplayed = true;
    }
    function reject(reason) {
        var rejection = makePromise({
            when: function(rejected) {
                if (rejected) {
                    var at = array_indexOf(unhandledRejections, this);
                    if (-1 !== at) {
                        unhandledRejections.splice(at, 1);
                        unhandledReasons.splice(at, 1);
                    }
                }
                return rejected ? rejected(reason) : this;
            }
        }, function() {
            return this;
        }, function() {
            return this;
        }, reason, true);
        displayUnhandledReasons();
        unhandledRejections.push(rejection);
        unhandledReasons.push(reason);
        return rejection;
    }
    function fulfill(object) {
        return makePromise({
            when: function() {
                return object;
            },
            get: function(name) {
                return object[name];
            },
            set: function(name, value) {
                object[name] = value;
            },
            "delete": function(name) {
                delete object[name];
            },
            post: function(name, args) {
                return null === name || void 0 === name ? object.apply(void 0, args) : object[name].apply(object, args);
            },
            apply: function(thisP, args) {
                return object.apply(thisP, args);
            },
            keys: function() {
                return object_keys(object);
            }
        }, void 0, function() {
            return object;
        });
    }
    function resolve(value) {
        if (isPromise(value)) return value;
        value = valueOf(value);
        return isPromiseAlike(value) ? coerce(value) : fulfill(value);
    }
    function coerce(promise) {
        var deferred = defer();
        nextTick(function() {
            try {
                promise.then(deferred.resolve, deferred.reject, deferred.notify);
            } catch (exception) {
                deferred.reject(exception);
            }
        });
        return deferred.promise;
    }
    function master(object) {
        return makePromise({
            isDef: function() {}
        }, function(op, args) {
            return dispatch(object, op, args);
        }, function() {
            return valueOf(object);
        });
    }
    function when(value, fulfilled, rejected, progressed) {
        function _fulfilled(value) {
            try {
                return "function" == typeof fulfilled ? fulfilled(value) : value;
            } catch (exception) {
                return reject(exception);
            }
        }
        function _rejected(exception) {
            if ("function" == typeof rejected) {
                makeStackTraceLong(exception, resolvedValue);
                try {
                    return rejected(exception);
                } catch (newException) {
                    return reject(newException);
                }
            }
            return reject(exception);
        }
        function _progressed(value) {
            return "function" == typeof progressed ? progressed(value) : value;
        }
        var deferred = defer();
        var done = false;
        var resolvedValue = resolve(value);
        nextTick(function() {
            resolvedValue.promiseDispatch(function(value) {
                if (done) return;
                done = true;
                deferred.resolve(_fulfilled(value));
            }, "when", [ function(exception) {
                if (done) return;
                done = true;
                deferred.resolve(_rejected(exception));
            } ]);
        });
        resolvedValue.promiseDispatch(void 0, "when", [ void 0, function(value) {
            var newValue;
            var threw = false;
            try {
                newValue = _progressed(value);
            } catch (e) {
                threw = true;
                if (!Q.onerror) throw e;
                Q.onerror(e);
            }
            threw || deferred.notify(newValue);
        } ]);
        return deferred.promise;
    }
    function spread(promise, fulfilled, rejected) {
        return when(promise, function(valuesOrPromises) {
            return all(valuesOrPromises).then(function(values) {
                return fulfilled.apply(void 0, values);
            }, rejected);
        }, rejected);
    }
    function async(makeGenerator) {
        return function() {
            function continuer(verb, arg) {
                var result;
                if (hasES6Generators) {
                    try {
                        result = generator[verb](arg);
                    } catch (exception) {
                        return reject(exception);
                    }
                    return result.done ? result.value : when(result.value, callback, errback);
                }
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    return isStopIteration(exception) ? exception.value : reject(exception);
                }
                return when(result, callback, errback);
            }
            var generator = makeGenerator.apply(this, arguments);
            var callback = continuer.bind(continuer, "send");
            var errback = continuer.bind(continuer, "throw");
            return callback();
        };
    }
    function _return(value) {
        throw new QReturnValue(value);
    }
    function promised(callback) {
        return function() {
            return spread([ this, all(arguments) ], function(self, args) {
                return callback.apply(self, args);
            });
        };
    }
    function dispatch(object, op, args) {
        var deferred = defer();
        nextTick(function() {
            resolve(object).promiseDispatch(deferred.resolve, op, args);
        });
        return deferred.promise;
    }
    function dispatcher(op) {
        return function(object) {
            var args = array_slice(arguments, 1);
            return dispatch(object, op, args);
        };
    }
    function send(value, name) {
        var args = array_slice(arguments, 2);
        return post(value, name, args);
    }
    function fapply(value, args) {
        return dispatch(value, "apply", [ void 0, args ]);
    }
    function fcall(value) {
        var args = array_slice(arguments, 1);
        return fapply(value, args);
    }
    function fbind(value) {
        var args = array_slice(arguments, 1);
        return function() {
            var allArgs = args.concat(array_slice(arguments));
            return dispatch(value, "apply", [ this, allArgs ]);
        };
    }
    function all(promises) {
        return when(promises, function(promises) {
            var countDown = 0;
            var deferred = defer();
            array_reduce(promises, function(undefined, promise, index) {
                if (isFulfilled(promise)) promises[index] = valueOf(promise); else {
                    ++countDown;
                    when(promise, function(value) {
                        promises[index] = value;
                        0 === --countDown && deferred.resolve(promises);
                    }, deferred.reject);
                }
            }, void 0);
            0 === countDown && deferred.resolve(promises);
            return deferred.promise;
        });
    }
    function allResolved(promises) {
        return when(promises, function(promises) {
            promises = array_map(promises, resolve);
            return when(all(array_map(promises, function(promise) {
                return when(promise, noop, noop);
            })), function() {
                return promises;
            });
        });
    }
    function fail(promise, rejected) {
        return when(promise, void 0, rejected);
    }
    function progress(promise, progressed) {
        return when(promise, void 0, void 0, progressed);
    }
    function fin(promise, callback) {
        return when(promise, function(value) {
            return when(callback(), function() {
                return value;
            });
        }, function(exception) {
            return when(callback(), function() {
                return reject(exception);
            });
        });
    }
    function done(promise, fulfilled, rejected, progress) {
        var onUnhandledError = function(error) {
            nextTick(function() {
                makeStackTraceLong(error, promise);
                if (!Q.onerror) throw error;
                Q.onerror(error);
            });
        };
        var promiseToHandle = fulfilled || rejected || progress ? when(promise, fulfilled, rejected, progress) : promise;
        "object" == typeof process && process && process.domain && (onUnhandledError = process.domain.bind(onUnhandledError));
        fail(promiseToHandle, onUnhandledError);
    }
    function timeout(promise, ms, msg) {
        var deferred = defer();
        var timeoutId = setTimeout(function() {
            deferred.reject(new Error(msg || "Timed out after " + ms + " ms"));
        }, ms);
        when(promise, function(value) {
            clearTimeout(timeoutId);
            deferred.resolve(value);
        }, function(exception) {
            clearTimeout(timeoutId);
            deferred.reject(exception);
        }, deferred.notify);
        return deferred.promise;
    }
    function delay(promise, timeout) {
        if (void 0 === timeout) {
            timeout = promise;
            promise = void 0;
        }
        var deferred = defer();
        when(promise, void 0, void 0, deferred.notify);
        setTimeout(function() {
            deferred.resolve(promise);
        }, timeout);
        return deferred.promise;
    }
    function nfapply(callback, args) {
        var nodeArgs = array_slice(args);
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        fapply(callback, nodeArgs).fail(deferred.reject);
        return deferred.promise;
    }
    function nfcall(callback) {
        var nodeArgs = array_slice(arguments, 1);
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        fapply(callback, nodeArgs).fail(deferred.reject);
        return deferred.promise;
    }
    function nfbind(callback) {
        var baseArgs = array_slice(arguments, 1);
        return function() {
            var nodeArgs = baseArgs.concat(array_slice(arguments));
            var deferred = defer();
            nodeArgs.push(deferred.makeNodeResolver());
            fapply(callback, nodeArgs).fail(deferred.reject);
            return deferred.promise;
        };
    }
    function nbind(callback, thisArg) {
        var baseArgs = array_slice(arguments, 2);
        return function() {
            function bound() {
                return callback.apply(thisArg, arguments);
            }
            var nodeArgs = baseArgs.concat(array_slice(arguments));
            var deferred = defer();
            nodeArgs.push(deferred.makeNodeResolver());
            fapply(bound, nodeArgs).fail(deferred.reject);
            return deferred.promise;
        };
    }
    function npost(object, name, args) {
        var nodeArgs = array_slice(args || []);
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        post(object, name, nodeArgs).fail(deferred.reject);
        return deferred.promise;
    }
    function nsend(object, name) {
        var nodeArgs = array_slice(arguments, 2);
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        post(object, name, nodeArgs).fail(deferred.reject);
        return deferred.promise;
    }
    function nodeify(promise, nodeback) {
        if (!nodeback) return promise;
        promise.then(function(value) {
            nextTick(function() {
                nodeback(null, value);
            });
        }, function(error) {
            nextTick(function() {
                nodeback(error);
            });
        });
    }
    var hasStacks = false;
    try {
        throw new Error();
    } catch (e) {
        hasStacks = !!e.stack;
    }
    var qStartingLine = captureLine();
    var qFileName;
    var noop = function() {};
    var nextTick;
    "function" == typeof setImmediate ? nextTick = "undefined" != typeof window ? setImmediate.bind(window) : setImmediate : "undefined" != typeof process && process.nextTick ? nextTick = process.nextTick : function() {
        function onTick() {
            --pendingTicks;
            if (++usedTicks >= maxPendingTicks) {
                usedTicks = 0;
                maxPendingTicks *= 4;
                var expectedTicks = queuedTasks && Math.min(queuedTasks - 1, maxPendingTicks);
                while (expectedTicks > pendingTicks) {
                    ++pendingTicks;
                    requestTick();
                }
            }
            while (queuedTasks) {
                --queuedTasks;
                head = head.next;
                var task = head.task;
                head.task = void 0;
                task();
            }
            usedTicks = 0;
        }
        var head = {
            task: void 0,
            next: null
        };
        var tail = head;
        var maxPendingTicks = 2;
        var pendingTicks = 0;
        var queuedTasks = 0;
        var usedTicks = 0;
        var requestTick = void 0;
        nextTick = function(task) {
            tail = tail.next = {
                task: task,
                next: null
            };
            if (++queuedTasks > pendingTicks && maxPendingTicks > pendingTicks) {
                ++pendingTicks;
                requestTick();
            }
        };
        if ("undefined" != typeof MessageChannel) {
            var channel = new MessageChannel();
            channel.port1.onmessage = onTick;
            requestTick = function() {
                channel.port2.postMessage(0);
            };
        } else requestTick = function() {
            setTimeout(onTick, 0);
        };
    }();
    var array_slice = uncurryThis(Array.prototype.slice);
    var array_reduce = uncurryThis(Array.prototype.reduce || function(callback, basis) {
        var index = 0, length = this.length;
        if (1 === arguments.length) do {
            if (index in this) {
                basis = this[index++];
                break;
            }
            if (++index >= length) throw new TypeError();
        } while (1);
        for (;length > index; index++) index in this && (basis = callback(basis, this[index], index));
        return basis;
    });
    var array_indexOf = uncurryThis(Array.prototype.indexOf || function(value) {
        for (var i = 0; this.length > i; i++) if (this[i] === value) return i;
        return -1;
    });
    var array_map = uncurryThis(Array.prototype.map || function(callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function(undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
    });
    var object_create = Object.create || function(prototype) {
        function Type() {}
        Type.prototype = prototype;
        return new Type();
    };
    var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);
    var object_keys = Object.keys || function(object) {
        var keys = [];
        for (var key in object) object_hasOwnProperty(object, key) && keys.push(key);
        return keys;
    };
    var object_toString = uncurryThis(Object.prototype.toString);
    var QReturnValue;
    QReturnValue = "undefined" != typeof ReturnValue ? ReturnValue : function(value) {
        this.value = value;
    };
    var hasES6Generators;
    try {
        eval("(function* (){ yield 1; })");
        hasES6Generators = true;
    } catch (e) {
        hasES6Generators = false;
    }
    Q.longStackJumpLimit = 1;
    var STACK_JUMP_SEPARATOR = "From previous event:";
    Q.nextTick = nextTick;
    Q.defer = defer;
    defer.prototype.makeNodeResolver = function() {
        var self = this;
        return function(error, value) {
            error ? self.reject(error) : arguments.length > 2 ? self.resolve(array_slice(arguments, 1)) : self.resolve(value);
        };
    };
    Q.promise = promise;
    Q.makePromise = makePromise;
    makePromise.prototype.then = function(fulfilled, rejected, progressed) {
        return when(this, fulfilled, rejected, progressed);
    };
    makePromise.prototype.thenResolve = function(value) {
        return when(this, function() {
            return value;
        });
    };
    makePromise.prototype.thenReject = function(reason) {
        return when(this, function() {
            throw reason;
        });
    };
    array_reduce([ "isFulfilled", "isRejected", "isPending", "dispatch", "when", "spread", "get", "set", "del", "delete", "post", "send", "invoke", "keys", "fapply", "fcall", "fbind", "all", "allResolved", "timeout", "delay", "catch", "finally", "fail", "fin", "progress", "done", "nfcall", "nfapply", "nfbind", "denodeify", "nbind", "npost", "nsend", "ninvoke", "nodeify" ], function(undefined, name) {
        makePromise.prototype[name] = function() {
            return Q[name].apply(Q, [ this ].concat(array_slice(arguments)));
        };
    }, void 0);
    makePromise.prototype.toSource = function() {
        return this.toString();
    };
    makePromise.prototype.toString = function() {
        return "[object Promise]";
    };
    Q.nearer = valueOf;
    Q.isPromise = isPromise;
    Q.isPromiseAlike = isPromiseAlike;
    Q.isPending = isPending;
    Q.isFulfilled = isFulfilled;
    Q.isRejected = isRejected;
    var unhandledReasons = Q.unhandledReasons = [];
    var unhandledRejections = [];
    var unhandledReasonsDisplayed = false;
    Q.resetUnhandledRejections = function() {
        unhandledReasons.length = 0;
        unhandledRejections.length = 0;
        unhandledReasonsDisplayed = false;
    };
    "undefined" != typeof process && process.on && process.on("exit", function() {
        for (var i = 0; unhandledReasons.length > i; i++) {
            var reason = unhandledReasons[i];
            reason && "undefined" != typeof reason.stack ? console.warn("Unhandled rejection reason:", reason.stack) : console.warn("Unhandled rejection reason (no stack):", reason);
        }
    });
    Q.reject = reject;
    Q.fulfill = fulfill;
    Q.resolve = resolve;
    Q.master = master;
    Q.when = when;
    Q.spread = spread;
    Q.async = async;
    Q["return"] = _return;
    Q.promised = promised;
    Q.dispatch = dispatch;
    Q.dispatcher = dispatcher;
    Q.get = dispatcher("get");
    Q.set = dispatcher("set");
    Q["delete"] = Q.del = dispatcher("delete");
    var post = Q.post = dispatcher("post");
    Q.send = send;
    Q.invoke = send;
    Q.fapply = fapply;
    Q["try"] = fcall;
    Q.fcall = fcall;
    Q.fbind = fbind;
    Q.keys = dispatcher("keys");
    Q.all = all;
    Q.allResolved = allResolved;
    Q["catch"] = Q.fail = fail;
    Q.progress = progress;
    Q["finally"] = Q.fin = fin;
    Q.done = done;
    Q.timeout = timeout;
    Q.delay = delay;
    Q.nfapply = nfapply;
    Q.nfcall = nfcall;
    Q.nfbind = nfbind;
    Q.denodeify = Q.nfbind;
    Q.nbind = nbind;
    Q.npost = npost;
    Q.nsend = nsend;
    Q.ninvoke = Q.nsend;
    Q.nodeify = nodeify;
    var qEndingLine = captureLine();
    return Q;
});