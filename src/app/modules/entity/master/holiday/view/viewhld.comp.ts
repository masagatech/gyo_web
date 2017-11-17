import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { HolidayService } from '@services/master';

@Component({
    templateUrl: 'viewhld.comp.html',
    providers: [CommonService]
})

export class ViewHolidayComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    holidayDT: any = [];

    private events: any[];
    private header: any;
    private event: MyEvent;
    private defaultDate: string = "";

    isShowGrid: any = true;
    isShowCalendar: any = false;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _holidayervice: HolidayService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getDefaultDate();
        this.getHolidayGrid();
    }

    public ngOnInit() {
        var that = this;
        that.refreshButtons();

        that.header = {
            left: 'prev',
            center: 'title',
            // right: 'month,agendaWeek,agendaDay,today'
            right: 'next'
        };
    }

    refreshButtons() {
        setTimeout(function () {
            commonfun.navistyle();
            commonfun.chevronstyle();
        }, 0);
    }

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

    getHolidayGrid() {
        var that = this;

        commonfun.loader();

        that._holidayervice.getHoliday({
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
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

    getHolidayCalendar(row) {
        var that = this;
        commonfun.loader();

        that._holidayervice.getHoliday({
            "flag": "calendar", "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "monthname": row.view.title
        }).subscribe(data => {
            try {
                that.events = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide();
        }, () => {

        })

        that.refreshButtons();
    }

    isshHoliday(viewtype) {
        if (viewtype == "grid") {
            this.isShowGrid = true;
            this.isShowCalendar = false;
        }
        else {
            this.isShowGrid = false;
            this.isShowCalendar = true;
        }

        this.refreshButtons();
    }

    public addHolidayForm() {
        this._router.navigate(['/master/holiday/add']);
    }

    public editHolidayGrid(row) {
        this._router.navigate(['/master/holiday/edit', row.hldid]);
    }

    public editHolidayCalendar(row) {
        this._router.navigate(['/master/holiday/edit', row.calEvent.id]);
    }
}

export class MyEvent {
    id: number;
    title: string;
    start: string;
    end: string;
    allDay: boolean = true;
}