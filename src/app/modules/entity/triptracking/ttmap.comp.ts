import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation, AfterViewInit, ComponentFactoryResolver, forwardRef } from '@angular/core';
import { MessageService, messageType, LoginService, CommonService, SocketService, TrackDashbord } from '@services';
import { LoginUserModel, Globals } from '@models';
import { TTMapService } from '@services/master';
import { SelectItem, GMap } from 'primeng/primeng';
import { ADHOST } from '@directives';
import { HOSTComponent } from '@interface';

import { PSGComponent } from './passengers/psg.comp';
import { INFOComponent } from './info/info.comp';
import { HISTORYComponent } from './history/history.comp';

declare var google: any;

@Component({
    templateUrl: 'ttmap.comp.html',
    providers: [CommonService, SocketService, TrackDashbord],
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

    sidebarTitle = "Title";
    trafficLayer: any = new google.maps.TrafficLayer();

    markerOptions = {
        showinfo: false,
        hidelive: false,
        showtrafic: false
    }

    constructor(private _ttmapservice: TTMapService, private _msg: MessageService, private _autoservice: CommonService,
        private _loginservice: LoginService, private _socketservice: SocketService, private _trackDashbord: TrackDashbord,
        private componentFactoryResolver: ComponentFactoryResolver) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.enttid = this._enttdetails.enttid;
        this.enttname = this._enttdetails.enttname;
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
            $.AdminBSB.rightSideBar.closeonwindow = false; // do not close right bar on window click
            
            $(".enttname input").focus();
            $('.container-fluid').css('padding-left', '0px').css('padding-right', '0px');
        }, 100);

        this.fillVehicleDropDown();
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
            styles: [{ "stylers": [{ "saturation": -100 }] }]
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

    private selectEntityData(event) {
        this.enttid = event.value;
        this.enttname = event.label;

        this.fillVehicleDropDown();
    }

    // Vehicle DropDown

    private fillVehicleDropDown() {
        var that = this;
        commonfun.loader();

        this.vehtypeDT = [];
        this.vehtypeIds = [];

        that._trackDashbord.gettrackboard({
            "flag": "vehicle",
            "enttid": that.enttid,
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
                    that.vehtypeIds.push(el.vhid);
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
                    let el = that.vehtypeDT.find(a => a.vhid === parseInt(geoloc.vhid));

                    if (el !== undefined) {
                        el.tripid = geoloc.tripid;
                        el.speed = geoloc.speed;
                        el.bearing = geoloc.bearing;
                        el.btr = geoloc.btr;
                        el.loc = [geoloc.lon, geoloc.lat];
                        el.sertm = geoloc.sertm;
                        el.isshow = true;
                        el.min = 0;
                        el.flag = geoloc.flag;
                        el.ju = true;
                        $("#vh" + geoloc.vhid).removeClass('swing animated');

                        setTimeout(function () {
                            $("#vh" + geoloc.vhid).addClass('swing animated');
                        }, 100);

                    }
                    this.moveMarker([geoloc.lat, geoloc.lon], geoloc.vhid, geoloc.bearing);
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
                }, 30000);

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
        for (let i = 0; i < this.vehtypeDT.length; i++) {
            let el = this.vehtypeDT[i];
            let d = data.find(f => f.vhid === el.vhid);

            if (d !== undefined) {
                el.tripid = d.tripid;
                el.speed = d.speed;
                el.bearing = d.bearing;
                el.btr = d.btr;
                el.loc = d.loc;
                el.sertm = d.sertm;
                el.min = this.getTimeDiff(d.sertm);
                el.isshow = true;
                el.ju = false;
                el.flag = d.flag;
                this.moveMarker([el.loc[1], el.loc[0]], el.vhid, el.bearing);
            } else if (el.ju) {

            } else {
                el.isshow = false;
            }
        }
    }

    // Move Marker

    private moveMarker(loc, vhid, bearing) {
        let mrk = this.vhmarkers[vhid];

        if (mrk !== undefined) {
            let bear = 0;
            let _ico = mrk.getIcon().ico;

            mrk.setIcon({ url: 'assets/img/map/' + _ico + '_' + bear + '.png?v=1', ico: _ico })
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
            animation: google.maps.Animation.BOUNCE,
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

    private info_click(vh, event) {
        if (vh.isshow === undefined || vh.isshow === false) {
            this._msg.Show(messageType.warn, "Hey", "No Updates found"); return;
        }

        if (this.sidebarTitle !== "Info" || this.selectedSVh.vhid !== vh.vhid) {
            this.sidebarTitle = "Info";
            this.selectedSVh = vh;
            this.loadComponent(INFOComponent, { "vhid": vh.vhid, loginUser: this.loginUser, _enttdetails: this._enttdetails });
            commonfun.loader("#loaderbody", "pulse", 'Loading Vehicle Info...')
        }

        $.AdminBSB.rightSideBar.Open();
        event.stopPropagation();
    }

    private passenger_click(vh, event) {
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

    private history_click(vh, event) {
        if (vh.isshow === undefined || vh.isshow === false) {
            this._msg.Show(messageType.warn, "Hey", "No Updates found"); return;
        }

        if (this.sidebarTitle !== "History" || this.selectedSVh.vhid !== vh.vhid) {
            this.loadComponent(HISTORYComponent, {
                "vhid": vh.vhid,
                loginUser: this.loginUser, _enttdetails: this._enttdetails, map: this.map
            });

            this.sidebarTitle = "History";
            this.selectedSVh = vh;
            commonfun.loader("#loaderbody", "timer", 'Loading History...');
        }

        $.AdminBSB.rightSideBar.Open();
        event.stopPropagation();
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

        $.AdminBSB.islocked = false;
        $.AdminBSB.rightSideBar.closeonwindow = true;
        $.AdminBSB.leftSideBar.Open();

        $('.container-fluid').css('padding-left', '5px').css('padding-right', '5px');
        this._socketservice.close();
    }
}