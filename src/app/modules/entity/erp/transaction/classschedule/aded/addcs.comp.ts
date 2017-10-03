import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ClassScheduleService } from '@services/erp';

@Component({
    templateUrl: 'addcs.comp.html',
    providers: [CommonService]
})

export class AddClassScheduleComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    clsrstid: number = 0;

    ayDT: any = [];
    ayid: number = 0;

    classDT: any = [];
    classid: number = 0;

    subjectDT: any = [];

    frmtm: any = "";
    totm: any = "";

    sunsubid: number = 0;
    sunsubname: string = "";
    monsubid: number = 0;
    tuessubid: number = 0;
    wedsubid: number = 0;
    thursubid: number = 0;
    frisubid: number = 0;
    satsubid: number = 0;

    issun: boolean = false;
    ismon: boolean = false;
    istues: boolean = false;
    iswed: boolean = false;
    isthur: boolean = false;
    isfri: boolean = false;
    issat: boolean = false;

    weekDT: any = [];
    classScheduleDT: any = [];
    selectedClassScheduleRow: any = [];
    isEditClassSchedule: boolean = false;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _clsrstservice: ClassScheduleService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.fillSubjectDropDown();
        this.getDefaultDate();

        this.getWeekData();
    }

    public ngOnInit() {
        var that = this;

        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();

            $(".ui-picklist-buttons").hide();
            $(".ui-picklist-source-controls").show();
            $(".ui-picklist-target-controls").show();
        }, 100);

        that.refreshButtons();
    }

    refreshButtons() {
        setTimeout(function () {
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
        //this.defaultDate = this.formatDate(today);
    }

    // Fill Class Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._clsrstservice.getClassSchedule({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that._enttdetails.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");
                
                if (that.ayDT.length > 0) {
                    that.ayid = that.ayDT.filter(a => a.iscurrent == true)[0].id;
                    that.getWeekData();
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

    // Get Week Data

    getWeekData() {
        var that = this;

        that._clsrstservice.getClassSchedule({
            "flag": "week", "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            var weekdata = data.data;

            if (data.data.length !== 0) {
                that.issun = weekdata[0].issun;
                that.ismon = weekdata[0].ismon;
                that.istues = weekdata[0].istues;
                that.iswed = weekdata[0].iswed;
                that.isthur = weekdata[0].isthur;
                that.isfri = weekdata[0].isfri;
                that.issat = weekdata[0].issat;
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
        })
    }

    // Set Default Subject in Week Wise

    getSundaySubject() {
        var that = this;

        if (that.monsubid == 0) {
            if (that.ismon) {
                that.monsubid = that.sunsubid;
            }
            else {
                that.monsubid = 0;
            }
        }
        else if (that.tuessubid == 0) {
            if (that.istues) {
                that.tuessubid = that.sunsubid;
            }
            else {
                that.tuessubid = 0;
            }
        }
        else if (that.wedsubid == 0) {
            if (that.iswed) {
                that.wedsubid = that.sunsubid;
            }
            else {
                that.wedsubid = 0;
            }
        }
        else if (that.thursubid == 0) {
            if (that.isthur) {
                that.thursubid = that.sunsubid;
            }
            else {
                that.thursubid = 0;
            }
        }
        else if (that.frisubid == 0) {
            if (that.isfri) {
                that.frisubid = that.sunsubid;
            }
            else {
                that.frisubid = 0;
            }
        }
        else if (that.satsubid == 0) {
            if (that.issat) {
                that.satsubid = that.sunsubid;
            }
            else {
                that.satsubid = 0;
            }
        }
    }

    getMondaySubject() {
        var that = this;

        if (that.issun) {
            if (that.sunsubid == 0) {
                that.sunsubid = that.monsubid;
            }
        }
        else {
            that.sunsubid = 0;
        }
        if (that.istues) {
            if (that.tuessubid == 0) {
                that.tuessubid = that.monsubid;
            }
        }
        else {
            that.tuessubid = 0;
        }

        if (that.iswed) {
            if (that.wedsubid == 0) {
                that.wedsubid = that.monsubid;
            }
        }
        else {
            that.wedsubid = 0;
        }

        if (that.isthur) {
            if (that.thursubid == 0) {
                that.thursubid = that.monsubid;
            }
        }
        else {
            that.thursubid = 0;
        }

        if (that.isfri) {
            if (that.frisubid == 0) {
                that.frisubid = that.monsubid;
            }
        }
        else {
            that.frisubid = 0;
        }

        if (that.issat) {
            if (that.satsubid == 0) {
                that.satsubid = that.monsubid;
            }
        }
        else {
            that.satsubid = 0;
        }
    }

    getTuesdaySubject() {
        var that = this;

        if (that.issun) {
            if (that.sunsubid == 0) {
                that.sunsubid = that.tuessubid;
            }
        }
        else {
            that.sunsubid = 0;
        }

        if (that.ismon) {
            if (that.monsubid == 0) {
                that.monsubid = that.tuessubid;
            }
        }
        else {
            that.monsubid = 0;
        }

        if (that.iswed) {
            if (that.wedsubid == 0) {
                that.wedsubid = that.tuessubid;
            }
        }
        else {
            that.wedsubid = 0;
        }

        if (that.isthur) {
            if (that.thursubid == 0) {
                that.thursubid = that.tuessubid;
            }
        }
        else {
            that.thursubid = 0;
        }

        if (that.isfri) {
            if (that.frisubid == 0) {
                that.frisubid = that.tuessubid;
            }
        }
        else {
            that.frisubid = 0;
        }

        if (that.issat) {
            if (that.satsubid == 0) {
                that.satsubid = that.tuessubid;
            }
        }
        else {
            that.satsubid = 0;
        }
    }

    getWednesdaySubject() {
        var that = this;

        if (that.issun) {
            if (that.sunsubid == 0) {
                that.sunsubid = that.wedsubid;
            }
        }
        else {
            that.sunsubid = 0;
        }

        if (that.ismon) {
            if (that.monsubid == 0) {
                that.monsubid = that.wedsubid;
            }
        }
        else {
            that.monsubid = 0;
        }

        if (that.istues) {
            if (that.tuessubid == 0) {
                that.tuessubid = that.wedsubid;
            }
        }
        else {
            that.tuessubid = 0;
        }

        if (that.isthur) {
            if (that.thursubid == 0) {
                that.thursubid = that.wedsubid;
            }
        }
        else {
            that.thursubid = 0;
        }

        if (that.isfri) {
            if (that.frisubid == 0) {
                that.frisubid = that.wedsubid;
            }
        }
        else {
            that.frisubid = 0;
        }

        if (that.issat) {
            if (that.satsubid == 0) {
                that.satsubid = that.wedsubid;
            }
        }
        else {
            that.satsubid = 0;
        }
    }

    getThursdaySubject() {
        var that = this;

        if (that.issun) {
            if (that.sunsubid == 0) {
                that.sunsubid = that.thursubid;
            }
        }
        else {
            that.sunsubid = 0;
        }

        if (that.ismon) {
            if (that.monsubid == 0) {
                that.monsubid = that.thursubid;
            }
        }
        else {
            that.monsubid = 0;
        }

        if (that.istues) {
            if (that.tuessubid == 0) {
                that.tuessubid = that.thursubid;
            }
        }
        else {
            that.tuessubid = 0;
        }

        if (that.iswed) {
            if (that.wedsubid == 0) {
                that.wedsubid = that.thursubid;
            }
        }
        else {
            that.wedsubid = 0;
        }

        if (that.isfri) {
            if (that.frisubid == 0) {
                that.frisubid = that.thursubid;
            }
        }
        else {
            that.satsubid = 0;
        }

        if (that.issat) {
            if (that.satsubid == 0) {
                that.satsubid = that.thursubid;
            }
        }
        else {
            that.satsubid = 0;
        }
    }

    getFridaySubject() {
        var that = this;

        if (that.issun) {
            if (that.sunsubid == 0) {
                that.sunsubid = that.frisubid;
            }
        }
        else {
            that.sunsubid = 0;
        }

        if (that.ismon) {
            if (that.monsubid == 0) {
                that.monsubid = that.frisubid;
            }
        }
        else {
            that.monsubid = 0;
        }

        if (that.istues) {
            if (that.tuessubid == 0) {
                that.tuessubid = that.frisubid;
            }
        }
        else {
            that.tuessubid = 0;
        }

        if (that.iswed) {
            if (that.wedsubid == 0) {
                that.wedsubid = that.frisubid;
            }
        }
        else {
            that.wedsubid = 0;
        }

        if (that.isfri) {
            if (that.frisubid == 0) {
                that.thursubid = that.frisubid;
            }
        }
        else {
            that.thursubid = 0;
        }

        if (that.issat) {
            if (that.satsubid == 0) {
                that.satsubid = that.frisubid;
            }
        }
        else {
            that.satsubid = 0;
        }
    }

    getSaturdaySubject() {
        var that = this;

        if (that.issun) {
            if (that.sunsubid == 0) {
                that.sunsubid = that.satsubid;
            }
        }
        else {
            that.sunsubid = 0;
        }

        if (that.ismon) {
            if (that.monsubid == 0) {
                that.monsubid = that.satsubid;
            }
        }
        else {
            that.monsubid = 0;
        }

        if (that.istues) {
            if (that.tuessubid == 0) {
                that.tuessubid = that.satsubid;
            }
        }
        else {
            that.tuessubid = 0;
        }

        if (that.iswed) {
            if (that.wedsubid == 0) {
                that.wedsubid = that.satsubid;
            }
        }
        else {
            that.wedsubid = 0;
        }

        if (that.isthur) {
            if (that.thursubid == 0) {
                that.thursubid = that.satsubid;
            }
        }
        else {
            that.thursubid = 0;
        }

        if (that.isfri) {
            if (that.frisubid == 0) {
                that.frisubid = that.satsubid;
            }
        }
        else {
            that.frisubid = 0;
        }
    }

    // Validate Class Schedule

    isValidClassSchedule() {
        var that = this;

        if (that.frmtm == "") {
            that._msg.Show(messageType.error, "Error", "Enter From Time");
            $(".frmtm").focus();
            return false;
        }
        if (that.totm == "") {
            that._msg.Show(messageType.error, "Error", "Enter To Time");
            $(".totm").focus();
            return false;
        }
        if (that.frmtm > that.totm) {
            that._msg.Show(messageType.error, "Error", "Sholul Be To Time Greater Than From Time");
            $(".totm").focus();
            return false;
        }

        if (that.issun) {
            if (that.sunsubid == 0) {
                that._msg.Show(messageType.error, "Error", "Select Subject For Sunday");
                $(".sunsubname").focus();
                return false;
            }
        }
        if (that.ismon) {
            if (that.monsubid == 0) {
                that._msg.Show(messageType.error, "Error", "Select Subject For Monday");
                $(".monsubname").focus();
                return false;
            }
        }
        if (that.istues) {
            if (that.tuessubid == 0) {
                that._msg.Show(messageType.error, "Error", "Select Subject For Tuesday");
                $(".tuessubname").focus();
                return false;
            }
        }
        if (that.iswed) {
            if (that.wedsubid == 0) {
                that._msg.Show(messageType.error, "Error", "Select Subject For Wednesday");
                $(".wedsubname").focus();
                return false;
            }
        }
        if (that.isthur) {
            if (that.thursubid == 0) {
                that._msg.Show(messageType.error, "Error", "Select Subject For Thursday");
                $(".thursubname").focus();
                return false;
            }
        }
        if (that.isfri) {
            if (that.frisubid == 0) {
                that._msg.Show(messageType.error, "Error", "Select Subject For Friday");
                $(".frisubname").focus();
                return false;
            }
        }
        if (that.issat) {
            if (that.satsubid == 0) {
                that._msg.Show(messageType.error, "Error", "Select Subject For Saturday");
                $(".satsubname").focus();
                return false;
            }
        }

        return true;
    }

    // Check Duplicate Class Schedule

    isDuplicateClassSchedule() {
        var that = this;

        for (var i = 0; i < that.classScheduleDT.length; i++) {
            var field = that.classScheduleDT[i];

            // if (field.frmtm > that.frmtm || field.frmtm <= that.totm) {
            //     that._msg.Show(messageType.error, "Error", "From Time is Already Exists");
            //     return true;
            // }

            // if (field.totm > that.totm || field.totm <= that.frmtm) {
            //     that._msg.Show(messageType.error, "Error", "To Time is Already Exists");
            //     return true;
            // }

            if (that.issun) {
                if (field.sunsubid == that.sunsubid) {
                    that._msg.Show(messageType.error, "Error", "Duplicate Sunday Subject not Allowed");
                    return true;
                }
            }

            if (that.ismon) {
                if (field.monsubid == that.monsubid) {
                    that._msg.Show(messageType.error, "Error", "Duplicate Monday Subject not Allowed");
                    return true;
                }
            }

            if (that.istues) {
                if (field.tuessubid == that.tuessubid) {
                    that._msg.Show(messageType.error, "Error", "Duplicate Tuesday Subject not Allowed");
                    return true;
                }
            }

            if (that.iswed) {
                if (field.websubid == that.wedsubid) {
                    that._msg.Show(messageType.error, "Error", "Duplicate Wendnesady Subject not Allowed");
                    return true;
                }
            }

            if (that.isthur) {
                if (field.thursubid == that.thursubid) {
                    that._msg.Show(messageType.error, "Error", "Duplicate Thursday Subject not Allowed");
                    return true;
                }
            }

            if (that.isfri) {
                if (field.frisubid == that.frisubid) {
                    that._msg.Show(messageType.error, "Error", "Duplicate Friday Subject not Allowed");
                    return true;
                }
            }

            if (that.issat) {
                if (field.satsubid == that.satsubid) {
                    that._msg.Show(messageType.error, "Error", "Duplicate Saturday Subject not Allowed");
                    return true;
                }
            }
        }

        return false;
    }

    // Add Class Schedule

    addClassSchedule() {
        var that = this;

        if (that.isValidClassSchedule()) {
            var duplicateClassSchedule = that.isDuplicateClassSchedule();

            if (!duplicateClassSchedule) {
                that.classScheduleDT.push({
                    "clsrstid": that.clsrstid, "ayid": that.ayid, "classid": that.classid, "frmtm": that.frmtm, "totm": that.totm,
                    "sunsubid": that.sunsubid, "sunsubname": $(".sunsubname option:selected").text().trim(),
                    "monsubid": that.monsubid, "monsubname": $(".monsubname option:selected").text().trim(),
                    "tuessubid": that.tuessubid, "tuessubname": $(".tuessubname option:selected").text().trim(),
                    "wedsubid": that.wedsubid, "wedsubname": $(".wedsubname option:selected").text().trim(),
                    "thursubid": that.thursubid, "thursubname": $(".thursubname option:selected").text().trim(),
                    "frisubid": that.frisubid, "frisubname": $(".frisubname option:selected").text().trim(),
                    "satsubid": that.satsubid, "satsubname": $(".satsubname option:selected").text().trim(),
                    "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "cuid": that.loginUser.ucode, "isactive": true
                })

                that.resetClassSchedule();
            }
        }
    }

    resetClassSchedule(){
        var that = this;

        $(".frmtm").focus();

        that.frmtm = "";
        that.totm = "";
        that.sunsubid = 0;
        that.monsubid = 0;
        that.tuessubid = 0;
        that.wedsubid = 0;
        that.thursubid = 0;
        that.frisubid = 0;
        that.satsubid = 0;
    }

    // Save Class Schedule

    saveClassSchedule() {
        var that = this;
        
        that._clsrstservice.saveClassSchedule({ "classSchedule": that.classScheduleDT }).subscribe(data => {
            try {
                var dataResult = data.data[0].funsave_classSchedule;
                var msgid = dataResult.msgid;
                var msg = dataResult.msg;

                if (msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", msg);
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

    getClassSchedule() {
        var that = this;
        commonfun.loader();

        that._clsrstservice.getClassSchedule({
            "flag": "all", "ayid": that.ayid, "classid": that.classid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
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

    editClassSchedule(row) {
        this.isEditClassSchedule = true;
        this.selectedClassScheduleRow = row;

        this.frmtm = row.frmtm;
        this.totm = row.totm;
        this.sunsubid = row.sunsubid;
        this.monsubid = row.monsubid;
        this.tuessubid = row.tuessubid;
        this.wedsubid = row.wedsubid;
        this.thursubid = row.thursubid;
        this.frisubid = row.frisubid;
        this.satsubid = row.satsubid;
    }

    deleteClassSchedule(row) {
        row.isactive = false;
    }

    updateClassSchedule() {
        this.isEditClassSchedule = false;

        this.selectedClassScheduleRow.frmtm = this.frmtm;
        this.selectedClassScheduleRow.totm = this.totm;
        this.selectedClassScheduleRow.sunsubid = this.sunsubid;
        this.selectedClassScheduleRow.sunsubname = $(".sunsubname option:selected").text().trim();
        this.selectedClassScheduleRow.monsubid = this.monsubid;
        this.selectedClassScheduleRow.monsubname = $(".monsubname option:selected").text().trim();
        this.selectedClassScheduleRow.tuessubid = this.tuessubid;
        this.selectedClassScheduleRow.tuessubname = $(".tuessubname option:selected").text().trim();
        this.selectedClassScheduleRow.wedsubid = this.wedsubid;
        this.selectedClassScheduleRow.wedsubname = $(".wedsubname option:selected").text().trim();
        this.selectedClassScheduleRow.thursubid = this.thursubid;
        this.selectedClassScheduleRow.thursubname = $(".thursubname option:selected").text().trim();
        this.selectedClassScheduleRow.frisubid = this.frisubid;
        this.selectedClassScheduleRow.frisubname = $(".frisubname option:selected").text().trim();
        this.selectedClassScheduleRow.satsubid = this.satsubid;
        this.selectedClassScheduleRow.satsubname = $(".satsubname option:selected").text().trim();
        
        this.resetClassSchedule();
    }

    cancelClassSchedule() {
        this.isEditClassSchedule = false;
        this.resetClassSchedule();
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/erp/transaction/classschedule']);
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}