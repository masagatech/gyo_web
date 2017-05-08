import { Component, OnInit } from '@angular/core';
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../_services/common/common-service'; /* add reference for master of master */
import { MenuService } from '../../../_services/menus/menu-service';
import { LoginService } from '../../../_services/login/login-service';
import { LoginUserModel } from '../../../_model/user_model';
import { ReportsService } from '../../../_services/reports/rpt-service';

@Component({
    templateUrl: 'attrpt.comp.html',
    providers: [CommonService, MenuService, ReportsService]
})

export class AttendanceReportsComponent implements OnInit {
    monthDT: any = [];

    attColumn: any = [];
    attData: any = [];
    schoolDT: any = [];
    schoolid: number = 0;
    schoolname: string = "";
    monthname: string = "";

    loginUser: LoginUserModel;

    actaddrights: string = "";
    acteditrights: string = "";
    actviewrights: string = "";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        public _menuservice: MenuService, private _loginservice: LoginService, private _rptservice: ReportsService,
        private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this.fillDropDownList();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    // Auto Completed School

    getSchoolData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "school",
            "uid": this.loginUser.uid,
            "typ": this.loginUser.utype,
            "search": query
        }).then((data) => {
            this.schoolDT = data;
        });
    }

    // Selected Owners

    selectSchoolData(event) {
        this.schoolid = event.value;
        this.schoolname = event.label;
    }

    // Fill School, Division, Gender DropDown

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._rptservice.getAttendanceReports({ "flag": "dropdown", "date": "1/Mar/2017", "month": "6" }).subscribe(data => {
            try {
                that.monthDT = data.data;
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

    // Get Attendent Data

    public viewAttendanceReportsRights() {
        var that = this;
        var addRights = [];
        var editRights = [];
        var viewRights = [];

        that._menuservice.getMenuDetails({
            "flag": "actrights", "uid": that.loginUser.uid, "mcode": "rptatt", "utype": that.loginUser.utype
        }).subscribe(data => {
            addRights = data.data.filter(a => a.mrights === "add");
            editRights = data.data.filter(a => a.mrights === "edit");
            viewRights = data.data.filter(a => a.mrights === "view");

            that.actaddrights = addRights.length !== 0 ? addRights[0].mrights : "";
            that.acteditrights = editRights.length !== 0 ? editRights[0].mrights : "";
            that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";

            that.getAttendanceColumn();
            that.getAttendanceReports();
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    getAttendanceColumn() {
        var that = this;

        that._rptservice.getAttendanceReports({ "flag": "column", "monthname": that.monthname, "schoolid": that.schoolid }).subscribe(data => {
            if (data.data.length !== 0) {
                that.attColumn = data.data;
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
            // console.log("Complete");
        })
    }

    getAttendanceReports() {
        var that = this;

        if (that.actviewrights === "view") {
            commonfun.loader();

            that._rptservice.getAttendanceReports({ "flag": "data", "monthname": that.monthname, "schoolid": that.schoolid }).subscribe(data => {
                try {
                    if (data.data.length !== 0) {
                        that.attData = data.data;
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
    }
}
