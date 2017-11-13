'use strict';
var _vm;


function _load_vm() {
    return _vm = _interopRequireDefault(require('vm'));
}

var _jestUtil;

function _load_jestUtil() {
    return _jestUtil = require('jest-util');
}

var _jestMock;

function _load_jestMock() {
    return _jestMock = _interopRequireDefault(require('jest-mock'));
}

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
}

class CustomContextEnvironment {


    constructor(config) {
        this.context = (_vm || _load_vm()).default.createContext();
        const global = this.global = (_vm || _load_vm()).default.runInContext('this', this.context);
        global.global = global;
        global.moduleContext = (_vm || _load_vm()).default.createContext();
        global.clearInterval = clearInterval;
        global.clearTimeout = clearTimeout;
        global.Promise = Promise;
        global.setInterval = setInterval;
        global.setTimeout = setTimeout;
        (0, (_jestUtil || _load_jestUtil()).installCommonGlobals)(global, config.globals);
        this.moduleMocker = new (_jestMock || _load_jestMock()).default.ModuleMocker(global);
        this.fakeTimers = new (_jestUtil || _load_jestUtil()).FakeTimers(global, this.moduleMocker, config);
    }

    dispose() {
        if (this.fakeTimers) {
            this.fakeTimers.dispose();
        }
        this.context = null;
        this.fakeTimers = null;
    }

    // Disabling rule as return type depends on script's return type.
    /* eslint-disable flowtype/no-weak-types */
    runScript(script) {
        /* eslint-enable flowtype/no-weak-types */
        var nodeEnvironment = this;
        if (this.context) {
            return {
                "Object.<anonymous>": new function (script) {
                    return function (moduleObject, moduleExports, requireImp, dirname, filename, globalObj, jestObjFor) {
                        var scriptContext = script.runInContext(nodeEnvironment.context);
                        for (var key in nodeEnvironment.global.moduleContext){
                            this[key] = nodeEnvironment.global.moduleContext[key];
                        }
                        var scriptModule = scriptContext["Object.<anonymous>"];
                        if (jestObjFor == null) {
                            jestObjFor = nodeEnvironment.context;
                        }
                        return scriptModule.call(this, moduleObject, moduleExports, requireImp, dirname, filename, globalObj, jestObjFor);
                    }
                }(script)
            }
        }
        return null;
    }
}

/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */module.exports = CustomContextEnvironment;