
// tslint:disable:member-ordering
// tslint:disable:member-access
// tslint:disable:max-line-length
import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MessageService, messageType, TrackDashbord } from '@services';
import { Globals } from '@models';

declare var google: any;
declare var MarkerClusterer: any;
declare var polyline: any;

@Component({
    templateUrl: './history.comp.html',
    providers: [TrackDashbord],
    styleUrls: ['./style.css', '../../../../../assets/css/b1njTimeline.css']
})

export class HISTORYComponent implements OnInit, OnDestroy {
    @Input() data: any;

    global = new Globals();
    tripDT: any = [];
    map: any;
    dateFromValue: any;
    dateToValue: any = new Date();
    val: any = 0;
    maxrange: number = 0;
    marker: any;
    index = 0;
    poly: any;
    HistoryMarker: any = {};
    PassengersMarker: any = [];

    slideValCt = 0;
    tripLength = 0;
    isplay = false;
    servertimer: any = '---No Data---';
    btr: any = 0;
    timer: any;

    speedD: any = {
        '1': 500,
        '2': 450,
        '3': 400,
        '4': 350,
        '5': 300,
        '6': 250,
        '7': 200,
        '8': 160,
        '9': 140,
        '10': 100

    };
    speedval = 1;
    speed: any = this.speedD['1'];

    hasTripData: any = false;
    historyDt: any = [];
    isplayerShow: boolean = false;

    //pessangers

    psngrDT: any = [];
    markerCluster: any;

    options = {
        imagePath: './assets/img/cluster/m'
    };

    timeline: any = [];

    constructor(private _msg: MessageService, private _trackboard: TrackDashbord, private ref: ChangeDetectorRef) {

    }

    ngOnInit() {
        commonfun.loaderhide('#loaderbody');

        this.dateFromValue = new Date(moment().subtract(2, 'days').toString());
        this.map = this.data.map;
        this.markerCluster = new MarkerClusterer(this.map, [], this.options);

        this.marker = new SlidingMarker({
            position: {
                lat: 19.1312149, lng: 72.8624101
            },
            icon: {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                fillColor: '#FF0000',
                fillOpacity: 1.0,
                anchor: new google.maps.Point(0, 3),
                strokeWeight: 0,
                scale: 5,
                rotation: 0,
                zIndex: 99999999999999
            },
            duration: this.speed
        });

        // this.initPoly();
        //this.addStartStop();
    }

    // Get Today's Trip

    travel_polyoption = {
        strokeColor: '#beff00',
        strokeOpacity: 0.2,
        strokeWeight: 2,
        icons: []
    }

    nontravel_polyoption = {
        strokeColor: '#ff5050',
        strokeOpacity: 0.2,
        strokeWeight: 1,

        icons: [{
            icon: {

                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                fillColor: '#000000',
                fillOpacity: .6,
                anchor: new google.maps.Point(0, 3),
                strokeWeight: 2,
                scale: 3
            },

            offset: '100%',
            repeat: '200px'
        }, {
            icon: {
                path: 'M 0,-1 0,1',
                strokeOpacity: 0.3,
                scale: 3
            },

            offset: '0',
            repeat: '20px'
        }]
    }


    timelineTrack: any = []
    accTrack: any = [];
    accStopTrack: any = [];
    accMarkers: any = {};
    polylines: any = [];

    summary = {
        totaldistance: 0,
        totalDrive: '...',
        maxspeed: 0
    }

    resetHistory() {

        for (var i = 0; i < this.polylines.length; i++) {
            var xpoly = this.polylines[i];
            let path = xpoly.getPath();
            path.clear();
        }

        this.timelineTrack = []
        this.polylines = [];

        this.summary = {
            totaldistance: 0,
            totalDrive: '...',
            maxspeed: 0
        }

        this.setPlayerData(-1, null);
        this.clearAcc();
    }

