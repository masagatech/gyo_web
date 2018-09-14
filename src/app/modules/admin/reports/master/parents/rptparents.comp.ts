import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals, Common } from '@models';
import { PassengerReportsService } from '@services/reports';

declare var $: any;

@Component({
    templateUrl: 'rptparents.comp.html'
})

export class ParentsReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    entityDT: any = [];
    enttid: number = 0;

    prnttype: string = "";
    with91: boolean = false;

    constructor(private _msg: MessageService, private _loginservice: LoginService,
        private _autoservice: CommonService, private _psngrrptservice: PassengerReportsService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillSchoolDropDown();
    }

    public ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
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
                            if (that._enttdetails.entttype == "School") {
                                that.enttid = 0;
                            }
                            else {
                                that.enttid = that._enttdetails.enttid;
                            }
                        }
                    }

                    that.getParentReports("html");
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

    // Download Reports In Excel And PDF

    public getParentReports(format) {
        var that = this;

        var dparams = {
            "flag": "parents", "type": that.prnttype, "with91": that.with91, "enttid": that.enttid, "wsautoid": 0,
            "uid": that.loginUser.uid, "utype": that.loginUser.utype, "issysadmin": that.loginUser.issysadmin, "format": format
        }

        commonfun.loader();

        if (format == "html") {
            that._psngrrptservice.getPassengerReports(dparams).subscribe(data => {
                try {
                    $("#divrptpsngr").html(data._body);
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
            window.open(Common.getReportUrl("getPassengerReports", dparams));
            commonfun.loaderhide();
        }
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
