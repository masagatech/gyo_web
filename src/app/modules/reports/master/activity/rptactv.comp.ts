import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ActivityService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rptactv.comp.html',
    providers: [CommonService]
})

export class ActivityReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    activityDT: any = [];

    @ViewChild('activity') activity: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _actvservice: ActivityService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getActivityDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Activity

    getActivityDetails() {
        var that = this;
        commonfun.loader();

        that._actvservice.getActivityDetails({
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin, "wsautoid": that._enttdetails.wsautoid, "enttid": that._enttdetails.enttid
        }).subscribe(data => {
            try {
                that.activityDT = data.data;
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

    // Export

    public exportToCSV() {
        this._autoservice.exportToCSV(this.activityDT, "Activitiy Reports");
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.activity.nativeElement, 0, 0, options, () => {
            pdf.save("Activitiy Reports.pdf");
        });
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
