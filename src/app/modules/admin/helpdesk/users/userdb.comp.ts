import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, CommonService, DashboardService } from '@services';
import { Globals, Common } from '@models';

@Component({
    templateUrl: './userdb.comp.html'
})

export class UserDashboardComponent implements OnInit, OnDestroy {
    @Input() data: any;

    global = new Globals();

    flag: string = "";
    qsid: number = 0;

    autoUserDT: any = [];
    selectUser: any = {};
    uid: number = 0;
    uname: string = "";

    infoDT: any = [];
    vehicleDT: any = [];
    scheduleDT: any = [];

    private subscribeParameters: any;

    constructor(private _router: Router, private _actrouter: ActivatedRoute, private _msg: MessageService,
        private _dbservice: DashboardService, private _autoservice: CommonService) {
    }

    ngOnInit() {
        this.viewUserDashboard();
    }

    // Auto Completed User

    getUserData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "allusers",
            "uid": this.data.loginUser.uid,
            "utype": this.data.loginUser.utype,
            "issysadmin": this.data.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.autoUserDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected User

    selectUserData(event) {
        var userdata = { "flag": event.ptype, "id": event.uid };
        sessionStorage.setItem("_userdata_", JSON.stringify(userdata));

        this._router.navigate(['/admin/helpdesk'], {
            queryParams: userdata
        });
    }

    viewUserDashboard() {
        var that = this;

        that.subscribeParameters = that._actrouter.queryParams.subscribe(params => {
            that.flag = params['flag'] || "";
            that.qsid = params['id'] || 0;

            that.getDashboard();
            that.getDriverTrips("html");
        });
    }

    viewDriverDashboard(row) {
        var drvdata = { "flag": "driver", "id": row.driverid };
        sessionStorage.setItem("_userdata_", JSON.stringify(drvdata));

        this._router.navigate(['/admin/helpdesk'], {
            queryParams: drvdata
        });
    }

    viewStudentDashboard(row) {
        var studdata = { "flag": "student", "id": row.stdid };
        sessionStorage.setItem("_studdata_", JSON.stringify(studdata));

        this._router.navigate(['/admin/helpdesk'], {
            queryParams: studdata
        });
    }

    viewVehicleDashboard(row) {
        var vehdata = { "flag": "vehicle", "id": row.vehicleid };
        sessionStorage.setItem("_vehdata_", JSON.stringify(vehdata));

        this._router.navigate(['/admin/helpdesk'], {
            queryParams: vehdata
        });
    }

    getDashboard() {
        var that = this;
        var headname = "";

        var dbparams = {
            "flag": that.flag, "id": that.qsid, "uid": that.data.loginUser.uid,
            "utype": that.data.loginUser.utype, "issysadmin": that.data.loginUser.issysadmin
        }

        commonfun.loader("#loadercontrol", "pulse", "loading " + that.flag + "...");

        that._dbservice.getHelpDesk(dbparams).subscribe(data => {
            try {
                that.infoDT = data.data[0];

                if (that.infoDT.length > 0) {
                    if (that.flag == "user") {
                        headname = that.infoDT[0].wsname;
                    }
                    else {
                        headname = that.infoDT[0].enttname;
                    }
    
                    that.uid = that.infoDT[0].uid;
                    that.uname = that.infoDT[0].uname + " : " + that.infoDT[0].mobile + " : " + that.infoDT[0].altmobile + " (" + headname + ")";
                    that.selectUser = { uid: that.uid, uname: that.uname }
                }
                else {
                    that.uid = 0;
                    that.uname = "";
                    that.selectUser = {}
                }

                that.vehicleDT = data.data[1];
                that.scheduleDT = data.data[2];
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#loadercontrol", "pulse", "loading " + that.flag + "...");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    // Get Driver Trips

    getDriverTrips(format) {
        var that = this;

        var params = {
            "flag": "feessummary", "type": "download", "uid": that.qsid, "utype": that.flag, "format": format
        }

        if (format == "html") {
            $("#divtrip")[0].src = Common.getReportUrl("getScheduleReports", params);
        }
        else {
            window.open(Common.getReportUrl("getScheduleReports", params));
        }
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}