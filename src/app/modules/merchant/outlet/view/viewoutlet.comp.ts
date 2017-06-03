import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService } from '@services';
import { OutletService, CommonService } from '@services/merchant';
import { Globals } from '@globals';
import { LoginUserModel } from '@models';

@Component({
    templateUrl: 'viewoutlet.comp.html',
    providers: [MenuService, OutletService, CommonService]
})

export class ViewOutletComponent implements OnInit {
    loginUser: LoginUserModel;

    mrchtroute: string = "";

    merchantDT: any = [];
    mrchtid: number = 0;
    mrchtnm: string = "";

    outletDT: any = [];

    actaddrights: string = "";
    acteditrights: string = "";
    actviewrights: string = "";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _outletservice: OutletService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this.viewOutletDataRights();
    }

    public ngOnInit() {
        var that = this;
        that.refreshButtons();
        //that.mrchtroute = Globals.mrchtroute;
    }

    // Auto Completed Merchant

    getMerchantData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "merchant",
            "uid": this.loginUser.uid,
            "typ": this.loginUser.utype,
            "search": query
        }).subscribe((data) => {
            this.merchantDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Owners

    selectMerchantData(event) {
        this.mrchtid = event.value;
        this.mrchtnm = event.label;

        this.getOutletGrid();
    }

    refreshButtons() {
        setTimeout(function () {
            commonfun.navistyle();
            commonfun.chevronstyle();
        }, 0);
    }

    public viewOutletDataRights() {
        var that = this;
        var addRights = [];
        var editRights = [];
        var viewRights = [];

        that._menuservice.getMenuDetails({
            "flag": "actrights", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "mcode": "ol", "utype": that.loginUser.utype
        }).subscribe(data => {
            addRights = data.data.filter(a => a.mrights === "add");
            editRights = data.data.filter(a => a.mrights === "edit");
            viewRights = data.data.filter(a => a.mrights === "view");

            that.actaddrights = addRights.length !== 0 ? addRights[0].mrights : "";
            that.acteditrights = editRights.length !== 0 ? editRights[0].mrights : "";
            that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    getOutletGrid() {
        var that = this;

        if (that.actviewrights === "view") {
            commonfun.loader();

            that._outletservice.getOutletDetails({ "flag": "all", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "mrchtid": that.mrchtid }).subscribe(data => {
                try {
                    if (data.data.length !== 0 && data.data[0].errmsgcode !== "norecords") {
                        that.outletDT = data.data;
                    }
                    else {
                        that.outletDT = [];
                    }
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }

                commonfun.loaderhide();
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
                commonfun.loaderhide();
            }, () => {

            })
        }
    }

    fetchEvents(eventData) {
        console.log("fetchEvents:", eventData.view, eventData.element);
    }

    public addOutletForm() {
        this._router.navigate(['/merchant/outlet/add']);
    }

    public editOutletGrid(row) {
        this._router.navigate(['/merchant/outlet/edit', row.olid]);
    }
}