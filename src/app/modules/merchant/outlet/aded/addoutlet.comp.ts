import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { OutletService } from '@services/merchant';
import { LoginUserModel } from '@models';
import { Globals } from '../../../../_const/globals';
import { LazyLoadEvent } from 'primeng/primeng';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addoutlet.comp.html',
    providers: [OutletService, CommonService]
})

export class AddOutletComponent implements OnInit {
    loginUser: LoginUserModel;

    olid: number = 0;
    olnm: string = "";

    entityDT: any = [];
    enttid: number = 0;
    enttnm: string = "";

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _outletervice: OutletService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
    }

    public ngOnInit() {
        var that = this;
        this.getOutletDetails();
    }

    // Auto Completed Entity

    getEntityData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "mrchtentt",
            "uid": this.loginUser.uid,
            "typ": this.loginUser.utype,
            "search": query
        }).then((data) => {
            this.entityDT = data;
        });
    }

    // Selected Owners

    selectEntityData(event) {
        this.enttid = event.value;
        this.enttnm = event.label;
    }

    // Clear Fields

    resetOutletFields() {
        $("input").val("");
        $("textarea").val("");
        $("select").val("");
    }

    // Save Data

    saveOutletInfo() {
        var that = this;

        if (that.enttid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Entity Name");
            $(".enttnm input").focus();
        }
        else if (that.olnm == "") {
            that._msg.Show(messageType.error, "Error", "Enter Outlet Name");
            $(".olnm").focus();
        }
        else {
            commonfun.loader();

            var saveoutlet = {
                "olid": that.olid,
                "olnm": that.olnm,
                "enttid": that.enttid,
                "uid": that.loginUser.ucode
            }

            that._outletervice.saveOutletInfo(saveoutlet).subscribe(data => {
                try {
                    var dataResult = data.data;
                    var msg = dataResult[0].funsave_outletinfo.msg;
                    var msgid = dataResult[0].funsave_outletinfo.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid == "1") {
                            that.resetOutletFields();
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
                // console.log("Complete");
            });
        }
    }

    // Get outlet Data

    getOutletDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.olid = params['id'];

                that._outletervice.getOutletDetails({ "flag": "edit", "id": that.olid }).subscribe(data => {
                    try {
                        that.olid = data.data[0].olid;
                        that.olnm = data.data[0].olnm;
                        that.enttid = data.data[0].enttid;
                        that.enttnm = data.data[0].enttnm;
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
                that.resetOutletFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/merchant/outlet']);
    }
}