import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService, DashboardService } from '@services';
import { LoginUserModel, Globals, Common } from '@models';
import { WorkspaceService, EntityService } from '@services/master';

@Component({
    templateUrl: './studsdb.comp.html'
})

export class StudentDashboardComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;

    @Input() data: any;

    global = new Globals();

    flag: string = "";
    qsid: number = 0;

    autoStudentDT: any = [];
    selectStudent: any = {};
    studid: number = 0;
    studname: string = "";
    admtype: string = "";

    infoDT: any = [];
    scheduleDT: any = [];
    notificationDT: any = [];

    private subscribeParameters: any;

    constructor(private _router: Router, private _actrouter: ActivatedRoute, private _msg: MessageService, private _loginservice: LoginService,
        private _dbservice: DashboardService, private _autoservice: CommonService, private _wsservice: WorkspaceService,
        private _entityservice: EntityService) {
        this.loginUser = this._loginservice.getUser();
    }

    ngOnInit() {
        this.viewStudentDashboard();
    }

    // Auto Completed Student

    getStudentData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "allstudent",
            "uid": this.data.loginUser.uid,
            "ucode": this.data.loginUser.ucode,
            "utype": this.data.loginUser.utype,
            "issysadmin": this.data.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.autoStudentDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Student

    selectStudentData(event) {
        var studdata = { "flag": "student", "id": event.value };
        sessionStorage.setItem("_studdata_", JSON.stringify(studdata));

        this._router.navigate(['/admin/helpdesk'], {
            queryParams: studdata
        });
    }

    // Student Dashboard

    viewStudentDashboard() {
        var that = this;

        that.subscribeParameters = that._actrouter.queryParams.subscribe(params => {
            that.flag = params['flag'] || "";
            that.qsid = params['id'] || 0;

            that.getDashboard();
            that.getStudentTrips("html");
        });
    }

    // Student Profile

    getWorkspaceDetails(row) {
        var that = this;
        commonfun.loader();

        that._wsservice.getWorkspaceDetails({
            "flag": "userwise", "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin, "wsautoid": row.wsautoid
        }).subscribe(data => {
            try {
                sessionStorage.setItem("_schwsdetails_", JSON.stringify(data.data[0]));
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

    getEntityDetails(row) {
        var that = this;
        commonfun.loader();

        var params = {
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin, "wsautoid": row.wsautoid, "schoolid": row.schoolid,
            "enttid": row.enttid, "entttype": row.entttype
        }

        that._entityservice.getEntityDetails(params).subscribe(data => {
            try {
                if (row.isactive) {
                    sessionStorage.removeItem("_schenttdetails_");
                    sessionStorage.removeItem("_ayid_");

                    sessionStorage.setItem("_schenttdetails_", JSON.stringify(data.data[0]));

                    if (row.entttype == "School") {
                        that._router.navigate(['/erp/student/edit', row.enrlmntid]);
                    }
                    else {
                        that._router.navigate(['/master/passenger/edit', row.enrlmntid]);
                    }
                }
                else {
                    that._msg.Show(messageType.error, "Error", "This Student is Deactive");
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

    viewStudentProfile(row) {
        var that = this;

        that.getWorkspaceDetails(row);
        that.getEntityDetails(row);
    }

    // Driver Dashboard

    viewDriverDashboard(row) {
        var drvdata = { "flag": "driver", "id": row.driverid };
        sessionStorage.setItem("_userdata_", JSON.stringify(drvdata));

        this._router.navigate(['/admin/helpdesk'], {
            queryParams: drvdata
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

        var dbparams = {
            "flag": that.flag, "studid": that.qsid, "uid": that.data.loginUser.uid,
            "utype": that.data.loginUser.utype, "issysadmin": that.data.loginUser.issysadmin
        }

        commonfun.loader("#loadercontrol", "pulse", "loading " + that.flag + "...");

        that._dbservice.getHelpDesk(dbparams).subscribe(data => {
            try {
                that.infoDT = data.data[0];

                if (that.infoDT.length > 0) {
                    that.studid = that.infoDT[0].enrlmntid;
                    that.studname = that.infoDT[0].studentname + " : " + that.infoDT[0].mobileno1 + " : " + that.infoDT[0].mobileno2 + " (" + that.infoDT[0].schoolname + ")";
                    that.selectStudent = { value: that.studid, label: that.studname }
                }
                else {
                    that.studid = 0;
                    that.studname = "";
                    that.selectStudent = {}
                }

                that.notificationDT = data.data[1];
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

    // Get Student Trips

    getStudentTrips(format) {
        var that = this;

        var params = {
            "flag": "feessummary", "type": "download", "uid": that.qsid, "utype": that.flag == "" ? "student" : that.flag, "format": format
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