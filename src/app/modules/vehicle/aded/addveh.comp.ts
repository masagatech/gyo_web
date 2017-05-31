import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../../_services/vehicle/veh-service';
import { LoginService } from '../../../_services/login/login-service';
import { LoginUserModel } from '../../../_model/user_model';
import { CommonService } from '../../../_services/common/common-service' /* add reference for view file type */
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { Globals } from '../../../_const/globals';

@Component({
    templateUrl: 'addveh.comp.html',
    providers: [CommonService]
})

export class AddVehicleComponent implements OnInit {
    loginUser: LoginUserModel;

    vehid: number = 0;
    vehno: string = "";
    vehtyp: string = "";
    vehmake: string = "";
    vehmdl: string = "";
    ownerid: number = 0;
    capacity: number = 0;
    vehcond: string = "";
    vehfclt: string = "";

    mode: string = "";
    isactive: boolean = true;

    ownerDT: any = [];

    private subscribeParameters: any;

    constructor(private _vehservice: VehicleService, private _routeParams: ActivatedRoute, private _router: Router,
        private _msg: MessageService, private _loginservice: LoginService, private _commonservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this.fillDropDownList();
    }

    public ngOnInit() {
        this.getVehicleDetails();
    }

    // Fill Owner Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._vehservice.getVehicleDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.ownerDT = data.data;
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
            // console.log("Complete");
        });
    }

    // Clear Fields

    resetVehicleFields() {
        $("input").val("");
        $("textarea").val("");
        $("select").val("");
    }

    // Save Data

    saveVehicleInfo() {
        var that = this;

        if (that.ownerid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Owner");
            $(".ownerid").focus();
        }
        else if (that.vehno == "") {
            that._msg.Show(messageType.error, "Error", "Enter Vehicle No");
            $(".vehno").focus();
        }
        else if (that.vehtyp == "") {
            that._msg.Show(messageType.error, "Error", "Enter Vehicle Type");
            $(".vehtyp").focus();
        }
        else if (that.ownerid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Owner");
            $(".ownerid").focus();
        }
        else {
            commonfun.loader();

            var savevehicle = {
                "autoid": that.vehid,
                "vehno": that.vehno,
                "vehtyp": that.vehtyp,
                "vehmake": that.vehmake,
                "vehmdl": that.vehmdl,
                "ownerid": that.ownerid,
                "capacity": that.capacity,
                "vehcond": that.vehcond,
                "vehfclt": that.vehfclt,
                "cuid": "vivek",
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
                // console.log("Complete");
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

                that._vehservice.getVehicleDetails({ "flag": "edit", "id": that.vehid }).subscribe(data => {
                    try {
                        var _vehicledata = data.data;

                        that.vehid = _vehicledata[0].autoid;
                        that.vehno = _vehicledata[0].vehicleno;
                        that.vehtyp = _vehicledata[0].vehicletype;
                        that.vehmake = _vehicledata[0].vehiclemake;
                        that.vehmdl = _vehicledata[0].vehiclemodel;
                        that.ownerid = _vehicledata[0].ownerid;
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
                that.resetVehicleFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/vehicle']);
    }
}
