import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { MerchantService, CommonService } from '@services/merchant';
import { LoginUserModel } from '@models';

declare var google: any;
declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addmrcht.comp.html',
    providers: [CommonService]
})

export class AddMerchantComponent implements OnInit {
    loginUser: LoginUserModel;

    stateDT: any = [];
    cityDT: any = [];
    areaDT: any = [];

    mrchtid: number = 0;
    mrchtnm: string = "";
    landlines: string = "";
    mobiles: string = "";
    emails: string = "";

    address: string = "";
    lat: string = "";
    lng: string = "";
    country: string = "India";
    state: number = 0;
    city: number = 0;
    area: number = 0;
    pincode: number = 0;

    cntctprsn: any = [];
    cpname: string = "";
    cpmobile: string = "";
    cpdesig: string = "";

    dlvrprty: string = "";

    iseod: string = "N";
    isschdlvr: string = "N";
    isagrmntsts: string = "N";

    isautoalloc: string = "N";
    allocfrmtime: string = "";
    alloctotime: string = "";

    isrdravl: string = "N";
    avlfrmtime: string = "";
    avltotime: string = "";

    isgetord: string = "N";
    ordfrmtime: string = "";
    ordtotime: string = "";

    mode: string = "";
    isactive: boolean = true;

    private subscribeParameters: any;

    constructor(private _mrchtservice: MerchantService, private _autoservice: CommonService, private _routeParams: ActivatedRoute,
        private _loginservice: LoginService, private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        
        this.fillStateDropDown();
        this.fillCityDropDown();
        this.fillAreaDropDown();
    }

