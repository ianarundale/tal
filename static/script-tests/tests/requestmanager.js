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

require(
    [
        "antie/requestmanager",
        "antie/devices/device"
    ],
    function(RequestManager, Device) {

        var DONT_CARE_OBJ = {};
        var DONT_CARE = "";
        var DONT_CARE_URL = "http://endpoint.invalid/api";

        TestCase("RequestManager", {
            setUp: function () {
                jstestdriver.plugins.async.CallbackPool.TIMEOUT = 2000;
                this.sandbox = sinon.sandbox.create();
                this._stubDevice = sinon.createStubInstance(Device);

                this._requestManagerObject = new RequestManager();
            },

            tearDown: function () {
                this.sandbox.restore();
            },

            testRequestManagerModuleReturnsRequestManagerObject : function() {
                assertTrue(this._requestManagerObject instanceof RequestManager);
            },

            testIsRequestInFlightReturnsFalseWhenNoRequestHasBeenRegistered : function() {
                assertFalse(this._requestManagerObject.isRequestInFlight(DONT_CARE_URL));
            },

            testIsRequestInFlightReturnsTrueWhenRequestHasBeenRegistered : function() {
                this._requestManagerObject.registerRequest(DONT_CARE_URL, DONT_CARE_OBJ);
                assertTrue(this._requestManagerObject.isRequestInFlight(DONT_CARE_URL));
            },

            testGetQueuedRequestsCallbacksReturnsValidRequestCallbackObject : function() {
                this._requestManagerObject.registerRequest(DONT_CARE_URL, DONT_CARE_OBJ);
                var callbacks = this._requestManagerObject.getQueuedRequestsCallbacks(DONT_CARE_URL);

                assertNotUndefined("onSuccess callback is required", callbacks.onSuccess);
                assertNotUndefined("onError callback is required", callbacks.onError);
            },

            testTriggeringQueuedRequestsOnSuccessCallbacksRunsOnSuccessCallbacks : function() {
                var callbacks1 = this._getStubCallbacks();
                var callbacks2 = this._getStubCallbacks();

                this._requestManagerObject.registerRequest(DONT_CARE_URL, callbacks1);
                this._requestManagerObject.registerRequest(DONT_CARE_URL, callbacks2);

                var callbacks = this._requestManagerObject.getQueuedRequestsCallbacks(DONT_CARE_URL);
                callbacks._triggerRequestCallbacks("onSuccess", DONT_CARE_OBJ);

                assertTrue("First request onSuccess callback called ok", callbacks1.onSuccess.calledWith(DONT_CARE_OBJ));
                assertTrue("Second request onSuccess callback called ok", callbacks2.onSuccess.calledWith(DONT_CARE_OBJ));
            },

            testTriggeringQueuedRequestsOnSuccessCallbacksDoesNotRunOnErrorCallbacks : function() {
                var callbacks1 = this._getStubCallbacks();
                var callbacks2 = this._getStubCallbacks();

                this._requestManagerObject.registerRequest(DONT_CARE_URL, callbacks1);
                this._requestManagerObject.registerRequest(DONT_CARE_URL, callbacks2);

                var callbacks = this._requestManagerObject.getQueuedRequestsCallbacks(DONT_CARE_URL);
                callbacks._triggerRequestCallbacks("onSuccess", DONT_CARE_OBJ);

                assertFalse("First request onError callback not called", callbacks1.onError.called);
                assertFalse("Second request OnError callback not called", callbacks2.onError.called);
            },

            testTriggeringQueuedRequestsClearsTheCallbacksFromTheInFlightRequestsQueue : function() {
                this._requestManagerObject.registerRequest(DONT_CARE_URL, DONT_CARE_OBJ);
                this._requestManagerObject.registerRequest(DONT_CARE_URL, DONT_CARE_OBJ);

                var callbacks = this._requestManagerObject.getQueuedRequestsCallbacks(DONT_CARE_URL);
                callbacks._triggerRequestCallbacks("onSuccess", DONT_CARE_OBJ);

                assertFalse(this._requestManagerObject.isRequestInFlight(DONT_CARE_URL));
            },

            _getStubCallbacks : function () {
                return {
                    onSuccess : sinon.stub(),
                    onError : sinon.stub()
                };
            }

        })
    });
