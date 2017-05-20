import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../../_services/order/ord-service';
import { CommonService } from '../../../../_services/common/common-service' /* add reference for view file type */
import { MessageService, messageType } from '../../../../_services/messages/message-service';
import { Globals } from '../../../_const/globals';

declare var google: any;

@Component({
    templateUrl: 'credord.comp.html',
    providers: [OrderService, CommonService]
})

export class CreateOrderComponent implements OnInit {
    ordid: number = 0;
    olid: number = 0;
    deldate: any = "";
    picktime: any = "";

    ordno: string = "";
    custname: string = "";
    custmobile: string = "";
    custaddr: string = "";
    lat: string = "";
    lng: string = "";
    deltime: any = "";
    pickdate: any = "";
    amtcollect: any = "";

    mode: string = "";
    isactive: boolean = true;

    outlateDT: any = [];
    riderDT: any = [];

    orderDetailsDT: any = [];

    private subscribeParameters: any;

    constructor(private _ordservice: OrderService, private _routeParams: ActivatedRoute, private _router: Router,
        private _msg: MessageService, private _commonservice: CommonService) {
        this.fillDropDownList();
        // this.getLatAndLong();
    }

    public ngOnInit() {
        this.getOrderDetails();
    }

    // get lat and long by address form google map

    getLatAndLong() {
        var that = this;
        commonfun.loader();

        var geocoder = new google.maps.Geocoder();
        //var address = "Chakkinaka, Kalyan (E)";

        geocoder.geocode({ 'address': that.custaddr }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                setTimeout(function () {
                    that.lat = results[0].geometry.location.lat();
                    that.lng = results[0].geometry.location.lng();

                    console.log(that.lat + ", " + that.lng);
                    commonfun.loaderhide();
                }, 100);
            }

        });
    }

    // Fill Owner Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._ordservice.getOrderDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.outlateDT = data.data; //.filter(a => a.typ === "outlate");
                //that.riderDT = data.data.filter(a => a.typ === "rider");
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide();
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
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
            console.log(err);
        }, () => {
            // console.log("Complete");
        });
    }

    // Clear Fields

    resetordFields() {
        $("input").val("");
        $("textarea").val("");
        $("select").val("");
    }

    // Add Order getOrderDetails

    addOrderDetails() {
        var that = this;

        that.orderDetailsDT.push({
            "orddid": "0",
            "ordno": that.ordno,
            "custname": that.custname,
            "custmobile": that.custmobile,
            "custaddr": that.custaddr,
            "lat": that.lat,
            "lng": that.lng,
            "addrloc": that.lat + "," + that.lng,
            "amtcollect": that.amtcollect,
            "deltime": "03:00 AM",
            "pickdate": "15-May-2017"
        })

        that.ordno = "";
        that.custname = "";
        that.custmobile = "";
        that.custaddr = "";
        that.lat = "";
        that.lng = "";
        that.amtcollect = "";
        that.deltime = "";
        that.pickdate = "";
    }

    // Save Data

    saveOrderInfo() {
        var that = this;
        commonfun.loader();

        var saveord = {
            "ordid": that.ordid,
            "olid": that.olid,
            "deldate": that.deldate,
            "picktime": that.picktime,
            "orddtls": that.orderDetailsDT,
            "cuid": "vivek",
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
                        that.resetordFields();
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
                        that.pickdate = _orddata[0].pickdate;
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
                that.resetordFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/ord']);
    }
}
