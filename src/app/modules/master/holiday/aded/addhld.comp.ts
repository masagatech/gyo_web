import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { HolidayService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addhld.comp.html',
    providers: [CommonService]
})

export class AddHolidayComponent implements OnInit {
    loginUser: LoginUserModel;

    _wsdetails: any = [];

    hldid: number = 0;
    frmdt: any = "";
    todt: any = "";

    hldcd: string = "";
    hldnm: string = "";
    hlddesc: string = "";

    entityDT: any = [];
    entityList: any = [];
    enttid: number = 0;
    enttname: string = "";

    mode: string = "";
    isactive: boolean = true;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _hldservice: HolidayService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".frmdt").focus();
        }, 100);

        this.getHolidayDetails();
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

    // Selected Owners

    selectEntityData(event) {
        this.enttid = event.value;
        this.enttname = event.label;

        this.addEntityList();
        $(".enttname input").focus();
    }

    // Read Get Entity

    addEntityList() {
        var that = this;

        that.entityList.push({
            "schid": that.enttid, "schnm": that.enttname
        });

        that.enttid = 0;
        that.enttname = "";
    }

    deleteEntity(row) {
        this.entityList.splice(this.entityList.indexOf(row), 1);
    }

    // Active / Deactive Data

    active_deactiveHolidayInfo() {
        var that = this;

        var act_deacthld = {
            "hldid": that.hldid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        this._hldservice.saveHoliday(act_deacthld).subscribe(data => {
            try {
                var dataResult = data.data;

                if (dataResult[0].funsave_holiday.msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", dataResult[0].funsave_holiday.msg);
                    that.getHolidayDetails();
                }
                else {
                    that._msg.Show(messageType.error, "Error", dataResult[0].funsave_holiday.msg);
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

    resetHolidayFields() {
        this.hldid = 0;
        this.frmdt = "";
        this.todt = "";
        this.hldnm = "";
        this.hlddesc = "";
        this.enttid = 0;
        this.enttname = "";

        this.entityList = [];
    }

    // Save Data

    saveHolidayInfo() {
        var that = this;

        if (that.frmdt == "") {
            that._msg.Show(messageType.error, "Error", "Enter From Date");
            $(".frmdt").focus();
        }
        else if (that.todt == "") {
            that._msg.Show(messageType.error, "Error", "Enter To Date");
            $(".todt").focus();
        }
        else if (that.hldnm == "") {
            that._msg.Show(messageType.error, "Error", "Enter Holiday Title");
            $(".hldnm").focus();
        }
        else if (that.entityList.length == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Atleast 1 Entity");
            $(".enttname input").focus();
        }
        else {
            commonfun.loader();

            var _entitylist: string[] = [];

            _entitylist = Object.keys(that.entityList).map(function (k) { return that.entityList[k].schid });

            var saveholiday = {
                "hldid": that.hldid,
                "hldcd": that.hldcd,
                "hldnm": that.hldnm,
                "hlddesc": that.hlddesc,
                "school": _entitylist,
                "frmdt": that.frmdt,
                "todt": that.todt,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._wsdetails.wsautoid,
                "isactive": that.isactive,
                "mode": ""
            }

            that._hldservice.saveHoliday(saveholiday).subscribe(data => {
                try {
                    var dataResult = data.data;
                    var msg = dataResult[0].funsave_holiday.msg;
                    var msgid = dataResult[0].funsave_holiday.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid == "1") {
                            that.resetHolidayFields();
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

    // Get Holiday Data

    getHolidayDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.hldid = params['id'];

                that._hldservice.getHoliday({
                    "flag": "edit",
                    "id": that.hldid,
                    "wsautoid": that._wsdetails.wsautoid
                }).subscribe(data => {
                    try {
                        that.hldid = data.data[0].hldid;
                        that.hldcd = data.data[0].hldcd;
                        that.hldnm = data.data[0].hldnm;
                        that.hlddesc = data.data[0].hlddesc;
                        that.frmdt = data.data[0].frmdt;
                        that.todt = data.data[0].todt;
                        that.isactive = data.data[0].isactive;
                        that.mode = data.data[0].mode;
                        that.entityList = data.data[0].school !== null ? data.data[0].school : [];
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
                that.resetHolidayFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/holiday']);
    }
}