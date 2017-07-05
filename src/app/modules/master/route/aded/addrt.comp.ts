import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { RouteService } from '@services/master';
import { LoginUserModel, Globals } from '@models';
import { GMap } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;

@Component({
    templateUrl: 'addrt.comp.html',
    providers: [CommonService]
})

export class AddRouteComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    marker: any;
    @ViewChild("gmap")
    _gmap: GMap;

    private options: any;
    private overlays: any[];
    private map: any;

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    routesDT: any = [];
    rtid: number = 0;
    rtname: string = "";

    stpid: number = 0;
    stpname: string = "";
    address: string = "";
    lat: number = 0.00;
    long: number = 0.00;

    stopsList: any = [];
    selectedStops: any = [];
    isedit: boolean = false;

    mode: string = "";
    isactive: boolean = true;

    private subscribeParameters: any;

    constructor(private _rtservice: RouteService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService, private cdRef: ChangeDetectorRef) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".enttname input").focus();
        }, 100);

        this.editRoutes();

        this.options = {
            center: { lat: this.lat, lng: this.long },
            zoom: 18
        };

        this.marker = new google.maps.Marker({ position: { lat: this.lat, lng: this.long }, title: "", draggable: true });
        this.overlays = [this.marker];
    }

    private ovrldrag(e) {
        this.lat = this.marker.position.lat();
        this.long = this.marker.position.lng();
    }

    // get lat and long by address form google map

    getLatAndLong() {
        let that = this;
        commonfun.loader("#address");

        let geocoder = new google.maps.Geocoder();
        // let address = "Chakkinaka, Kalyan (E)";

        geocoder.geocode({ 'address': that.address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                that.lat = results[0].geometry.location.lat();
                that.long = results[0].geometry.location.lng();

                var latlng = new google.maps.LatLng(that.lat, that.long);
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
        this.long = e.latLng.lng();
        var latlng = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
        this.marker.setPosition(latlng);
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

        this.fillRoutesDropDown();
    }

    // Open Popup For Saving Routes

    openRoutesPopup() {
        var that = this;

        if (that.enttid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Entity Name");
            $(".enttname").focus();
        }
        else {
            if (that.rtid !== 0) {
                that.rtname = $("#ddlRoutes option:selected").text().trim();
            }
            else {
                that.rtname = "";
            }

            $("#addRoutesModal").modal('show');
            $(".rtname").focus();
        }
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
                "enttid": that.enttid,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._wsdetails.wsautoid
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

        that._rtservice.getStopsDetails({ "flag": "rtddl", "enttid": that.enttid }).subscribe(data => {
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
                            that.enttid = _routedata[0].enttid;
                            that.enttname = _routedata[0].enttname;
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
                if (Cookie.get('_enttnm_') != null) {
                    that.enttid = parseInt(Cookie.get('_enttid_'));
                    that.enttname = Cookie.get('_enttnm_');

                    that.fillRoutesDropDown();
                }

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

    // Copy Pick Up and Drop Address and Lat Lon from Residental Address and Lat Long

    // Clear Fields

    resetAllStopsFields() {
        this.enttid = 0;
        this.enttname = "";
        this.rtid = 0;
        this.rtname = "";

        this.stpid = 0;
        this.stpname = "";
        this.address = "";
        this.lat = 0.00;
        this.long = 0.00;
    }

    resetStopsFields() {
        this.stpid = 0;
        this.stpname = "";
        this.address = "";
        this.lat = 0.00;
        this.long = 0.00;
    }

    // add stops list

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

        if (that.rtid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Routes Name");
        }
        else if (that.stpname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Stops Name");
        }
        else if (that.address == "") {
            that._msg.Show(messageType.error, "Error", "Enter Address");
        }
        else if (that.lat == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Lat");
        }
        else if (that.long == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Long");
        }
        else {
            var duplicateStops = that.isDuplicateStops();

            if (!duplicateStops) {
                that.stopsList.push({
                    "stpid": that.stpid,
                    "stpname": that.stpname,
                    "address": that.address,
                    "lat": that.lat,
                    "long": that.long,
                    "geoloc": that.lat != 0 ? "0.00" : that.lat + "," + that.long != null ? "0.00" : that.long,
                    "rtid": that.rtid,
                    "isactive": true
                })

                console.log(that.lat != null ? "0.00" : that.lat + "," + that.long != null ? "0.00" : that.long);
            }

            that.resetStopsFields();

            setTimeout(function () {
                commonfun.orderstyle();
            }, 200);
        }
    }

    // Edit Stops

    editStopsList(row) {
        this.isedit = true;
        this.selectedStops = row;
        this.stpid = row.stpid;
        this.stpname = row.stpname;
        this.address = row.address;
        this.lat = row.lat;
        this.long = row.long;

        if (this.lat.toString() != "0" && this.lat.toString() != "") {
            var latlng = new google.maps.LatLng(this.lat, this.long);
            this.marker.setPosition(latlng);
            this._gmap.map.setCenter(latlng);
        }
    }

    // Edit Stops

    updateStopsList() {
        this.isedit = false;
        this.selectedStops.stpid = this.stpid;
        this.selectedStops.stpname = this.stpname;
        this.selectedStops.address = this.address;
        this.selectedStops.lat = this.lat;
        this.selectedStops.long = this.long;
        this.selectedStops.geoloc = this.lat + "," + this.long;
        this.selectedStops.rtid = this.rtid;
        this.resetStopsFields();
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

        if (that.enttid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Entity Name");
            $(".enttname").focus();
        }
        else if (that.rtid == 0) {
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
                    "address": _slrow.address,
                    "geoloc": _slrow.geoloc !== undefined ? _slrow.lat + "," + _slrow.long : _slrow.geoloc,
                    "rtid": _slrow.rtid,
                    "cuid": that.loginUser.ucode,
                    "ordno": i + 1,
                    "wsautoid": that._wsdetails.wsautoid,
                    "isactive": _slrow.isactive
                })
            }

            var savestp = {
                "rtid": that.rtid,
                "rtname": that.rtname,
                "stops": _stopsList
            }

            this._rtservice.saveStopsInfo(savestp).subscribe(data => {
                try {
                    var dataResult = data.data;
                    var msg = dataResult[0].funsave_stopsinfo.msg;
                    var msgid = dataResult[0].funsave_stopsinfo.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            //that.resetStopsFields();
                            that.getStopsByRoute();
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

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/route']);
    }
}
