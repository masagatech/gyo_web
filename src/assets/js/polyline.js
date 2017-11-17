'use strict';

/**
* Methods for encoding and decoding time aware polylines
*
* @module polyline
*/

var polyline = {};


var EARTH_RADIUS = 6371;


/**
* Encodes a time aware polyline
*/
polyline.encodeTimeAwarePolyline = function (points) {
    return extendTimeAwarePolyline("", points, null);
}

/**
* Decodes a time aware polyline
*/
polyline.decodeTimeAwarePolyline = function (polyline) {
    // Method to decode a time aware polyline and return gpx logs
    var gpxLogs = [];
    var index = 0;
    var lat = 0;
    var lng = 0;
    var timeStamp = 0;
    var polylineLine = polyline.length;

    while (index < polylineLine) {
        // Decoding dimensions one by one
        var latResult = getDecodedDimensionFromPolyline(polyline, index);
        index = latResult[0];
        var lngResult = getDecodedDimensionFromPolyline(polyline, index);
        index = lngResult[0];
        var timeResult = getDecodedDimensionFromPolyline(polyline, index);
        index = timeResult[0];

        // Resultant variables
        lat += latResult[1];
        lng += lngResult[1];
        timeStamp += timeResult[1];
        gpxLogs.push(getGpxLog(lat, lng, timeStamp));
    }

    return gpxLogs;
}

/**
* Get locations for a list of timestamps from a decoded polyline
*/
polyline.getLocationsAtTimestamps = function (decodedTimeAwarePolyline, timeStamps) {
    var index = 0, locations = [];

    for (index = 0; index < timeStamps.length; index++) {
        var locationsAndBearing = getLocationsTillTimeStamp(decodedTimeAwarePolyline, timeStamps[index]);
        var locationsFound = locationsAndBearing.locations;

        if (locationsFound.length > 0) {
            locations.push(locationsFound[locationsFound.length - 1]);
        } else {
            locations.push([]);
        }
    }

    return locations;
}

/**
* Decodes a time aware polyline to get locations traveled till a timestamp
* to build a live polyline
*/
polyline.getLocationsElapsedByTimestamp = function (decodedTimeAwarePolyline, timeStamp) {
    var locationsAndBearing = getLocationsTillTimeStamp(decodedTimeAwarePolyline, timeStamp);
    return { 'path': locationsAndBearing.locations, 'bearing': locationsAndBearing.bearing };
}

/**
* Cut a decoded time aware polyline into segments
*/
polyline.getPolylineSegments = function (decodedTimeAwarePolyline) {
    debugger
    var lastTimeStamp = decodedTimeAwarePolyline[decodedTimeAwarePolyline.length - 1][2]
    var polylineSegments = getPolylineSegments(decodedTimeAwarePolyline, lastTimeStamp);
    var result = [];

    for (var i = 0; i < polylineSegments.length; i++) {
        result.push({ 'path': removeTimeStamps(polylineSegments[i].segment), 'style': polylineSegments[i].style });
    }

    return result;
}

/**
* Decode a polyline into segments of contiguous location data, which are solid,
* and gaps, which are dotted.
*/
polyline.getPolylineSegmentsForLocationsElapsed = function (decodedTimeAwarePolyline, timeStamp) {
    var polylineSegments = getPolylineSegments(decodedTimeAwarePolyline, timeStamp);
    var result = [];

    for (var i = 0; i < polylineSegments.length; i++) {
        var elapsed = polyline.getLocationsElapsedByTimestamp(polylineSegments[i].segment, timeStamp);

        if (elapsed.path.length > 0) {
            result.push({
                'path': elapsed.path, 'bearing': elapsed.bearing, 'style': polylineSegments[i].style
            });
        }
    }

    return result;
}


// Helper methods

