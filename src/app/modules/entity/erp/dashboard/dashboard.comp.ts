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

    classStudentDT: any = [];
    classOpeningDT: any = [];
    classFeesDT: any = [];
    feesCategoryDT: any = [];
    classDT: any = [];

    @ViewChild('countpiechart')
    countpiechart: UIChart;

    @ViewChild('openingpiechart')
    openingpiechart: UIChart;

    @ViewChild('feespiechart')
    feespiechart: UIChart;

    @ViewChild('catfeespiechart')
    catfeespiechart: UIChart;

    colors: any = {};

    constructor(private _dbservice: ERPDashboardService, private _loginservice: LoginService, private _routeParams: ActivatedRoute,
        private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getSinglePieChart("classstudent");
        this.getSinglePieChart("classopening");
        this.getSinglePieChart("classfees");
        this.getSinglePieChart("categotyfees");
        // this.getClassDetails();
    }

    ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Single Pie Chart

    getSinglePieChart(charttype) {
        var that = this;
        commonfun.loader();

        var _dbChartDT = { labels: [], details: [], datasets: [{ label: '', backgroundColor: [], borderColor: [], data: [] }] };

        var _label = [];
        var _details = [];
        var _labels = [];
        var _datasets = [];

        that._dbservice.getERPDashboard({
            "flag": charttype, "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that._enttdetails.issysadmin
        }).subscribe(data => {
            try {
                var _dashboardDT = data.data;

                for (var i = 0; i < _dashboardDT.length; i++) {
                    var name = _dashboardDT[i].name;
                    _labels.push(name);
                    _details = _dashboardDT[i].details;

                    that.colors[name] = that.colors[name] || commonfun.randomColor(5);
                    _dbChartDT.datasets[0].backgroundColor.push(that.colors[name]);

                    if (charttype == "classstudent") {
                        _datasets.push(_dashboardDT[i].countstuds);
                    }
                    else if (charttype == "classopening") {
                        _datasets.push(_dashboardDT[i].opening);
                    }
                    else if (charttype == "classfees") {
                        _datasets.push(_dashboardDT[i].totalfees | that.loginUser.globsettings[0]);
                    }
                    else {
                        _datasets.push(_dashboardDT[i].fees | that.loginUser.globsettings[0]);
                    }
                }

                _dbChartDT.labels = _labels;
                _dbChartDT.details = _details;
                _dbChartDT.datasets[0].data = _datasets;

                if (charttype == "classstudent") {
                    that.classStudentDT = _dbChartDT;
                    _dbChartDT.datasets[0].label = "Class Wise Student";

                    setTimeout(() => {
                        that.countpiechart.ngOnDestroy();
                        that.countpiechart.initChart();
                    }, 200);
                }
                else if (charttype == "classopening") {
                    that.classOpeningDT = _dbChartDT;
                    _dbChartDT.datasets[0].label = "Class Opening";

                    setTimeout(() => {
                        that.openingpiechart.ngOnDestroy();
                        that.openingpiechart.initChart();
                    }, 200);
                }
                else if (charttype == "classfees") {
                    that.classFeesDT = _dbChartDT;
                    _dbChartDT.datasets[0].label = "Class Wise Fees";

                    setTimeout(() => {
                        that.feespiechart.ngOnDestroy();
                        that.feespiechart.initChart();
                    }, 200);
                }
                else {
                    that.feesCategoryDT = _dbChartDT;
                    _dbChartDT.datasets[0].label = "Category Wise Class Fees";

                    setTimeout(() => {
                        that.catfeespiechart.ngOnDestroy();
                        that.catfeespiechart.initChart();
                    }, 200);
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

    // Fees Category

    getClassDetails() {
        var that = this;
        commonfun.loader();

        that._dbservice.getERPDashboard({
            "flag": "classfeescat", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that._enttdetails.issysadmin
        }).subscribe(data => {
            try {
                that.classDT = data.data;
                console.log(that.classDT);
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

    getCategoryWiseFees(row) {
        var that = this;
        var maindata = { labels: [], datasets: [{ data: [], label: [], backgroundColor: [], hoverBackgroundColor: [] }] };
        var _labels = [];
        var _datasets = [];

        for (var i = 0; i <= row.length - 1; i++) {
            var catname = row[i].catname;
            var classname = row[i].classname;
            _labels.push(catname);
            that.colors[catname] = that.colors[catname] || commonfun.randomColor(5);
            maindata.datasets[0].label.push(classname);
            maindata.datasets[0].backgroundColor.push(that.colors[catname]);
            _datasets.push(parseFloat(row[i].fees));
        }

        maindata.labels = _labels;
        maindata.datasets[0].data = _datasets;
        return maindata;
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}