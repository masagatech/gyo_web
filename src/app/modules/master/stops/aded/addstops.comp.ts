import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StopsService } from '../../../../_services/stops/stp-service';
import { CommonService } from '../../../../_services/common/common-service' /* add reference for view file type */
import { MessageService, messageType } from '../../../../_services/messages/message-service';
import { LoginService } from '../../../../_services/login/login-service';
import { LoginUserModel } from '../../../../_model/user_model';

declare var google: any;

@Component({
    templateUrl: 'addstops.comp.html',
    providers: [CommonService]
})

export class AddStopsComponent implements OnInit {
    loginUser: LoginUserModel;

    enttDT: any = [];
    routesDT: any = [];

    enttid: number = 0;
    rtid: number = 0;
    rtname: string = "";

    stpid: number = 0;
    stpname: string = "";
    address: string = "";
    lat: string = "0.00";
    long: string = "0.00";

    stopsList: any = [];
    selectedStops: any = [];
    isedit: boolean = false;

    mode: string = "";
    isactive: boolean = true;

    private subscribeParameters: any;

    constructor(private _stopsservice: StopsService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _commonservice: CommonService) {
        this.loginUser = this._loginservice.getUser();

        this.fillEntityDropDown();
    }

    public ngOnInit() {

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
                that.rtname = $("#ddlRoutes option:selected").text();
            }
            else{
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
                "cuid": that.loginUser.ucode
            }

            this._stopsservice.saveRoutesInfo(savert).subscribe(data => {
                try {
                    var dataResult = data.data;
                    var msg = dataResult[0].funsave_routesinfo.msg;
                    var msgid = dataResult[0].funsave_routesinfo.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        that.enttid = 0;
                        that.rtid = 0;
                        that.rtname = "";
                        that.fillRoutesDropDown();
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
                // console.log("Complete");
            });
        }
    }

    // Fill Entity DropDown

    fillEntityDropDown() {
        var that = this;
        commonfun.loader();

        that._stopsservice.getStopsDetails({ "flag": "enttddl" }).subscribe(data => {
            try {
                that.enttDT = data.data;
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

    // Fill Route DropDown

    fillRoutesDropDown() {
        var that = this;
        commonfun.loader();

        that._stopsservice.getStopsDetails({ "flag": "rtddl", "enttid": that.enttid }).subscribe(data => {
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

    // Get Stops Data

    getStopsByRoute() {
        var that = this;
        commonfun.loader();

        that._stopsservice.getStopsDetails({ "flag": "byroute", "rtid": that.rtid }).subscribe(data => {
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

    getLatAndLong() {
        var that = this;
        commonfun.loader();

        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({ 'address': that.address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                that.lat = results[0].geometry.location.lat();
                that.long = results[0].geometry.location.lng();
            }
            else {
                that._msg.Show(messageType.error, "Error", "Couldn't find your Location");
            }

            commonfun.loaderhide();
        });
    }

    // Clear Fields

    resetStopsFields() {
        this.stpname = "";
        this.address = "";
        this.lat = "0.00";
        this.long = "0.00";
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
        else if (that.lat == "") {
            that._msg.Show(messageType.error, "Error", "Enter Lat");
        }
        else if (that.long == "") {
            that._msg.Show(messageType.error, "Error", "Enter Long");
        }
        else {
            var duplicateStops = that.isDuplicateStops();

            if (!duplicateStops) {
                that.stopsList.push({
                    "stpid": that.stpid,
                    "stpname": that.stpname,
                    "address": that.address,
                    "lat": that.lat != null ? "" : that.lat,
                    "long": that.long != null ? "" : that.long,
                    "geoloc": that.lat != null ? "" : that.lat + "," + that.long != null ? "" : that.long,
                    "rtid": that.rtid,
                    "isactive": true
                })
            }

            that.resetStopsFields();
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
        this.rtid = row.rtid;
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

        this._stopsservice.saveStopsInfo(act_deactstp).subscribe(data => {
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
            // console.log("Complete");
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
                    "isactive": _slrow.isactive,
                    "ordno": i + 1
                })
            }

            var savestp = {
                "rtid": that.rtid,
                "rtname": that.rtname,
                "cuid": that.loginUser.ucode,
                "stops": _stopsList
            }

            this._stopsservice.saveStopsInfo(savestp).subscribe(data => {
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
                // console.log("Complete");
            });
        }
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/stops']);
    }
}