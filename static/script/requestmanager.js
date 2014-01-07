/**
 * @fileOverview Requirejs modifier for default XHR-based network operations
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

require.def("antie/requestmanager",
    [],
    function () {

        function RequestManager() {
            var _inFlightRequests = {};

            /**
             *
             * @param url {String} The URL of the resource being requested
             * @param callbacks {Object} onSuccess and onError callbacks
             */
            this.registerRequest = function(url, callbacks) {
                _inFlightRequests[url] = _inFlightRequests[url] || [];
                _inFlightRequests[url].push(callbacks);
            };

            /**
             *
             * @param url {String} The URL of the resource being requested
             */
            this.isRequestInFlight = function(url) {
                return !!(_inFlightRequests[url] && _inFlightRequests[url].length > 0);
            };

            /**
             *
             * @param url
             */
            this.getQueuedRequestsCallbacks = function(url) {
                return {
                    onSuccess : function (data) {
                        this._triggerRequestCallbacks("onSuccess", data);
                    },
                    onError : function (error) {
                        this._triggerRequestCallbacks("onError", error);
                    },

                    _triggerRequestCallbacks : function (fn, obj) {
                        for (var i = 0; i < _inFlightRequests[url].length; i++) {
                            var callbackToRun = _inFlightRequests[url][i][fn];
                            if (callbackToRun !== undefined) {
                                callbackToRun(obj);
                            }
                        }

                        // must clear the queue so it doesn't get run again
                        _inFlightRequests[url] = undefined;
                    }
                };
            };
        }

        return RequestManager;
    });