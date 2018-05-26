import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { InventoryService } from '@services/master';
import { LoginUserModel, Globals } from '@models';

@Component({
    templateUrl: 'viewdev.comp.html'
})

export class ViewDeviceComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    global = new Globals();

    // Device Variable

    devtypeDT: any = [];
    devtype: string = "";

    deviceDT: any = [];

    // Bulk Upload Device

    uploaddeviceconfig = { server: "", serverpath: "", uploadxlsurl: "", xlsfilepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _invservice: InventoryService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.fillDropDownList();
        this.getUploadConfig();
        this.getDeviceDetails();
    }

    public ngOnInit() {

    }

    // Device Master

    // Fill Device Type Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._invservice.getDeviceDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.devtypeDT = data.data.filter(a => a.group == "devicetype");
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

    // Get Device Data

    getDeviceDetails() {
        var that = this;
        commonfun.loader();

        that._invservice.getDeviceDetails({ "flag": "all", "wsautoid": that._wsdetails.wsautoid }).subscribe(data => {
            try {
                that.deviceDT = data.data;
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

    // Bulk Upload Device and SIM

    getUploadConfig() {
        var that = this;

        that.uploaddeviceconfig.server = that.global.serviceurl + "bulkUpload";
        that.uploaddeviceconfig.serverpath = that.global.serviceurl;
        that.uploaddeviceconfig.uploadxlsurl = that.global.uploadurl;
        that.uploaddeviceconfig.xlsfilepath = that.global.xlsfilepath;

        that._autoservice.getMOM({ "flag": "filebyid", "id": that.global.xlsid }).subscribe(data => {
            that.uploaddeviceconfig.maxFilesize = data.data[0]._filesize;
            that.uploaddeviceconfig.acceptedFiles = data.data[0]._filetype;
        }, err => {
            console.log("Error");
        }, () => {
            console.log("Complete");
        })
    }

    // Before Upload Device and SIM

    onBeforeUpload(event) {
        event.formData.append("bulktype", "inventory");
        event.formData.append("savetype", "device");
        event.formData.append("wsautoid", this._wsdetails.wsautoid);
        event.formData.append("cuid", this.loginUser.ucode);
    }

    onAfterUpload(event) {
        var that = this;

        var xlsfile = JSON.parse(event.xhr.response).data.funsave_inventoryinfo;

        if (xlsfile.msgid == 401) {
            that._msg.Show(messageType.error, "Error", xlsfile.msg);
        }
        else if (xlsfile.msgid == 1) {
            that._msg.Show(messageType.success, "Success", xlsfile.msg);
            that.getDeviceDetails();
        }
        else {
            that._msg.Show(messageType.warn, "Warning", xlsfile.msg);
        }
    }

    public addDevice() {
        this._router.navigate(['/inventory/device/add']);
    }

    public editDevice(row) {
        this._router.navigate(['/inventory/device/edit', row.devid]);
    }
}
