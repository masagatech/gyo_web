import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { RiderService, CommonService } from '@services/merchant';
import { LoginUserModel } from '@models';

declare var google: any;
declare var loader: any;
declare var adminloader: any;

@Component({
    templateUrl: 'addrdr.comp.html',
    providers: [CommonService]
})

export class AddRiderComponent implements OnInit {
    loginUser: LoginUserModel;

    genderDT: any = [];
    maritalstatusDT: any = [];
    vehicleDT: any = [];

    stateDT: any = [];
    cityDT: any = [];
    areaDT: any = [];

    rdrid: number = 0;
    rdrcode: string = "";
    oldcode: string = "";
    rdrpwd: string = "";
    fname: string = "";
    lname: string = "";
    aadharno: string = "";
    licenseno: string = "";
    prsnlmob: string = "";
    ofclmob: string = "";
    prsnlemail: string = "";
    ofclemail: string = "";
    dob: any = "";
    gender: string = "";
    maritalstatus: string = "";
    bootcash: string = "";
    vehtyp: string = "";
    vehno: string = "";

    mothername: string = "";
    secondarymobile: string = "";
    secondaryemail: string = "";
    fathername: string = "";
    primarymobile: string = "";
    primaryemail: string = "";

    address: string = "";
    country: string = "India";
    state: number = 0;
    city: number = 0;
    area: number = 0;
    pincode: number = 0;

    hotspotDT: any = [];
    hsid: number = 0;
    hsname: string = "";

    rdrtypDT: any = [];
    rdrtyp: string = "";

    salpkg: string = "";
    workshift: string = "";

    weekDT: any = [];
    weekList: any = [];

    bknm: string = "";
    rdrbknm: string = "";
    acno: string = "";
    ifsc: string = "";
    branch: string = "";

    mode: string = "";
    isactive: boolean = true;

    private subscribeParameters: any;

    constructor(private _rdrservice: RiderService, private _autoservice: CommonService, private _routeParams: ActivatedRoute,
        private _loginservice: LoginService, private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this.fillDropDownList();
        
        this.fillStateDropDown();
        this.fillCityDropDown();
        this.fillAreaDropDown();
    }

    public ngOnInit() {
        $(".ownername input").focus();
        this.getRiderDetails();
    }

    // AutoCompleted Users

