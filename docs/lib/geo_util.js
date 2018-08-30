"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 * GeoUtil
 *
 * This class contains a bunch of static methods for working with lat/lng coordinates
 *
 * These were copy and pasted out of a very old project but were probably originally ported from google.
 * https://github.com/googlemaps/android-maps-utils/tree/master/library/src/com/google/maps/android
 *
 */

/*
 * Copyright 2013 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var GeoUtil = function () {
    function GeoUtil() {
        _classCallCheck(this, GeoUtil);
    }

    _createClass(GeoUtil, null, [{
        key: "toRad",
        value: function toRad(degrees) {
            return degrees * Math.PI / 180;
        }
    }, {
        key: "toDeg",
        value: function toDeg(radians) {
            return radians * 180 / Math.PI;
        }
    }, {
        key: "mercProject",
        value: function mercProject(lat, lon) {
            var sizeX = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
            var sizeY = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
            var xy = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

            var sinLatitude = Math.sin(lat * Math.PI / 180);
            var screenPnt = [];
            screenPnt[0] = (lon + 180) / 360 * sizeX;
            screenPnt[1] = (0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI)) * sizeY;

            if (xy) {
                return { x: screenPnt[0], y: screenPnt[1] };
            } else {
                return screenPnt;
            }
        }
    }, {
        key: "invMercProject",
        value: function invMercProject(ptx, pty) {
            var sizeX = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
            var sizeY = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

            var x = ptx / sizeX;
            var y = pty / sizeY;
            x = x - .5;
            y = .5 - y;
            var lat = 90 - 360 * Math.atan(Math.exp(-y * 2 * Math.PI)) / Math.PI;
            var lon = 360 * x;
            return [lat, lon];
        }
    }, {
        key: "r",
        value: function r() {
            return 6371; // Radius of the earth in km
        }
    }, {
        key: "distance",
        value: function distance(lat0, lon0, lat1, lon1) {
            var dLat = GeoUtil.toRad(lat1 - lat0); // Javascript functions in radians
            var dLon = GeoUtil.toRad(lon1 - lon0);
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(GeoUtil.toRad(lat0)) * Math.cos(GeoUtil.toRad(lat1)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return GeoUtil.r() * c; // Distance in km
        }
    }, {
        key: "bearing",
        value: function bearing(lat0, lon0, lat1, lon1) {
            //let dLat = dnc.Geom.toRad(lat1-lat0);  // Javascript functions in radians
            var dLon = GeoUtil.toRad(lon1 - lon0);

            var y = Math.sin(dLon) * Math.cos(lat1);
            var x = Math.cos(lat0) * Math.sin(lat1) - Math.sin(lat0) * Math.cos(lat1) * Math.cos(dLon);
            return Math.atan2(y, x).toDeg();
        }
    }]);

    return GeoUtil;
}();