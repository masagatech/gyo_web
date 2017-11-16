import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AdmissionService } from '@services/erp';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var ActiveXObject: any;

@Component({
    templateUrl: 'uploadadmsn.comp.html',
    providers: [CommonService]
})

export class UploadAdmissionComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    ayDT: any = [];
    classDT: any = [];

    ayid: number = 0;
    classid: number = 0;

    studentDT: any = [];

    // Upload Photo

    uploadFileDT: any = [];
    uploadfileconfig = { server: "", serverpath: "", uploadxlsurl: "", xlsfilepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };
    chooseLabel: string = "";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _admsnservice: AdmissionService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getUploadConfig();
    }

    public ngOnInit() {
        var that = this;

        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Upload

    getUploadConfig() {
        var that = this;

        that._autoservice.getMOM({ "flag": "filebyid", "id": 24 }).subscribe(data => {
            that.uploadfileconfig.server = that.global.serviceurl + "exceluploads";
            that.uploadfileconfig.serverpath = that.global.serviceurl;
            that.uploadfileconfig.uploadxlsurl = that.global.uploadurl;
            that.uploadfileconfig.xlsfilepath = that.global.xlsfilepath;
            that.uploadfileconfig.maxFilesize = data.data[0]._filesize;
            that.uploadfileconfig.acceptedFiles = data.data[0]._filetype;
        }, err => {
            console.log("Error");
        }, () => {
            console.log("Complete");
        })
    }

    // File Upload

    onFileUpload(event) {
        var that = this;
        var xlsfile = [];
        that.uploadFileDT = [];

        xlsfile = JSON.parse(event.xhr.response);

        for (var i = 0; i < xlsfile.length; i++) {
            that.uploadFileDT.push({ "athurl": xlsfile[i].path.replace(that.uploadfileconfig.xlsfilepath, "") });
        }

        that.getExcelData();
    }

    // Fill Entity, Standard, Month DropDown

    fillDropDownList() {
        var that = this;
        var defayDT: any = [];
        commonfun.loader();

        that._admsnservice.getStudentDetails({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    defayDT = that.ayDT.filter(a => a.iscurrent == true);

                    if (defayDT.length > 0) {
                        that.ayid = defayDT[0].key;
                    }
                    else {
                        that.ayid = 0;
                    }
                }

                that.classDT = data.data.filter(a => a.group === "class");
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

    getExcelData() {
        var that = this;

        that._autoservice.excelupload({}).subscribe(data => {
            try {
                that.studentDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/erp/student']);
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
