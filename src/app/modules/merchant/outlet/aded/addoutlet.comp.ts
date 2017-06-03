import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService } from '@services';
import { OutletService, CommonService } from '@services/merchant';
import { LoginUserModel } from '@models';
import { Globals } from '../../../../_const/globals';

declare var google: any;
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

    merchantDT: any = [];
    mrchtid: number = 0;
    mrchtnm: string = "";

    hotspotDT: any = [];
    hsid: number = 0;
    hsname: string = "";

    stateDT: any = [];
    cityDT: any = [];
    areaDT: any = [];

    pmob: string = "";
    smob: string = "";
    pemail: string = "";
    semail: string = "";
    address: string = "";
    lat: string = "";
    lng: string = "";
    country: string = "India";
    state: number = 0;
    city: number = 0;
    area: number = 0;
    pincode: number = 0;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _outletservice: OutletService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();

        this.fillStateDropDown();
        this.fillCityDropDown();
        this.fillAreaDropDown();
    }

    public ngOnInit() {
        var that = this;
        this.getOutletDetails();
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

    // Selected Merchant

    selectMerchantData(event) {
        this.mrchtid = event.value;
        this.mrchtnm = event.label;
    }

    // Auto Completed Hotspot

    getAutoHotspot(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "hotspot",
            "uid": this.loginUser.uid,
            "typ": this.loginUser.utype,
            "search": query
        }).subscribe(data => {
            this.hotspotDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Hotspot

    selectAutoHotspot(event) {
        this.hsid = event.value;
        this.hsname = event.label;
    }

    // Clear Fields

    resetOutletFields() {
        var that = this;

        that.mrchtid = 0;
        that.mrchtnm = "";
        that.hsid = 0;
        that.hsname = "";
        that.pmob = "";
        that.smob = "";
        that.pemail = "";
        that.semail = "";
        that.address = "";
        that.lat = "0.00";
        that.lng = "0.00";
        that.country = "India";
        that.state = 0;
        that.city = 0;
        that.area = 0;
        that.pincode = 0;
    }

    // Get State DropDown

    fillStateDropDown() {
        var that = this;
        commonfun.loader();

        that._autoservice.getDropDownData({ "flag": "state" }).subscribe(data => {
            try {
                that.stateDT = data.data;
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

    // Get City DropDown

    fillCityDropDown() {
        var that = this;
        commonfun.loader();

        that.cityDT = [];
        that.areaDT = [];

        that.city = 0;
        that.area = 0;

        that._autoservice.getDropDownData({ "flag": "city", "sid": that.state }).subscribe(data => {
            try {
                that.cityDT = data.data;
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

    // Get Area DropDown

    fillAreaDropDown() {
        var that = this;
        commonfun.loader();

        that.areaDT = [];

        that.area = 0;

        that._autoservice.getDropDownData({ "flag": "area", "ctid": that.city, "sid": that.state }).subscribe(data => {
            try {
                that.areaDT = data.data;
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

    // Save Data

    saveOutletInfo() {
        var that = this;

        if (that.mrchtid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Merchant Name");
            $(".mrchtnm input").focus();
        }
        else if (that.hsid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Hotspot");
            $(".hsname input").focus();
        }
        else if (that.olnm == "") {
            that._msg.Show(messageType.error, "Error", "Enter Outlet Name");
            $(".olnm").focus();
        }
        else if (that.pmob == "") {
            that._msg.Show(messageType.error, "Error", "Enter Primary Mobile");
            $(".pmob").focus();
        }
        else if (that.pemail == "") {
            that._msg.Show(messageType.error, "Error", "Enter Primary Email");
            $(".pemail").focus();
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
        else if (that.state === 0) {
            that._msg.Show(messageType.error, "Error", "Enter State");
            $(".state").focus();
        }
        else if (that.city === 0) {
            that._msg.Show(messageType.error, "Error", "Enter City");
            $(".city").focus();
        }
        else if (that.area === 0) {
            that._msg.Show(messageType.error, "Error", "Enter Area");
            $(".area").focus();
        }
        else if (that.pincode === 0) {
            that._msg.Show(messageType.error, "Error", "Enter Pin Code");
            $(".pincode").focus();
        }
        else {
            commonfun.loader();

            var saveoutlet = {
                "olid": that.olid,
                "olnm": that.olnm,
                "mrchtid": that.mrchtid,
                "hsid": that.hsid,
                "pmob": that.pmob,
                "smob": that.smob,
                "pemail": that.pemail,
                "semail": that.semail,
                "address": that.address,
                "geoloc": that.lat + "," + that.lng,
                "country": that.country,
                "state": that.state,
                "city": that.city,
                "area": that.area,
                "pincode": that.pincode,
                "cuid": that.loginUser.ucode
            }

            that._outletservice.saveOutletInfo(saveoutlet).subscribe(data => {
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

                that._outletservice.getOutletDetails({ "flag": "edit", "id": that.olid }).subscribe(data => {
                    try {
                        that.olid = data.data[0].olid;
                        that.olnm = data.data[0].olnm;
                        that.mrchtid = data.data[0].mrchtid;
                        that.mrchtnm = data.data[0].mrchtnm;
                        that.hsid = data.data[0].hsid;
                        that.hsname = data.data[0].hsname;
                        that.pmob = data.data[0].mobileno1;
                        that.smob = data.data[0].mobileno2;
                        that.pemail = data.data[0].email1;
                        that.semail = data.data[0].email2;
                        that.address = data.data[0].address;
                        that.lat = data.data[0].lat;
                        that.lng = data.data[0].lng;
                        that.country = data.data[0].country;
                        that.state = data.data[0].state;
                        that.fillCityDropDown();
                        that.city = data.data[0].city;
                        that.fillAreaDropDown();
                        that.area = data.data[0].area;
                        that.pincode = data.data[0].pincode;
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