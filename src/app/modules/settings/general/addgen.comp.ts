import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { GeneralService } from '@services/master';

@Component({
    templateUrl: 'addgen.comp.html',
    providers: [CommonService]
})

export class AddGeneralComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    generalsetting: any = [];
    gensetDT: any = [];

    gsetid: number = 0;
    gsettypid: number = 0;
    gsetval: string = "";
    gsetdtls: any = [];

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _autoservice: CommonService, private _genservice: GeneralService,
        private _loginservice: LoginService, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        this.fillGenSetTypeDDL();
    }

    ngOnInit() {
        setTimeout(function () {
            $("#enttname input").focus();
        }, 100);
    }

    getGeneralSetting() {
        var that = this;

        that._genservice.getGeneralSetting({
            "flag": "all", "enttid": that._enttdetails.enttid, "wsautoid": that._wsdetails.wsautoid
        }).subscribe(data => {
            that.generalsetting = data.data;
        }, err => {
            that._msg.Show(messageType.error, 'Error', err);
        }, () => {
            // console.log("Complete");
        })
    }

    fillGenSetTypeDDL() {
        var that = this;
        var params = {};

        params = {
            "flag": "dropdown", "enttid": that._enttdetails.enttid,
            "wsautoid": that._wsdetails.wsautoid, "cuid": that.loginUser.ucode
        }

        that._genservice.getGeneralSetting(params).subscribe(data => {
            that.gensetDT = data.data;
            console.log(that.gensetDT);
        }, err => {
            that._msg.Show(messageType.error, 'Error', err);
        }, () => {
            // console.log("Complete");
        })
    }

    resetGeneralSetting() {
        this.gensetDT = [];
    }

    saveGeneralSetting() {
        var that = this;
        var gensetData = [];
        var gsetfield = null;

        for (var i = 0; i < that.gensetDT.length; i++) {
            gsetfield = that.gensetDT[i];

            // if (gsetfield.gsetval !== "") {
            //     gensetData.push({
            //         "gsetid": gsetfield.gsetid, "gsettypid": gsetfield.gsettypid, "enttid": that._enttdetails.enttid,
            //         "gsetkey": gsetfield.gsetkey, "gsetval": gsetfield.gsetval, "gsetgrp": gsetfield.gsetgrp,
            //         "cuid": that.loginUser.ucode, "isactive": true, "wsautoid": that._wsdetails.wsautoid
            //     })
            // }
        }

        if (that._enttdetails.enttid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Entity");
            $("#enttname input").focus();
        }
        else {
            that._genservice.saveGeneralSetting({ "gensetdata": that.gensetDT }).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_generalsetting;

                    if (dataResult.msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", dataResult.msg);
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", dataResult.msg);
                    }
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

    ngOnDestroy() {
    }
}