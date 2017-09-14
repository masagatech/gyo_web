import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ClassRosterService } from '@services/erp';

@Component({
    templateUrl: 'viewcr.comp.html',
    providers: [CommonService]
})

export class ClassRosterComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    events: any = [];
    header: any;
    event: MyEvent;
    defaultDate: string = "";

    subjectDT: any = [];
    classDT: any = [];
    subid: number = 0;
    clsid: number = 0;

    weekColumn: any = [];
    weekData: any = [];
    
    classRouteDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _clsrstservice: ClassRosterService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillClassDropDown();
        this.fillSubjectDropDown();
        this.getWeekData();
        this.getDefaultDate();
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

        that.header = {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        };

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
        this.defaultDate = this.formatDate(today);
    }

    // Fill Class Drop Down

    fillClassDropDown() {
        var that = this;
        commonfun.loader();

        that._clsrstservice.getClassRoster({
            "flag": "classddl", "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.classDT = data.data;
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

        that._clsrstservice.getClassRoster({
            "flag": "subjectddl", "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
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

        that._clsrstservice.getClassRoster({
            "flag": "weekddl", "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            if (data.data.length !== 0) {
                that.weekColumn = data.data;
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
        })
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}

export class MyEvent {
    id: number;
    title: string;
    start: string;
    end: string;
    allDay: boolean = true;
}