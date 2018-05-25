import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { InventoryService } from '@services/master';

@Component({
    templateUrl: 'viewsim.comp.html'
})

export class ViewSimComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    global = new Globals();

    simDT: any = [];
    uploadsimconfig = { server: "", serverpath: "", uploadxlsurl: "", xlsfilepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };

    private subscribeParameters: any;

    constructor(private _invservice: InventoryService, private _routeParams: ActivatedRoute, private _router: Router,
        private _msg: MessageService, private _loginservice: LoginService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.getUploadConfig();
        this.getSimDetails();
    }

    public ngOnInit() {

    }

    // Sim Master

    // Get Sim Data

    getSimDetails() {
        var that = this;
        commonfun.loader();

        that._invservice.getSimDetails({ "flag": "all", "wsautoid": that._wsdetails.wsautoid }).subscribe(data => {
            try {
                that.simDT = data.data;
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

        that.uploadsimconfig.server = that.global.serviceurl + "bulkUpload";
        that.uploadsimconfig.serverpath = that.global.serviceurl;
        that.uploadsimconfig.uploadxlsurl = that.global.uploadurl;
        that.uploadsimconfig.xlsfilepath = that.global.xlsfilepath;

        that._autoservice.getMOM({ "flag": "filebyid", "id": that.global.xlsid }).subscribe(data => {
            that.uploadsimconfig.maxFilesize = data.data[0]._filesize;
            that.uploadsimconfig.acceptedFiles = data.data[0]._filetype;
        }, err => {
            console.log("Error");
        }, () => {
            console.log("Complete");
        })
    }

    // Before Upload Device and SIM

    onBeforeUpload(event) {
        event.formData.append("bulktype", "inventory");
        event.formData.append("savetype", "sim");
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
            that.getSimDetails();
        }
        else {
            that._msg.Show(messageType.warn, "Warning", xlsfile.msg);
        }
    }

    public addSim() {
        this._router.navigate(['/inventory/sim/add']);
    }

    public editSim(row) {
        this._router.navigate(['/inventory/sim/edit', row.simid]);
    }
}
