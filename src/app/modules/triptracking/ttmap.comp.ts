import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService, SocketService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { TTMapService } from '@services/master';
import { LazyLoadEvent, DataTable } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SelectItem, GMap } from 'primeng/primeng';

declare var google: any;

@Component({
    templateUrl: 'ttmap.comp.html',
    providers: [CommonService, SocketService]
})

export class TripTrackingComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    selectedTripType: number = 0;
    triptype: SelectItem[];

    @ViewChild("gmap")
    _gmap: GMap;

    map: any;
    marker: any;
    overlays: any = [];

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    vehtypeDT: any = [];
    vehtypeid: number = 0;

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
        this._wsdetails = Globals.getWSDetails();

        this.getMessage();
        this.getTripType();
    }

    ngOnInit() {
        this._socketservice.close();

        let imagePath = 'assets/img/bus1.png#markerOne';

        let image = {
            url: imagePath,
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 0),
        };

        this.marker = new google.maps.Marker({
            position: {
                lat: 19.2500675
                , lng: 73.1426076
            }, title: "",
            strokeColor: 'red',
            strokeWeight: 3,
            scale: 6,
            icon: image,
            rotation: -20.21
        }
        );

        this.overlays = [this.marker];
        this.map = this._gmap.getMap();
        this.getDefaultMap();

        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $(".enttname input").focus();
        }, 100);
    }

    getDefaultMap() {
        var tripdata = {
            "status": 200,
            "data": [{
                "_id": "59077358b9d3a72be4594dfd",

                "bearing": -1.302723,
                "loctm": "2017-05-01T17:41:25.498Z",
                "loc": [
                    19.2500675,
                    73.1426076
                ],
                "sertm": "2017-05-01T17:41:44.738Z",
                "__v": 0
            }]
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

    // Auto Completed Entity

    getEntityData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "entity",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._wsdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.entityDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Entity

    selectEntityData(event) {
        this.enttid = event.value;
        this.enttname = event.label;

        Cookie.set("_enttid_", this.enttid.toString());
        Cookie.set("_enttnm_", this.enttname);

        if (Cookie.get('_enttnm_') != null) {
            this.enttid = parseInt(Cookie.get('_enttid_'));
            this.enttname = Cookie.get('_enttnm_');

            this.fillVehicleDropDown();
        }
    }

    // Vehicle DropDown

    fillVehicleDropDown() {
        var that = this;
        commonfun.loader();

        that._autoservice.getDropDownData({
            "flag": "vehicle", "enttid": that.enttid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin, "wsautoid": that._wsdetails.wsautoid
        }).subscribe((data) => {
            try {
                that.vehtypeDT = data.data;
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

    // Show Passenger Data By vehicle, Trip

    showPassengerList() {
        var that = this;
        commonfun.loader();

        this._ttmapservice.showPassengerList({ "vehtypeid": that.vehtypeid, "tripid": that.sel_tripid, "msttripid": that.sel_msttripid }).subscribe(data => {
            that.psngrDT = data.data;
            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide();
        }, () => {
        });
    }

    // Get Today's Trip

    getTripData() {
        var that = this;
        commonfun.loader();

        this._ttmapservice.getTripData({ "flag": "vh", "vehid": that.vehtypeid }).subscribe(data => {
            that.sel_tripid = 0;
            that.tripDT = data.data;
            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide();
        }, () => {
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
            }
            else if (_d["evt"] == "registered") {
                that.connectmsg = "Registered...";
                setTimeout(function () {
                    that.connectmsg = "Waiting for data..";
                }, 1000);
            }
            else if (_d["evt"] == "data") {
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

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}