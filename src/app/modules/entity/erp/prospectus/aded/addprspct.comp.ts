import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ProspectusService } from '@services/erp';

declare var google: any;

@Component({
    templateUrl: 'addprspct.comp.html',
    providers: [CommonService]
})

export class AddProspectusComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    boardDT: any = [];

    prspctparamid: number = 0;
    prspctid: number = 0;
    ayid: number = 0;
    boardid: number = 0;
    title: string = "";
    frmno: number = 0;
    tono: number = 0;
    fees: any = "";

    // Upload Form

    global = new Globals();

    uploadFormDT: any = [];
    uploadformconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };
    chooseLabel: string = "";

    remark: string = "";

    private subscribeParameters: any;

    constructor(private _prspctservice: ProspectusService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillAYDropDown();
        this.getUploadConfig();
    }

    public ngOnInit() {
        this.editProspectusDetails();
    }

    // Fill Academic Year Down

    fillAYDropDown() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._prspctservice.getProspectusDetails({
            "flag": "dropdown", "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    if (sessionStorage.getItem("_ayid_") != null) {
                        that.ayid = parseInt(sessionStorage.getItem("_ayid_"));
                    }
                    else {
                        defayDT = that.ayDT.filter(a => a.iscurrent == true);

                        if (defayDT.length > 0) {
                            that.ayid = defayDT[0].key;
                        }
                        else {
                            that.ayid = that._enttdetails.ayid;
                        }
                    }
                }

                that.boardDT = data.data.filter(a => a.group == "board");
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

    // Clear Prospectus Fields

    resetProspectusFields() {
        var that = this;

        that.prspctid = 0;
        that.boardid = 0;
        that.title = "";
        that.frmno = 0;
        that.tono = 0;
        that.fees = "";
        that.uploadFormDT = [];
        that.chooseLabel = "Upload Form";

        that.remark = "";
    }

    getUploadConfig() {
        var that = this;

        that._autoservice.getMOM({ "flag": "allfile" }).subscribe(data => {
            that.uploadformconfig.server = that.global.serviceurl + "uploads";
            that.uploadformconfig.serverpath = that.global.serviceurl;
            that.uploadformconfig.uploadurl = that.global.uploadurl;
            that.uploadformconfig.filepath = that.global.filepath;
            that.uploadformconfig.maxFilesize = data.data[0]._filesize;
            that.uploadformconfig.acceptedFiles = data.data[0]._filetype;
        }, err => {
            console.log("Error");
        }, () => {
            console.log("Complete");
        })
    }

    // Form Upload

    onFormUpload(event) {
        var that = this;
        var imgfile = [];
        that.uploadFormDT = [];

        imgfile = JSON.parse(event.xhr.response);

        setTimeout(function () {
            for (var i = 0; i < imgfile.length; i++) {
                that.uploadFormDT.push({ "athurl": imgfile[i].path.replace(that.uploadformconfig.filepath, "") })
            }
        }, 1000);
    }

    removeFormUpload() {
        this.uploadFormDT.splice(0, 1);
    }

    // Save Prospectus

    isValidation() {
        var that = this;

        if (that.ayid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Academic Year");
            $(".ayname").focus();
            return false;
        }
        else if (that.boardid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Board");
            $(".boardname").focus();
            return false;
        }
        else if (that.title == "") {
            that._msg.Show(messageType.error, "Error", "Enter Title");
            $(".prspcttitle").focus();
            return false;
        }
        else if (that.frmno == 0) {
            that._msg.Show(messageType.error, "Error", "Enter From No");
            $(".frmno").focus();
            return false;
        }
        else if (that.tono == 0) {
            that._msg.Show(messageType.error, "Error", "Enter To No");
            $(".tono").focus();
            return false;
        }
        else if (that.fees == "") {
            that._msg.Show(messageType.error, "Error", "Enter Fees");
            $(".fees").focus();
            return false;
        }
        else if (parseInt(that.frmno.toString()) > parseInt(that.tono.toString())) {
            that._msg.Show(messageType.error, "Error", "Should be To No grater than From No");
            $(".frmno").focus();
            return false;
        }

        return true;
    }

    saveProspectus() {
        var that = this;
        var isvalid = that.isValidation();

        if (isvalid) {
            commonfun.loader();

            var saveProspectus = {
                "prspctid": that.prspctid,
                "boardid": that.boardid,
                "title": that.title,
                "frmno": that.frmno,
                "tono": that.tono,
                "noofform": (that.tono - that.frmno) + 1,
                "fees": that.fees,
                "uploadform": that.uploadFormDT.length > 0 ? that.uploadFormDT[0].athurl : "",
                "remark": that.remark,
                "cuid": that.loginUser.ucode,
                "ayid": that.ayid,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid
            }

            this._prspctservice.saveProspectusInfo(saveProspectus).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_prospectusinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetProspectusFields();
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

    // Get Prospectus

    editProspectusDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.prspctparamid = params['id'];
                that.getProspectusDetails();
            }
            else {
                that.resetProspectusFields();
                commonfun.loaderhide();
            }
        });
    }

    getProspectusDetails() {
        var that = this;
        commonfun.loader();

        that._prspctservice.getProspectusDetails({
            "flag": "edit", "prspctid": that.prspctparamid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                var viewprspct = data.data;

                if (viewprspct.length > 0) {
                    that.prspctid = viewprspct[0].prspctid;
                    that.boardid = viewprspct[0].boardid;
                    that.title = viewprspct[0].title;

                    that.frmno = viewprspct[0].frmno;
                    that.tono = viewprspct[0].tono;
                    that.fees = viewprspct[0].fees;

                    if (viewprspct[0].uploadform == "" || viewprspct[0].uploadform == null) {
                        that.uploadFormDT = [];
                        that.chooseLabel = "Upload Form";
                    }
                    else {
                        that.uploadFormDT.push({ "athurl": viewprspct[0].uploadform });
                        that.chooseLabel = "Change Uploaded Form";
                    }

                    that.remark = viewprspct[0].remark;
                    that.ayid = viewprspct[0].ayid;
                }
                else {
                    that.resetProspectusFields();
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
        this._router.navigate(['/admission/prospectus']);
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}
