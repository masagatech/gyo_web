import { Component, OnInit } from '@angular/core';
import { PickDropService } from '../../_services/pickdrop/pickdrop-service';
import { CommonService } from '../../_services/common/common-service'; /* add reference for master of master */
import { MessageService, messageType } from '../../_services/messages/message-service';
import { LoginService } from '../../_services/login/login-service';
import { LoginUserModel } from '../../_model/user_model';
import { Router, ActivatedRoute } from '@angular/router';
import { Globals } from '../../_const/globals';

@Component({
    templateUrl: 'addpd.comp.html',
    providers: [PickDropService, CommonService]
})

export class CreateScheduleComponent implements OnInit {
    loginUser: LoginUserModel;

    _wsdetails: any = [];

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    attendantDT: any = [];
    pickattid: number = 0;
    pickattname: string = "";
    dropattid: number = 0;
    dropattname: string = "";

    passengerDT: any = [];
    counter: number = 0;

    pickpassengerid: number = 0;
    pickpassengername: string = "";

    droppassengerid: number = 0;
    droppassengername: string = "";

    pickAttList: any = [];
    dropAttList: any = [];

    pickPassengerDT: any = [];
    dropPassengerDT: any = [];

    batchDT: any = [];
    driverDT: any = [];
    pickVehicleDT: any = [];
    dropVehicleDT: any = [];

    batchid: number = 0;
    pickautoid: number = 0;
    pickdriverid: number = 0;
    pickvehicleno: string = "";
    pickpsngrtype: string = "bypsngr";

    dropautoid: number = 0;
    dropdriverid: number = 0;
    dropvehicleno: string = "";
    droppsngrtype: string = "bypsngr";

    instrunction: string = "";

    pickfromdate: any = "";
    picktodate: any = "";
    dropfromdate: any = "";
    droptodate: any = "";

    routeDT: any = [];
    pickrtid: number = 0;
    droprtid: number = 0;

    constructor(private _pickdropservice: PickDropService, private _autoservice: CommonService, private _routeParams: ActivatedRoute,
        private _loginservice: LoginService, private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
    }

    public ngOnInit() {
        this.getPDDate();

        setTimeout(function () {
            $(".ui-picklist-buttons").hide();
            $(".ui-picklist-source-controls").show();
            $(".ui-picklist-target-controls").show();
        }, 0);
    }

    // Selected Calendar Date

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    // Format Date

    getPDDate() {
        var date = new Date();
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        this.pickfromdate = this.formatDate(today);
        this.dropfromdate = this.formatDate(today);

        this.picktodate = this.formatDate(today.setFullYear(2018));
        this.droptodate = this.formatDate(today.setFullYear(2018));
    }

    // Auto Completed Co-ordinator / Attendent

