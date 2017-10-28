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

    psngrtype: any = "";
    psngrtypenm: any = "";

    ayDT: any = [];
    ayid: number = 0;

    classDT: any = [];
    classid: number = 0;

    currentdate: any = "";
    attnddate: any = "";

    attendanceDT: any = [];

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
        this.getAttendanceDate();
        this.getAttendance();
    }

    public ngOnInit() {

    }

    // Format Date

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    getAttendanceDate() {
        var date = new Date();
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        this.currentdate = this.formatDate(today);
        this.attnddate = this.formatDate(today);
    }

    refreshButtons() {
        setTimeout(function () {
            commonfun.chevronstyle();
        }, 0);
    }

    // Fill Academic Year, Class Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._attndservice.getAttendance({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    that.ayid = that.ayDT.filter(a => a.iscurrent == true)[0].id;
                    that.getAttendance();
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

    getAttendance() {
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

                params = {
                    "flag": "attendance", "psngrtype": that.psngrtype, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
                    "issysadmin": that.loginUser.issysadmin, "ayid": that.ayid, "classid": that.classid, "attnddate": that.attnddate,
                    "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
                }

                that._attndservice.getAttendance(params).subscribe(data => {
                    try {
                        if (data.data.length > 0) {
                            that.attendanceDT = data.data;
                            that.statusid = data.data[0].statusid;
                            that.status = data.data[0].status;

                            if (that.statusid == 0 && that.status != "lv") {
                                that.statusdesc = data.data[0].statusdesc;
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
            }
            else {
                commonfun.loaderhide();
            }
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
        this._autoservice.exportToCSV(this.attendanceDT, this.psngrtypenm + " Attendance Reports");
    }

    public exportToPDF() {
        let pdf = new jsPDF();

        let options = {
            pagesplit: true
        };

        pdf.addHTML(this.attendance.nativeElement, 0, 0, options, () => {
            pdf.save(this.psngrtypenm + " Attendance Reports.pdf");
        });
    }

    public ngOnDestroy() {

    }
}
