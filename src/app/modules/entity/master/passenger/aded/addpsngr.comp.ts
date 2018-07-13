import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AdmissionService } from '@services/erp';

declare var google: any;
declare var loader: any;
declare var adminloader: any;

@Component({
    templateUrl: 'addpsngr.comp.html'
})

export class AddPassengerComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    genderDT: any = [];
    alertDT: any = [];

    stateDT: any = [];
    cityDT: any = [];
    areaDT: any = [];

    pickrouteDT: any = [];
    droprouteDT: any = [];
    pickstopsDT: any = [];
    dropstopsDT: any = [];

    enrlmntid: number = 0;
    svhautoid: number = 0;
    fname: string = "";
    mname: string = "";
    lname: string = "";
    dob: any = "";
    dobword: string = "";
    birthplace: string = "";
    aadharno: any = "";
    gender: string = "";

    // Left Fields

    status: string = "active";
    statusnm: string = "Active";
    leftdate: any = "";
    leftreason: string = "";

    mthrname: string = "";
    mthrmobile: string = "";
    mthremail: string = "";
    fthrname: string = "";
    fthrmobile: string = "";
    fthremail: string = "";

    // Contact

    country: string = "India";
    state: number = 0;
    stname: string = "";
    city: number = 0;
    ctname: string = "";
    area: number = 0;
    arname: string = "";
    pincode: number = 0;

    // Vehicle Mapping

    alert: string = "";
    resiaddr: string = "";
    pickaddr: string = "";
    dropaddr: string = "";
    resilet: any = "0.00";
    resilong: any = "0.00";
    picklet: any = "0.00";
    picklong: any = "0.00";
    droplet: any = "0.00";
    droplong: any = "0.00";
    pickrtid: number = 0;
    pickstpid: number = 0;
    droprtid: number = 0;
    dropstpid: number = 0;

    isCopyPickAddr: boolean = false;
    isCopyDropAddr: boolean = false;

    otherinfo: string = "";
    remark1: string = "";

    uploadPhotoDT: any = [];
    global = new Globals();
    uploadphotoconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };
    chooseLabel: string = "";

    mode: string = "";
    isactive: boolean = true;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _admsnservice: AdmissionService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getPhotoUploadConfig();
        this.fillDropDownList();
        this.fillStateDropDown();
        this.fillCityDropDown();
        this.fillAreaDropDown();

        this.fillRoutesDDL();
        this.fillPickStopsDDL();
        this.fillDropStopsDDL();

        this.getPassengerDetails();
    }

    public ngOnInit() {

    }

    // Selected Calendar Date

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    setFromDateAndToDate() {
        var date = new Date();
        var before18year = new Date(date.getFullYear() - 18, date.getMonth(), date.getDate());

        this.dob = this.formatDate(before18year);
        this.formatDateToWord(this.dob);
    }

    formatDateToWord(date) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        if (date == "") {
            this.dobword = "This is not a valid date";
        }
        else {
            var _dob = new Date(date);

            var day = this._autoservice.numToWords(_dob.getDate());
            var month = monthNames[_dob.getMonth()];
            var year = this._autoservice.numToWords(_dob.getFullYear());

            this.dobword = day + " " + month + " " + year;
        }
    }

    // Fill Standard, Division, Gender, Pick Up Route and Drop Route DropDown

    fillDropDownList() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        var dparams = {
            "flag": "dropdown", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }

        that._admsnservice.getStudentDetails(dparams).subscribe(data => {
            try {
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

    // Fill Pick Up Stops DropDown

    fillRoutesDDL() {
        var that = this;
        commonfun.loader("#pickrtid");

        that._admsnservice.getStudentDetails({ "flag": "filterroute", "enttid": that._enttdetails.enttid }).subscribe(data => {
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

        that._admsnservice.getStudentDetails({ "flag": "filterstop", "rtid": that.pickrtid }).subscribe(data => {
            try {
                that.pickstopsDT = data.data;
                // setTimeout(function () { $.AdminBSB.select.refresh('pickstpid'); }, 100);
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

        that._admsnservice.getStudentDetails({ "flag": "filterstop", "rtid": that.droprtid }).subscribe(data => {
            try {
                that.dropstopsDT = data.data;
                // setTimeout(function () { $.AdminBSB.select.refresh('dropstpid'); }, 100);
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
            $(".pickaddr").removeAttr("disabled");
            $(".picklet").removeAttr("disabled");
            $(".picklong").removeAttr("disabled");

            that.pickaddr = "";
            that.picklet = "";
            that.picklong = "";
        }
        else {
            $(".pickaddr").attr("disabled", "disabled");
            $(".picklet").attr("disabled", "disabled");
            $(".picklong").attr("disabled", "disabled");

            commonfun.loader();

            that._admsnservice.getStudentDetails({ "flag": "addr_lat_lon", "rtid": that.pickrtid, "stpid": that.pickstpid }).subscribe(data => {
                try {
                    if (data.data.length > 0) {
                        that.pickaddr = data.data[0].address;
                        that.picklet = data.data[0].lat;
                        that.picklong = data.data[0].long;
                    }
                    else {
                        that.pickaddr = "";
                        that.picklet = "";
                        that.picklong = "";
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

            that._admsnservice.getStudentDetails({ "flag": "addr_lat_lon", "rtid": that.droprtid, "stpid": that.dropstpid }).subscribe(data => {
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

    // get lat and long by address form google map

    getLatAndLong(pdtype) {
        var that = this;
        commonfun.loader();

        var geocoder = new google.maps.Geocoder();
        var address = pdtype == "resiaddr" ? that.resiaddr : pdtype == "pickaddr" ? that.pickaddr : that.dropaddr; //"Chakkinaka, Kalyan (E)";

        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (pdtype == "resiaddr") {
                    that.resilet = results[0].geometry.location.lat();
                    that.resilong = results[0].geometry.location.lng();
                }
                else if (pdtype == "pickaddr") {
                    that.picklet = results[0].geometry.location.lat();
                    that.picklong = results[0].geometry.location.lng();
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

    // Copy Pick Up and Drop Address and Lat Lon from Residental Address and Lat Long

    copyPDAddrAndLatLong(pdtype) {
        if (pdtype == "pickaddr") {
            if (this.isCopyPickAddr) {
                this.pickaddr = this.resiaddr;
                this.picklet = this.resilet;
                this.picklong = this.resilong;
            }
            else {
                this.pickaddr = "";
                this.picklet = "";
                this.picklong = "";
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

        that.enrlmntid = 0;
        that.fname = "";
        that.mname = "";
        that.lname = "";
        that.setFromDateAndToDate();
        that.birthplace = "";
        that.aadharno = "";
        that.gender = "";
        that.status = "active";
        that.leftdate = "";
        that.leftreason = "";

        that.fthrname = "";
        that.fthremail = "";
        that.fthrmobile = "";
        that.mthrname = "";
        that.mthremail = "";
        that.mthrmobile = "";
        that.remark1 = "";
        that.otherinfo = "";

        that.resiaddr = that._enttdetails.address;
        that.country = that._enttdetails.country;
        that.state = that._enttdetails.sid;
        that.fillCityDropDown();
        that.city = that._enttdetails.ctid;
        that.fillAreaDropDown();
        that.area = that._enttdetails.arid;
        that.pincode = that._enttdetails.pincode;

        that.uploadPhotoDT = [];
        that.chooseLabel = "Upload Photo";
    }

    resetVehicleMapFields() {
        var that = this;

        that.svhautoid = 0;
        that.resiaddr = that._enttdetails.address;
        that.resilet = that._enttdetails.lat;
        that.resilong = that._enttdetails.lon;

        that.pickrtid = 0;
        that.pickstpid = 0;
        that.pickaddr = "";
        that.picklet = "0.00";
        that.picklong = "0.00";

        that.droprtid = 0;
        that.dropstpid = 0;
        that.dropaddr = "";
        that.droplet = "0.00";
        that.droplong = "0.00";
    }

    // User Photo Upload

    getPhotoUploadConfig() {
        var that = this;

        that._autoservice.getMOM({ "flag": "filebyid", "id": "29" }).subscribe(data => {
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

    // Save Data

    isValidPassenger() {
        var that = this;

        if (that.fname === "") {
            that._msg.Show(messageType.error, "Error", "Enter " + that._enttdetails.psngrtype + " Name");
            $(".psngrname").focus();
            return false;
        }
        if (that.dob == "") {
            that._msg.Show(messageType.error, "Error", "Enter Birth Date");
            $(".dob").focus();
            return false;
        }
        if (that.gender == "") {
            that._msg.Show(messageType.error, "Error", "Select Gender");
            $(".gender").focus();
            return false;
        }
        if (that.status == "left") {
            if (that.leftdate == "") {
                that._msg.Show(messageType.error, "Error", "Enter Left Date");
                $(".leftdate").focus();
                return false;
            }
            if (that.leftreason == "") {
                that._msg.Show(messageType.error, "Error", "Enter Left Reason");
                $(".leftreason").focus();
                return false;
            }
        }
        else if (that.fthrname === "") {
            that._msg.Show(messageType.error, "Error", "Enter Father Name");
            $(".fthrname").focus();
            return false;
        }
        else if (that.fthrmobile === "") {
            that._msg.Show(messageType.error, "Error", "Enter Father Mobile");
            $(".fthrmobile").focus();
            return false;
        }
        else if (that.pickrtid == 0) {
            if (that.pickaddr === "") {
                that._msg.Show(messageType.error, "Error", "Enter Pick Up Address");
                $(".pickaddr").focus();
                return false;
            }
            else if (that.picklet === "") {
                that._msg.Show(messageType.error, "Error", "Enter Pick Up Lat");
                $(".picklet").focus();
                return false;
            }
            else if (that.picklong === "") {
                that._msg.Show(messageType.error, "Error", "Enter Pick Up Long");
                $(".picklong").focus();
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

            var params = {
                "enrlmntid": that.enrlmntid,
                "fname": that.fname,
                "mname": that.mname,
                "lname": that.lname,
                "aadharno": that.aadharno,
                "gender": that.gender,
                "dob": that.dob,
                "birthplace": that.birthplace,
                "filepath": that.uploadPhotoDT.length > 0 ? that.uploadPhotoDT[0].athurl : "",

                "status": that.status,
                "leftreason": that.status == "left" ? { "leftdate": that.leftdate, "leftreason": that.leftreason } : {},

                "name": that.mthrname + ";" + that.fthrname,
                "mobileno1": that.fthrmobile,
                "mobileno2": that.mthrmobile,
                "email1": that.fthremail,
                "email2": that.mthremail,
                "country": that.country,
                "state": that.state,
                "city": that.city,
                "area": that.area,
                "pincode": that.pincode.toString() == "" ? 0 : that.pincode,

                // Vehicle Mapping

                "svhautoid": that.svhautoid,
                "alert": that.alert,
                "resaddr": that.resiaddr,
                "pickaddr": that.pickaddr,
                "dropaddr": that.dropaddr,
                "resgeoloc": (that.resilet == "" ? "0.00" : that.resilet) + "," + (that.resilong == "" ? "0.00" : that.resilong),
                "pickrtid": that.pickrtid,
                "droprtid": that.droprtid,
                "pickstpid": that.pickstpid,
                "dropstpid": that.dropstpid,
                "pickgeoloc": (that.picklet == "" ? "0.00" : that.picklet) + "," + (that.picklong == "" ? "0.00" : that.picklong),
                "dropgeoloc": (that.droplet == "" ? "0.00" : that.droplet) + "," + (that.droplong == "" ? "0.00" : that.droplong),

                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid,
                "remark1": that.remark1,
                "isactive": that.isactive,
                "mode": ""
            }

            that._admsnservice.savePassengerInfo(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_passengerinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetPassengerFields();
                            that.resetVehicleMapFields();
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

        var psngrDT = [];
        var vehmapDT = [];

        commonfun.loader();

        that.subscribeParameters = this._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.enrlmntid = params['id'];

                that._admsnservice.viewStudentDetails({
                    "flag": "editpsngr",
                    "id": that.enrlmntid,
                    "wsautoid": that._enttdetails.wsautoid
                }).subscribe(data => {
                    try {
                        psngrDT = data.data[0];
                        vehmapDT = data.data[1];

                        if (psngrDT.length > 0) {
                            that.enrlmntid = psngrDT[0].enrlmntid;
                            that.fname = psngrDT[0].fname;
                            that.mname = psngrDT[0].mname;
                            that.lname = psngrDT[0].lname;
                            that.aadharno = psngrDT[0].aadharno;
                            that.dob = psngrDT[0].dob;
                            that.birthplace = psngrDT[0].birthplace;
                            that.formatDateToWord(that.dob);
                            that.gender = psngrDT[0].gender;
                            that.status = psngrDT[0].status;
                            that.statusnm = psngrDT[0].statusnm;
                            that.leftdate = psngrDT[0].leftdate;
                            that.leftreason = psngrDT[0].leftreason;

                            that.fthrname = psngrDT[0].fthrname;
                            that.fthrmobile = psngrDT[0].mobileno1;
                            that.fthremail = psngrDT[0].email1;
                            that.mthrname = psngrDT[0].mthrname;
                            that.mthrmobile = psngrDT[0].mobileno2;
                            that.mthremail = psngrDT[0].email2;

                            // Contact Information

                            that.resiaddr = psngrDT[0].address;
                            that.country = psngrDT[0].country;
                            that.state = psngrDT[0].state;
                            that.stname = psngrDT[0].stname;
                            that.fillCityDropDown();
                            that.city = psngrDT[0].city;
                            that.ctname = psngrDT[0].ctname;
                            that.fillAreaDropDown();
                            that.area = psngrDT[0].area;
                            that.arname = psngrDT[0].arname;
                            that.pincode = psngrDT[0].pincode;

                            if (psngrDT[0].FilePath !== "") {
                                that.uploadPhotoDT.push({ "athurl": psngrDT[0].FilePath });
                                that.chooseLabel = "Change Photo";
                            }
                            else {
                                that.uploadPhotoDT = [];
                                that.chooseLabel = "Upload Photo";
                            }
                        }
                        else {
                            that.resetPassengerFields();
                        }

                        if (vehmapDT.length > 0) {
                            that.svhautoid = vehmapDT[0].svhautoid;
                            that.alert = vehmapDT[0].alert;
                            that.resilet = vehmapDT[0].resilat;
                            that.resilong = vehmapDT[0].resilon;

                            that.fillRoutesDDL();
                            that.pickrtid = vehmapDT[0].pickrtid;
                            that.fillPickStopsDDL();
                            that.pickstpid = vehmapDT[0].pickstpid;
                            that.droprtid = vehmapDT[0].droprtid;
                            that.fillDropStopsDDL();
                            that.dropstpid = vehmapDT[0].dropstpid;

                            that.getPickAddressLatLon();
                            that.getDropAddressLatLon();

                            that.picklet = vehmapDT[0].picklat;
                            that.picklong = vehmapDT[0].picklon;
                            that.droplet = vehmapDT[0].droplat;
                            that.droplong = vehmapDT[0].droplon;
                            that.remark1 = vehmapDT[0].remark1;
                            that.isactive = vehmapDT[0].isactive;
                            that.mode = vehmapDT[0].mode;

                            that.pickaddr = vehmapDT[0].pickaddr;
                            that.dropaddr = vehmapDT[0].dropaddr;
                            that.otherinfo = vehmapDT[0].otherinfo;
                        }
                        else {
                            that.resetVehicleMapFields();
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
                that.resetPassengerFields();
                that.resetVehicleMapFields();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/' + this._enttdetails.smpsngrtype + "/profile"]);
    }
}
