import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, MenuService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { GeneralService } from '@services/master';

@Component({
    templateUrl: 'addgen.comp.html',
    providers: [MenuService, CommonService]
})

export class AddGeneralComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    gensetDT: any = [];

    gsetid: number = 0;
    gsettypid: number = 0;
    gsetval: string = "";
    gsetdtls: any = [];

    _wsdetails: any = [];
    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _autoservice: CommonService, private _genservice: GeneralService,
        private _loginservice: LoginService, public _menuservice: MenuService, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this.fillGenSetTypeDDL();
    }

    ngOnInit() {
        setTimeout(function () {
            $("#enttname input").focus();
        }, 100);
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

        this.fillGenSetTypeDDL();
    }

    fillGenSetTypeDDL() {
        var that = this;

        that._genservice.getGeneralSetting({
            "flag": "dropdown", "enttid": that.enttid, "wsautoid": that.loginUser.wsautoid
        }).subscribe(data => {
            that.gensetDT = data.data;
        }, err => {
            that._msg.Show(messageType.error, 'Error', err);
        }, () => {
            // console.log("Complete");
        })
    }

    resetGeneralSetting() {
        $("#enttname input").focus();
        this.enttid = 0;
        this.enttname = "";
        this.gensetDT = [];
    }

    saveGeneralSetting() {
        var that = this;
        var gensetData = [];

        for (var i = 0; i < that.gensetDT.length; i++) {
            var gsetfield = that.gensetDT[i];

            if (gsetfield.gsetval !== "") {
                gensetData.push({
                    "gsetid": gsetfield.gsetid, "gsettypid": gsetfield.gsettypid, "enttid": that.enttid,
                    "gsetkey": gsetfield.gsetkey, "gsetval": gsetfield.gsetval, "gsetgrp": gsetfield.gsetgrp,
                    "cuid": that.loginUser.ucode, "isactive": true, "wsautoid": that.loginUser.wsautoid
                })
            }
        }

        if (that.enttid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Entity");
            $("#enttname input").focus();
        }
        else if (gensetData.length == 0) {
            that._msg.Show(messageType.error, "Error", "Fill Atleast 1 Row");
        }
        else {
            var savegenset = {
                "gsetid": that.gsetid,
                "gsettypid": that.gsettypid,
                "gsetval": that.gsetval,
                "cuid": that.loginUser.login,
                "wsautoid": that._wsdetails.wsautoid
            }

            that._genservice.saveGeneralSetting({ "gensetdata": gensetData }).subscribe(data => {
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