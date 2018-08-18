import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AdmissionService } from '@services/erp';

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

        this.fillAcademicYearDropDown();
    }

    ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Fill Academic Year DropDown

    fillAcademicYearDropDown() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._admsnservice.getStudentDetails({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    if (sessionStorage.getItem("_ayid_") == null) {
                        defayDT = that.ayDT.filter(a => a.iscurrent == true);

                        if (defayDT.length > 0) {
                            that.ayid = defayDT[0].key;
                        }
                        else {
                            that.ayid = that._enttdetails.ayid;
                        }
                    }
                    else {
                        that.ayid = parseInt(sessionStorage.getItem("_ayid_"));
                    }
                        
                    that.getStudentDashboard();
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

    // Fill Student Field Wise Data

    getStudentDashboard() {
        var that = this;
        commonfun.loader();

        if (sessionStorage.getItem("_ayid_") != null) {
            that.ayid = parseInt(sessionStorage.getItem("_ayid_"));
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
        sessionStorage.setItem("_ayid_", this.ayid.toString());

        sessionStorage.removeItem("_fltrid_");
        sessionStorage.removeItem("_fltrtype_");

        if (row != null) {
            if (row.grpcode == "prospectus") {
                sessionStorage.setItem("_fltrid_", row.key);
            }
            else if (row.grpcode == "board") {
                sessionStorage.setItem("_fltrid_", row.key);
            }
            else if (row.grpcode == "class") {
                sessionStorage.setItem("_fltrid_", row.key);
            }
            else if (row.grpcode == "gender") {
                sessionStorage.setItem("_fltrid_", row.key);
            }
            else if (row.grpcode == "castcategory") {
                sessionStorage.setItem("_fltrid_", row.key);
            }

            sessionStorage.setItem("_fltrtype_", row.grpcode);
        }

        this._router.navigate(['/erp/student']);
    }

    ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}