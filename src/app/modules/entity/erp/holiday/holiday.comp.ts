import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { HolidayService } from '@services/master';

@Component({
    templateUrl: 'holiday.comp.html'
})

export class HolidayComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    ayid: number = 0;

    psngrtype: any = "";
    psngrtypenm: any = "";

    currentdate: any = "";
    caldate: any = "";

    holidayDT: any = [];

    global = new Globals();

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _hldservice: HolidayService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getHoliday();
    }

    public ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Fill Academic Year, Class Drop Down

    fillDropDownList() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._hldservice.getHoliday({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    if (sessionStorage.getItem("_ayid_") != null) {
                        that.ayid = parseInt(sessionStorage.getItem("_ayid_"));
                    }
                    else {
                        defayDT = that.ayDT.filter(a => a.iscurrent == true);

                        if (defayDT.length > 0) {
                            that.ayid = defayDT[0].id;
                        }
                        else {
                            that.ayid = that._enttdetails.ayid;
                        }
                        
                        that.getHoliday();
                    }
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

    getHoliday() {
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
                    that.psngrtypenm = 'Employee';
                }
                else if (that.psngrtype == "employee") {
                    that.psngrtypenm = 'Employee';
                }
            }
            else {
                that.psngrtype = "passenger";
                that.psngrtypenm = 'Passenger';
            }

            params = {
                "flag": "reports", "hldfor": that.psngrtype, "ayid": that.ayid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
                "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
            }

            that._hldservice.getHoliday(params).subscribe(data => {
                try {
                    that.holidayDT = data.data;
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
        });
    }

    ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
        
        this.subscribeParameters.unsubscribe();
    }
}
