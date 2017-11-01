import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { HolidayService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import jsPDF from 'jspdf';

@Component({
    templateUrl: 'holiday.comp.html',
    providers: [CommonService]
})

export class HolidayComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    ayid: number = 0;

    psngrtype: any = "";
    psngrtypenm: any = "";

    currentdate: any = "";
    caldate: any = "";

    holidayDT: any = [];

    global = new Globals();

    @ViewChild('holiday') holiday: ElementRef;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _hldservice: HolidayService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getHoliday();
    }

    public ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Fill Academic Year, Class Drop Down

    fillDropDownList() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._hldservice.getHoliday({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    defayDT = that.ayDT.filter(a => a.iscurrent == true);

                    if (defayDT.length > 0) {
                        that.ayid = defayDT[0].id;
                        that.getHoliday();
                    }
                    else {
                        that.ayid = 0;
                    }
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

    getHoliday() {
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
                    that.psngrtypenm = 'employee';
                }
                else if (that.psngrtype == "employee") {
                    that.psngrtypenm = 'Employee';
                }

                params = {
                    "flag": "reports", "hldfor": that.psngrtype, "ayid": that.ayid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
                    "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
                }

                that._hldservice.getHoliday(params).subscribe(data => {
                    try {
                        that.holidayDT = data.data;
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

    public exportToCSV() {
        this._autoservice.exportToCSV(this.holidayDT, this.psngrtypenm + " Holiday Reports");
    }

    public exportToPDF() {
        let pdf = new jsPDF();

        let options = {
            pagesplit: true
        };

        pdf.addHTML(this.holiday.nativeElement, 0, 0, options, () => {
            pdf.save(this.psngrtypenm + " Holiday Reports.pdf");
        });
    }

    ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
