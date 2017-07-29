import {
    Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation,
    AfterViewInit, ComponentFactoryResolver, forwardRef
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService, SocketService, TrackDashbord } from '@services';
import { LoginUserModel, Globals } from '@models';
import { TTMapService } from '@services/master';
import { LazyLoadEvent, DataTable } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SelectItem, GMap } from 'primeng/primeng';
import { ADHOST } from '@directives';
import { HOSTComponent } from '@interface';

import { PSGComponent } from './passengers/psg.comp'
import { INFOComponent } from './info/info.comp'
import { HISTORYComponent } from './history/history.comp'

declare var google: any;

@Component({
    templateUrl: 'ttmap.comp.html',
    providers: [CommonService, SocketService, TrackDashbord]
})


export class TripTrackingComponent implements OnInit, OnDestroy, AfterViewInit {
    //chid component
    @ViewChild(ADHOST)
    private _Host: ADHOST;

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
    selectedSVh: any = {};

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

    //side bar
    sidebarTitle = "Title";

    markerOptions = {
        showinfo: false
    }

    constructor(private _ttmapservice: TTMapService, private _msg: MessageService, private _autoservice: CommonService,
        private _loginservice: LoginService, private _socketservice: SocketService,
        private _trackDashbord: TrackDashbord,
        private componentFactoryResolver: ComponentFactoryResolver) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        this.enttid = this._enttdetails.enttid;
        // this.enttname = this._enttdetails.enttname;
        this.getMessage();