    public ngOnInit() {
        $(".ownername input").focus();
        this.getMerchantDetails();
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

    // Clear Fields

    resetMerchantFields() {
        var that = this;

        that.mrchtid = 0;
        that.mrchtnm = "";
        that.landlines = "";
        that.mobiles = "";
        that.emails = "";
        that.address = "";
        that.country = "India";
        that.state = 0;
        that.city = 0;
        that.area = 0;
        that.pincode = 0;

        that.cntctprsn = 0;
        that.cpname = "";
        that.cpmobile = "";
        that.cpdesig = "";

        that.dlvrprty = "";
        that.iseod = "N";
        that.isschdlvr = "N";
        that.isagrmntsts = "N";

        that.isautoalloc = "N";
        that.allocfrmtime = "";
        that.alloctotime = "";

        that.isrdravl = "N";
        that.avlfrmtime = "";
        that.avltotime = "";

        that.isgetord = "N";
        that.ordfrmtime = "";
        that.ordtotime = "";
    }

    // Active / Deactive Data

    active_deactivemerchantInfo() {
        var that = this;

        var act_deactHoliday = {
            "mrchtid": that.mrchtid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        that._mrchtservice.saveMerchantInfo(act_deactHoliday).subscribe(data => {
            try {
                var dataResult = data.data;
                var msg = dataResult[0].funsave_merchantinfo.msg;
                var msgid = dataResult[0].funsave_merchantinfo.msgid;

                if (msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", msg);
                    that.getMerchantDetails();
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

    saveMerchantInfo() {
        var that = this;

        if (that.mrchtnm == "" || that.mrchtnm == undefined) {
            that._msg.Show(messageType.error, "Error", "Enter Merchant Name");
            $(".mrchtnm").focus();
        }
        else if (that.landlines == "" || that.landlines == undefined) {
            that._msg.Show(messageType.error, "Error", "Enter Landline Numbers");
            $(".landlines").focus();
        }
        else if (that.mobiles == "" || that.mobiles == undefined) {
            that._msg.Show(messageType.error, "Error", "Enter Mobile Numbers");
            $(".mobiles").focus();
        }
        else if (that.address == "" || that.address == undefined) {
            that._msg.Show(messageType.error, "Error", "Enter Address");
            $(".address").focus();
        }
        else if (that.lat == "" || that.lat == undefined) {
            that._msg.Show(messageType.error, "Error", "Enter Latitude");
            $(".lat").focus();
        }
        else if (that.lng == "" || that.lng == undefined) {
            that._msg.Show(messageType.error, "Error", "Select Longitude");
            $(".lng").focus();
        }
        else if (that.country == "" || that.country == undefined) {
            that._msg.Show(messageType.error, "Error", "Enter Country");
            $(".country").focus();
        }
        else if (that.state == 0 || that.state == undefined) {
            that._msg.Show(messageType.error, "Error", "Enter State");
            $(".state").focus();
        }
        else if (that.city == 0 || that.city == undefined) {
            that._msg.Show(messageType.error, "Error", "Enter City");
            $(".city").focus();
        }
        else if (that.area == 0 || that.area == undefined) {
            that._msg.Show(messageType.error, "Error", "Enter Area");
            $(".area").focus();
        }
        else if (that.pincode == 0 || that.pincode == undefined) {
            that._msg.Show(messageType.error, "Error", "Enter Pin Code");
            $(".pincode").focus();
        }
        else {
            commonfun.loader();

            var _cnctprsn = { "cpname": that.cpname, "cpmobile": that.cpmobile, "cpdesig": that.cpdesig }

            var savemerchant = {
                "mrchtid": that.mrchtid,
                "mrchtnm": that.mrchtnm,
                "landlines": that.landlines,
                "mobiles": that.mobiles,
                "emails": that.emails,
                "address": that.address,
                "lat": that.lat,
                "lng": that.lng,
                "country": that.country,
                "state": that.state,
                "city": that.city,
                "area": that.area,
                "pincode": that.pincode,
                "dlvrprty": that.dlvrprty,
                "iseod": that.iseod,
                "isschdlvr": that.isschdlvr,
                "isagrmntsts": that.isagrmntsts,
                "isautoalloc": that.isautoalloc,
                "allocfrmtime": that.allocfrmtime,
                "alloctotime": that.alloctotime,
                "isrdravl": that.isrdravl,
                "avlfrmtime": that.avlfrmtime,
                "avltotime": that.avltotime,
                "isgetord": that.isgetord,
                "ordfrmtime": that.ordfrmtime,
                "ordtotime": that.ordtotime,
                "cuid": that.loginUser.ucode,
                "mode": ""
            }

            that._mrchtservice.saveMerchantInfo(savemerchant).subscribe(data => {
                try {
                    var dataResult = data.data;
                    var msg = dataResult[0].funsave_merchantinfo.msg;
                    var msgid = dataResult[0].funsave_merchantinfo.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid == "1") {
                            that.resetMerchantFields();
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

    // Get merchant Data

    getMerchantDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = this._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.mrchtid = params['id'];

                that._mrchtservice.getMerchantDetails({ "flag": "edit", "id": that.mrchtid }).subscribe(data => {
                    try {
                        that.mrchtid = data.data[0].mrchtid;
                        that.mrchtnm = data.data[0].mrchtnm;
                        that.landlines = data.data[0].landlines;
                        that.mobiles = data.data[0].mobiles;
                        that.emails = data.data[0].emails;
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

                        if (data.data[0].cnctprsn !== undefined) {
                            that.cpname = data.data[0].cnctprsn.cpname;
                            that.cpmobile = data.data[0].cnctprsn.cpmobile;
                            that.cpdesig = data.data[0].cnctprsn.cpdesig;
                        }
                        else{
                            that.cpname = "";
                            that.cpmobile = "";
                            that.cpdesig = "";
                        }

                        that.dlvrprty = data.data[0].dlvrprty;
                        that.iseod = data.data[0].iseod;
                        that.isschdlvr = data.data[0].isschdlvr;
                        that.isagrmntsts = data.data[0].isagrmntsts;
                        that.isautoalloc = data.data[0].isautoalloc;
                        that.allocfrmtime = data.data[0].allocfrmtime;
                        that.alloctotime = data.data[0].alloctotime;
                        that.isrdravl = data.data[0].isrdravl;
                        that.avlfrmtime = data.data[0].avlfrmtime;
                        that.avltotime = data.data[0].avltotime;
                        that.isgetord = data.data[0].isgetord;
                        that.ordfrmtime = data.data[0].ordfrmtime;
                        that.ordtotime = data.data[0].ordtotime;
                        that.isrdravl = data.data[0].isrdravl;
                        that.avlfrmtime = data.data[0].avlfrmtime;
                        that.avltotime = data.data[0].avltotime;
                        that.isgetord = data.data[0].isgetord;
                        that.ordfrmtime = data.data[0].ordfrmtime;
                        that.ordtotime = data.data[0].ordtotime;
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
        this._router.navigate(['/merchant']);
    }
}
