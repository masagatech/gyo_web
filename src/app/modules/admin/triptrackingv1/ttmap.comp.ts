import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ComponentFactoryResolver } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService, SocketService, TrackDashbord } from '@services';
import { LoginUserModel, Globals } from '@models';
import { SelectItem, GMap } from 'primeng/primeng';
import { ADHOST } from '@directives';
import { HOSTComponent } from '@interface';

import { PSGComponent } from './passengers/psg.comp';
import { INFOComponent } from './info/info.comp';
import { HISTORYComponent } from './history/history.comp';

declare var google: any;

@Component({
    templateUrl: 'ttmap.comp.html',
    styleUrls: ['./style.css']
})

export class TripTrackingComponent implements OnInit, OnDestroy, AfterViewInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    @ViewChild(ADHOST)
    private _Host: ADHOST;

    selectedTripType: number = 0;
    triptype: SelectItem[];

    @ViewChild("gmap")
    _gmap: GMap;

    map: any;
    marker: any;
    overlays: any = [];

    entityDT: any = [];
    enttdata: any = [];
    enttid: number = 0;
    enttname: string = "";

    vehid: number = 0;
    vehtypeDT: any = [];
    vehtypeIds: any = [];
    vehtypeid: number = 0;
    selectedVeh: any = [];
    selectedSVh: any = {};
    selectedFlwVh: any = {};

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
    offlinetimeout = 5;

    sidebarTitle = "Title";
    trafficLayer: any = new google.maps.TrafficLayer();
    queryimei: string = "";

    markerOptions = {
        showinfo: false,
        hidelive: false,
        showtrafic: false
    }

    _counter: any = {
        all: 0,
        online: 0,
        offline: 0,
        ign: 0
    }

    olfilter: any = "all";
    _showempty: boolean = false;

    private subscribeParameters: any;

    constructor(private _router: Router, private _actrouter: ActivatedRoute, private _msg: MessageService, private _loginservice: LoginService, private _socketservice: SocketService,
        private _autoservice: CommonService, private _trackDashbord: TrackDashbord, private componentFactoryResolver: ComponentFactoryResolver) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getMessage();
    }

    private loadComponent(component, data) {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);

        let viewContainerRef = this._Host.viewContainerRef;
        viewContainerRef.clear();
        
        let componentRef = viewContainerRef.createComponent(componentFactory);
        (<HOSTComponent>componentRef.instance).data = data;
    }

    ngOnInit() {
        this._socketservice.close();
        this.getDefaultMap();

        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.closeonwindow = false;

            $('.container-fluid').css('padding-left', '0px').css('padding-right', '0px');
        }, 100);

        this.subscribeParameters = this._actrouter
            .queryParams
            .subscribe(params => {
                this.enttid = params['enttid'] || this._enttdetails.enttid;

                console.log(this._enttdetails);
                this.vehid = params['vehid'] || 0;

                this.queryimei = params['imei'] || '';

                this.fillVehicleDropDown();
            });
    }

    public ngAfterViewInit() {
        let that = this;

        that.map = that._gmap.getMap();
        SlidingMarker.initializeGlobally();

        if (that.map !== undefined) {
            setTimeout(function () {
                google.maps.event.trigger(that.map, 'resize');
            }, 1000)
        }
    }

    getDefaultMap() {
        this.options = {
            center: { lat: 22.861639, lng: 78.257621 },
            zoom: 5,
            styles: [{ "stylers": [{ "saturation": -100 }] }],
            maxZoom: 16
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
            "wsautoid": this._enttdetails.wsautoid,
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

        this.fillVehicleDropDown();
    }

    // Vehicle DropDown

    private fillVehicleDropDown() {
        var that = this;

        commonfun.loader();

        that.vehtypeDT = [];
        that.vehtypeIds = [];

        that._trackDashbord.gettrackboard({
            "flag": "vehicle_new",
            "enttid": that.enttid,
            "vehid": that.vehid,
            "uid": that.loginUser.uid,
            "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin,
            "wsautoid": that._enttdetails.wsautoid
        }).subscribe((data) => {
            try {
                that.vehtypeDT = data.data;

                for (var k = 0; k < that.vehtypeDT.length; k++) {
                    var el = that.vehtypeDT[k];

                    el.isfollow = false;
                    el.sel = false;
                    el.rng = 0;
                    el.acc = 0;
                    el.os = that.olfilter;

                    if (el.vhid !== null) {
                        that.vehtypeIds.push(el.vhid);
                    }
                }

                that.checkOnlineCount();
                that._counter.all = that.vehtypeDT.length;
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

    // Get Selected Trip ID for get Map Data

    getTTMap(row) {
        var that = this;

        that.sel_tripid = row.trpid;
        that.sel_msttripid = row.id;
    }

    // Get Tracking Map Data

    getMessage() {
        var that = this;
        commonfun.loader();
        
        that.connectmsg = "Registering...";

        this._socketservice.getMessage().subscribe(data => {
            var _d = data;

            if (_d["evt"] == "regreq") {
                if (that.vehtypeIds.length > 0) {
                    that._socketservice.sendMessage("reg_v", that.vehtypeIds.join(','));
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
                    let el = that.vehtypeDT.find(a => a.vhid === geoloc.vhid);

                    if (el !== undefined) {
                        el.tripid = geoloc.tripid;
                        if (isNaN(geoloc.speed)) el.speed = 0;
                        else el.speed = geoloc.speed;

                        if (isNaN(geoloc.bearing)) el.bearing = el.bearing;
                        else el.bearing = geoloc.bearing;

                        if (geoloc.actvt === "hrtbt") { el.btr = geoloc.btr };

                        if (geoloc.loc !== undefined) {
                            el.loc = geoloc.loc;
                        }

                        el.sertm = geoloc.sertm;
                        el.isshow = true;
                        el.min = 0;
                        el.flag = geoloc.flag;
                        el.ju = true;

                        // Battery Status
                        el.btrst = geoloc.btrst

                        // GSM Signal

                        if (geoloc.actvt === "hrtbt") {
                            el.rng = geoloc.gsmsig
                            el.acc = geoloc.acc
                        }
                    }
                    if (geoloc.loc !== undefined)
                        this.moveMarker([geoloc.loc[1], geoloc.loc[0]], geoloc.vhid, geoloc.bearing);
                }
                catch (error) {
                    console.log(error)
                }
            }
            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide();
        }, () => {
        });
    }

    // private get timeinterval

    private setLiveBeatsOn() {
        if (this.dbcaller !== undefined) {
            clearInterval(this.dbcaller);
        }

        if (this.vehtypeIds.length > 0) {
            let that = this;
            this.dbcaller = setInterval(
                function () {
                    that.logicLiveBeat();
                }, 60000);

            that._socketservice.close();
            that._socketservice.connect();
        }
    }

    private logicLiveBeat() {
        let _data = [];

        for (var i = 0; i < this.vehtypeDT.length; i++) {
            var _el = this.vehtypeDT[i];

            if (_el.isshow == true) {
                _el.min = this.getTimeDiff(_el.sertm);

                if (_el.min > 3 || _el.ju == false) {
                    _el.ju = false;
                    if (_el.vhid !== null)
                        _data.push(_el.vhid);
                }
            }
            else {
                _data.push(_el.vhid);
            }
        }

        this.getLastUpdateAndSubscribe(_data);
    }

    private getTimeDiff(sertm): any {
        let now = new Date();
        let seconds = Math.round(Math.abs((now.getTime() - new Date(sertm).getTime()) / 1000));
        let minutes = Math.round(Math.abs(seconds / 60))
        return minutes;
    }

    private getLastUpdateAndSubscribe(data) {
        if (data !== null && data.length === 0) return;

        this._trackDashbord.getvahicleupdates_trk({
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
        for (let i = 0; i < this.vehtypeDT.length; i++) {
            let el = this.vehtypeDT[i];
            let d = data.find(f => f.vhid === el.vhid);

            if (d !== undefined) {
                el.tripid = d.tripid;

                if (isNaN(d.speed)) el.speed = 0;
                else el.speed = d.speed;

                if (isNaN(d.bearing)) el.bearing = el.bearing;
                else el.bearing = d.bearing;

                // el.btr = d.btr;

                if (isNaN(d.btr)) el.btr = 100;
                else el.btr = d.btr;

                if (d.loc !== undefined && d.loc !== null) {
                    el.loc = d.loc;
                    this.moveMarker([el.loc[1], el.loc[0]], el.vhid, el.bearing);
                }

                el.sertm = d.sertm;
                el.min = this.getTimeDiff(d.sertm);
                el.isshow = true;
                el.ju = false;
                el.flag = d.flag;

                // Battery Status

                el.btrst = d.btrst

                if (isNaN(d.gsmsig)) {
                    el.rng = 0;
                } else {
                    el.rng = d.gsmsig;
                }
                if (isNaN(d.acc)) {
                    el.acc = 0;
                } else {
                    el.acc = d.acc;
                }

            } else if (el.ju) {

            } else {
                el.isshow = false;
            }
        }
        
        var that = this;

        setTimeout(() => {
            if (that.queryimei !== '') {
                $('#' + that.queryimei).click();
            }
        }, 1000);
    }

    // Move Marker

    private moveMarker(loc, vhid, bearing) {
        let mrk = this.vhmarkers[vhid];

        if (mrk !== undefined) {
            let bear = 0;

            mrk.setPosition(new google.maps.LatLng(loc[0], loc[1]));

            if (this.selectedFlwVh.vhid !== undefined && this.selectedFlwVh.vhid == vhid) {
                this.map.setCenter(new google.maps.LatLng(loc[0], loc[1]))
            }
        }
    }

    // Select for map show

    private onchange(e, vh) {
        if (vh.isshow === undefined || vh.isshow === false) {
            this._msg.Show(messageType.warn, "Hey", "No Updates found"); e.target.checked = false; return
        }
        else {
            if (e.target.checked) {
                if (vh.loc === undefined) {
                    e.target.checked = false;
                    e.preventDefault();
                    this._msg.Show(messageType.warn, "Hey", "Location not received yet"); e.target.checked = false;
                    return;
                }
                this.selectedVeh.push(vh.vhid);
                this.addmarker(vh);
                this.boundtomap()
            }
            else {
                let i = this.selectedVeh.indexOf(vh.vhid);

                if (i > -1) {
                    this.selectedVeh.splice(i, 1);
                }

                if (this.selectedVeh.length > 0) {
                    this.boundtomap();
                }
                else {
                    this.map.setZoom(5);
                    this.map.setCenter(new google.maps.LatLng(this.options.center.lat, this.options.center.lng))
                }

                this.removemarker(vh.vhid);
            }
        }

        if (this.queryimei !== '') {
            this.clickVehicle(vh);
        }

        e.preventDefault();
    }

    // Get Bound

    private boundtomap() {
        if (this.selectedVeh.length <= 0) {
            return;
        }

        var bounds = new google.maps.LatLngBounds();

        for (let i = 0; i < this.selectedVeh.length; i++) {
            let el = this.selectedVeh[i];
            let mr = this.vhmarkers[el];
            bounds.extend(mr.getPosition());
        }

        this.map.fitBounds(bounds);
    }

    private showinfowindow() {
        for (let i = 0; i < this.selectedVeh.length; i++) {
            let el = this.selectedVeh[i];
            let mr = this.vhmarkers[el];

            if (this.markerOptions.showinfo) {
                mr.info.open(this.map, mr);
            }
            else {
                mr.info.close();
            }
        }
    }

    private hidelives() {
        for (let i = 0; i < this.selectedVeh.length; i++) {
            let el = this.selectedVeh[i];
            let mr = this.vhmarkers[el];

            if (this.markerOptions.hidelive) {
                mr.setMap(null);
            }
            else {
                mr.setMap(this.map);
            }
        }
    }

    private showHidetraffic() {
        if (this.markerOptions.showtrafic) {
            this.trafficLayer.setMap(this.map);
        }
        else {
            this.trafficLayer.setMap(null);
        }
    }

    private clickVehicle(vh) {
        if (!vh.sel) { return; }

        if (vh.isshow === undefined || vh.isshow === false) { return; }
        vh.isfollow = !vh.isfollow;

        if (this.selectedFlwVh.isfollow !== undefined) {
            if (vh.vhid !== this.selectedFlwVh.vhid) {
                this.selectedFlwVh.isfollow = false;
            }
        }
        if (vh.isfollow && vh.vhid !== this.selectedFlwVh.vhid) {
            this.map.setCenter(new google.maps.LatLng(vh.loc[1], vh.loc[0]));
            this.selectedFlwVh = vh;
            this.map.setZoom(17);
        }
        else {
            this.selectedFlwVh = {};
        }
    }

    private addmarker(vh) {
        let bearing = 0;
        let imagePath = 'assets/img/map/' + vh.ico + '_' + bearing + '.png?v=1';

        let image = {
            url: imagePath,
            ico: vh.ico
        };

        let vhmarker = new google.maps.Marker({
            position: {
                lat: vh.loc[1]
                , lng: vh.loc[0]
            },

            strokeColor: 'red',
            strokeWeight: 3,
            scale: 6,
            icon: image,
            title: vh.vno + ' (' + vh.vrg + ')',
        });

        vhmarker.info = new google.maps.InfoWindow({
            content: vhmarker.title
        });

        if (this.markerOptions.showinfo) {
            vhmarker.info.open(this.map, vhmarker);
        }

        vhmarker.setMap(this.map);
        this.vhmarkers[vh.vhid] = vhmarker;
    }

    private removemarker(vhid) {
        let mrkr = this.vhmarkers[vhid];

        if (mrkr != null) {
            mrkr.setMap(null);
            delete this.vhmarkers[vhid];
        }
    }

    info_click(vh, event) {
        if (vh.isshow === undefined || vh.isshow === false) {
            this._msg.Show(messageType.warn, "Hey", "No Updates found"); return;
        }

        if (this.sidebarTitle !== "Info" || this.selectedSVh.id !== vh.id) {
            this.sidebarTitle = "Info";
            this.selectedSVh = vh;
            this.loadComponent(INFOComponent, { "vhid": vh.id, loginUser: this.loginUser, _enttdetails: this._enttdetails });
            commonfun.loader("#loaderbody", "pulse", 'Loading Vehicle Info...')
        }

        $.AdminBSB.rightSideBar.Open();
        event.stopPropagation();
    }

    passenger_click(vh, event) {
        if (vh.isshow === undefined || vh.isshow === false) {
            this._msg.Show(messageType.warn, "Hey", "No Updates found"); return;
        }

        if (this.sidebarTitle !== "Passengers" || this.selectedSVh.vhid !== vh.vhid) {
            this.sidebarTitle = "Passengers";
            this.selectedSVh = vh;
            this.loadComponent(PSGComponent, { "tripid": vh.tripid, loginUser: this.loginUser, _enttdetails: this._enttdetails });
            commonfun.loader("#loaderbody", "pulse", 'Loading Passengers...');
        }

        $.AdminBSB.rightSideBar.Open();
        event.stopPropagation();
    }

    history_click(vh, event) {
        if (vh.isshow === undefined || vh.isshow === false) {
            this._msg.Show(messageType.warn, "Hey", "No Updates found"); return;
        }

        if (this.sidebarTitle !== "History" || this.selectedSVh.id !== vh.id) {
            this.loadComponent(HISTORYComponent, {
                "vhid": vh.id,
                "imei": vh.vhid,
                loginUser: this.loginUser, _enttdetails: this._enttdetails, map: this.map
            });

            this.sidebarTitle = "History";
            this.selectedSVh = vh;

            commonfun.loader("#loaderbody", "timer", 'Loading History...');
        }

        $.AdminBSB.rightSideBar.Open();
        event.stopPropagation();
    }

    filter(fil) {
        this.olfilter = fil;
        if (fil === 'all' && this._counter.all === 0) { this._showempty = true }
        else if (fil === 'ol' && this._counter.online === 0) { this._showempty = true }
        else if (fil === 'of' && this._counter.offline === 0) { this._showempty = true }
        else if (fil === 'ig' && this._counter.ign === 0) { this._showempty = true }
        else {
            this._showempty = false;
        }
    }

    onlineCheckr: any;

    private checkOnlineCount() {
        let that = this;
        this.onlineCheckr = setInterval(function () {
            that._counter.online = 0;
            that._counter.offline = 0;
            that._counter.ign = 0;

            for (var k = 0; k < that.vehtypeDT.length; k++) {
                var el = that.vehtypeDT[k];

                if (el.min < that.offlinetimeout && el.flag !== "stop") {
                    that._counter.online += 1;
                    el.os = "ol";
                    if (el.acc == 1) {
                        that._counter.ign += 1;
                        el.os = "ig";
                    }
                } else {
                    that._counter.offline += 1;
                    el.os = "of";
                }
            }
        }, 5000);
    }

    private close_sidebar() {
        commonfun.loaderhide("#loaderbody")
        $.AdminBSB.rightSideBar.Close();
    }

    // UI Changer

    private closesidepanel() {
        if ($("#sidepanel").hasClass('col-md-3')) {
            $("#sidepanel").removeClass('col-md-3').addClass('hide');
            $("#map").removeClass('col-md-9').addClass('col-md-12');
            $("#closeicon").text('keyboard_arrow_right');
        }
        else {
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

        if (this.onlineCheckr !== undefined) {
            clearInterval(this.onlineCheckr);
        }

        $.AdminBSB.islocked = false;
        $.AdminBSB.rightSideBar.closeonwindow = true;
        $.AdminBSB.leftSideBar.Open();

        $('.container-fluid').css('padding-left', '5px').css('padding-right', '5px');

        this._socketservice.close();
        this.subscribeParameters.unsubscribe();
    }
}