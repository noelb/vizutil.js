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
class GeoUtil {


    static toRad(degrees) { return (degrees * Math.PI / 180); }


    static toDeg(radians) { return (radians * 180 / Math.PI); }


    static mercProject(lat, lon, sizeX=1, sizeY=1, xy=false) {
        let sinLatitude = Math.sin(lat * Math.PI/180);
        let screenPnt =[];
        screenPnt[0] = ((lon + 180) / 360) * sizeX;
        screenPnt[1] = ((0.5 - Math.log((1+sinLatitude)/(1-sinLatitude)) / (4*Math.PI) ) * sizeY);

        if (xy) {
            return {x:screenPnt[0],y:screenPnt[1]}
        } else {
            return screenPnt;
        }
    }


    static invMercProject(ptx, pty, sizeX=1, sizeY=1) {
        let x = ptx / sizeX;
        let y = pty / sizeY;
        x = x - .5;
        y = .5 - y;
        let lat = (90 - 360 * Math.atan(Math.exp(-y*2*Math.PI))/Math.PI);
        let lon = (360*x);
        return [lat,lon];
    }

    static r() {
        return 6371;// Radius of the earth in km
    }

    static distance(lat0,lon0,lat1,lon1) {
        let dLat = GeoUtil.toRad(lat1-lat0);  // Javascript functions in radians
        let dLon = GeoUtil.toRad(lon1-lon0);
        let a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(GeoUtil.toRad(lat0)) * Math.cos(GeoUtil.toRad(lat1)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return GeoUtil.r() * c; // Distance in km
    }

    static bearing(lat0,lon0,lat1,lon1) {
        //let dLat = dnc.Geom.toRad(lat1-lat0);  // Javascript functions in radians
        let dLon = GeoUtil.toRad(lon1-lon0);

        let y = Math.sin(dLon) * Math.cos(lat1);
        let x = Math.cos(lat0)*Math.sin(lat1) - Math.sin(lat0)*Math.cos(lat1)*Math.cos(dLon);
        return Math.atan2(y, x).toDeg();
    }

}


