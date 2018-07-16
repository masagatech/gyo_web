import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { RouteService } from '@services/master';
import { LoginUserModel, Globals } from '@models';
import { GMap } from 'primeng/primeng';

declare var google: any;

@Component({
    templateUrl: 'addrt.comp.html'
})

export class AddRouteComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    @ViewChild("gmap")
    _gmap: GMap;

    marker: any;
    circle: any;
    inkm: any;

    private options: any;
    private overlays: any[];
    private map: any;

    routesDT: any = [];
    rtid: number = 0;
    rtname: string = "";

    stopsTypeDT: any = [];
    stptype: string = "";

    stpid: number = 0;
    stpname: string = "";
    address: string = "";
    lat: string = "";
    lon: string = "";
    radius: any = 1000;

    stopsList: any = [];
    selectedStops: any;
    isedit: boolean = false;

    mode: string = "";
    isactive: boolean = true;

    markers: any = [];
    circles: any = [];
    private subscribeParameters: any;

    constructor(private _rtservice: RouteService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private cdRef: ChangeDetectorRef) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
    }

    public ngOnInit() {
        let that = this;

        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);

        that.editRoutes();

        that.options = {
            center: { lat: that.lat, lng: that.lon },
            zoom: 12
        };

        that.marker = new google.maps.Marker({ position: { lat: that.lat, lng: that.lon }, title: "", draggable: true });

        that.circle = new google.maps.Circle({
            center: { lat: 0, lng: 0 }, fillColor: '#1976D2', fillOpacity: 0.35,
            strokeWeight: 1, radius: that.radius, draggable: true, editable: true,
        });

        that.overlays = [that.marker];
        that.getDefaultMap();
        that.circle.bindTo('center', that.marker, 'position');

        google.maps.event.addListener(that.circle, 'radius_changed', function () {
            that.radius = this.getRadius().toFixed(2);
            that.meterinkm();
            that.cdRef.detectChanges();
        })
    }

    public ngAfterViewInit() {
        let that = this;

        that.map = that._gmap.getMap();

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

    private ovrldrag(e) {
        this.lat = this.marker.position.lat();
        this.lon = this.marker.position.lng();
    }

    private meterinkm() {
        this.inkm = (this.radius / 1000).toFixed(2) + " KM";
    }

    private radiousChanged() {
        this.circle.setRadius(Number(this.radius));
        this.meterinkm()
    }

    // get lat and lon by address form google map

    getLatAndLon() {
        let that = this;
        commonfun.loader("#address");

        let geocoder = new google.maps.Geocoder();

        geocoder.geocode({ 'address': that.address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                that.lat = results[0].geometry.location.lat();
                that.lon = results[0].geometry.location.lng();

                if (that.overlays.length == 0) {
                    that.overlays.push(that.marker);
                    that.overlays.push(that.circle);
                }

                var latlng = new google.maps.LatLng(that.lat, that.lon);
                that.circle.setCenter(latlng);
                that.marker.setPosition(latlng);

                that._gmap.map.setCenter(latlng);
            }
            else {
                that._msg.Show(messageType.error, "Error", "Unable to find location.");
            }

            commonfun.loaderhide("#address");
            that.cdRef.detectChanges();
        });
    }

    handleMapClick(e) {
        this.lat = e.latLng.lat();
        this.lon = e.latLng.lng();
        var latlng = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
        this.marker.setPosition(latlng);
    }

    // Open Popup For Saving Routes

    openRoutesPopup() {
        var that = this;

        if (that.rtid !== 0) {
            that.rtname = $("#ddlRoutes option:selected").text().trim();
        }
        else {
            that.rtname = "";
        }

        $("#addRoutesModal").modal('show');
        $(".rtname").focus();
    }

    // Save Stops Data

    saveRoutesInfo() {
        var that = this;

        if (that.rtname == "") {
            that._msg.Show(messageType.error, "Error", "Select Route Name");
            $(".rtname").focus();
        }
        else {
            commonfun.loader();

            var savert = {
                "rtid": that.rtid,
                "rtname": that.rtname,
                "enttid": that._enttdetails.enttid,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._enttdetails.wsautoid
            }

            this._rtservice.saveRoutesInfo(savert).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_routesinfo;
                    var _msg = dataResult.msg;
                    var _msgid = dataResult.msgid;
                    var _rtid = dataResult.rtid;

                    if (_msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", _msg);
                        that.fillRoutesDropDown();

                        that.rtid = _rtid;
                        that.rtname = "";
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", _msg);
                    }

                    commonfun.loaderhide();
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
                commonfun.loaderhide();
            }, () => {
            });
        }
    }

    // Fill Route DropDown

    fillRoutesDropDown() {
        var that = this;
        commonfun.loader();

        that._rtservice.getStopsDetails({ "flag": "rtddl", "enttid": that._enttdetails.enttid }).subscribe(data => {
            try {
                that.routesDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    // Fill Stops DropDown List

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._rtservice.getStopsDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.stopsTypeDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    // Get Route Edit

    editRoutes() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.rtid = params['id'];

                that._rtservice.getStopsDetails({ "flag": "editroute", "rtid": that.rtid }).subscribe(data => {
                    try {
                        var _routedata = data.data;

                        if (_routedata.length > 0) {
                            that.fillRoutesDropDown();
                            that.getStopsByRoute();

                            $(".enttname input").prop("disabled", "disabled");
                            $(".rtid").prop("disabled", "disabled");
                        }
                    }
                    catch (e) {
                        that._msg.Show(messageType.error, "Error", e);
                    }

                    commonfun.loaderhide();
                }, err => {
                    that._msg.Show(messageType.error, "Error", err);
                    console.log(err);
                    commonfun.loaderhide();
                }, () => {

                })
            }
            else {
                that.fillRoutesDropDown();
                that.resetAllStopsFields();
            }
        });
    }

    // Get Stops Data

    getStopsByRoute() {
        var that = this;
        commonfun.loader();

        that._rtservice.getStopsDetails({ "flag": "byroute", "rtid": that.rtid }).subscribe(data => {
            try {
                var _stpdata = data.data;

                if (_stpdata.length > 0) {
                    that.stopsList = _stpdata;

                    setTimeout(function () {
                        commonfun.orderstyle();
                    }, 200);

                    that.bindStopsOnMap();
                }
                else {
                    that.stopsList = [];
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    // Copy Pick Up and Drop Address and Lat Lon from Residental Address and Lat Lon

    // Clear Fields

    resetAllStopsFields() {
        this.rtid = 0;
        this.rtname = "";
        this.stptype = "";

        this.resetStopsFields();
    }

    resetStopsFields() {
        this.stpid = 0;
        this.stpname = "";
        this.address = "";
        this.lat = "";
        this.lon = "";
        this.isedit = false;
    }

    // Add Sstops List

    isDuplicateStops() {
        var that = this;

        for (var i = 0; i < that.stopsList.length; i++) {
            var field = that.stopsList[i];

            if (field.stpname == that.stpname) {
                that._msg.Show(messageType.error, "Error", "Duplicate Stops Name Not Allowed");
                return true;
            }
        }

        return false;
    }

    addStopsList() {
        var that = this;
        var _rowid = 0;

        if (that.rtid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Routes Name");
        }
        else if (that.stpname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Stops Name");
        }
        else if (that.stptype == "") {
            that._msg.Show(messageType.error, "Error", "Select Stops Type");
        }
        else if (that.address == "") {
            that._msg.Show(messageType.error, "Error", "Enter Address");
        }
        else {
            var duplicateStops = that.isDuplicateStops();
            _rowid = that.stopsList.length + 1;

            if (!duplicateStops) {
                that.stopsList.push({
                    "rowid": "t" + _rowid,
                    "stpid": that.stpid,
                    "stpname": that.stpname,
                    "stptype": that.stptype,
                    "address": that.address,
                    "lat": that.lat,
                    "lon": that.lon,
                    "geoloc": (that.lat == "" ? "0.00" : that.lat) + "," + (that.lon == "" ? "0.00" : that.lon),
                    "radius": that.radius,
                    "rtid": that.rtid,
                    "isviewmap": true,
                    "isactive": true
                })

                that.addmarker(that.stopsList[that.stopsList.length - 1]);
            }

            that.resetStopsFields();

            setTimeout(function () {
                commonfun.orderstyle();
            }, 200);
        }
    }

    isViewMapShow(row) {
        var latlng = new google.maps.LatLng(row.lat, row.lon);
        // let mrk = this.markers[row.rowid];
        let cir = this.circles[row.rowid];

        if (row.isviewmap) {
            // mrk.setPosition(latlng);
            // cir.setPosition(latlng);
            // mrk.setMap(this.map);

            cir.setMap(this.map);

            this.map.setCenter(latlng);
            this.map.setZoom(12);

            // cir.setOptions({
            //     fillOpacity: 0.1,
            //     strokeOpacity: 0.8
            // });
        }
        else {
            // cir.setOptions({
            //     fillOpacity: 0,
            //     strokeOpacity: 0
            // });

            // mrk.setMap(null);
            cir.setMap(null);
        }
    }

    // Edit Stops

    editStopsList(row) {
        this.isedit = true;

        if (this.selectedStops !== undefined) {
            this.selectedStops.isviewmap = false;
            this.isViewMapShow(this.selectedStops);
        }

        this.selectedStops = row;
        row.isviewmap = true;
        this.isViewMapShow(row);

        this.stpid = row.stpid;
        this.stpname = row.stpname;
        this.stptype = row.stptype;
        this.address = row.address;
        this.lat = row.lat;
        this.lon = row.lon;
        this.radius = row.radius;

        var latlng = new google.maps.LatLng(this.lat, this.lon);
        let mrk = this.markers[row.rowid];

        mrk.setPosition(latlng);
        this.map.setCenter(latlng);
        this.map.setZoom(12);
    }

    // Edit Stops

    updateStopsList() {
        this.isedit = false;
        this.selectedStops.stpid = this.stpid;
        this.selectedStops.stpname = this.stpname;
        this.selectedStops.stptype = this.stptype;
        this.selectedStops.address = this.address;
        this.selectedStops.lat = this.lat;
        this.selectedStops.lon = this.lon;
        this.selectedStops.geoloc = this.lat + "," + this.lon;
        this.selectedStops.rtid = this.rtid;
        this.resetStopsFields();
        this.stptype = "";
        this.selectedStops = [];
    }

    // Delete Stops List

    deleteStopsList(row) {
        row.isactive = false;
    }

    // Active / Deactive Data

    active_deactiveStopsInfo() {
        var that = this;

        var act_deactstp = {
            "rtid": that.rtid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        this._rtservice.saveStopsInfo(act_deactstp).subscribe(data => {
            try {
                var dataResult = data.data;

                if (dataResult[0].funsave_stopsinfo.msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", dataResult[0].funsave_stpinfo.msg);
                }
                else {
                    that._msg.Show(messageType.error, "Error", dataResult[0].funsave_stpinfo.msg);
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            console.log(err);
        }, () => {
        });
    }

    // Save Stops Data

    saveStopsInfo() {
        var that = this;
        var _stopsList = [];

        if (that.rtid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Route Name");
            $(".rtname").focus();
        }
        else if (that.stopsList.length == 0) {
            that._msg.Show(messageType.error, "Error", "Fill atleast 1 Stops");
        }
        else {
            commonfun.loader();

            for (var i = 0; i < that.stopsList.length; i++) {
                var _slrow = that.stopsList[i];

                _stopsList.push({
                    "stpid": _slrow.stpid,
                    "stpname": _slrow.stpname,
                    "stptype": _slrow.stptype,
                    "address": _slrow.address,
                    "geoloc": (_slrow.lat == "" ? "0.00" : _slrow.lat) + "," + (_slrow.lon == "" ? "0.00" : _slrow.lon),
                    "radius": _slrow.radius,
                    "ordno": i + 1,
                    "isactive": _slrow.isactive
                })
            }

            var params = {
                "rtid": that.rtid,
                "rtname": that.rtname,
                "stops": _stopsList,
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid
            }

            this._rtservice.saveStopsInfo(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_stopsinfo;

                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that._router.navigateByUrl("/reload", { skipLocationChange: true }).then(() => {
                                that._router.navigate(['/transport/route/edit', that.rtid]);
                            })
                        }
                        else {
                            that.backViewData();
                        }
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
                    }

                    commonfun.loaderhide();
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
                commonfun.loaderhide();
            }, () => {
            });
        }
    }

    bindStopsOnMap() {
        for (let i = 0; i < this.stopsList.length; i++) {
            var element = this.stopsList[i];
            element.rowid = element.stpid;
            element.isviewmap = false;

            this.addmarker(element)
        }

        if (this.stopsList.length > 0) {
            this.boundtomap();
        }
    }

    private addmarker(stps) {
        let that = this;

        var populationOptions = {
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.1,
            map: that.map,
            draggable: false,
            editable: true,
            center: new google.maps.LatLng(stps.lat, stps.lon),
            radius: Math.sqrt(stps.radius) * 100
        };

        // Add the circle for this city to the map.

        var cityCircle = new google.maps.Circle(populationOptions);

        let vhmarker = new google.maps.Marker({
            position: {
                lat: stps.lat
                , lng: stps.lon
            },

            strokeColor: 'red',
            strokeWeight: 3,
            scale: 6,
            draggable: true,
            // icon: image,
            title: stps.stpname + ' (' + stps.address + ')',
            data: stps
        });

        vhmarker.info = new google.maps.InfoWindow({
            content: vhmarker.title
        });

        vhmarker.bindTo("position", cityCircle, "center");
        vhmarker.info.open(that.map, vhmarker);

        google.maps.event.addListener(vhmarker, 'dragend', function (event) {
            stps.lat = event.latLng.lat();
            stps.lon = event.latLng.lng();

            that.lat = event.latLng.lat();
            that.lon = event.latLng.lng();
            that.cdRef.detectChanges();

            // console.debug('final position is ' + event.latLng.lat() + ' / ' + event.latLng.lng());
        });

        google.maps.event.addListener(cityCircle, 'radius_changed', function () {
            that.radius = this.getRadius().toFixed(2);
            stps.radius = this.getRadius().toFixed(2);

            that.meterinkm();
            that.cdRef.detectChanges();
        })

        vhmarker.setMap(that.map);

        that.markers[stps.rowid] = vhmarker;
        that.circles[stps.rowid] = cityCircle;

        if (that.rtid != 0) {
            cityCircle.setMap(null);
        }
    }

    private removemarker(rowid) {
        let mrkr = this.markers[rowid];

        if (mrkr != null) {
            mrkr.setMap(null);
            // delete this.vhmarkers[vhid];
        }
    }

    private boundtomap() {
        var bounds = new google.maps.LatLngBounds();
        var that = this;

        Object.keys(this.markers).forEach(function (key) {
            let mr = that.markers[key];
            bounds.extend(mr.getPosition());
        });

        this.map.fitBounds(bounds);
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/transport/route']);
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
        
        this.subscribeParameters.unsubscribe();
    }
}