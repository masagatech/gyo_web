import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../_services/users/user-service';
import { CommonService } from '../../../_services/common/common-service'; /* add reference for master of master */
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { LoginService } from '../../../_services/login/login-service';
import { LoginUserModel } from '../../../_model/user_model';
import { Router, ActivatedRoute } from '@angular/router';

declare var adminloader: any;

@Component({
    templateUrl: 'adduser.comp.html',
    providers: [UserService, CommonService]
})

export class AddUserComponent implements OnInit {
    loginUser: LoginUserModel;

    uid: number = 0;
    ucode: string = "";
    oldcode: string = "";
    upwd: string = "";
    fname: string = "";
    lname: string = "";
    mobileno1: string = "";
    mobileno2: string = "";
    email1: string = "";
    email2: string = "";
    address: string = "";
    country: string = "";
    state: string = "";
    city: string = "";
    pincode: string = "";
    isactive: boolean = false;
    mode: string = "";
    remark1: string = "";
    utype: string = "";

    genderDT: any = [];

    schoolDT: any = [];
    schoolList: any = [];
    schoolid: number = 0;
    schoolname: string = "";

    private subscribeParameters: any;

    constructor(private _userservice: UserService, private _loginservice: LoginService, private _autoservice: CommonService, private _routeParams: ActivatedRoute,
        private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this.fillDropDownList();
    }

    public ngOnInit() {
        this.getUserDetails();
    }

    public ngAfterViewInit() {
        $.AdminBSB.input.activate();
    }

    // Auto Completed School

    getSchoolData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "school",
            "uid": this.loginUser.uid,
            "typ": this.loginUser.utype,
            "search": query
        }).then((data) => {
            this.schoolDT = data;
        });
    }

    // Selected Owners

    selectSchoolData(event, type) {
        this.schoolid = event.value;
        this.schoolname = event.label;

        this.addSchoolList();
        $(".schoolname input").focus();
    }

    // Read Get School

    addSchoolList() {
        var that = this;

        that.schoolList.push({
            "schid": that.schoolid, "schnm": that.schoolname
        });

        that.schoolid = 0;
        that.schoolname = "";
    }

    deleteSchool(row) {
        this.schoolList.splice(this.schoolList.indexOf(row), 1);
    }

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._userservice.getUserDetails({ "flag": "dropdown" }).subscribe(data => {
            that.genderDT = data.data;
            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
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
        $("input").val("");
        $("textarea").val("");
        $("select").val("");

        this.schoolList = [];
    }

    // Save Data

    saveUserInfo() {
        var that = this;
        commonfun.loader();

        var _schlist: string[] = [];
        _schlist = Object.keys(that.schoolList).map(function (k) { return that.schoolList[k].schid });

        var saveuser = {
            "uid": that.uid,
            "oldcode": that.oldcode,
            "ucode": that.ucode,
            "upwd": that.upwd,
            "fname": that.fname,
            "lname": that.lname,
            "school": _schlist,
            "mobileno1": that.mobileno1,
            "mobileno2": that.mobileno2,
            "email1": that.email1,
            "email2": that.email2,
            "address": that.address,
            "country": that.country,
            "state": that.state,
            "city": that.city,
            "pincode": that.pincode,
            "remark1": that.remark1,
            "cuid": "vivek",
            "isactive": that.isactive,
            "utype": that.utype,
            "mode": ""
        }

        this._userservice.saveUserInfo(saveuser).subscribe(data => {
            try {
                var dataResult = data.data;
                var msg = dataResult[0].funsave_userinfo.msg;
                var msgid = dataResult[0].funsave_userinfo.msgid;

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
                    that._msg.Show(messageType.error, "Error", dataResult[0].funsave_userinfo.msg);
                }

                commonfun.loaderhide();
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            console.log(err);
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide();
        }, () => {
            // console.log("Complete");
        });
    }

    // Get user Data

    getUserDetails() {
        var that = this;
        commonfun.loader();

        this.subscribeParameters = this._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                this.uid = params['id'];

                that._userservice.getUserDetails({ "flag": "edit", "id": this.uid }).subscribe(data => {
                    try {
                        that.uid = data.data[0].uid;
                        that.oldcode = data.data[0].ucode;
                        that.ucode = data.data[0].ucode;
                        that.upwd = data.data[0].upwd;
                        that.fname = data.data[0].fname;
                        that.lname = data.data[0].lname;
                        that.schoolList = data.data[0].school !== null ? data.data[0].school : [];
                        that.email1 = data.data[0].email1;
                        that.email2 = data.data[0].email2;
                        that.mobileno1 = data.data[0].mobileno1;
                        that.mobileno2 = data.data[0].mobileno2;
                        that.address = data.data[0].address;
                        that.country = data.data[0].country;
                        that.state = data.data[0].state;
                        that.city = data.data[0].city;
                        that.pincode = data.data[0].pincode;
                        that.remark1 = data.data[0].remark1;
                        that.isactive = data.data[0].isactive;
                        that.utype = data.data[0].utype;
                        that.mode = data.data[0].mode;
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
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/user']);
    }
}
