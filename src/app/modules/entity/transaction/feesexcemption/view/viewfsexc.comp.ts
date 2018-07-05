import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { FeesService } from '@services/erp';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'viewfsexc.comp.html'
})

export class ViewFeesExcemptionComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    classDT: any = [];

    excemptionfeesDT: any = [];

    ayid: number = 0;
    classid: number = 0;

    private subscribeParameters: any;

    constructor(private _router: Router, private _loginservice: LoginService, private _msg: MessageService,
        private _feesservice: FeesService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getFeesExcemption();
    }

    public ngOnInit() {
        var that = this;
        commonfun.loader();

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

        that._feesservice.getFeesExcemption({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    if (Cookie.get("_ayid_") != null) {
                        that.ayid = parseInt(Cookie.get("_ayid_"));
                    }
                    else {
                        defayDT = that.ayDT.filter(a => a.iscurrent == true);

                        if (defayDT.length > 0) {
                            that.ayid = defayDT[0].id;
                        }
                        else {
                            that.ayid = that._enttdetails.ayid;
                        }
                    }
                }

                that.getFeesExcemption();
                that.classDT = data.data.filter(a => a.group == "class");
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

    // Get Fees Excemption

    getFeesExcemption() {
        var that = this;
        commonfun.loader();

        that._feesservice.getFeesExcemption({
            "flag": "all", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "classid": that.classid, "ayid": that.ayid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid,
            "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.excemptionfeesDT = data.data;
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

    // Total Original Fees

    totalOriginalFees() {
        var that = this;
        var field: any = [];

        var totalorgfees = 0;

        for (var i = 0; i < that.excemptionfeesDT.length; i++) {
            field = that.excemptionfeesDT[i];
            totalorgfees += parseFloat(field.orgfees);
        }

        return totalorgfees;
    }

    // Total Excemption Fees

    totalExcemptionFees() {
        var that = this;
        var field: any = [];

        var totalexcfees = 0;

        for (var i = 0; i < that.excemptionfeesDT.length; i++) {
            field = that.excemptionfeesDT[i];
            totalexcfees += parseFloat(field.excfees);
        }

        return totalexcfees;
    }

    // Add Fees Excemption

    addFeesExcemption() {
        this._router.navigate(['/transaction/feesexcemption/add']);
    }

    // Edit Fees Excemption

    editFeesExcemption(row) {
        this._router.navigate(['/transaction/feesexcemption/edit', row.key.split('-')[1]]);
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
