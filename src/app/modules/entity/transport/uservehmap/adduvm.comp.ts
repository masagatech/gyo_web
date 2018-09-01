import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { UserVehicleMapService } from '@services/master';

@Component({
    templateUrl: 'adduvm.comp.html',
    styleUrls: ['adduvm.comp.css']
})

export class AddUserVehicleMapComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = 0;

    usersDT: any = [];
    uvmid: number = 0;
    uid: number = 0;
    uname: any = [];
    utype: string = "";
    enttid: number = 0;
    wsautoid: number = 0;
    selecteudUser: any = [];

    vehicleDT: any = [];
    autoid: number = 0;
    vehid: number = 0;
    vehname: string = "";
    vehregno: string = "";
    selectedvehicle: any = [];

    private clickedVehicle = { "attr": {} };

    userVehicleData: any = {};
    oldUserVehicleData: any = [];
    newUserVehicleData: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _autoservice: CommonService,
        private _uvmservice: UserVehicleMapService, private _loginservice: LoginService, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();
    }

    ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.closeonwindow = false; // do not close right bar on window click
        }, 100);
    }

    resetUserVehicleMap() {
        this.uvmid = 0;
        this.uid = 0;
        this.uname = "";
        this.utype = "";
        this.enttid = 0;
        this.wsautoid = 0;
        this.selecteudUser = [];
        this.autoid = 0;
        this.vehid = 0;
        this.vehregno = "";
        this.selectedvehicle = [];
        this.vehicleDT = [];

        this.clickedVehicle = { "attr": {} };
    }

    // Auto Completed User

    getUserData(event) {
        var that = this;
        let query = event.query;

        that._autoservice.getAutoData({
            "flag": "formapuser",
            "uid": that.loginUser.uid,
            "ucode": that.loginUser.ucode,
            "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid,
            "issysadmin": that.loginUser.issysadmin,
            "search": query
        }).subscribe(data => {
            that.usersDT = data.data;
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected User

    selectUserData(event, arg) {
        var that = this;
        
        that.uid = event.uid;
        that.uname = event.uname;
        that.utype = event.utype;
        that.enttid = event.enttid;
        that.wsautoid = event.wsautoid;

        that.getUserVehicleMap();
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
            that.usersDT = data.data;
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Vehicle

    selectVehicleData(event, arg) {
        this.autoid = event.value;
        this.vehid = event.vehid;
        this.vehname = event.vehname;
        this.vehregno = event.label;

        $("#divvehattr").attr("class", "hide");
        this.addVehicleDT();
    }

    // Check Duplicate Vehicle

    isDuplicateVehicle() {
        var that = this;

        for (var i = 0; i < that.vehicleDT.length; i++) {
            var field = that.vehicleDT[i];

            if (field.vehid == this.vehid) {
                this._msg.Show(messageType.error, "Error", "Duplicate Vehicle not Allowed");
                return true;
            }
        }

        return false;
    }

    addVehicleDT() {
        var that = this;
        var duplicateVehicle = that.isDuplicateVehicle();

        if (!duplicateVehicle) {
            that.vehicleDT.push({
                "autoid": that.autoid, "vehid": that.vehid, "vehname": that.vehname, "vehregno": that.vehregno,
                "attr": {}, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "isview": true, "isedit": true
            })
        }

        that.autoid = 0;
        that.vehid = 0;
        that.vehname = "";
        that.vehregno = "";
        that.selectedvehicle = [];

        $(".vehname input").focus();
    }

    deleteVehicle(row) {
        this.vehicleDT.splice(this.vehicleDT.indexOf(row), 1);
    }

    onVehicleClick(item: any) {
        $("#divvehattr").attr("class", "show");

        if (item.attr == undefined) {
            item.attr = {};
        }

        if (item.isedit) {
            $("#divattr input").removeAttr("disabled");
            $("#divattr button").removeAttr("disabled");
        }
        else {
            $("#divattr input").attr("disabled", "disabled");
            $("#divattr button").attr("disabled", "disabled");
        }

        this.clickedVehicle = item;
    }

    // Get Audit Parameter

    getAuditData(selectedVehicle) {
        var that = this;

        var _advance = [];
        var _auditdt = [];

        for (var i = 0; i < that.vehicleDT.length; i++) {
            _advance.push({
                "autoid": that.vehicleDT[i].autoid, "vehid": that.vehicleDT[i].vehid, "vehname": that.vehicleDT[i].vehname,
                "vehregno": that.vehicleDT[i].vehregno, "enttid": that.vehicleDT[i].enttid, "wsautoid": that.vehicleDT[i].wsautoid,
                "attr": that.vehicleDT[i].attr
            })
        }

        _auditdt = [
            { "key": "User ID", "val": that.uid, "fldname": "uid", "fldtype": "text" },
            { "key": "User Name", "val": that.uname, "fldname": "uid", "fldtype": "text" },
            { "key": "User Type", "val": that.utype, "fldname": "utype", "fldtype": "text" },
            { "key": "Vehicle IDs", "val": selectedVehicle, "fldname": "vehid", "fldtype": "text" },
            { "key": "Advance", "val": _advance, "fldname": "advance", "fldtype": "table" },
        ]

        return _auditdt;
    }

    // Audit Log

    saveAuditLog(id, name, oldval, newval) {
        var that = this;

        var _oldvaldt = [];
        var _newvaldt = [];

        for (var i = 0; i < Object.keys(oldval).length; i++) {
            _oldvaldt.push(that.oldUserVehicleData.filter(a => a.fldname == Object.keys(oldval)[i]));
        }

        for (var i = 0; i < Object.keys(newval).length; i++) {
            _newvaldt.push(that.newUserVehicleData.filter(a => a.fldname == Object.keys(newval)[i]));
        }

        var dispflds = [{ "key": "User Name", "val": name }];

        var auditparams = {
            "loginsessionid": that.loginUser.sessiondetails.sessionid, "mdlcode": "uservehiclemap", "mdlname": "User Vehicle Map",
            "id": id, "dispflds": dispflds, "oldval": _oldvaldt, "newval": _newvaldt, "ayid": that._enttdetails.ayid,
            "enttid": that.enttid, "wsautoid": that.wsautoid, "createdby": that.loginUser.ucode
        };

        that._autoservice.saveAuditLog(auditparams);
    }

    // Get Save Parameter

    getUserVehicleParams(selveh) {
        var that = this;
        var _advance = [];

        for (var i = 0; i < that.vehicleDT.length; i++) {
            _advance.push({
                "autoid": that.vehicleDT[i].autoid, "vehid": that.vehicleDT[i].vehid, "vehname": that.vehicleDT[i].vehname,
                "vehregno": that.vehicleDT[i].vehregno, "enttid": that.vehicleDT[i].enttid, "wsautoid": that.vehicleDT[i].wsautoid,
                "attr": that.vehicleDT[i].attr
            })
        }

        var params = {
            "uid": that.uid,
            "utype": that.utype,
            "vehid": selveh,
            "isadv": false,
            "advance": _advance,
            "cuid": that.loginUser.ucode,
            "enttid": that.enttid,
            "wsautoid": that.wsautoid
        }

        return params;
    }

    // Validation Field

    isValidaUserVehicle(newval, selectedVehicle) {
        var that = this;

        if (that.uid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter User");
            $(".uname input").focus();
        }

        // if (that.uvmid !== 0) {
        //     if (JSON.stringify(newval) == "{}") {
        //         that._msg.Show(messageType.warn, "Warning", "No any Changes");
        //         return false;
        //     }
        // }

        if (selectedVehicle.length === 0) {
            that._msg.Show(messageType.error, "Error", "Select Atleast 1 Vehicle");
            return true;
        }

        return true;
    }

    saveUserVehicleMap() {
        var that = this;
        var isvalid: boolean = false;

        var selectedVehicle: string[] = [];
        selectedVehicle = Object.keys(that.vehicleDT).map(function (k) { return that.vehicleDT[k].vehid });

        var params = that.getUserVehicleParams(selectedVehicle);
        that.newUserVehicleData = that.getAuditData(selectedVehicle);

        var newval = that._autoservice.getDiff2Arrays(that.userVehicleData, params);
        var oldval = that._autoservice.getDiff2Arrays(params, that.userVehicleData);

        isvalid = that.isValidaUserVehicle(newval, selectedVehicle);

        if (isvalid) {
            that._uvmservice.saveUserVehicleMap(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_uservehmap;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;
                    var uvmid = dataResult.uvmid;

                    if (msgid != "-1") {
                        if (msgid == "1") {
                            that._msg.Show(messageType.success, "Success", msg);
                        }
                        else {
                            that.saveAuditLog(uvmid, that.uname, oldval, newval);
                            that._msg.Show(messageType.success, "Success", msg);
                        }

                        that.resetUserVehicleMap();
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
                    }
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
            }, () => {
            });
        }
    }

    getUserVehicleMap() {
        var that = this;

        that._uvmservice.getUserVehicleMap({
            "flag": "mapping", "uid": that.uid, "utype": that.utype, "enttid": that._enttdetails.enttid
        }).subscribe(data => {
            try {
                that.vehicleDT = data.data;

                var selectedVehicle: string[] = [];
                selectedVehicle = Object.keys(that.vehicleDT).map(function (k) { return that.vehicleDT[k].vehid });

                that.uvmid = data.data.length > 0 ? data.data[0].uvmid : 0;
                that.userVehicleData = that.getUserVehicleParams(selectedVehicle);
                that.oldUserVehicleData = that.getAuditData(selectedVehicle);
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
        })
    }

    ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.rightSideBar.closeonwindow = true;
        $.AdminBSB.leftSideBar.Open();
    }
}