import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { InventoryService } from '@services/master';

@Component({
    templateUrl: 'addsim.comp.html'
})

export class AddSimComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    global = new Globals();

    simparamid: number = 0;
    simid: number = 0;
    simno: string = "";
    mobileno: string = "";
    simcmpname: string = "";
    simpurdate: any = "";

    private subscribeParameters: any;

    constructor(private _invservice: InventoryService, private _routeParams: ActivatedRoute, private _router: Router,
        private _msg: MessageService, private _loginservice: LoginService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
    }

    public ngOnInit() {
        this.getSimDetails();
    }

    // Sim Master

    // Clear Sim Fields

    resetSimInfo() {
        this.simid = 0;
        this.simno = "";
        this.mobileno = "";
        this.simcmpname = "";
        this.simpurdate = "";
    }

    // Save Sim Data

    saveSimInfo() {
        var that = this;

        if (that.simno == "") {
            that._msg.Show(messageType.error, "Error", "Enter Sim No");
            $(".simno").focus();
        }
        else if (that.mobileno == "") {
            that._msg.Show(messageType.error, "Error", "Enter Mobile No");
            $(".mobileno").focus();
        }
        else if (that.simcmpname == "") {
            that._msg.Show(messageType.error, "Error", "Enter SIM Company Name");
            $(".simcmpname").focus();
        }
        else if (that.simpurdate == 0) {
            that._msg.Show(messageType.error, "Error", "Enter SIM Purchase Date");
            $(".simpurdate").focus();
        }
        else {
            commonfun.loader();

            var params = {
                "simid": that.simid,
                "simno": that.simno,
                "mobileno": that.mobileno,
                "cmpname": that.simcmpname,
                "purdate": that.simpurdate,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._wsdetails.wsautoid
            }

            that._invservice.saveSimInfo(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_siminfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid == "1") {
                            that.getSimDetails();
                            that.resetSimInfo();
                        }
                        else {
                            that.backViewData();
                        }
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
                    }

                    commonfun.loaderhide();
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

    // Get Sim Data

    getSimDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.simparamid = params['id'];

                that._invservice.getSimDetails({ "flag": "edit", "id": that.simparamid, "wsautoid": that._wsdetails.wsautoid }).subscribe(data => {
                    try {
                        that.simid = data.data[0].simid;
                        that.simno = data.data[0].simno;
                        that.mobileno = data.data[0].mobileno;
                        that.simcmpname = data.data[0].cmpname;
                        that.simpurdate = data.data[0].purdate;
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
                that.resetSimInfo();
                commonfun.loaderhide();
            }
        });
    }

    public backViewData() {
        this._router.navigate(['/inventory/sim']);
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}
