import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals, Common } from '@models';
import { ExamService } from '@services/erp';
import { ExamReportService } from '@services/reports';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'viewexamres.comp.html'
})

export class ViewExamResultComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    ayDT: any = [];
    classDT: any = [];
    examTypeDT: any = [];

    studentDT: any = [];
    studsdata: any = [];

    ayid: number = 0;
    clsid: number = 0;
    smstrid: number = 0;

    studid: number = 0;
    studname: string = "";

    examResultDT: any = [];

    // Upload File

    uploadFileDT: any = [];
    uploadfileconfig = { server: "", serverpath: "", uploadxlsurl: "", xlsfilepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _examservice: ExamService,
        private _examrptservice: ExamReportService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillAYAndClassDropDown();
        this.getExamResult();
        this.getUploadConfig();
    }

    public ngOnInit() {

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
        event.formData.append("bulktype", "examresult");
        event.formData.append("savetype", "bulk");
        event.formData.append("wsautoid", this._enttdetails.wsautoid);
        event.formData.append("enttid", this._enttdetails.enttid);
        event.formData.append("ayid", this.ayid);
        event.formData.append("clsid", this.clsid);
        event.formData.append("smstrid", this.smstrid);
        event.formData.append("cuid", this.loginUser.ucode);
    }

    onFileUpload(event) {
        var that = this;
        that.uploadFileDT = [];

        var xlsfile = JSON.parse(event.xhr.response).data.funsave_examresult;

        if (xlsfile.msgid == 401) {
            that._msg.Show(messageType.error, "Error", xlsfile.msg);
        }
        else if (xlsfile.msgid == 1) {
            for (var i = 0; i < xlsfile.length; i++) {
                that.uploadFileDT.push({ "athurl": xlsfile[i].path.replace(that.uploadfileconfig.xlsfilepath, "") });
            }

            that._msg.Show(messageType.success, "Success", xlsfile.msg);
            
            that.closeBulkUploadPopup();
            that.getExamResult();
        }
        else {
            that._msg.Show(messageType.warn, "Warning", xlsfile.msg);
        }
    }

    openBulkUploadPopup() {
        if (this.ayid == 0) {
            this._msg.Show(messageType.error, "Error", "Select Academic Year");
        }
        else if (this.clsid == 0) {
            this._msg.Show(messageType.error, "Error", "Select Class");
        }
        else if (this.smstrid == 0) {
            this._msg.Show(messageType.error, "Error", "Select Exam Type");
        }
        else {
            $("#bulkUploadModal").modal('show');
            this.downloadExamResultFormat("html", "single");
        }
    }

    private downloadExamResultFormat(format, type) {
        let that = this;
        let params = {};

        params = {
            "flag": "download", "ayid": that.ayid, "smstrid": that.smstrid, "classid": that.clsid,
            "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": false,
            "format": format, "type": type
        }

        if (format == "html") {
            commonfun.loader();

            that._examrptservice.downloadExamResult(params).subscribe(data => {
                try {
                    $("#divexmresrpt").html(data._body);
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

            });
        }
        else {
            window.open(Common.getReportUrl("downloadExamResult", params));
        }
    }

    closeBulkUploadPopup() {
        $("#bulkUploadModal").modal("hide");
    }

    // Fill AY, Class And Exam Type Drop Down

    fillAYAndClassDropDown() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._examservice.getExamDetails({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    if (Cookie.get("_ayid_") != null) {
                        that.ayid = parseInt(Cookie.get("_ayid_"));
                    }
                    else {
                        defayDT = that.ayDT.filter(a => a.iscurrent == true);

                        if (defayDT.length > 0) {
                            that.ayid = defayDT[0].id;
                        }
                        else {
                            that.ayid = that._enttdetails.ayid;
                        }
                    }
                }

                that.classDT = data.data.filter(a => a.group == "class");
                that.examTypeDT = data.data.filter(a => a.group == "semester");
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

    // Auto Completed Student

    getStudentData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "student",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "classid": this.clsid,
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "issysadmin": this.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.studentDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Student

    selectStudentData(event) {
        this.studid = event.value;
        this.studname = event.label;

        this.getExamResult();
    }

    getExamResult() {
        var that = this;
        commonfun.loader();

        that._examservice.getExamResult({
            "flag": "all", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ayid": that.ayid, "classid": that.clsid, "studid": that.studid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.examResultDT = data.data;
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

    public addExamResult() {
        this._router.navigate(['/transaction/examresult/add']);
    }

    public editExamResult(row) {
        this._router.navigate(['/transaction/examresult/edit', row.examresid]);
    }
}
