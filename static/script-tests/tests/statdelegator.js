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
        "antie/statdelegator"
    ],
    function(StatDelegator) {

        var DONT_CARE_OBJ = {};
        var DONT_CARE = "";
        var DONT_CARE_URL = "http://endpoint.invalid/api";
        var PLAY_EVENT_CALL = "sendPlayEvent";
        var INVALID_EVENT_CALL = "invalidEvent";

        TestCase("StatDelegator", {
            setUp: function () {
                jstestdriver.plugins.async.CallbackPool.TIMEOUT = 2000;
                this.sandbox = sinon.sandbox.create();
                this._statDelegatorObject = new StatDelegator();
            },

            tearDown: function () {
                this.sandbox.restore();
            },
            testStatDelegatorModuleReturnsStatDelegatorObject : function() {
                assertTrue(this._statDelegatorObject instanceof StatDelegator);
            },
            testRegisterDelegateAddsDelegateObjectToInstanceArray : function() {
                this._statDelegatorObject.registerDelegate(DONT_CARE_OBJ);
                this._statDelegatorObject.registerDelegate(DONT_CARE_OBJ);
                assertEquals(this._statDelegatorObject._delegates.length, 2);
            },
            testDoesDelegateSupportFunctionReturnsTrueWhenFunctionIsSupported : function() {
                var delegate = {};
                delegate[PLAY_EVENT_CALL] = sinon.stub();

                var isSupported = this._statDelegatorObject._doesDelegateSupportFunction(delegate, PLAY_EVENT_CALL);
                assertTrue(isSupported);
            },
            testDoesDelegateSupportFunctionReturnsFalseWhenFunctionIsNotSupported : function() {
                var delegate = DONT_CARE_OBJ;

                var isSupported = this._statDelegatorObject._doesDelegateSupportFunction(delegate, PLAY_EVENT_CALL);
                assertFalse(isSupported);
            },
            testSendPlayEventCallsTheAppropriateDelegateMethods : function() {
                var implementedDelegate = {};
                implementedDelegate[PLAY_EVENT_CALL] = sinon.stub();

                var unimplementedDelegate = {};
                unimplementedDelegate[INVALID_EVENT_CALL] = sinon.stub();

                this._statDelegatorObject.registerDelegate(implementedDelegate);
                this._statDelegatorObject.registerDelegate(unimplementedDelegate);

                this._statDelegatorObject.sendPlayEvent(19);

                assertTrue("First delegate sendPlayEvent callback called", implementedDelegate[PLAY_EVENT_CALL].calledWith(19));
                assertFalse("Second delegate invalid event function not called", unimplementedDelegate[INVALID_EVENT_CALL].called);
            }
        })
    });
