import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ContentService } from '@services/master';

declare var google: any;

@Component({
    templateUrl: 'addcontent.comp.html',
    providers: [CommonService]
})

export class AddContentComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    standardDT: string = "";
    subjectDT: any = [];

    paramcid: number = 0;
    cid: number = 0;
    ctitle: string = "";
    cdesc: string = "";
    stdid: number = 0;
    subid: number = 0;
    remark: string = "";

    uploadPhotoDT: any = [];
    global = new Globals();
    uploadconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };
    chooseLabel: string = "";

    private subscribeParameters: any;

    constructor(private _cntservice: ContentService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.getPhotoUploadConfig();
        this.fillStandardDropDown();
        this.fillSubjectDropDown();
    }

    public ngOnInit() {
        this.editContentDetails();
    }

    // Clear Fields

    resetCotentFields() {
        var that = this;

        that.stdid = 0;
        that.subid = 0;
        that.ctitle = "";
        that.cdesc = "";
        that.remark = "";
        that.chooseLabel = "Upload Photo";
    }

    // Fill Standard Drop Down

    fillStandardDropDown() {
        var that = this;
        commonfun.loader();

        that._cntservice.getContentDetails({
            "flag": "standard", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "wsautoid": that._wsdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.standardDT = data.data;
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

    // Fill Subject Drop Down

    fillSubjectDropDown() {
        var that = this;
        commonfun.loader();

        that._cntservice.getContentDetails({
            "flag": "subject", "stdid": that.stdid, "wsautoid": that._wsdetails.wsautoid
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

    getPhotoUploadConfig() {
        var that = this;

        that._autoservice.getMOM({ "flag": "filebyid", "id": that.global.photoid }).subscribe(data => {
            that.uploadconfig.server = that.global.serviceurl + "uploads";
            that.uploadconfig.serverpath = that.global.serviceurl;
            that.uploadconfig.uploadurl = that.global.uploadurl;
            that.uploadconfig.filepath = that.global.filepath;
            that.uploadconfig.maxFilesize = data.data[0]._filesize;
            that.uploadconfig.acceptedFiles = data.data[0]._filetype;
        }, err => {
            console.log("Error");
        }, () => {
            console.log("Complete");
        })
    }

    onPhotoUpload(event) {
        var that = this;
        var imgfile = [];
        that.uploadPhotoDT = [];

        imgfile = JSON.parse(event.xhr.response);

        console.log(imgfile);

        setTimeout(function () {
            for (var i = 0; i < imgfile.length; i++) {
                that.uploadPhotoDT.push({ "athurl": imgfile[i].path.replace(that.uploadconfig.filepath, "") })
            }
        }, 1000);
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
        this.uploadPhotoDT.splice(0, 1);
    }

    // Save Content

    saveContentInfo() {
        var that = this;

        if (that.stdid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Standard");
            $(".standard").focus();
        }
        else if (that.subid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Subject");
            $(".subject").focus();
        }
        else if (that.ctitle == "") {
            that._msg.Show(messageType.error, "Error", "Enter Title");
            $(".ctitle").focus();
        }
        else if (that.cdesc == "") {
            that._msg.Show(messageType.error, "Error", "Enter Description");
            $(".cdesc").focus();
        }
        else {
            commonfun.loader();

            var savecontent = {
                "cid": that.cid,
                "stdid": that.stdid,
                "subid": that.subid,
                "ctitle": that.ctitle,
                "cdesc": that.cdesc,
                "cphoto": that.uploadPhotoDT.length == 0 ? "" : that.uploadPhotoDT[0].athurl,
                "remark": that.remark,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._wsdetails.wsautoid
            }

            this._cntservice.saveContentInfo(savecontent).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_contentinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetCotentFields();
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

    // Get Content

    editContentDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.paramcid = params['id'];
                that.getContentDetails();
            }
            else {
                that.resetCotentFields();
                commonfun.loaderhide();
            }
        });
    }

    getContentDetails() {
        var that = this;

        that._cntservice.getContentDetails({
            "flag": "edit", "cid": that.paramcid, "stdid": that.stdid, "subid": that.subid, "wsautoid": that._wsdetails.wsautoid
        }).subscribe(data => {
            try {
                if (data.data.length != 0) {
                    if (that.paramcid != 0) {
                        that.stdid = data.data[0].stdid;
                        that.fillSubjectDropDown();

                        that.subid = data.data[0].subid;
                    }

                    that.cid = data.data[0].cid;
                    that.ctitle = data.data[0].ctitle;
                    that.cdesc = data.data[0].cdesc;

                    if (data.data[0].cphoto !== "") {
                        that.uploadPhotoDT.push({ "athurl": data.data[0].cphoto });
                        that.chooseLabel = "Change Photo";
                    }
                    else {
                        that.uploadPhotoDT = [];
                        that.chooseLabel = "Upload Photo";
                    }

                    that.remark = data.data[0].remark;
                }
                else {
                    that.cid = 0;
                    that.ctitle = "";
                    that.cdesc = "";
                    that.remark = "";
                    that.uploadPhotoDT = [];
                    that.chooseLabel = "Upload Photo";
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

    // Back For View Data

    backViewData() {
        this._router.navigate(['/workspace/content']);
    }
}
