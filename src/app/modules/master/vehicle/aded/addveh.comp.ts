import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { VehicleService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'addveh.comp.html',
    providers: [CommonService]
})

export class AddVehicleComponent implements OnInit {
    loginUser: LoginUserModel;

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    vehtypeDT: any = [];

    vehid: number = 0;
    vehno: string = "";
    vehregno: string = "";
    vehtype: string = "";
    vehmake: string = "";
    vehmdl: string = "";
    capacity: number = 0;
    vehcond: string = "";
    vehfclt: string = "";

    mode: string = "";
    isactive: boolean = true;

    _wsdetails: any = [];
    private subscribeParameters: any;

    constructor(private _vehservice: VehicleService, private _routeParams: ActivatedRoute, private _router: Router,
        private _msg: MessageService, private _loginservice: LoginService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this.fillDropDownList();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".enttname input").focus();
        }, 100);

        this.getVehicleDetails();
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
    }

    // Fill Vehicle Type Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._vehservice.getVehicleDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.vehtypeDT = data.data;
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
            "autoid": that.vehid,
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
        this.vehtype = "";
        this.vehno = "";
        this.vehregno = "";
        this.vehmake = "";
        this.vehmdl = "";
        this.capacity = 0;
        this.vehcond = "";
        this.vehfclt = "";
    }

    // Save Data

    saveVehicleInfo() {
        var that = this;

        if (that.enttid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Entity");
            $(".enttname input").focus();
        }
        else if (that.vehtype == "") {
            that._msg.Show(messageType.error, "Error", "Select Vehicle Type");
            $(".vehtype").focus();
        }
        else if (that.vehno == "") {
            that._msg.Show(messageType.error, "Error", "Enter Vehicle No");
            $(".vehno").focus();
        }
        else if (that.vehregno == "") {
            that._msg.Show(messageType.error, "Error", "Enter Vehicle Registration No");
            $(".vehregno").focus();
        }
        else if (that.capacity == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Capacity");
            $(".capacity").focus();
        }
        else {
            commonfun.loader();

            var savevehicle = {
                "autoid": that.vehid,
                "vehno": that.vehno,
                "vehregno": that.vehregno,
                "vehtype": that.vehtype,
                "vehmake": that.vehmake,
                "vehmdl": that.vehmdl,
                "enttid": that.enttid,
                "capacity": that.capacity,
                "vehcond": that.vehcond,
                "vehfclt": that.vehfclt,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._wsdetails.wsautoid,
                "isactive": that.isactive,
                "mode": ""
            }

            this._vehservice.saveVehicleInfo(savevehicle).subscribe(data => {
                try {
                    var dataResult = data.data;
                    var msg = dataResult[0].funsave_vehicleinfo.msg;
                    var msgid = dataResult[0].funsave_vehicleinfo.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetVehicleFields();
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

    // Get vehicle Data

    getVehicleDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.vehid = params['id'];

                that._vehservice.getVehicleDetails({
                    "flag": "edit",
                    "id": that.vehid,
                    "wsautoid": that._wsdetails.wsautoid
                }).subscribe(data => {
                    try {
                        var _vehicledata = data.data;

                        that.vehid = _vehicledata[0].autoid;
                        that.enttid = _vehicledata[0].enttid;
                        that.enttname = _vehicledata[0].enttname;
                        that.vehno = _vehicledata[0].vehicleno;
                        that.vehregno = _vehicledata[0].vehregno;
                        that.vehtype = _vehicledata[0].vehicletype;
                        that.vehmake = _vehicledata[0].vehiclemake;
                        that.vehmdl = _vehicledata[0].vehiclemodel;
                        that.capacity = _vehicledata[0].capacity;
                        that.vehcond = _vehicledata[0].vehiclecondition;
                        that.vehfclt = _vehicledata[0].vehiclefacility;
                        that.isactive = _vehicledata[0].isactive;
                        that.mode = _vehicledata[0].mode;
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
                    that.enttid = parseInt(Cookie.get('_enttid_'));
                    that.enttname = Cookie.get('_enttnm_');
                }

                that.resetVehicleFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/vehicle']);
    }
}
