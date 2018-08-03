import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel } from '@models';
import { DashboardService } from '@services';

@Component({
    templateUrl: 'report.comp.html'
})

export class MarketingReportsComponent implements OnInit, OnDestroy {
    monthDT: any = [];
    monthname: string = "";
    currday: number = 0;

    columnDT: any = [];
    reportsDT: any = [];
    loginUser: LoginUserModel;

    constructor(private _dbservice: DashboardService, private _loginservice: LoginService, private _routeParams: ActivatedRoute,
        private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this.fillDropDownList();
        this.getCurrentDay();
        this.setDefaultMonth();

        this.getMarketingData();
    }

    ngOnInit() {
    }

    // get Cuurent Day

    getCurrentDay() {
        var date = new Date();
        this.currday = date.getDate();
    }

    // Set Month in Month DropDown

    setDefaultMonth() {
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var date = new Date();

        this.monthname = monthNames[date.getMonth()] + "-" + date.getFullYear().toString().substr(-2);
    }

    // Fill Month DropDown

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._dbservice.getMarketingDB({ "flag": "dropdown" }).subscribe(data => {
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

    // Column

    getMarketingColumn() {
        var that = this;

        that._dbservice.getMarketingDB({ "flag": "column", "monthname": that.monthname }).subscribe(data => {
            if (data.data.length !== 0) {
                that.columnDT = data.data;
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
        })
    }

    // Dashboard

    getMarketingData() {
        var that = this;
        commonfun.loader();

        that.getMarketingColumn();

        that._dbservice.getMarketingDB({ "flag": "data", "monthname": that.monthname }).subscribe(data => {
            try {
                that.reportsDT = data.data;
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

    ngOnDestroy() {
    }
}