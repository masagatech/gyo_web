import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { DriverService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;

@Component({
    templateUrl: 'adddriver.comp.html',
    providers: [CommonService]
})

export class AddDriverComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
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
    uploadedFiles: any = [];
    attachDocsDT: any = [];

    mode: string = "";
    isactive: boolean = true;

    uploadPhotoDT: any = [];

    global = new Globals();
    uploadphotoconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };
    uploaddocconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };

    private subscribeParameters: any;

    constructor(private _driverservice: DriverService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        this.getPhotoUploadConfig();
        this.getDocUploadConfig();

        this.fillStateDropDown();
        this.fillCityDropDown();
        this.fillAreaDropDown();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".enttname input").focus();
        }, 100);

        this.getDriverDetails();
    }

    // Get State DropDown

    fillStateDropDown() {
        var that = this;
        commonfun.loader();

        that._autoservice.getDropDownData({ "flag": "state" }).subscribe(data => {
            try {
                that.stateDT = data.data;
                // setTimeout(function () { $.AdminBSB.select.refresh('state'); }, 100);
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

        that._autoservice.getMOM({ "flag": "filebyid", "id": "29" }).subscribe(data => {
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

        for (var i = 0; i < imgfile.length; i++) {
            that.uploadPhotoDT.push({ "athurl": imgfile[i].path.replace(that.uploadphotoconfig.filepath, "") })
        }
    }

    removePhotoUpload() {
        this.uploadPhotoDT.splice(0, 1);
    }

    // Driver Document Upload

    getDocUploadConfig() {
        var that = this;

        that._autoservice.getMOM({ "flag": "allfile" }).subscribe(data => {
            that.uploaddocconfig.server = that.global.serviceurl + "uploads";
            that.uploaddocconfig.serverpath = that.global.serviceurl;
            that.uploaddocconfig.uploadurl = that.global.uploadurl;
            that.uploaddocconfig.filepath = that.global.filepath;
            that.uploaddocconfig.maxFilesize = data.data[0]._filesize;
            that.uploaddocconfig.acceptedFiles = data.data[0]._filetype;
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

        for (var i = 0; i < imgfile.length; i++) {
            that.attachDocsDT.push({
                "athid": "0", "athname": imgfile[i].name, "athurl": imgfile[i].path.replace(that.uploaddocconfig.filepath, ""),
                "athsize": imgfile[i].size, "athtype": imgfile[i].type, "ptype": "driver", "cuid": that.loginUser.ucode,
            })
        }
    }

    removeDocUpload() {
        this.attachDocsDT.splice(0, 1);
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
        that.mobileno1 = "";
        that.mobileno2 = "";
        that.email1 = "";
        that.email2 = "";
        that.address = "";
        that.country = "India";
        that.state = 0;
        that.city = 0;
        that.area = 0;
        that.pincode = 0;

        that.uploadPhotoDT = [];
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
                "attachdocs": that.attachDocsDT,
                "remark1": that.remark1,
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._wsdetails.wsautoid,
                "isactive": that.isactive,
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
                            that.resetDriverFields();
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
                    "wsautoid": that._wsdetails.wsautoid
                }).subscribe(data => {
                    try {
                        var _driverdata = data.data[0]._driverdata;
                        var _attachdocs = data.data[0]._attachdocs;

                        that.driverid = _driverdata[0].autoid;
                        that.loginid = _driverdata[0].loginid;
                        that.drivercode = _driverdata[0].drivercode;
                        that.driverpwd = _driverdata[0].driverpwd;
                        that.drivername = _driverdata[0].drivername;
                        that.aadharno = _driverdata[0].aadharno;
                        that.licenseno = _driverdata[0].licenseno;
                        that.email1 = _driverdata[0].email1;
                        that.email2 = _driverdata[0].email2;
                        that.mobileno1 = _driverdata[0].mobileno1;
                        that.mobileno2 = _driverdata[0].mobileno2;
                        that.address = _driverdata[0].address;
                        that.country = _driverdata[0].country;
                        that.state = _driverdata[0].state;
                        that.fillCityDropDown();
                        that.city = _driverdata[0].city;
                        that.fillAreaDropDown();
                        that.area = _driverdata[0].area;
                        that.pincode = _driverdata[0].pincode;
                        that.remark1 = _driverdata[0].remark1;
                        that.isactive = _driverdata[0].isactive;
                        that.mode = _driverdata[0].mode;

                        if (_driverdata[0].FilePath !== "") {
                            that.uploadPhotoDT.push({ "athurl": _driverdata[0].FilePath });
                        }
                        else {
                            that.uploadPhotoDT = [];
                        }

                        that.attachDocsDT = _attachdocs === null ? [] : _attachdocs;
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
                that.resetDriverFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/driver']);
    }
}
