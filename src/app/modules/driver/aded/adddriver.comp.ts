import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DriverService } from '../../../_services/driver/driver-service';
import { CommonService } from '../../../_services/common/common-service' /* add reference for view file type */
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { Globals } from '../../../_const/globals';

@Component({
    templateUrl: 'adddriver.comp.html',
    providers: [DriverService, CommonService]
})

export class AddDriverComponent implements OnInit {
    driverid: number = 0;
    drivercode: string = "";
    oldcode: string = "";
    driverpwd: string = "";
    drivername: string = "";
    ownerid: number = 0;
    aadharno: string = "";
    licenseno: string = "";
    lat: string = "";
    lon: string = "";
    mobileno1: string = "";
    mobileno2: string = "";
    email1: string = "";
    email2: string = "";
    address: string = "";
    country: string = "";
    state: string = "";
    city: string = "";
    pincode: string = "";
    remark1: string = "";
    uploadedFiles: any = [];
    attachDocsDT: any = [];

    mode: string = "";
    isactive: boolean = true;

    ownerDT: any = [];
    global = new Globals();

    uploadconfig = { server: "", serverpath: "", method: "post", maxFilesize: "", acceptedFiles: "" };

    private subscribeParameters: any;

    constructor(private _driverservice: DriverService, private _routeParams: ActivatedRoute, private _router: Router,
        private _msg: MessageService, private _commonservice: CommonService) {
        this.fillDropDownList();
        this.getUploadConfig();
    }

    public ngOnInit() {
        this.getDriverDetails();
    }

    onUpload(event) {
        var that = this;
        var imgfile = [];
        imgfile = JSON.parse(event.xhr.response);

        for (var i = 0; i < imgfile.length; i++) {
            that.attachDocsDT.push({
                "athid": "0", "athname": imgfile[i].name, "athurl": imgfile[i].path.replace("www\\uploads\\", ""),
                "athsize": imgfile[i].size, "athtype": imgfile[i].type, "ptype": "driver", "cuid": "vivek",
            })
        }

        // for (let file of imgfile) {
        //     that.docpath = file.path;
        //     break;
        // }
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

    removeFileUpload() {
        this.attachDocsDT.splice(0, 1);
    }

    getUploadConfig() {
        var that = this;

        that._commonservice.getMOM({ "flag": "uploadconfig" }).subscribe(data => {
            // config = {
            //     server: this.global.serviceurl + "uploads",
            //     serverpath: this.global.serviceurl,
            //     method: "post",
            //     maxFilesize: 1000000,
            //     acceptedFiles: '*'
            // };

            that.uploadconfig.server = that.global.serviceurl + "uploads";
            that.uploadconfig.serverpath = that.global.serviceurl;
            that.uploadconfig.maxFilesize = data.data[0]._filetype;
            that.uploadconfig.acceptedFiles = data.data[0]._filesize;
        }, err => {
            console.log("Error");
        }, () => {
            console.log("Complete");
        })
    }

    // Fill Owner Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._driverservice.getDriverDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.ownerDT = data.data;
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
        $("input").val("");
        $("textarea").val("");
        $("select").val("");
    }

    // Save Data

    saveDriverInfo() {
        var that = this;
        commonfun.loader();

        var saveDriver = {
            "autoid": that.driverid,
            "drivercode": that.drivercode,
            "oldcode": that.oldcode,
            "driverpwd": that.driverpwd,
            "drivername": that.drivername,
            "aadharno": that.aadharno,
            "licenseno": that.licenseno,
            "geoloc": that.lat + "," + that.lon,
            "mobileno1": that.mobileno1,
            "mobileno2": that.mobileno2,
            "email1": that.email1,
            "email2": that.email2,
            "address": that.address,
            "country": that.country,
            "state": that.state,
            "city": that.city,
            "pincode": that.pincode,
            "ownerid": that.ownerid,
            "attachdocs": that.attachDocsDT,
            "remark1": that.remark1,
            "cuid": "vivek",
            "isactive": that.isactive,
            "mode": ""
        }

        this._driverservice.saveDriverInfo(saveDriver).subscribe(data => {
            try {
                var dataResult = data.data;
                var msg = dataResult[0].funsave_driverinfo.msg;
                var msgid = dataResult[0].funsave_driverinfo.msgid;

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

    // Get Driver Data

    getDriverDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.driverid = params['id'];

                that._driverservice.getDriverDetails({ "flag": "edit", "id": that.driverid }).subscribe(data => {
                    try {
                        var _driverdata = data.data[0]._driverdata;
                        var _attachdocs = data.data[0]._attachdocs;

                        that.driverid = _driverdata[0].autoid;
                        that.drivercode = _driverdata[0].drivercode;
                        that.oldcode = _driverdata[0].drivercode;
                        that.driverpwd = _driverdata[0].driverpwd;
                        that.drivername = _driverdata[0].drivername;
                        that.lat = _driverdata[0].lat;
                        that.lon = _driverdata[0].lon;
                        that.aadharno = _driverdata[0].aadharno;
                        that.licenseno = _driverdata[0].licenseno;
                        that.email1 = _driverdata[0].email1;
                        that.email2 = _driverdata[0].email2;
                        that.mobileno1 = _driverdata[0].mobileno1;
                        that.mobileno2 = _driverdata[0].mobileno2;
                        that.address = _driverdata[0].address;
                        that.country = _driverdata[0].country;
                        that.state = _driverdata[0].state;
                        that.city = _driverdata[0].city;
                        that.pincode = _driverdata[0].pincode;
                        that.ownerid = _driverdata[0].ownerid;
                        that.remark1 = _driverdata[0].remark1;
                        that.isactive = _driverdata[0].isactive;
                        that.mode = _driverdata[0].mode;

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
        this._router.navigate(['/driver']);
    }
}
