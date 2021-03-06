import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService, SocketService, TrackDashbord } from '@services';
import { LoginUserModel, Globals } from '@models';
import { SelectItem, GMap } from 'primeng/primeng';
import { ADHOST } from '@directives';
import { HOSTComponent } from '@interface';

import { VehicleScheduleComponent } from './schedule/vehschdl.comp';
import { INFOComponent } from './info/info.comp';
import { HISTORYComponent } from './history/history.comp';

declare var google: any;

@Component({
    templateUrl: 'ttmap.comp.html',
    styleUrls: ['./style.css']
})

export class TripTrackingComponent implements OnInit, OnDestroy, AfterViewInit {
    private loginUser: LoginUserModel;
    private _enttdetails: any = [];

    @ViewChild(ADHOST)
    private _Host: ADHOST;

    private selectedTripType: number = 0;
    private triptype: SelectItem[];

    @ViewChild('gmap')
    private _gmap: GMap;

    private map: any;
    private marker: any;
    private overlays: any = [];

    private entityDT: any = [];
    private enttid: number = 0;

    private qsenttid: number = 0;
    private qsimei: string = '';
    private qsvehid: number = 0;

    private srcvehname: string = '';

    private vehtypeDT: any = [];
    private vehtypeIds: any = [];
    private vehtypeid: number = 0;
    private selectedVeh: any = [];
    private selectedSVh: any = {};
    private selectedFlwVh: any = {};

    private tripDT: any = [];
    private messageDT: any = [];
    private psngrDT: any = [];

    private isPlay: boolean = true;

    private options: any = [];

    private sel_tripid: number = 0;
    private sel_msttripid: number = 0;

    private connectmsg: string = '';
    private lastlat: string = '';
    private lastlon: string = '';

    private vhmarkers: any = [];
    private dbcaller: any = [];
    private offlinetimeout = 8;
    private offlinetimeout_reach = this.offlinetimeout + 2;

    private sidebarTitle = 'Title';
    private trafficLayer: any = new google.maps.TrafficLayer();

    private markerOptions = {
        showinfo: false,
        hidelive: false,
        showtrafic: false
    }

    private _counter: any = {
        all: 0,
        online: 0,
        offline: 0,
        ign: 0
    }

    private olfilter: any = 'all';
    private _showempty: boolean = false;

    private subscribeParameters: any;
    private socketsubscribe: any;

