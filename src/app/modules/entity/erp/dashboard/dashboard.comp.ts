import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ERPDashboardService } from '@services/erp';
import { UIChart } from 'primeng/primeng';

@Component({
    templateUrl: 'dashboard.comp.html'
})

export class ERPDashboardComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    ayid: number = 0;

    divisionDT: any = [];
    data: any = [];

    classStatusDT: any = [];
    classStatusChartDT: any = [];

    isShowStatusChart: boolean = true;
    isShowStatusGrid: boolean = false;

    classOpeningDT: any = [];
    classOpnChartDT: any = [];

    isShowOpenChart: boolean = true;
    isShowOpenGrid: boolean = false;

    classAttendanceDT: any = [];
    classAttndChartDT: any = [];

    isShowAttndChart: boolean = true;
    isShowAttndGrid: boolean = false;

    tchrSubDT: any = [];
    tchrattndDT: any = [];

    classFeesDT: any = [];
    feesCategoryDT: any = [];

    @ViewChild('piechart')
    piechart: UIChart;

    colors: any = {};

    constructor(private _dbservice: ERPDashboardService, private _loginservice: LoginService, private _routeParams: ActivatedRoute,
        private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
    }

    ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Fill Class Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._dbservice.getERPDashboard({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    that.ayid = that.ayDT.filter(a => a.iscurrent == true)[0].id;
                }

                that.getDashboardDetails();
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

    isshClassStatus(viewtype) {
        var that = this;

        if (viewtype == "grid") {
            that.isShowStatusGrid = true;
            that.isShowStatusChart = false;
        }
        else {
            that.isShowStatusGrid = false;
            that.isShowStatusChart = true;
        }
    }

    isshClassOpening(viewtype) {
        var that = this;

        if (viewtype == "grid") {
            that.isShowOpenGrid = true;
            that.isShowOpenChart = false;
        }
        else {
            that.isShowOpenGrid = false;
            that.isShowOpenChart = true;
        }
    }

    isshClassAttendance(viewtype) {
        var that = this;

        if (viewtype == "grid") {
            that.isShowAttndGrid = true;
            that.isShowAttndChart = false;
        }
        else {
            that.isShowAttndGrid = false;
            that.isShowAttndChart = true;
        }
    }

    // Division

    getDivisionDetails() {
        var that = this;
        commonfun.loader();

        that._dbservice.getERPDashboard({
            "flag": "division", "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.divisionDT = data.data;
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

    // Dashboard Data

    getDashboardDetails() {
        this.getDivisionDetails();
        this.getDashboardData("classstatus");
        this.getDashboardData("tchrattnd");
        this.getDashboardData("tchrsub");
        this.getDashboardData("classfees");
    }

    getDashboardData(dbtype) {
        var that = this;
        commonfun.loader();

        var _dbChartDT = {
            labels: [], datasets: [
                { label: '', backgroundColor: [], borderColor: [], data: [] },
                { label: '', backgroundColor: [], borderColor: [], data: [] }
            ]
        };

        var _label = [];
        var _labels = [];
        var _datasets = [];
        var _datasets2 = [];

        var _dashboardDT: any = [];
        
        var _totalstudent: number = 0;
        var _presentstudent: number = 0;

        that._dbservice.getERPDashboard({
            "flag": dbtype, "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype, "ayid": that.ayid, "classid": 0,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin, "viewby": "portal"
        }).subscribe(data => {
            try {
                if (dbtype == "classstatus") {
                    that.classStatusDT = data.data;
                }

                _dashboardDT = data.data;

                for (var i = 0; i < _dashboardDT.length; i++) {
                    var name = _dashboardDT[i].name;
                    _labels.push(name);

                    if (dbtype == "tchrsub") {
                        that.colors[name] = that.colors[name] || commonfun.randomColor(5);
                        _dbChartDT.datasets[0].backgroundColor.push(that.colors[name]);
                        
                        _datasets.push(_dashboardDT[i].totalcount);
                    }
                    else if (dbtype == "classstatus") {
                        _dbChartDT.datasets[0].backgroundColor.push("#03A9F4");
                        _dbChartDT.datasets[1].backgroundColor.push("#8BC34A");

                        _datasets.push(_dashboardDT[i].totalstudent);
                        _datasets2.push(_dashboardDT[i].present);

                        _totalstudent += parseFloat(_dashboardDT[i].totalstudent);
                        _presentstudent += parseFloat(_dashboardDT[i].present);

                        _dbChartDT.datasets[0].label = "Total Student " + _totalstudent;
                        _dbChartDT.datasets[1].label = "Present Student " + _presentstudent;
                    }
                    else if (dbtype == "tchrattnd") {
                        var color = _dashboardDT[i].color;
                        _dbChartDT.datasets[0].backgroundColor.push(color);

                        _datasets.push(_dashboardDT[i].totalcount);
                    }
                    else {
                        that.colors[name] = that.colors[name] || commonfun.randomColor(5);
                        _dbChartDT.datasets[0].backgroundColor.push(that.colors[name]);

                        _datasets.push(_dashboardDT[i].totalcount);
                    }
                }

                _dbChartDT.labels = _labels;
                _dbChartDT.datasets[0].data = _datasets;
                _dbChartDT.datasets[1].data = _datasets2;

                if (dbtype == "classstatus") {
                    that.classStatusChartDT = _dbChartDT;
                }
                else if (dbtype == "tchrattnd") {
                    that.tchrattndDT = _dbChartDT;
                }
                else if (dbtype == "tchrsub") {
                    that.tchrSubDT = _dbChartDT;
                }
                else if (dbtype == "classfees") {
                    that.classFeesDT = _dbChartDT;
                    _dbChartDT.datasets[0].label = "Class Fees";
                }

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

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}