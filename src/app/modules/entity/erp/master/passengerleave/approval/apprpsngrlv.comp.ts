import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { PassengerLeaveService } from '@services/erp';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'apprpsngrlv.comp.html',
    providers: [CommonService]
})

export class ApprovalPassengerLeaveComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    psngrid: number = 0;
    psngrname: string = "";

    headertitle: string = "";
    psngrLeaveDT: any = [];
    psngrLeaveDetailsDT: any = [];
    selectedlvrow: any = [];

    lvid: number = 0;
    frmdt: any = "";
    todt: any = "";
    lvtype: string = "";
    lvfor: string = "emp";
    reason: string = "";
    apprremark: string = "";
    status: number = 0;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _psngrlvservice: PassengerLeaveService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getLeavePassenger();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".enttname input").focus();
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Get Leave Passenger

    getLeavePassenger() {
        var that = this;
        var params = {};

        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['psngrid'] !== undefined) {
                that.psngrid = params['psngrid'];

                params = {
                    "flag": that.lvfor == "emp" ? "empleave" : "psngrleave", "psngrid": that.psngrid,
                    "uid": that.loginUser.uid, "utype": that.loginUser.utype, "issysadmin": that.loginUser.issysadmin,
                    "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
                }

                that._psngrlvservice.getPassengerLeave(params).subscribe(data => {
                    try {
                        that.psngrLeaveDT = data.data;

                        if (that.psngrLeaveDT.length > 0) {
                            that.psngrname = that.psngrLeaveDT[0].psngrname;
                        }
                        else {
                            that.psngrname = "";
                        }
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

    getLeavePassengerDetails(row) {
        var that = this;
        var params = {};

        commonfun.loader();

        that.selectedlvrow = row;
        // that.headertitle = "Voucher No : " + row.expid + " (" + row.countvcr + ")";

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['psngrid'] !== undefined) {
                that.psngrid = params['psngrid'];

                params = {
                    "flag": row.lvfor == "emp" ? "byemp" : "bypsngr", "lvid": row.lvid, "psngrid": that.psngrid,
                    "uid": that.loginUser.uid, "utype": that.loginUser.utype, "issysadmin": that.loginUser.issysadmin,
                    "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
                }

                that._psngrlvservice.getPassengerLeave(params).subscribe(data => {
                    try {
                        that.psngrLeaveDetailsDT = data.data;

                        if (that.psngrLeaveDetailsDT.length > 0) {
                            that.lvid = that.psngrLeaveDetailsDT[0].lvid;
                            that.frmdt = that.psngrLeaveDetailsDT[0].frmdt;
                            that.todt = that.psngrLeaveDetailsDT[0].todt;
                            that.lvtype = that.psngrLeaveDetailsDT[0].lvtype;
                            that.reason = that.psngrLeaveDetailsDT[0].reason;
                        }
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

    // Save Leave Approval

    savePassengerLeaveApproval() {
        var that = this;
        var psngrlvapprdata = {};

        if (that.apprremark == "") {
            that._msg.Show(messageType.info, "Info", "Please Enter Remark");
        }
        else if (that.status == 0) {
            that._msg.Show(messageType.info, "Info", "Please Select Status");
        }
        else {
            commonfun.loader();

            psngrlvapprdata = {
                "lvid": that.lvid,
                "enttid": that._enttdetails.enttid,
                "psngrid": that.psngrid,
                "apprvby": that.loginUser.loginid,
                "apprremark": that.apprremark,
                "lvtype": that.lvtype,
                "status": that.status,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._enttdetails.wsautoid,
                "isactive": true
            }

            that._psngrlvservice.savePassengerLeaveApproval(psngrlvapprdata).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_leaveapproval;
                    var msg = dataResult.confirmmsg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        that.getLeavePassenger();
                        that.resetpsngrLeaveApproval();

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

    resetpsngrLeaveApproval() {
        this.psngrLeaveDetailsDT = [];
        this.apprremark = "";
        this.status = 0;
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/erp/leave/pending']);
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}