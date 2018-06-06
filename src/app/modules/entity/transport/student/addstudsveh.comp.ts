import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AdmissionService } from '@services/erp';

declare var google: any;

@Component({
    templateUrl: 'addstudsveh.comp.html'
})

export class AddStudentVehicleComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    autoStudentDT: any = [];
    studid: number = 0;
    studname: string = "";
    selectedStudent: any = {};

    ayDT: any = [];
    alertDT: any = [];

    autoid: number = 0;
    ayid: number = 0;
    alert: string = "";

    svhautoid: number = 0;

    pickrouteDT: any = [];
    droprouteDT: any = [];
    pickstopsDT: any = [];
    dropstopsDT: any = [];

    resiaddr: string = "";
    pickaddr: string = "";
    dropaddr: string = "";
    resilet: any = "0.00";
    resilong: any = "0.00";
    picklet: any = "0.00";
    picklong: any = "0.00";
    droplet: any = "0.00";
    droplong: any = "0.00";

    oldpickrtid: number = 0;
    pickrtid: number = 0;
    pickstpid: number = 0;
    olddroprtid: number = 0;
    droprtid: number = 0;
    dropstpid: number = 0;

    isCopyPickAddr: boolean = false;
    isCopyDropAddr: boolean = false;

    mode: string = "";
    isactive: boolean = true;

    private subscribeParameters: any;

    constructor(private _admsnservice: AdmissionService, private _autoservice: CommonService,
        private _routeParams: ActivatedRoute, private _loginservice: LoginService, private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
    }

    public ngOnInit() {
        this.editStudentDetails();
    }

    // Auto Completed Student

    getStudentData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "student",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "issysadmin": this.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.autoStudentDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Student

    selectStudentData(event) {
        this.studid = event.value;
        this.studname = event.label;

        this.getStudentDetails();
    }

    // Fill Standard, Division, Gender, Pick Up Route and Drop Route DropDown

    fillDropDownList() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._admsnservice.getStudentDetails({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
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

                that.alertDT = data.data.filter(a => a.group == "alert");

                that.alert = that.alertDT.filter(a => a.isselected == true)[0].key;
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
        });

        commonfun.loaderhide();
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

    resetVehicleFields() {
        var that = this;

        that.studid = 0;
        that.studname = "";

        that.resiaddr = "";
        that.resilet = "0.00";
        that.resilong = "0.00";

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

    // Save Data

    isValidStudent() {
        var that = this;

        if (that.ayid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Academic Year");
            $(".ayname").focus();
            return false;
        }
        if (that.studname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Student Name");
            $(".studname input").focus();
            return false;
        }
        if (that.resiaddr == "") {
            that._msg.Show(messageType.error, "Error", "Enter Residental Address");
            $(".resiaddr").focus();
            return false;
        }
        if (that.resilet == "") {
            that._msg.Show(messageType.error, "Error", "Enter Residental Lat");
            $(".resilet").focus();
            return false;
        }
        if (that.resilong == "") {
            that._msg.Show(messageType.error, "Error", "Enter Residental Long");
            $(".resilong").focus();
            return false;
        }
        if (that.pickrtid == 0) {
            if (that.pickaddr == "") {
                that._msg.Show(messageType.error, "Error", "Enter Pick Up Address");
                $(".pickaddr").focus();
                return false;
            }
            else if (that.picklet == "") {
                that._msg.Show(messageType.error, "Error", "Enter Pick Up Lat");
                $(".picklet").focus();
                return false;
            }
            else if (that.picklong == "") {
                that._msg.Show(messageType.error, "Error", "Enter Pick Up Long");
                $(".picklong").focus();
                return false;
            }
        }
        if (that.droprtid == 0) {
            if (that.dropaddr == "") {
                that._msg.Show(messageType.error, "Error", "Enter Drop Address");
                $(".dropaddr").focus();
                return false;
            }
            else if (that.droplet == "") {
                that._msg.Show(messageType.error, "Error", "Enter Drop Lat");
                $(".droplet").focus();
                return false;
            }
            else if (that.droplong == "") {
                that._msg.Show(messageType.error, "Error", "Enter Drop Long");
                $(".droplong").focus();
                return false;
            }
        }

        return true;
    }

    saveStudentInfo() {
        var that = this;
        var isvalid: boolean = false;

        isvalid = that.isValidStudent();

        if (isvalid) {
            commonfun.loader();

            var saveStudent = {
                "autoid": that.autoid,
                "ayid": that.ayid,
                "schoolid": that._enttdetails.enttid,
                "studsid": that.studid,
                "alert": that.alert,
                "svhautoid": that.svhautoid,
                "address": that.resiaddr,
                "resgeoloc": (that.resilet == "" ? "0.00" : that.resilet) + "," + (that.resilong == "" ? "0.00" : that.resilong),
                "pickrtid": that.pickrtid,
                "pickstpid": that.pickstpid,
                "pickaddr": that.pickaddr,
                "pickgeoloc": (that.picklet == "" ? "0.00" : that.picklet) + "," + (that.picklong == "" ? "0.00" : that.picklong),
                "droprtid": that.droprtid,
                "dropstpid": that.dropstpid,
                "dropaddr": that.dropaddr,
                "dropgeoloc": (that.droplet == "" ? "0.00" : that.droplet) + "," + (that.droplong == "" ? "0.00" : that.droplong),
                "cuid": that.loginUser.ucode,
                "wsautoid": that._enttdetails.wsautoid,
                "isactive": that.isactive,
                "mode": ""
            }

            that._admsnservice.saveStudentVehicleMap(saveStudent).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_studsvehmap;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        that.getStudentDetails();
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

    // Get Student Data

    editStudentDetails() {
        var that = this;

        that.subscribeParameters = this._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.autoid = params['id'];
                that.getStudentDetails();
            }
            else {
                that.autoid = 0;
                that.fillRoutesDDL();
            }
        });
    }

    getStudentDetails() {
        var that = this;
        commonfun.loader();

        that._admsnservice.viewStudentDetails({
            "flag": "editstuds", "ayid": that.ayid, "studid": that.studid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                var _studsdata = data.data[0];
                var _vhcldata = data.data[1];

                if (_studsdata.length > 0) {
                    that.autoid = _studsdata[0].autoid;
                    that.resiaddr = _studsdata[0].address;

                    that.isactive = _studsdata[0].isactive;
                    that.mode = _studsdata[0].mode;
                }

                if (_vhcldata.length > 0) {
                    that.svhautoid = _vhcldata[0].svhautoid;
                    that.alert = _vhcldata[0].alert;

                    that.resilet = _vhcldata[0].resilat;
                    that.resilong = _vhcldata[0].resilon;

                    that.fillRoutesDDL();

                    that.oldpickrtid = _vhcldata[0].pickrtid;
                    that.pickrtid = _vhcldata[0].pickrtid;
                    that.fillPickStopsDDL();
                    that.pickstpid = _vhcldata[0].pickstpid;

                    that.olddroprtid = _vhcldata[0].droprtid;
                    that.droprtid = _vhcldata[0].droprtid;
                    that.fillDropStopsDDL();
                    that.dropstpid = _vhcldata[0].dropstpid;

                    that.getPickAddressLatLon();
                    that.getDropAddressLatLon();

                    that.pickaddr = _vhcldata[0].pickaddr;
                    that.dropaddr = _vhcldata[0].dropaddr;

                    that.picklet = _vhcldata[0].picklat;
                    that.picklong = _vhcldata[0].picklon;
                    that.droplet = _vhcldata[0].droplat;
                    that.droplong = _vhcldata[0].droplon;
                }
                else {
                    that.resetVehicleFields();
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

    getStudentSchedule(pdtype) {
        var that = this;
        commonfun.loader();

        that._admsnservice.viewStudentDetails({
            "flag": "schedule", "rtid": pdtype == "p" ? that.oldpickrtid : that.olddroprtid, "studid": that.studid, "ayid": that.ayid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                
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
