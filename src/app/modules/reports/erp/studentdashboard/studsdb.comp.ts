import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals, Common } from '@models';
import { ERPDashboardService } from '@services/erp';
import { PassengerReportsService, AssesmentReportService } from '@services/reports';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: './studsdb.comp.html'
})

export class StudentDashboardComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    autoStudentDT: any = [];
    selectStudent: any = {};
    studid: number = 0;
    studname: string = "";

    classDT: any = [];
    selclassid: number = 0;
    selayid: number = 0;
    selectedRow: any = {};

    barchart;

    attendaceDT: any = [];
    holidayDT: any = [];
    resultDT: any = [];
    feesDT: any = [];

    constructor(private _router: Router, private _loginservice: LoginService, private _msg: MessageService,
        private _dbservice: ERPDashboardService, private _psngrrptservice: PassengerReportsService,
        private _assrptservice: AssesmentReportService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.viewStudentDashboard();

        this.barchart = this.getChartType("discreteBarChart");
    }

    ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
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

        Cookie.set("_studid_", this.studid.toString());
        Cookie.set("_studname_", this.studname);

        this.viewStudentDashboard();
    }

    public viewStudentDashboard() {
        var that = this;

        if (Cookie.get('_studname_') != null) {
            that.studid = parseInt(Cookie.get('_studid_'));
            that.studname = Cookie.get('_studname_');

            that.selectStudent = { value: that.studid, label: that.studname }
        }

        that.getClassDetails();
    }

    getClassDetails() {
        var that = this;
        commonfun.loader();

        var dbparams = {
            "flag": "class", "studid": that.studid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }

        that._dbservice.getStudentDashboard(dbparams).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.classDT = data.data;

                    that.getStudentDashboard(data.data[0]);
                    that.selectedRow = data.data[0];
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

    // Dashboard

    getChartType(typ) {
        var that = this;

        return {
            chart: {
                type: typ,
                height: 200,

                margin: {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },

                x: function (d) { return d.x; },
                y: function (d) { return d.y; },

                useInteractiveGuideline: true,
                transitionDuration: 1500,
                showValues: true,

                valueFormat: function (d) {
                    return d3.format('0')(d);
                },

                xAxis: {
                    rotateLabels: 10
                },

                yAxis: {
                    tickFormat: function (d) {
                        return d3.format('0')(d);
                    },

                    axisLabelDistance: -10
                }
            }
        };
    }

    getChartDetails(_data, charttype) {
        var that = this;
        var sin = [];

        for (var i = 0; i < _data.length; i++) {
            var el = _data[i];
            sin.push({ x: el.name, y: parseInt(el.count), color: el.color });
        }

        return [{
            values: sin,
            key: ""
        }];
    }

    getDashboard(charttype, row) {
        var that = this;
        commonfun.loader();

        var dbparams = {
            "flag": charttype, "uid": that.loginUser.uid, "utype": that.loginUser.utype, "studid": that.studid, "classid": row.classid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }

        that.selclassid = row.classid;
        that.selayid = row.ayid;

        that._dbservice.getStudentDashboard(dbparams).subscribe(data => {
            try {
                if (charttype == "attendance") {
                    that.attendaceDT = that.getChartDetails(data.data, charttype);
                }
                else if (charttype == "examresult") {
                    that.resultDT = data.data;
                }
                else if (charttype == "fees") {
                    that.feesDT = data.data;
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

    getStudentDashboard(row) {
        this.getDashboard("attendance", row);
        this.getDashboard("examresult", row);
        this.getAssesmentResult(row);
        this.getDashboard("fees", row);
    }

    // Get Student Assesment Result

    private getAssesmentResult(row) {
        let that = this;

        let params = {
            "flag": "reports", "classid": row.classid, "studid": that.studid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid,
            "isshheader": "N", "format": "html"
        }

        commonfun.loader();

        that._assrptservice.getAssesmentResultReports(params).subscribe(data => {
            try {
                $("#divAssesmentResult").html(data._body);
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

    // Get Student Certificate

    private getStudentCertificate(row, format) {
        let that = this;

        let params = {
            "flag": "bonafied", "ayid": row.ayid, "classid": row.classid, "studid": that.studid,
            "uid": that.loginUser.uid, "utype": that.loginUser.utype, "issysadmin": that._enttdetails.issysadmin,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "format": format
        }

        if (format == "html") {
            commonfun.loader();

            that._psngrrptservice.getStudentCertificate(params).subscribe(data => {
                try {
                    $("#divbonafied").html(data._body);
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
            window.open(Common.getReportUrl("getStudentCertificate", params));
            commonfun.loaderhide();
        }
    }

    // Open Certificate Popup

    openCertificatePopup(type) {
        let that = this;

        let params = {
            "flag": type, "ayid": that.selayid, "classid": that.selclassid, "studid": that.studid,
            "uid": that.loginUser.uid, "utype": that.loginUser.utype, "issysadmin": that._enttdetails.issysadmin,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "format": "html"
        }

        var url = Common.getReportUrl("getStudentCertificate", params);

        $("#certificateModal").modal('show');

        commonfun.loader("#certificate");
        $("#icertificate")[0].src = url;
        commonfun.loaderhide("#certificate");
    }

    // Get Random Color

    getRandomRolor() {
        var letters = '012345'.split('');
        var color = '#';

        color += letters[Math.round(Math.random() * 5)];
        letters = '0123456789ABCDEF'.split('');

        for (var i = 0; i < 5; i++) {
            color += letters[Math.round(Math.random() * 15)];
        }

        return color;
    }

    // View Student Profile Link

    viewProfile() {
        this._router.navigate(['/erp/student/details', this.studid]);
    }

    // View Student Exam Result Link

    viewExamResult(row) {
        Cookie.delete("filterExam");

        var _ayid = this.selayid;
        var _classid = this.selclassid;
        var _smstrid = row.key.split('~')[1];
        var _studid = this.studid;

        var studrow = {
            "ayid": _ayid, "classid": _classid, "smstrid": _smstrid, "studid": this.studid, "studname": this.studname
        }

        Cookie.set("filterExam", JSON.stringify(studrow));
        this._router.navigate(['/reports/transaction/examresult']);
    }

    // View Student Fees Collection Link

    viewFeesCollection(row) {
        Cookie.delete("filterStudent");

        var _enttid = this._enttdetails.enttid;
        var _ayid = row.key.split('~')[0];
        var _classid = row.key.split('~')[1];
        var _receiptno = row.key.split('~')[2];
        var _receivedate = row.key.split('~')[3];

        var studrow = {
            "enttid": _enttid, "ayid": _ayid, "classid": _classid, "studid": this.studid, "receiptno": _receiptno, "receivedate": _receivedate
        }

        Cookie.set("filterStudent", JSON.stringify(studrow));
        this._router.navigate(['/transaction/feescollection/student/history']);
    }

    ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}