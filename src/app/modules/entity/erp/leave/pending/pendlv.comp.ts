import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { LeaveService } from '@services/erp';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'pendlv.comp.html'
})

export class PendingLeaveComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    psngrtype: any = "";
    psngrtypenm: any = "";

    pendingPassengerLeaveDT: any = [];

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _lvservice: LeaveService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getLeaveDetails();
    }

    public ngOnInit() {

    }

    // View Data Rights

    getLeaveDetails() {
        var that = this;
        var params = {};

        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['psngrtype'] !== undefined) {
                that.psngrtype = params['psngrtype'];

                if (that.psngrtype == "student") {
                    that.psngrtypenm = 'Student';
                }
                else if (that.psngrtype == "teacher") {
                    that.psngrtypenm = 'Teacher';
                }
                else {
                    that.psngrtypenm = 'Employee';
                }

                params = {
                    "flag": that.psngrtype == "employee" ? "pendemp" : "pendpsngr", "psngrtype": that.psngrtype,
                    "uid": that.loginUser.uid, "utype": that.loginUser.utype, "enttid": that._enttdetails.enttid,
                    "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
                }

                that._lvservice.getLeaveDetails(params).subscribe(data => {
                    try {
                        that.pendingPassengerLeaveDT = data.data;
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

    public openApprovalForm(row) {
        if (this.psngrtype == "passenger") {
            this._router.navigate(['/master/' + this.psngrtype + '/leave/approval', row.psngrid]);
        }
        else {
            this._router.navigate(['/erp/' + this.psngrtype + '/leave/approval/' + row.psngrid]);
        }
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}