function extendTimeAwarePolyline(polyline, points, lastPoint, format) {
    var lastLat = 0, lastLng = 0, lastTimeStamp = 0;

    if (polyline == null) {
        polyline = '';
    }

    if (lastPoint != null) {
        lastLat = getLat(lastPoint);
        lastLng = getLng(lastPoint);
        lastTimeStamp = getTimeStamp(lastPoint);
    }

    // if (points.length < 1) {
    //     return polyline
    // }

    for (var i = 0; i < points.length; i++) {
        var currentGpxLog = points[i];
        var lat = currentGpxLog.loc[1];//getLat(currentGpxLog);
        var lng = currentGpxLog.loc[0];//getLng(currentGpxLog);
        var timeStamp = currentGpxLog.sertm;//getTimeStamp(currentGpxLog);

        var diffArray = [lat - lastLat, lng - lastLng, timeStamp - lastTimeStamp];

        for (var j = 0; j < diffArray.length; j++) {
            var currentDiff = diffArray[j];
            currentDiff = (currentDiff < 0) ? notOperator(lshiftOperator(currentDiff, 1)) : lshiftOperator(currentDiff, 1);

            while (currentDiff >= 0x20) {
                polyline += String.fromCharCode((0x20 | (currentDiff & 0x1f)) + 63);
                currentDiff = rshiftOperator(currentDiff, 5);
            }

            polyline += String.fromCharCode(currentDiff + 63);
        }

        lastLat = lat, lastLng = lng, lastTimeStamp = timeStamp;
    }

    return polyline;
}

function getDecodedDimensionFromPolyline(polyline, index) {
    // Method to decode one dimension of the polyline
    var result = 1;
    var shift = 0;

    while (true) {
        var polylineChar = polyline[index];
        var b = polylineChar.charCodeAt(0) - 63 - 1;
        index++;
        result += lshiftOperator(b, shift);
        shift += 5;

        if (b < 0x1f) {
            break;
        }
    }

    if ((result % 2) !== 0) {
        return [index, rshiftOperator(notOperator(result), 1)];
    } else {
        return [index, rshiftOperator(result, 1)];
    }
}

function getLocationsTillTimeStamp(decodedPolyline, timeStamp) {
    var decoded = decodedPolyline;
    // decoded and timeStamps are both in order of times

    var index = 0;
    var currentPair = [];
    var locationsElapsed = [];
    var bearing = 0;

    if (decoded.length == 0) {
        return { 'locations': [], 'bearing': bearing };
    }

    // remove times before first time
    var timeStampToFind = timeStamp, startTime = decoded[0][2];

    while (timeStampToFind <= startTime) {
        return { 'locations': [[decoded[0][0], decoded[0][1]]], 'bearing': bearing };
    }

    for (index = 0; index < decoded.length; index++) {
        currentPair.push(decoded[index]);

        if (currentPair.length == 2) {
            var timeStampToFind = timeStamp;
            bearing = updateBearing(bearing, currentPair)

            var startTime = currentPair[0][2], endTime = currentPair[1][2];

            if (timeStampToFind > startTime && timeStampToFind <= endTime) {
                // location is in the current pair
                var midLocation = getLocationInPair(currentPair, timeStampToFind);
                locationsElapsed.push(midLocation);
                return { 'locations': locationsElapsed, 'bearing': bearing };

                // it is possible that the next timestamp is also in the
                // same pair, hence redo-ing same iteration
                currentPair.pop();
                index--;
            } else {
                currentPair.shift();
            }
        }

        locationsElapsed.push([currentPair[0][0], currentPair[0][1]]);
    }

    return { 'locations': locationsElapsed, 'bearing': bearing };
}

polyline.getDistance = function (origin, destination) {
    // return distance in meters
    var lon1 = toRadian(origin[1]),
        lat1 = toRadian(origin[0]),
        lon2 = toRadian(destination[1]),
        lat2 = toRadian(destination[0]);

    var deltaLat = lat2 - lat1;
    var deltaLon = lon2 - lon1;

    var a = Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    return c * EARTH_RADIUS * 1000;
}


function isDifferentSegment(end, start) {
    // function to determine whether a polyline
    // segment split should happen
    var distance = getDistance(start, end);
    return distance > 500;
}

function getPolylineSegments(decoded, timeLimit) {
    // this method breaks polyline till timeStamp when
    // consecutive time difference is greater than 10 minutes
    var segments = [], currentSegment = [];
    var index = 0;

    if (decoded.length == 0) {
        return [];
    }

    var start = decoded[0];

    for (index = 0; index < decoded.length; index++) {
        if (decoded[index][2] <= timeLimit) {

            if (isDifferentSegment(decoded[index], start) && currentSegment.length > 0) {
                // time difference is more than 10 mins, so flush
                segments.push({
                    'segment': currentSegment, 'style': 'solid'
                });

                var lastElement = currentSegment[currentSegment.length - 1];
                currentSegment = [lastElement, decoded[index]];

                segments.push({
                    'segment': currentSegment, 'style': 'dotted'
                });

                currentSegment = [decoded[index]];
            } else {
                currentSegment.push(decoded[index]);
            }

            start = decoded[index];
        } else {
            // add one more location so that the locations elapsed
            // method can find an interpolated midpoint
            if (!isDifferentSegment(decoded[index], start)) {
                currentSegment.push(decoded[index]);
            }
            break;
        }
    }

    segments.push({
        'segment': currentSegment, 'style': 'solid'
    });
    return segments;
}

