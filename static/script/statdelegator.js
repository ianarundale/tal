/**
 * @fileOverview Requirejs module containing base antie.StatDelegator class.
 * @author Ian Arundale <ian.arundale@bbc.co.uk>
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
 * (http://www.bbc.co.uk) and TAL Contributors (1)
 *
 * (1) TAL Contributors are listed in the AUTHORS file and at
 *     https://github.com/fmtvp/TAL/AUTHORS - please extend this file,
 *     not this notice.
 *
 * @license Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * All rights reserved
 * Please contact us for an alternative licence
 */

require.def("antie/statdelegator",
    [
        "antie/class"
    ],
    function(Class) {
        'use strict';

        var StatDelegator = Class.extend({
            /**
             * @constructor
             * @ignore
             */
            init: function() {
                this._delegates = [];
            },
            registerDelegate : function(delegateObject) {
                // TODO: Error checking on the delegate object
                this._delegates.push(delegateObject);
            },
            _delegateFunctionCall : function(functionName, params) {
                var i = 0, noOfDelegates = this._delegates.length;
                for (i; i < noOfDelegates; i++) {
                    var delegate = this._delegates[i];
                    if (this._doesDelegateSupportFunction(delegate, functionName)) {
                        delegate[functionName](params);
                    }
                }
            },
            _doesDelegateSupportFunction : function(delegate, functionName) {
                //debugger;
                if (typeof(delegate[functionName]) === "function") {
                    return true;
                }


                return false;
            },

            /**
             * Media Events
             */

            sendPlayEvent : function(params) {
                this._delegateFunctionCall("sendPlayEvent", params);
            }
        });

        return StatDelegator;

    });

