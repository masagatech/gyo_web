import { Component, OnInit } from '@angular/core';
import { PassengerService } from '../../../_services/passenger/psngr-service';
import { CommonService } from '../../../_services/common/common-service'; /* add reference for master of master */
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { LoginService } from '../../../_services/login/login-service';
import { LoginUserModel } from '../../../_model/user_model';
import { Router, ActivatedRoute } from '@angular/router';
import { Globals } from '../../../_const/globals';

declare var google: any;
declare var loader: any;
declare var adminloader: any;

@Component({
    templateUrl: 'addpsngr.comp.html',
    providers: [PassengerService, CommonService]
})

export class AddPassengerComponent implements OnInit {
    loginUser: LoginUserModel;

    standardDT: any = [];
    divisionDT: any = [];
    genderDT: any = [];

    ownersDT: any = [];
    ownerid: number = 0;
    ownername: string = "";

    entityDT: any = [];
    entityid: number = 0;
    entityname: string = "";

    psngrid: number = 0;
    psngrcode: string = "";
    psngrname: string = "";
    gender: string = "";
    dob: any = "";
    standard: string = "";
    division: string = "";
    aadharno: any = "";

    mothername: string = "";
    secondarymobile: string = "";
    secondaryemail: string = "";
    fathername: string = "";
    primarymobile: string = "";
    primaryemail: string = "";

    resiaddr: string = "";
    pickupaddr: string = "";
    dropaddr: string = "";
    resilet: any = "0.00";
    resilong: any = "0.00";
    pickuplet: any = "0.00";
    pickuplong: any = "0.00";
    droplet: any = "0.00";
    droplong: any = "0.00";

    isCopyPickupAddr: boolean = false;
    isCopyDropAddr: boolean = false;

    otherinfo: string = "";
    remark1: string = "";
    global = new Globals();

    mode: string = "";
    isactive: boolean = true;

    private subscribeParameters: any;

    config = {
        server: this.global.serviceurl + "uploads",
        method: "post",
        maxFilesize: 50,
        acceptedFiles: 'image/*'
    };

    constructor(private _psngrservice: PassengerService, private _autoservice: CommonService, private _routeParams: ActivatedRoute,
        private _loginservice: LoginService, private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this.fillDropDownList();
    }

    public ngOnInit() {
        $(".ownername input").focus();
        this.getPassengerDetails();
    }

    // get lat and long by address form google map

    public onUploadError(event) {
        console.log('error');
    }

    public onUploadSuccess(event) {
        console.log('success');
    }

    // AutoCompleted Users

