import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { LoginService } from '../../../_services/login/login-service';
import { LoginUserModel } from '../../../_model/user_model';
import { DashboardService } from '../../../_services/dashboard/db-service'; /* add reference for master of master */

import { UIChart } from 'primeng/primeng';

@Component({
    templateUrl: 'dashboard.comp.html',
    providers: [DashboardService]
})

export class MarkeingDashboardComponent implements OnInit, OnDestroy {
    monthDT: any = [];
    monthname: string = "";

    dbColumnDT: any = [];
    dashboardDT: any = [];
    dbChartDT: any = {};
    loginUser: LoginUserModel;

    @ViewChild('piechart')
    piechart: UIChart;

    @ViewChild('barchart')
    barchart: UIChart;

    isShowGrid: any = true;
    isShowChart: any = false;

    colors: any = {};

    constructor(private _dbservice: DashboardService, private _loginservice: LoginService, private _routeParams: ActivatedRoute,
        private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this.fillDropDownList();
        this.setDefaultMonth();

        this.getPieChart();
        this.getBarChart();
    }

    ngOnInit() {
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

    // Bar Chart

    getBarChart() {
        var that = this;
        commonfun.loader();

        var _dbChartDT = { labels: [], datasets: [{ label: '', backgroundColor: '#42A5F5', borderColor: '#1E88E5', data: [] }] };

        var _label = [];
        var _labels = [];
        var _datasets = [];

        that._dbservice.getMarketingDB({ "flag": "column", "monthname": that.monthname }).subscribe(data => {
            try {
                if (data.data.length !== 0) {
                    that.dbColumnDT = data.data;

                    for (var i = 0; i < that.dbColumnDT.length; i++) {
                        var mday = that.dbColumnDT[i].mday;
                        _labels.push(mday);

                        // that.colors[mday] = that.colors[mday] || commonfun.randomColor(31);
                        // _dbChartDT.datasets[0].backgroundColor.push(that.colors[mday]);
                        
                        _datasets.push(that.dbColumnDT[i].count);
                    }

                    _dbChartDT.labels = _labels;
                    _dbChartDT.datasets[0].label = that.monthname;
                    _dbChartDT.datasets[0].data = _datasets;

                    that.dbChartDT = _dbChartDT;

                    setTimeout(() => {
                        that.barchart.ngOnDestroy();
                        that.barchart.initChart();
                    }, 200);
                }
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

    // Pie Chart

    getPieChart() {
        var that = this;
        commonfun.loader();

        var _dbChartDT = { labels: [], datasets: [{ label: '', backgroundColor: [], borderColor: [], data: [] }] };

        var _label = [];
        var _labels = [];
        var _datasets = [];

        that._dbservice.getMarketingDB({ "flag": "data", "monthname": that.monthname }).subscribe(data => {
            try {
                var _dashboardDT = data.data.filter(a => a.row === 0);

                for (var i = 0; i < _dashboardDT.length; i++) {
                    var muname = _dashboardDT[i].uname;
                    _labels.push(muname);

                    that.colors[muname] = that.colors[muname] || commonfun.randomColor(5);
                    _dbChartDT.datasets[0].backgroundColor.push(that.colors[muname]);

                    _datasets.push(_dashboardDT[i].totord);
                }

                _dbChartDT.labels = _labels;
                _dbChartDT.datasets[0].label = that.monthname;
                _dbChartDT.datasets[0].data = _datasets;

                that.dashboardDT = _dbChartDT;

                setTimeout(() => {
                    that.piechart.ngOnDestroy();
                    that.piechart.initChart();
                }, 200);
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