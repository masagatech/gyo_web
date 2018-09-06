import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { VehicleService } from '@services/master';

@Component({
    templateUrl: 'addtpi.comp.html'
})

export class ThirdPartyIntegrationComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    vehicleDT: any = [];
    vehid: number = 0;
    vehname: string = "";
    vehregno: string = "";
    imei: string = "";
    selectedvehicle: any = [];

    tracktypeDT: any = [];

    vehicleData: any = [];
    oldVehicleData: any = [];
    newVehicleData: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _vehservice: VehicleService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
    }

    public ngOnInit() {

    }

    // Auto Completed Vehicle

    getVehicleData(event) {
        var that = this;
        let query = event.query;

        that._autoservice.getAutoData({
            "flag": "vehicle",
            "uid": that.loginUser.uid,
            "ucode": that.loginUser.ucode,
            "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid,
            "issysadmin": that.loginUser.issysadmin,
            "search": query
        }).subscribe(data => {
            that.vehicleDT = data.data;
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Vehicle

    selectVehicleData(event, arg) {
        this.vehid = event.vehid;
        this.vehname = event.vehname;
        this.vehregno = event.vehregno;
        this.imei = event.imei;

        this.getThirdPartyIntegration();
    }

    // Fill Track Type Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._vehservice.getVehicleDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.tracktypeDT = data.data.filter(a => a.group == "tracktype");
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide();
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    // Get Audit Parameter

    getAuditParams(trktype) {
        var that = this;
        var _auditdt = [];

        _auditdt = [
            { "key": "Vehicle Name", "val": that.vehname, "fldname": "vehname", "fldtype": "text" },
            { "key": "Registration No", "val": that.vehregno, "fldname": "vehregno", "fldtype": "text" },
            { "key": "IMEI No", "val": that.imei, "fldname": "imei", "fldtype": "text" },
            { "key": "Track Type", "val": trktype, "fldname": "trktype", "fldtype": "text" }
        ]

        return _auditdt;
    }

    // Audit Log

    saveAuditLog(id, name, oldval, newval) {
        var that = this;

        var _oldvaldt = [];
        var _newvaldt = [];

        for (var i = 0; i < Object.keys(oldval).length; i++) {
            _oldvaldt.push(that.oldVehicleData.filter(a => a.fldname == Object.keys(oldval)[i]));
        }

        for (var i = 0; i < Object.keys(newval).length; i++) {
            _newvaldt.push(that.newVehicleData.filter(a => a.fldname == Object.keys(newval)[i]));
        }

        if (_newvaldt.length > 0) {
            var dispflds = [{ "key": "Vehicle Name", "val": name }];

            var auditparams = {
                "loginsessionid": that.loginUser.sessiondetails.sessionid, "mdlcode": "tpi", "mdlname": "Third Party Integration",
                "id": id, "dispflds": dispflds, "oldval": _oldvaldt, "newval": _newvaldt, "ayid": that._enttdetails.ayid,
                "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "createdby": that.loginUser.ucode
            };

            that._autoservice.saveAuditLog(auditparams);
        }
    }

    // Get Save Parameter

    getVehicleParams(trktype) {
        var that = this;

        var params = {
            "flag": "trktype",
            "vehid": that.vehid,
            "trktype": trktype,
            "cuid": that.loginUser.ucode
        }

        return params;
    }

    // Validation Third Party Integration

    isValidateTPI(trktype, newval) {
        var that = this;

        if (that.vehid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Vehicle");
            return false;
        }
        if (trktype == "") {
            that._msg.Show(messageType.error, "Error", "Select Track Type");
            return false;
        }
        if (JSON.stringify(newval) == "{}") {
            that._msg.Show(messageType.warn, "Warning", "No any Changes");
            return false;
        }

        return true;
    }

    // Save Third Party Integration

    saveThirdPartyIntegration() {
        var that = this;

        var trktype = "";
        var pushcl = [];

        $("#track").find("input[type=checkbox]").each(function () {
            if (this.checked) {
                pushcl.push($(this).val())
            }
        });

        trktype = JSON.stringify(pushcl).replace("[", "{").replace("]", "}");

        var params = that.getVehicleParams(trktype);
        that.newVehicleData = that.getAuditParams(trktype);

        var newval = that._autoservice.getDiff2Arrays(that.vehicleData, params);
        var oldval = that._autoservice.getDiff2Arrays(params, that.vehicleData);

        var isvalid = that.isValidateTPI(trktype, newval);

        if (isvalid) {
            commonfun.loader();

            that._vehservice.saveVehicleInfo(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_vehicleinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;
                    var vehid = dataResult.vehid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        try {
                            // Saving Data To VTS

                            that.saveToVTS({
                                "vhid": that.imei,
                                "pushcl": pushcl
                            })
                        }
                        catch (e) {
                            that._msg.Show(messageType.error, "Error", e);
                        }

                        that.saveAuditLog(vehid, that.vehname, oldval, newval);
                        that.resetTPIFields();
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
                console.log(err);
                commonfun.loaderhide();
            }, () => {
            });
        }
    }

    saveToVTS(vhdata) {
        var that = this;

        that._vehservice.saveVehicleInfoToVts(vhdata).subscribe(data => {

        }, err => {

        }, () => {
        });
    }

    getThirdPartyIntegration() {
        var that = this;
        commonfun.loader();

        var trktype = "";
        var pushcl = [];

        that._vehservice.getVehicleDetails({
            "flag": "trktype", "vehid": that.vehid
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    var trktypedt = data.data[0].trktype;

                    if (trktypedt.length > 0) {
                        that.clearCheckboxFields();

                        for (var i = 0; i < trktypedt.length; i++) {
                            $("#track").find("#" + trktypedt[i]).prop('checked', true);
                        }

                        $("#track").find("input[type=checkbox]").each(function () {
                            if (this.checked) {
                                pushcl.push($(this).val())
                            }
                        });

                        trktype = JSON.stringify(pushcl).replace("[", "{").replace("]", "}");

                        that.vehicleData = that.getVehicleParams(trktype);
                        that.oldVehicleData = that.getAuditParams(trktype);
                    }
                    else {
                        that.clearCheckboxFields();
                    }
                }
                else {
                    that.clearCheckboxFields();
                }

                commonfun.loaderhide();
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {
        });
    }

    resetTPIFields() {
        var that = this;

        that.vehid = 0;
        that.vehname = "";
        that.vehregno = "";
        that.imei = "";
        that.selectedvehicle = {};
        that.clearCheckboxFields();
    }

    clearCheckboxFields() {
        $("#track input[type=checkbox]").prop('checked', false);
    }

    ngOnDestroy() {

    }
}
