import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals, Common } from '@models';
import { UserService } from '@services/master';
import { ReportsService } from '@services/reports';

declare var $: any;

@Component({
    templateUrl: 'rptuser.comp.html'
})

export class UserReportsComponent implements OnInit, OnDestroy {
    _enttdetails: any = [];
    loginUser: LoginUserModel;

    global = new Globals();

    utypeDT: any = [];
    srcutype: string = "";

    uname: string = "";

    entityDT: any = [];
    enttid: number = 0;

    usersDT: any = [];

    constructor(private _msg: MessageService, private _loginservice: LoginService, private _autoservice: CommonService,
        private _userservice: UserService, private _rptservice: ReportsService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillUserTypeDropDown();
        this.fillSchoolDropDown();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Fill Dropdown

    fillUserTypeDropDown() {
        var that = this;
        commonfun.loader();

        that._userservice.getUserDetails({ "flag": "dropdown", "utype": that.loginUser.utype }).subscribe(data => {
            that.utypeDT = data.data.filter(a => a.group == "usertype");
            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    // Fill School Drop Down

    fillSchoolDropDown() {
        var that = this;
        var defschoolDT: any = [];

        commonfun.loader();

        that._autoservice.getDropDownData({
            "flag": "school", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": 0, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.entityDT = data.data;

                if (that.entityDT.length > 0) {
                    defschoolDT = that.entityDT.filter(a => a.iscurrent == true);

                    if (defschoolDT.length > 0) {
                        that.enttid = defschoolDT[0].enttid;
                    }
                    else {
                        if (sessionStorage.getItem("_schenttdetails_") == null && sessionStorage.getItem("_schenttdetails_") == undefined) {
                            that.enttid = 0;
                        }
                        else {
                            that.enttid = that._enttdetails.enttid;
                        }
                    }

                    that.getUserReports("html");
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

    // Get User Reports

    public getUserReports(format) {
        var that = this;

        var dparams = {
            "flag": "reports", "enttid": that.enttid, "wsautoid": 0, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin, "format": format
        }

        commonfun.loader();

        if (format == "html") {
            that._rptservice.getUserReports(dparams).subscribe(data => {
                try {
                    $("#divrptusermst").html(data._body);
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
            window.open(Common.getReportUrl("getUserReports", dparams));
            commonfun.loaderhide();
        }
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