    private getTripDelta(tripid) {
        this.resetHistory();
        var that = this;
        this.slideValCt = 0;
        this.selectedPoly = 0;
        commonfun.loader('#loaderbody', 'timer', 'Loading History...');

        this._trackboard.gettrackboardHistoryPost_trk({ 'vhid': this.data.imei, 'frmdt': moment(this.dateToValue).format('YYYY-MM-DDT00:00:00+05:30'), 'format': 'tap' }).subscribe(_data => {
            var _maindata = _data.data;

            this.timelineTrack = _maindata.segment;
            this.accTrack = _maindata.acc_segment;
            this.bindAccSegment();
            if (this.timelineTrack === null || this.timelineTrack.length === 0) {
                that._msg.Show(messageType.info, 'No data', 'Sorry, We unable to find data for this trip.');
                commonfun.loaderhide('#loaderbody');
                return;
            }

            var bounds = new google.maps.LatLngBounds();
            var times = [];

            for (var k = 0; k < this.timelineTrack.length; k++) {
                var el = this.timelineTrack[k];
                var poly;

                if (el.trktyp === 'solid') {
                    poly = new google.maps.Polyline(this.travel_polyoption);
                    times.push(el.dur);
                }
                else {
                    poly = new google.maps.Polyline(this.nontravel_polyoption);
                }

                poly.setMap(that.map);

                var path = poly.getPath();
                var points = google.maps.geometry.encoding.decodePath(el.encdpoly);

                for (var p = 0; p < points.length; p++) {
                    var po = points[p];
                    path.push(po)
                    bounds.extend(po);
                }

                this.summary.totalDrive = this.totalTimeString(times);
                this.polylines.push(poly);
            }
            // this.setPlayerData(this.selectedPoly);

            this.summary.totaldistance = _maindata.total_distance;
            this.summary.maxspeed = _maindata.mx_spd;

            this.map.fitBounds(bounds);
            commonfun.loaderhide('#loaderbody');
        }, err => {
            that._msg.Show(messageType.error, 'Error', err);
            commonfun.loaderhide('#loaderbody');
        }, () => {
        });
    }

    selectedPoly = 0;

    selectedSegmentData = {
        time: '',
        kilmeter: 0,
    };

    private setPlayerData(index: any, row: any) {
        if (this.isplay) {
            this.playPause();
        }

        this.marker.setMap(null);
        this.val = 0;
        this.slideValCt = 0;
        this.selectedSegmentData.time = '';
        this.selectedSegmentData.kilmeter = 0;
        this.maxrange = 0;
        this.tripDT = [];
        
        if (index === -1) {
        } else if (this.polylines.length > 0) {
            debugger
            this.tripDT = this.polylines[index].getPath().getArray();
            this.maxrange = this.tripDT.length;
            this.selectedSegmentData.time = row.sttm;
            this.selectedSegmentData.kilmeter = row.dist;
        }
        // this.ref.detectChanges()
    }

    bindAccSegment() {
        this.clearAcc();
        let newindex = 0;
        let MarkersArr = []
        for (let index = 0; index < this.accTrack.length; index++) {
            const element = this.accTrack[index];
            if (element.segtyp === 'stop') {
                newindex += 1;
                let latlon = new google.maps.LatLng(element.loc[1], element.loc[0]);

                let marker = new google.maps.Marker({
                    position: latlon,
                    icon: 'http://maps.google.com/mapfiles/kml/pal2/icon13.png'
                });

                marker.info = new google.maps.InfoWindow({
                    content: newindex + ''
                });

                //marker.info.open(this.map, marker)
                this.accMarkers[newindex + ''] = marker;
                MarkersArr.push(marker);

            }
            element.mrkid = newindex + '';
            this.accStopTrack.push(element);
        }
        this.markerCluster.addMarkers(MarkersArr);

    }
    selectedStopMarker = null

    onStopClick(row, index) {
        if (this.selectedStopMarker) {
            this.selectedStopMarker.setAnimation(null);
            this.selectedStopMarker.info.close()
        }
        this.selectedStopMarker = this.accMarkers[row.mrkid];
        this.selectedStopMarker.setAnimation(google.maps.Animation.BOUNCE);
        this.map.setZoom(17);
        this.map.panTo(this.selectedStopMarker.position);
        this.selectedStopMarker.info.open(this.map, this.selectedStopMarker)

    }





    history_click(i, row) {
        if (this.selpol !== null) {
            this.selpol.setOptions({
                strokeOpacity: 0.3,
                strokeWeight: 2,
                icons: []
            });
        }
        if (this.lastSelectedSegment) {
            this.lastSelectedSegment.active = false;
        }

        this.lastSelectedSegment = this.timelineTrack[i]
        this.lastSelectedSegment.active = true;

        this.selpol = this.polylines[i];

        if (row.trktyp === 'solid') {

            // setting history
            this.setPlayerData(i, row);

        } else {
            this.setPlayerData(-1, null);
        }




        this.selpol.setOptions({
            strokeOpacity: 1,
            strokeWeight: 6,

            icons: [{
                icon: {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    fillColor: '#000000',
                    fillOpacity: .6,
                    anchor: new google.maps.Point(0, 3),
                    strokeWeight: 2,
                    scale: 3
                },
                offset: '100%',
                repeat: '100px'
            }]
        });

        this.zoomToObject(this.selpol)
    }

