import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { LeavePassengerService } from '@services/master';
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
    _enttdetails: any = [];

    slid: number = 0;
    remark: string = "";

    passengerDT: any = [];
    psngrid: number = 0;
    psngrname: string = "";

    frmdt: any = "";
    todt: any = "";

    leavetypeDT: string = "";
    restype: string = "";

    ispickup: boolean = false;
    isdrop: boolean = false;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _lvpsngrservice: LeavePassengerService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".enttname input").focus();
        }, 100);

        this.fillLeaveTypeDropDown();
        this.getLeavePassenger();
    }

    // Auto Completed Passenger

    getPassengerData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "passenger",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._wsdetails.wsautoid,
            "id": this._enttdetails.enttid,
            "search": query
        }).subscribe((data) => {
            this.passengerDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Passenger

    selectPassengerData(event) {
        this.psngrid = event.value;
        this.psngrname = event.label;

        Cookie.set("_psngrid_", this.psngrid.toString());
        Cookie.set("_psngrnm_", this.psngrname);
    }

    // Leave Type

    fillLeaveTypeDropDown() {
        var that = this;
        commonfun.loader();

        that._lvpsngrservice.getLeavePassenger({ "flag": "dropdown" }).subscribe(data => {
            that.leavetypeDT = data.data;
            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    // Clear Fields

    resetLeavePassengerFields() {
        this.slid = 0;
        this.psngrid = 0;
        this.psngrname = "";
        this.frmdt = "";
        this.todt = "";
        this.restype = "";
        this.remark = "";
    }

    // Save Data

    saveLeavePassenger() {
        var that = this;

        if (that.psngrid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter " + that._enttdetails.psngrtype + " Name");
            $(".psngrname input").focus();
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

            var savelvpsngr = {
                "slid": that.slid,
                "enttid": that._enttdetails.enttid,
                "psngrid": that.psngrid,
                "frmdt": that.frmdt,
                "todt": that.todt,
                "ispickup": that.ispickup,
                "isdrop": that.isdrop,
                "restype": that.restype,
                "remark": that.remark,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._wsdetails.wsautoid
            }

            that._lvpsngrservice.saveLeavePassenger(savelvpsngr).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_studentleave;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid == "1") {
                            that.resetLeavePassengerFields();
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

    // Get Leave Passenger Data

    getLeavePassenger() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.slid = params['id'];

                that._lvpsngrservice.getLeavePassenger({
                    "flag": "edit",
                    "id": that.slid,
                    "wsautoid": that._wsdetails.wsautoid
                }).subscribe(data => {
                    try {
                        that.slid = data.data[0].slid;
                        that.psngrid = data.data[0].psngrid;
                        that.psngrname = data.data[0].psngrname;
                        that.restype = data.data[0].restype;
                        that.remark = data.data[0].resdesc;
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
                that.resetLeavePassengerFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/leave' + this._enttdetails.smpsngrtype]);
    }
}