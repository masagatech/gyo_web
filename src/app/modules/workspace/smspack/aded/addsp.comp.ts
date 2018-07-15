import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { SMSPackService } from '@services/master';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addsp.comp.html'
})

export class AddSMSPackComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";
    selectedEntity: any = [];

    packid: number = 0;
    smspack: any = "";
    packamt: any = "";
    frmdt: any = "";
    todt: any = "";

    remark: string = "";

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _spservice: SMSPackService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
    }

    public ngOnInit() {
        this.getSMSPack();
    }

    // Auto Completed Entity

    getEntityData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "entity",
            "uid": this.loginUser.uid,
            "utype": this.loginUser.utype,
            "wsautoid": this._wsdetails.wsautoid,
            "issysadmin": this._wsdetails.issysadmin,
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

    // Clear Fields

    resetSMSPackFields() {
        this.packid = 0;
        this.smspack = "";
        this.packamt = "";
        this.frmdt = "";
        this.todt = "";
        this.remark = "";
    }

    // Save SMSPack Data

    saveSMSPack() {
        var that = this;

        if (that.enttid == 0) {
            that._msg.Show(messageType.error, "Error", "Select School");
            $(".enttname input").focus();
        }
        else if (that.smspack == "") {
            that._msg.Show(messageType.error, "Error", "Enter SMS Pack");
            $(".smspack").focus();
        }
        else if (that.smspack == "0") {
            that._msg.Show(messageType.error, "Error", "SMS Pack 0 Not Allowed");
            $(".smspack").focus();
        }
        else if (that.packamt == "") {
            that._msg.Show(messageType.error, "Error", "Enter SMSPack Title");
            $(".packamt").focus();
        }
        else if (that.packamt == "0") {
            that._msg.Show(messageType.error, "Error", "Amount 0 Not Allowed");
            $(".packamt").focus();
        }
        else if (that.frmdt == "") {
            that._msg.Show(messageType.error, "Error", "Enter From Date");
            $(".frmdt").focus();
        }
        else if (that.todt == "") {
            that._msg.Show(messageType.error, "Error", "Enter To Date");
            $(".todt").focus();
        }
        else {
            commonfun.loader();

            var saveSMSPack = {
                "packid": that.packid,
                "smspack": that.smspack,
                "packamt": that.packamt,
                "frmdt": that.frmdt,
                "todt": that.todt,
                "remark": that.remark,
                "cuid": that.loginUser.ucode,
                "enttid": that.enttid,
                "wsautoid": that._wsdetails.wsautoid,
                "mode": ""
            }

            that._spservice.saveSMSPack(saveSMSPack).subscribe(data => {
                try {
                    var dataResult = data.data;
                    var msg = dataResult[0].funsave_smspack.msg;
                    var msgid = dataResult[0].funsave_smspack.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid == "1") {
                            that.resetSMSPackFields();
                        }
                        else {
                            that.backViewData();
                        }

                        commonfun.loaderhide();
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
                        commonfun.loaderhide();
                    }
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

    // Get SMSPack Data

    getSMSPack() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.packid = params['id'];

                that._spservice.getSMSPack({
                    "flag": "edit",
                    "packid": that.packid,
                    "wsautoid": that._wsdetails.wsautoid
                }).subscribe(data => {
                    try {
                        var viewsp = data.data;

                        that.enttid = viewsp[0].enttid;
                        that.enttname = viewsp[0].enttname;
                        
                        that.selectedEntity = {
                            value: that.enttid,
                            label: that.enttname
                        }

                        that.packid = viewsp[0].packid;
                        that.smspack = viewsp[0].smspack;
                        that.packamt = viewsp[0].packamt;
                        that.frmdt = viewsp[0].frmdt;
                        that.todt = viewsp[0].todt;
                        that.remark = viewsp[0].remark;
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
                that.resetSMSPackFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/workspace/smspack']);
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}