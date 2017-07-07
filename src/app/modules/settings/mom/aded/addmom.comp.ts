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

    title: any;
    validSuccess: Boolean = true;

    momid: number = 0;
    groupdt: any = [];
    group: string = "";
    key: string = "";
    val: string = "";

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _loginservice: LoginService,
        private _commonservice: CommonService, private _message: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this.getMOMGroup();
    }

    ngOnInit() {
        this.subscribeParameters = this._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                this.momid = params['id'];
                this.getMOMByID(this.momid);

                $('#group').prop('disabled', true);
                $('#key').prop('disabled', true);
                $('#val').prop('disabled', true);
            }
            else {
                setTimeout(function () {
                    $("#Group").focus();
                }, 0);

                $('#group').prop('disabled', false);
                $('#key').prop('disabled', false);
                $('#val').prop('disabled', false);
            }
        });
    }

    getMOMGroup() {
        var that = this;

        that._commonservice.getMOM({ "flag": "group" }).subscribe(data => {
            that.groupdt = data.data;
        }, err => {
            that._message.Show(messageType.error, 'Error', err);
        }, () => {
            // console.log("Complete");
        })
    }

    isValidateFields() {
        if (this.group === "") {
            this._message.Show(messageType.error, 'Error', "Please Select Group");
            $("#group").focus();
            return false;
        }
        if (this.key === "") {
            this._message.Show(messageType.error, 'Error', "Please Enter Key");
            $("#key").focus();
            return false;
        }
        if (this.val === "") {
            this._message.Show(messageType.error, 'Error', "Please Enter Value");
            $("#val").focus();
            return false;
        }

        return true;
    }

    saveMOMDetails() {
        var that = this;
        that.validSuccess = that.isValidateFields()

        var saveMOM = {
            "id": that.momid,
            "group": that.group,
            "key": that.key,
            "val": that.val,
            "uidcode": that.loginUser.login
        }

        if (that.validSuccess) {
            that._commonservice.saveMOM(saveMOM).subscribe(data => {
                try {
                    var dataResult = data.data;

                    if (dataResult[0].funsave_mom.doc == "1") {
                        that._message.Show(messageType.success, 'Confirmed', dataResult[0].funsave_mom.msg.toString());
                        that._router.navigate(['/setting/masterofmaster']);
                    }
                    else if (dataResult[0].funsave_mom.doc == "-1") {
                        that._message.Show(messageType.error, 'Error', dataResult[0].funsave_mom.msg.toString());
                    }
                    else {
                        that._message.Show(messageType.error, 'Error', dataResult[0].funsave_mom.msg.toString());
                    }
                }
                catch (e) {
                    that._message.Show(messageType.error, 'Error', e.message);
                }
            }, err => {
                that._message.Show(messageType.error, 'Error', err);
            }, () => {
                // console.log("Complete");
            });
        }
    }

    // get mom by id

    getMOMByID(pmomid: number) {
        this._commonservice.getMOM({ "flag": "id", "id": pmomid }).subscribe(data => {
            var dataresult = data.data;

            this.momid = dataresult[0].id;
            this.group = dataresult[0].group;
            this.key = dataresult[0].key;
            this.val = dataresult[0].val;
        }, err => {
            this._message.Show(messageType.error, 'Error', err);
        }, () => {
            // console.log("Complete");
        })
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}