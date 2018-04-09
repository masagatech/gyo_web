import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AssesmentService } from '@services/erp';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
    templateUrl: 'viewass.comp.html',
    providers: [CommonService]
})

export class ViewAssesmentComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    ayid: number = 0;
    subjectDT: any = [];
    activityDT: any = [];
    asstype: string = "";
    classDT: any = [];
    clsid: number = 0;

    assesmentDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _assservice: AssesmentService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.fillAssesmentTypeDropDown();
        this.getAssesmentDetails();
    }

    public ngOnInit() {

    }

    // Fill Academic Year, Semester And Class Down

    fillDropDownList() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._assservice.getAssesmentDetails({
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

                that.classDT = data.data.filter(a => a.group == "class");
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

    fillAssesmentTypeDropDown() {
        var that = this;
        commonfun.loader();

        that._assservice.getAssesmentDetails({
            "flag": "asstypeddl", "classid": that.clsid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.subjectDT = data.data.filter(a => a.subtype == "Subject");
                that.activityDT = data.data.filter(a => a.subtype == "Activity");
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

    getAssesmentDetails() {
        var that = this;
        commonfun.loader();

        var asstypid = that.asstype == "" ? "0" : that.asstype.split('~')[1];
        var asstypname = that.asstype == "" ? "" : that.asstype.split('~')[0];

        that._assservice.getAssesmentDetails({
            "flag": "all", "ayid": that.ayid, "asstypid": asstypid, "asstyp": asstypname, "clsid": that.clsid, "uid": that.loginUser.uid,
            "utype": that.loginUser.utype, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.assesmentDT = data.data;
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

    public addAssesment() {
        this._router.navigate(['/transaction/assesment/add']);
    }

    public editAssesment(row) {
        this._router.navigate(['/transaction/assesment/edit', row.assid]);
    }
}
