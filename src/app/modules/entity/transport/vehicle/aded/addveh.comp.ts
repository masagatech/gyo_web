import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { VehicleService } from '@services/master';

@Component({
    templateUrl: 'addveh.comp.html'
})

export class AddVehicleComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    vehtypeDT: any = [];
    devtypeDT: any = [];
    d1strDT: any = [];

    isotherentt: boolean = false;

    paramsid: number = 0;
    ownenttid: number = 0;
    autoid: number = 0;
    vehid: number = 0;
    getimei: string = "";
    getvehregno: string = "";
    imei: string = "";
    vehregno: string = "";
    vehregnoPattern = "^[A-Z]{2}-[0-9]{2}-[A-Z]{1,2}-[0-9]{1,4}$";
    vehtype: string = "";
    vehtypename: string = "";
    vehname: string = "";
    vehmake: string = "";
    vehmodel: string = "";
    capacity: number = 0;
    vehcond: string = "";
    vehfclt: string = "";

    frmdt: any = "";
    todt: any = "";
    devtype: string = "";
    devtypename: string = "";
    simno: string = "";
    speedAllow: number = 0;
    d1str: string = "";
    d1strname: string = "";
    isowner: boolean = false;

    schoolDT: any = [];

    mode: string = "";
    isactive: boolean = true;
    isprivate: boolean = true;
    dtlsmode: string = "";

    @ViewChild('regno') vehicle: ElementRef;

    isadd: boolean = false;
    isedit: boolean = false;
    isdetails: boolean = false;

    isaddveh: boolean = false;
    iseditveh: boolean = false;
    isdeleteveh: boolean = false;

    vehicleData: any = [];
    oldVehicleData: any = [];
    newVehicleData: any = [];

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _vehservice: VehicleService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getActionRights();

        this.isadd = _router.url.indexOf("/add") > -1;
        this.isedit = _router.url.indexOf("/edit") > -1;
        this.isdetails = _router.url.indexOf("/details") > -1;
    }

    public ngOnInit() {
        this.getVehicleDetails();
    }

    // Get Action Rights

    getActionRights() {
        var that = this;
        commonfun.loader();

        var params = {
            "flag": "menurights", "entttype": that._enttdetails.entttype, "uid": that.loginUser.uid,
            "utype": that.loginUser.utype, "mcode": "veh"
        };

        that._autoservice.getMenuDetails(params).subscribe(data => {
            that.isaddveh = data.data.filter(a => a.maction == "add")[0].isrights;
            that.iseditveh = data.data.filter(a => a.maction == "edit")[0].isrights;
            that.isdeleteveh = data.data.filter(a => a.maction == "delete")[0].isrights;
        }, err => {
            console.log(err);
        }, () => {
            // console.log("Complete");
        });
    }

    // Set From Date and To Date

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    setFromDateAndToDate() {
        var date = new Date();
        var before1month = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        this.frmdt = this.formatDate(before1month);
        this.todt = this.formatDate(today);
    }

    // Fill Vehicle Type Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._vehservice.getVehicleDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.vehtypeDT = data.data.filter(a => a.group == "vehicletype");
                that.devtypeDT = data.data.filter(a => a.group == "devicetype");
                that.d1strDT = data.data.filter(a => a.group == "d1str");
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

    // Active / Deactive Data

    active_deactiveVehicleInfo() {
        var that = this;
        var params = {};

        if (that.isowner) {
            params = {
                "vehid": that.vehid,
                "mode": that.mode
            }
        }
        else {
            params = {
                "vemid": that.autoid,
                "dtlsmode": that.dtlsmode
            }
        }

        that._vehservice.saveVehicleInfo(params).subscribe(data => {
            try {
                var dataResult = data.data[0].funsave_vehicleinfo;
                var msg = dataResult.msg;
                var msgid = dataResult.msgid;

                if (msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", msg);
                    that.getVehicleDetails();
                }
                else {
                    that._msg.Show(messageType.error, "Error", msg);
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

    // Delete Vehicle

    public deleteVehicles() {
        var that = this;
        var params = {};

        that._autoservice.confirmmsgbox("Your record has been deleted", "Are you sure, you want to delete ?", "Your record is safe", function (e) {
            if (that.isowner) {
                params = {
                    "vehid": that.vehid,
                    "mode": "delete"
                }
            }
            else {
                params = {
                    "vemid": that.autoid,
                    "dtlsmode": "delete"
                }
            }

            that._vehservice.saveVehicleInfo(params).subscribe(data => {
                try {
                    var dataResult = data.data;
                    that.backViewData();
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }
            }, err => {
                console.log(err);
            }, () => {
                // console.log("Complete");
            });
        });
    }

    // Clear Fields

    resetVehicleFields() {
        this.autoid = 0;
        this.vehid = 0;
        this.imei = this.getimei;
        this.vehregno = this.getvehregno;
        this.vehtype = "";
        this.vehname = "";
        this.vehmake = "";
        this.vehmodel = "";
        this.capacity = 0;
        this.vehcond = "";
        this.vehfclt = "";
        this.devtype = "";
        this.simno = "";
        this.speedAllow = 0;
        this.d1str = "";
        this.isprivate = false;
        this.schoolDT = [];

        this.setFromDateAndToDate();
        this.enabledVehicleFields();
    }

    enabledVehicleFields() {
        $(".imei").removeAttr("disabled");
        $(".vehregno").removeAttr("disabled");

        $(".hidewhen input").removeAttr("disabled");
        $(".hidewhen select").removeAttr("disabled");
    }

    disabledVehicleFields() {
        $(".imei").attr("disabled", "disabled");
        $(".vehregno").attr("disabled", "disabled");

        $(".hidewhen input").attr("disabled", "disabled");
        $(".hidewhen select").attr("disabled", "disabled");
    }

    refreshVehicles() {
        this.resetVehicleFields();
        this.getimei = "";
        this.getvehregno = "";
    }

    // Validation Fields

    isValidateVehicle(newval) {
        var that = this;
        var _vehregno = $("#invalidvehregno span").html();

        if (that.imei == "") {
            that._msg.Show(messageType.error, "Error", "Enter IMEI");
            $(".imei").focus();
            return false;
        }
        if (that.vehregno == "") {
            that._msg.Show(messageType.error, "Error", "Enter Vehicle Registration No");
            $(".vehregno").focus();
            return false;
        }
        if (_vehregno == "Not Valid") {
            that._msg.Show(messageType.error, "Error", "Invalid Vehicle Registration No");
            $(".vehregno").focus();
            return false;
        }
        if (that.vehname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Vehicle Name");
            $(".vehname").focus();
            return false;
        }
        if (that.vehtype == "") {
            that._msg.Show(messageType.error, "Error", "Select Vehicle Type");
            $(".vehtype").focus();
            return false;
        }
        if (that.capacity == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Capacity");
            $(".capacity").focus();
            return false;
        }

        if (that.devtype == "") {
            that._msg.Show(messageType.error, "Error", "Enter Device Type");
            $(".devtype").focus();
            return false;
        }
        if (that.simno == "") {
            that._msg.Show(messageType.error, "Error", "Enter SIM No");
            $(".simno").focus();
            return false;
        }
        if (that.speedAllow.toString() == "") {
            that._msg.Show(messageType.error, "Error", "Enter SIM No");
            $(".simno").focus();
            return false;
        }
        if (that.autoid !== 0) {
            if (JSON.stringify(newval) == "{}") {
                that._msg.Show(messageType.warn, "Warning", "No any Changes");
                return false;
            }
        }

        return true;
    }

    // Get Audit Parameter

    getAuditParams(ddltype) {
        var that = this;

        var _ownenttdt = [];
        var _auditdt = [];

        if (that.isotherentt) {
            that.schoolDT.push({
                "schid": that._enttdetails.enttid, "schname": that._enttdetails.enttname,
                "wsid": that._enttdetails.wsautoid, "wsname": that._enttdetails.wsname,
                "isowner": true
            })

            that.isotherentt = false;
        }

        _ownenttdt = that.schoolDT.filter(a => a.isowner == true);

        _auditdt = [
            { "key": "Vehicle Name", "val": that.vehname, "fldname": "vehname", "fldtype": "text" },
            { "key": "Registartion No", "val": that.vehregno, "fldname": "vehregno", "fldtype": "text" },
            { "key": "IMEI No", "val": that.imei, "fldname": "imei", "fldtype": "text" },
            { "key": "SIM No", "val": that.simno, "fldname": "simno", "fldtype": "text" },
            { "key": "Device Type", "val": ddltype == "old" ? that.devtypename : $("#devtype option:selected").text().trim(), "fldname": "devtype", "fldtype": "ddl" },
            { "key": "Vehicle Type", "val": ddltype == "old" ? that.vehtypename : $("#vehtype option:selected").text().trim(), "fldname": "vehtype", "fldtype": "ddl" },
            { "key": "Vehicle Make", "val": that.vehmake, "fldname": "vehmake", "fldtype": "text" },
            { "key": "Vehicle Model", "val": that.vehmodel, "fldname": "vehmodel", "fldtype": "text" },
            { "key": "Capacity", "val": that.capacity, "fldname": "capacity", "fldtype": "text" },
            { "key": "Vehicle Condition", "val": that.vehcond, "fldname": "vehcond", "fldtype": "text" },
            { "key": "Vehicle Facility", "val": that.vehfclt, "fldname": "vehfclt", "fldtype": "text" },
            { "key": "Vehicle Speed", "val": that.speedAllow, "fldname": "vehspeed", "fldtype": "text" },
            { "key": "From Date", "val": that.frmdt, "fldname": "frmdt", "fldtype": "date" },
            { "key": "To Date", "val": that.todt, "fldname": "todt", "fldtype": "date" },
            { "key": "D1 Function", "val": that.d1str == "" ? {} : { "d1str": that.d1str }, "fldname": "extra", "fldtype": "table" },
            { "key": "Other Entity", "val": that.schoolDT, "fldname": "othenttids", "fldtype": "table" },
            { "key": "Owner Entity", "val": _ownenttdt, "fldname": "vementtid", "fldtype": "table" }
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
                "loginsessionid": that.loginUser.sessiondetails.sessionid, "mdlcode": "vehicle", "mdlname": "Vehicle",
                "id": id, "dispflds": dispflds, "oldval": _oldvaldt, "newval": _newvaldt, "ayid": that._enttdetails.ayid,
                "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "createdby": that.loginUser.ucode
            };

            that._autoservice.saveAuditLog(auditparams);
        }
    }

    // Get Save Parameter

    getVehicleParams(selownerentt) {
        var that = this;

        var params = {
            "vemid": that.autoid,
            "vehid": that.vehid,
            "vehtype": that.vehtype,
            "vehname": that.vehname,
            "vehregno": that.vehregno,
            "imei": that.imei,
            "simno": that.simno,
            "vehmake": that.vehmake,
            "vehmodel": that.vehmodel,
            "capacity": that.capacity,
            "vehcond": that.vehcond,
            "vehfclt": that.vehfclt,
            "vehspeed": parseInt("" + that.speedAllow),
            "istrack": true,
            "devtype": that.devtype,
            "frmdt": that.frmdt,
            "todt": that.todt,
            "extra": that.d1str == "" ? {} : { "d1str": that.d1str },
            "mode": "",
            "enttid": that._enttdetails.enttid,
            "ownenttid": that._enttdetails.enttid,
            "vementtid": selownerentt.toString().replace("[", "").replace("]", ""),
            "wsautoid": that._enttdetails.wsautoid,
            "cuid": that.loginUser.ucode,
            "isactive": that.isactive,
            "isprivate": that.isprivate
        }

        return params;
    }

    // Save Vehicle

    saveVehicleInfo() {
        var that = this;

        var _enttdata = that.schoolDT.filter(a => a.isowner == true);

        var selownerentt: string[] = [];
        selownerentt = Object.keys(_enttdata).map(function (k) { return _enttdata[k].schid });

        var params = that.getVehicleParams(selownerentt);
        that.newVehicleData = that.getAuditParams("new");

        var newval = that._autoservice.getDiff2Arrays(that.vehicleData, params);
        var oldval = that._autoservice.getDiff2Arrays(params, that.vehicleData);

        var isvalid = that.isValidateVehicle(newval);

        if (isvalid) {
            commonfun.loader();

            that._vehservice.saveVehicleInfo(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_vehicleinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;
                    var autoid = dataResult.autoid;
                    var vehid = dataResult.vehid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        try {
                            // Saving Data To VTS

                            that.saveToVTS({
                                "vtsid": vehid,
                                "vhid": params.imei,
                                "vhname": params.vehregno,
                                "alwspeed": params.vehspeed,
                                "vhd": {
                                    "vehregno": that.vehregno,
                                    "vehtype": that.vehtype,
                                    "vehmake": that.vehmake,
                                    "vehmdl": that.vehmodel,
                                    "simno": that.simno,
                                    "imei": that.imei,
                                    "capacity": that.capacity,
                                    "vehcond": that.vehcond,
                                    "vehfclt": that.vehfclt,
                                    "d1str": that.d1str
                                }
                            })
                        }
                        catch (e) {
                            that._msg.Show(messageType.error, "Error", e);
                        }

                        if (msgid === "1") {
                            that.refreshVehicles();
                        }
                        else {
                            that.saveAuditLog(autoid, that.vehname, oldval, newval);
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

    getVehicleDetails() {
        var that = this;

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.paramsid = params['id'];
                that.getVehicleByID(that.paramsid);
            }
            else {
                that.getVehicleByIMEI(that.getimei, that.getvehregno);
            }
        });
    }

    // Get Vehicle Data By ID

    getVehicleByID(autoid) {
        var that = this;
        commonfun.loader();

        that._vehservice.getVehicleDetails({
            "flag": "edit",
            "id": autoid,
            "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                if (data.data.length == 0) {
                    that.refreshVehicles();
                }
                else {
                    var _vehdata = data.data[0];

                    that.ownenttid = _vehdata.ownenttid;
                    that.autoid = _vehdata.autoid;
                    that.vehid = _vehdata.vehid;
                    that.getimei = _vehdata.imei;
                    that.getvehregno = _vehdata.vehregno;
                    that.imei = _vehdata.imei;
                    that.vehregno = _vehdata.vehregno;
                    that.simno = _vehdata.simno;
                    that.vehtype = _vehdata.vehicletype;
                    that.vehname = _vehdata.vehiclename;
                    that.vehmake = _vehdata.vehiclemake;
                    that.vehmodel = _vehdata.vehiclemodel;
                    that.capacity = _vehdata.capacity;
                    that.vehcond = _vehdata.vehiclecondition;
                    that.vehfclt = _vehdata.vehiclefacility;
                    that.frmdt = _vehdata.frmdt;
                    that.todt = _vehdata.todt;
                    that.devtype = _vehdata.devtype;
                    that.devtypename = _vehdata.devtypename;
                    that.speedAllow = _vehdata.vhspeed;
                    that.d1str = _vehdata.d1str;
                    
                    that.isprivate = _vehdata.isprivate;
                    that.isactive = _vehdata.isactive;
                    that.isowner = _vehdata.isowner;
                    that.mode = _vehdata.mode;
                    that.dtlsmode = _vehdata.dtlsmode;

                    that.schoolDT = _vehdata.schooldt;

                    var _enttdata = that.schoolDT.filter(a => a.isowner == true);

                    var _schrow = null;
                    var _selschrow = null;
                    var _ownenttids = null;

                    for (var i = 0; i < that.schoolDT.length; i++) {
                        _schrow = null;
                        _schrow = that.schoolDT[i];

                        if (_schrow != null) {
                            _ownenttids = null;
                            _ownenttids = _vehdata.ownenttids;

                            if (_ownenttids != null) {
                                for (var j = 0; j < _ownenttids.length; j++) {
                                    _selschrow = null;
                                    _selschrow = _ownenttids[j];

                                    if (_schrow.schid == _selschrow) {
                                        _schrow.isowner = true;
                                    }
                                }
                            }
                        }
                    }

                    if (that.isdetails) {
                        that.disabledVehicleFields();
                        $('.vehname').prop("disabled", "disabled");
                    }
                    else {
                        if (that.isowner) {
                            $(".getimei").removeAttr("disabled");
                            $(".getvehregno").removeAttr("disabled");
                            that.enabledVehicleFields();
                        }
                        else {
                            $(".getimei").attr("disabled", "disabled");
                            $(".getvehregno").attr("disabled", "disabled");
                            that.disabledVehicleFields();
                        }

                        var selownerentt: string[] = [];
                        selownerentt = Object.keys(_enttdata).map(function (k) { return _enttdata[k].schid });

                        that.vehicleData = that.getVehicleParams(selownerentt);
                        that.oldVehicleData = that.getAuditParams("old");

                        $(".vehname").removeAttr("disabled");
                    }
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

    // Get Vehicle Data By IMEI

    getVehicleByIMEI(imei, vehregno) {
        var that = this;
        commonfun.loader();

        that._vehservice.getVehicleDetails({
            "flag": "byimei",
            "imei": imei,
            "vehregno": vehregno,
            "enttid": that._enttdetails.enttid
        }).subscribe(data => {
            try {
                var _status = data.data[0].status;
                var _isexists = data.data[0].isexists;
                var _msg = data.data[0].msg;
                var _vehdata = data.data[0].vehdata;
                var _enttdata = data.data[0]._enttdata;

                if (_vehdata == null || _vehdata == undefined) {
                    that.resetVehicleFields();
                }
                else {
                    if (_status == false) {
                        that._msg.Show(messageType.error, "Error", _msg);

                        if (_isexists) {
                            that.getimei = "";
                            that.getvehregno = "";
                        }

                        that.resetVehicleFields();
                    }
                    else {
                        that.disabledVehicleFields();

                        that.autoid = _vehdata.autoid;
                        that.vehid = _vehdata.vehid;
                        that.imei = _vehdata.imei;
                        that.vehregno = _vehdata.vehregno;
                        that.simno = _vehdata.simno;
                        that.vehtype = _vehdata.vehicletype;
                        that.vehname = _vehdata.vehiclename;
                        that.vehmake = _vehdata.vehiclemake;
                        that.vehmodel = _vehdata.vehiclemodel;
                        that.capacity = _vehdata.capacity;
                        that.vehcond = _vehdata.vehiclecondition;
                        that.vehfclt = _vehdata.vehiclefacility;
                        that.devtype = _vehdata.devtype;
                        that.speedAllow = _vehdata.vhspeed;
                        that.d1str = _vehdata.d1str;

                        that.isactive = _vehdata.isactive;
                        that.mode = _vehdata.mode;
                        that.dtlsmode = _vehdata.dtlsmode;

                        that.schoolDT = _enttdata;

                        var _schrow = null;
                        var _selschrow = null;
                        var _ownenttids = null;

                        for (var i = 0; i < that.schoolDT.length; i++) {
                            _schrow = null;
                            _schrow = that.schoolDT[i];

                            if (_schrow != null) {
                                _ownenttids = null;
                                _ownenttids = _vehdata.ownenttids;

                                if (_ownenttids != null) {
                                    for (var j = 0; j < _ownenttids.length; j++) {
                                        _selschrow = null;
                                        _selschrow = _ownenttids[j];

                                        if (_schrow.schid == _selschrow) {
                                            _schrow.isowner = true;
                                        }
                                    }
                                }
                            }
                        }

                        if (that.isdetails) {
                            that.disabledVehicleFields();
                        }
                        else {
                            if (that._enttdetails.enttid == _vehdata.enttid) {
                                that.enabledVehicleFields();
                            }
                            else {
                                that.disabledVehicleFields();
                            }

                            var selownerentt: string[] = [];
                            selownerentt = Object.keys(_enttdata).map(function (k) { return _enttdata[k].schid });

                            that.vehicleData = that.getVehicleParams(selownerentt);
                            that.oldVehicleData = that.getAuditParams("old");
                        }
                    }
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

    // Back For View Data

    backViewData() {
        if (this.isdetails) {
            this._router.navigate(['/reports/helpdesk']);
        }
        else {
            this._router.navigate(['/transport/vehicle']);
        }
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}
