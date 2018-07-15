import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { SubjectService } from '@services/master';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addsub.comp.html'
})

export class AddSubjectComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    subtypeDT: any = [];

    subid: number = 0;
    subname: string = "";
    subtype: string = "";
    subdesc: string = "";

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _subservice: SubjectService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillSubTypeDropDown();
    }

    public ngOnInit() {
        this.getSubject();
    }

    // Fill Subject Type DropDown

    fillSubTypeDropDown() {
        var that = this;
        commonfun.loader();

        that._subservice.getSubjectDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.subtypeDT = data.data;
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

    resetSubjectFields() {
        this.subid = 0;
        this.subname = "";
        this.subdesc = "";
    }

    // Validation For Save

    isValidationForSave() {
        var that = this;

        if (that.subtype == "") {
            that._msg.Show(messageType.error, "Error", "Select Subject Type");
            $(".subtype").focus();
            return false;
        }
        else if (that.subname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Title");
            $(".subname").focus();
            return false;
        }

        return true;
    }

    // Save Data

    saveSubject() {
        var that = this;
        var isvalid = that.isValidationForSave();

        if (isvalid) {
            commonfun.loader();

            var savelvpsngr = {
                "subid": that.subid,
                "subtype": that.subtype,
                "subname": that.subname,
                "subdesc": that.subdesc,
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid
            }

            that._subservice.saveSubjectInfo(savelvpsngr).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_subjectinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid == "1") {
                            that.resetSubjectFields();
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

    getSubject() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.subid = params['id'];

                that._subservice.getSubjectDetails({
                    "flag": "edit",
                    "subid": that.subid
                }).subscribe(data => {
                    try {
                        that.subid = data.data[0].subid;
                        that.subtype = data.data[0].subtype;
                        that.subname = data.data[0].subname;
                        that.subdesc = data.data[0].subdesc;
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
                that.resetSubjectFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/subject']);
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}