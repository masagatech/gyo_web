import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services'
import { OrderService,RiderService } from '@services/merchant'
import { LoginUserModel } from '@models'

declare var $: any;

@Component({
    templateUrl: 'view.comp.html',
    providers: [CommonService, MenuService, RiderService]
})

export class ViewComponent implements OnInit, OnDestroy {
    selectedOrderType: string = "0";
    ordtype: SelectItem[];

    orderDT: any = [];
    loginUser: LoginUserModel;

    actaddrights: string = "";
    acteditrights: string = "";
    actviewrights: string = "";

    status: string = "";
    dashCount: any = { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
    refreshCounter: any = 0;
    orddetdash: any = [];
    riders :any = [];
    counter:number = 0;
    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _ordservice: OrderService,
        private _riders: RiderService
        ) {
        this.loginUser = this._loginservice.getUser();
        this.status = "pending";
        this.getOrderType();
        this.getOrderDetails();


    }

    public ngOnInit() {
        this.checkTime();
        setTimeout(function () {
            commonfun.navistyle();
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 0);
    }

    public viewOrderDataRights() {
        var that = this;
        var addRights = [];
        var editRights = [];
        var viewRights = [];

        that._menuservice.getMenuDetails({
            "flag": "actrights", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "mcode": "ord", "utype": that.loginUser.utype
        }).subscribe(data => {
            addRights = data.data.filter(a => a.mrights === "add");
            editRights = data.data.filter(a => a.mrights === "edit");
            viewRights = data.data.filter(a => a.mrights === "view");

            that.actaddrights = addRights.length !== 0 ? addRights[0].mrights : "";
            that.acteditrights = editRights.length !== 0 ? editRights[0].mrights : "";
            that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";

            //that.getOrderDetails();

        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    getOrderType() {
        this.ordtype = [];
        this.ordtype.push({ label: 'Pending', value: 'pending' });
        this.ordtype.push({ label: 'Accepted', value: 'accepted' });
    }

    getOrderDetails() {
        var that = this;

        // if (that.actviewrights === "view") {
        //commonfun.loader();

        that._ordservice.getOrderdash({
            "flag": "dashboard", "status": that.selectedOrderType
        }).subscribe(data => {
            try {

                that.orderDT = data.data[0];
                var counts = data.data[1];
                that.dashCount = { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
                for (var i = 0; i <= counts.length - 1; i++) {
                    that.dashCount[counts[i].status] = counts[i].count;
                }

            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            //commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            //commonfun.loaderhide();
        }, () => {

        })
        // }
    }

    getSubOrderDetails(orderid: any) {
        var that = this;
        this.orddetdash = [];
        // if (that.actviewrights === "view") {
        commonfun.loader('#rightsidebar');

        that._ordservice.getOrderDetailsDash({
            "flag": "orderdet", "ordid": orderid
        }).subscribe(data => {
            try {

                that.orddetdash = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide('#rightsidebar');
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide('#rightsidebar');
        }, () => {

        })
        // }
    }

    getAvailRiders(hsid: any) {
        var that = this;
        this.orddetdash = [];
        // if (that.actviewrights === "view") {
        commonfun.loader('#riders');

        that._riders.getAvailable({
            "flag": "avail", "hsid": hsid
        }).subscribe(data => {
            try {

                that.riders = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide('#riders');
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide('#riders');
        }, () => {

        })
        // }
    }

    public addOrderForm() {
        this._router.navigate(['/murchant/createorder']);
    }

    public editOrderForm(row) {
        this._router.navigate(['/murchant/editorder', row.autoid]);
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }

    checkTime() {
        var refreshSecs = 10;
        
        var that = this;
        setInterval(function () {
            if (that.counter == refreshSecs) {
                that.counter = 0;
                that.getOrderDetails();
            }
            that.counter++;
            that.refreshCounter = that.counter;
        }, 1000);

        // setInterval(function(){
        //     for(var i = 0; i <= that.orderDT.length -1; i++){
        //         that.orderDT[i].timediff = 20    
        //     }
        // },2000);
    }

    closePanel() {
        $.AdminBSB.rightSideBar.Close();
    }

    openPanel(e, ordid: any) {
        this.getSubOrderDetails(ordid);
        $.AdminBSB.rightSideBar.Open();
        e.preventDefault();
    }

    changeStatus(status: any) {
        this.selectedOrderType = status;
        this.counter = 0;
        this.getOrderDetails();
    }

    modalShow(hsid:any){
        this.getAvailRiders(hsid);
        $("#largeModal").modal('show');
    }

}