function updateBearing(oldBearing, gpxPair) {
    var start = [gpxPair[0][0], gpxPair[0][1]];
    var end = [gpxPair[1][0], gpxPair[1][1]];
    var newBearing = computeHeading(start, end);

    if (newBearing != 0) {
        return Math.round(newBearing * 100) / 100.0;
    } else {
        return oldBearing;
    }
}

function getLocationInPair(gpxPair, timeStamp) {
    // timeStamp lies between the timeStamps in the gpx logs
    var startLat = gpxPair[0][0],
        startLng = gpxPair[0][1],
        endLat = gpxPair[1][0],
        endLng = gpxPair[1][1],
        startTime = new Date(gpxPair[0][2]),
        endTime = new Date(gpxPair[1][2]),
        currentTime = new Date(timeStamp);
    var ratio = (startTime - currentTime) / (startTime - endTime);
    return [startLat * (1 - ratio) + endLat * ratio, startLng * (1 - ratio) + endLng * ratio];
}

function getNextLatLng(decoded, timeStamp) {
    var polylineLength = decoded.length;

    if (polylineLength > 0) {
        for (var index = 0; index < polylineLength - 1; index++) {
            var currentTimeStamp = decoded[index][2];

            if (timeStamp < currentTimeStamp) {
                return [decoded[index][0], decoded[index][1]];
            }
        }

        return [decoded[polylineLength - 1][0], decoded[polylineLength - 1][1]];
    }
}

function getDistance(origin, destination) {
    // return distance in meters
    var lon1 = toRadian(origin[1]),
        lat1 = toRadian(origin[0]),
        lon2 = toRadian(destination[1]),
        lat2 = toRadian(destination[0]);

    var deltaLat = lat2 - lat1;
    var deltaLon = lon2 - lon1;

    var a = Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    return c * EARTH_RADIUS * 1000;
}

function toRadian(degree) {
    return degree * Math.PI / 180;
}

function computeHeading(start, end) {
    var lat1 = toRadian(start[0]);
    var lat2 = toRadian(end[0]);
    var lng1 = toRadian(start[1]);
    var lng2 = toRadian(end[1]);
    return Math.atan2(Math.sin(lng2 - lng1) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1)) * 180 / Math.PI;
}

function areEqualLatlngs(latlngA, latlngB) {
    return (latlngA[0] == latlngB[0]) && (latlngA[1] == latlngB[1]);
}

function removeTimeStamps(segment) {
    var result = [];
    for (var i = 0; i < segment.length; i++) {
        result.push([segment[i][0], segment[i][1]]);
    }
    return result;
}

// Methods to convert types

function getCoordinate(intRepresentation) {
    var coordinate = intRepresentation * 0.00001;
    return +coordinate.toFixed(5);
}

function getIsoTime(timeStamp) {
    // timeStamp is in seconds
    return new Date(timeStamp * 1000).toISOString();
}

function getGpxLog(lat, lng, timeStamp) {
    return [
        getCoordinate(lat), getCoordinate(lng), getIsoTime(timeStamp)
    ];
}

function getLat(gpxLog) {
    return Math.round(gpxLog[0] * 100000);
}

function getLng(gpxLog) {
    return Math.round(gpxLog[1] * 100000);
}

function getTimeStamp(gpxLog) {
    return +new Date(gpxLog[2]) / 1000;

}

// Override bit wise operators to circumvent 64 bit int issue

function lshiftOperator(num, bits) {
    // Custom left shift for 64 bit integers
    return num * Math.pow(2, bits);
}

function rshiftOperator(num, bits) {
    // Custom right shift for 64 bit integers
    return Math.floor(num / Math.pow(2, bits));
}

function notOperator(num) {
    // Custom not operator for 64 bit integers
    return ~num;
}

