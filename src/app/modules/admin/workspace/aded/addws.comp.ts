import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { WorkspaceService } from '@services/master';

declare var adminloader: any;

@Component({
    templateUrl: 'addws.comp.html'
})

export class AddWorkspaceComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    disablecode: boolean = false;

    wstypeDT: any = [];
    stateDT: any = [];
    cityDT: any = [];
    areaDT: any = [];

    paramsid: number = 0;
    wsautoid: number = 0;
    wscode: string = "";
    wsname: string = "";
    wsdesc: string = "";
    loginid: number = 0;
    lgcode: string = "";
    lgpwd: string = "";
    cpname: string = "";
    mobileno1: string = "";
    mobileno2: string = "";
    email1: string = "";
    email2: string = "";
    address: string = "";
    remark: string = "";
    country: string = "India";
    state: number = 0;
    city: number = 0;
    area: number = 0;
    pincode: number = 0;
    isactive: boolean = false;

    iscompany: boolean = false;
    cmppsngrrate: any = "0";
    cmpenttmaxno: number = 0;

    isschool: boolean = false;
    schpsngrrate: any = "0";
    schenttmaxno: number = 0;

    issysadmin: boolean = false;
    mode: string = "";

    uploadLogoDT: any = [];
    global = new Globals();
    uploadlogoconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };
    chooseLabel: string = "";

    isaddws: boolean = false;
    iseditws: boolean = false;
    isdeletews: boolean = false;

    private subscribeParameters: any;

    constructor(private _wsservice: WorkspaceService, private _autoservice: CommonService, private _routeParams: ActivatedRoute,
        private _router: Router, private _msg: MessageService, private _loginservice: LoginService) {
        this.loginUser = this._loginservice.getUser();
        this.getLogoUploadConfig();

        this.fillDropDownList();
        this.fillStateDropDown();
        this.fillCityDropDown();
        this.fillAreaDropDown();
    }

    public ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);

        this.getWorkspaceDetails();
        this.showPassword("password");
    }

    // Get Action Rights

    getActionRights() {
        var that = this;
        commonfun.loader();

        var params = {
            "flag": "menurights", "entttype": "", "uid": that.loginUser.uid,
            "utype": that.loginUser.utype, "mcode": "ws"
        };

        that._autoservice.getMenuDetails(params).subscribe(data => {
            that.isaddws = data.data.filter(a => a.maction == "add")[0].isrights;
            that.iseditws = data.data.filter(a => a.maction == "edit")[0].isrights;
            that.isdeletews = data.data.filter(a => a.maction == "delete")[0].isrights;
        }, err => {
            console.log(err);
        }, () => {
            // console.log("Complete");
        });
    }

    showPassword(type) {
        if (type == "text") {
            $("#lblshowpwd").removeClass("hide");
            $("#lblshowpwd").addClass("show");

            $("#lblhidepwd").removeClass("show");
            $("#lblhidepwd").addClass("hide");
        }
        else {
            $("#lblshowpwd").removeClass("show");
            $("#lblshowpwd").addClass("hide");

            $("#lblhidepwd").removeClass("hide");
            $("#lblhidepwd").addClass("show");
        }

        $(".lgpwd").attr("type", type);
    }

    public ngAfterViewInit() {
        $.AdminBSB.input.activate();
    }

    // Entity Type DropDown

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._wsservice.getWorkspaceDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.wstypeDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide();
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    // Get State DropDown

    fillStateDropDown() {
        var that = this;
        commonfun.loader();

        that._autoservice.getDropDownData({ "flag": "state" }).subscribe(data => {
            try {
                that.stateDT = data.data;
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

    // Get City DropDown

    fillCityDropDown() {
        var that = this;
        commonfun.loader();

        that.cityDT = [];
        that.areaDT = [];

        that.city = 0;
        that.area = 0;

        that._autoservice.getDropDownData({ "flag": "city", "sid": that.state }).subscribe(data => {
            try {
                that.cityDT = data.data;
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

    // Get Area DropDown

    fillAreaDropDown() {
        var that = this;
        commonfun.loader();

        that.areaDT = [];

        that.area = 0;

        that._autoservice.getDropDownData({ "flag": "area", "ctid": that.city, "sid": that.state }).subscribe(data => {
            try {
                that.areaDT = data.data;
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

    // File upload

    getLogoUploadConfig() {
        var that = this;

        that._autoservice.getMOM({ "flag": "filebyid", "id": that.global.photoid }).subscribe(data => {
            that.uploadlogoconfig.server = that.global.serviceurl + "uploads";
            that.uploadlogoconfig.serverpath = that.global.serviceurl;
            that.uploadlogoconfig.uploadurl = that.global.uploadurl;
            that.uploadlogoconfig.filepath = that.global.filepath;
            that.uploadlogoconfig.maxFilesize = data.data[0]._filesize;
            that.uploadlogoconfig.acceptedFiles = data.data[0]._filetype;
        }, err => {
            console.log("Error");
        }, () => {
            console.log("Complete");
        })
    }

    onLogoUpload(event) {
        var that = this;
        var imgfile = [];
        that.uploadLogoDT = [];

        imgfile = JSON.parse(event.xhr.response);

        setTimeout(function () {
            for (var i = 0; i < imgfile.length; i++) {
                that.uploadLogoDT.push({ "athurl": imgfile[i].path.replace(that.uploadlogoconfig.filepath, "") })
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

    removeLogoUpload() {
        this.uploadLogoDT.splice(0, 1);
    }

    // Clear Fields

    resetWorkspaceFields() {
        var that = this;

        that.wsautoid = 0
        that.wscode = "";
        that.wsname = "";
        that.wsdesc = "";
        that.lgcode = "";
        that.lgpwd = "";
        that.remark = "";
        that.cpname = "";
        that.mobileno1 = "";
        that.mobileno2 = "";

        that.email1 = "";
        that.email2 = "";

        that.address = that.loginUser.address;
        that.country = "India";
        that.state = that.loginUser.sid;
        that.fillCityDropDown();
        that.city = that.loginUser.ctid;
        that.fillAreaDropDown();
        that.area = that.loginUser.arid;
        that.pincode = that.loginUser.pincode;
        that.isactive = true;

        that.iscompany = false;
        that.cmppsngrrate = "0";
        that.cmpenttmaxno = 0;

        that.isschool = false;
        that.schpsngrrate = "0";
        that.schenttmaxno = 0;

        that.uploadLogoDT = [];
        that.chooseLabel = "Upload Logo";

        that.enabledWorkspaceFields();
    }

    // Delete Driver

    deleteWorkspace() {
        var that = this;

        that._autoservice.confirmmsgbox("Are you sure, you want to delete ?", "Your record has been deleted", "Your record is safe", function (e) {
            var params = {
                "mode": "delete",
                "wsautoid": that.wsautoid
            }

            that._wsservice.saveWorkspaceInfo(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_workspaceinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that.backViewData();
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
        });
    }

    // Active / Deactive Data

    active_deactiveWorkspaceInfo() {
        var that = this;

        this.subscribeParameters = this._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.wsautoid = params['id'];

                var act_deactWorkspace = {
                    "wsautoid": that.wsautoid,
                    "isactive": that.isactive,
                    "mode": that.mode
                }

                this._wsservice.saveWorkspaceInfo(act_deactWorkspace).subscribe(data => {
                    try {
                        var dataResult = data.data;

                        if (dataResult[0].funsave_workspaceinfo.msgid != "-1") {
                            var msg = dataResult[0].funsave_workspaceinfo.msg;
                            that._msg.Show(messageType.success, "Success", msg);
                            that.getWorkspaceDetails();
                        }
                        else {
                            var msg = dataResult[0].funsave_Workspaceinfo.msg;
                            that._msg.Show(messageType.error, "Error", msg);
                        }
                    }
                    catch (e) {
                        that._msg.Show(messageType.error, "Error", e);
                    }
                }, err => {
                    that._msg.Show(messageType.error, "Error", err);
                    console.log(err);
                }, () => {
                    // console.log("Complete");
                });
            }
        });
    }

    // Validation

    isWorkspaceValidation() {
        var that = this;

        if (that.wscode == "") {
            that._msg.Show(messageType.error, "Error", "Enter Workspace Code");
            $(".wscode").focus();
            return false;
        }
        else if (that.wsname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Workspace Name");
            $(".wsname").focus();
            return false;
        }
        else if (that.lgcode == "") {
            that._msg.Show(messageType.error, "Error", "Enter Login Code");
            $(".lgcode").focus();
            return false;
        }
        else if (that.lgpwd == "") {
            that._msg.Show(messageType.error, "Error", "Enter Password");
            $(".lgpwd").focus();
            return false;
        }
        else if (that.cpname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Contace Person");
            $(".cpname").focus();
            return false;
        }
        else if (that.mobileno1 == "") {
            that._msg.Show(messageType.error, "Error", "Enter Mobile No");
            $(".mobileno1").focus();
            return false;
        }
        else if (that.email1 == "") {
            that._msg.Show(messageType.error, "Error", "Enter Email");
            $(".email1").focus();
            return false;
        }
        else if (that.address == "") {
            that._msg.Show(messageType.error, "Error", "Enter Address");
            $(".address").focus();
            return false;
        }
        else if (that.country == "") {
            that._msg.Show(messageType.error, "Error", "Enter Country");
            $(".country").focus();
            return false;
        }
        else if (that.state == 0) {
            that._msg.Show(messageType.error, "Error", "Enter State");
            $(".state").focus();
            return false;
        }
        else if (that.city == 0) {
            that._msg.Show(messageType.error, "Error", "Enter City");
            $(".city").focus();
            return false;
        }
        else if ((!that.iscompany) && (!that.isschool)) {
            that._msg.Show(messageType.error, "Error", "Select 1 Workspace Type");
            return false;
        }

        if (that.iscompany) {
            if (that.cmppsngrrate == "0") {
                that._msg.Show(messageType.error, "Error", "Enter Rate / Passenger for Company");
                $(".cmppsngrrate").focus();
                return false;
            }
            else if (that.cmpenttmaxno == 0) {
                that._msg.Show(messageType.error, "Error", "Enter Max Allowed Entity for Company");
                $(".cmpenttmaxno").focus();
                return false;
            }

            console.log("abc 001");
            console.log("isschool : " + that.isschool);
        }
        if (that.isschool == true) {
            if (that.schpsngrrate == "0") {
                that._msg.Show(messageType.error, "Error", "Enter Rate / Passenger for School");
                $(".schpsngrrate").focus();
                return false;
            }
            else if (that.schenttmaxno == 0) {
                that._msg.Show(messageType.error, "Error", "Enter Max Allowed Entity for School");
                $(".schenttmaxno").focus();
                return false;
            }

            console.log("abc 002");
        }

        console.log("isschool : " + that.isschool);

        return true;
    }

    // Save Data

    saveWorkspaceInfo() {
        var that = this;
        var _wstype = "";
        var _iswsvalid = false;

        _iswsvalid = that.isWorkspaceValidation();

        if (_iswsvalid) {
            commonfun.loader();

            if ((that.iscompany) && (!that.isschool)) {
                _wstype = "Company";
            }
            else if ((!that.iscompany) && (that.isschool)) {
                _wstype = "School";
            }
            else if ((that.iscompany) && (that.isschool)) {
                _wstype = "Company,School";
            }

            var saveWorkspace = {
                "wsautoid": that.wsautoid,
                "wscode": that.wscode,
                "loginid": that.loginid,
                "wsname": that.wsname,
                "wsdesc": that.wsdesc,
                "wslogo": that.uploadLogoDT.length > 0 ? that.uploadLogoDT[0].athurl : "",
                "wstype": _wstype,
                "cmppsngrrate": that.cmppsngrrate,
                "cmpenttmaxno": that.cmpenttmaxno,
                "schpsngrrate": that.schpsngrrate,
                "schenttmaxno": that.schenttmaxno,
                "lgcode": that.lgcode,
                "lgpwd": that.lgpwd,
                "cpname": that.cpname,
                "mobileno1": that.mobileno1,
                "mobileno2": that.mobileno2,
                "email1": that.email1,
                "email2": that.email2,
                "address": that.address,
                "country": that.country,
                "state": that.state,
                "city": that.city,
                "area": that.area,
                "pincode": that.pincode,
                "cuid": that.loginUser.ucode,
                "isactive": that.isactive,
                "mode": ""
            }

            this._wsservice.saveWorkspaceInfo(saveWorkspace).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_workspaceinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid !== "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetWorkspaceFields();
                        }
                        else {
                            that.backViewData();
                        }
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", dataResult.msg);
                        console.log(dataResult.msg);
                    }

                    commonfun.loaderhide();
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                    console.log(e);
                }
            }, err => {
                console.log(err);
                that._msg.Show(messageType.error, "Error", err);
                commonfun.loaderhide();
            }, () => {
                // console.log("Complete");
            });
        }
    }

    // Get Workspace Data

    getWorkspaceDetails() {
        var that = this;
        that.uploadLogoDT = [];

        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.paramsid = params['id'];
                that.disablecode = true;

                that._wsservice.getWorkspaceDetails({
                    "flag": "edit", "id": that.paramsid, "ucode": that.loginUser.ucode, "issysadmin": that.loginUser.issysadmin
                }).subscribe(data => {
                    try {
                        if (data.data.length == 0) {
                            if (that.loginUser.issysadmin) {
                                if (that.paramsid == 0) {
                                    that.resetWorkspaceFields();
                                }
                                else {
                                    that.backViewData();
                                }
                            }
                            else {
                                that.backViewData();
                            }
                        }
                        else {
                            that.wsautoid = data.data[0].wsautoid;
                            that.wscode = data.data[0].wscode;
                            that.wsname = data.data[0].wsname;

                            if (data.data[0].wslogo !== "") {
                                that.uploadLogoDT.push({ "athurl": data.data[0].wslogo });
                                that.chooseLabel = "Change Logo";
                            }
                            else {
                                that.chooseLabel = "Upload Logo";
                            }

                            that.wsdesc = data.data[0].wsdesc;
                            that.loginid = data.data[0].loginid;
                            that.lgcode = data.data[0].lgcode;
                            that.lgpwd = data.data[0].lgpwd;

                            that.cpname = data.data[0].name;
                            that.email1 = data.data[0].email1;
                            that.email2 = data.data[0].email2;
                            that.mobileno1 = data.data[0].mobileno1;
                            that.mobileno2 = data.data[0].mobileno2;
                            that.address = data.data[0].address;
                            that.country = data.data[0].country;
                            that.state = data.data[0].state;
                            that.fillCityDropDown();
                            that.city = data.data[0].city;
                            that.fillAreaDropDown();
                            that.area = data.data[0].area;
                            that.pincode = data.data[0].pincode;
                            that.isactive = data.data[0].isactive;
                            that.remark = data.data[0].remark1;

                            that.iscompany = data.data[0].iscompany;
                            that.cmppsngrrate = data.data[0].cmppsngrrate;
                            that.cmpenttmaxno = data.data[0].cmpenttmaxno;

                            that.isschool = data.data[0].isschool;
                            that.schpsngrrate = data.data[0].schpsngrrate;
                            that.schenttmaxno = data.data[0].schenttmaxno;

                            that.mode = data.data[0].mode;
                            that.issysadmin = data.data[0].issysadmin;

                            if (that.loginUser.issysadmin) {
                                that.enabledWorkspaceFields();
                            }
                            else {
                                if (that.loginUser.utype == "admin" && that.loginUser.wsautoid == that.wsautoid) {
                                    that.enabledWorkspaceFields();
                                }
                                else {
                                    that.disabledWorkspaceFields();
                                }
                            }
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
            else {
                if (that.loginUser.issysadmin) {
                    that.resetWorkspaceFields();
                }
                else {
                    that.backViewData();
                }

                commonfun.loaderhide();
            }
        });
    }

    // Show / Hide Controls

    enabledWorkspaceFields() {
        this.iseditws = true;

        $(".hidewhen input").removeAttr("disabled");
        $(".hidewhen select").removeAttr("disabled");
        $(".hidewhen textarea").removeAttr("disabled");

        $("#divUploadLogo").prop("class", "show");
        $("#divViewLogo").prop("class", "hide");
    }

    disabledWorkspaceFields() {
        this.iseditws = false;

        $(".hidewhen input").attr("disabled", "disabled");
        $(".hidewhen select").attr("disabled", "disabled");
        $(".hidewhen textarea").attr("disabled", "disabled");

        $("#divUploadLogo").prop("class", "hide");
        $("#divViewLogo").prop("class", "show");
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/admin/workspace']);
    }

    ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();

        this.subscribeParameters.unsubscribe();
    }
}
