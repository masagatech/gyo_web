import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ClassScheduleService } from '@services/erp';

@Component({
    templateUrl: 'viewcs.comp.html',
    providers: [CommonService]
})

export class ViewClassScheduleComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    clsrstid: number = 0;

    ayDT: any = [];
    ayid: number = 0;

    classDT: any = [];
    classid: number = 0;

    teacherDT: any = [];
    tchrdata: any = [];
    tchrid: number = 0;
    tchrname: string = "";

    header: any;
    event: MyEvent;
    dialogVisible: boolean = false;
    idGen: number = 100;
    defaultDate: string = "";

    subjectDT: any = [];
    classScheduleDT: any = [];

    id: number = 0;
    ttid: number = 0;
    subid: number = 0;
    strdt: any = "";
    enddt: any = "";
    strtm: any = "";
    endtm: any = "";
    rsttyp: string = "";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private cd: ChangeDetectorRef,
        private _loginservice: LoginService, private _autoservice: CommonService, private _clsrstservice: ClassScheduleService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getDefaultDate();
    }

    public ngOnInit() {
        var that = this;

        that.refreshButtons();

        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();

            $(".ui-picklist-buttons").hide();
            $(".ui-picklist-source-controls").show();
            $(".ui-picklist-target-controls").show();
        }, 100);

        that.header = {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        };
    }

    refreshButtons() {
        setTimeout(function () {
            commonfun.navistyle();
            commonfun.chevronstyle();
        }, 0);
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

    getDefaultDate() {
        var date = new Date();
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        this.defaultDate = this.formatDate(today);
    }

    // Fill Class Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._clsrstservice.getClassSchedule({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that._enttdetails.issysadmin,
            "viewby": "portal"
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");
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

    // Fill Subject Drop Down

    fillSubjectDropDown() {
        var that = this;
        commonfun.loader();

        that._clsrstservice.getClassSchedule({
            "flag": "subjectddl", "classid": that.classid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.subjectDT = data.data;
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
            "flag": "clswisetchr",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "emptype": "tchr",
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
    }

    // Get Class Schedule

    getClassSchedule() {
        var that = this;
        commonfun.loader();

        that._clsrstservice.getClassSchedule({
            "flag": "reports", "ayid": that.ayid, "classid": that.classid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "ctype": that.loginUser.ctype, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid,
            "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.classScheduleDT = data.data;
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

    handleDayClick(event) {
        this.id = 0;
        this.tchrid = 0;
        this.tchrname = "";
        this.tchrdata = [];
        this.subid = 0;
        this.strdt = event.date.format();
        this.enddt = event.date.format();
        this.strtm = "";
        this.endtm = "";
        this.rsttyp = "";

        this.dialogVisible = true;
    }

    handleEventClick(e) {
        if (e.calEvent.id != 0 || e.calEvent.ttid != 0) {
            this.id = e.calEvent.id;
            this.tchrid = e.calEvent.tchrid;
            this.tchrname = e.calEvent.tchrname;
            this.tchrdata.value = this.tchrid;
            this.tchrdata.label = this.tchrname;
            this.ttid = e.calEvent.ttid;
            this.subid = e.calEvent.subid;
            this.strdt = e.calEvent.start;
            this.enddt = e.calEvent.end;
            this.strtm = e.calEvent.strtm;
            this.endtm = e.calEvent.endtm;
            this.rsttyp = e.calEvent.rsttyp;

            this.dialogVisible = true;
        }
    }

    saveTimeTable() {
        var that = this;
        var params = {};

        params = {
            "ttid": that.ttid, "ayid": that.ayid, "classid": that.classid, "frmdt": that.strdt, "todt": that.enddt,
            "frmtm": that.strtm, "totm": that.endtm, "tchrid": that.tchrid, "subid": that.subid, "rsttyp": that.rsttyp,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "cuid": that.loginUser.ucode
        }

        that._clsrstservice.saveTimeTable(params).subscribe(data => {
            try {
                var dataResult = data.data[0].funsave_timetable;
                var msgid = dataResult.msgid;
                var msg = dataResult.msg;

                if (msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", msg);
                    that.getClassSchedule();
                    that.dialogVisible = false;
                }
                else {
                    that._msg.Show(messageType.error, "Error", msg);
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
        });
    }

    deleteEvent() {
        this.dialogVisible = false;
    }

    addNewClassSchedule() {
        this._router.navigate(['/erp/transaction/classschedule/add']);
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}

export class MyEvent {
    id: number;
    ttid: number;
    subid: number;
    title: string;
    start: string;
    end: string;
    strtm: string;
    endtm: string;
    rsttyp: string;
}