import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { UserService } from '@services/master';

@Component({
    templateUrl: 'adduser.comp.html'
})

export class AddUserComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    genderDT: any = [];

    utypeDT: any = [];
    utype: string = "";

    stateDT: any = [];
    cityDT: any = [];
    areaDT: any = [];

    paramsid: number = 0;
    uid: number = 0;
    loginid: number = 0;
    ucode: string = "";
    oldpwd: string = "";
    upwd: string = "";
    fname: string = "";
    lname: string = "";
    gender: string = "";
    currdate: any = "";
    dob: string = "";
    mobileno1: string = "";
    mobileno2: string = "";
    email1: string = "";
    email2: string = "";
    address: string = "";
    country: string = "India";
    state: number = 0;
    city: number = 0;
    area: number = 0;
    pincode: number = 0;
    isactive: boolean = false;
    mode: string = "";
    remark1: string = "";
    ownwsid: number = 0;

    isAllEnttRights: boolean = true;
    entityDT: any = [];
    entityList: any = [];
    enttid: number = 0;
    enttname: any = [];

    uploadPhotoDT: any = [];
    global = new Globals();
    uploadphotoconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };
    chooseLabel: string = "";

    isadd: boolean = false;
    isedit: boolean = false;
    isdetails: boolean = false;

    isaddusr: boolean = false;
    iseditusr: boolean = false;
    isdeleteusr: boolean = false;

    private subscribeParameters: any;

    constructor(private _userservice: UserService, private _loginservice: LoginService, private _autoservice: CommonService,
        private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.getPhotoUploadConfig();
        this.fillDropDownList();
        this.fillStateDropDown();
        this.fillCityDropDown();
        this.fillAreaDropDown();

        this.getActionRights();

        this.isadd = _router.url.indexOf("/add") > -1;
        this.isedit = _router.url.indexOf("/edit") > -1;
        this.isdetails = _router.url.indexOf("/details") > -1;
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".ucode").focus();
        }, 100);

        this.getUserDetails();
        this.showPassword("password");
    }

    // Get Action Rights

    getActionRights() {
        var that = this;
        commonfun.loader();

        var params = {
            "flag": "menurights", "entttype": "", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "mcode": "usr"
        };

        that._autoservice.getMenuDetails(params).subscribe(data => {
            that.isaddusr = data.data.filter(a => a.maction == "add")[0].isrights;
            that.iseditusr = data.data.filter(a => a.maction == "edit")[0].isrights;
            that.isdeleteusr = data.data.filter(a => a.maction == "delete")[0].isrights;
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

        $(".upwd").attr("type", type);
    }

    public ngAfterViewInit() {
        $.AdminBSB.input.activate();
    }

    // Format Date Time

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._userservice.getUserDetails({ "flag": "dropdown", "utype": that.loginUser.utype }).subscribe(data => {
            that.genderDT = data.data.filter(a => a.group == "gender");
            that.utypeDT = data.data.filter(a => a.group == "usertype");
            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
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
                // setTimeout(function () { $.AdminBSB.select.refresh('area'); }, 100);
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

    // Is Rights Entity

    isAllEntityRights() {
        if (this.isAllEnttRights) {
            this.entityList = [];
        }
    }

    // Auto Completed Entity

    getEntityData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "entity",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._wsdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.entityDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Entity

    selectEntityData(event, type) {
        this.enttid = event.value;

        this.addEntityList();
        $(".enttname input").focus();
    }

    // Check Duplicate Entity

    isDuplicateEntity() {
        var that = this;

        for (var i = 0; i < that.entityList.length; i++) {
            var field = that.entityList[i];

            if (field.schid == that.enttid) {
                that._msg.Show(messageType.error, "Error", "Duplicate Entity not Allowed");
                return true;
            }
        }

        return false;
    }

    // Read Get Entity

    addEntityList() {
        var that = this;
        var duplicateEntity = that.isDuplicateEntity();

        if (!duplicateEntity) {
            that.entityList.push({
                "schid": that.enttname.value, "schname": that.enttname.label, "wsid": that._wsdetails.wsautoid, "wsname": that._wsdetails.wsname
            });
        }

        that.enttid = 0;
        that.enttname = [];
    }

    deleteEntity(row) {
        this.entityList.splice(this.entityList.indexOf(row), 1);
    }

    // User Photo Upload

    getPhotoUploadConfig() {
        var that = this;

        that._autoservice.getMOM({ "flag": "filebyid", "id": that.global.photoid }).subscribe(data => {
            that.uploadphotoconfig.server = that.global.serviceurl + "uploads";
            that.uploadphotoconfig.serverpath = that.global.serviceurl;
            that.uploadphotoconfig.uploadurl = that.global.uploadurl;
            that.uploadphotoconfig.filepath = that.global.filepath;
            that.uploadphotoconfig.maxFilesize = data.data[0]._filesize;
            that.uploadphotoconfig.acceptedFiles = data.data[0]._filetype;
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

        setTimeout(function () {
            for (var i = 0; i < imgfile.length; i++) {
                that.uploadPhotoDT.push({ "athurl": imgfile[i].path.replace(that.uploadphotoconfig.filepath, "") })
            }
        }, 1000);
    }

    removePhotoUpload() {
        this.uploadPhotoDT.splice(0, 1);
    }

    // Active / Deactive Data

    active_deactiveUserInfo() {
        var that = this;

        var act_deactuser = {
            "uid": that.uid,
            "utype": that.utype,
            "isactive": that.isactive,
            "mode": that.mode
        }

        this._userservice.saveUserInfo(act_deactuser).subscribe(data => {
            try {
                var dataResult = data.data[0].funsave_userinfo;
                var msg = dataResult.msg;
                var msgid = dataResult.msgid;

                if (msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", msg);
                    that.getUserDetails();
                }
                else {
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

    // Delete Users

    deleteUsers() {
        var that = this;

        that._autoservice.confirmmsgbox("Are you sure, you want to delete ?", "Your record has been deleted", "Your record is safe", function (e) {
            var params = {
                "mode": "delete",
                "uid": that.uid,
                "utype": that.utype,
            }

            that._userservice.saveUserInfo(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_userinfo;
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

    // Clear Fields

    resetUserFields() {
        var that = this;

        that.uid = 0
        that.loginid = 0;
        that.ucode = "";
        that.upwd = "";
        that.oldpwd = "";
        that.fname = "";
        that.lname = "";
        that.utype = "";
        that.remark1 = "";
        that.gender = "";
        that.dob = "";
        that.mobileno1 = "";
        that.mobileno2 = "";
        that.email1 = "";
        that.email2 = "";

        that.address = that._wsdetails.address;
        that.country = "India";
        that.state = that._wsdetails.sid;
        that.fillCityDropDown();
        that.city = that._wsdetails.ctid;
        that.fillAreaDropDown();
        that.area = that._wsdetails.arid;
        that.pincode = that._wsdetails.pincode;
        that.isactive = true;
        that.mode = "";
        that.ownwsid = 0;

        that.entityList = [];

        that.uploadPhotoDT = [];
        that.chooseLabel = "Upload Photo";
    }

    enabledUserFields() {
        $(".hidewhen input").removeAttr("disabled");
        $(".hidewhen select").removeAttr("disabled");
        $(".hidewhen textarea").removeAttr("disabled");
        $("#divPhotoUpload").prop("class", "show");
    }

    disabledUserFields() {
        $(".hidewhen input").attr("disabled", "disabled");
        $(".hidewhen select").attr("disabled", "disabled");
        $(".hidewhen textarea").attr("disabled", "disabled");
        $("#divPhotoUpload").prop("class", "hide");
    }

    // User Validation

    isValidationUsers() {
        var that = this;

        if (that.ucode == "") {
            that._msg.Show(messageType.error, "Error", "Enter User Code");
            $(".ucode").focus();

            return false;
        }
        if (that.upwd == "") {
            that._msg.Show(messageType.error, "Error", "Enter Password");
            $(".upwd").focus();
            
            return false;
        }
        if (that.fname == "") {
            that._msg.Show(messageType.error, "Error", "Enter First Name");
            $(".fname").focus();
            
            return false;
        }
        if (that.lname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Last Name");
            $(".lname").focus();
            
            return false;
        }
        if (that.gender == "") {
            that._msg.Show(messageType.error, "Error", "Select Gender");
            $(".gender").focus();
            
            return false;
        }
        if (that.dob == "") {
            that._msg.Show(messageType.error, "Error", "Enter Birth Date");
            $(".dob").focus();
            
            return false;
        }
        if (that.utype == "") {
            that._msg.Show(messageType.error, "Error", "Select User Type");
            $(".utype").focus();
            
            return false;
        }
        if (that.mobileno1 == "") {
            that._msg.Show(messageType.error, "Error", "Enter Mobile No");
            $(".mobileno1").focus();
            
            return false;
        }
        if (that.email1 == "") {
            that._msg.Show(messageType.error, "Error", "Enter Email");
            $(".email1").focus();
            
            return false;
        }
        if (that.address == "") {
            that._msg.Show(messageType.error, "Error", "Enter Address");
            $(".address").focus();
            
            return false;
        }
            
        return true;
    }

    // Save Data

    saveUserInfo() {
        var that = this;
        var isvalid = that.isValidationUsers();

        if (isvalid) {
            commonfun.loader();

            var _ownenttdt: any = [];
            var _othenttdt: any = [];

            var _ownenttlist: string[] = [];
            var _othwslist: string[] = [];
            var _othenttlist: string[] = [];

            if (that.uid == 0) {
                _ownenttlist = Object.keys(that.entityList).map(function (k) { return that.entityList[k].schid });
            }
            else {
                _ownenttdt = that.entityList.filter(a => a.wsid == that.ownwsid);
                _othenttdt = that.entityList.filter(a => a.wsid != that.ownwsid);

                if (that.utype == "admin" || that.utype == "user") {
                    _ownenttlist = ["0"];
                }
                else {
                    if (that.isAllEnttRights) {
                        _ownenttlist = ["0"];
                    }
                    else {
                        _ownenttlist = Object.keys(_ownenttdt).map(function (k) { return _ownenttdt[k].schid });
                    }
                }

                _othwslist = Object.keys(_othenttdt).map(function (k) { return _othenttdt[k].wsid });
                _othenttlist = Object.keys(_othenttdt).map(function (k) { return _othenttdt[k].schid });
            }

            var params = {
                "uid": that.uid,
                "loginid": that.loginid,
                "ucode": that.ucode,
                "oldpwd": that.oldpwd,
                "upwd": that.upwd,
                "fname": that.fname,
                "lname": that.lname,
                "utype": that.utype,
                "filepath": that.uploadPhotoDT.length > 0 ? that.uploadPhotoDT[0].athurl : "",
                "school": "{" + _ownenttlist.toString().replace("[", "").replace("]", "") + "}",
                "wsrights": "{" + _othwslist.toString().replace("[", "").replace("]", "") + "}",
                "enttrights": "{" + _othenttlist.toString().replace("[", "").replace("]", "") + "}",
                "gender": that.gender,
                "dob": that.dob,
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
                "remark1": that.remark1,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._wsdetails.wsautoid,
                "isactive": that.isactive,
                "mode": ""
            }

            that._userservice.saveUserInfo(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_userinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid !== "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetUserFields();
                        }
                        else {
                            that.backViewData();
                        }
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", "Error 101 : " + msg);
                    }

                    commonfun.loaderhide();
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", "Error 102 : " + e);
                }
            }, err => {
                that._msg.Show(messageType.error, "Error", "Error 103 : " + err);
                commonfun.loaderhide();
            }, () => {
                // console.log("Complete");
            });
        }
    }

    // Get user Data

    getUserDetails() {
        var that = this;
        that.uploadPhotoDT = [];

        commonfun.loader();

        var date = new Date();
        var _currdate = new Date(date.getFullYear() - 18, date.getMonth(), date.getDate());
        that.currdate = that.formatDate(_currdate);

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.paramsid = params['id'];

                that._userservice.getUserDetails({ "flag": "edit", "id": that.paramsid, "wsautoid": that._wsdetails.wsautoid }).subscribe(data => {
                    try {
                        if (data.data.length == 0) {
                            if (that.paramsid == 0) {
                                that.dob = that.formatDate(_currdate);
                                that.resetUserFields();
                            }
                            else {
                                that.backViewData();
                            }
                        }
                        else {
                            var _userdata = data.data[0];

                            that.uid = _userdata.uid;
                            that.loginid = _userdata.loginid;
                            that.ucode = _userdata.ucode;
                            that.oldpwd = _userdata.upwd;
                            that.upwd = _userdata.upwd;
                            that.fname = _userdata.fname;
                            that.lname = _userdata.lname;
                            that.gender = _userdata.gndrkey;
                            that.dob = _userdata.dob;
                            that.utype = _userdata.utype;
                            that.isAllEnttRights = _userdata.isallenttrights;
                            that.entityList = _userdata.schooldt !== null ? _userdata.schooldt : [];

                            that.email1 = _userdata.email1;
                            that.email2 = _userdata.email2;
                            that.mobileno1 = _userdata.mobileno1;
                            that.mobileno2 = _userdata.mobileno2;
                            that.address = _userdata.address;
                            that.country = _userdata.country;
                            that.state = _userdata.state;
                            that.fillCityDropDown();
                            that.city = _userdata.city;
                            that.fillAreaDropDown();
                            that.area = _userdata.area;
                            that.pincode = _userdata.pincode;
                            that.remark1 = _userdata.remark1;
                            that.ownwsid = _userdata.ownwsid;
                            that.isactive = _userdata.isactive;
                            that.mode = _userdata.mode;

                            if (_userdata.FilePath !== "") {
                                that.uploadPhotoDT.push({ "athurl": _userdata.FilePath });
                                that.chooseLabel = "Change Photo";
                            }
                            else {
                                that.uploadPhotoDT = [];
                                that.chooseLabel = "Upload Photo";
                            }

                            if (that.isdetails) {
                                that.disabledUserFields();
                            }
                            else {
                                if (_userdata.isedit) {
                                    that.enabledUserFields();
                                }
                                else {
                                    that.disabledUserFields();
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
                that.dob = that.formatDate(_currdate);
                that.resetUserFields();

                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/workspace/user']);
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}