    getEntityData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "entity",
            "uid": this.loginUser.uid,
            "utype": this.loginUser.utype,
            "issysadmin": this._wsdetails.issysadmin,
            "wsautoid": this._wsdetails.wsautoid,
            "search": query
        }).subscribe(data => {
            this.entityDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Auto Completed Attendent

    getAttendantData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "owner",
            "uid": this.loginUser.uid,
            "typ": this.loginUser.utype,
            "otype": "attendent",
            "search": query
        }).subscribe(data => {
            this.attendantDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Auto Completed Passenger

    getPassengerData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "passenger",
            "search": query,
            "id": this.enttid
        }).subscribe(data => {
            this.passengerDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Get Selected Auto Completed Data

    selectAutoData(event, type) {
        if (type === "pickatt") {
            this.pickattid = event.value;
            this.pickattname = event.label;
            this.addPickAttData();
        }
        else if (type === "dropatt") {
            this.dropattid = event.value;
            this.dropattname = event.label;
            this.addDropAttData();
        }
        else if (type === "pickstuds") {
            this.pickpassengerid = event.studid;
            this.pickpassengername = event.studnm;
            this.pickupPassenger();
        }
        else if (type === "dropstuds") {
            this.droppassengerid = event.studid;
            this.droppassengername = event.studnm;
            this.dropPassenger();
        }
        else {
            this.enttid = event.value;
            this.enttname = event.label;
            this.fillBatchDropDown();
            this.fillDriverDropDown();
            this.fillRouteDropDown();
            this.getPassengerData(event);
        }
    }

    // Check Pickup Duplicate Passenger

    isDuplicatePickupPassenger() {
        var that = this;

        for (var i = 0; i < that.pickPassengerDT.length; i++) {
            var field = that.pickPassengerDT[i];

            if (field.stdid == this.pickpassengerid) {
                this._msg.Show(messageType.error, "Error", "Duplicate Passenger not Allowed");
                return true;
            }
        }

        return false;
    }

    // Pick Up Passenger

    pickupPassenger() {
        var that = this;
        var duplicatepassenger = that.isDuplicatePickupPassenger();

        if (!duplicatepassenger) {
            that.pickPassengerDT.push({
                "counter": that.counter++,
                "stdid": that.pickpassengerid,
                "stdnm": that.pickpassengername,
            });

            that.dropPassengerDT = that.reverseArr(that.pickPassengerDT);
        }

        that.pickpassengerid = 0;
        that.pickpassengername = "";

        that.droppassengerid = 0;
        that.droppassengername = "";
    }

    // Pick Up Passenger By Route

    pickupPassengerByRoute() {
        var that = this;

        that._pickdropservice.getPickDropDetails({ "flag": "dropdown", "group": "pickpsngr", "id": that.pickrtid }).subscribe((data) => {
            try {
                that.pickPassengerDT = data.data;
                that.dropPassengerDT = that.reverseArr(that.pickPassengerDT);
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    // Check Drop Duplicate Passenger

    isDuplicateDropPassenger() {
        var that = this;

        for (var i = 0; i < that.dropPassengerDT.length; i++) {
            var field = that.dropPassengerDT[i];

            if (field.stdid == this.droppassengerid) {
                this._msg.Show(messageType.error, "Error", "Duplicate Passenger not Allowed");
                return true;
            }
        }

        return false;
    }

    // Drop Passenger

    dropPassenger() {
        var that = this;
        that.dropPassengerDT = [];

        var duplicatepassenger = that.isDuplicateDropPassenger();

        if (!duplicatepassenger) {
            that.dropPassengerDT.push({
                "counter": that.counter++,
                "stdid": that.droppassengerid,
                "stdnm": that.droppassengername,
            });
        }

        that.droppassengerid = 0;
        that.droppassengername = "";
    }

    // Drop Passenger By Route

    dropPassengerByRoute() {
        var that = this;
        that.dropPassengerDT = [];

        that._pickdropservice.getPickDropDetails({ "flag": "dropdown", "group": "droppsngr", "id": that.droprtid }).subscribe((data) => {
            try {
                that.dropPassengerDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })

        that.dropPassengerDT = that.reverseArr(that.pickPassengerDT);
    }

    // Delete Pick Up Passenger

    deletePickUpPassenger(row) {
        this.pickPassengerDT.splice(this.pickPassengerDT.indexOf(row), 1);
    }

    // Delete Drop Passenger

    deleteDropPassenger(row) {
        this.dropPassengerDT.splice(this.dropPassengerDT.indexOf(row), 1);
    }

    // Add Pick Attendent Data

    addPickAttData() {
        var that = this;

        that.pickAttList.push({
            "counter": that.counter++,
            "attid": that.pickattid,
            "attnm": that.pickattname,
        });

        that.pickattid = 0;
        that.pickattname = "";
    }

    // Add Pick Attendent Data

    addDropAttData() {
        var that = this;

        that.dropAttList.push({
            "counter": that.counter++,
            "attid": that.dropattid,
            "attnm": that.dropattname,
        });

        that.dropattid = 0;
        that.dropattname = "";
    }

    // Delete Pick Up Passenger

    deletePickAtt(row) {
        this.pickAttList.splice(this.pickAttList.indexOf(row), 1);
    }

    // Delete Drop Passenger

    deleteDropAtt(row) {
        this.dropAttList.splice(this.dropAttList.indexOf(row), 1);
    }

    // Batch DropDown

    fillBatchDropDown() {
        var that = this;

        that._pickdropservice.getPickDropDetails({ "flag": "dropdown", "group": "batch", "id": that.enttid }).subscribe((data) => {
            try {
                that.batchDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    // Driver DropDown

    fillDriverDropDown() {
        var that = this;

        that._pickdropservice.getPickDropDetails({ "flag": "dropdown", "group": "driver", "id": that.enttid }).subscribe((data) => {
            try {
                that.driverDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            // that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    // Vehicle DropDown

    fillVehicleDropDown(_drvid, typ) {
        var that = this;

        that._pickdropservice.getPickDropDetails({ "flag": "dropdown", "group": "vehicle", "id": _drvid }).subscribe((data) => {
            try {
                if (typ == "pick") {
                    that.pickVehicleDT = data.data;
                    that.dropVehicleDT = data.data;
                }
                else {
                    that.dropVehicleDT = data.data;
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            // that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    // Route DropDown

    fillRouteDropDown() {
        var that = this;

        that._pickdropservice.getPickDropDetails({ "flag": "dropdown", "group": "route", "id": that.enttid }).subscribe((data) => {
            try {
                that.routeDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    // copy pick driver in drop driver

    setDropDriver() {
        this.dropdriverid = this.pickdriverid;
    }

    // copy pick vehicle in drop vehicle

    setDropVehicle() {
        this.dropvehicleno = this.pickvehicleno;
    }

    // copy pick route in drop route

    setDropRoute() {
        this.droprtid = this.pickrtid;
    }

    // copy pick type in drop type

    setDropPsngrType() {
        this.droppsngrtype = this.pickpsngrtype;
    }

    // reverse array

    reverseArr(input) {
        var ret = new Array;
        for (var i = input.length - 1; i >= 0; i--) {
            ret.push(input[i]);
        }
        return ret;
    }

    // Read

    getPickDropInfo() {
        commonfun.loader();
        var that = this;

        this._pickdropservice.getPickDropDetails({
            "flag": "edit", "enttid": that.enttid, "batchid": that.batchid
        }).subscribe(data => {
            try {
                var d = data.data;

                if (d.length !== 0) {
                    var pickdata = d.filter(a => a.typ === "p")[0];

                    if (pickdata.length !== 0) {
                        that.pickautoid = pickdata.autoid;
                        that.pickdriverid = pickdata.driverid;
                        that.pickvehicleno = pickdata.vehicleno;
                        that.pickrtid = pickdata.rtid;
                        that.pickPassengerDT = pickdata.studentdata;
                    }
                    else {
                        that.pickautoid = 0;
                        that.pickdriverid = 0;
                        that.pickvehicleno = "";
                        that.pickrtid = 0;
                        that.pickPassengerDT = [];
                    }

                    var dropdata = d.filter(a => a.typ === "d")[0];

                    if (dropdata.length !== 0) {
                        that.dropautoid = dropdata.autoid;
                        that.dropdriverid = dropdata.driverid;
                        that.dropvehicleno = dropdata.vehicleno;
                        that.droprtid = dropdata.rtid;
                        that.dropPassengerDT = dropdata.studentdata;
                    }
                    else {
                        that.dropautoid = 0;
                        that.dropdriverid = 0;
                        that.dropvehicleno = "";
                        that.droprtid = 0;
                        that.dropPassengerDT = [];
                    }
                }
                else {
                    that.pickautoid = 0;
                    that.pickdriverid = 0;
                    that.pickvehicleno = "";
                    that.pickrtid = 0;
                    that.pickPassengerDT = [];

                    that.dropautoid = 0;
                    that.dropdriverid = 0;
                    that.dropvehicleno = "";
                    that.droprtid = 0;
                    that.dropPassengerDT = [];
                }

                commonfun.loaderhide();
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
                commonfun.loaderhide();
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide();
        }, () => {
            // console.log("Complete");
        });
    }

    // Save

    savePickDropInfo() {
        var that = this;

        if (that.enttid === 0) {
            that._msg.Show(messageType.error, "Error", "Enter Entity");
            $(".entity").focus();
        }
        else if (that.batchid === 0) {
            that._msg.Show(messageType.error, "Error", "Select Batch");
            $(".batch").focus();
        }
        else if (that.pickdriverid === 0) {
            that._msg.Show(messageType.error, "Error", "Select Pick Up Driver");
            $(".pdrv").focus();
        }
        else if (that.dropdriverid === 0) {
            that._msg.Show(messageType.error, "Error", "Select Drop Driver");
            $(".ddrv").focus();
        }
        else if (that.pickvehicleno === "") {
            that._msg.Show(messageType.error, "Error", "Select Pick Up Vehicle No");
            $(".pveh").focus();
        }
        else if (that.dropvehicleno === "") {
            that._msg.Show(messageType.error, "Error", "Select Drop Vehicle No");
            $(".dveh").focus();
        }
        else if (that.pickrtid === 0) {
            that._msg.Show(messageType.error, "Error", "Select Pick Up Route");
            $(".proute").focus();
        }
        else if (that.droprtid === 0) {
            that._msg.Show(messageType.error, "Error", "Select Drop Route");
            $(".droute").focus();
        }
        else if (that.pickPassengerDT.length === 0) {
            that._msg.Show(messageType.error, "Error", "Please Fill atleast 1 Pick Up Passenger");
            $(".pickpassengername").focus();
        }
        else if (that.dropPassengerDT.length === 0) {
            that._msg.Show(messageType.error, "Error", "Please Fill atleast 1 Drop Passenger");
            $(".droppassengername").focus();
        }
        else {
            commonfun.loader();

            var _pickdrop = [];

            var _pickstudDT = [];
            var _dropstudDT = [];

            var _pickattsid: string[] = [];
            var _dropattsid: string[] = [];
            var _pickstudsid: string[] = [];
            var _dropstudsid: string[] = [];

            var savepickdrop = {};

            for (var i = 0; i < that.pickPassengerDT.length; i++) {
                _pickstudDT.push({
                    "stdid": that.pickPassengerDT[i].stdid,
                    "stdnm": that.pickPassengerDT[i].stdnm
                });
            }

            for (var i = 0; i < that.dropPassengerDT.length; i++) {
                _dropstudDT.push({
                    "stdid": that.dropPassengerDT[i].stdid,
                    "stdnm": that.dropPassengerDT[i].stdnm
                });
            }

            if (that.pickPassengerDT.length !== 0) {
                _pickattsid = Object.keys(that.pickAttList).map(function (k) { return that.pickAttList[k].attid });
                _pickstudsid = Object.keys(_pickstudDT).map(function (k) { return _pickstudDT[k].stdid });

                _pickdrop.push({
                    "autoid": that.pickautoid,
                    "schid": that.enttid,
                    "schnm": that.enttname,
                    "btchid": that.batchid,
                    "drvid": that.pickdriverid,
                    "vhclno": that.pickvehicleno,
                    "rtid": that.pickrtid,
                    "attsid": _pickattsid,
                    "studdt": _pickstudDT,
                    "studsid": _pickstudsid,
                    "uid": that.loginUser.ucode,
                    "inst": that.instrunction,
                    "frmdt": that.pickfromdate,
                    "todt": that.picktodate,
                    "typ": "p",
                    "psngrtype": that.pickpsngrtype
                });
            }

            if (that.dropPassengerDT.length !== 0) {
                _dropattsid = Object.keys(that.dropAttList).map(function (k) { return that.dropAttList[k].attid });
                _dropstudsid = Object.keys(_dropstudDT).map(function (k) { return _dropstudDT[k].stdid });

                _pickdrop.push({
                    "autoid": that.dropautoid,
                    "schid": that.enttid,
                    "schnm": that.enttid,
                    "btchid": that.batchid,
                    "drvid": that.dropdriverid == 0 ? that.pickdriverid : that.dropdriverid,
                    "vhclno": that.dropvehicleno,
                    "rtid": that.droprtid,
                    "attsid": _dropattsid,
                    "studdt": _dropstudDT,
                    "studsid": _dropstudsid,
                    "uid": that.loginUser.ucode,
                    "inst": that.instrunction,
                    "frmdt": that.dropfromdate,
                    "todt": that.droptodate,
                    "typ": "d",
                    "psngrtype": that.droppsngrtype
                });
            }

            savepickdrop = { "pickdropdata": _pickdrop };

            that._pickdropservice.savePickDropInfo(savepickdrop).subscribe((data) => {
                try {
                    var dataResult = data.data;

                    if (dataResult[0].funsave_pickdropinfo.msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", dataResult[0].funsave_pickdropinfo.msg);
                        that._router.navigate(['/createschedule']);
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", dataResult[0].funsave_pickdropinfo.msg);
                    }

                    commonfun.loaderhide();
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                    commonfun.loaderhide();
                }
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
                commonfun.loaderhide();
            }, () => {
                // console.log("Complete");
            });
        }
    }

    public onUploadError(event) {
        console.log('error');
    }

    public onUploadSuccess(event) {
        console.log('success');
    }
}