import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { VehicleService } from '@services/master';

@Component({
    templateUrl: 'addveh.comp.html'
})

export class AddVehicleComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    vehtypeDT: any = [];
    devtypeDT: any = [];
    d1strDT: any = [];

    vehid: number = 0;
    autoid: number = 0;
    vehtype: string = "";
    vehname: string = "";
    vehregno: string = "";
    vehregnoPattern = "^[A-Z]{2}-[0-9]{2}-[A-Z]{1,2}-[0-9]{1,4}$";
    vehmake: string = "";
    vehmodel: string = "";
    capacity: number = 0;
    vehcond: string = "";
    vehfclt: string = "";

    frmdt: any = "";
    todt: any = "";
    devtype: string = "";
    imei: string = "";
    simno: string = "";
    speedAllow: number = 0;
    d1str: string = "";
    vehurl: string = "";

    tracktypeDT: any = [];

    mode: string = "";
    isactive: boolean = true;
    isprivate: boolean = true;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _vehservice: VehicleService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
    }

    public ngOnInit() {
        this.getVehicleDetails();
    }

    // Set From Date and To Date

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
        var before1month = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        this.frmdt = this.formatDate(before1month);
        this.todt = this.formatDate(today);
    }

    // Fill Vehicle Type Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._vehservice.getVehicleDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.vehtypeDT = data.data.filter(a => a.group == "vehicletype");
                that.devtypeDT = data.data.filter(a => a.group == "devicetype");
                that.d1strDT = data.data.filter(a => a.group == "d1str");
                that.tracktypeDT = data.data.filter(a => a.group == "tracktype");
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide();
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    // Active / Deactive Data

    active_deactiveVehicleInfo() {
        var that = this;

        var act_deactvehicle = {
            "autoid": that.autoid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        this._vehservice.saveVehicleInfo(act_deactvehicle).subscribe(data => {
            try {
                var dataResult = data.data;

                if (dataResult[0].funsave_vehicleinfo.msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", dataResult[0].funsave_vehicleinfo.msg);
                    that.getVehicleDetails();
                }
                else {
                    that._msg.Show(messageType.error, "Error", dataResult[0].funsave_vehicleinfo.msg);
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            console.log(err);
        }, () => {
        });
    }

    // Clear Fields

    resetVehicleFields() {
        this.vehid = 0;
        this.autoid = 0;
        this.vehtype = "";
        this.vehname = "";
        this.vehmake = "";
        this.vehmodel = "";
        this.capacity = 0;
        this.vehcond = "";
        this.vehfclt = "";
        this.devtype = "";
        this.simno = "";
        this.speedAllow = 0;
        this.d1str = "";
        this.vehurl = "";
        this.isprivate = false;
        this.setFromDateAndToDate();
    }

    // Save Data

    isValidateVehicle() {
        var that = this;
        var _vehregno = $("#divinvalidvehregno").innerHtml;

        console.log(_vehregno);

        if (that.imei == "") {
            that._msg.Show(messageType.error, "Error", "Enter IMEI");
            $(".imei").focus();
            return false;
        }
        if (that.vehregno == "") {
            that._msg.Show(messageType.error, "Error", "Enter Vehicle Registration No");
            $(".vehregno").focus();
            return false;
        }
        if (_vehregno == "Not Valid") {
            that._msg.Show(messageType.error, "Error", "Invalid Vehicle Registration No");
            $(".vehregno").focus();
            return false;
        }
        if (that.vehtype == "") {
            that._msg.Show(messageType.error, "Error", "Select Vehicle Type");
            $(".vehtype").focus();
            return false;
        }
        if (that.vehname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Vehicle No");
            $(".vehno").focus();
            return false;
        }
        if (that.capacity == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Capacity");
            $(".capacity").focus();
            return false;
        }

        if (that.devtype == "") {
            that._msg.Show(messageType.error, "Error", "Enter Device Type");
            $(".devtype").focus();
            return false;
        }
        if (that.simno == "") {
            that._msg.Show(messageType.error, "Error", "Enter SIM No");
            $(".simno").focus();
            return false;
        }
        if (that.speedAllow.toString() == "") {
            that._msg.Show(messageType.error, "Error", "Enter SIM No");
            $(".simno").focus();
            return false;
        }

        return true;
    }

    saveVehicleInfo() {
        var that = this;
        var trktype = "";
        var pushcl = [];

        var isvalid = that.isValidateVehicle();

        $("#track").find("input[type=checkbox]").each(function () {
            if (this.checked) {
                pushcl.push($(this).val())
            }
        });

        trktype = JSON.stringify(pushcl).replace("[", "{").replace("]", "}");

        if (isvalid) {
            commonfun.loader();

            var params = {
                "vemid": that.vehid,
                "vehid": that.autoid,
                "vehtype": that.vehtype,
                "vehname": that.vehname,
                "vehregno": that.vehregno,
                "vehmake": that.vehmake,
                "vehmodel": that.vehmodel,
                "capacity": that.capacity,
                "vehcond": that.vehcond,
                "vehfclt": that.vehfclt,
                "vehspeed": parseInt("" + that.speedAllow),
                "istrack": true,
                "devtype": that.devtype,
                "imei": that.imei,
                "simno": that.simno,
                "url": that.vehurl,
                "trktype": trktype,
                "extra": that.d1str == "" ? {} : { "d1str": that.d1str },
                "mode": "",
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid,
                "cuid": that.loginUser.ucode,
                "isactive": that.isactive,
                "isprivate": that.isprivate
            }

            that._vehservice.saveVehicleInfo(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_vehicleinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        try {
                            // Saving Data To VTS

                            that.saveToVTS({
                                "vhid": params.imei,
                                "vhname": params.vehregno,
                                "alwspeed": params.vehspeed,
                                "pushcl": pushcl,
                                "vhd": {
                                    "vehregno": that.vehregno,
                                    "vehtype": that.vehtype,
                                    "vehmake": that.vehmake,
                                    "vehmdl": that.vehmodel,
                                    "simno": that.simno,
                                    "imei": that.imei,
                                    "capacity": that.capacity,
                                    "vehcond": that.vehcond,
                                    "vehfclt": that.vehfclt,
                                    "d1str": that.d1str
                                }
                            })
                        }
                        catch (e) {
                            that._msg.Show(messageType.error, "Error", e);
                        }

                        if (msgid === "1") {
                            $(".hidewhen input").removeAttr("disabled");
                            $(".hidewhen select").removeAttr("disabled");
                            that.resetVehicleFields();
                            that.imei = "";
                        }
                        else {
                            that.backViewData();
                        }
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
                    }

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
            });
        }
    }

    saveToVTS(vhdata) {
        var that = this;

        that._vehservice.saveVehicleInfoToVts(vhdata).subscribe(data => {

        }, err => {

        }, () => {
        });
    }

    // Get Vehicle Data By ID

    getVehicleDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.vehid = params['id'];

                that._vehservice.getVehicleDetails({
                    "flag": "edit",
                    "id": that.vehid,
                    "wsautoid": that._enttdetails.wsautoid
                }).subscribe(data => {
                    try {
                        if (data.data.length == 0) {
                            that.resetVehicleFields();
                            that.imei = "";
                        }
                        else {
                            var _vehicledata = data.data;

                            that.vehid = _vehicledata[0].vehid;
                            that.autoid = _vehicledata[0].autoid;
                            that.vehtype = _vehicledata[0].vehicletype;
                            that.vehname = _vehicledata[0].vehiclename;
                            that.vehregno = _vehicledata[0].vehregno;
                            that.vehmake = _vehicledata[0].vehiclemake;
                            that.vehmodel = _vehicledata[0].vehiclemodel;
                            that.capacity = _vehicledata[0].capacity;
                            that.vehcond = _vehicledata[0].vehiclecondition;
                            that.vehfclt = _vehicledata[0].vehiclefacility;
                            that.devtype = _vehicledata[0].devtype;
                            that.imei = _vehicledata[0].imei;
                            that.simno = _vehicledata[0].simno;
                            that.speedAllow = _vehicledata[0].vhspeed;
                            that.d1str = _vehicledata[0].d1str;

                            var trktypedt = data.data[0].trktype;

                            if (trktypedt != null) {
                                for (var i = 0; i < trktypedt.length; i++) {
                                    $("#track").find("#" + trktypedt[i]).prop('checked', true);
                                }
                            }

                            that.vehurl = _vehicledata[0].url;
                            that.isprivate = _vehicledata[0].isprivate;
                            that.isactive = _vehicledata[0].isactive;
                            that.mode = _vehicledata[0].mode;
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
                that.getVehicleByIMEI();
                commonfun.loaderhide();
            }
        });
    }

    // Get Vehicle Data By IMEI

    getVehicleByIMEI() {
        var that = this;
        commonfun.loader();

        that._vehservice.getVehicleDetails({
            "flag": "byimei",
            "imei": that.imei,
            "vehregno": that.vehregno,
            "enttid": that._enttdetails.enttid
        }).subscribe(data => {
            try {
                if (data.data.length == 0) {
                    $(".hidewhen input").removeAttr("disabled");
                    $(".hidewhen select").removeAttr("disabled");
                    that.resetVehicleFields();
                }
                else {
                    $(".hidewhen input").attr("disabled", "disabled");
                    $(".hidewhen select").attr("disabled", "disabled");

                    var _vehicledata = data.data;

                    that.vehid = _vehicledata[0].vehid;
                    that.autoid = _vehicledata[0].autoid;
                    that.imei = _vehicledata[0].imei;
                    that.vehregno = _vehicledata[0].vehregno;
                    that.vehtype = _vehicledata[0].vehicletype;
                    that.vehname = _vehicledata[0].vehiclename;
                    that.vehmake = _vehicledata[0].vehiclemake;
                    that.vehmodel = _vehicledata[0].vehiclemodel;
                    that.capacity = _vehicledata[0].capacity;
                    that.vehcond = _vehicledata[0].vehiclecondition;
                    that.vehfclt = _vehicledata[0].vehiclefacility;
                    that.devtype = _vehicledata[0].devtype;
                    that.simno = _vehicledata[0].simno;
                    that.speedAllow = _vehicledata[0].vhspeed;
                    that.d1str = _vehicledata[0].d1str;

                    var trktypedt = data.data[0].trktype;

                    if (trktypedt != null) {
                        for (var i = 0; i < trktypedt.length; i++) {
                            $("#track").find("#" + trktypedt[i]).prop('checked', true);
                        }
                    }

                    that.vehurl = _vehicledata[0].url;
                    that.isactive = _vehicledata[0].isactive;
                    that.mode = _vehicledata[0].mode;
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

    // Back For View Data

    backViewData() {
        this._router.navigate(['/transport/vehicle']);
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}
