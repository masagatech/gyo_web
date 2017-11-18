import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { UserService } from '@services/master';

declare var adminloader: any;

@Component({
    templateUrl: 'adduser.comp.html',
    providers: [CommonService]
})

export class AddUserComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    utypeDT: any = [];
    utype: string = "";

    stateDT: any = [];
    cityDT: any = [];
    areaDT: any = [];

    uid: number = 0;
    loginid: number = 0;
    ucode: string = "";
    upwd: string = "";
    fname: string = "";
    lname: string = "";
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

    isAllEnttRights: boolean = true;
    entityDT: any = [];
    entityList: any = [];
    enttid: number = 0;
    enttname: any = [];

    private subscribeParameters: any;

    uploadPhotoDT: any = [];
    global = new Globals();
    uploadphotoconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };
    chooseLabel: string = "";

    constructor(private _userservice: UserService, private _loginservice: LoginService, private _autoservice: CommonService,
        private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.getPhotoUploadConfig();
        this.fillUserTypeDropDown();
        this.fillStateDropDown();
        this.fillCityDropDown();
        this.fillAreaDropDown();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".ucode").focus();
        }, 100);

        this.getUserDetails();
    }

    public ngAfterViewInit() {
        $.AdminBSB.input.activate();
    }

    fillUserTypeDropDown() {
        var that = this;
        commonfun.loader();

        that._userservice.getUserDetails({ "flag": "dropdown", "utype": that.loginUser.utype }).subscribe(data => {
            that.utypeDT = data.data;
            // setTimeout(function () { $.AdminBSB.select.refresh('utype'); }, 100);
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
                // setTimeout(function () { $.AdminBSB.select.refresh('state'); }, 100);
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
                // setTimeout(function () { $.AdminBSB.select.refresh('city'); }, 100);
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

            if (field.schid == this.enttid) {
                this._msg.Show(messageType.error, "Error", "Duplicate Entity not Allowed");
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
                "schid": that.enttname.value, "schnm": that.enttname.label
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
            "isactive": that.isactive,
            "mode": that.mode
        }

        this._userservice.saveUserInfo(act_deactuser).subscribe(data => {
            try {
                var dataResult = data.data;

                if (dataResult[0].funsave_userinfo.msgid != "-1") {
                    var msg = dataResult[0].funsave_userinfo.msg;
                    that._msg.Show(messageType.success, "Success", msg);
                    that.getUserDetails();
                }
                else {
                    var msg = dataResult[0].funsave_userinfo.msg;
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

    // Clear Fields

    resetUserFields() {
        var that = this;

        that.uid = 0
        that.ucode = "";
        that.upwd = "";
        that.fname = "";
        that.lname = "";
        that.utype = "";
        that.remark1 = "";
        that.mobileno1 = "";
        that.mobileno2 = "";

        that.email1 = "";
        that.email2 = "";
        that.address = "";
        that.country = "India";
        that.state = 0;
        that.city = 0;
        that.area = 0;
        that.pincode = 0;
        that.isactive = true;
        that.mode = "";

        that.entityList = [];

        that.uploadPhotoDT = [];
        that.chooseLabel = "Upload Photo";
    }

    // Save Data

    saveUserInfo() {
        var that = this;

        if (that.ucode == "") {
            that._msg.Show(messageType.error, "Error", "Enter User Code");
            $(".ucode").focus();
        }
        else if (that.upwd == "") {
            that._msg.Show(messageType.error, "Error", "Enter Password");
            $(".upwd").focus();
        }
        else if (that.fname == "") {
            that._msg.Show(messageType.error, "Error", "Enter First Name");
            $(".fname").focus();
        }
        else if (that.lname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Last Name");
            $(".lname").focus();
        }
        else if (that.utype == "") {
            that._msg.Show(messageType.error, "Error", "Select User Type");
            $(".utype").focus();
        }
        else if (that.mobileno1 == "") {
            that._msg.Show(messageType.error, "Error", "Enter Mobile No");
            $(".mobileno1").focus();
        }
        else if (that.email1 == "") {
            that._msg.Show(messageType.error, "Error", "Enter Email");
            $(".email1").focus();
        }
        else if (that.address == "") {
            that._msg.Show(messageType.error, "Error", "Enter Address");
            $(".address").focus();
        }
        else {
            commonfun.loader();

            var _wslist: string[] = [];
            var _enttlist: string[] = [];

            if (that.utype == "admin" || that.utype == "user") {
                _wslist = ["0"];
                _enttlist = ["0"];
            }
            else {
                if (that.isAllEnttRights) {
                    _enttlist = ["0"];
                }
                else {
                    _enttlist = Object.keys(that.entityList).map(function (k) { return that.entityList[k].schid });
                }
            }

            var saveuser = {
                "uid": that.uid,
                "loginid": that.loginid,
                "ucode": that.ucode,
                "upwd": that.upwd,
                "fname": that.fname,
                "lname": that.lname,
                "filepath": that.uploadPhotoDT.length > 0 ? that.uploadPhotoDT[0].athurl : "",
                "wsrights": _wslist,
                "school": _enttlist,
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
                "utype": that.utype,
                "mode": ""
            }

            that._userservice.saveUserInfo(saveuser).subscribe(data => {
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

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.uid = params['id'];

                that._userservice.getUserDetails({ "flag": "edit", "id": that.uid, "wsautoid": that._wsdetails.wsautoid }).subscribe(data => {
                    try {
                        that.uid = data.data[0].uid;
                        that.loginid = data.data[0].loginid;
                        that.ucode = data.data[0].ucode;
                        that.upwd = data.data[0].upwd;
                        that.fname = data.data[0].fname;
                        that.lname = data.data[0].lname;
                        that.utype = data.data[0].utype;
                        that.isAllEnttRights = data.data[0].isallenttrights;
                        that.entityList = data.data[0].schooldt !== null ? data.data[0].schooldt : [];
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
                        that.remark1 = data.data[0].remark1;
                        that.isactive = data.data[0].isactive;
                        that.mode = data.data[0].mode;

                        if (data.data[0].FilePath !== "") {
                            that.uploadPhotoDT.push({ "athurl": data.data[0].FilePath });
                            that.chooseLabel = "Change Photo";
                        }
                        else {
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
            else {
                that.resetUserFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/workspace/user']);
    }
}
