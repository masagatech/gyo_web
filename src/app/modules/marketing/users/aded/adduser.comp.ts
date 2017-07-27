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

export class AddMarketUserComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    stateDT: any = [];
    cityDT: any = [];
    areaDT: any = [];

    uid: number = 0;
    ucode: string = "";
    fname: string = "";
    lname: string = "";
    devid: string = "";
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
    isactive: boolean = true;
    mode: string = "";
    remark1: string = "";

    private subscribeParameters: any;

    constructor(private _userservice: UserService, private _loginservice: LoginService, private _autoservice: CommonService, private _routeParams: ActivatedRoute,
        private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        
        this.fillStateDropDown();
        this.fillCityDropDown();
        this.fillAreaDropDown();
    }

    public ngOnInit() {
        this.getUserDetails();
    }

    public ngAfterViewInit() {
        $.AdminBSB.input.activate();
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
        });
    }

    // Clear Fields

    resetUserFields() {
        var that = this;

        that.uid = 0
        that.ucode = "";
        that.fname = "";
        that.lname = "";
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
    }

    // Save Data

    saveUserInfo() {
        var that = this;
        commonfun.loader();

        var saveuser = {
            "uid": that.uid,
            "ucode": that.ucode,
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
            "area": that.area,
            "pincode": that.pincode,
            "remark1": that.remark1,
            "cuid": that.loginUser.ucode,
            "wsautoid": that._wsdetails.wsautoid,
            "isactive": that.isactive,
            "devid": that.devid,
            "utype": "marketing",
            "mode": ""
        }

        this._userservice.saveUserInfo(saveuser).subscribe(data => {
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

                    commonfun.loaderhide();
                }
                else {
                    that._msg.Show(messageType.error, "Error", msg);
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
        });
    }

    // Get user Data

    getUserDetails() {
        var that = this;
        commonfun.loader();

        this.subscribeParameters = this._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                this.uid = params['id'];

                that._userservice.getUserDetails({ "flag": "editmarket", "id": this.uid, "wsautoid": that._wsdetails.wsautoid }).subscribe(data => {
                    try {
                        that.uid = data.data[0].uid;
                        that.ucode = data.data[0].ucode;
                        that.fname = data.data[0].fname;
                        that.lname = data.data[0].lname;
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
                        that.devid = data.data[0].devid;
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
        this._router.navigate(['/marketing/user']);
    }
}
