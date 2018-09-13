import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { DriverService } from '@services/master';

@Component({
    templateUrl: 'adddriver.comp.html'
})

export class AddDriverComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    stateDT: any = [];
    cityDT: any = [];
    areaDT: any = [];

    isotherentt: boolean = false;

    paramsid: number = 0;
    driverid: number = 0;
    loginid: number = 0;
    drivercode: string = "";
    driverpwd: string = "";
    drivername: string = "";
    aadharno: string = "";
    licenseno: string = "";

    ownenttid: number = 0;
    getmobno: string = "";
    mobileno1: string = "";
    mobileno2: string = "";
    email1: string = "";
    email2: string = "";
    address: string = "";
    country: string = "India";
    state: number = 0;
    statename: string = "";
    city: number = 0;
    cityname: string = "";
    area: number = 0;
    areaname: number = 0;
    pincode: number = 0;
    remark1: string = "";
    othenttids: any;

    isprivate: boolean = true;
    isdrvowner: boolean = false;

    mode: string = "";
    isactive: boolean = true;

    uploadPhotoDT: any = [];
    uploadDocsDT: any = [];
    schoolDT: any = [];

    global = new Globals();

    uploadphotoconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };
    uploaddocsconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };
    choosePhotoLabel: string = "";

    isadd: boolean = false;
    isedit: boolean = false;
    isdetails: boolean = false;

    isadddrv: boolean = false;
    iseditdrv: boolean = false;
    isdeletedrv: boolean = false;

    act_deactDriverData: any = [];
    deleteDriverData: any = [];

    driverData: any = [];
    oldDriverData: any = [];
    newDriverData: any = [];

    private subscribeParameters: any;

    constructor(private _driverservice: DriverService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getPhotoUploadConfig();
        this.getDocUploadConfig();

        this.fillStateDropDown();
        this.fillCityDropDown();
        this.fillAreaDropDown();

        this.getActionRights();

        this.isadd = _router.url.indexOf("/add") > -1;
        this.isedit = _router.url.indexOf("/edit") > -1;
        this.isdetails = _router.url.indexOf("/details") > -1;
    }

    public ngOnInit() {
        this.getDriverDetails();
        this.showPassword("password");
    }

    // Get Action Rights

    getActionRights() {
        var that = this;
        commonfun.loader();

        var params = {
            "flag": "menurights", "entttype": that._enttdetails.entttype, "uid": that.loginUser.uid,
            "utype": that.loginUser.utype, "mcode": "drv"
        };

        that._autoservice.getMenuDetails(params).subscribe(data => {
            that.isadddrv = data.data.filter(a => a.maction == "add")[0].isrights;
            that.iseditdrv = data.data.filter(a => a.maction == "edit")[0].isrights;
            that.isdeletedrv = data.data.filter(a => a.maction == "delete")[0].isrights;
        }, err => {
            console.log(err);
        }, () => {
            // console.log("Complete");
        });
    }

    // Show / Hide Password

    showPassword(type) {
        if (type == "text") {
            $("#lblshowpwd").removeClass("hide");
            $("#lblshowpwd").addClass("show");

            $("#lblhidepwd").removeClass("show");
            $("#lblhidepwd").addClass("hide");
        }
        else {
            $("#lblshowpwd").removeClass("show");
            $("#lblshowpwd").addClass("hide");

            $("#lblhidepwd").removeClass("hide");
            $("#lblhidepwd").addClass("show");
        }

        $(".driverpwd").attr("type", type);
    }

    // Get State DropDown

    fillStateDropDown() {
        var that = this;
        commonfun.loader();

        that._autoservice.getDropDownData({ "flag": "state" }).subscribe(data => {
            try {
                that.stateDT = data.data;
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

    // Get City DropDown

    fillCityDropDown() {
        var that = this;
        commonfun.loader();

        that.cityDT = [];
        that.areaDT = [];

        that.city = 0;
        that.area = 0;

        that._autoservice.getDropDownData({ "flag": "city", "sid": that.state }).subscribe(data => {
            try {
                that.cityDT = data.data;
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

    // Get Area DropDown

    fillAreaDropDown() {
        var that = this;
        commonfun.loader();

        that.areaDT = [];

        that.area = 0;

        that._autoservice.getDropDownData({ "flag": "area", "ctid": that.city, "sid": that.state }).subscribe(data => {
            try {
                that.areaDT = data.data;
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

    // Driver Photo Upload

    getPhotoUploadConfig() {
        var that = this;

        that._autoservice.getMOM({ "flag": "filebyid", "id": that.global.photoid }).subscribe(data => {
            that.uploadphotoconfig.server = that.global.serviceurl + "uploads";
            that.uploadphotoconfig.serverpath = that.global.serviceurl;
            that.uploadphotoconfig.uploadurl = that.global.uploadurl;
            that.uploadphotoconfig.filepath = that.global.filepath;
            that.uploadphotoconfig.maxFilesize = data.data[0]._filesize;
            that.uploadphotoconfig.acceptedFiles = data.data[0]._filetype;
        }, err => {
            console.log("Error");
        }, () => {
            console.log("Complete");
        })
    }

    onPhotoUpload(event) {
        var that = this;
        var imgfile = [];
        that.uploadPhotoDT = [];

        imgfile = JSON.parse(event.xhr.response);

        setTimeout(function () {
            for (var i = 0; i < imgfile.length; i++) {
                that.uploadPhotoDT.push({ "athurl": imgfile[i].path.replace(that.uploadphotoconfig.filepath, "") })
            }
        }, 1000);
    }

    removePhotoUpload() {
        this.uploadPhotoDT.splice(0, 1);
    }

    // Driver Document Upload

    getDocUploadConfig() {
        var that = this;

        that._autoservice.getMOM({ "flag": "allfile" }).subscribe(data => {
            that.uploaddocsconfig.server = that.global.serviceurl + "uploads";
            that.uploaddocsconfig.serverpath = that.global.serviceurl;
            that.uploaddocsconfig.uploadurl = that.global.uploadurl;
            that.uploaddocsconfig.filepath = that.global.filepath;
            that.uploaddocsconfig.maxFilesize = data.data[0]._filesize;
            that.uploaddocsconfig.acceptedFiles = data.data[0]._filetype;
        }, err => {
            console.log("Error");
        }, () => {
            console.log("Complete");
        })
    }

    onDocUpload(event) {
        var that = this;
        var imgfile = [];
        imgfile = JSON.parse(event.xhr.response);

        setTimeout(function () {
            for (var i = 0; i < imgfile.length; i++) {
                that.uploadDocsDT.push({
                    "athid": "0", "athname": imgfile[i].name, "athurl": imgfile[i].path.replace(that.uploaddocsconfig.filepath, ""),
                    "athsize": imgfile[i].size, "athtype": imgfile[i].type, "ptype": "driver", "cuid": that.loginUser.ucode,
                })
            }
        }, 1000);
    }

    removeDocUpload() {
        this.uploadDocsDT.splice(0, 1);
    }

    // Get File Size

    formatSizeUnits(bytes) {
        if (bytes >= 1073741824) {
            bytes = (bytes / 1073741824).toFixed(2) + ' GB';
        }
        else if (bytes >= 1048576) {
            bytes = (bytes / 1048576).toFixed(2) + ' MB';
        }
        else if (bytes >= 1024) {
            bytes = (bytes / 1024).toFixed(2) + ' KB';
        }
        else if (bytes > 1) {
            bytes = bytes + ' bytes';
        }
        else if (bytes == 1) {
            bytes = bytes + ' byte';
        }
        else {
            bytes = '0 byte';
        }

        return bytes;
    }

    // Clear Fields

    resetDriverFields() {
        var that = this;

        that.driverid = 0;
        that.drivercode = "";
        that.driverpwd = "";
        that.drivername = "";
        that.aadharno = "";
        that.mobileno1 = that.getmobno;
        that.mobileno2 = "";
        that.email1 = "";
        that.email2 = "";

        that.address = that._enttdetails.address;
        that.country = that._enttdetails.country;
        that.state = that._enttdetails.sid;
        that.fillCityDropDown();
        that.city = that._enttdetails.ctid;
        that.fillAreaDropDown();
        that.area = that._enttdetails.arid;
        that.pincode = that._enttdetails.pincode;

        that.schoolDT = [];
        that.uploadPhotoDT = [];
        that.uploadDocsDT = [];
        that.choosePhotoLabel = "Upload Photo";
        that.isprivate = false;

        that.enabledDriverFields();
    }

    enabledDriverFields() {
        $(".mobileno1").removeAttr("disabled");
        $(".hidewhen input").removeAttr("disabled");
        $(".hidewhen select").removeAttr("disabled");
        $(".hidewhen textarea").removeAttr("disabled");

        $("#divPhotoUpload").prop("class", "show");
        $("#divDocsUpload").prop("class", "show");
    }

    disabledDriverFields() {
        $(".mobileno1").attr("disabled", "disabled");
        $(".hidewhen input").attr("disabled", "disabled");
        $(".hidewhen select").attr("disabled", "disabled");
        $(".hidewhen textarea").attr("disabled", "disabled");

        $("#divPhotoUpload").prop("class", "hide");
        $("#divDocsUpload").prop("class", "hide");
    }

    refreshDrivers() {
        this.getmobno = "";
        this.resetDriverFields();
    }

    // Validation Fields

    isValidateDriver(newval) {
        var that = this;

        if (that.mobileno1 == "") {
            that._msg.Show(messageType.error, "Error", "Enter Mobile No");
            $(".mobileno1").focus();
            return false;
        }
        if (that.drivercode == "") {
            that._msg.Show(messageType.error, "Error", "Enter Driver Code");
            $(".drivercode").focus();
            return false;
        }
        if (that.driverpwd == "") {
            that._msg.Show(messageType.error, "Error", "Enter Password");
            $(".driverpwd").focus();
            return false;
        }
        if (that.drivername == "") {
            that._msg.Show(messageType.error, "Error", "Enter Driver Name");
            $(".drivername").focus();
            return false;
        }
        if (that.address == "") {
            that._msg.Show(messageType.error, "Error", "Enter Address");
            $(".address").focus();
            return false;
        }
        if (that.paramsid !== 0) {
            if (JSON.stringify(newval) == "{}") {
                that._msg.Show(messageType.warn, "Warning", "No any Changes");
                return false;
            }
        }

        return true;
    }

    // Get Audit Parameter

    getAuditParams(ddltype, isdelete) {
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
            { "key": "Driver Code", "val": that.drivercode, "fldname": "drivercode", "fldtype": "text" },
            { "key": "Password", "val": that.driverpwd, "fldname": "driverpwd", "fldtype": "text" },
            { "key": "Driver Name", "val": that.drivername, "fldname": "drivername", "fldtype": "text" },
            { "key": "Aadhar No", "val": that.aadharno, "fldname": "aadharno", "fldtype": "text" },
            { "key": "License No", "val": that.licenseno, "fldname": "licenseno", "fldtype": "text" },
            { "key": "Mobile No", "val": that.mobileno1, "fldname": "mobileno1", "fldtype": "text" },
            { "key": "Alternate Mobile No", "val": that.mobileno2, "fldname": "mobileno2", "fldtype": "text" },
            { "key": "Email", "val": that.email1, "fldname": "email1", "fldtype": "text" },
            { "key": "Alternate Email", "val": that.email1, "fldname": "email1", "fldtype": "text" },
            { "key": "Address", "val": that.address, "fldname": "address", "fldtype": "text" },
            { "key": "Country", "val": that.country, "fldname": "country", "fldtype": "text" },
            { "key": "State", "val": ddltype == "old" ? that.statename : $("#state option:selected").text().trim(), "fldname": "state", "fldtype": "ddl" },
            { "key": "City", "val": ddltype == "old" ? that.cityname : $("#city option:selected").text().trim(), "fldname": "city", "fldtype": "ddl" },
            { "key": "Area", "val": ddltype == "old" ? that.areaname : $("#area option:selected").text().trim(), "fldname": "area", "fldtype": "ddl" },
            { "key": "Pin Code", "val": that.pincode.toString() == "" ? 0 : that.pincode, "fldname": "pincode", "fldtype": "text" },
            { "key": "Other Entity", "val": that.schoolDT, "fldname": "othenttids", "fldtype": "table" },
            { "key": "Owner Entity", "val": _ownenttdt, "fldname": "ownenttids", "fldtype": "table" },
            { "key": "Mode", "val": that.mode, "fldname": "mode", "fldtype": "text" },
            { "key": "Is Active", "val": that.isactive, "fldname": "isactive", "fldtype": "boolean" },
            { "key": "Is Delete", "val": isdelete, "fldname": "isdelete", "fldtype": "boolean" }
        ]

        return _auditdt;
    }

    // Audit Log

    saveAuditLog(id, name, oldval, newval) {
        var that = this;

        var _oldvaldt = [];
        var _newvaldt = [];

        for (var i = 0; i < Object.keys(oldval).length; i++) {
            _oldvaldt.push(that.oldDriverData.filter(a => a.fldname == Object.keys(oldval)[i]));
        }

        for (var i = 0; i < Object.keys(newval).length; i++) {
            _newvaldt.push(that.newDriverData.filter(a => a.fldname == Object.keys(newval)[i]));
        }

        var _oldval = that._autoservice.replaceJSON(_oldvaldt);
        var _newval = that._autoservice.replaceJSON(_newvaldt);

        if (_newval != "" && _newval != "[]") {
            var dispflds = [{ "key": "Driver Name", "val": name }];

            var auditparams = {
                "loginsessionid": that.loginUser.sessiondetails.sessionid, "mdlcode": "driver", "mdlname": "Driver",
                "id": id, "dispflds": dispflds, "oldval": _oldval, "newval": _newval, "ayid": that._enttdetails.ayid,
                "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "createdby": that.loginUser.ucode
            };

            that._autoservice.saveAuditLog(auditparams);
        }
    }

    // Active / Deactive Driver

    getActiveDeactiveParams() {
        var that = this;

        var params = {
            "flag": "owndrv",
            "autoid": that.driverid,
            "mode": that.mode,
            "isactive": that.isactive
        }

        return params;
    }

    active_deactiveDriverInfo() {
        var that = this;
        var params = that.getActiveDeactiveParams();

        that.newDriverData = that.getAuditParams("new", false);

        var newval = that._autoservice.getDiff2Arrays(that.act_deactDriverData, params);
        var oldval = that._autoservice.getDiff2Arrays(params, that.act_deactDriverData);

        that._driverservice.saveDriverInfo(params).subscribe(data => {
            try {
                var dataResult = data.data[0].funsave_driverinfo;
                var msg = dataResult.msg;
                var msgid = dataResult.msgid;
                var autoid = dataResult.drvid;

                if (msgid != "-1") {
                    that.saveAuditLog(autoid, that.drivername, oldval, newval);
                    that._msg.Show(messageType.success, "Success", msg);
                    that.getDriverDetails();
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
            // console.log("Complete");
        });
    }

    // Delete Driver

    getDeleteParams() {
        var that = this;

        var params = {
            "flag": "owndrv",
            "autoid": that.driverid,
            "mode": "delete",
            "isdelete": true
        }

        return params;
    }

    public deleteDrivers() {
        var that = this;

        that._autoservice.confirmmsgbox("Are you sure, you want to delete ?", "Your record has been deleted", "Your record is safe", function (e) {
            var params = that.getDeleteParams();

            that.mode = "delete";
            that.newDriverData = that.getAuditParams("new", true);

            var newval = that._autoservice.getDiff2Arrays(that.deleteDriverData, params);
            var oldval = that._autoservice.getDiff2Arrays(params, that.deleteDriverData);

            that._driverservice.saveDriverInfo(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_driverinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;
                    var autoid = dataResult.drvid;

                    if (msgid != "-1") {
                        that.saveAuditLog(autoid, that.drivername, oldval, newval);
                        that.backViewData();
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
                // console.log("Complete");
            });
        });
    }

    // Get Save Parameter

    getDriverParams(selownerentt) {
        var that = this;

        var params = {
            "autoid": that.driverid,
            "loginid": that.loginid,
            "drivercode": that.drivercode,
            "driverpwd": that.driverpwd,
            "drivername": that.drivername,
            "aadharno": that.aadharno,
            "licenseno": that.licenseno,
            "filepath": that.uploadPhotoDT.length > 0 ? that.uploadPhotoDT[0].athurl : "",
            "mobileno1": that.mobileno1,
            "mobileno2": that.mobileno2,
            "email1": that.email1,
            "email2": that.email2,
            "address": that.address,
            "country": that.country,
            "state": that.state,
            "city": that.city,
            "area": that.area,
            "pincode": that.pincode.toString() == "" ? 0 : that.pincode,
            "attachdocs": that.uploadDocsDT,
            "remark1": that.remark1,
            "cuid": that.loginUser.ucode,
            "othenttids": that.othenttids,
            "ownenttids": "{" + selownerentt.toString().replace("[", "").replace("]", "") + "}",
            "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid,
            "isactive": that.isactive,
            "isprivate": that.isprivate,
            "mode": ""
        }

        return params;
    }

    // Save Driver

    saveDriverInfo() {
        var that = this;

        var _enttdata = that.schoolDT.filter(a => a.isowner == true);

        var selownerentt: string[] = [];
        selownerentt = Object.keys(_enttdata).map(function (k) { return _enttdata[k].schid });

        var params = that.getDriverParams(selownerentt);

        that.mode = "";
        that.newDriverData = that.getAuditParams("new", false);

        var newval = that._autoservice.getDiff2Arrays(that.driverData, params);
        var oldval = that._autoservice.getDiff2Arrays(params, that.driverData);

        var isvalid = that.isValidateDriver(newval);

        if (isvalid) {
            commonfun.loader();

            that._driverservice.saveDriverInfo(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_driverinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;
                    var drvid = dataResult.drvid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.refreshDrivers();
                        }
                        else {
                            that.saveAuditLog(drvid, that.drivername, oldval, newval);
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
                // console.log("Complete");
            });
        }
    }

    // On Mobile Change

    getDriverDetails() {
        var that = this;

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.paramsid = params['id'];
                that.getDriverByID(that.paramsid);
                $(".getmobno").attr("disabled", "disabled");
            }
            else {
                that.getDriverByMobile(that.getmobno);
            }
        });
    }

    // Get Driver Data

    getDriverByID(drvid) {
        var that = this;
        that.uploadPhotoDT = [];

        commonfun.loader();

        that._driverservice.getDriverDetails({
            "flag": "edit",
            "id": drvid,
            "enttid": that._enttdetails.enttid
        }).subscribe(data => {
            try {
                var _driverdata = data.data[0]._driverdata;
                var _attachdocs = data.data[0]._attachdocs;

                that.schoolDT = data.data[0]._enttdata;

                if (_driverdata == null || _driverdata == undefined) {
                    if (that.paramsid == 0) {
                        that.refreshDrivers();
                    }
                    else {
                        that.backViewData();
                    }
                }
                else {
                    that.driverid = _driverdata.autoid;
                    that.loginid = _driverdata.loginid;
                    that.drivercode = _driverdata.drivercode;
                    that.driverpwd = _driverdata.driverpwd;
                    that.drivername = _driverdata.drivername;
                    that.ownenttid = _driverdata.enttid;
                    that.aadharno = _driverdata.aadharno;
                    that.licenseno = _driverdata.licenseno;
                    that.email1 = _driverdata.email1;
                    that.email2 = _driverdata.email2;
                    that.getmobno = _driverdata.mobileno1;
                    that.mobileno1 = _driverdata.mobileno1;
                    that.mobileno2 = _driverdata.mobileno2;
                    that.address = _driverdata.address;
                    that.country = _driverdata.country;
                    that.state = _driverdata.state;
                    that.fillCityDropDown();
                    that.city = _driverdata.city;
                    that.fillAreaDropDown();
                    that.area = _driverdata.area;
                    that.pincode = _driverdata.pincode;
                    that.remark1 = _driverdata.remark1;
                    that.isprivate = _driverdata.isprivate;
                    that.isdrvowner = _driverdata.isowner;
                    that.isactive = _driverdata.isactive;
                    that.mode = _driverdata.mode;
                    that.othenttids = _driverdata.othenttids;

                    if (_driverdata.FilePath !== "") {
                        that.uploadPhotoDT.push({ "athurl": _driverdata.FilePath });
                        that.choosePhotoLabel = "Change Photo";
                    }
                    else {
                        that.uploadPhotoDT = [];
                        that.choosePhotoLabel = "Upload Photo";
                    }

                    that.uploadDocsDT = _attachdocs;

                    if (that.isdetails) {
                        that.disabledDriverFields();
                    }
                    else {
                        if (that.isdrvowner) {
                            that.enabledDriverFields();
                        }
                        else {
                            that.disabledDriverFields();
                        }

                        var selownerentt = _driverdata.ownenttids;

                        that.driverData = that.getDriverParams(selownerentt);
                        that.act_deactDriverData = that.getActiveDeactiveParams();
                        that.deleteDriverData = that.getDeleteParams();
                        that.oldDriverData = that.getAuditParams("old", false);
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

    // Get Driver Data By Mobile

    getDriverByMobile(mobno) {
        var that = this;
        that.uploadPhotoDT = [];

        commonfun.loader();

        that._driverservice.getDriverDetails({
            "flag": "bymobile",
            "mobileno1": mobno,
            "enttid": that._enttdetails.enttid
        }).subscribe(data => {
            try {
                var _status = data.data[0].status;
                var _isexists = data.data[0].isexists;
                var _msg = data.data[0].msg;
                var _driverdata = data.data[0]._driverdata;

                that.schoolDT = data.data[0]._enttdata;

                if (_driverdata == null || _driverdata == undefined) {
                    that.resetDriverFields();
                }
                else {
                    if (_status == false) {
                        that._msg.Show(messageType.error, "Error", _msg);

                        if (_isexists) {
                            that.getmobno = "";
                        }

                        that.isotherentt = false;
                        that.resetDriverFields();
                    }
                    else {
                        that.disabledDriverFields();

                        that.isotherentt = true;
                        that.driverid = _driverdata.autoid;
                        that.loginid = _driverdata.loginid;
                        that.drivercode = _driverdata.drivercode;
                        that.driverpwd = _driverdata.driverpwd;
                        that.drivername = _driverdata.drivername;
                        that.ownenttid = _driverdata.enttid;
                        that.aadharno = _driverdata.aadharno;
                        that.licenseno = _driverdata.licenseno;
                        that.email1 = _driverdata.email1;
                        that.email2 = _driverdata.email2;
                        that.mobileno1 = _driverdata.mobileno1;
                        that.mobileno2 = _driverdata.mobileno2;
                        that.address = _driverdata.address;
                        that.country = _driverdata.country;
                        that.state = _driverdata.state;
                        that.fillCityDropDown();
                        that.city = _driverdata.city;
                        that.fillAreaDropDown();
                        that.area = _driverdata.area;
                        that.pincode = _driverdata.pincode;
                        that.remark1 = _driverdata.remark1;
                        that.isprivate = _driverdata.isprivate;
                        that.isactive = _driverdata.isactive;
                        that.mode = _driverdata.mode;
                        that.othenttids = _driverdata.othenttids;

                        if (_driverdata.FilePath !== "") {
                            that.uploadPhotoDT.push({ "athurl": _driverdata.FilePath });
                            that.choosePhotoLabel = "Change Photo";
                        }
                        else {
                            that.uploadPhotoDT = [];
                            that.choosePhotoLabel = "Upload Photo";
                        }

                        if (that.isdetails) {
                            that.disabledDriverFields();
                        }
                        else {
                            if (that._enttdetails.enttid == _driverdata.enttid) {
                                that.enabledDriverFields();
                            }
                            else {
                                that.disabledDriverFields();
                            }

                            var selownerentt = _driverdata.ownenttids;

                            that.driverData = that.getDriverParams(selownerentt);
                            that.act_deactDriverData = that.getActiveDeactiveParams();
                            that.deleteDriverData = that.getDeleteParams();
                            that.oldDriverData = that.getAuditParams("old", false);
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
            this._router.navigate(['/transport/driver']);
        }
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}
