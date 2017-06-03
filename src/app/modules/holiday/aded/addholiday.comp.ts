import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { LoginService } from '../../../_services/login/login-service';
import { LoginUserModel } from '../../../_model/user_model';
import { CommonService } from '../../../_services/common/common-service'; /* add reference for master of master */
import { HolidayService } from '../../../_services/holiday/holiday-service';
import { Globals } from '../../../_const/globals';
import { LazyLoadEvent } from 'primeng/primeng';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addholiday.comp.html',
    providers: [HolidayService, CommonService]
})

export class AddHolidayComponent implements OnInit {
    loginUser: LoginUserModel;

    hldid: number = 0;
    frmdt: any = "";
    todt: any = "";

    hldcd: string = "";
    hldnm: string = "";
    hlddesc: string = "";

    entityDT: any = [];
    entityList: any = [];
    entityid: number = 0;
    entityname: string = "";

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _holidayervice: HolidayService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
    }

    public ngOnInit() {
        var that = this;
        this.getHolidayDetails();
    }

    // Auto Completed Entity

    getEntityData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "entity",
            "uid": this.loginUser.uid,
            "typ": this.loginUser.utype,
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
        this.entityid = event.value;
        this.entityname = event.label;

        this.addEntityList();
        $(".entityname input").focus();
    }

    // Read Get Entity

    addEntityList() {
        var that = this;

        that.entityList.push({
            "schid": that.entityid, "schnm": that.entityname
        });

        that.entityid = 0;
        that.entityname = "";
    }

    deleteEntity(row) {
        this.entityList.splice(this.entityList.indexOf(row), 1);
    }

    // Clear Fields

    resetHolidayFields() {
        $("input").val("");
        $("textarea").val("");
        $("select").val("");

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
            $(".entityname input").focus();
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
                "uid": "vivek"
            }

            that._holidayervice.saveHoliday(saveholiday).subscribe(data => {
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
                // console.log("Complete");
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

                that._holidayervice.getHoliday({ "flag": "edit", "id": that.hldid }).subscribe(data => {
                    try {
                        that.hldid = data.data[0].hldid;
                        that.hldcd = data.data[0].hldcd;
                        that.hldnm = data.data[0].hldnm;
                        that.hlddesc = data.data[0].hlddesc;
                        that.frmdt = data.data[0].frmdt;
                        that.todt = data.data[0].todt;
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
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/holiday']);
    }
}