    private onsegover(i, row) {
        var pol = this.polylines[i];

        pol.setOptions({
            strokeOpacity: 1,
            strokeWeight: 6,

            icons: [{
                icon: {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    fillColor: '#000000',
                    fillOpacity: .6,
                    anchor: new google.maps.Point(0, 3),
                    strokeWeight: 2,
                    scale: 3
                },
                offset: '100%',
                repeat: '100px'
            }]
        });
    }

    private onsegleave(i, row) {
        var pol = this.polylines[i];

        pol.setOptions({
            strokeOpacity: 0.3,
            strokeWeight: 2,
            icons: []
        });
    }
    selpol = null;
    lastSelectedSegment = null;

    private onsegclick(i, row) {
        var pol = this.polylines[i]



        this.zoomToObject(pol)
    }

    private zoomToObject(obj) {
        var bounds = new google.maps.LatLngBounds();
        var points = obj.getPath().getArray();
        for (var n = 0; n < points.length; n++) {
            bounds.extend(points[n]);
        }
        this.map.fitBounds(bounds);
    }

    private getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';

        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }

        return color;
    }

    // assuming num will always be positive

    zeroPad(num) {
        var str = String(num);
        if (str.length < 2) {
            return '0' + str;
        }

        return str;
    }

    // assuming your time strings will always be (H*:)(m{0,2}:)s{0,2} and never negative

    totalTimeString(timeStrings): string {
        var totals = timeStrings.reduce(function (a, timeString) {
            var parts = timeString.split(':');
            var temp;

            if (parts.length > 0) {
                temp = Number(parts.pop()) + a.seconds;
                a.seconds = temp % 60;
                if (parts.length > 0) {
                    temp = (Number(parts.pop()) + a.minutes) + ((temp - a.seconds) / 60);
                    a.minutes = temp % 60;
                    a.hours = a.hours + ((temp - a.minutes) / 60);
                    if (parts.length > 0) {
                        a.hours += Number(parts.pop());
                    }
                }
            }

            return a;
        }, {
                hours: 0,
                minutes: 0,
                seconds: 0
            });
        return [
            this.zeroPad(totals.hours),
            this.zeroPad(totals.minutes),
            this.zeroPad(totals.seconds)
        ].join(':');
    }

    private getPassengers(tripid) {
        var that = this;

        commonfun.loader('#loaderbody', 'timer', 'Passengers...');

        this._trackboard.gettrackboard({
            'flag': 'tripdetails',
            'tripid': tripid,
            'uid': this.data.loginUser.uid,
            'utype': this.data.loginUser.utype,
            'issysadmin': this.data.loginUser.issysadmin,
            'wsautoid': this.data._enttdetails.wsautoid
        }).subscribe((data) => {
            try {
                that.psngrDT = data.data;
                that.drawPassengers();
            }
            catch (e) {
                that._msg.Show(messageType.error, 'Error', e);
            }
            commonfun.loaderhide('#loaderbody');
        }, err => {
            that._msg.Show(messageType.error, 'Error', err);
            commonfun.loaderhide('#loaderbody');
        }, () => {

        })
    }

    private clearAcc() {
        this.markerCluster.clearMarkers();
        this.accMarkers = {};
        this.accStopTrack = [];
    }

    private clearPassengers() {
        this.markerCluster.clearMarkers();
        this.PassengersMarker = [];
    }

    private drawPassengers() {
        this.clearPassengers();

        for (var index = 0; index < this.psngrDT.length; index++) {
            var el = this.psngrDT[index];

            if (el.pdloc) {
                let latlon = new google.maps.LatLng(el.pdloc.x, el.pdloc.y);

                let marker = new google.maps.Marker({
                    position: latlon,
                    icon: 'https://maps.google.com/mapfiles/kml/shapes/library_maps.png'
                });

                marker.info = new google.maps.InfoWindow({
                    content: el.stnm
                });

                marker.info.open(this.map, marker)
                this.PassengersMarker.push(marker);
            }

            this.markerCluster.addMarkers(this.PassengersMarker);
        }
    }

    private resetTrips() {
        let path = this.poly.getPath();
        path.clear();

        this.isplay = false;
        if (this.timer) clearTimeout(this.timer);
        this.marker.setMap(null);

        if (this.HistoryMarker['start']) this.HistoryMarker['start'].setMap(null);
        if (this.HistoryMarker['stop']) this.HistoryMarker['stop'].setMap(null);

        this.clearPassengers();
    }

    private startmoving() {
        let that = this;

        this.timer = setTimeout(function () {
            if (!that.isplay) return;
            that.slideValCt += 1;
            that.val = that.slideValCt;
            that.onSliderChnage_auto({ value: that.val });

        }, this.speed);
    }

    lastlat = 0.0
    lastlon = 0.0
    private movemarker(i, forwardrev, anim) {
        let _d = this.tripDT[i];
        let latlon = new google.maps.LatLng(_d.lat(), _d.lng());

        this.map.panTo(latlon);
        let ico = this.marker.getIcon();
        // ico.rotation = this.bearing360(_d.bearing);
        ico.rotation = this.bearing(this.lastlat, this.lastlon, _d.lat(), _d.lng());
        this.lastlat = _d.lat()
        this.lastlon = _d.lng();
        this.marker.setIcon(ico);

        if (anim === 'animate')
            this.marker.setPosition(latlon);
        else
            this.marker.setPositionNotAnimated(latlon);

        // this.servertimer = moment(_d.sertm).format('DD-MM-YYYY hh:mm:ss');
        // this.btr = _d.btr;

        if (this.maxrange - i === 0) { this.isplay = false; return; }

        this.startmoving();
    }

    private setStartEnd() {
        let start = this.HistoryMarker['start'];
        let stop = this.HistoryMarker['stop'];
        let startpos = 0;
        let stoptpos = 0;

        if (this.tripDT.length > 1) {
            startpos = new google.maps.LatLng(this.tripDT[this.tripDT.length - 1].loc[1], this.tripDT[this.tripDT.length - 1].loc[0])
        } else {
            startpos = new google.maps.LatLng(this.tripDT[0].loc[1], this.tripDT[0].loc[0])
        }

        stoptpos = new google.maps.LatLng(this.tripDT[0].loc[1], this.tripDT[0].loc[0]);

        start.setPositionNotAnimated(startpos)
        stop.setPositionNotAnimated(stoptpos)
        start.setMap(this.map);
        stop.setMap(this.map);
        start.setAnimation(google.maps.Animation.DROP);
        stop.setAnimation(google.maps.Animation.DROP);

        setTimeout(function () {
            stop.setAnimation(google.maps.Animation.BOUNCE)
        }, 1000);
    }

    private addStartStop() {
        let that = this;

        var start = {
            url: './assets/img/greenflag.png',
            // This marker is 20 pixels wide by 32 pixels high.
            size: new google.maps.Size(32, 32),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(0, 25)
        };
        var stop = {
            url: './assets/img/redflag.png',
            // This marker is 20 pixels wide by 32 pixels high.
            size: new google.maps.Size(32, 32),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(0, 25)
        };

        that.HistoryMarker['start'] = new SlidingMarker({
            position: {
                lat: 0.0
                , lng: 0.0
            },
            icon: start,
            animation: google.maps.Animation.DROP
        });

        that.HistoryMarker['stop'] = new SlidingMarker({
            position: {
                lat: 0.0
                , lng: 0.0
            },
            icon: stop,
            animation: google.maps.Animation.DROP
        });
    }

    private moveOnSlider(e, anim) {
        if (this.index === e) return;

        if (e > this.index) {
            this.movemarker(e, 'frd', anim);
        } else {
            this.movemarker(e, 'bck', anim);
        }

        this.index = e;
    }

    private initPoly() {
        var icon = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            fillColor: '#000000',
            fillOpacity: .6,
            anchor: new google.maps.Point(0, 3),
            strokeWeight: 2,
            scale: 3
        }
        var lineSymbol = {
            path: 'M 0,-1 0,1',
            strokeOpacity: 0.8,
            scale: 3
        };

        var iconsetngs = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
        };

        let polylineoptns = {
            strokeOpacity: 0,
            strokeWeight: 2,
            map: this.map,
            icons: [{
                icon: icon,
                offset: '100%',
                repeat: '200px'
            }, {
                icon: lineSymbol,
                offset: '0',
                repeat: '20px'
            }]
        };

        this.poly = new google.maps.Polyline(polylineoptns);
    }

    private onSliderChnage_auto(e) {
        this.moveOnSlider(e.value, 'animate');
    }

    private onSliderChnage(e) {
        this.slideValCt = e.value;
        this.moveOnSlider(e.value, 'noanimate');
    }

    private bearing360(bearing) {
        return bearing;
    }

    private mousedown() {
        this.isplay = false;
    }

    private drawPath(arr) {
        var path = this.poly.getPath();
        var bounds = new google.maps.LatLngBounds();
        var lastLat = [];

        for (var i = 0; i < arr.length; i++) {
            var el = arr[i];

            if (lastLat.length === 0) lastLat = [el[1], el[0]];
            console.log(el[0] + '  ' + el[1] + '  ' + el[2]);

            var d = polyline.getDistance(lastLat, [el[1], el[0]]);
            console.log(d);

            lastLat = [el[1], el[0]]
        }

        this.map.fitBounds(bounds);
    }

    private playPause() {
        this.marker.setMap(this.map);
        this.isplay = !this.isplay;


        if (this.maxrange === this.val) {
            this.val = 0;
            this.slideValCt = 0;
        }

        if (this.isplay) {
            this.startmoving();
        }
    }

    private onSpeedSliderChnage(e) {
        this.speed = this.speedD[e.value];
        this.marker.setDuration(this.speed - 10);
    }

    private searchData() {
        var that = this;

        commonfun.loader('#loaderbody');

        this._trackboard.gettrackboard({
            'flag': 'triphistory',
            'vehid': this.data.vhid,
            'uid': this.data.loginUser.uid,
            'utype': this.data.loginUser.utype,
            'issysadmin': this.data.loginUser.issysadmin,
            'wsautoid': this.data._enttdetails.wsautoid,
            'frmdt': this.dateFromValue,
            'todt': this.dateToValue
        }).subscribe((data) => {
            try {
                that.historyDt = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, 'Error', e);
            }
            commonfun.loaderhide('#loaderbody');
        }, err => {
            that._msg.Show(messageType.error, 'Error', err);
            commonfun.loaderhide('#loaderbody');
        }, () => {

        })
    }

    private showPlayer(row) {
        this.val = 0;
        this.resetTrips();
        this.getTripDelta(row.trpid);
    }

    private hidePlayer() {
        this.isplayerShow = false;
    }

    private clearAll() {
        this.resetHistory()
    }

    ngOnDestroy() {
        this.clearAll();
    }


    /**
        * Calculate the bearing between two positions as a value from 0-360
        *
        * @param lat1 - The latitude of the first position
        * @param lng1 - The longitude of the first position
        * @param lat2 - The latitude of the second position
        * @param lng2 - The longitude of the second position
        *
        * @return int - The bearing between 0 and 360
        */
    bearing(lat1, lng1, lat2, lng2) {
        var dLon = (lng2 - lng1);
        var y = Math.sin(dLon) * Math.cos(lat2);
        var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
        var brng = this._toDeg(Math.atan2(y, x));
        return 360 - ((brng + 360) % 360);
    }

    /**
      * Since not all browsers implement this we have our own utility that will
      * convert from degrees into radians
      *
      * @param deg - The degrees to be converted into radians
      * @return radians
      */
    _toRad(deg) {
        return deg * Math.PI / 180;
    }

    /**
     * Since not all browsers implement this we have our own utility that will
     * convert from radians into degrees
     *
     * @param rad - The radians to be converted into degrees
     * @return degrees
     */
    _toDeg(rad) {
        return rad * 180 / Math.PI;
    }

    // speed = 50; // km/h

    delay = 100;
    animateMarker(marker, coords, km_h) {
        var target = 0;
        var km_h = km_h || 50;
        // coords.push([startPos[0], startPos[1]]);

        function goToPoint() {
            var lat = marker.position.lat();
            var lng = marker.position.lng();
            var step = (km_h * 1000 * this.delay) / 3600000; // in meters

            var dest = new google.maps.LatLng(
                coords[target][0], coords[target][1]);

            var distance =
                google.maps.geometry.spherical.computeDistanceBetween(
                    dest, marker.position); // in meters

            var numStep = distance / step;
            var i = 0;
            var deltaLat = (coords[target][0] - lat) / numStep;
            var deltaLng = (coords[target][1] - lng) / numStep;

            function moveMarker() {
                lat += deltaLat;
                lng += deltaLng;
                i += step;

                if (i < distance) {
                    marker.setPosition(new google.maps.LatLng(lat, lng));
                    setTimeout(moveMarker, this.delay);
                }
                else {
                    marker.setPosition(dest);
                    target++;
                    if (target == coords.length) { target = 0; }

                    setTimeout(goToPoint, this.delay);
                }
            }
            moveMarker();
        }
        goToPoint();
    }


}


