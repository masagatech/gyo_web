import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AdmissionService } from '@services/erp';

declare var $: any;

@Component({
    templateUrl: 'viewadmsn.comp.html'
})

export class ViewAdmissionComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    isShowGrid: boolean = true;
    isShowList: boolean = false;

    ayDT: any = [];
    prospectusDT: any = [];
    boardDT: any = [];
    classDT: any = [];
    genderDT: any = [];
    castCategoryDT: any = [];

    studname: string = "";
    ayid: number = 0;
    prspctid: number = 0;
    boardid: number = 0;
    classid: number = 0;
    gender: string = "";
    castcatid: string = "";
    status: string = "";

    studentDT: any = [];
    selectefFilterRow: any = {};

    // Upload File

    uploadFileDT: any = [];
    uploadfileconfig = { server: "", serverpath: "", uploadxlsurl: "", xlsfilepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _admsnservice: AdmissionService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getUploadConfig();
        this.fillDropDownList();

        this.viewStudentDataRights();
    }

    public ngOnInit() {
        var that = this;
        that.refreshButtons();

        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Fill Academic Year, Prospectus, Board, Class, Gender And Cast Category DropDown

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
                    if (sessionStorage.getItem("_ayid_") == null) {
                        defayDT = that.ayDT.filter(a => a.iscurrent == true);

                        if (defayDT.length > 0) {
                            that.ayid = defayDT[0].key;
                        }
                        else {
                            that.ayid = that._enttdetails.ayid;
                        }
                        
                        that.getStudentDetails();
                    }
                    else {
                        that.ayid = parseInt(sessionStorage.getItem("_ayid_"));
                    }
                }

                that.prospectusDT = data.data.filter(a => a.group == "prospectus");
                that.boardDT = data.data.filter(a => a.group == "board");
                that.classDT = data.data.filter(a => a.group == "class");
                that.genderDT = data.data.filter(a => a.group == "gender");
                that.castCategoryDT = data.data.filter(a => a.group == "castcategory");
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

    // Reset Student

    resetStudentData() {
        this.prspctid = 0;
        this.boardid = 0;
        this.classid = 0;
        this.gender = "";
        this.castcatid = "";
        this.status = "";

        this.getStudentDetails();
    }

    isshStudent(viewtype) {
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

        that.refreshButtons();
    }

    refreshButtons() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    // View Data Rights

    public viewStudentDataRights() {
        var that = this;

        if (sessionStorage.getItem("_ayid_") != null) {
            that.ayid = parseInt(sessionStorage.getItem("_ayid_"));

            if (sessionStorage.getItem('_fltrid_') != null) {
                if (sessionStorage.getItem('_fltrtype_') == "prospectus") {
                    that.prspctid = parseInt(sessionStorage.getItemt('_fltrid_'));
                }
                else if (sessionStorage.getItem('_fltrtype_') == "board") {
                    that.boardid = parseInt(sessionStorage.getItem('_fltrid_'));
                }
                else if (sessionStorage.getItem('_fltrtype_') == "class") {
                    that.classid = parseInt(sessionStorage.getItem('_fltrid_'));
                }
                else if (sessionStorage.getItem('_fltrtype_') == "gender") {
                    that.gender = sessionStorage.getItem('_fltrid_');
                }
                else if (sessionStorage.getItem('_fltrtype_') == "castcategory") {
                    that.castcatid = sessionStorage.getItem('_fltrid_');
                }
                else if (sessionStorage.getItem('_fltrtype_') == "status") {
                    that.status = sessionStorage.getItem('_fltrid_');
                }
            }
            else {
                that.prspctid = 0;
                that.boardid = 0;
                that.classid = 0;
                that.gender = "";
                that.castcatid = "";
                that.status = "";
            }
        }

        that.getStudentDetails();
    }

    getStudentDetails() {
        var that = this;
        var params = {};

        commonfun.loader("#fltrstud");

        params = {
            "flag": "all", "admtype": "student", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode,
            "utype": that.loginUser.utype, "ayid": that.ayid, "prspctid": that.prspctid, "boardid": that.boardid,
            "classid": that.classid, "gender": that.gender, "castcatid": that.castcatid, "status": that.status, "studid": 0,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        };

        that._admsnservice.getStudentDetails(params).subscribe(data => {
            try {
                that.studentDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#fltrstud");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#fltrstud");
        }, () => {

        })
    }

    public viewDashboardForm() {
        this._router.navigate(['/erp/student/dashboard']);
    }

    public addAdmissionForm() {
        this._router.navigate(['/erp/student/admission']);
    }

    public editAdmissionForm(row) {
        this._router.navigate(['/erp/student/edit', row.enrlmntid]);
    }

    viewStudentDashboard(row) {
        sessionStorage.setItem("_studid_", row.enrlmntid);
        sessionStorage.setItem("_studname_", row.studentname);

        this._router.navigate(['/reports/erp/student/dashboard']);
    }

    // Bulk Upload Students

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
        event.formData.append("bulktype", "student");
        event.formData.append("ayid", this.ayid);
        event.formData.append("enttid", this._enttdetails.enttid);
        event.formData.append("wsautoid", this._enttdetails.wsautoid);
        event.formData.append("cuid", this.loginUser.ucode);
    }

    onFileUpload(event) {
        var that = this;
        that.uploadFileDT = [];

        var xlsfile = JSON.parse(event.xhr.response).data.funsave_multistudentinfo;

        if (xlsfile.msgid == 401) {
            that._msg.Show(messageType.error, "Error", xlsfile.msg);
        }
        else if (xlsfile.msgid == 1) {
            for (var i = 0; i < xlsfile.length; i++) {
                that.uploadFileDT.push({ "athurl": xlsfile[i].path.replace(that.uploadfileconfig.xlsfilepath, "") });
            }

            that._msg.Show(messageType.success, "Success", xlsfile.msg);

            that.closeBulkUploadPopup();
            that.getStudentDetails();
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
