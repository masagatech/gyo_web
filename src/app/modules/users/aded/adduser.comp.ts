import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../_services/users/user-service';
import { CommonService } from '../../../_services/common/common-service'; /* add reference for master of master */
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: 'adduser.comp.html',
    providers: [UserService, CommonService]
})

export class AddUserComponent implements OnInit {
    schoolDT: any = [];
    divisionDT: any = [];
    genderDT: any = [];

    uid: number = 0;
    ucode: string = "";
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

    private subscribeParameters: any;

    constructor(private _userservice: UserService, private _autoservice: CommonService, private _routeParams: ActivatedRoute,
        private _router: Router, private _msg: MessageService) {
        this.fillDropDownList();
    }

    public ngOnInit() {
        this.getUserDetails();
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

    // Save Data

    saveUserInfo() {
        var that = this;
        commonfun.loader();

        var saveuser = {
            "uid": that.uid,
            "ucode": that.ucode,
            "upwd": that.upwd,
            "fname": that.fname,
            "lname": that.lname,
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

                if (dataResult[0].funsave_userinfo.msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", dataResult[0].funsave_userinfo.msg);
                    that.getUserDetails();
                    commonfun.loaderhide();
                }
                else {
                    that._msg.Show(messageType.error, "Error", dataResult[0].funsave_userinfo.msg);
                    commonfun.loaderhide();
                }
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
                        that.ucode = data.data[0].ucode;
                        that.upwd = data.data[0].upwd;
                        that.fname = data.data[0].fname;
                        that.lname = data.data[0].lname;
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
