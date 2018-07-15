import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { InventoryService } from '@services/master';

@Component({
    templateUrl: 'adddsm.comp.html'
})

export class AddDeviceSimMapComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    dsmparamid: number = 0;
    dsmapid: number = 0;

    autoDeviceDT: any = [];
    selectedDevice: any = {};
    devid: number = 0;
    imeino: string = "";

    autoSimDT: any = [];
    selectedSim: any = {};
    simid: number = 0;
    simno: string = "";

    frmdt: any = "";
    todt: any = "";
    nextrenldt: any = "";

    private subscribeParameters: any;

    constructor(private _invservice: InventoryService, private _routeParams: ActivatedRoute, private _router: Router,
        private _msg: MessageService, private _loginservice: LoginService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
    }

    public ngOnInit() {
        this.getDeivceSimMap();
    }

    // Auto Completed Device

    getDeviceData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "device",
            "wsautoid": this._wsdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.autoDeviceDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Device

    selectDeviceData(event) {
        this.devid = event.value;
        this.imeino = event.label;
    }

    // Auto Completed Sim

    getSimData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "simno",
            "wsautoid": this._wsdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.autoSimDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Sim

    selectSimData(event) {
        this.simid = event.value;
        this.simno = event.label;
    }

    // Device Sim Mapping

    // Save Device Sim Map

    saveDeviceSimMap() {
        var that = this;

        if (that.devid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Device IMEI No");
            $(".devimei").focus();
        }
        else if (that.simid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Sim No");
            $(".simno").focus();
        }
        else if (that.frmdt == "") {
            that._msg.Show(messageType.error, "Error", "Enter From Date");
            $(".frmdt").focus();
        }
        else if (that.todt == "") {
            that._msg.Show(messageType.error, "Error", "Enter To Date");
            $(".todt").focus();
        }
        else if (that.nextrenldt == "") {
            that._msg.Show(messageType.error, "Error", "Enter Next Reneual Date");
            $(".nextrenldt").focus();
        }
        else {
            commonfun.loader();

            var params = {
                "dsmapid": that.dsmapid,
                "devid": that.devid,
                "simid": that.simid,
                "frmdt": that.frmdt,
                "todt": that.todt,
                "nextrenldt": that.nextrenldt,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._wsdetails.wsautoid
            }

            that._invservice.saveDeiviceSimMapping(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_devsimmap;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid == "1") {
                            that.getDeivceSimMap();
                            that.resetDeviceSimMap();
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

    // Get Deivce Sim Map

    getDeivceSimMap() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.dsmparamid = params['id'];

                that._invservice.getDeiviceSimMapping({ "flag": "edit", "id": that.dsmparamid, "wsautoid": that._wsdetails.wsautoid }).subscribe(data => {
                    try {
                        that.dsmapid = data.data[0].dsmapid;
                        that.devid = data.data[0].devid;
                        that.imeino = data.data[0].imeino;
                        that.selectedDevice = { value: that.devid, label: that.imeino };

                        that.simid = data.data[0].simid;
                        that.simno = data.data[0].simno;
                        that.selectedSim = { value: that.simid, label: that.simno };

                        that.frmdt = data.data[0].frmdt;
                        that.todt = data.data[0].todt;
                        that.nextrenldt = data.data[0].nextrenldt;
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
                that.resetDeviceSimMap();
                commonfun.loaderhide();
            }
        });
    }

    // Clear Deivce Sim Fields

    resetDeviceSimMap() {
        this.dsmparamid = 0;
        this.dsmapid = 0;

        this.devid = 0;
        this.imeino = "";
        this.selectedDevice = {};

        this.simid = 0;
        this.simno = "";
        this.selectedSim = {};

        this.frmdt = "";
        this.todt = "";
        this.nextrenldt = "";
    }

    public backViewData() {
        this._router.navigate(['/inventory/devicesimmap']);
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}
