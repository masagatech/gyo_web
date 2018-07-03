import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AdmissionService } from '@services/erp';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: './dashboard.comp.html'
})

export class StudentDashboardComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    ayDT: any = [];
    ayid: number = 0;

    dashboardDT: any = [];

    constructor(private _router: Router, private _loginservice: LoginService, private _msg: MessageService,
        private _admsnservice: AdmissionService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getStudentDashboard();
    }

    ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Fill Student Field Wise Data

    getStudentDashboard() {
        var that = this;
        commonfun.loader();

        if (Cookie.get("_ayid_") != null) {
            that.ayid = parseInt(Cookie.get("_ayid_"));
        }

        var dbparams = {
            "flag": "dashboard", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "ayid": that.ayid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }

        that._admsnservice.getStudentDetails(dbparams).subscribe(data => {
            try {
                that.dashboardDT = data.data.filter(a => a.grptype == "grid");
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

    // Back For View Data

    viewStudentProfile(row) {
        Cookie.set("_ayid_", this.ayid.toString());

        Cookie.delete("_fltrid_");
        Cookie.delete("_fltrtype_");

        if (row != null) {
            if (row.grpcode == "prospectus") {
                Cookie.set("_fltrid_", row.key);
            }
            else if (row.grpcode == "board") {
                Cookie.set("_fltrid_", row.key);
            }
            else if (row.grpcode == "class") {
                Cookie.set("_fltrid_", row.key);
            }
            else if (row.grpcode == "gender") {
                Cookie.set("_fltrid_", row.key);
            }
            else if (row.grpcode == "castcategory") {
                Cookie.set("_fltrid_", row.key);
            }

            Cookie.set("_fltrtype_", row.grpcode);
        }

        this._router.navigate(['/erp/student']);
    }

    ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}