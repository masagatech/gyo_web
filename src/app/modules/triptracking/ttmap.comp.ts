import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonService } from '../../_services/common/common-service'; /* add reference for master of master */
import { TTMapService } from '../../_services/triptracking/ttmap-service';
import { MessageService, messageType } from '../../_services/messages/message-service';
import { LoginService } from '../../_services/login/login-service';
import { LoginUserModel } from '../../_model/user_model';
import { SocketService } from '../../_services/socket/socket-service';
import { SelectItem, GMap } from 'primeng/primeng';

declare var google: any;

@Component({
    templateUrl: 'ttmap.comp.html',
    providers: [TTMapService, CommonService, SocketService]
})

export class TripTrackingComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    selectedTripType: number = 0;
    triptype: SelectItem[];

    @ViewChild("gmap")
    _gmap: GMap;

    map: any;
    marker: any;
    overlays: any = [];
    coordDT: any = [];
    driverDT: any = [];

    coordid: number = 0;
    coordname: string = "";
    driverid: number = 0;

    tripDT: any = [];
    messageDT: any = [];
    psngrDT: any = [];

    isPlay: boolean = true;

    options: any = [];

    sel_tripid: number = 0;
    sel_msttripid: number = 0;

    connectmsg: string = "";
    lastlat: string = "";
    lastlon: string = "";

    constructor(public _ttmapservice: TTMapService, private _msg: MessageService, private _autoservice: CommonService,
        private _loginservice: LoginService, private _socketservice: SocketService) {
        this.loginUser = this._loginservice.getUser();
        this.getMessage();
        this.getTripType();
    }

    ngOnInit() {
        this._socketservice.close();

        this.marker = new google.maps.Marker({ position: { lat: 0, lng: 0 }, title: "" });
        this.map = this._gmap.getMap();
        this.getDefaultMap();

        // this.coordid = 2;
        // this.coordname = "Mahesh Tiwari";
        this.fillDriverDropDown();
        // this.driverid = 1;

        // this.getTripData();
    }

    getDefaultMap() {
        var tripdata = {
            "status": 200,
            "data": [
                {
                    "_id": "59077358b9d3a72be4594dfd",

                    "bearing": -1.302723,
                    "loctm": "2017-05-01T17:41:25.498Z",
                    "loc": [
                        19.2500675,
                        73.1426076
                    ],
                    "sertm": "2017-05-01T17:41:44.738Z",
                    "__v": 0
                }
            ]
        }

        var geoloc = tripdata.data[0].loc;

        this.options = {
            center: { lat: geoloc[0], lng: geoloc[1] },
            zoom: 17
        };
    }

    getTripType() {
        this.triptype = [];
        this.triptype.push({ "label": "Pending", "value": "0" });
        this.triptype.push({ "label": "Started", "value": "1" });
        this.triptype.push({ "label": "Completed", "value": "2" });
    }

    // Auto Completed Co-ordinator / Attendent

    getCoordinatorData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "owner",
            "uid": this.loginUser.uid,
            "typ": this.loginUser.utype,
            "otype": "coord",
            "search": query
        }).then(data => {
            this.coordDT = data;
        });
    }

    // Get Selected Auto Completed Data

    selectCoordinatorData(event) {
        this.coordid = event.value;
        this.coordname = event.label;
        this.fillDriverDropDown();
    }

    // Driver DropDown

    fillDriverDropDown() {
        var that = this;
        commonfun.loader();

        that._autoservice.getDropDownData({ "flag": "driver", "id": that.coordid }).subscribe((data) => {
            try {
                that.driverDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    // Show Passenger Data By Driver, Trip

    showPassengerList() {
        var that = this;
        commonfun.loader();

        this._ttmapservice.showPassengerList({ "driverid": that.driverid, "tripid": that.sel_tripid, "msttripid": that.sel_msttripid }).subscribe(data => {
            that.psngrDT = data.data;
            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide();
        }, () => {
            // console.log("Complete");
        });
    }

    // Get Today's Trip

    getTripData() {
        var that = this;
        commonfun.loader();

        this._ttmapservice.getTripData({ "driverid": that.driverid }).subscribe(data => {
            that.tripDT = data.data;
            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide();
        }, () => {
            // console.log("Complete");
        });
    }

    // Get Selected Trip ID for get Map Data

    getTTMap(row) {
        var that = this;

        that.sel_tripid = row.trpid;
        that.sel_msttripid = row.id;
    }

    // get Tracking Map Data

    getMessage() {
        var that = this;
        commonfun.loader();

        this._socketservice.getMessage().subscribe(data => {
            var _d = data;

            if (_d["evt"] == "regreq") {
                if (that.sel_tripid !== 0) {
                    that.connectmsg = "Registering...";
                    that._socketservice.sendMessage("register", that.sel_tripid.toString());
                }
            } else if (_d["evt"] == "registered") {
                that.connectmsg = "Registered...";
                setTimeout(function () {
                    that.connectmsg = "Waiting for data..";
                }, 1000);
            } else if (_d["evt"] == "data") {
                try {
                    var geoloc = _d["data"];

                    if (that.sel_tripid == geoloc.tripid) {
                        that.lastlat = geoloc.lat;
                        that.lastlon = geoloc.lon;

                        that.connectmsg = "Lat : " + that.lastlat + ", Lon : " + that.lastlon;
                        that.mapMove(geoloc.lat, geoloc.lon, geoloc.bearng);
                    }
                } catch (error) {

                }
            }
            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide();
        }, () => {
            // console.log("Complete");
        });
    }

    togglePlayPause() {
        this.isPlay = !this.isPlay;

        if (this.isPlay) {
            this.mapMove(this.lastlat, this.lastlon, 0);
        }
    }

    mapMove(lat: any, lon: any, bearng: any) {
        if (this.isPlay) {
            var latlng = new google.maps.LatLng(lat, lon);
            this.marker.setPosition(latlng);
            this._gmap.map.setCenter(latlng);
        }
        else {

        }
    }

    sendMessage() {
        this._socketservice.close();
        this.getLastLocation();
        this.connectmsg = "Connecting...";
        this._socketservice.connect();
    }

    getLastLocation() {
        var that = this;
        commonfun.loader();

        that._ttmapservice.getLastLocation({ "tripid": that.sel_tripid }).subscribe(data => {
            console.log(data.data);
            if (that.overlays.length == 0) {
                this.overlays.push(this.marker);
            }

            var geoloc = data.data[0].loc;
            var bearng = data.data[0].bearng;

            that.mapMove(geoloc[0], geoloc[1], bearng);
            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide();
        }, () => {
            // console.log("Complete");
        });
    }

    // Zoon In, Out, Clear and Reset

    zoomIn(map) {
        map.setZoom(map.getZoom() + 1);
    }

    zoomOut(map) {
        map.setZoom(map.getZoom() - 1);
    }

    clear() {
        // this.overlays = [];
    }

    ngOnDestroy() {
    }
}