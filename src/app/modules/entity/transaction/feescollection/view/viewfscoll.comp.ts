import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { FeesService } from '@services/erp';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;

@Component({
    templateUrl: 'viewfscoll.comp.html',
    providers: [CommonService]
})

export class ViewFeesCollectionComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    schoolDT: any = [];
    ayDT: any = [];
    classDT: any = [];

    studentDT: any = [];
    selectedStudent = [];
    studid: number = 0;

    enttid: number = 0;
    ayid: number = 0;
    classid: number = 0;
    classfees: any = "";
    studname: string = "";

    feesCollDT: any = [];

    // Upload File

    uploadFileDT: any = [];
    uploadfileconfig = { server: "", serverpath: "", uploadxlsurl: "", xlsfilepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };

    constructor(private _feesservice: FeesService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getUploadConfig();
        this.fillSchoolDropDown();
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
        event.formData.append("bulktype", "studentfees");
        event.formData.append("ayid", this.ayid);
        event.formData.append("clsid", this.classid);
        event.formData.append("enttid", this.enttid);
        event.formData.append("wsautoid", this._enttdetails.wsautoid);
        event.formData.append("cuid", this.loginUser.ucode);
    }

    onFileUpload(event) {
        var that = this;
        that.uploadFileDT = [];

        console.log(JSON.parse(event.xhr.response));

        var xlsfile = JSON.parse(event.xhr.response).data.funsave_multistudentfees;

        if (xlsfile.msgid == 401) {
            that._msg.Show(messageType.error, "Error", xlsfile.msg);
        }
        else if (xlsfile.msgid == 1) {
            for (var i = 0; i < xlsfile.length; i++) {
                that.uploadFileDT.push({ "athurl": xlsfile[i].path.replace(that.uploadfileconfig.xlsfilepath, "") });
            }
            
            that._msg.Show(messageType.success, "Success", xlsfile.msg);

            that.closeBulkUploadPopup();
            that.getFeesCollection();
        }
        else {
            that._msg.Show(messageType.warn, "Warning", xlsfile.msg);
        }
    }

    // Fill School Drop Down

    fillSchoolDropDown() {
        var that = this;
        var defschoolDT: any = [];

        commonfun.loader();

        that._feesservice.getFeesStructure({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.schoolDT = data.data[0];

                if (that.schoolDT.length > 0) {
                    defschoolDT = that.schoolDT.filter(a => a.iscurrent == true);

                    if (defschoolDT.length > 0) {
                        that.enttid = defschoolDT[0].enttid;
                    }
                    else {
                        that.enttid = that._enttdetails.enttid;
                    }
                    
                    that.fillDropDownList();
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

    // Fill Academic Year, And Class

    fillDropDownList() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._feesservice.getFeesStructure({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data[1].filter(a => a.group == "ay");

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

                that.getFeesCollection();
                that.classDT = data.data[1].filter(a => a.group == "class");
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
        let that = this;
        let query = event.query;

        that._autoservice.getERPAutoData({
            "flag": "student",
            "uid": that.loginUser.uid,
            "ucode": that.loginUser.ucode,
            "utype": that.loginUser.utype,
            "enttid": that.enttid,
            "wsautoid": that._enttdetails.wsautoid,
            "issysadmin": that.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            that.studentDT = data.data;
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Student

    selectStudentData(event) {
        this.studid = event.value;
        this.studname = event.label;
    }

    // Add Fees Collection

    addFeesCollection(row) {
        Cookie.delete("addeditfees");

        var studrow = {
            "enttid": row.enttid, "ayid": row.ayid, "classid": row.classid, "studid": row.studid
        }

        Cookie.set("addeditfees", JSON.stringify(studrow));
        this._router.navigate(['/transaction/feescollection/student/add']);
    }

    viewFeesCollection(row) {
        Cookie.delete("filterStudent");

        var studrow = {
            "enttid": row.enttid, "ayid": row.ayid, "classid": row.classid, "studid": row.studid
        }

        Cookie.set("filterStudent", JSON.stringify(studrow));
        this._router.navigate(['/transaction/feescollection/student/history']);
    }

    totalFees() {
        var that = this;
        var field: any = [];

        var totalfees = 0;

        for (var i = 0; i < that.feesCollDT.length; i++) {
            field = that.feesCollDT[i];
            totalfees += parseFloat(field.feescoll);
        }

        return totalfees;
    }

    // Get Class Fees

    getFeesCollection() {
        var that = this;
        commonfun.loader();

        that._feesservice.getFeesCollection({
            "flag": "all", "ayid": that.ayid, "classid": that.classid, "studid": that.studid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "enttid": that.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.feesCollDT = data.data;

                if (data.data.length > 0) {
                    that.classfees = data.data[0].classfees;
                }
                else {
                    that.classfees = 0;
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

    openBulkUploadPopup() {
        var that = this;

        if (that.ayid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Academic Year");
        }
        else if (that.classid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Class");
        }
        else {
            $("#bulkUploadModal").modal('show');
        }
    }

    closeBulkUploadPopup() {
        $("#bulkUploadModal").modal("hide");
    }
}
