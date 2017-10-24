import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ExamService } from '@services/erp';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
    templateUrl: 'rptexam.comp.html',
    providers: [CommonService]
})

export class ExamReportsComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    ayid: number = 0;
    semesterDT: any = [];
    smstrid: number = 0;
    classDT: any = [];
    clsid: number = 0;

    examDT: any = [];
    studentDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _examservice: ExamService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getExamDetails();
    }

    public ngOnInit() {

    }

    // Fill Academic Year, Semester And Class Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._examservice.getExamDetails({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    that.ayid = that.ayDT.filter(a => a.iscurrent == true)[0].id;
                }

                that.semesterDT = data.data.filter(a => a.group == "semester");
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

    getExamDetails() {
        var that = this;
        commonfun.loader();

        that._examservice.getExamDetails({
            "flag": "reports", "ayid": that.ayid, "smstrid": that.smstrid, "clsid": that.clsid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.examDT = data.data;
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

    // View Student List

    getStudentDetails(studid, status) {
        var that = this;

        $("#studentModal").modal('show');
        commonfun.loader("#studentModal");

        that.studentDT = [];

        that._examservice.getExamDetails({
            "flag": "student", "studid": studid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.studentDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#studentModal");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#studentModal");
        }, () => {

        })
    }

    public addExam() {
        this._router.navigate(['/transaction/exam/add']);
    }

    public editExam(row) {
        this._router.navigate(['/transaction/exam/edit', row.examid]);
    }
}