    getAutoOwners(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "owner",
            "uid": this.loginUser.uid,
            "typ": this.loginUser.utype,
            "otype": "coord",
            "search": query
        }).subscribe(data => {
            this.ownersDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Users

    selectAutoOwners(event) {
        this.ownerid = event.value;
        this.ownername = event.label;

        this.entityid = 0;
        this.entityname = "";
    }

    // Auto Completed Entity

    getEntityData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "ownerwiseentity",
            "oid": this.ownerid,
            "search": query
        }).subscribe((data) => {
            this.entityDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Owners

    selectEntityData(event, type) {
        this.entityid = event.schid;
        this.entityname = event.schnm;
    }

    // Fill Entity, Division, Gender DropDown

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._psngrservice.getPassengerDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.standardDT = data.data.filter(a => a.group === "standard");
                that.divisionDT = data.data.filter(a => a.group === "division");
                that.genderDT = data.data.filter(a => a.group === "gender");
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

    // Copy Pick Up and Drop Address and Lat Lon from Residental Address and Lat Long

    getLatAndLong(pdtype) {
        var that = this;
        commonfun.loader();

        var geocoder = new google.maps.Geocoder();
        var address = pdtype == "resiaddr" ? that.resiaddr : pdtype == "pickupaddr" ? that.pickupaddr : that.dropaddr; //"Chakkinaka, Kalyan (E)";

        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (pdtype == "resiaddr") {
                    that.resilet = results[0].geometry.location.lat();
                    that.resilong = results[0].geometry.location.lng();
                }
                else if (pdtype == "pickupaddr") {
                    that.pickuplet = results[0].geometry.location.lat();
                    that.pickuplong = results[0].geometry.location.lng();
                }
                else {
                    that.droplet = results[0].geometry.location.lat();
                    that.droplong = results[0].geometry.location.lng();
                }
            }
            else {
                that._msg.Show(messageType.error, "Error", "Couldn't find your Location");
            }

            commonfun.loaderhide();
        });
    }

    copyPDAddrAndLatLong(pdtype) {
        if (pdtype == "pickaddr") {
            if (this.isCopyPickupAddr) {
                this.pickupaddr = this.resiaddr;
                this.pickuplet = this.resilet;
                this.pickuplong = this.resilong;
            }
            else {
                this.pickupaddr = "";
                this.pickuplet = "";
                this.pickuplong = "";
            }
        }
        else {
            if (this.isCopyDropAddr) {
                this.dropaddr = this.resiaddr;
                this.droplet = this.resilet;
                this.droplong = this.resilong;
            }
            else {
                this.dropaddr = "";
                this.droplet = "";
                this.droplong = "";
            }
        }
    }

    // Clear Fields

    resetPassengerFields() {
        var that = this;

        that.psngrid = 0
        that.psngrcode = "";
        that.psngrname = "";

        that.dob = "";
        that.division = "";
        that.aadharno = "";
        that.gender = "";
        that.fathername = "";
        that.mothername = "";
        that.primaryemail = "";
        that.secondaryemail = "";
        that.primarymobile = "";
        that.secondarymobile = "";
        that.resiaddr = "";
        that.resilet = "0.00";
        that.resilong = "0.00";
        that.pickupaddr = "";
        that.pickuplet = "0.00";
        that.pickuplong = "0.00";
        that.dropaddr = "";
        that.droplet = "0.00";
        that.droplong = "0.00";
        that.remark1 = "";
        that.otherinfo = "";
    }

    // Active / Deactive Data

    active_deactivePassengerInfo() {
        var that = this;

        var act_deactHoliday = {
            "autoid": that.psngrid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        that._psngrservice.savePassengerInfo(act_deactHoliday).subscribe(data => {
            try {
                var dataResult = data.data;
                var msg = dataResult[0].funsave_studentinfo.msg;
                var msgid = dataResult[0].funsave_studentinfo.msgid;

                if (msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", msg);
                    that.getPassengerDetails();
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

    savePassengerInfo() {
        var that = this;

        if (that.ownerid === 0) {
            that._msg.Show(messageType.error, "Error", "Enter Owner Name");
            $(".ownername input").focus();
        }
        else if (that.entityid === 0) {
            that._msg.Show(messageType.error, "Error", "Select Entity Name");
            $(".entityname input").focus();
        }
        else if (that.psngrname === "") {
            that._msg.Show(messageType.error, "Error", "Enter Passenger Name");
            $(".psngrname").focus();
        }
        else if (that.standard === "") {
            that._msg.Show(messageType.error, "Error", "Select Standard");
            $(".standard").focus();
        }
        else if (that.division === "") {
            that._msg.Show(messageType.error, "Error", "Select Division");
            $(".division").focus();
        }
        else if (that.primaryemail === "") {
            that._msg.Show(messageType.error, "Error", "Enter Primary Email");
            $(".primaryemail").focus();
        }
        else if (that.primarymobile === "") {
            that._msg.Show(messageType.error, "Error", "Enter Primary Mobile");
            $(".primarymobile").focus();
        }
        else if (that.resiaddr === "") {
            that._msg.Show(messageType.error, "Error", "Enter Residental Address");
            $(".resiaddr").focus();
        }
        else if (that.resilet === "") {
            that._msg.Show(messageType.error, "Error", "Enter Residental Lat");
            $(".resilet").focus();
        }
        else if (that.resilong === "") {
            that._msg.Show(messageType.error, "Error", "Enter Residental Long");
            $(".resilong").focus();
        }
        else if (that.pickupaddr === "") {
            that._msg.Show(messageType.error, "Error", "Enter Pick Up Address");
            $(".pickupaddr").focus();
        }
        else if (that.pickuplet === "") {
            that._msg.Show(messageType.error, "Error", "Enter Pick Up Lat");
            $(".pickuplet").focus();
        }
        else if (that.pickuplong === "") {
            that._msg.Show(messageType.error, "Error", "Enter Pick Up Long");
            $(".pickuplong").focus();
        }
        else if (that.dropaddr === "") {
            that._msg.Show(messageType.error, "Error", "Enter Drop Address");
            $(".dropaddr").focus();
        }
        else if (that.droplet === "") {
            that._msg.Show(messageType.error, "Error", "Enter Drop Lat");
            $(".droplet").focus();
        }
        else if (that.droplong === "") {
            that._msg.Show(messageType.error, "Error", "Enter Drop Long");
            $(".droplong").focus();
        }
        else {
            commonfun.loader();

            var passengerprofiledata = {};

            passengerprofiledata = {
                "gender": that.gender, "dob": that.dob, "standard": that.standard, "division": that.division,
                "pickupaddr": that.pickupaddr, "dropaddr": that.dropaddr, "otherinfo": that.otherinfo
            }

            var savePassenger = {
                "autoid": that.psngrid,
                "studentcode": that.psngrid,
                "studentname": that.psngrname,
                "schoolid": that.entityid,
                "name": that.mothername + ";" + that.fathername,
                "mobileno1": that.primarymobile,
                "mobileno2": that.secondarymobile,
                "email1": that.primaryemail,
                "email2": that.secondaryemail,
                "address": that.resiaddr,
                "studentprofiledata": passengerprofiledata,
                "resgeoloc": that.resilet + "," + that.resilong,
                "pickupgeoloc": that.pickuplet + "," + that.pickuplong,
                "pickdowngeoloc": that.droplet + "," + that.droplong,
                "aadharno": that.aadharno,
                "ownerid": that.ownerid,
                "uid": that.loginUser.ucode,
                "remark1": that.remark1,
                "isactive": that.isactive,
                "mode": ""
            }

            that._psngrservice.savePassengerInfo(savePassenger).subscribe(data => {
                try {
                    var dataResult = data.data;
                    var msg = dataResult[0].funsave_studentinfo.msg;
                    var msgid = dataResult[0].funsave_studentinfo.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetPassengerFields();
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

    // Get Passenger Data

    getPassengerDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = this._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.psngrid = params['id'];

                that._psngrservice.getPassengerDetails({ "flag": "edit", "id": that.psngrid }).subscribe(data => {
                    try {
                        that.psngrid = data.data[0].autoid;
                        that.ownerid = data.data[0].ownerid;
                        that.ownername = data.data[0].ownername;
                        that.entityid = data.data[0].schoolid;
                        that.entityname = data.data[0].schoolname;
                        that.psngrcode = data.data[0].studentcode;
                        that.psngrname = data.data[0].studentname;

                        that.aadharno = data.data[0].aadharno;
                        that.mothername = data.data[0].mothername;
                        that.primarymobile = data.data[0].mobileno1;
                        that.primaryemail = data.data[0].email1;
                        that.secondarymobile = data.data[0].mobileno2;
                        that.secondaryemail = data.data[0].email2;
                        that.fathername = data.data[0].fathername;
                        that.resiaddr = data.data[0].address;
                        that.resilet = data.data[0].resilat;
                        that.resilong = data.data[0].resilon;
                        that.pickuplet = data.data[0].pickuplat;
                        that.pickuplong = data.data[0].pickuplon;
                        that.droplet = data.data[0].droplat;
                        that.droplong = data.data[0].droplon;
                        that.remark1 = data.data[0].remark1;
                        that.isactive = data.data[0].isactive;
                        that.mode = data.data[0].mode;

                        var passengerprofiledata = data.data[0].passengerprofiledata;

                        if (passengerprofiledata !== null) {
                            that.gender = data.data[0].gender;
                            that.dob = data.data[0].dob;
                            that.standard = data.data[0].standard;
                            that.division = data.data[0].division;
                            that.pickupaddr = data.data[0].pickupaddr;
                            that.dropaddr = data.data[0].dropaddr;
                            that.otherinfo = data.data[0].otherinfo;
                        }
                        else {
                            that.gender = "";
                            that.dob = "";
                            that.standard = "";
                            that.division = "";
                            that.pickupaddr = "";
                            that.dropaddr = "";
                            that.otherinfo = "";
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
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/passenger']);
    }
}
