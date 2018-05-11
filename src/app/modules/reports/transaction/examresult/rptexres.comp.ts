import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals, Common } from '@models';
import { ExamService } from '@services/erp';
import { ExamReportService } from '@services/reports';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'rptexres.comp.html'
})

export class ExamResultReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    ayid: number = 0;
    semesterDT: any = [];
    smstrid: number = 0;
    classDT: any = [];
    classid: number = 0;

    autoStudentDT: any = [];
    selectStudent: any = {};
    studid: number = 0;
    studname: string = "";

    subjectDT: any = [];

    gridTotal: any = {
        strenthTotal: 0, studentsTotal: 0, openingTotal: 0
    };

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _examservice: ExamService, private _autoservice: CommonService,
        private _examrptservice: ExamReportService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getSubjectList();
        this.getExamResultReports("html");
    }

    public ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Fill Academic Year, Exam Type And Class Down

    fillDropDownList() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._examservice.getExamDetails({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    defayDT = that.ayDT.filter(a => a.iscurrent == true);

                    if (defayDT.length > 0) {
                        that.ayid = defayDT[0].id;
                    }
                    else {
                        that.ayid = 0;
                    }
                }

                that.classDT = data.data.filter(a => a.group == "class");
                that.semesterDT = data.data.filter(a => a.group == "semester");
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

    // Auto Completed Student

    getStudentData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "student",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "issysadmin": this.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.autoStudentDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Student

    selectStudentData(event) {
        this.studid = event.value;
        this.studname = event.label;
    }

    // Get Subject List

    getSubjectList() {
        var that = this;

        that._examservice.getExamResult({
            "flag": "ressubject", "classid": that.classid, "smstrid": that.smstrid, "enttid": that._enttdetails.enttid
        }).subscribe(data => {
            that.subjectDT = data.data;
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
        })
    }

    private getExamResultReports(format) {
        let that = this;
        let params = {};

        let examFilterDT = JSON.parse(Cookie.get("filterExam"));

        if (examFilterDT !== null) {
            that.ayid = examFilterDT.ayid;
            that.smstrid = examFilterDT.smstrid;
            that.classid = examFilterDT.classid;
            that.studid = examFilterDT.studid;
            that.studname = examFilterDT.studname;
            that.selectStudent = { "value": that.studid, "label": that.studname }
        }
        else {
            that.ayid = 0;
            that.smstrid = 0;
            that.classid = 0;
            that.studid = 0;
            that.studname = "";
            that.selectStudent = {};
        }

        console.log(examFilterDT);
        
        params = {
            "flag": "reports", "ayid": that.ayid, "smstrid": that.smstrid, "classid": that.classid, "studid": that.studid,
            "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype, "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin, "format": format
        }

        if (format == "html") {
            commonfun.loader();

            that._examrptservice.getExamResultReports(params).subscribe(data => {
                try {
                    $("#divrptexmres").html(data._body);
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

            });
        }
        else {
            window.open(Common.getReportUrl("getExamResultReports", params));
        }
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
