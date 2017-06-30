import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { PassengerService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;
declare var loader: any;
declare var adminloader: any;

@Component({
    templateUrl: 'addpsngr.comp.html',
    providers: [CommonService]
})

export class AddPassengerComponent implements OnInit {
    loginUser: LoginUserModel;

    _wsdetails: any = [];

    standardDT: any = [];
    divisionDT: any = [];
    genderDT: any = [];
    alertDT: any = [];

    pickrouteDT: any = [];
    droprouteDT: any = [];
    pickstopsDT: any = [];
    dropstopsDT: any = [];

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    psngrid: number = 0;
    psngrcode: string = "";
    psngrname: string = "";
    gender: string = "";
    alert: string = "";
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
    pickrtid: number = 0;
    pickstpid: number = 0;
    droprtid: number = 0;
    dropstpid: number = 0;

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
        this._wsdetails = Globals.getWSDetails();
        this.fillDropDownList();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".enttname input").focus();
        }, 1000);

        this.getPassengerDetails();
    }

    // get lat and long by address form google map

    public onUploadError(event) {
        console.log('error');
    }

    public onUploadSuccess(event) {
        console.log('success');
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

    selectEntityData(event) {
        this.enttid = event.value;
        this.enttname = event.label;

        this.fillRoutesDDL();
    }

    // Fill Standard, Division, Gender, Pick Up Route and Drop Route DropDown

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._psngrservice.getPassengerDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.standardDT = data.data.filter(a => a.group === "standard");
                that.divisionDT = data.data.filter(a => a.group === "division");
                that.genderDT = data.data.filter(a => a.group === "gender");

                that.alertDT = data.data.filter(a => a.group === "alert");
                that.alert = that.alertDT.filter(a => a.isselected === true)[0].key;
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

    // Fill Pick Up Stops DropDown

    fillRoutesDDL() {
        var that = this;
        commonfun.loader("#pickrtid");

        that._psngrservice.getPassengerDetails({ "flag": "filterroute", "enttid": that.enttid }).subscribe(data => {
            try {
                that.pickrouteDT = data.data;
                that.droprouteDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#pickrtid");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);

            commonfun.loaderhide();
        }, () => {

        })
    }

    // Fill Pick Up Stops DropDown

    fillPickStopsDDL() {
        var that = this;
        commonfun.loader("#pickstpid");

        if (that.droprtid == 0) {
            that.droprtid = that.pickrtid;
            that.fillDropStopsDDL();
        }

        that._psngrservice.getPassengerDetails({ "flag": "filterstop", "rtid": that.pickrtid }).subscribe(data => {
            try {
                that.pickstopsDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#pickstpid");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);

            commonfun.loaderhide();
        }, () => {

        })
    }

    // Fill Drop Stops DropDown

    fillDropStopsDDL() {
        var that = this;
        commonfun.loader("#dropstpid");

        that._psngrservice.getPassengerDetails({ "flag": "filterstop", "rtid": that.droprtid }).subscribe(data => {
            try {
                that.dropstopsDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#dropstpid");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);

            commonfun.loaderhide();
        }, () => {

        })
    }

    // Get Pick Address, Lat, Long

    getPickAddressLatLon() {
        var that = this;

        if (that.dropstpid == 0) {
            that.dropstpid = that.pickstpid;
        }

        if (that.pickrtid == 0) {
            $(".pickupaddr").removeAttr("disabled");
            $(".pickuplet").removeAttr("disabled");
            $(".pickuplong").removeAttr("disabled");

            that.pickupaddr = "";
            that.pickuplet = "";
            that.pickuplong = "";
        }
        else {
            $(".pickupaddr").attr("disabled", "disabled");
            $(".pickuplet").attr("disabled", "disabled");
            $(".pickuplong").attr("disabled", "disabled");

            commonfun.loader();

            that._psngrservice.getPassengerDetails({ "flag": "addr_lat_lon", "rtid": that.pickrtid, "stpid": that.pickstpid }).subscribe(data => {
                try {
                    if (data.data.length > 0) {
                        that.pickupaddr = data.data[0].address;
                        that.pickuplet = data.data[0].lat;
                        that.pickuplong = data.data[0].long;
                    }
                    else {
                        that.pickupaddr = "";
                        that.pickuplet = "";
                        that.pickuplong = "";
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
    }

    // Get Drop Address, Lat, Long

    getDropAddressLatLon() {
        var that = this;

        if (that.droprtid == 0) {
            $(".dropaddr").removeAttr("disabled");
            $(".droplet").removeAttr("disabled");
            $(".droplong").removeAttr("disabled");

            that.dropaddr = "";
            that.droplet = "";
            that.droplong = "";
        }
        else {
            $(".dropaddr").attr("disabled", "disabled");
            $(".droplet").attr("disabled", "disabled");
            $(".droplong").attr("disabled", "disabled");

            commonfun.loader();

            that._psngrservice.getPassengerDetails({ "flag": "addr_lat_lon", "rtid": that.droprtid, "stpid": that.dropstpid }).subscribe(data => {
                try {
                    if (data.data.length > 0) {
                        that.dropaddr = data.data[0].address;
                        that.droplet = data.data[0].lat;
                        that.droplong = data.data[0].long;
                    }
                    else {
                        that.dropaddr = "";
                        that.droplet = "";
                        that.droplong = "";
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

        that.pickrtid = 0;
        that.pickstpid = 0;
        that.pickupaddr = "";
        that.pickuplet = "0.00";
        that.pickuplong = "0.00";

        that.droprtid = 0;
        that.dropstpid = 0;
        that.dropaddr = "";
        that.droplet = "0.00";
        that.droplong = "0.00";
        that.remark1 = "";
        that.otherinfo = "";
    }

    // Active / Deactive Data

    active_deactivePassengerInfo() {
        var that = this;

        var act_deactPassenger = {
            "autoid": that.psngrid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        that._psngrservice.savePassengerInfo(act_deactPassenger).subscribe(data => {
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

    isValidPassenger() {
        var that = this;

        if (that.enttid === 0) {
            that._msg.Show(messageType.error, "Error", "Select Entity Name");
            $(".enttname input").focus();
            return false;
        }
        else if (that.psngrname === "") {
            that._msg.Show(messageType.error, "Error", "Enter Passenger Name");
            $(".psngrname").focus();
            return false;
        }
        else if (that.standard === "") {
            that._msg.Show(messageType.error, "Error", "Select Standard");
            $(".standard").focus();
            return false;
        }
        else if (that.division === "") {
            that._msg.Show(messageType.error, "Error", "Select Division");
            $(".division").focus();
            return false;
        }
        else if (that.primaryemail === "") {
            that._msg.Show(messageType.error, "Error", "Enter Primary Email");
            $(".primaryemail").focus();
            return false;
        }
        else if (that.primarymobile === "") {
            that._msg.Show(messageType.error, "Error", "Enter Primary Mobile");
            $(".primarymobile").focus();
            return false;
        }
        else if (that.resiaddr === "") {
            that._msg.Show(messageType.error, "Error", "Enter Residental Address");
            $(".resiaddr").focus();
            return false;
        }
        else if (that.resilet === "") {
            that._msg.Show(messageType.error, "Error", "Enter Residental Lat");
            $(".resilet").focus();
            return false;
        }
        else if (that.resilong === "") {
            that._msg.Show(messageType.error, "Error", "Enter Residental Long");
            $(".resilong").focus();
            return false;
        }
        else if (that.pickrtid == 0) {
            if (that.pickupaddr === "") {
                that._msg.Show(messageType.error, "Error", "Enter Pick Up Address");
                $(".pickupaddr").focus();
                return false;
            }
            else if (that.pickuplet === "") {
                that._msg.Show(messageType.error, "Error", "Enter Pick Up Lat");
                $(".pickuplet").focus();
                return false;
            }
            else if (that.pickuplong === "") {
                that._msg.Show(messageType.error, "Error", "Enter Pick Up Long");
                $(".pickuplong").focus();
                return false;
            }
        }
        else if (that.droprtid == 0) {
            if (that.dropaddr === "") {
                that._msg.Show(messageType.error, "Error", "Enter Drop Address");
                $(".dropaddr").focus();
                return false;
            }
            else if (that.droplet === "") {
                that._msg.Show(messageType.error, "Error", "Enter Drop Lat");
                $(".droplet").focus();
                return false;
            }
            else if (that.droplong === "") {
                that._msg.Show(messageType.error, "Error", "Enter Drop Long");
                $(".droplong").focus();
                return false;
            }
        }

        return true;
    }

    savePassengerInfo() {
        var that = this;
        var isvalid: boolean = that.isValidPassenger();

        if (isvalid) {
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
                "schoolid": that.enttid,
                "name": that.mothername + ";" + that.fathername,
                "mobileno1": that.primarymobile,
                "mobileno2": that.secondarymobile,
                "email1": that.primaryemail,
                "email2": that.secondaryemail,
                "alert": that.alert,
                "address": that.resiaddr,
                "resgeoloc": that.resilet + "," + that.resilong,
                "pickrtid": that.pickrtid,
                "droprtid": that.droprtid,
                "pickstpid": that.pickstpid,
                "dropstpid": that.dropstpid,
                "studentprofiledata": passengerprofiledata,
                "pickupgeoloc": that.pickuplet + "," + that.pickuplong,
                "pickdowngeoloc": that.droplet + "," + that.droplong,
                "aadharno": that.aadharno,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._wsdetails.wsautoid,
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

                that._psngrservice.getPassengerDetails({
                    "flag": "edit",
                    "id": that.psngrid,
                    "wsautoid": that._wsdetails.wsautoid
                }).subscribe(data => {
                    try {
                        if (data.data.length > 0) {
                            that.psngrid = data.data[0].autoid;
                            that.enttid = data.data[0].schoolid;
                            that.enttname = data.data[0].schoolname;
                            that.psngrcode = data.data[0].studentcode;
                            that.psngrname = data.data[0].studentname;

                            that.aadharno = data.data[0].aadharno;
                            that.mothername = data.data[0].mothername;
                            that.primarymobile = data.data[0].mobileno1;
                            that.primaryemail = data.data[0].email1;
                            that.secondarymobile = data.data[0].mobileno2;
                            that.secondaryemail = data.data[0].email2;
                            that.fathername = data.data[0].fathername;

                            that.alert = data.data[0].alert;
                            that.resiaddr = data.data[0].address;
                            that.resilet = data.data[0].resilat;
                            that.resilong = data.data[0].resilon;

                            that.fillRoutesDDL();
                            that.pickrtid = data.data[0].pickrtid;
                            that.fillPickStopsDDL();
                            that.pickstpid = data.data[0].pickstpid;
                            that.droprtid = data.data[0].droprtid;
                            that.fillDropStopsDDL();
                            that.dropstpid = data.data[0].dropstpid;

                            that.getPickAddressLatLon();
                            that.getDropAddressLatLon();

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
                if (Cookie.get('_enttnm_') != null) {
                    this.enttid = parseInt(Cookie.get('_enttid_'));
                    this.enttname = Cookie.get('_enttnm_');

                    this.fillRoutesDDL();
                }

                that.resetPassengerFields();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/passenger']);
    }
}
