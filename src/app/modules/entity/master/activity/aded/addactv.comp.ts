import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ActivityService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;

@Component({
    templateUrl: 'addactv.comp.html',
    providers: [CommonService]
})

export class AddActivityComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    actvid: number = 0;
    actvname: string = "";
    actvdesc: string = "";

    actvtypeDT: any = [];
    typeid: number = 0;

    actvheadDT: any = [];
    headDT: any = [];
    headid: number = 0;
    headname: string = "";
    actvheadList: any = [];

    private subscribeParameters: any;

    constructor(private _actvservice: ActivityService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
    }

    public ngOnInit() {
        this.getActivityDetails();

        setTimeout(function () {
            $(".actytype").focus();
        }, 200);
    }

    // Fill Activity Type Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._actvservice.getActivityDetails({
            "flag": "dropdown", "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.actvtypeDT = data.data;
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

    // Auto Completed Activity Head

    getActivityHeadData(event) {
        let query = event.query;

        this._autoservice.getERPAutoData({
            "flag": "employee",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "emptype": "actvhead",
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "issysadmin": this.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.actvheadDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Activity Head

    selectActivityHeadData(event) {
        this.headid = event.value;
        this.headname = event.label;

        this.addActivityHead();
    }

    // Check Duplicate Activity Head

    isDuplicateActivityHead() {
        var that = this;

        for (var i = 0; i < that.actvheadList.length; i++) {
            var field = that.actvheadList[i];

            if (field.headid == this.headid) {
                this._msg.Show(messageType.error, "Error", "Duplicate Head not Allowed");
                return true;
            }
        }

        return false;
    }

    // Add Activity Head

    addActivityHead() {
        var that = this;
        var duplactvhead = that.isDuplicateActivityHead();

        if (!duplactvhead) {
            that.actvheadList.push({
                "headid": that.headid,
                "headname": that.headname,
            });
        }

        that.headid = 0;
        that.headname = "";
        that.headDT = [];
    }

    // Delete Activity Head

    deleteActivityHead(row) {
        this.actvheadList.splice(this.actvheadList.indexOf(row), 1);
    }

    // Clear Fields

    resetActivityFields() {
        var that = this;

        that.actvid = 0;
        that.actvname = "";
        that.actvdesc = "";
        that.typeid = 0;
        that.actvheadList = [];
        that.headid = 0;
        that.headname = "";
    }

    // Save Activity

    saveActivityInfo() {
        var that = this;

        if (that.typeid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Activity Type");
            $(".actytype").focus();
        }
        else if (that.actvname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Activity Name");
            $(".actvname").focus();
        }
        else if (that.actvheadList.length == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Head Name");
            $(".headname input").focus();
        }
        else {
            commonfun.loader();

            var _actvheadids: string[] = [];
            _actvheadids = Object.keys(that.actvheadList).map(function (k) { return that.actvheadList[k].headid });

            var saventf = {
                "actvid": that.actvid,
                "actvname": that.actvname,
                "actvdesc": that.actvdesc,
                "actvtypid": that.typeid,
                "actvheadid": _actvheadids,
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid
            }

            this._actvservice.saveActivityInfo(saventf).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_activityinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetActivityFields();
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
                // console.log("Complete");
            });
        }
    }

    // Get Activity

    getActivityDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.actvid = params['id'];

                that._actvservice.getActivityDetails({
                    "flag": "edit", "actvid": that.actvid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
                }).subscribe(data => {
                    try {
                        that.actvid = data.data[0].actvid;
                        that.actvname = data.data[0].actvname;
                        that.actvdesc = data.data[0].actvdesc;
                        that.typeid = data.data[0].typeid;

                        // that.headid = data.data[0].headid;
                        // that.headname = data.data[0].headname;
                        // that.headDT.value = that.headid;
                        // that.headDT.label = that.headname;

                        that.actvheadList = data.data[0].headdata;
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
                that.resetActivityFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/activity']);
    }
}
