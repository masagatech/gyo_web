import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { HolidayService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addlvpsngr.comp.html',
    providers: [CommonService]
})

export class AddLeavePassengerComponent implements OnInit {
    loginUser: LoginUserModel;

    _wsdetails: any = [];

    leaveid: number = 0;
    restype: string = "";
    resdesc: string = "";

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    passengerDT: any = [];
    psngrid: number = 0;
    psngrname: string = "";

    frmdt: any = "";
    todt: any = "";

    ispickup: boolean = false;
    isdrop: boolean = false;
    
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
        
        $(".enttname input").focus();
    }

    // Clear Fields

    resetHolidayFields() {
        this.leaveid = 0;
        this.frmdt = "";
        this.todt = "";
        this.psngrid = 0;
        this.psngrname = "";
        this.enttid = 0;
        this.enttname = "";
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
        else if (that.enttid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Entity Name");
            $(".enttname").focus();
        }
        else if (that.psngrid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Passenger Name");
            $(".psngrname input").focus();
        }
        else {
            commonfun.loader();

            var saveholiday = {
                "leaveid": that.leaveid,
                "restype": that.restype,
                "resdesc": that.resdesc,
                "frmdt": that.frmdt,
                "todt": that.todt,
                "ispickup": that.ispickup,
                "isdrop": that.isdrop,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._wsdetails.wsautoid
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
                that.leaveid = params['id'];

                that._hldservice.getHoliday({
                    "flag": "edit",
                    "id": that.leaveid,
                    "wsautoid": that._wsdetails.wsautoid
                }).subscribe(data => {
                    try {
                        that.leaveid = data.data[0].leaveid;
                        that.restype = data.data[0].restype;
                        that.resdesc = data.data[0].resdesc;
                        that.frmdt = data.data[0].frmdt;
                        that.todt = data.data[0].todt;
                        that.ispickup = data.data[0].ispickup;
                        that.isdrop = data.data[0].isdrop;
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
        this._router.navigate(['/master/leavepassenger']);
    }
}