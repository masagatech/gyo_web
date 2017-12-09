import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ProspectusService } from '@services/erp';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'apprprspctissd.comp.html',
    providers: [CommonService]
})

export class ApprovalProspectusIssuedComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    headertitle: string = "";
    prospectusIssuedDT: any = [];
    prospectusIssuedDetailsDT: any = [];
    selectedlvrow: any = [];

    issdid: number = 0;
    issddate: any = "";

    prntid: number = 0;
    prntname: string = "";
    childname: string = "";
    gender: string = "";
    classname: string = "";

    remark: string = "";
    apprremark: string = "";
    status: number = 0;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _prspctservice: ProspectusService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getProspectusIssued();
    }

    public ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Get Prospectus Issued

    getProspectusIssued() {
        var that = this;
        var params = {};

        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.prntid = params['id'];

                params = {
                    "flag": "approval", "prntid": that.prntid, "issdid": 0, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
                    "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
                }

                that._prspctservice.getProspectusIssued(params).subscribe(data => {
                    try {
                        that.prospectusIssuedDT = data.data;

                        if (that.prospectusIssuedDT.length > 0) {
                            that.prntname = that.prospectusIssuedDT[0].prntname;
                        }
                        else {
                            that.prntname = "";
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

    getProspectusIssuedDetails(row) {
        var that = this;
        var params = {};

        commonfun.loader();

        that.selectedlvrow = row;

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.prntid = params['id'];

                params = {
                    "flag": "approval", "prntid": that.prntid, "issdid": row.issdid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
                    "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
                }

                that._prspctservice.getProspectusIssued(params).subscribe(data => {
                    try {
                        that.prospectusIssuedDetailsDT = data.data;

                        if (that.prospectusIssuedDetailsDT.length > 0) {
                            that.issdid = that.prospectusIssuedDetailsDT[0].issdid;
                            that.issddate = that.prospectusIssuedDetailsDT[0].issddate;
                            that.childname = that.prospectusIssuedDetailsDT[0].childname;
                            that.gender = that.prospectusIssuedDetailsDT[0].gender;
                            that.classname = that.prospectusIssuedDetailsDT[0].classname;
                            that.remark = that.prospectusIssuedDetailsDT[0].remark;
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

    // Save Prospectus Issued Approval

    saveProspectusIssuedApproval() {
        var that = this;
        var prspctissdapprv = {};

        if (that.apprremark == "") {
            that._msg.Show(messageType.info, "Info", "Please Enter Remark");
        }
        else if (that.status == 0) {
            that._msg.Show(messageType.info, "Info", "Please Select Status");
        }
        else {
            commonfun.loader();

            prspctissdapprv = {
                "typ": "approval",
                "issdid": that.issdid,
                "apprvby": that.loginUser.loginid,
                "apprremark": that.apprremark,
                "status": that.status
            }

            that._prspctservice.saveProspectusIssued(prspctissdapprv).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_prospectusissued;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (that.prospectusIssuedDT.length == 0) {
                            that.backViewData();
                        }
                        else {
                            that.getProspectusIssued();
                            that.resetProspectusIssuedApproval();
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

    resetProspectusIssuedApproval() {
        this.prospectusIssuedDetailsDT = [];
        this.apprremark = "";
        this.status = 0;
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/prospectus/issued/approval']);
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}