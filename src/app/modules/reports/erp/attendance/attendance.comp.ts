import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AttendanceService } from '@services/erp';
import { LazyLoadEvent } from 'primeng/primeng';
import jsPDF from 'jspdf';

@Component({
    templateUrl: 'attendance.comp.html',
    providers: [CommonService]
})

export class AttendanceReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    psngrtype: string = "";
    psngrtypenm: string = "";

    ayDT: any = [];
    ayid: number = 0;

    classDT: any = [];
    classid: number = 0;

    attndmonthDT: any = [];
    attndmonth: string = "";

    attendanceColumn: any = [];
    attendanceDT: any = [];
    exportAttendanceDT: any = [];

    statusid: number = 0;
    status: string = "";
    statusdesc: string = "";

    global = new Globals();

    @ViewChild('attendance') attendance: ElementRef;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _attndservice: AttendanceService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.fillMonthDropDown();
        this.getDefaultMonth();
        this.getAttendanceColumn();
    }

    public ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    getDefaultMonth() {
        let date = new Date();
        let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let mname = monthNames[date.getMonth()] + "-" + date.getFullYear().toString().substr(-2);

        this.attndmonth = mname;
    }

    // Fill Academic Year, Class Drop Down

    fillDropDownList() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._attndservice.getAttendance({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    defayDT = that.ayDT.filter(a => a.iscurrent == true);

                    if (defayDT.length > 0) {
                        that.ayid = defayDT[0].id;
                        that.fillMonthDropDown();
                        that.getDefaultMonth();

                        that.getAttendanceColumn();
                    }
                    else {
                        that.ayid = 0;
                    }
                }

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

    // Fill Month Drop Down

    fillMonthDropDown() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._attndservice.getAttendance({
            "flag": "month", "ayid": that.ayid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.attndmonthDT = data.data;
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

    getAttendanceColumn() {
        var that = this;

        that._attndservice.getAttendance({ "flag": "column", "attndmonth": that.attndmonth }).subscribe(data => {
            if (data.data.length !== 0) {
                that.attendanceColumn = data.data;
                that.getAttendanceReports("reports");
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
        })
    }

    getAttendanceReports(rpttyp) {
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
                    that.psngrtypenm = 'Teacher';
                    that.classid = 0;
                }
                else {
                    that.psngrtypenm = 'Employee';
                    that.classid = 0;
                }
            }
            else {
                that.psngrtype = "passenger";
                that.psngrtypenm = 'Passenger';
                that.classid = 0;
            }

            params = {
                "flag": rpttyp, "psngrtype": that.psngrtype, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
                "issysadmin": that.loginUser.issysadmin, "ayid": that.ayid, "classid": that.classid, "attndmonth": that.attndmonth,
                "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
            }

            that._attndservice.getAttendance(params).subscribe(data => {
                try {
                    if (data.data.length > 0) {
                        if (rpttyp == "export") {
                            that.exportAttendanceDT = data.data;
                            that._autoservice.exportToCSV(that.exportAttendanceDT, that.psngrtypenm + " Attendance Reports");
                        }
                        else {
                            that.attendanceDT = data.data;

                            that.statusid = data.data[0].statusid;
                            that.status = data.data[0].status;

                            if (that.statusid == 0 && that.status != "lv") {
                                that.statusdesc = data.data[0].statusdesc;
                            }
                        }
                    }
                    else {
                        that.attendanceDT = [];
                        that.statusid = 0;
                        that.status = "";
                        that.statusdesc = "";
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
        });
    }

    // Absent

    absentPassenger(row) {
        row.status = "a";
    }

    // Present

    presentPassenger(row) {
        row.status = "p";
    }

    public exportToCSV() {
        this.getAttendanceReports("export");
    }

    public exportToPDF() {
        var specialElementHandlers = {
            '#editor': function (element, renderer) { return true; }
        };

        var doc = new jsPDF();

        doc.fromHTML($('#attendance').html(), 15, 15, {
            'width': 500, 'elementHandlers': specialElementHandlers
        });

        doc.save(this.psngrtypenm + " Attendance Reports.pdf");

        // let pdf = new jsPDF();

        // let options = {
        //     pagesplit: true
        // };

        // pdf.addHTML(this.attendance.nativeElement, 0, 0, options, () => {
        //     pdf.save(this.psngrtypenm + " Attendance Reports.pdf");
        // });
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
