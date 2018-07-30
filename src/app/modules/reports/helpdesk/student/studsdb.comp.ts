import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MessageService, messageType, CommonService } from '@services';
import { ERPDashboardService } from '@services/erp';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: './studsdb.comp.html'
})

export class StudentDashboardComponent implements OnInit, OnDestroy {
    @Input() data: any;

    autoStudentDT: any = [];
    selectStudent: any = {};
    studid: number = 0;
    studname: string = "";

    constructor(private _msg: MessageService, private _dbservice: ERPDashboardService, private _autoservice: CommonService) {
    }

    ngOnInit() {
        this.viewStudentDashboard();
    }

    // Auto Completed Student

    getStudentData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "student",
            "uid": this.data.loginUser.uid,
            "ucode": this.data.loginUser.ucode,
            "utype": this.data.loginUser.utype,
            "enttid": this.data._enttdetails.enttid,
            "wsautoid": this.data._enttdetails.wsautoid,
            "issysadmin": this.data._enttdetails.issysadmin,
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
        this.studid = event.value;
        this.studname = event.label;

        Cookie.set("_studid_", this.studid.toString());
        Cookie.set("_studname_", this.studname);

        this.viewStudentDashboard();
    }

    public viewStudentDashboard() {
        var that = this;

        if (Cookie.get('_studname_') != null) {
            that.studid = parseInt(Cookie.get('_studid_'));
            that.studname = Cookie.get('_studname_');

            that.selectStudent = { value: that.studid, label: that.studname }
        }

        that.getDashboard();
    }

    getDashboard() {
        var that = this;
        commonfun.loader();

        var dbparams = {
            "flag": "student", "uid": that.data.loginUser.uid, "utype": that.data.loginUser.utype,
            "studid": that.studid, "ayid": that.data._enttdetails.ayid, "enttid": that.data._enttdetails.enttid,
            "wsautoid": that.data._enttdetails.wsautoid, "issysadmin": that.data.loginUser.issysadmin
        }

        that._dbservice.getStudentDashboard(dbparams).subscribe(data => {
            try {
                
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