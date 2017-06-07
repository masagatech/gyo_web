import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../_services/common/common-service'; /* add reference for master of master */
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { LoginService } from '../../../_services/login/login-service';
import { LoginUserModel } from '../../../_model/user_model';
import { CompanyService } from '../../../_services/company/cmp-service';

declare var adminloader: any;

@Component({
    templateUrl: 'addcmp.comp.html',
    providers: [CompanyService, CommonService]
})

export class AddCompanyComponent implements OnInit {
    loginUser: LoginUserModel;

    stateDT: any = [];
    cityDT: any = [];
    areaDT: any = [];

    cmpid: number = 0;
    cmpcd: string = "";
    cmpnm: string = "";
    cmpdesc: string = "";
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

    private subscribeParameters: any;

    constructor(private _cmpservice: CompanyService, private _autoservice: CommonService, private _routeParams: ActivatedRoute,
        private _router: Router, private _msg: MessageService, private _loginservice: LoginService) {
        this.loginUser = this._loginservice.getUser();

        this.fillStateDropDown();
        this.fillCityDropDown();
        this.fillAreaDropDown();
    }

    public ngOnInit() {
        this.getCompanyDetails();
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

    active_deactiveCompanyInfo() {
        var that = this;

        var act_deactCompany = {
            "cmpid": that.cmpid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        this._cmpservice.saveCompanyInfo(act_deactCompany).subscribe(data => {
            try {
                var dataResult = data.data;

                if (dataResult[0].funsave_Companyinfo.msgid != "-1") {
                    var msg = dataResult[0].funsave_Companyinfo.msg;
                    that._msg.Show(messageType.success, "Success", msg);
                    that.getCompanyDetails();
                }
                else {
                    var msg = dataResult[0].funsave_Companyinfo.msg;
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

    resetCompanyFields() {
        var that = this;

        that.cmpid = 0
        that.cmpcd = "";
        that.cmpnm = "";
        that.cmpdesc = "";
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
    }

    // Save Data

    saveCompanyInfo() {
        var that = this;

        if (that.cmpcd == "") {
            that._msg.Show(messageType.error, "Error", "Enter Company Code");
            $(".cmpcd").focus();
        }
        else if (that.cmpnm == "") {
            that._msg.Show(messageType.error, "Error", "Enter Company Name");
            $(".cmpnm").focus();
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

            var saveCompany = {
                "cmpid": that.cmpid,
                "cmpcd": that.cmpcd,
                "cmpnm": that.cmpnm,
                "cmpdesc": that.cmpdesc,
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

            this._cmpservice.saveCompanyInfo(saveCompany).subscribe(data => {
                try {
                    var dataResult = data.data;
                    var msg = dataResult[0].funsave_Companyinfo.msg;
                    var msgid = dataResult[0].funsave_Companyinfo.msgid;

                    if (msgid !== "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetCompanyFields();
                        }
                        else {
                            that.backViewData();
                        }
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", "Error 101 : " + dataResult[0].funsave_Companyinfo.msg);
                        console.log("Error 101 : " + dataResult[0].funsave_Companyinfo.msg);
                    }

                    commonfun.loaderhide();
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", "Error 102 : " + e);
                    console.log("Error 102 : " + e);
                }
            }, err => {
                console.log("Error 103 : " + err);
                that._msg.Show(messageType.error, "Error", "Error 103 : " + err);
                commonfun.loaderhide();
            }, () => {
                // console.log("Complete");
            });
        }
    }

    // Get Company Data

    getCompanyDetails() {
        var that = this;
        commonfun.loader();

        this.subscribeParameters = this._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                this.cmpid = params['id'];

                that._cmpservice.getCompanyDetails({ "flag": "edit", "id": this.cmpid }).subscribe(data => {
                    try {
                        that.cmpid = data.data[0].cmpid;
                        that.cmpcd = data.data[0].cmpcd;
                        that.cmpnm = data.data[0].cmpnm;
                        that.cmpdesc = data.data[0].cmpdesc;
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
        this._router.navigate(['/company']);
    }
}
