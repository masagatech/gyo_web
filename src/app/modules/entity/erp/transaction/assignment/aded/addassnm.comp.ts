import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AssignmentService } from '@services/erp';

declare var google: any;

@Component({
    templateUrl: 'addassnm.comp.html',
    providers: [CommonService]
})

export class AddAssignmentComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    assnmid: number = 0;
    title: string = "";
    assnmupload: string = "";
    subid: number = 0;
    clsid: number = 0;
    msg: string = "";
    frmdt: any = "";
    todt: any = "";

    subjectDT: any = [];
    classDT: string = "";

    uploadAssignmentDT: any = [];
    global = new Globals();
    uploadconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };
    chooseLabel: string = "";

    private subscribeParameters: any;

    constructor(private _assnmservice: AssignmentService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillClassDropDown();
        this.fillSubjectDropDown();
    }

    public ngOnInit() {
        this.getAssignmentDetails();
    }

    // Fill Class And Subject Drop Down

    fillClassDropDown() {
        var that = this;
        commonfun.loader();

        that._assnmservice.getAssignmentDetails({
            "flag": "classddl", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that._enttdetails.issysadmin
        }).subscribe(data => {
            try {
                that.classDT = data.data;
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

    fillSubjectDropDown() {
        var that = this;
        commonfun.loader();

        that._assnmservice.getAssignmentDetails({
            "flag": "subjectddl", "classid": that.clsid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.subjectDT = data.data;
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

    // File Upload

    getUploadConfig() {
        var that = this;

        that.uploadconfig.server = that.global.serviceurl + "uploads";
        that.uploadconfig.serverpath = that.global.serviceurl;
        that.uploadconfig.uploadurl = that.global.uploadurl;
        that.uploadconfig.filepath = that.global.filepath;

        that._autoservice.getMOM({ "flag": "filebyid", "id": "29" }).subscribe(data => {
            that.uploadconfig.maxFilesize = data.data[0]._filesize;
            that.uploadconfig.acceptedFiles = data.data[0]._filetype;
        }, err => {
            console.log("Error");
        }, () => {
            console.log("Complete");
        })
    }

    onUpload(event) {
        var that = this;
        var imgfile = [];
        that.uploadAssignmentDT = [];

        imgfile = JSON.parse(event.xhr.response);

        for (var i = 0; i < imgfile.length; i++) {
            that.uploadAssignmentDT.push({ "athurl": imgfile[i].path.replace(that.uploadconfig.filepath, "") })
        }

        console.log(that.uploadAssignmentDT);
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

    removePhotoUpload() {
        this.uploadAssignmentDT.splice(0, 1);
    }

    // Clear Fields

    resetAssignmentFields() {
        var that = this;

        that.title = "";
        that.msg = "";
        that.frmdt = "";
        that.todt = "";
        that.subid = 0;
        that.clsid = 0;
    }

    // Save Assignment

    saveAssignment() {
        var that = this;

        if (that.title == "") {
            that._msg.Show(messageType.error, "Error", "Enter Title");
            $(".title").focus();
        }
        else if (that.subid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Subject");
            $(".subject").focus();
        }
        else if (that.clsid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Class");
            $(".class").focus();
        }
        else if (that.msg == "") {
            that._msg.Show(messageType.error, "Error", "Enter Message");
            $(".msg").focus();
        }
        else if (that.frmdt == "") {
            that._msg.Show(messageType.error, "Error", "Enter From Time");
            $(".frmdt").focus();
        }
        else if (that.todt == "") {
            that._msg.Show(messageType.error, "Error", "Enter To Time");
            $(".todt").focus();
        }
        else {
            commonfun.loader();

            var saveassignment = {
                "assnmid": that.assnmid,
                "title": that.title,
                "subid": that.subid,
                "clsid": that.clsid,
                "toid": that.clsid,
                "assnmby": that.loginUser.loginid,
                "msg": that.msg,
                "frmdt": that.frmdt,
                "todt": that.todt,
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid
            }

            this._assnmservice.saveAssignmentInfo(saveassignment).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_assignmentinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetAssignmentFields();
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

    // Get Assignment

    getAssignmentDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.assnmid = params['id'];

                that._assnmservice.getAssignmentDetails({
                    "flag": "edit", "assnmid": that.assnmid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
                    "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
                }).subscribe(data => {
                    try {
                        that.assnmid = data.data[0].assnmid;
                        that.title = data.data[0].title;
                        that.subid = data.data[0].subid;
                        that.clsid = data.data[0].clsid;
                        that.msg = data.data[0].msg;
                        that.frmdt = data.data[0].frmdt;
                        that.todt = data.data[0].todt;
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
                that.resetAssignmentFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/erp/transaction/assignment']);
    }
}
