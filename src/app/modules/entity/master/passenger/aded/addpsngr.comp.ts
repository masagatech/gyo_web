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
    templateUrl: 'addpsngr.comp.html'
})

export class AddPassengerComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    genderDT: any = [];
    alertDT: any = [];

    pickrouteDT: any = [];
    droprouteDT: any = [];
    pickstopsDT: any = [];
    dropstopsDT: any = [];

    ayid: number = 0;
    psngrid: number = 0;
    psngrcode: string = "";
    psngrname: string = "";
    gender: string = "";
    alert: string = "";
    dob: any = "";
    aadharno: any = "";

    mothername: string = "";
    secondarymobile: string = "";
    secondaryemail: string = "";
    fathername: string = "";
    primarymobile: string = "";
    primaryemail: string = "";

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

    // Left Fields

    status: string = "active";
    statusnm: string = "Active";
    leftdate: any = "";
    leftreason: string = "";

    private subscribeParameters: any;

    constructor(private _psngrservice: PassengerService, private _autoservice: CommonService, private _routeParams: ActivatedRoute,
        private _loginservice: LoginService, private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getPhotoUploadConfig();
        this.fillDropDownList();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".enttname input").focus();
        }, 1000);

        this.getPassengerDetails();
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

        that._psngrservice.getPassengerDetails(dparams).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    defayDT = that.ayDT.filter(a => a.iscurrent == true);

                    if (defayDT.length > 0) {
                        that.ayid = defayDT[0].key;
                    }
                    else {
                        that.ayid = 0;
                    }
                }

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

        that._psngrservice.getPassengerDetails({ "flag": "filterroute", "enttid": that._enttdetails.enttid }).subscribe(data => {
            try {
                that.pickrouteDT = data.data;
                // setTimeout(function () { $.AdminBSB.select.refresh('pickrtid'); }, 100);

                that.droprouteDT = data.data;
                // setTimeout(function () { $.AdminBSB.select.refresh('droprtid'); }, 100);
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

        that._psngrservice.getPassengerDetails({ "flag": "filterstop", "rtid": that.droprtid }).subscribe(data => {
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

            that._psngrservice.getPassengerDetails({ "flag": "addr_lat_lon", "rtid": that.pickrtid, "stpid": that.pickstpid }).subscribe(data => {
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

        that.ayid = 0;
        that.psngrid = 0;
        that.psngrcode = "";
        that.psngrname = "";
        that.dob = "";
        that.aadharno = "";
        that.gender = "";
        that.status = "active";
        that.leftdate = "";
        that.leftreason = "";

        that.fathername = "";
        that.mothername = "";
        that.primaryemail = "";
        that.secondaryemail = "";
        that.primarymobile = "";
        that.secondarymobile = "";

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
        that.remark1 = "";
        that.otherinfo = "";

        that.uploadPhotoDT = [];
        that.chooseLabel = "Upload Photo";
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
                var msg = dataResult[0].funsave_psngrinfo.msg;
                var msgid = dataResult[0].funsave_psngrinfo.msgid;

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

        if (that.ayid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Academic Year");
            $(".ayname").focus();
            return false;
        }
        else if (that.psngrname === "") {
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

            var savePassenger = {
                "ayid": that.ayid,
                "psngrid": that.psngrid,
                "psngrcode": that.psngrid,
                "psngrname": that.psngrname,
                "aadharno": that.aadharno,
                "gender": that.gender,
                "dob": that.dob,
                "filepath": that.uploadPhotoDT.length > 0 ? that.uploadPhotoDT[0].athurl : "",

                "status": that.status,
                "leftreason": that.status == "left" ? { "leftdate": that.leftdate, "leftreason": that.leftreason } : {},
                
                "name": that.mothername + ";" + that.fathername,
                "mobileno1": that.primarymobile,
                "mobileno2": that.secondarymobile,
                "email1": that.primaryemail,
                "email2": that.secondaryemail,
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

            that._psngrservice.savePassengerInfo(savePassenger).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_passengerinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

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
                    "wsautoid": that._enttdetails.wsautoid
                }).subscribe(data => {
                    try {
                        if (data.data.length > 0) {
                            that.ayid = data.data[0].ayid;
                            that.psngrid = data.data[0].psngrid;
                            that.psngrcode = data.data[0].psngrcode;
                            that.psngrname = data.data[0].psngrname;
                            that.aadharno = data.data[0].aadharno;
                            that.dob = data.data[0].dob;
                            that.gender = data.data[0].gndrkey;
                            that.status = data.data[0].status;
                            that.statusnm = data.data[0].statusnm;
                            that.leftdate = data.data[0].leftdate;
                            that.leftreason = data.data[0].leftreason;

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

                            that.picklet = data.data[0].picklat;
                            that.picklong = data.data[0].picklon;
                            that.droplet = data.data[0].droplat;
                            that.droplong = data.data[0].droplon;
                            that.remark1 = data.data[0].remark1;
                            that.isactive = data.data[0].isactive;
                            that.mode = data.data[0].mode;

                            that.pickaddr = data.data[0].pickaddr;
                            that.dropaddr = data.data[0].dropaddr;
                            that.otherinfo = data.data[0].otherinfo;

                            if (data.data[0].FilePath !== "") {
                                that.uploadPhotoDT.push({ "athurl": data.data[0].FilePath });
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
                this.fillRoutesDDL();
                that.resetPassengerFields();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/' + this._enttdetails.smpsngrtype]);
    }
}
