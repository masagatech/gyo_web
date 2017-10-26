import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { FeesService } from '@services/erp';

declare var google: any;

@Component({
    templateUrl: 'viewfscoll.comp.html',
    providers: [CommonService]
})

export class ViewFeesCollectionComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    classDT: any = [];

    fclid: number = 0;
    ayid: number = 0;
    classid: number = 0;
    classfees: any = "";

    feesCollDT: any = [];

    private subscribeParameters: any;

    constructor(private _feesservice: FeesService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillAYAndClassDropDown();
    }

    public ngOnInit() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.classid = params['id'];
                that.getFeesCollection();
            }
            else {
                that.resetAllFields();
                commonfun.loaderhide();
            }
        });
    }

    // Reset Fees Details

    resetAllFields() {
        var that = this;

        that.classid = 0;
        that.feesCollDT = [];
    }

    // Fill Academic Year, Class

    fillAYAndClassDropDown() {
        var that = this;
        commonfun.loader();

        that._feesservice.getClassFees({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data[0].filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    that.ayid = that.ayDT.filter(a => a.iscurrent == true)[0].id;
                    that.getFeesCollection();
                }

                that.classDT = data.data[0].filter(a => a.group == "class");
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

    // Add Fees Collection

    addFeesCollection(row) {
        this._router.navigate(['/transaction/feescollection/student', row.studid]);
    }

    viewFeesCollection(row) {
        this._router.navigate(['/transaction/feescollection/student', row.studid]);
    }

    totalFees() {
        var that = this;
        var field: any = [];

        var totalfees = 0;

        for (var i = 0; i < that.feesCollDT.length; i++) {
            field = that.feesCollDT[i];
            totalfees += parseFloat(field.feescoll);
        }

        return totalfees;
    }

    // Get Class Fees

    getFeesCollection() {
        var that = this;
        commonfun.loader();

        that._feesservice.getFeesCollection({
            "flag": "all", "ayid": that.ayid, "classid": that.classid, "studid": -1, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.feesCollDT = data.data;
                
                if (data.data.length > 0) {
                    that.classfees = data.data[0].classfees;
                }
                else {
                    that.classfees = 0;
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
}
