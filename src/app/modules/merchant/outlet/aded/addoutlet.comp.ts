import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { OutletService } from '@services/merchant';
import { LoginUserModel } from '@models';
import { Globals } from '../../../../_const/globals';

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

    mrchtDT: any = [];
    mrchtid: number = 0;
    mrchtnm: string = "";

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _outletervice: OutletService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
    }

    public ngOnInit() {
        var that = this;
        this.getOutletDetails();
    }

    // Auto Completed Merchant

    getMerchantData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "mrcht",
            "uid": this.loginUser.uid,
            "typ": this.loginUser.utype,
            "search": query
        }).then((data) => {
            this.mrchtDT = data;
        });
    }

    // Selected Owners

    selectMerchantData(event) {
        this.mrchtid = event.value;
        this.mrchtnm = event.label;
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

        if (that.mrchtid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Merchant Name");
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
                "mrchtid": that.mrchtid,
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
                        that.mrchtid = data.data[0].mrchtid;
                        that.mrchtnm = data.data[0].mrchtnm;
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