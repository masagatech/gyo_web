import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ChapterService } from '@services/master';

declare var google: any;

@Component({
    templateUrl: 'addchptr.comp.html'
})

export class AddChapterComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    classDT: any = [];
    classid: number = 0;

    subjectDT: any = [];
    subid: number = 0;

    chptrid: number = 0;
    chptrname: string = "";
    chptrdesc: string = "";

    private subscribeParameters: any;

    constructor(private _chptrservice: ChapterService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillClassDropDown();
        this.fillSubjectDropDown();
    }

    public ngOnInit() {
        this.getChapterDetails();

        setTimeout(function () {
            $(".grpname").focus();
        }, 200);
    }

    // Clear Fields

    resetChapterFields() {
        var that = this;

        that.chptrid = 0;
        that.chptrname = "";
        that.chptrdesc = "";
    }

    // Fill Class Drop Down

    fillClassDropDown() {
        var that = this;
        commonfun.loader();

        that._chptrservice.getChapterDetails({
            "flag": "classddl", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.classDT = data.data;
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

    // Fill Subject Drop Down

    fillSubjectDropDown() {
        var that = this;
        commonfun.loader();

        that._chptrservice.getChapterDetails({
            "flag": "subjectddl", "classid": that.classid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.subjectDT = data.data;
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

    // Save Chapter

    saveChapterInfo() {
        var that = this;

        if (that.classid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Class");
            $(".classid").focus();
        }
        else if (that.subid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Subject");
            $(".subid").focus();
        }
        else if (that.chptrname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Chapter Name");
            $(".chptrname").focus();
        }
        else {
            commonfun.loader();

            var saventf = {
                "chptrid": that.chptrid,
                "chptrname": that.chptrname,
                "chptrdesc": that.chptrdesc,
                "subid": that.subid,
                "classid": that.classid,
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid
            }

            this._chptrservice.saveChapterInfo(saventf).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_chapterinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetChapterFields();
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

    // Get Chapter

    getChapterDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.chptrid = params['id'];

                that._chptrservice.getChapterDetails({
                    "flag": "edit", "chptrid": that.chptrid, "wsautoid": that._enttdetails.wsautoid
                }).subscribe(data => {
                    try {
                        var viewntf = data.data;

                        that.chptrid = viewntf[0].chptrid;
                        that.chptrname = viewntf[0].chptrname;
                        that.chptrdesc = viewntf[0].chptrdesc;
                        that.classid = data.data[0].classid;
                        that.fillSubjectDropDown();
                        that.subid = data.data[0].subid;
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
                that.resetChapterFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/chapter']);
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}
