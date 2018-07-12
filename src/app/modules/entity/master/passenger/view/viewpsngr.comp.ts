import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AdmissionService } from '@services/erp';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;

@Component({
    templateUrl: 'viewpsngr.comp.html'
})

export class ViewPassengerComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    isShowGrid: boolean = true;
    isShowList: boolean = false;
    status: string = "";

    autoPassengerDT: any = [];
    selectedPassenger: any = {};
    psngrid: number = 0;
    psngrname: any = [];

    passengerDT: any = [];

    // Upload File

    uploadFileDT: any = [];
    uploadfileconfig = { server: "", serverpath: "", uploadxlsurl: "", xlsfilepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _admsnservice: AdmissionService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getUploadConfig();
        this.viewPassengerDataRights();
    }

    public ngOnInit() {
        var that = this;
        
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    isshPassenger(viewtype) {
        var that = this;
        commonfun.loader("#divShow");

        if (viewtype == "grid") {
            that.isShowGrid = true;
            that.isShowList = false;
            commonfun.loaderhide("#divShow");
        }
        else {
            that.isShowGrid = false;
            that.isShowList = true;
            commonfun.loaderhide("#divShow");
        }
    }

    // Auto Completed Passenger

    getPassengerData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "student",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "issysadmin": this.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.autoPassengerDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Passenger

    selectPassengerData(event) {
        this.psngrid = event.value;
        this.psngrname = event.label;

        Cookie.set("_psngrid_", event.value);
        Cookie.set("_psngrname_", event.label);

        this.getPassengerDetails();
    }

    // View Data Rights

    public viewPassengerDataRights() {
        var that = this;

        if (Cookie.get('_psngrname_') != null) {
            that.psngrid = parseInt(Cookie.get('_psngrid_'));
            that.psngrname.value = parseInt(Cookie.get('_psngrid_'));
            that.psngrname.label = Cookie.get('_psngrname_');
        }

        that.getPassengerDetails();
    }

    getPassengerDetails() {
        var that = this;
        var params = {};

        commonfun.loader();

        if (that.psngrid == 0) {
            Cookie.set("_psngrid_", "0");
            Cookie.set("_psngrname_", "");

            that.psngrname.value = parseInt(Cookie.get('_psngrid_'));
            that.psngrname.label = Cookie.get('_psngrname_');
        }

        params = {
            "flag": "all", "admtype": "passenger", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "studid": that.psngrid.toString() == "" ? 0 : that.psngrid, "status": that.status, "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        };

        that._admsnservice.getStudentDetails(params).subscribe(data => {
            try {
                that.passengerDT = data.data;
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

    public addPassengerForm() {
        this._router.navigate(['/master/' + this._enttdetails.smpsngrtype + '/add']);
    }

    public editPassengerForm(row) {
        this._router.navigate(['/master/' + this._enttdetails.smpsngrtype + '/edit', row.enrlmntid]);
    }

    // Bulk Upload Passengers

    openBulkUploadPopup() {
        $("#bulkUploadModal").modal('show');
    }

    closeBulkUploadPopup() {
        $("#bulkUploadModal").modal("hide");
    }
    // Bulk Upload

    getUploadConfig() {
        var that = this;

        that.uploadfileconfig.server = that.global.serviceurl + "bulkUpload";
        that.uploadfileconfig.serverpath = that.global.serviceurl;
        that.uploadfileconfig.uploadxlsurl = that.global.uploadurl;
        that.uploadfileconfig.xlsfilepath = that.global.xlsfilepath;

        that._autoservice.getMOM({ "flag": "filebyid", "id": that.global.xlsid }).subscribe(data => {
            that.uploadfileconfig.maxFilesize = data.data[0]._filesize;
            that.uploadfileconfig.acceptedFiles = data.data[0]._filetype;
        }, err => {
            console.log("Error");
        }, () => {
            console.log("Complete");
        })
    }

    // File Upload

    onBeforeUpload(event) {
        event.formData.append("bulktype", "passenger");
        event.formData.append("enttid", this._enttdetails.enttid);
        event.formData.append("wsautoid", this._enttdetails.wsautoid);
        event.formData.append("cuid", this.loginUser.ucode);
    }

    onFileUpload(event) {
        var that = this;
        that.uploadFileDT = [];

        var xlsfile = JSON.parse(event.xhr.response).data.funsave_multipassengerinfo;

        if (xlsfile.msgid == 401) {
            that._msg.Show(messageType.error, "Error", xlsfile.msg);
        }
        else if (xlsfile.msgid == 1) {
            for (var i = 0; i < xlsfile.length; i++) {
                that.uploadFileDT.push({ "athurl": xlsfile[i].path.replace(that.uploadfileconfig.xlsfilepath, "") });
            }

            that._msg.Show(messageType.success, "Success", xlsfile.msg);

            that.closeBulkUploadPopup();
            that.getPassengerDetails();
        }
        else {
            that._msg.Show(messageType.warn, "Warning", xlsfile.msg);
        }
    }


    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
