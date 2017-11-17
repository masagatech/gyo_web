import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ReportsService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rptdrvatt.comp.html',
    providers: [CommonService, ReportsService]
})

export class DriverAttendanceComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    monthDT: any = [];

    attColumn: any = [];
    attData: any = [];
    monthname: string = "";

    @ViewChild('drvatt') drvatt: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _rptservice: ReportsService,
        private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getDefaultMonth();
        this.getAttendanceColumn();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    getDefaultMonth() {
        let date = new Date();
        let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let mname = monthNames[date.getMonth()] + "-" + date.getFullYear().toString().substr(-2);

        this.monthname = mname;
    }

    // Export

    public exportToCSV() {
        this._autoservice.exportToCSV(this.attData, "Driver Attendance Details");
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.drvatt.nativeElement, 0, 0, options, () => {
            pdf.save("DriverAttendance.pdf");
        });
    }

    // Fill Entity, Division, Gender DropDown

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._rptservice.getAttendanceReports({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.monthDT = data.data;
                // setTimeout(function () { $.AdminBSB.select.refresh('monthname'); }, 100);
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

        that._rptservice.getAttendanceReports({
            "flag": "column", "monthname": that.monthname, "schoolid": that._enttdetails.enttid
        }).subscribe(data => {
            if (data.data.length !== 0) {
                that.attColumn = data.data;
                that.getAttendanceReports();
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
        })
    }

    getAttendanceReports() {
        var that = this;

        if (that.monthname === "") {
            that._msg.Show(messageType.warn, "Warning", "Select Month");
        }
        else {
            commonfun.loader();

            that._rptservice.getAttendanceReports({
                "flag": "driver", "monthname": that.monthname, "schoolid": that._enttdetails.enttid
            }).subscribe(data => {
                try {
                    if (data.data.length == 0) {
                        that.attData = [];
                    }
                    else if (data.data.length == 1) {
                        if (data.data[0].drivername !== null) {
                            that.attData = data.data;
                        }
                        else {
                            that.attData = [];
                        }
                    }
                    else {
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

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
