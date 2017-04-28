import { Component, OnInit } from '@angular/core';
import { HolidayService } from '../../../_services/holiday/holiday-service';
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
    templateUrl: 'viewholiday.comp.html',
    providers: [HolidayService]
})

export class ViewHolidayComponent implements OnInit {
    holidayDT: any = [];

    private events: any[];
    private header: any;
    private event: MyEvent;
    private defaultDate: string = "";

    isShowGrid: any = true;
    isShowCalendar: any = false;

    constructor(private _holidayervice: HolidayService, private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService) {
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

        that._holidayervice.getHoliday({ "flag": "grid" }).subscribe(data => {
            try {
                that.holidayDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide();
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    getHolidayCalendar(row) {
        var that = this;
        commonfun.loader();

        that._holidayervice.getHoliday({ "flag": "calendar", "monthname": row.view.title }).subscribe(data => {
            try {
                that.events = data.data;
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
        this._router.navigate(['/holiday/add']);
    }

    public editGridHoliday(row) {
        this._router.navigate(['/holiday/edit', row.hldid]);
    }

    public editCalendarHoliday(row) {
        this._router.navigate(['/holiday/edit', row.calEvent.id]);
    }
}

export class MyEvent {
    id: number;
    title: string;
    start: string;
    end: string;
    allDay: boolean = true;
}