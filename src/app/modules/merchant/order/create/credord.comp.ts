import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType } from '../../../../_services/messages/message-service';
import { LoginService } from '../../../../_services/login/login-service';
import { LoginUserModel } from '../../../../_model/user_model';
import { CommonService } from '../../../../_services/common/common-service' /* add reference for view file type */
import { OrderService } from '../../../../_services/merchant/order/ord-service';
import { Globals } from '../../../../_const/globals';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import { GMap } from 'primeng/primeng';

declare var google: any;

@Component({
    templateUrl: 'credord.comp.html',
    providers: [OrderService, CommonService]
})

export class CreateOrderComponent implements OnInit {
    loginUser: LoginUserModel;

    ordid: number = 0;
    olid: number = 0;
    deldate: any = "";
    picktime: any = "";

    ordno: string = "";
    custname: string = "";
    custmobile: string = "";
    custaddr: string = "";
    lat: string = "0.00";
    lng: string = "0.00";
    deltime: any = "";
    amtcollect: any = "0";
    remark: string = "";

    mode: string = "";
    isactive: boolean = true;

    outletDT: any = [];
    riderDT: any = [];

    orderDetailsDT: any = [];

    selectedPosition: any = [];

    options: any = { center: { lat: "", lng: "" }, zoom: 12 };
    overlays: any = [];

    @ViewChild('gmap')
    gmap: GMap;

    markerTitle: string = "";
    private mapdata = new Subject<any>();
    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _ordservice: OrderService) {
        this.fillDropDownList();
    }

    public ngOnInit() {
        this.getOrderDetails();
    }

    // get lat and long by address form google map

    getLatAndLong() {
        var that = this;
        commonfun.loader();

        var geocoder = new google.maps.Geocoder();
        // var address = "Chakkinaka, Kalyan (E)";

        geocoder.geocode({ 'address': that.custaddr }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                that.lat = results[0].geometry.location.lat();
                that.lng = results[0].geometry.location.lng();

                that.options.center.lat = that.lat;
                that.options.center.lng = that.lng;

                commonfun.loaderhide();
            }
        });
    }

    handleMapClick(event) {
        this.selectedPosition = event.latLng;

        this.lat = this.selectedPosition.lat();
        this.lng = this.selectedPosition.lng();
    }

    // Fill Owner Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._ordservice.getOrderDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.outletDT = data.data;
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

    // Active / Deactive Data

    active_deactiveordInfo() {
        var that = this;

        var act_deactord = {
            "autoid": that.ordid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        this._ordservice.saveOrderInfo(act_deactord).subscribe(data => {
            try {
                var dataResult = data.data;

                if (dataResult[0].funsave_ordinfo.msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", dataResult[0].funsave_ordinfo.msg);
                    that.getOrderDetails();
                }
                else {
                    that._msg.Show(messageType.error, "Error", dataResult[0].funsave_ordinfo.msg);
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {
            // console.log("Complete");
        });
    }

    // Add Order getOrderDetails

    addOrderDetails() {
        var that = this;

        if (that.ordno == "") {
            that._msg.Show(messageType.error, "Error", "Enter Order No");
            $(".ordno").focus();
        }
        else if (that.custmobile == "") {
            that._msg.Show(messageType.error, "Error", "Enter Mobile No");
            $(".custmobile").focus();
        }
        else if (that.custname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Customer Name");
            $(".custname").focus();
        }
        else if (that.custaddr == "") {
            that._msg.Show(messageType.error, "Error", "Enter Address");
            $(".custaddr").focus();
        }
        else if (that.deltime == "") {
            that._msg.Show(messageType.error, "Error", "Enter Delivery Time");
            $(".deltime").focus();
        }
        else {
            that.orderDetailsDT.push({
                "orddid": "0",
                "ordno": that.ordno,
                "custmobile": that.custmobile,
                "custname": that.custname,
                "custaddr": that.custaddr,
                "lat": that.lat,
                "lng": that.lng,
                "addrloc": that.lat + "," + that.lng,
                "amtcollect": that.amtcollect,
                "deltime": that.deltime,
                "remark": that.remark
            })

            that.ordno = "";
            that.custname = "";
            that.custmobile = "";
            that.custaddr = "";
            that.lat = "";
            that.lng = "";
            that.amtcollect = "";
            that.deltime = "";
        }
    }

    // Save Data

    saveOrderInfo() {
        var that = this;

        if (that.olid === 0) {
            that._msg.Show(messageType.error, "Error", "Enter Outlet");
            $(".olid").focus();
        }
        else if (that.deldate == "") {
            that._msg.Show(messageType.error, "Error", "Enter Delivery Date");
            $(".deldate").focus();
        }
        else if (that.picktime == "") {
            that._msg.Show(messageType.error, "Error", "Enter Pick Up Time");
            $(".deldate").focus();
        }
        else if (that.orderDetailsDT.length === 0) {
            that._msg.Show(messageType.error, "Error", "Fill atleast 1 Order Details");
        }
        else {
            commonfun.loader();

            var saveord = {
                "ordid": that.ordid,
                "olid": that.olid,
                "deldate": that.deldate,
                "picktime": that.picktime,
                "orddtls": that.orderDetailsDT,
                "cuid": that.loginUser.ucode,
                "isactive": that.isactive,
                "mode": ""
            }

            this._ordservice.saveOrderInfo(saveord).subscribe(data => {
                try {
                    var dataResult = data.data;
                    var msg = dataResult[0].funsave_orderinfo.msg;
                    var msgid = dataResult[0].funsave_orderinfo.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetOrderFields();
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

    // Get ord Data

    getOrderDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.ordid = params['id'];

                that._ordservice.getOrderDetails({ "flag": "edit", "id": that.ordid }).subscribe(data => {
                    try {
                        var _orddata = data.data[0]._orddata;
                        var _attachdocs = data.data[0]._attachdocs;

                        that.ordid = _orddata[0].ordid;
                        that.ordno = _orddata[0].ordno;
                        that.deldate = _orddata[0].deldate;
                        that.deltime = _orddata[0].deltime;
                        that.picktime = _orddata[0].picktime;
                        that.amtcollect = _orddata[0].amtcollect;
                        that.isactive = _orddata[0].isactive;
                        that.mode = _orddata[0].mode;
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
                that.resetOrderFields();
                commonfun.loaderhide();
            }
        });
    }

    // Clear Fields

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    resetOrderFields() {
        var date = new Date();
        var currdate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        var currtime = new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: "numeric",
            minute: "numeric"
        });

        this.olid = 0;
        this.deldate = this.formatDate(currdate);
        this.picktime = currtime;
        this.ordno = "";
        this.custmobile = "";
        this.custname = "";
        this.custaddr = "";
        this.lat = "0.00";
        this.lng = "0.00";
        this.amtcollect = "0";
        this.deltime = currtime;
        this.remark = "";

        this.orderDetailsDT = [];
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/ord']);
    }
}
