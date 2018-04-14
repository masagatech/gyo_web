import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';

declare var $: any;

@Component({
    templateUrl: 'addmom.comp.html',
    providers: [CommonService]
})

export class AddMOMComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    title: any;
    validSuccess: Boolean = true;

    momid: number = 0;
    groupdt: any = [];
    grpcd: string = "";
    key: string = "";
    val: string = "";
    typ: string = "";
    isactive: boolean = true;

    headertitle: string = "";
    mtype: string = "";
    isdynmenu: boolean = false;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _loginservice: LoginService,
        private _commonservice: CommonService, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();
        this.getMOMGroup();
    }

    ngOnInit() {
        this.subscribeParameters = this._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                this.momid = params['id'];
                this.getMOMByID(this.momid);

                $('#group').prop('disabled', true);
                $('#key').prop('disabled', true);
                $('#val').prop('disabled', false);
            }
            else {
                setTimeout(function () {
                    $("#Group").focus();
                }, 0);

                $('#group').prop('disabled', true);
                $('#key').prop('disabled', false);
                $('#val').prop('disabled', false);
            }
        });
    }

    resetMOMFields() {
        this.momid = 0;
        this.key = "";
        this.val = "";
    }

    getMOMGroup() {
        var that = this;

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['grpcd'] !== undefined) {
                that.grpcd = params['grpcd'];

                that._commonservice.getMOM({ "flag": "group", "grpcd": that.grpcd }).subscribe(data => {
                    try {
                        if (data.data.length > 0) {
                            that.headertitle = data.data[0].grpnm;
                            that.mtype = data.data[0].typ;
                            that.isdynmenu = data.data[0].isdynmenu;
                        }
                        else {
                            that.headertitle = "";
                            that.mtype = "";
                            that.isdynmenu = false;
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
        });

        that._commonservice.getMOM({ "flag": "group", "grpcd": "" }).subscribe(data => {
            that.groupdt = data.data;
        }, err => {
            that._msg.Show(messageType.error, 'Error', err);
        }, () => {
            // console.log("Complete");
        })
    }

    isValidateFields() {
        if (this.grpcd === "") {
            this._msg.Show(messageType.error, 'Error', "Please Select Group");
            $("#grpcd").focus();
            return false;
        }
        if (this.key === "") {
            this._msg.Show(messageType.error, 'Error', "Please Enter Key");
            $("#key").focus();
            return false;
        }
        if (this.val === "") {
            this._msg.Show(messageType.error, 'Error', "Please Enter Value");
            $("#val").focus();
            return false;
        }

        return true;
    }

    saveMOMInfo() {
        var that = this;
        that.validSuccess = that.isValidateFields()

        var saveMOM = {
            "autoid": that.momid,
            "group": that.grpcd,
            "key": that.key,
            "val": that.val,
            "typ": that.mtype,
            "enttid": that.mtype == "enttwise" ? that._enttdetails.enttid : 0,
            "wsautoid": that.mtype == "wswise" ? that._enttdetails.wsautoid : that.mtype == "enttwise" ? that._enttdetails.wsautoid : 0,
            "uidcode": that.loginUser.login
        }

        if (that.validSuccess) {
            that._commonservice.saveMOM(saveMOM).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_mom;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid !== "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetMOMFields();
                        }
                        else {
                            that.backViewData();
                        }
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", "Error 101 : " + msg);
                    }
                }
                catch (e) {
                    that._msg.Show(messageType.error, 'Error', e.message);
                }
            }, err => {
                that._msg.Show(messageType.error, 'Error', err);
            }, () => {
                // console.log("Complete");
            });
        }
    }

    // Get MOM Details By ID

    getMOMByID(pmomid: number) {
        var that = this;

        that._commonservice.getMOM({ "flag": "id", "autoid": pmomid }).subscribe(data => {
            var dataresult = data.data;

            that.momid = dataresult[0].autoid;
            that.grpcd = dataresult[0].group;
            that.key = dataresult[0].key;
            that.val = dataresult[0].val;
            that.typ = dataresult[0].typ;
        
            if (that.typ == "global") {
                $('#val').prop('disabled', true);
            }
            else {
                $('#val').prop('disabled', false);
            }
        }, err => {
            this._msg.Show(messageType.error, 'Error', err);
        }, () => {
            // console.log("Complete");
        })
    }

    // Back For View Data

    backViewData() {
        if (this.mtype == "all") {
            this._router.navigate(['/admin/master', this.grpcd]);
        }
        else {
            this._router.navigate(['/master/other', this.grpcd]);
        }
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}