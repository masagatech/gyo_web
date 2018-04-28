import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ERPDashboardService } from '@services/erp';

@Component({
    templateUrl: './studsearch.comp.html'
})

export class StudentSearchComponent implements OnInit, AfterViewInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    attndOptions;
    attendaceDT: any = [];

    resultOptions;
    resultDT: any = [];

    constructor(private _dbservice: ERPDashboardService, private _loginservice: LoginService, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.attndOptions = this.getChartOptions("discreteBarChart", "Attendance");
        this.resultOptions = this.getChartOptions("discreteBarChart", "Exam Result");
    }

    ngOnInit() {
        this.getDashboard("attendance");
        this.getDashboard("examresult");
    }

    ngAfterViewInit() {
        setTimeout(function () {
            window.dispatchEvent(new Event('resize'))
        }, 800);
    }

    // Dashboard

    getChartOptions(charttype, charthead) {
        var that = this;

        return {
            chart: {
                type: charttype,

                margin: {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },

                x: function (d) { return d.x; },
                y: function (d) { return d.y; },

                useInteractiveGuideline: true,
                transitionDuration: 1500,

                showValues: true,

                valueFormat: function (d) {
                    return d3.format('0')(d);
                },

                xAxis: {
                    axisLabel: '',
                    rotateLabels: 10
                },

                yAxis: {
                    axisLabel: charthead,

                    tickFormat: function (d) {
                        return d3.format('0')(d);
                    },

                    axisLabelDistance: -10
                }
            }
        };
    }

    getChartDetails(_data) {
        var that = this;
        var _data_compare = [];
        var sin = [];

        for (var i = 0; i < _data.length; i++) {
            var el = _data[i];

            sin.push({ x: el.name, y: parseInt(el.count) });

            // _data_compare.push({
            //     values: sin,
            //     key: "Cumulative Return",
            //     color: el.color
            // });
        }

        //return _data_compare;

        return [{
            values: sin,
            key: "Cumulative Return"
        }];
    }

    getDashboard(charttype) {
        var that = this;
        commonfun.loader();

        var dbparams = {
            "flag": charttype, "uid": that.loginUser.uid, "utype": that.loginUser.utype, "psngrid": 836, "ayid": 3,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }

        that._dbservice.getStudentDashboard(dbparams).subscribe(data => {
            try {
                if (charttype == "attendance") {
                    that.attendaceDT = that.getChartDetails(data.data);
                }
                else if (charttype == "examresult") {
                    that.resultDT = that.getChartDetails(data.data);
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

    getRandomRolor() {
        var letters = '012345'.split('');
        var color = '#';

        color += letters[Math.round(Math.random() * 5)];
        letters = '0123456789ABCDEF'.split('');

        for (var i = 0; i < 5; i++) {
            color += letters[Math.round(Math.random() * 15)];
        }

        return color;
    }
}