        //this.getTripType();
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
            $.AdminBSB.rightSideBar.closeonwindow = false;//do not close right bar on window click
            $(".enttname input").focus();
            $('.container-fluid').css('padding-left', '0px').css('padding-right', '0px');
        }, 100);


        this.fillVehicleDropDown();
    }

    public ngAfterViewInit() {
        //this.loadComponent(PSGComponent, { "a": "asdsadsadasa" });
        this.map = this._gmap.getMap();
        SlidingMarker.initializeGlobally();
    }
    getDefaultMap() {
        this.options = {
            center: { lat: 22.861639, lng: 78.257621 },
            zoom: 5
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
            "wsautoid": that._wsdetails.wsautoid
        }).subscribe((data) => {
            try {
                that.vehtypeDT = data.data;
                for (var k = 0; k < that.vehtypeDT.length; k++) {
                    var el = that.vehtypeDT[k];
                    that.vehtypeIds.push(el.vhid);
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
                    //console.log(el)
                    if (el !== undefined) {
                        el.tripid = geoloc.tripid;
                        el.speed = geoloc.speed;
                        el.bearing = geoloc.bearing;
                        el.btr = geoloc.btr;
                        el.loc = [geoloc.lon, geoloc.lat];
                        el.sertm = geoloc.sertm;
                        el.isshow = true;
                        el.min = 0;
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
            //setTimeout(function () {
            that._socketservice.connect();
            //that._socketservice.sendMessage("reg_v", that.vehtypeIds.join(','));
            //}, 1000);

        }
    }

    private logicLiveBeat() {
        let _data = [];
        // console.log(this.vehtypeDT);
        for (var i = 0; i < this.vehtypeDT.length; i++) {
            var _el = this.vehtypeDT[i];
            //console.log(_el);
            if (_el.isshow == true) {

                //console.log(minutes);
                _el.min = this.getTimeDiff(_el.sertm);
                if (_el.min > 3 || _el.ju == false) {
                    _el.ju = false;
                    _data.push(_el.vhid);
                }
            } else {
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
                //console.log(el.loc);
                this.moveMarker([el.loc[1], el.loc[0]], el.vhid, el.bearing);
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
            // console.log(loc);
            let _ico = mrk.getIcon().ico;
            mrk.setIcon({ url: 'assets/img/map/' + _ico + '_' + bear + '.png', ico: _ico })
            mrk.setPosition(new google.maps.LatLng(loc[0], loc[1]));
        }
    }

    //select for map show
    private onchange(e, vh) {

        if (vh.isshow === undefined || vh.isshow === false)
        { this._msg.Show(messageType.warn, "Hey", "No Updates found"); e.target.checked = false; return } else {
            if (e.target.checked) {

                this.selectedVeh.push(vh.vhid);
                this.addmarker(vh);
                this.map.setCenter(new google.maps.LatLng(vh.loc[1], vh.loc[0]))
                //console.log(vh);
            } else {
                let i = this.selectedVeh.indexOf(vh.vhid);
                if (i > -1)
                    this.selectedVeh.splice(i, 1);
                this.removemarker(vh.vhid);
            }
        }
        // this.selectedVeh.push(vh);
        e.preventDefault();
    }

    private showinfowindow() {
        for (let i = 0; i < this.selectedVeh.length; i++) {
            let el = this.selectedVeh[i];
            let mr = this.vhmarkers[el];
            if (this.markerOptions.showinfo) {
                mr.info.open(this.map, mr);
            } else {
                mr.info.close();
            }
        }

    }

    private clickVehicle(vh) {
        if (vh.isshow === undefined || vh.isshow === false) { return; }
        this.map.setCenter(new google.maps.LatLng(vh.loc[1], vh.loc[0]));
    }

    private addmarker(vh) {
        let bearing = commonfun.getbearing((vh.bearing || 0));
        let imagePath = 'assets/img/map/' + vh.ico + '_' + bearing + '.png';
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
        }
        );
        vhmarker.info = new google.maps.InfoWindow({
            content: vhmarker.title
        });

        if (this.markerOptions.showinfo) {
            vhmarker.info.open(this.map, vhmarker);
        }

        vhmarker.setMap(this.map);
        this.vhmarkers[vh.vhid] = vhmarker;
        //console.log(vhmarker);
    }

    private removemarker(vhid) {
        let mrkr = this.vhmarkers[vhid];
        //console.log(mrkr);
        if (mrkr != null) {
            mrkr.setMap(null);
            delete this.vhmarkers[vhid];
        }
    }


    private info_click(vh, event) {
        if (vh.isshow === undefined || vh.isshow === false)
        { this._msg.Show(messageType.warn, "Hey", "No Updates found"); return; }
        this.sidebarTitle = "Info";
        this.selectedSVh = vh;
        this.loadComponent(INFOComponent, { "vhid": vh.vhid, loginUser: this.loginUser, _wsdetails: this._wsdetails });
        commonfun.loader("#loaderbody", "pulse", 'Loading Vehicle Info...')
        $.AdminBSB.rightSideBar.Open();
        event.stopPropagation();
    }

    private passenger_click(vh, event) {
        if (vh.isshow === undefined || vh.isshow === false)
        { this._msg.Show(messageType.warn, "Hey", "No Updates found"); return; }
        this.sidebarTitle = "Passengers";
        this.selectedSVh = vh;
        this.loadComponent(PSGComponent, { "tripid": vh.tripid, loginUser: this.loginUser, _wsdetails: this._wsdetails });
        commonfun.loader("#loaderbody", "pulse", 'Loading Passengers...')
        $.AdminBSB.rightSideBar.Open();

        event.stopPropagation();
    }

    private history_click(vh, event) {
        if (vh.isshow === undefined || vh.isshow === false)
        { this._msg.Show(messageType.warn, "Hey", "No Updates found"); return; }
        //else
        this.loadComponent(HISTORYComponent, { "vhid": vh.vhid, loginUser: this.loginUser, _wsdetails: this._wsdetails });
        this.sidebarTitle = "History";
        this.selectedSVh = vh;
        commonfun.loader("#loaderbody", "timer", 'Loading History...')
        $.AdminBSB.rightSideBar.Open();
        event.stopPropagation();
    }

    private close_sidebar() {
        commonfun.loaderhide("#loaderbody")
        $.AdminBSB.rightSideBar.Close();
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
        $.AdminBSB.rightSideBar.closeonwindow = true;//do not close right bar on window click
        $.AdminBSB.leftSideBar.Open();
        $('.container-fluid').css('padding-left', '5px').css('padding-right', '5px');
        this._socketservice.close();
    }



}
