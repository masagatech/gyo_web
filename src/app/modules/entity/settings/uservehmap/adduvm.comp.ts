import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { UserVehicleMapService } from '@services/master';

@Component({
    templateUrl: 'adduvm.comp.html',
    providers: [CommonService]
})

export class AddUserVehicleMapComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    usersDT: any = [];
    uid: number = 0;
    uname: any = [];
    utype: string = "";
    selecteudUser: any = [];

    vehicleDT: any = [];
    vehid: number = 0;
    vehname: string = "";
    selectedvehicle: any = [];

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _autoservice: CommonService,
        private _uvmservice: UserVehicleMapService, private _loginservice: LoginService,
        private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();
    }

    ngOnInit() {
        setTimeout(function () {
            $(".enttname input").focus();
        }, 100);
    }

    resetUserVehicleMap() {
        $(".enttname input").focus();
        this.uid = 0;
        this.uname = "";
        this.utype = "";
        this.selecteudUser = [];
        this.vehid = 0;
        this.vehname = "";
        this.selectedvehicle = [];
        this.vehicleDT = [];
    }

    // Auto Completed User

    getUserData(event) {
        var that = this;
        let query = event.query;

        that._autoservice.getAutoData({
            "flag": "formapuser",
            "uid": that.loginUser.uid,
            "ucode": that.loginUser.ucode,
            "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid,
            "issysadmin": that.loginUser.issysadmin,
            "search": query
        }).subscribe(data => {
            that.usersDT = data.data;
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected User

    selectUserData(event, arg) {
        var that = this;

        that.uid = event.uid;
        that.uname = event.uname;
        that.utype = event.utype;

        that.getUserVehicleMap();
    }

    // Auto Completed Vehicle

    getVehicleData(event) {
        var that = this;
        let query = event.query;

        that._autoservice.getAutoData({
            "flag": "vehicle",
            "uid": that.loginUser.uid,
            "ucode": that.loginUser.ucode,
            "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid,
            "issysadmin": that.loginUser.issysadmin,
            "search": query
        }).subscribe(data => {
            that.usersDT = data.data;
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Vehicle

    selectVehicleData(event, arg) {
        this.vehid = event.value;
        this.vehname = event.label;

        this.addvehicleDT();
    }

    // Check Duplicate Vehicle

    isDuplicateVehicle() {
        var that = this;

        for (var i = 0; i < that.vehicleDT.length; i++) {
            var field = that.vehicleDT[i];

            if (field.vehid == this.vehid) {
                this._msg.Show(messageType.error, "Error", "Duplicate Vehicle not Allowed");
                return true;
            }
        }

        return false;
    }

    addvehicleDT() {
        var that = this;
        var duplicateVehicle = that.isDuplicateVehicle();

        if (!duplicateVehicle) {
            that.vehicleDT.push({ "vehid": this.vehid, "vehname": this.vehname })
        }

        that.vehid = 0;
        that.vehname = "";
        that.selectedvehicle = [];

        $(".vehname input").focus();
    }

    deleteVehicle(row) {
        this.vehicleDT.splice(this.vehicleDT.indexOf(row), 1);
    }

    saveUserVehicleMap() {
        var that = this;

        if (that.uid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter User");
            $(".uname input").focus();
        }
        else {
            var selectedVehicle: string[] = [];
            selectedVehicle = Object.keys(that.vehicleDT).map(function (k) { return that.vehicleDT[k].vehid });

            if (selectedVehicle.length === 0) {
                that._msg.Show(messageType.error, "Error", "Select Atleast 1 Vehicle");
            }
            else {
                var saveUR = {
                    "enttid": that._enttdetails.enttid,
                    "uid": that.uid,
                    "utype": that.utype,
                    "vehid": selectedVehicle,
                    "cuid": that.loginUser.ucode,
                    "wsid": that._enttdetails.wsautoid
                }

                that._uvmservice.saveUserVehicleMap(saveUR).subscribe(data => {
                    try {
                        var dataResult = data.data[0].funsave_uservehmap;

                        if (dataResult.msgid != "-1") {
                            that._msg.Show(messageType.success, "Success", dataResult.msg);
                        }
                        else {
                            that._msg.Show(messageType.error, "Error", dataResult.msg);
                        }

                        that.resetUserVehicleMap();
                    }
                    catch (e) {
                        that._msg.Show(messageType.error, "Error", e);
                    }
                }, err => {
                    that._msg.Show(messageType.error, "Error", err);
                }, () => {
                });
            }
        }
    }

    getUserVehicleMap() {
        var that = this;

        that._uvmservice.getUserVehicleMap({
            "flag": "details", "enttid": that._enttdetails.enttid, "uid": that.uid, "utype": that.utype
        }).subscribe(data => {
            try {
                that.vehicleDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
        })
    }

    ngOnDestroy() {
    }
}