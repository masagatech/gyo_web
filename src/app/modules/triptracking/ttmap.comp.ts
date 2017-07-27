import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService, SocketService, TrackDashbord } from '@services';
import { LoginUserModel, Globals } from '@models';
import { TTMapService } from '@services/master';
import { LazyLoadEvent, DataTable } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SelectItem, GMap } from 'primeng/primeng';
declare var google: any;

@Component({
    templateUrl: 'ttmap.comp.html',
    providers: [CommonService, SocketService, TrackDashbord]
})

export class TripTrackingComponent implements OnInit, OnDestroy, AfterViewInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

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
    vehtypeIds: any = [];
    vehtypeid: number = 0;
    selectedVeh: any = [];

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

    vhmarkers: any = [];

    dbcaller: any = [];

    constructor(public _ttmapservice: TTMapService, private _msg: MessageService, private _autoservice: CommonService,
        private _loginservice: LoginService, private _socketservice: SocketService, private _trackDashbord: TrackDashbord) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();
        this.getMessage();


        //this.getTripType();
    }

    ngOnInit() {
        this._socketservice.close();

        // let imagePath = 'assets/img/bus1.png#markerOne';

        // let image = {
        //     url: imagePath,
        //     origin: new google.maps.Point(0, 0),
        //     anchor: new google.maps.Point(20, 0),
        // };

        // this.marker = new google.maps.Marker({
        //     position: {
        //         lat: 19.2500675
        //         , lng: 73.1426076
        //     }, title: "",
        //     strokeColor: 'red',
        //     strokeWeight: 3,
        //     scale: 6,
        //     icon: image,
        //     rotation: -20.21
        // }
        // );

        // this.overlays = [this.marker];
        this.getDefaultMap();

        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $(".enttname input").focus();
            $('.container-fluid').css('padding-left', '0px').css('padding-right', '0px');
        }, 100);

        this.enttid = this._enttdetails.enttid;
        this.enttname = this._enttdetails.enttname;
        this.fillVehicleDropDown();
    }

    public ngAfterViewInit() {
        this.map = this._gmap.getMap();
        SlidingMarker.initializeGlobally();
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

        // Cookie.set("_enttid_", this.enttid.toString());
        // Cookie.set("_enttnm_", this.enttname);

        // if (Cookie.get('_enttnm_') != null) {


        this.fillVehicleDropDown();
        //}
    }



    // Vehicle DropDown

    fillVehicleDropDown() {
        var that = this;
        commonfun.loader();
        this.vehtypeDT = [];
        this.vehtypeIds = [];
        that._autoservice.getDropDownData({
            "flag": "vehicle",
            "enttid": that.enttid,
            "uid": that.loginUser.uid,
            "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin,
            "wsautoid": that._wsdetails.wsautoid
        }).subscribe((data) => {
            try {
                that.vehtypeDT = data.data;
                for (var k = 0; k < that.vehtypeDT.length - 1; k++) {
                    var el = that.vehtypeDT[k];
                    that.vehtypeIds.push(el.key);
                    //    that.carmarkers.push(new google.);
                }
                that.getLastUpdateAndSubscribe(null);
                that.setLiveBeatsOn();
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
        that.connectmsg = "Registering...";
        this._socketservice.getMessage().subscribe(data => {
            var _d = data;

            if (_d["evt"] == "regreq") {
                // if (that.sel_tripid !== 0) {
                //     that.connectmsg = "Registering...";
                //     that._socketservice.sendMessage("register", that.sel_tripid.toString());
                // }
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
                    let el = that.vehtypeDT.find(a => a.key === parseInt(geoloc.vhid));
                    if (el !== undefined) {
                        el.tripid = geoloc.tripid;
                        el.speed = geoloc.speed;
                        el.bearing = geoloc.bearing;
                        el.btr = geoloc.btr;
                        el.loc = [geoloc.lon, geoloc.lat];
                        el.sertm = geoloc.sertm;
                        el.isshow = true;
                        el.ju = true;
                    }
                    this.moveMarker([geoloc.lat, geoloc.lon], geoloc.vhid, geoloc.bearing);
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
    // private get timeinterval
    private setLiveBeatsOn() {
        if (this.vehtypeIds.length > 0) {
            let that = this;
            this.dbcaller = setInterval(
                function () {
                    that.logicLiveBeat();
                }, 30000);
            that._socketservice.close();
            setTimeout(function () {
                that._socketservice.connect();
                that._socketservice.sendMessage("reg_v", that.vehtypeIds.join(','));
            }, 1000);

        }
    }

    private logicLiveBeat() {
        let _data = [];
        // console.log(this.vehtypeDT);
        for (var i = 0; i < this.vehtypeDT.length; i++) {
            var _el = this.vehtypeDT[i];
            //console.log(_el);
            if (_el.isshow == true) {
                let now = new Date();
                let seconds = Math.round(Math.abs((now.getTime() - new Date(_el.sertm).getTime()) / 1000));
                let minutes = Math.round(Math.abs(seconds / 60))
                //console.log(minutes);
                if (minutes > 2 || _el.ju == false) {
                    _el.ju = false;
                    _data.push(_el.key);
                }
            } else {
                _data.push(_el.key);
            }
        }
        this.getLastUpdateAndSubscribe(_data);
    }

    // get vehicle last data and subscribe for socket{}
    private getLastUpdateAndSubscribe(data) {
        if (data !== null && data.length === 0) return;
        this._trackDashbord.getvahicleupdates({
            "vhids": data == null ? this.vehtypeIds : data
        }).subscribe(_d => {
            this.refreshdata(_d.data);
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide();
        }, () => {
        })

    }

    private refreshdata(data) {
        for (let i = 0; i < this.vehtypeDT.length - 1; i++) {
            let el = this.vehtypeDT[i];
            let d = data.find(f => f.vhid == el.key);
            if (d !== undefined) {
                el.tripid = d.tripid;
                el.speed = d.speed;
                el.bearing = d.bearing;
                el.btr = d.btr;
                el.loc = d.loc;
                el.sertm = d.sertm;
                el.isshow = true;
                el.ju = false;
                console.log(el.loc);
                this.moveMarker([el.loc[1], el.loc[0]], el.key, el.bearing);
            } else if (el.ju) {
                // just updated from socket
            } else {
                el.isshow = false;
            }
        }
    }

    //move marker
    private moveMarker(loc, vhid, bearing) {
        let mrk = this.vhmarkers[vhid];

        if (mrk !== undefined) {
            let bear = commonfun.getbearing(bearing);
            mrk.setIcon({ url: 'assets/img/map/greencar_' + bear + '.png' })
            mrk.setPosition(new google.maps.LatLng(loc[0], loc[1]));
        }
    }

    //select for map show
    private onchange(e, vh) {
        if (vh.isshow == false) { this._msg.Show(messageType.warn, "Hey", "No Updates found");  e.target.checked = false; return; }
        if (e.target.checked) {
            this.selectedVeh.push(vh.key);
            this.addmarker(vh);
            this.map.setCenter(new google.maps.LatLng(vh.loc[1], vh.loc[0]))
            console.log(vh);
        } else {
            let i = this.selectedVeh.indexOf(vh.key);
            if (i > -1)
                this.selectedVeh.splice(i, 1);
            this.removemarker(vh.key);
        }
        // this.selectedVeh.push(vh);
        e.preventDefault();
    }

    private clickVehicle(vh) {
        if (vh.isshow == false) {return; }
        this.map.setCenter(new google.maps.LatLng(vh.loc[1], vh.loc[0]));
    }

    private addmarker(vh) {
        let imagePath = 'assets/img/map/greencar_0.png';
        let image = {
            url: imagePath,
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(20, 0),
        };

        let vhmarker = new google.maps.Marker({
            position: {
                lat: vh.loc[1]
                , lng: vh.loc[0]
            }, title: "",
            strokeColor: 'red',
            strokeWeight: 3,
            scale: 6,
            icon: image,
            rotation: -20.21,
            draggable: true

        }
        );

        vhmarker.setMap(this.map);
        this.vhmarkers[vh.key] = vhmarker;
        console.log(vhmarker);
    }

    private removemarker(vhid) {
        let mrkr = this.vhmarkers[vhid];
        console.log(mrkr);
        if (mrkr != null) {
            mrkr.setMap(null);
            delete this.vhmarkers[vhid];
        }
    }


    clear() {
        // this.overlays = [];
    }

    //ui changer
    private closesidepanel() {
        if ($("#sidepanel").hasClass('col-md-3')) {
            $("#sidepanel").removeClass('col-md-3').addClass('hide');
            $("#map").removeClass('col-md-9').addClass('col-md-12');
            $("#closeicon").text('keyboard_arrow_right');
        } else {
            $("#sidepanel").addClass('col-md-3').removeClass('hide');
            $("#map").removeClass('col-md-12').addClass('col-md-9');
            $("#closeicon").text('keyboard_arrow_left');
        }
        if (this.map !== undefined) {
            google.maps.event.trigger(this.map, 'resize');
        }
    }

    public ngOnDestroy() {
        if (this.dbcaller !== undefined) {
            clearInterval(this.dbcaller);
        }
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
        $('.container-fluid').css('padding-left', '5px').css('padding-right', '5px');
    }



}
