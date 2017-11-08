import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ExamService } from '@services/erp';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rptexres.comp.html',
    providers: [CommonService]
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

    subjectDT: any = [];
    examResultDT: any = [];
    @ViewChild('examresult') examresult: ElementRef;

    gridTotal: any = {
        strenthTotal: 0, studentsTotal: 0, openingTotal: 0
    };

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _examservice: ExamService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getSubjectList();
    }

    public ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Fill Academic Year, Semester And Class Down

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

    // Export

    public exportToCSV() {
        this._autoservice.exportToCSV(this.examResultDT, "Exam Result Reports");
    }

    public exportToPDF() {
        let pdf = new jsPDF();

        let options = {
            pagesplit: true
        };

        pdf.addHTML(this.examresult.nativeElement, 0, 0, options, () => {
            pdf.save("Exam Result Reports.pdf");
        });
    }

    // Get Subject List

    getSubjectList() {
        var that = this;

        that._examservice.getExamResult({
            "flag": "ressubject", "classid": that.classid, "smstrid": that.smstrid, "enttid": that._enttdetails.enttid
        }).subscribe(data => {
            if (data.data.length !== 0) {
                that.subjectDT = data.data;
                that.getExamResult();
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
        })
    }

    getExamResult() {
        var that = this;
        commonfun.loader();

        that._examservice.getExamResult({
            "flag": "reports", "ayid": that.ayid, "classid": that.classid, "smstrid": that.smstrid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.examResultDT = data.data;
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
    
    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
