import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { FeesService } from '@services/erp';

declare var google: any;

@Component({
    templateUrl: 'addclsfs.comp.html',
    providers: [CommonService]
})

export class AddClassFeesComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    classDT: any = [];
    installmentDT: any = [];

    ayid: number = 0;
    classid: number = 0;
    
    private subscribeParameters: any;

    constructor(private _feesservice: FeesService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
    }

    public ngOnInit() {
        this.getClassFees();
    }

    // Fill Academic Year, Class Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._feesservice.getClassFees({
            "flag": "dropdown", "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");
                that.classDT = data.data.filter(a => a.group == "class");
                that.installmentDT = data.data.filter(a => a.group == "feesplan");
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

    // Save Class Fees

    saveClassFees() {
        var that = this;

        if (that.ayid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Academic Year");
            $(".ay").focus();
        }
        else if (that.classid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Class");
            $(".class").focus();
        }
        else {
            commonfun.loader();

            var saveassignment = {
                "ayid": that.ayid,
                "classid": that.classid,
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid
            }

            this._feesservice.saveClassFees(saveassignment).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_assignmentinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            
                        }
                        else {
                            that.backViewData();
                        }
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
                    }

                    commonfun.loaderhide();
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
                console.log(err);
                commonfun.loaderhide();
            }, () => {
                // console.log("Complete");
            });
        }
    }

    // Get Class Fees

    getClassFees() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.classid = params['id'];

                that._feesservice.getClassFees({
                    "flag": "edit", "ayid": that.ayid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
                    "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
                }).subscribe(data => {
                    try {
                        that.ayid = data.data[0].ayid;
                        that.classid = data.data[0].classid;
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
            else {
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/erp/classfees']);
    }
}
