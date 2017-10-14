import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { QualificationService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addqlf.comp.html'
})

export class AddQualificationComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    groupDT: any = [];
    
    qlfid: number = 0;
    qlftitle: string = "";
    qlfgrpid: number = 0;
    qlfdesc: string = "";

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _qlfservice: QualificationService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();
        
        this.fillQualificationDropDown();
    }

    public ngOnInit() {
        this.getQualification();
    }

    // Fill Qualification DropDown

    fillQualificationDropDown() {
        var that = this;
        commonfun.loader();

        that._qlfservice.getQualificationDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.groupDT = data.data;
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

    // Clear Fields

    resetQualificationFields() {
        this.qlfid = 0;
        this.qlftitle = "";
        this.qlfdesc = "";
    }

    // Validation For Save

    isValidationForSave() {
        var that = this;

        if (that.qlfgrpid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Group");
            $(".group").focus();
            return false;
        }
        else if (that.qlftitle == "") {
            that._msg.Show(messageType.error, "Error", "Enter Title");
            $(".qlftitle").focus();
            return false;
        }

        return true;
    }

    // Save Data

    saveQualification() {
        var that = this;
        var isvalid = that.isValidationForSave();

        if (isvalid) {
            commonfun.loader();

            var savelvpsngr = {
                "qlfid": that.qlfid,
                "qlfgrpid": that.qlfgrpid,
                "qlftitle": that.qlftitle,
                "qlfdesc": that.qlfdesc,
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid
            }

            that._qlfservice.saveQualificationInfo(savelvpsngr).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_qualificationinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid == "1") {
                            that.resetQualificationFields();
                        }
                        else {
                            that.backViewData();
                        }

                        commonfun.loaderhide();
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
                        commonfun.loaderhide();
                    }
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
                console.log(err);
                commonfun.loaderhide();
            }, () => {
            });
        }
    }

    // Get Academic Year Data

    getQualification() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.qlfid = params['id'];

                that._qlfservice.getQualificationDetails({
                    "flag": "edit",
                    "qlfid": that.qlfid
                }).subscribe(data => {
                    try {
                        that.qlfid = data.data[0].qlfid;
                        that.qlfgrpid = data.data[0].qlfgrpid;
                        that.qlftitle = data.data[0].qlftitle;
                        that.qlfdesc = data.data[0].qlfdesc;
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
                that.resetQualificationFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/admin/qualification']);
    }
}