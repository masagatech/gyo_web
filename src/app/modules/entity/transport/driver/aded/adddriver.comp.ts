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

    driverid: number = 0;
    loginid: number = 0;
    drivercode: string = "";
    driverpwd: string = "";
    drivername: string = "";
    aadharno: string = "";
    licenseno: string = "";
    mobileno1: string = "";
    mobileno2: string = "";
    email1: string = "";
    email2: string = "";
    address: string = "";
    country: string = "India";
    state: number = 0;
    city: number = 0;
    area: number = 0;
    pincode: number = 0;
    remark1: string = "";
    othenttids: any;

    mode: string = "";
    isactive: boolean = true;
    isprivate: boolean = true;

    uploadPhotoDT: any = [];
    uploadDocsDT: any = [];
    global = new Globals();
    uploadphotoconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };
    uploaddocsconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };
    choosePhotoLabel: string = "";

    isadd: boolean = false;
    isedit: boolean = false;
    isdetails: boolean = false;

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

        this.isadd = _router.url.indexOf("/add") > -1;
        this.isedit = _router.url.indexOf("/edit") > -1;
        this.isdetails = _router.url.indexOf("/details") > -1;
    }

    public ngOnInit() {
        this.getDriverDetails();
        this.showPassword("password");
    }

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
                // setTimeout(function () { $.AdminBSB.select.refresh('city'); }, 100);
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
                // setTimeout(function () { $.AdminBSB.select.refresh('area'); }, 100);
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

    // Active / Deactive Data

    active_deactiveDriverInfo() {
        var that = this;

        var act_deactDriver = {
            "autoid": that.driverid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        this._driverservice.saveDriverInfo(act_deactDriver).subscribe(data => {
            try {
                var dataResult = data.data;

                if (dataResult[0].funsave_driverinfo.msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", dataResult[0].funsave_driverinfo.msg);
                    that.getDriverDetails();
                }
                else {
                    that._msg.Show(messageType.error, "Error", dataResult[0].funsave_driverinfo.msg);
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

    // Clear Fields

    resetDriverFields() {
        var that = this;

        that.driverid = 0;
        that.drivercode = "";
        that.driverpwd = "";
        that.drivername = "";
        that.aadharno = "";
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
    }

    disabledDriverFields() {
        $(".mobileno1").attr("disabled", "disabled");
        $(".hidewhen input").attr("disabled", "disabled");
        $(".hidewhen select").attr("disabled", "disabled");
        $(".hidewhen textarea").attr("disabled", "disabled");
    }

    refreshDrivers() {
        this.resetDriverFields();
        this.mobileno1 = "";
    }

    // Save Data

    saveDriverInfo() {
        var that = this;

        if (that.drivercode == "") {
            that._msg.Show(messageType.error, "Error", "Enter Driver Code");
            $(".drivercode").focus();
        }
        else if (that.driverpwd == "") {
            that._msg.Show(messageType.error, "Error", "Enter Password");
            $(".driverpwd").focus();
        }
        else if (that.drivername == "") {
            that._msg.Show(messageType.error, "Error", "Enter Driver Name");
            $(".drivername").focus();
        }
        else if (that.mobileno1 == "") {
            that._msg.Show(messageType.error, "Error", "Enter Mobile No");
            $(".mobileno1").focus();
        }
        else if (that.address == "") {
            that._msg.Show(messageType.error, "Error", "Enter Address");
            $(".address").focus();
        }
        else {
            commonfun.loader();

            var saveDriver = {
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
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid,
                "isactive": that.isactive,
                "isprivate": that.isprivate,
                "mode": ""
            }

            that._driverservice.saveDriverInfo(saveDriver).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_driverinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.refreshDrivers();
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
                console.log(err);
                commonfun.loaderhide();
            }, () => {
                // console.log("Complete");
            });
        }
    }

    // Get Driver Data

    getDriverDetails() {
        var that = this;
        that.uploadPhotoDT = [];

        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.driverid = params['id'];

                that._driverservice.getDriverDetails({
                    "flag": "edit",
                    "id": that.driverid,
                    "enttid": that._enttdetails.enttid
                }).subscribe(data => {
                    try {
                        var _driverdata = data.data[0]._driverdata;
                        var _attachdocs = data.data[0]._attachdocs;

                        if (_driverdata == null || _driverdata == undefined) {
                            that.refreshDrivers();
                        }
                        else {
                            that.driverid = _driverdata.autoid;
                            that.loginid = _driverdata.loginid;
                            that.drivercode = _driverdata.drivercode;
                            that.driverpwd = _driverdata.driverpwd;
                            that.drivername = _driverdata.drivername;
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
                            that.isactive = _driverdata.isactive;
                            that.isprivate = _driverdata.isprivate;
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

                            if (_attachdocs !== null) {
                                that.uploadDocsDT = _attachdocs;
                            }
                            else {
                                that.uploadDocsDT = [];
                            }

                            if (that.isdetails) {
                                that.disabledDriverFields();
                                $("#divPhotoUpload").prop("class", "hide");
                                $("#divDocsUpload").prop("class", "hide");
                            }
                            else {
                                if (that._enttdetails.enttid == _driverdata.enttid) {
                                    that.enabledDriverFields();
                                    $("#divPhotoUpload").prop("class", "show");
                                    $("#divDocsUpload").prop("class", "show");
                                }
                                else {
                                    that.disabledDriverFields();
                                    $("#divPhotoUpload").prop("class", "hide");
                                    $("#divDocsUpload").prop("class", "hide");
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
            else {
                that.refreshDrivers();
                commonfun.loaderhide();
            }
        });
    }

    // Get Driver Data By Mobile

    getDriverByMobile() {
        var that = this;

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] == undefined) {
                commonfun.loader();

                that._driverservice.getDriverDetails({
                    "flag": "bymobile",
                    "mobileno1": that.mobileno1,
                    "enttid": that._enttdetails.enttid
                }).subscribe(data => {
                    try {
                        var _status = data.data[0].status;
                        var _isexists = data.data[0].isexists;
                        var _msg = data.data[0].msg;
                        var _driverdata = data.data[0]._driverdata;

                        if (_driverdata == null || _driverdata == undefined) {
                            that.resetDriverFields();
                        }
                        else {
                            if (_status == false) {
                                that._msg.Show(messageType.error, "Error", _msg);
                                that.resetDriverFields();

                                if (_isexists) {
                                    that.mobileno1 = "";
                                }
                            }
                            else {
                                that.disabledDriverFields();

                                $("#divPhotoUpload").prop("class", "hide");
                                $("#divDocsUpload").prop("class", "hide");

                                that.driverid = _driverdata.autoid;
                                that.loginid = _driverdata.loginid;
                                that.drivercode = _driverdata.drivercode;
                                that.driverpwd = _driverdata.driverpwd;
                                that.drivername = _driverdata.drivername;
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
                                that.isactive = _driverdata.isactive;
                                that.isprivate = _driverdata.isprivate;
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
        });
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
