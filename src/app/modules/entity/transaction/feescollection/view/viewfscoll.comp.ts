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

    ayDT: any = [];
    classDT: any = [];

    fclid: number = 0;
    ayid: number = 0;
    classid: number = 0;
    classfees: any = "";

    feesCollDT: any = [];

    // Upload File

    uploadFileDT: any = [];
    uploadfileconfig = { server: "", serverpath: "", uploadxlsurl: "", xlsfilepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };

    private subscribeParameters: any;

    constructor(private _feesservice: FeesService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getUploadConfig();
        this.fillAYAndClassDropDown();
    }

    public ngOnInit() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.classid = params['id'];
                that.getFeesCollection();
            }
            else {
                that.resetAllFields();
                commonfun.loaderhide();
            }
        });
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
        event.formData.append("enttid", this._enttdetails.enttid);
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

    // Reset Fees Details

    resetAllFields() {
        var that = this;

        that.classid = 0;
        that.feesCollDT = [];
    }

    // Fill Academic Year, Class

    fillAYAndClassDropDown() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._feesservice.getClassFees({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data[0].filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    defayDT = that.ayDT.filter(a => a.iscurrent == true);

                    if (defayDT.length > 0) {
                        that.ayid = defayDT[0].id;
                        that.getFeesCollection();
                    }
                    else {
                        that.ayid = 0;
                    }
                }

                that.classDT = data.data[0].filter(a => a.group == "class");
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

    // Add Fees Collection

    addFeesCollection(row) {
        Cookie.delete("addeditfees");

        var studrow = {
            "ayid": row.ayid, "classid": row.classid, "studid": row.studid
        }

        Cookie.set("addeditfees", JSON.stringify(studrow));
        this._router.navigate(['/transaction/feescollection/student/add']);
    }

    viewFeesCollection(row) {
        Cookie.delete("filterStudent");

        var studrow = {
            "ayid": row.ayid, "classid": row.classid, "studid": row.studid
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
            "flag": "all", "ayid": that.ayid, "classid": that.classid, "studid": -1, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
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
