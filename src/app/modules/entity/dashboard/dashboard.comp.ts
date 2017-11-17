import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ERPDashboardService } from '@services/erp';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { UIChart } from 'primeng/primeng';

@Component({
    templateUrl: 'dashboard.comp.html',
    providers: [CommonService]
})

export class DashboardComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    dashboardDT: any = [];

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

    constructor(private _dbservice: ERPDashboardService, private _autoservice: CommonService, private _loginservice: LoginService,
        private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getDashboard();
    }

    ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Dashboard

    getDashboard() {
        var that = this;
        commonfun.loader();

        var dbparams = {
            "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin, "wsautoid": that._enttdetails.wsautoid,
            "enttid": that._enttdetails.enttid, "psngrtype": that._enttdetails.psngrtype, "dbview": "entt"
        }

        that._autoservice.getDashboard(dbparams).subscribe(data => {
            try {
                that.dashboardDT = data.data;
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

    // open

    openForm(row) {
        var that = this;

        if (row.dbtype == "user") {
            Cookie.delete('_srcutype_');
            Cookie.delete('_enttid_');
            Cookie.delete('_enttnm_');

            Cookie.set("_srcutype_", row.dbcode);
            Cookie.set("_enttid_", that._enttdetails.enttid);
            Cookie.set("_enttnm_", that._enttdetails.enttname);
        }
        else if (row.dbtype == "entity") {
            Cookie.delete('_entttype_');
            Cookie.set("_entttype_", row.dbcode);
        }

        that._router.navigate([row.dblink]);
    }

    // Fill Class Drop Down

    fillDropDownList() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._dbservice.getERPDashboard({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    defayDT = that.ayDT.filter(a => a.iscurrent == true);

                    if (defayDT.length > 0) {
                        that.ayid = defayDT[0].id;
                    }
                    else {
                        that.ayid = 0;
                    }
                }

                that.getERPDashboardDetails();
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

    getERPDashboardDetails() {
        if (this._enttdetails.entttype == "School") {
            this.getDivisionDetails();
            this.getERPDashboardData("classstatus");
            this.getERPDashboardData("tchrattnd");
            this.getERPDashboardData("tchrsub");
            this.getERPDashboardData("classfees");
        }
    }

    getERPDashboardData(dbtype) {
        var that = this;
        commonfun.loader();

        var _dbChartDT = null;

        var _label = [];
        var _labels = [];
        var _datasets = [];
        var _datasets2 = [];
        var _datasets3 = [];

        var _dashboardDT: any = [];

        var _presentstudent: number = 0;
        var _absentstudent: number = 0;
        var _leavestudent: number = 0;

        if (dbtype == "classstatus") {
            _dbChartDT = {
                labels: [], datasets: [
                    { label: '', backgroundColor: [], borderColor: [], data: [] },
                    { label: '', backgroundColor: [], borderColor: [], data: [] },
                    { label: '', backgroundColor: [], borderColor: [], data: [] }
                ]
            };
        }
        else {
            _dbChartDT = {
                labels: [], datasets: [
                    { label: '', backgroundColor: [], borderColor: [], data: [] }
                ]
            };
        }

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
                        _dbChartDT.datasets[0].backgroundColor.push("#8BC34A");
                        _dbChartDT.datasets[1].backgroundColor.push("#E91E63");
                        _dbChartDT.datasets[2].backgroundColor.push("#FF9800");

                        _datasets.push(_dashboardDT[i].present);
                        _datasets2.push(_dashboardDT[i].absent);
                        _datasets3.push(_dashboardDT[i].leave);

                        _presentstudent += parseFloat(_dashboardDT[i].present);
                        _absentstudent += parseFloat(_dashboardDT[i].absent);
                        _leavestudent += parseFloat(_dashboardDT[i].leave);

                        _dbChartDT.datasets[0].label = "Present Student " + _presentstudent;
                        _dbChartDT.datasets[1].label = "Absent Student " + _absentstudent;
                        _dbChartDT.datasets[2].label = "Leave Student " + _leavestudent;
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

                if (dbtype == "classstatus") {
                    _dbChartDT.datasets[1].data = _datasets2;
                    _dbChartDT.datasets[2].data = _datasets3;

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