    getAutoHotspot(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "hotspot",
            "uid": this.loginUser.uid,
            "typ": this.loginUser.utype,
            "search": query
        }).subscribe(data => {
            this.hotspotDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Users

    selectAutoHotspot(event) {
        this.hsid = event.value;
        this.hsname = event.label;
    }

    // Fill Division, Gender DropDown

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._rdrservice.getRiderDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.genderDT = data.data.filter(a => a.group === "gender");
                that.maritalstatusDT = data.data.filter(a => a.group === "maritalstatus");
                that.rdrtypDT = data.data.filter(a => a.group === "rdrtyp");
                that.weekDT = data.data.filter(a => a.group === "week");
                that.vehicleDT = data.data.filter(a => a.group === "vehtyp");
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

    // Clear Fields

    resetRiderFields() {
        var that = this;

        that.rdrid = 0
        that.rdrcode = "";
        that.rdrpwd = "";
        that.fname = "";
        that.lname = "";
        that.aadharno = "";
        that.licenseno = "";
        that.prsnlmob = "";
        that.ofclmob = "";

        that.dob = "";
        that.gender = "";
        that.maritalstatus = "";
        that.bootcash = "";
        that.vehtyp = "";
        that.vehno = "";
        that.address = "";
        that.country = "India";
        that.state = 0;
        that.city = 0;
        that.area = 0;
        that.pincode = 0;
        that.hsid = 0;
        that.hsname = "";
        that.rdrtyp = "";
        that.salpkg = "";
        that.workshift = "";
    }

    // Active / Deactive Data

    active_deactiveRiderInfo() {
        var that = this;

        var act_deactHoliday = {
            "rdrid": that.rdrid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        that._rdrservice.saveRiderInfo(act_deactHoliday).subscribe(data => {
            try {
                var dataResult = data.data;
                var msg = dataResult[0].funsave_Riderinfo.msg;
                var msgid = dataResult[0].funsave_Riderinfo.msgid;

                if (msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", msg);
                    that.getRiderDetails();
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

    // Save Data

    saveRiderInfo() {
        var that = this;
        var _week = null;
        var _weekday = "";

        if (that.fname === "") {
            that._msg.Show(messageType.error, "Error", "Enter First Name");
            $(".fname").focus();
        }
        else if (that.lname === "") {
            that._msg.Show(messageType.error, "Error", "Enter Last Name");
            $(".lname").focus();
        }
        else if (that.licenseno === "") {
            that._msg.Show(messageType.error, "Error", "Enter License No");
            $(".licenseno").focus();
        }
        else if (that.ofclmob === "") {
            that._msg.Show(messageType.error, "Error", "Enter Official Mobile");
            $(".ofclmob").focus();
        }
        else if (that.ofclemail === "") {
            that._msg.Show(messageType.error, "Error", "Enter Official Email");
            $(".ofclemail").focus();
        }
        else if (that.vehtyp === "") {
            that._msg.Show(messageType.error, "Error", "Select Vehicle Type");
            $(".vehtyp").focus();
        }
        else if (that.vehno === "") {
            that._msg.Show(messageType.error, "Error", "Enter Vehicle No");
            $(".vehno").focus();
        }
        else if (that.address === "") {
            that._msg.Show(messageType.error, "Error", "Enter Address");
            $(".address").focus();
        }
        else if (that.country === "") {
            that._msg.Show(messageType.error, "Error", "Enter Country");
            $(".country").focus();
        }
        else if (that.state === 0) {
            that._msg.Show(messageType.error, "Error", "Enter State");
            $(".state").focus();
        }
        else if (that.city === 0) {
            that._msg.Show(messageType.error, "Error", "Enter City");
            $(".city").focus();
        }
        else if (that.area === 0) {
            that._msg.Show(messageType.error, "Error", "Enter Area");
            $(".area").focus();
        }
        else if (that.rdrtyp === "") {
            that._msg.Show(messageType.error, "Error", "Enter Rider Type");
            $(".rdrtyp").focus();
        }
        else if (that.salpkg === "") {
            that._msg.Show(messageType.error, "Error", "Select Salary Package");
            $(".salpkg").focus();
        }
        else if (that.workshift === "") {
            that._msg.Show(messageType.error, "Error", "Select Working Shift");
            $(".workshift").focus();
        }
        else if (that.rdrcode === "") {
            that._msg.Show(messageType.error, "Error", "Enter Rider Code");
            $(".rdrcode").focus();
        }
        else if (that.rdrpwd === "") {
            that._msg.Show(messageType.error, "Error", "Enter Password");
            $(".rdrpwd").focus();
        }
        else if (that.hsid === 0) {
            that._msg.Show(messageType.error, "Error", "Enter Hotspot");
            $(".hotspot input").focus();
        }
        else {
            for (var i = 0; i <= that.weekDT.length - 1; i++) {
                _week = null;
                _week = that.weekDT[i];

                if (_week !== null) {
                    var wkrights = "";

                    $("#week").find("input[type=checkbox]").each(function () {
                        wkrights += (this.checked ? $(this).val() + "," : "");
                    });
                }
            }

            _weekday = "{" + wkrights.slice(0, -1) + "}";

            if (_weekday == "") {
                this._msg.Show(messageType.error, "Error", "Atleast select 1 Week Days");
            }
            else {
                commonfun.loader();

                var _bkdt = { "bknm": that.bknm, "rdrbknm": that.rdrbknm, "acno": that.acno, "ifsc": that.ifsc, "branch": that.branch }

                var saveRider = {
                    "rdrid": that.rdrid,
                    "rdrcode": that.rdrcode,
                    "oldcode": that.oldcode,
                    "rdrpwd": that.rdrpwd,
                    "fname": that.fname,
                    "lname": that.lname,
                    "aadharno": that.aadharno,
                    "licenseno": that.licenseno,
                    "ofclmob": that.ofclmob,
                    "prsnlmob": that.prsnlmob,
                    "ofclemail": that.ofclemail,
                    "prsnlemail": that.prsnlemail,
                    "dob": that.dob,
                    "gender": that.gender,
                    "maritalstatus": that.maritalstatus,
                    "bootcash": that.bootcash,
                    "vehtyp": that.vehtyp,
                    "vehno": that.vehno,
                    "address": that.address,
                    "country": that.country,
                    "state": that.state,
                    "city": that.city,
                    "area": that.area,
                    "pincode": that.pincode,
                    "hsid": that.hsid,
                    "rdrtyp": that.rdrtyp,
                    "salpkg": that.salpkg,
                    "workshift": that.workshift,
                    "weekday": _weekday,
                    "bkdt": _bkdt,
                    "cuid": that.loginUser.ucode,
                    "mode": ""
                }

                that._rdrservice.saveRiderInfo(saveRider).subscribe(data => {
                    try {
                        var dataResult = data.data;
                        var msg = dataResult[0].funsave_riderinfo.msg;
                        var msgid = dataResult[0].funsave_riderinfo.msgid;

                        if (msgid != "-1") {
                            that._msg.Show(messageType.success, "Success", msg);

                            if (msgid === "1") {
                                that.resetRiderFields();
                            }
                            else {
                                that.backViewData();
                            }
                        }
                        else {
                            that._msg.Show(messageType.error, "Error", msg);
                        }
                    }
                    catch (e) {
                        that._msg.Show(messageType.error, "Error", e);
                    }

                    commonfun.loaderhide();
                }, err => {
                    console.log(err);
                    that._msg.Show(messageType.error, "Error", err);

                    commonfun.loaderhide();
                }, () => {
                    // console.log("Complete");
                });
            }
        }
    }

    // Get Rider Data

    getRiderDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = this._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.rdrid = params['id'];

                that._rdrservice.getRiderDetails({ "flag": "edit", "id": that.rdrid }).subscribe(data => {
                    try {
                        that.rdrid = data.data[0].rdrid;
                        that.rdrcode = data.data[0].rdrcode;
                        that.oldcode = data.data[0].rdrcode;
                        that.rdrpwd = data.data[0].rdrpwd;
                        that.fname = data.data[0].fname;
                        that.lname = data.data[0].lname;
                        that.aadharno = data.data[0].aadharno;
                        that.licenseno = data.data[0].licenseno;
                        that.ofclmob = data.data[0].ofclmob;
                        that.prsnlmob = data.data[0].prsnlmob;
                        that.ofclemail = data.data[0].ofclemail;
                        that.prsnlemail = data.data[0].prsnlemail;
                        that.dob = data.data[0].dob;
                        that.gender = data.data[0].gender;
                        that.maritalstatus = data.data[0].maritalstatus;
                        that.bootcash = data.data[0].bootcash;
                        that.vehtyp = data.data[0].vehtyp;
                        that.vehno = data.data[0].vehno;
                        that.address = data.data[0].address;
                        that.country = data.data[0].country;
                        that.state = data.data[0].state;
                        that.fillCityDropDown();
                        that.city = data.data[0].city;
                        that.fillAreaDropDown();
                        that.area = data.data[0].area;
                        that.pincode = data.data[0].pincode;
                        that.hsid = data.data[0].hsid;
                        that.hsname = data.data[0].hsname;
                        that.rdrtyp = data.data[0].rdrtyp;
                        that.salpkg = data.data[0].salpkg;
                        that.workshift = data.data[0].workshift;
                        that.bknm = data.data[0].bknm;
                        that.rdrbknm = data.data[0].rdrbknm;
                        that.acno = data.data[0].acno;
                        that.ifsc = data.data[0].ifsc;
                        that.branch = data.data[0].branch;

                        var weekday = data.data[0].weekday;

                        if (weekday != null) {
                            for (var i = 0; i < weekday.length; i++) {
                                $("#week").find("#" + weekday[i]).prop('checked', true);
                            }
                        }
                    }
                    catch (e) {
                        that._msg.Show(messageType.error, "Error", e);
                    }

                    commonfun.loaderhide();
                }, err => {
                    that._msg.Show(messageType.error, "Error", err);
                    commonfun.loaderhide();
                }, () => {

                })
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/merchant/rider']);
    }
}
