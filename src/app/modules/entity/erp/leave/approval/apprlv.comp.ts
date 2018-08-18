import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { LeaveService } from '@services/erp';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'apprlv.comp.html'
})

export class ApprovalLeaveComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    psngrid: number = 0;
    psngrname: string = "";

    psngrtype: any = "";
    psngrtypenm: any = "";

    headertitle: string = "";
    psngrLeaveDT: any = [];
    leaveDetailsDT: any = [];
    selectedlvrow: any = [];

    lvid: number = 0;
    frmdt: any = "";
    todt: any = "";
    lvtype: string = "";
    reason: string = "";
    apprremark: string = "";
    status: number = 0;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _lvservice: LeaveService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getLeavePassenger();
    }

    public ngOnInit() {
        setTimeout(function () {
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
            if (params['psngrtype'] !== undefined) {
                that.psngrtype = params['psngrtype'];
            }
            else {
                that.psngrtype = "passenger";
            }

            if (params['psngrid'] !== undefined) {
                that.psngrid = params['psngrid'];

                params = {
                    "flag": that.psngrtype == "employee" ? "empleave" : "psngrleave", "psngrid": that.psngrid, "psngrtype": that.psngrtype,
                    "uid": that.loginUser.uid, "utype": that.loginUser.utype, "issysadmin": that.loginUser.issysadmin,
                    "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
                }

                that._lvservice.getLeaveDetails(params).subscribe(data => {
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
        });
    }

    getLeaveDetails(row) {
        var that = this;
        var params = {};

        commonfun.loader();

        that.selectedlvrow = row;

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['psngrid'] !== undefined) {
                that.psngrid = params['psngrid'];

                params = {
                    "flag": row.lvfor == "employee" ? "byemp" : "bypsngr", "lvid": row.lvid, "psngrid": that.psngrid, "psngrtype": that.psngrtype,
                    "uid": that.loginUser.uid, "utype": that.loginUser.utype, "issysadmin": that.loginUser.issysadmin,
                    "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
                }

                that._lvservice.getLeaveDetails(params).subscribe(data => {
                    try {
                        that.leaveDetailsDT = data.data;

                        if (that.leaveDetailsDT.length > 0) {
                            that.lvid = that.leaveDetailsDT[0].lvid;
                            that.frmdt = that.leaveDetailsDT[0].frmdt;
                            that.todt = that.leaveDetailsDT[0].todt;
                            that.lvtype = that.leaveDetailsDT[0].lvtype;
                            that.reason = that.leaveDetailsDT[0].reason;
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

    saveLeaveApproval() {
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
                "apprvby": that.loginUser.uid,
                "apprvtype": that.loginUser.utype,
                "apprremark": that.apprremark,
                "lvtype": that.lvtype,
                "psngrtype": that.psngrtype,
                "status": that.status,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._enttdetails.wsautoid,
                "isactive": true
            }

            that._lvservice.saveLeaveApproval(psngrlvapprdata).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_leaveapproval;
                    var msg = dataResult.confirmmsg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        that.getLeavePassenger();
                        that.resetLeaveApproval();

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

    resetLeaveApproval() {
        this.leaveDetailsDT = [];
        this.apprremark = "";
        this.status = 0;
    }

    // Back For View Data

    viewAllLeave() {
        if (this.psngrtype == "passenger") {
            this._router.navigate(['/master/' + this.psngrtype + '/leave']);
        }
        else {
            this._router.navigate(['/erp/' + this.psngrtype + '/leave']);
        }
    }

    viewPendingLeave() {
        if (this.psngrtype == "passenger") {
            this._router.navigate(['/master/' + this.psngrtype + '/leave/pending']);
        }
        else {
            this._router.navigate(['/erp/' + this.psngrtype + '/leave/pending']);
        }
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}