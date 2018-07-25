import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';

declare var $: any;

@Component({
    templateUrl: 'addmom.comp.html'
})

export class AddMOMComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    title: any;
    validSuccess: Boolean = true;

    fldgroupDT: any = [];

    momid: number = 0;
    groupdt: any = [];
    grpcd: string = "";
    key: string = "";
    val: string = "";
    icon: string = "";
    typ: string = "";
    remark: string = "";

    mode: string = "";
    isactive: boolean = true;

    fieldDT: any = [];

    headertitle: string = "";
    mtype: string = "";
    isdynmenu: boolean = false;

    uploadiconconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _loginservice: LoginService,
        private _autoservice: CommonService, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getUploadConfig();
    }

    ngOnInit() {
        this.getMOMGroup();
        this.editMasterOfMaster();
    }

    // Edit MOM

    editMasterOfMaster() {
        var that = this;

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.momid = params['id'];
                that.getMOMByID(that.momid);

                $('#group').prop('disabled', true);
                $('#key').prop('disabled', true);
                $('#val').prop('disabled', false);
            }
            else {
                setTimeout(function () {
                    $("#Group").focus();
                }, 0);

                $('#group').prop('disabled', true);
                $('#key').prop('disabled', false);
                $('#val').prop('disabled', false);
            }
        });
    }

    // Upload File Details

    getUploadConfig() {
        var that = this;

        that.uploadiconconfig.server = that.global.serviceurl + "uploads";
        that.uploadiconconfig.serverpath = that.global.serviceurl;
        that.uploadiconconfig.uploadurl = that.global.uploadurl;
        that.uploadiconconfig.filepath = that.global.filepath;

        that._autoservice.getMOM({ "flag": "filebyid", "id": that.global.photoid }).subscribe(data => {
            that.uploadiconconfig.maxFilesize = data.data[0]._filesize;
            that.uploadiconconfig.acceptedFiles = data.data[0]._filetype;
        }, err => {
            console.log("Error");
        }, () => {
            console.log("Complete");
        })
    }

    // Get File Size

    getFileSize(bytes) {
        return bytes = (bytes / 1024).toFixed(2);
    }

    // Icon Upload

    onIconUpload(event, row) {
        var that = this;
        var imgfile = JSON.parse(event.xhr.response);
        var imgpath = imgfile[0].path.replace(that.uploadiconconfig.filepath, "");
        var imgsize = parseFloat(that.getFileSize(imgfile[0].size));

        if (imgsize > 150) {
            that._msg.Show(messageType.error, "Error", "Allowed only below 150 KB File");
        }
        else {
            row.fldval = imgfile[0].path.replace(that.uploadiconconfig.filepath, "");
        }
    }

    // Remove Icon

    removeIconUpload(row) {
        row.fldval = "";
    }

    // Reset Fields

    resetMOMFields() {
        this.momid = 0;
        this.key = "";
        this.val = "";
        this.icon = "";
        this.remark = "";
        this.isactive = true;
        this.mode = "";
    }

    // Get MOM Group

    getMOMGroup() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['grpcd'] !== undefined) {
                that.grpcd = params['grpcd'];

                that._autoservice.getMOM({ "flag": "group", "grpcd": that.grpcd }).subscribe(data => {
                    try {
                        if (data.data.length > 0) {
                            that.headertitle = data.data[0].grpnm;
                            that.mtype = data.data[0].typ;
                            that.isdynmenu = data.data[0].isdynmenu;
                            that.fieldDT = data.data[0].field;

                            var fldgroupDT = that.fieldDT.filter(a => a.fldtype == "checkbox");

                            for (var i = 0; i < fldgroupDT.length; i++) {
                                var fldrow = fldgroupDT[i];
                                that.fillDynamicDropDown(fldrow.fldgroup);
                            }

                            that.isactive = data.data[0].isactive;
                            that.mode = data.data[0].mode;
                        }
                        else {
                            that.headertitle = "";
                            that.mtype = "";
                            that.isdynmenu = false;
                            that.fieldDT = [];
                            that.isactive = true;
                            that.mode = "";
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
        });

        that._autoservice.getMOM({ "flag": "group", "grpcd": "" }).subscribe(data => {
            that.groupdt = data.data;
            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, 'Error', err);
            commonfun.loaderhide();
        }, () => {
            // console.log("Complete");
        })
    }

    fillDynamicDropDown(group) {
        var that = this;
        commonfun.loader();

        that._autoservice.getMOM({ "flag": "", "group": group }).subscribe(data => {
            that.fldgroupDT = data.data;
            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, 'Error', err);
            commonfun.loaderhide();
        }, () => {
            // console.log("Complete");
        })
    }

    // Active / Deactive Data

    active_deactiveMOMInfo() {
        var that = this;

        var params = {
            "autoid": that.momid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        that._autoservice.saveMOM(params).subscribe(data => {
            try {
                var dataResult = data.data[0].funsave_mom;
                var msg = dataResult.msg;
                var msgid = dataResult.msgid;

                if (msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", msg);
                    that.editMasterOfMaster();
                }
                else {
                    that._msg.Show(messageType.error, "Error", msg);
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            console.log(err);
        }, () => {
            // console.log("Complete");
        });
    }

    // Validation MOM Fields

    isValidateFields() {
        if (this.grpcd === "") {
            this._msg.Show(messageType.error, 'Error', "Please Select Group");
            $("#grpcd").focus();
            return false;
        }
        if (this.key === "") {
            this._msg.Show(messageType.error, 'Error', "Please Enter Key");
            $("#key").focus();
            return false;
        }
        if (this.val === "") {
            this._msg.Show(messageType.error, 'Error', "Please Enter Value");
            $("#val").focus();
            return false;
        }

        return true;
    }

    // Save MOM Fields

    saveMOMInfo() {
        var that = this;

        that.validSuccess = that.isValidateFields();

        var flditem = null;
        var grpitem = null;
        var grprights = "";
        var flddata = [];
        var fldval = "";

        for (var i = 0; i <= that.fieldDT.length - 1; i++) {
            flditem = null;
            flditem = that.fieldDT[i];

            if (flditem.fldtype == "checkbox") {
                for (var i = 0; i <= that.fldgroupDT.length - 1; i++) {
                    grpitem = null;
                    grpitem = that.fldgroupDT[i];

                    if (grpitem !== null) {
                        $("#grpitem" + grpitem.key).find("input[type=checkbox]").each(function () {
                            grprights += (this.checked ? $(this).val() + "," : "");
                        });

                        fldval = "[" + grprights.slice(0, -1) + "]";
                    }
                }

                if (grprights != "") {
                    flddata.push({ "fldname": "Fees Type", "fldtype": "checkbox", "fldval": fldval })
                }
                else {
                    flddata = [];
                }
            }
            else {
                flddata = that.fieldDT.filter(a => a.fldval != undefined).filter(a => a.fldval != "");
            }
        }

        var saveMOM = {
            "autoid": that.momid,
            "group": that.grpcd,
            "key": that.key,
            "val": that.val,
            "icon": that.icon,
            "remark": that.remark,
            "extra": flddata,
            "typ": that.mtype,
            "enttid": that.mtype == "enttwise" ? that._enttdetails.enttid : 0,
            "wsautoid": that.mtype == "wswise" ? that._enttdetails.wsautoid : that.mtype == "enttwise" ? that._enttdetails.wsautoid : 0,
            "uidcode": that.loginUser.login
        }

        if (that.validSuccess) {
            commonfun.loader();

            that._autoservice.saveMOM(saveMOM).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_mom;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid !== "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetMOMFields();
                        }
                        else {
                            that.backViewData();
                        }
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", "Error 101 : " + msg);
                    }
                }
                catch (e) {
                    that._msg.Show(messageType.error, 'Error', e.message);
                }

                commonfun.loaderhide();
            }, err => {
                that._msg.Show(messageType.error, 'Error', err);
                commonfun.loaderhide();
            }, () => {
                // console.log("Complete");
            });
        }
    }

    // Get MOM Details By ID

    getMOMByID(pmomid: number) {
        var that = this;

        that._autoservice.getMOM({ "flag": "id", "autoid": pmomid }).subscribe(data => {
            var dataresult = data.data;

            that.momid = dataresult[0].autoid;
            that.grpcd = dataresult[0].group;
            that.key = dataresult[0].key;
            that.val = dataresult[0].val;
            that.icon = dataresult[0].icon;
            that.remark = dataresult[0].remark;
            that.typ = dataresult[0].typ;
            that.isactive = dataresult[0].isactive;
            that.mode = dataresult[0].mode;

            for (var i = 0; i < that.fieldDT.length; i++) {
                var ifldrow = that.fieldDT[i];
                var extraflddt = dataresult[0].extra.filter(a => a.fldname == ifldrow.fldname).filter(a => a.fldtype == ifldrow.fldtype);

                for (var j = 0; j < extraflddt.length; j++) {
                    var jfldrow = extraflddt[j];

                    if (jfldrow.fldtype == "checkbox") {
                        var _grprights = null;
                        var _grpids = null;

                        _grprights = null;
                        _grprights = jfldrow.fldval;

                        if (_grprights != null) {
                            for (var i = 0; i < _grprights.length; i++) {
                                _grpids = null;
                                _grpids = _grprights[i];

                                $("#grp" + _grpids).prop('checked', true);
                            }
                        }
                    }
                    else {
                        ifldrow.fldval = jfldrow.fldval;
                    }
                }
            }

            if (that.typ == "global") {
                $('#val').prop('disabled', true);
            }
            else {
                $('#val').prop('disabled', false);
            }

            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, 'Error', err);
            commonfun.loaderhide();
        }, () => {
            // console.log("Complete");
        })
    }

    // Back For View Data

    backViewData() {
        if (this.mtype == "all") {
            this._router.navigate(['/admin/master', this.grpcd]);
        }
        else {
            this._router.navigate(['/master/other', this.grpcd]);
        }
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}