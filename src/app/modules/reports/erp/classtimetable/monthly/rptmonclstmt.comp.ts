import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ClassTimeTableService } from '@services/erp';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rptmonclstmt.comp.html',
    providers: [CommonService]
})

export class MonthlyClassTimeTableReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    ayid: number = 0;

    classDT: any = [];
    classid: number = 0;

    teacherDT: any = [];
    tchrdata: any = [];
    tchrid: number = 0;
    tchrname: string = "";

    classTimeTableColumn: any = [];
    classTimeTableDT: any = [];
    @ViewChild('class') class: ElementRef;

    gridTotal: any = {
        strenthTotal: 0, studentsTotal: 0, openingTotal: 0
    };

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _clstmtservice: ClassTimeTableService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getMonthlyClassTimeTable();
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

        that._clstmtservice.getClassTimeTable({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin,
            "viewby": "portal"
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");
                
                if (that.ayDT.length > 0) {
                    defayDT = that.ayDT.filter(a => a.iscurrent == true);

                    if (defayDT.length > 0) {
                        that.ayid = defayDT[0].id;
                        that.getMonthlyClassTimeTable();
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

    // Auto Completed Teacher

    getTeacherData(event) {
        let query = event.query;

        this._autoservice.getERPAutoData({
            "flag": "classwiseteacher",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "classid": this.classid,
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "issysadmin": this.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.teacherDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Teacher

    selectTeacherData(event) {
        this.tchrid = event.value;
        this.tchrname = event.label;
        this.getMonthlyClassTimeTable();
    }

    // Export

    public exportToCSV() {
        var that = this;
        commonfun.loader();

        that._clstmtservice.getClassTimeTable({
            "flag": "monthly", "ayid": that.ayid, "classid": that.classid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that._autoservice.exportToCSV(data.data, "Monthly Class TimeTable");
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

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.class.nativeElement, 0, 0, options, () => {
            pdf.save("Class TimeTable.pdf");
        });
    }

    // Get Class Scedule Data

    getMonthlyClassTimeTable() {
        var that = this;

        that._clstmtservice.getClassTimeTable({
            "flag": "column", "ayid": that.ayid
        }).subscribe(data => {
            if (data.data.length !== 0) {
                that.classTimeTableColumn = data.data;
                that.getClassTimeTable();
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
        })
    }

    getClassTimeTable() {
        var that = this;
        commonfun.loader();

        that._clstmtservice.getClassTimeTable({
            "flag": "monthly", "ayid": that.ayid, "classid": that.classid, "tchrid": that.tchrid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin, "viewby": "portal"
        }).subscribe(data => {
            try {
                that.classTimeTableDT = data.data;
                that.grandTotal();
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

    grandTotal() {
        var that = this;
        that.gridTotal = {
            strenthTotal: 0, studentsTotal: 0, openingTotal: 0
        };

        for (var i = 0; i < this.classDT.length; i++) {
            var items = this.classDT[i];

            that.gridTotal.strenthTotal += parseFloat(items.strength);
            that.gridTotal.studentsTotal += parseFloat(items.totstuds);
            that.gridTotal.openingTotal += parseFloat(items.opening);
        }
    }

    resetClassTimeTableDetails() {
        this.tchrdata = [];
        this.tchrid = 0;
        this.tchrname = ""
        this.getMonthlyClassTimeTable();
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
