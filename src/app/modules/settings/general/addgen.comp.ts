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

    gensetDT: any = [];
    mengsettype: string = "";

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
            $(".gsettype input").focus();
        }, 100);
    }

    fillGenSetTypeDDL() {
        var that = this;

        that._genservice.getGeneralSetting({ "flag": "dropdown" }).subscribe(data => {
            that.gensetDT = data.data;
        }, err => {
            that._msg.Show(messageType.error, 'Error', err);
        }, () => {
            // console.log("Complete");
        })
    }

    resetGeneralSetting() {
        $("#gsettype").focus();
        this.gsetid = 0;
        this.gsettypid = 0;
        this.gsetval = "";
    }

    saveGeneralSetting() {
        var that = this;

        if (that.gsettypid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Type");
            $(".gsettype").focus();
        }
        else if (that.gsetval == "") {
            that._msg.Show(messageType.error, "Error", "Enter Value");
            $(".gsetval").focus();
        }
        else {
            var savegenset = {
                "gsetid": that.gsetid,
                "gsettypid": that.gsettypid,
                "gsetval": that.gsetval,
                "cuid": that.loginUser.login,
                "wsautoid": that._wsdetails.wsautoid
            }

            that._genservice.saveGeneralSetting(savegenset).subscribe(data => {
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