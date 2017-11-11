import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ContentService } from '@services/master';

declare var google: any;

@Component({
    templateUrl: 'addcntdtls.comp.html',
    providers: [CommonService]
})

export class AddContentDetailsComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    standardDT: string = "";
    subjectDT: any = [];

    paramcid: number = 0;
    cid: number = 0;
    ctitle: string = "";
    cdid: number = 0;
    stdid: number = 0;
    subid: number = 0;
    topicname: string = "";
    isfree: boolean = false;

    contentDetailsDT: any = [];
    selectedContentDetails: any = [];
    isEditContentDetails: boolean = false;

    uploadFileDT: any = [];
    global = new Globals();
    uploadconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };

    private subscribeParameters: any;

    constructor(private _cntservice: ContentService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.getFileUploadConfig();
        this.fillStandardDropDown();
        this.fillSubjectDropDown();
    }

    public ngOnInit() {
        this.editContentInfo();
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

    getFileUploadConfig() {
        var that = this;

        that._autoservice.getMOM({ "flag": "allfile" }).subscribe(data => {
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

    onFileUpload(event) {
        var that = this;
        var imgfile = [];
        that.uploadFileDT = [];

        imgfile = JSON.parse(event.xhr.response);

        console.log(imgfile);

        setTimeout(function () {
            for (var i = 0; i < imgfile.length; i++) {
                that.uploadFileDT.push({ "athurl": imgfile[i].path.replace(that.uploadconfig.filepath, "") })
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

    removeFileUpload() {
        this.uploadFileDT.splice(0, 1);
    }

    // Add Content Details

    isValidContentDetails() {
        var that = this;

        if (that.subid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Standard");
            return false;
        }
        else if (that.subid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Subject");
            return false;
        }
        else if (that.cid == 0) {
            that._msg.Show(messageType.error, "Error", "This Subject No Any Content");
            return false;
        }
        else {
            if (that.isEditContentDetails == false) {
                if (that.contentDetailsDT.length != 0) {
                    for (var i = 0; i < that.contentDetailsDT.length; i++) {
                        var issflds = that.contentDetailsDT[i];

                        if (issflds.topicname == that.topicname) {
                            that._msg.Show(messageType.error, "Error", "This Topic Name is Already Used");
                            return false;
                        }
                    }
                }
            }
            else {
                var _cntdtls = that.contentDetailsDT.filter(a => a.topicname != that.topicname);

                if (_cntdtls.length != 0) {
                    for (var i = 0; i < _cntdtls.length; i++) {
                        var existsflds = _cntdtls[i];

                        if (existsflds.topicname == that.topicname) {
                            that._msg.Show(messageType.error, "Error", "This Topic Name is Already Used");
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    }

    addContentDetails() {
        var that = this;
        var isvalidcntdtls: boolean = false;

        isvalidcntdtls = that.isValidContentDetails();

        if (isvalidcntdtls) {
            that.contentDetailsDT.push({
                "cdid": that.cdid, "cid": 0, "stdid": that.stdid, "subid": that.subid, "topicname": that.topicname,
                "uploadfile": that.uploadFileDT.length == 0 ? "" : that.uploadFileDT[0].athurl,
                "isfree": that.isfree, "cuid": "", "enttid": 0, "wsautoid": 0, "isactive": true
            });

            that.resetContentDetails();
        }
    }

    // Edit Prospectus No

    editContentDetails(row) {
        var that = this;

        that.selectedContentDetails = row;
        that.topicname = row.topicname;
        that.uploadFileDT.push({ "athurl": row.uploadfile });
        that.isfree = row.isfree;

        that.isEditContentDetails = true;
    }

    // Delete Prospectus No

    deleteContentDetails(row) {
        row.isactive = false;
    }

    // Update Prospectus No

    updateContentDetails() {
        var that = this;
        var isvalidcntdtls: boolean = false;

        isvalidcntdtls = that.isValidContentDetails();

        if (isvalidcntdtls) {
            that.selectedContentDetails.topicname = that.topicname;
            that.selectedContentDetails.uploadfile = that.uploadFileDT.length == 0 ? "" : that.uploadFileDT[0].athurl;
            that.selectedContentDetails.isfree = that.isfree;
            that.isEditContentDetails = false;

            that.resetContentDetails();
        }
    }

    // Reset Prospectus No

    resetContentInfo() {
        var that = this;

        that.cid = 0;
        that.ctitle = "";
        that.contentDetailsDT = [];
    }

    // Reset Prospectus No

    resetContentDetails() {
        var that = this;

        that.topicname = "";
        that.uploadFileDT = [];
        that.isfree = false;
        that.isEditContentDetails = false;
    }

    // Save Content Details

    saveContentDetails() {
        var that = this;

        if (that.stdid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Standard");
            $(".stdname").focus();
        }
        else if (that.subid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Subject");
            $(".subname").focus();
        }
        else if (that.cid == 0) {
            that._msg.Show(messageType.error, "Error", "This Subject No Any Content");
            return false;
        }
        else if (that.contentDetailsDT.length == 0) {
            that._msg.Show(messageType.error, "Error", "Please Atleast 1 Content Details");
        }
        else {
            commonfun.loader();

            for (var i = 0; i < that.contentDetailsDT.length; i++) {
                that.contentDetailsDT[i].cid = that.cid;
                that.contentDetailsDT[i].stdid = that.stdid;
                that.contentDetailsDT[i].subid = that.subid;
                that.contentDetailsDT[i].cuid = that.loginUser.ucode;
                that.contentDetailsDT[i].wsautoid = that._wsdetails.wsautoid;
            }

            this._cntservice.saveContentDetails({ "contentdetails": that.contentDetailsDT }).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_contentdetails;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetContentInfo();
                            that.subid = 0;
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

    // Get Content Details

    editContentInfo() {
        var that = this;

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.paramcid = params['id'];
                that.getContentDetails();
            }
            else {
                that.resetContentDetails();
                that.paramcid = 0;
                that.subid = 0;
            }
        });
    }

    getContentDetails() {
        var that = this;
        commonfun.loader();

        that._cntservice.getContentDetails({
            "flag": "details", "cid": that.paramcid, "stdid": that.stdid, "subid": that.subid, "uid": that.loginUser.uid,
            "utype": that.loginUser.utype, "ctype": that.loginUser.ctype, "wsautoid": that._wsdetails.wsautoid, "issysadmin": that.loginUser.issysadmin,
        }).subscribe(data => {
            try {
                var viewcntdtls = data.data;

                if (viewcntdtls.length > 0) {
                    if (that.paramcid != 0) {
                        that.stdid = viewcntdtls[0].stdid;
                        that.fillSubjectDropDown();

                        that.subid = viewcntdtls[0].subid;
                    }

                    that.cid = viewcntdtls[0].cid;
                    that.ctitle = viewcntdtls[0].ctitle;

                    that.contentDetailsDT = viewcntdtls[0].cntdtls == null ? [] : viewcntdtls[0].cntdtls;
                }
                else {
                    that.resetContentInfo();
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
        this._router.navigate(['/workspace/contentdetails']);
    }
}
