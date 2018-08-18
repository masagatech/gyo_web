import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AcademicYearService } from '@services/erp';

@Component({
    templateUrl: 'addacdmc.comp.html'
})

export class AddAcademicYearComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayid: number = 0;
    ayname: string = "";
    frmdt: any = "";
    todt: any = "";
    remark: string = "";
    iscurrent: boolean = false;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _acdmcservice: AcademicYearService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();
    }

    public ngOnInit() {
        this.getAcademicYear();
    }

    // Clear Fields

    resetAcademicYearFields() {
        this.ayid = 0;
        this.ayname = "";
        this.frmdt = "";
        this.todt = "";
        this.iscurrent = false;
    }

    // Validation For Save

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    isValidationForSave() {
        var that = this;

        var date = new Date();
        var today = that.formatDate(new Date(date.getFullYear(), date.getMonth(), date.getDate()));

        if (that.ayname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Title");
            $(".ayname").focus();
            return false;
        }
        else if (that.frmdt == "") {
            that._msg.Show(messageType.error, "Error", "Enter From Date");
            $(".frmdt").focus();
            return false;
        }
        else if (that.todt == "") {
            that._msg.Show(messageType.error, "Error", "Enter To Date");
            $(".todt").focus();
            return false;
        }
        else if (that.frmdt > that.todt) {
            that._msg.Show(messageType.error, "Error", "Sholuld Be To Date Greater Than From Date");
            $(".todt").focus();
            return false;
        }

        return true;
    }

    // Save Data

    saveAcademicYear() {
        var that = this;
        var isvalid = that.isValidationForSave();

        if (isvalid) {
            commonfun.loader();

            var params = {
                "ayid": that.ayid,
                "ayname": that.ayname,
                "frmdt": that.frmdt,
                "todt": that.todt,
                "remark": that.remark,
                "iscurrent": that.iscurrent,
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid
            }

            that._acdmcservice.saveAcademicYear(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_academicyear;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;
                    var keyid = dataResult.keyid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid == "1") {
                            if (that.iscurrent) {
                                sessionStorage.removeItem("_ayid_");
                                sessionStorage.setItem("_ayid_", keyid.toString());

                                that._router.navigateByUrl("/reload", { skipLocationChange: true }).then(() => {
                                    that._router.navigate(['/master/academicyear/add']);
                                })
                            }

                            that.resetAcademicYearFields();
                        }
                        else {
                            sessionStorage.removeItem("_ayid_");
                            sessionStorage.setItem("_ayid_", keyid.toString());

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

    getAcademicYear() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.ayid = params['id'];

                that._acdmcservice.getAcademicYear({
                    "flag": "edit",
                    "ayid": that.ayid,
                    "wsautoid": that._enttdetails.wsautoid
                }).subscribe(data => {
                    try {
                        that.ayid = data.data[0].ayid;
                        that.ayname = data.data[0].ayname;
                        that.frmdt = data.data[0].frmdt;
                        that.todt = data.data[0].todt;
                        that.remark = data.data[0].remark;
                        that.iscurrent = data.data[0].iscurrent;
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
                that.resetAcademicYearFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        var that = this;

        that._router.navigateByUrl("/reload", { skipLocationChange: true }).then(() => {
            that._router.navigate(['/master/academicyear']);
        })
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}