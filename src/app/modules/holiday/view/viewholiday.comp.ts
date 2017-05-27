import { Component, OnInit } from '@angular/core';
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../_services/common/common-service'; /* add reference for master of master */
import { MenuService } from '../../../_services/menus/menu-service';
import { LoginService } from '../../../_services/login/login-service';
import { LoginUserModel } from '../../../_model/user_model';
import { HolidayService } from '../../../_services/holiday/holiday-service';

@Component({
    templateUrl: 'viewholiday.comp.html',
    providers: [MenuService, HolidayService, CommonService]
})

export class ViewHolidayComponent implements OnInit {
    loginUser: LoginUserModel;

    holidayDT: any = [];
    entityDT: any = [];
    entityid: number = 0;
    entityname: string = "";

    actaddrights: string = "";
    acteditrights: string = "";
    actviewrights: string = "";

    private events: any[];
    private header: any;
    private event: MyEvent;
    private defaultDate: string = "";

    isShowGrid: any = true;
    isShowCalendar: any = false;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _holidayervice: HolidayService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this.getDefaultDate();
        this.viewHolidayDataRights();
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

    // Auto Completed Entity

    getEntityData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "entity",
            "uid": this.loginUser.uid,
            "typ": this.loginUser.utype,
            "search": query
        }).then((data) => {
            this.entityDT = data;
        });
    }

    // Selected Owners

    selectEntityData(event) {
        this.entityid = event.value;
        this.entityname = event.label;

        this.getHolidayGrid();
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

    public viewHolidayDataRights() {
        var that = this;
        var addRights = [];
        var editRights = [];
        var viewRights = [];

        that._menuservice.getMenuDetails({
            "flag": "actrights", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "mcode": "hld", "utype": that.loginUser.utype
        }).subscribe(data => {
            addRights = data.data.filter(a => a.mrights === "add");
            editRights = data.data.filter(a => a.mrights === "edit");
            viewRights = data.data.filter(a => a.mrights === "view");

            that.actaddrights = addRights.length !== 0 ? addRights[0].mrights : "";
            that.acteditrights = editRights.length !== 0 ? editRights[0].mrights : "";
            that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";

            that.getHolidayGrid();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    getHolidayGrid() {
        var that = this;

        if (that.actviewrights === "view") {
            commonfun.loader();

            that._holidayervice.getHoliday({ "flag": "all", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "schid": that.entityid }).subscribe(data => {
                try {
                    that.holidayDT = data.data;
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
        }
    }

    fetchEvents(eventData) {
        console.log("fetchEvents:", eventData.view, eventData.element);
    }

    getHolidayCalendar(row) {
        var that = this;
        commonfun.loader();

        console.log(row);
        console.log(row.view.title);

        that._holidayervice.getHoliday({
            "flag": "calendar", "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "schid": 1, "monthname": row.view.title
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
        this._router.navigate(['/holiday/add']);
    }

    public editHolidayGrid(row) {
        this._router.navigate(['/holiday/edit', row.hldid]);
    }

    public editHolidayCalendar(row) {
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