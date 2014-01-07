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
        "anite/requestmanager",
        "antie/devices/device",
        'antie/lib/sha1'
    ],
    function(RequestManager, Device, Sha1) {

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
            }


        })
    });
