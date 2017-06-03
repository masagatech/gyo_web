import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { HotspotService } from '@services/merchant';
import { LoginUserModel } from '@models';

declare var google: any;
declare var loader: any;
declare var adminloader: any;

@Component({
    templateUrl: 'addhtsp.comp.html',
    providers: [CommonService]
})

export class AddHotspotComponent implements OnInit {
    loginUser: LoginUserModel;

    htspid: number = 0;
    htspnm: string = "";
    address: string = "";
    lat: string = "";
    lng: string = "";
    country: string = "";
    state: string = "";
    city: string = "";
    area: string = "";
    pincode: string = "";
    status: number = 1;

    mode: string = "";
    isactive: boolean = true;

    private subscribeParameters: any;

    constructor(private _htspservice: HotspotService, private _routeParams: ActivatedRoute, private _loginservice: LoginService,
        private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
    }

    public ngOnInit() {
        this.getHotspotDetails();
    }

    // get lat and long by address form google map

    getLatAndLong() {
        var that = this;
        commonfun.loader();

        var geocoder = new google.maps.Geocoder();
        // var address = "Chakkinaka, Kalyan (E)";

        geocoder.geocode({ 'address': that.address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                that.lat = results[0].geometry.location.lat();
                that.lng = results[0].geometry.location.lng();

                commonfun.loaderhide();
            }
        });
    }

    // Clear Fields

    resetHotspotFields() {
        var that = this;

        that.htspid = 0
        that.htspnm = "";
        that.address = "";
        that.country = "";
        that.state = "";
        that.city = "";
        that.area = "";
        that.pincode = "";
        that.status = 1;
    }

    // Active / Deactive Data

    active_deactiveHotspotInfo() {
        var that = this;

        var act_deactHoliday = {
            "htspid": that.htspid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        that._htspservice.saveHotspotInfo(act_deactHoliday).subscribe(data => {
            try {
                var dataResult = data.data;
                var msg = dataResult[0].funsave_hotspotinfo.msg;
                var msgid = dataResult[0].funsave_hotspotinfo.msgid;

                if (msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", msg);
                    that.getHotspotDetails();
                }
                else {
                    that._msg.Show(messageType.error, "Error", msg);
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

    // Save Data

    saveHotspotInfo() {
        var that = this;
        var _week = null;
        var _weekday = "";

        if (that.htspnm === "") {
            that._msg.Show(messageType.error, "Error", "Enter Hotspot Name");
            $(".fname").focus();
        }
        else if (that.address === "") {
            that._msg.Show(messageType.error, "Error", "Enter Address");
            $(".address").focus();
        }
        else if (that.lat === "") {
            that._msg.Show(messageType.error, "Error", "Enter Latitude");
            $(".lat").focus();
        }
        else if (that.lng === "") {
            that._msg.Show(messageType.error, "Error", "Enter Longitude");
            $(".lng").focus();
        }
        else if (that.country === "") {
            that._msg.Show(messageType.error, "Error", "Enter Country");
            $(".country").focus();
        }
        else if (that.state === "") {
            that._msg.Show(messageType.error, "Error", "Enter State");
            $(".state").focus();
        }
        else if (that.city === "") {
            that._msg.Show(messageType.error, "Error", "Enter City");
            $(".city").focus();
        }
        else if (that.area === "") {
            that._msg.Show(messageType.error, "Error", "Enter Area");
            $(".area").focus();
        }
        else {
            commonfun.loader();

            var saveHotspot = {
                "htspid": that.htspid,
                "htspnm": that.htspnm,
                "geoloc": that.lat + "," + that.lng,
                "address": that.address,
                "country": that.country,
                "state": that.state,
                "city": that.city,
                "area": that.area,
                "pincode": that.pincode,
                "status": that.status,
                "cuid": that.loginUser.ucode,
                "mode": ""
            }

            that._htspservice.saveHotspotInfo(saveHotspot).subscribe(data => {
                try {
                    var dataResult = data.data;
                    var msg = dataResult[0].funsave_hotspotinfo.msg;
                    var msgid = dataResult[0].funsave_hotspotinfo.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetHotspotFields();
                        }
                        else {
                            that.backViewData();
                        }
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
                    }
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }

                commonfun.loaderhide();
            }, err => {
                console.log(err);
                that._msg.Show(messageType.error, "Error", err);

                commonfun.loaderhide();
            }, () => {
                // console.log("Complete");
            });
        }
    }

    // Get Hotspot Data

    getHotspotDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = this._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.htspid = params['id'];

                that._htspservice.getHotspotDetails({ "flag": "edit", "id": that.htspid }).subscribe(data => {
                    try {
                        that.htspid = data.data[0].htspid;
                        that.htspnm = data.data[0].htspnm;
                        that.lat = data.data[0].lat;
                        that.lng = data.data[0].lng;
                        that.address = data.data[0].address;
                        that.country = data.data[0].country;
                        that.state = data.data[0].state;
                        that.city = data.data[0].city;
                        that.area = data.data[0].area;
                        that.pincode = data.data[0].pincode;
                        that.status = data.data[0].status;
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
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/merchant/hotspot']);
    }
}