    constructor(
        private _actrouter: ActivatedRoute,
        private _msg: MessageService,
        private _loginservice: LoginService,
        private _socketservice: SocketService,
        private _autoservice: CommonService,
        private _trackDashbord: TrackDashbord,
        private componentFactoryResolver: ComponentFactoryResolver) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getMessage();
    }

    // tslint:disable-next-line:member-access
    ngOnInit() {
        this._socketservice.close();
        this.getDefaultMap();

        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.closeonwindow = false;

            //$('.container-fluid').css('padding-left', '0px').css('padding-right', '0px');
        }, 100);

        this.subscribeParameters = this._actrouter.queryParams.subscribe(params => {
            this.qsenttid = params['enttid'] || this._enttdetails.enttid;

            this.qsvehid = params['vehid'] || 0;
            this.srcvehname = params['vehname'] || '';
            this.qsimei = params['imei'] || '';

            this.fillSchoolDropDown();
        });
    }



    // tslint:disable-next-line:member-access
    ngAfterViewInit() {
        let that = this;

        that.map = that._gmap.getMap();
        SlidingMarker.initializeGlobally();

        if (that.map !== undefined) {
            setTimeout(function () {
                $('.maincontent').css('margin-top', '45px');
                google.maps.event.trigger(that.map, 'resize');
            }, 1000);
        }
    }

    // tslint:disable-next-line:member-access
    ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.rightSideBar.closeonwindow = true;
        $.AdminBSB.leftSideBar.Open();
        $('.maincontent').css('margin-top', '50px');
        if (this.dbcaller !== undefined) {
            clearInterval(this.dbcaller);
        }

        if (this.onlineCheckr !== undefined) {
            clearInterval(this.onlineCheckr);
        }
        this._socketservice.close();

        // $('.container-fluid').css('padding-left', '5px').css('padding-right', '5px');
        this.subscribeParameters.unsubscribe();
        this.socketsubscribe.unsubscribe();

    }


    private loadComponent(component, data) {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);

        let viewContainerRef = this._Host.viewContainerRef;
        viewContainerRef.clear();

        let componentRef = viewContainerRef.createComponent(componentFactory);
        (<HOSTComponent>componentRef.instance).data = data;
    }




    private getDefaultMap() {
        this.options = {
            center: { lat: 22.861639, lng: 78.257621 },
            zoom: 5,
            styles: [{ 'stylers': [{ 'saturation': -100 }] }],
            // styles: [
            //     { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
            //     { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
            //     { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
            //     {
            //         featureType: 'administrative.locality',
            //         elementType: 'labels.text.fill',
            //         stylers: [{ color: '#d59563' }]
            //     },
            //     {
            //         featureType: 'poi',
            //         elementType: 'labels.text.fill',
            //         stylers: [{ color: '#d59563' }]
            //     },
            //     {
            //         featureType: 'poi.park',
            //         elementType: 'geometry',
            //         stylers: [{ color: '#263c3f' }]
            //     },
            //     {
            //         featureType: 'poi.park',
            //         elementType: 'labels.text.fill',
            //         stylers: [{ color: '#6b9a76' }]
            //     },
            //     {
            //         featureType: 'road',
            //         elementType: 'geometry',
            //         stylers: [{ color: '#38414e' }]
            //     },
            //     {
            //         featureType: 'road',
            //         elementType: 'geometry.stroke',
            //         stylers: [{ color: '#212a37' }]
            //     },
            //     {
            //         featureType: 'road',
            //         elementType: 'labels.text.fill',
            //         stylers: [{ color: '#9ca5b3' }]
            //     },
            //     {
            //         featureType: 'road.highway',
            //         elementType: 'geometry',
            //         stylers: [{ color: '#746855' }]
            //     },
            //     {
            //         featureType: 'road.highway',
            //         elementType: 'geometry.stroke',
            //         stylers: [{ color: '#1f2835' }]
            //     },
            //     {
            //         featureType: 'road.highway',
            //         elementType: 'labels.text.fill',
            //         stylers: [{ color: '#f3d19c' }]
            //     },
            //     {
            //         featureType: 'transit',
            //         elementType: 'geometry',
            //         stylers: [{ color: '#2f3948' }]
            //     },
            //     {
            //         featureType: 'transit.station',
            //         elementType: 'labels.text.fill',
            //         stylers: [{ color: '#d59563' }]
            //     },
            //     {
            //         featureType: 'water',
            //         elementType: 'geometry',
            //         stylers: [{ color: '#17263c' }]
            //     },
            //     {
            //         featureType: 'water',
            //         elementType: 'labels.text.fill',
            //         stylers: [{ color: '#515c6d' }]
            //     },
            //     {
            //         featureType: 'water',
            //         elementType: 'labels.text.stroke',
            //         stylers: [{ color: '#17263c' }]
            //     }
            // ],
            maxZoom: 17
        };
    }

    private getTripType() {
        this.triptype = [];
        this.triptype.push({ 'label': 'Pending', 'value': '0' });
        this.triptype.push({ 'label': 'Started', 'value': '1' });
        this.triptype.push({ 'label': 'Completed', 'value': '2' });
    }

    // Fill School Drop Down

    private fillSchoolDropDown() {
        const that = this;
        let defschoolDT: any = [];

        commonfun.loader();

        that._autoservice.getDropDownData({
            flag: 'school',
            uid: that.loginUser.uid,
            utype: that.loginUser.utype,
            ctype: that.loginUser.ctype,
            enttid: that._enttdetails.enttid,
            wsautoid: 0,
            issysadmin: that.loginUser.issysadmin
        }).subscribe((data) => {
            try {
                that.entityDT = data.data;

                if (that.entityDT.length > 0) {
                    defschoolDT = that.entityDT.filter(a => a.iscurrent == true);

                    if (defschoolDT.length > 0) {
                        that.enttid = defschoolDT[0].enttid;
                    } else {
                        if (sessionStorage.getItem('_schenttdetails_') === null
                            &&
                            sessionStorage.getItem('_schenttdetails_') === undefined) {
                            that.enttid = that.qsenttid || 0;
                        } else {
                            that.enttid = that.qsenttid || that._enttdetails.enttid;
                        }
                    }

                    that.fillVehicleDropDown();
                }
            } catch (e) {
                that._msg.Show(messageType.error, 'Error', e);
            }

            commonfun.loaderhide();
        }, (err) => {
            that._msg.Show(messageType.error, 'Error', err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {
            console.log('done');
        });
    }

    // Vehicle DropDown

    private fillVehicleDropDown() {
        commonfun.loader();
        var that = this;
        that.vehtypeDT = [];
        that.vehtypeIds = [];

        that._trackDashbord.gettrackboard({
            'flag': 'vehicle',
            'vehid': that.qsvehid,
            'enttid': that.enttid,
            'uid': that.loginUser.uid,
            'utype': that.loginUser.utype,
            'issysadmin': that.loginUser.issysadmin
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
                that._msg.Show(messageType.error, 'Error', e);
            }
            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, 'Error', err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    // Get Selected Trip ID for get Map Data

    private getTTMap(row) {
        var that = this;

        that.sel_tripid = row.trpid;
        that.sel_msttripid = row.id;
    }

    // Get Tracking Map Data

    private getMessage() {
        var that = this;
        commonfun.loader();

        that.connectmsg = 'Registering...';

        this.socketsubscribe = this._socketservice.getMessage().subscribe(data => {
            var _d = data;

            if (_d['evt'] == 'regreq') {
                if (that.vehtypeIds.length > 0) {
                    that._socketservice.sendMessage('reg_v', that.vehtypeIds.join(','));
                }
            }
            else if (_d['evt'] == 'registered') {
                that.connectmsg = 'Registered...';

                setTimeout(function () {
                    that.connectmsg = 'Waiting for data..';
                }, 1000);
            }
            else if (_d['evt'] == 'data') {
                try {
                    var geoloc = _d['data'];
                    let el = that.vehtypeDT.find(a => a.vhid === geoloc.vhid);

                    if (el !== undefined) {
                        el.tripid = geoloc.tripid;
                        if (isNaN(geoloc.speed)) el.speed = 0;
                        else el.speed = geoloc.speed;

                        if (isNaN(geoloc.bearing)) el.bearing = el.bearing;
                        else el.bearing = geoloc.bearing;

                        if (geoloc.actvt === 'hrtbt') { el.btr = geoloc.btr };

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

                        if (geoloc.actvt === 'hrtbt') {
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
            that._msg.Show(messageType.error, 'Error', err);
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
            'vhids': data == null ? this.vehtypeIds : data
        }).subscribe(_d => {
            this.refreshdata(_d.data);
        }, err => {
            this._msg.Show(messageType.error, 'Error', err);
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
            if (that.qsimei !== '') {
                $('#' + that.qsimei).click();
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
            this._msg.Show(messageType.warn, 'Hey', 'No Updates found'); e.target.checked = false; return
        }
        else {
            if (e.target.checked) {
                if (vh.loc === undefined) {
                    e.target.checked = false;
                    e.preventDefault();
                    this._msg.Show(messageType.warn, 'Hey', 'Location not received yet'); e.target.checked = false;
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

        if (this.qsimei !== '') {
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

    private info_click(vh, event) {
        if (vh.isshow === undefined || vh.isshow === false) {
            this._msg.Show(messageType.warn, 'Hey', 'No Updates found'); return;
        }

        if (this.sidebarTitle !== 'Info' || this.selectedSVh.id !== vh.id) {
            this.sidebarTitle = 'Info';
            this.selectedSVh = vh;
            this.loadComponent(INFOComponent, { 'vhid': vh.id, loginUser: this.loginUser, _enttdetails: this._enttdetails });
            commonfun.loader('#loaderbody', 'pulse', 'Loading Vehicle Info...')
        }

        $.AdminBSB.rightSideBar.Open();
        event.stopPropagation();
    }

    private passenger_click(vh, event) {
        if (vh.isshow === undefined || vh.isshow === false) {
            this._msg.Show(messageType.warn, 'Hey', 'No Updates found'); return;
        }

        if (this.sidebarTitle !== 'Passengers' || this.selectedSVh.vhid !== vh.vhid) {
            this.sidebarTitle = 'Passengers';
            this.selectedSVh = vh;
            this.loadComponent(VehicleScheduleComponent, { 'vehid': vh.vehid, loginUser: this.loginUser, _enttdetails: this._enttdetails });
            commonfun.loader('#loaderbody', 'pulse', 'Loading Passengers...');
        }

        $.AdminBSB.rightSideBar.Open();
        event.stopPropagation();
    }

    private history_click(vh, event) {
        if (vh.isshow === undefined || vh.isshow === false) {
            this._msg.Show(messageType.warn, 'Hey', 'No Updates found'); return;
        }

        if (this.sidebarTitle !== 'History' || this.selectedSVh.id !== vh.id) {
            this.loadComponent(HISTORYComponent, {
                'vhid': vh.id,
                'imei': vh.vhid,
                loginUser: this.loginUser, _enttdetails: this._enttdetails, map: this.map
            });

            this.sidebarTitle = 'History';
            this.selectedSVh = vh;

            commonfun.loader('#loaderbody', 'timer', 'Loading History...');
        }

        $.AdminBSB.rightSideBar.Open();
        event.stopPropagation();
        this.closesidepanel();
    }

    private filter(fil) {
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

                if (el.min < that.offlinetimeout && el.flag !== 'stop') {
                    that._counter.online += 1;
                    el.os = 'ol';
                    if (el.acc == 1) {
                        that._counter.ign += 1;
                        el.os = 'ig';
                    }
                } else {
                    that._counter.offline += 1;
                    el.os = 'of';
                }
            }
        }, 5000);
    }

    private close_sidebar() {
        commonfun.loaderhide('#loaderbody')
        $.AdminBSB.rightSideBar.Close();
    }

    // UI Changer

    private closesidepanel() {
        if ($('#sidepanel').hasClass('col-md-3')) {
            $('#sidepanel').removeClass('col-md-3').addClass('hide');
            $('#map').removeClass('col-md-9').addClass('col-md-12');
            $('#closeicon').text('keyboard_arrow_right');
        }
        else {
            $('#sidepanel').addClass('col-md-3').removeClass('hide');
            $('#map').removeClass('col-md-12').addClass('col-md-9');
            $('#closeicon').text('keyboard_arrow_left');
        }

        if (this.map !== undefined) {
            google.maps.event.trigger(this.map, 'resize');
        }
    }



}