import { Component, OnInit, Input, OnDestroy, ComponentFactoryResolver, forwardRef, ViewChild } from '@angular/core';
import { TTMapService } from '@services/master';
import { MessageService, messageType, TrackDashbord } from '@services';
import { HOSTComponent } from '@interface';
import { ADHOST } from '@directives';
import { PSGComponent } from '../passengers/psg.comp'

declare var google: any;

@Component({
    templateUrl: './history.comp.html',
    providers: [TrackDashbord],
    styleUrls: ['./style.css']

})
export class HISTORYComponent implements OnInit, OnDestroy {
    @ViewChild(ADHOST)
    private _Host: ADHOST;

    @Input() data: any;
    tripDT: any = [];
    map: any;
    dateFromValue: any;
    dateToValue: any = new Date();
    val: any = 0;
    maxrange: number = 100;
    marker: any;
    index = 0;
    poly: any;
    HistoryMarker: any = {};
    slideValCt = 0;
    tripLength = 0;
    isplay = false;
    servertimer: any = "---No Data---";
    btr: any = 0;
    timer: any;
    speedD: any = {
        "1": 500,
        "2": 450,
        "3": 400,
        "4": 350,
        "5": 300,
        "6": 250,
        "7": 200,
        "8": 160,
        "9": 140,
        "10": 100

    };
    speedval = 1;
    speed: any = this.speedD["1"];
    hasTripData: any = false;
    historyDt: any = [];
    isplayerShow: boolean = false;

    constructor(private _msg: MessageService, private _ttmapservice: TTMapService,
        private _trackboard: TrackDashbord, private componentFactoryResolver: ComponentFactoryResolver) { }

    ngOnInit() {

        this.dateFromValue = new Date(moment().subtract(2, 'days').toString());

        commonfun.loaderhide("#loaderbody");
        this.map = this.data.map;

        this.marker = new SlidingMarker({
            position: {
                lat: 19.1312149
                , lng: 72.8624101
            },
            icon: {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                fillColor: '#FF0000',
                fillOpacity: 1.0,
                anchor: new google.maps.Point(0, 3),
                strokeWeight: 0,
                scale: 5,
                rotation: 0
            },
            title: "I'm sliding marker",
            duration: this.speed
        });
        this.initPoly();
        this.addStartStop()

    }

    // Get Today's Trip


    private getTripDelta(tripid) {
        var that = this;
        this.slideValCt = 0;

        commonfun.loader("#loaderbody", "timer", 'Loading History...');
        this._ttmapservice.getLastLocation({ "limit": 50000, "tripid": tripid }).subscribe(data => {

            if (data.data.length === 0) {
                that._msg.Show(messageType.info, "No data", "Sorry, We unable to find data for this trip.");
                commonfun.loaderhide("#loaderbody");
                return;
            }
            that.tripDT = data.data;
            that.maxrange = that.tripDT.length - 1;
            that.drawPath();
            that.setStartEnd();
            this.isplayerShow = true;
            commonfun.loaderhide("#loaderbody");
            this.playPause();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide("#loaderbody");
        }, () => {
        });
        this.data.tripid = tripid;
       // this.loadComponent(PSGComponent, this.data);
    }

    private resetTrips() {
        let path = this.poly.getPath();
        path.clear();
        this.isplay = false;
        if (this.timer) clearTimeout(this.timer);
        this.marker.setMap(null);
        if (this.HistoryMarker["start"]) this.HistoryMarker["start"].setMap(null);
        if (this.HistoryMarker["stop"]) this.HistoryMarker["stop"].setMap(null);
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
    private movemarker(i, forwardrev, anim) {

        let _d = this.tripDT[this.maxrange - i];
        let latlon = new google.maps.LatLng(_d.loc[1], _d.loc[0]);
        this.map.panTo(latlon);
        let ico = this.marker.getIcon();
        ico.rotation = this.bearing360(_d.bearing);
        this.marker.setIcon(ico);
        if (anim === 'animate')
            this.marker.setPosition(latlon);
        else
            this.marker.setPositionNotAnimated(latlon);
        this.servertimer = moment(_d.sertm).format('DD-MM-YYYY hh:mm:ss');
        this.btr = _d.btr;
        if (this.maxrange - i === 0) { this.isplay = false; return; }

        this.startmoving();


    }

    private setStartEnd() {
        let start = this.HistoryMarker["start"];
        let stop = this.HistoryMarker["stop"];
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

        this.HistoryMarker["start"] = new SlidingMarker({
            position: {
                lat: 0.0
                , lng: 0.0
            },
            icon: start,
            animation: google.maps.Animation.DROP
        });
        this.HistoryMarker["stop"] = new SlidingMarker({
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
            strokeWeight: 0,
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
                repeat: "200px"
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

    private drawPath() {
        let path = this.poly.getPath();

        var bounds = new google.maps.LatLngBounds();
        for (var i = this.tripDT.length - 1; i >= 0; i--) {
            var el = this.tripDT[i];
            let lt = new google.maps.LatLng(el.loc[1], el.loc[0]);
            path.push(lt);
            bounds.extend(lt);
        }
        this.map.fitBounds(bounds);
        let start = this.tripDT[this.tripDT.length - 1];
        this.marker.setPositionNotAnimated(new google.maps.LatLng(start.loc[1], start.loc[0]));
        this.marker.setMap(this.map);
    }

    private playPause() {
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
        commonfun.loader("#loaderbody");
        this._trackboard.gettrackboard({
            "flag": "triphistory",
            "vehid": this.data.vhid,
            "uid": this.data.loginUser.uid,
            "utype": this.data.loginUser.utype,
            "issysadmin": this.data.loginUser.issysadmin,
            "wsautoid": this.data._wsdetails.wsautoid,
            "frmdt": this.dateFromValue,
            "todt": this.dateToValue
        }).subscribe((data) => {
            try {
                //console.log(data.data);
                that.historyDt = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
            commonfun.loaderhide("#loaderbody");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide("#loaderbody");
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
        this.isplay = false;
        if (this.timer) clearTimeout(this.timer);
        this.marker.setMap(null);
        if (this.poly) this.poly.setMap(null);
        if (this.HistoryMarker["start"]) this.HistoryMarker["start"].setMap(null);
        if (this.HistoryMarker["stop"]) this.HistoryMarker["stop"].setMap(null);


    }
    //injecter service
    private loadComponent(component, data) {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        let viewContainerRef = this._Host.viewContainerRef;
        viewContainerRef.clear();
        let componentRef = viewContainerRef.createComponent(componentFactory);
        (<HOSTComponent>componentRef.instance).data = data;

    }


    ngOnDestroy() {
        this.clearAll();
    }
}