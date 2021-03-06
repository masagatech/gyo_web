import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AssesmentService } from '@services/erp';

@Component({
    templateUrl: 'viewassres.comp.html',
    providers: [CommonService]
})

export class ViewAssesmentResultComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    classDT: any = [];
    studentDT: any = [];
    studsdata: any = [];

    ayid: number = 0;
    clsid: number = 0;

    studid: number = 0;
    studname: string = "";

    assesmentDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _assservice: AssesmentService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillAYAndClassDropDown();
        this.getAssesmentResult();
    }

    public ngOnInit() {

    }

    // Fill AY And Class Drop Down

    fillAYAndClassDropDown() {
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
                    if (sessionStorage.getItem("_ayid_") != null) {
                        that.ayid = parseInt(sessionStorage.getItem("_ayid_"));
                    }
                    else {
                        defayDT = that.ayDT.filter(a => a.iscurrent == true);

                        if (defayDT.length > 0) {
                            that.ayid = defayDT[0].id;
                        }
                        else {
                            that.ayid = that._enttdetails.ayid;
                        }
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

    // Auto Completed Student

    getStudentData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "student",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "classid": this.clsid,
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "issysadmin": this.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.studentDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Student

    selectStudentData(event) {
        this.studid = event.value;
        this.studname = event.label;

        this.getAssesmentResult();
    }

    getAssesmentResult() {
        var that = this;
        commonfun.loader();

        that._assservice.getAssesmentResult({
            "flag": "view", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ayid": that.ayid, "classid": that.clsid, "studid": that.studid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
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

    public addAssesmentResult() {
        sessionStorage.removeItem("_editassres_");
        this._router.navigate(['/transaction/assesmentresult/add']);
    }

    public editAssesmentResult(row) {
        var that = this;
        sessionStorage.removeItem("_editassres_");

        var params = {
            "flag": "aded", "mode": "edit", "assid": 0, "ayid": row.ayid, "ayname": row.ayname, "classid": row.classid, "classname": row.classname,
            "asstypid": row.asstypid, "asstyp": row.asstyp, "asstyphead": row.asstyphead, "asstypname": row.asstypname,
            "studid": row.studid, "studname": row.studname, "frmdt": row.frmdt, "todt": row.todt, "assdate": row.assdate,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }

        sessionStorage.setItem("_editassres_", JSON.stringify(params));
        this._router.navigate(['/transaction/assesmentresult/edit']);
    }
}
