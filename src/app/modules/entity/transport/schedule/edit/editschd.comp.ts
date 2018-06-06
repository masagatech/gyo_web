import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { Globals, LoginUserModel } from '@models';
import { PickDropService, EntityService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'editschd.comp.html',
    providers: [CommonService]
})

export class EditScheduleComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    events: any = [];
    header: any;
    event: MyEvent;
    defaultDate: string = "";

    pddata: any = [];

    attendantDT: any = [];
    pickattid: number = 0;
    pickattname: string = "";
    pickattdata: any = [];

    dropattid: number = 0;
    dropattname: string = "";
    dropattdata: any = [];

    passengerDT: any = [];
    counter: number = 0;

    pickpsngrid: number = 0;
    pickpsngrname: string = "";
    pickpsngrdata: any = [];

    droppsngrid: number = 0;
    droppsngrname: string = "";
    droppsngrdata: any = [];

    pickAttList: any = [];
    dropAttList: any = [];

    pickPassengerDT: any = [];
    dropPassengerDT: any = [];

    batchDT: any = [];
    driverDT: any = [];
    vehicleDT: any = [];
    dropVehicleDT: any = [];

    batchid: number = 0;
    pickautoid: number = 0;
    pickdriverid: number = 0;
    pickvehicleid: string = "";
    pickpsngrtype: string = "bypsngr";

    dropautoid: number = 0;
    dropdriverid: number = 0;
    dropvehicleid: string = "";
    droppsngrtype: string = "bypsngr";

    instrunction: string = "";

    pickfromdate: any = "";
    picktodate: any = "";
    dropfromdate: any = "";
    droptodate: any = "";

    routeDT: any = [];
    pickrtid: number = 0;
    droprtid: number = 0;

    ispickup: boolean = true;
    isdrop: boolean = true;

    constructor(private _pickdropservice: PickDropService, private _autoservice: CommonService, private _routeParams: ActivatedRoute,
        private _loginservice: LoginService, private _entityservice: EntityService, private _router: Router,
        private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.viewScheduleDataRights();
        this.getDefaultDate();
    }

    public ngOnInit() {
        var that = this;

        setTimeout(function () {
            $(".enttname input").focus();

            $(".ui-picklist-buttons").hide();
            $(".ui-picklist-source-controls").show();
            $(".ui-picklist-target-controls").show();
        }, 100);

        that.header = {
            left: 'prev',
            center: 'title',
            right: 'next',
            //right: 'today'
        };

        that.refreshButtons();
    }

    hideWhenPickData() {
        if (!this.ispickup) {
            if (this.pickautoid == 0) {
                this.pickdriverid = 0;
                this.pickvehicleid = "";
                this.pickpsngrtype = "bypsngr";
                this.pickrtid = 0;
                this.pickPassengerDT = [];
            }
        }
    }

    copyPickInfoInDrop() {
        if (this.isdrop) {
            this.setDropDriver();
            this.setDropVehicle();
            this.setDropPsngrType();
            this.setDropRoute();
            this.dropPassengerDT = this.reverseArr(this.pickPassengerDT);
        }
        else {
            if (this.dropautoid == 0) {
                this.dropdriverid = 0;
                this.dropvehicleid = "";
                this.droppsngrtype = "bypsngr";
                this.droprtid = 0;
                this.dropPassengerDT = [];
            }
        }
    }

    public viewScheduleDataRights() {
        this.fillBatchDropDown();
        this.fillDriverDropDown();
        this.fillVehicleDropDown();
        this.fillRouteDropDown();
    }

    // Format Date

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    getDefaultDate() {
        var date = new Date();
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        this.defaultDate = this.formatDate(today);
    }

    refreshButtons() {
        setTimeout(function () {
            commonfun.chevronstyle();
        }, 0);
    }

    // Selected Calendar Date

    getPDDate(event) {
        this.pickfromdate = this.formatDate(event.date);
        this.picktodate = this.formatDate(event.date);
        this.dropfromdate = this.formatDate(event.date);
        this.droptodate = this.formatDate(event.date);
    }

    getPDCalendar() {
        var that = this;
        that.pddata = [];

        commonfun.loader();

        that._pickdropservice.getPickDropDetails({
            "flag": "calendar", "schoolid": that._enttdetails.enttid, "batchid": that.batchid
        }).subscribe(data => {
            try {
                that.events = data.data;
                that.refreshButtons();
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

    // Auto Completed Attendent

    getAttendantData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "attd",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._enttdetails.wsautoid,
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
            "flag": "studspsngr",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "issysadmin": this.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.passengerDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Get Selected Auto Completed Data

    selectAutoData(event, type) {
        if (type === "pickatt") {
            this.pickattid = event.uid;
            this.addPickAttData();
        }
        else if (type === "dropatt") {
            this.dropattid = event.uid;
            this.addDropAttData();
        }
        else if (type === "pickstuds") {
            this.pickpsngrid = event.value;
            this.pickupPassenger();
        }
        else if (type === "dropstuds") {
            this.droppsngrid = event.value;
            this.dropPassenger();
        }
        else {
            this.fillBatchDropDown();
            this.fillDriverDropDown();
            this.fillVehicleDropDown();
            this.fillRouteDropDown();
            this.getPassengerData(event);
        }
    }

    // Batch DropDown

    fillBatchDropDown() {
        var that = this;

        that._pickdropservice.getPickDropDetails({
            "flag": "dropdown",
            "group": "batch",
            "id": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid
        }).subscribe((data) => {
            try {
                that.batchDT = data.data;
                // setTimeout(function () { $.AdminBSB.select.refresh('batchid'); }, 100);
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

        that._pickdropservice.getPickDropDetails({
            "flag": "dropdown", "group": "driver", "id": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid
        }).subscribe((data) => {
            try {
                that.driverDT = data.data;
                // setTimeout(function () { $.AdminBSB.select.refresh('pickdriverid'); }, 100);
                // setTimeout(function () { $.AdminBSB.select.refresh('dropdriverid'); }, 100);
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

    // Vehicle DropDown

    fillVehicleDropDown() {
        var that = this;

        that._pickdropservice.getPickDropDetails({
            "flag": "dropdown", "group": "vehicle", "id": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid
        }).subscribe((data) => {
            try {
                that.vehicleDT = data.data;
                // setTimeout(function () { $.AdminBSB.select.refresh('pickvehicleid'); }, 100);
                // setTimeout(function () { $.AdminBSB.select.refresh('dropvehicleid'); }, 100);
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

    // Route DropDown

    fillRouteDropDown() {
        var that = this;

        that._pickdropservice.getPickDropDetails({
            "flag": "dropdown", "group": "route", "id": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid
        }).subscribe((data) => {
            try {
                that.routeDT = data.data;
                // setTimeout(function () { $.AdminBSB.select.refresh('pickrtid'); }, 100);
                // setTimeout(function () { $.AdminBSB.select.refresh('droprtid'); }, 100);
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
        this.dropvehicleid = this.pickvehicleid;
    }

    // copy pick route in drop route

    setDropRoute() {
        this.droprtid = this.pickrtid;
    }

    // copy pick type in drop type

    setDropPsngrType() {
        this.droppsngrtype = this.pickpsngrtype;
    }

    // Check Pickup Duplicate Passenger

    isDuplicatePickupPassenger() {
        var that = this;

        for (var i = 0; i < that.pickPassengerDT.length; i++) {
            var field = that.pickPassengerDT[i];

            if (field.stdid == this.pickpsngrid) {
                this._msg.Show(messageType.error, "Error", "Duplicate " + that._enttdetails.psngrtype + " not Allowed");
                return true;
            }
        }

        return false;
    }

    // Pickup Passenger

    pickupPassenger() {
        var that = this;
        var duplicatepassenger = that.isDuplicatePickupPassenger();

        if (!duplicatepassenger) {
            that.pickPassengerDT.push({
                "counter": that.counter++,
                "stdid": that.pickpsngrdata.value,
                "stdnm": that.pickpsngrdata.label,
            });

            that.dropPassengerDT = that.reverseArr(that.pickPassengerDT);
            that.pickPassengerDT = that.reverseArr(that.dropPassengerDT);
        }

        that.pickpsngrid = 0;
        that.pickpsngrname = "";
        that.pickpsngrdata = [];

        that.droppsngrid = 0;
        that.droppsngrname = "";
        that.droppsngrdata = [];
    }

    // Pick Up Passenger By Route

    pickupPassengerByRoute() {
        var that = this;

        that._pickdropservice.getPickDropDetails({
            "flag": "dropdown", "group": "pickpsngr", "id": that.pickrtid,
            "wsautoid": that._enttdetails.wsautoid
        }).subscribe((data) => {
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

            if (field.stdid == this.droppsngrid) {
                this._msg.Show(messageType.error, "Error", "Duplicate " + that._enttdetails.psngrtype + " not Allowed");
                return true;
            }
        }

        return false;
    }

    // Drop Passenger

    dropPassenger() {
        var that = this;
        var duplicatepassenger = that.isDuplicatePickupPassenger();

        if (!duplicatepassenger) {
            that.dropPassengerDT.push({
                "counter": that.counter++,
                "stdid": that.droppsngrdata.value,
                "stdnm": that.droppsngrdata.label,
            });

            that.dropPassengerDT = that.reverseArr(that.dropPassengerDT);
            that.dropPassengerDT = that.reverseArr(that.dropPassengerDT);
        }

        that.droppsngrid = 0;
        that.droppsngrname = "";
        that.droppsngrdata = [];
    }

    // Drop Passenger By Route

    dropPassengerByRoute() {
        var that = this;
        that.dropPassengerDT = [];

        that._pickdropservice.getPickDropDetails({
            "flag": "dropdown", "group": "droppsngr", "id": that.droprtid,
            "wsautoid": that._enttdetails.wsautoid
        }).subscribe((data) => {
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
            "attid": that.pickattdata.uid,
            "attnm": that.pickattdata.uname,
        });

        that.pickattid = 0;
        that.pickattname = "";
        that.pickattdata = [];
    }

    // Add Pick Attendent Data

    addDropAttData() {
        var that = this;

        that.dropAttList.push({
            "counter": that.counter++,
            "attid": that.dropattdata.value,
            "attnm": that.dropattdata.label,
        });

        that.dropattid = 0;
        that.dropattname = "";
        that.dropattdata = [];
    }

    // Delete Pick Up Passenger

    deletePickAtt(row) {
        this.pickAttList.splice(this.pickAttList.indexOf(row), 1);
    }

    // Delete Drop Passenger

    deleteDropAtt(row) {
        this.dropAttList.splice(this.dropAttList.indexOf(row), 1);
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

    getPickDropInfo(event) {
        commonfun.loader();
        var that = this;

        var pickalldata = [];
        var dropalldata = [];
        var pickdata = [];
        var dropdata = [];

        this._pickdropservice.getPickDropDetails({
            "flag": "view", "mode": "edit", "schoolid": that._enttdetails.enttid, "batchid": that.batchid,
            "wsautoid": that._enttdetails.wsautoid, "frmdt": event.calEvent.start, "todt": event.calEvent.end
        }).subscribe(data => {
            try {
                that.pddata = data.data;

                if (that.pddata.length !== 0) {
                    pickalldata = that.pddata.filter(a => a.typ === "p");
                    dropalldata = that.pddata.filter(a => a.typ === "d");

                    if (pickalldata.length !== 0) {
                        that.pickautoid = pickalldata[0].autoid;
                        pickdata = pickalldata.filter(a => a.isactive === true);
                    }
                    else {
                        that.pickautoid = 0;
                        pickdata = [];
                    }

                    if (pickdata.length !== 0) {
                        that.pickfromdate = pickdata[0].frmdt;
                        that.picktodate = pickdata[0].todt;
                        that.pickdriverid = pickdata[0].driverid;
                        that.pickvehicleid = pickdata[0].vehicleno;
                        that.pickpsngrtype = pickdata[0].psngrtype;
                        that.pickrtid = pickdata[0].rtid;
                        that.pickPassengerDT = pickdata[0].studentdata;
                        that.pickAttList = pickdata[0].attendantdata;
                        that.ispickup = pickdata[0].isactive;
                    }
                    else {
                        that.pickdriverid = 0;
                        that.pickvehicleid = "";
                        that.pickpsngrtype = "bypsngr";
                        that.pickrtid = 0;
                        that.pickPassengerDT = [];
                        that.pickAttList = [];
                        that.ispickup = false;

                        that.getPDDate(event);
                    }

                    if (dropalldata.length !== 0) {
                        that.dropautoid = dropalldata[0].autoid;
                        dropdata = dropalldata.filter(a => a.isactive === true);
                    }
                    else {
                        that.dropautoid = 0;
                        dropdata = [];
                    }

                    if (dropdata.length !== 0) {
                        that.dropfromdate = dropdata[0].frmdt;
                        that.droptodate = dropdata[0].todt;
                        that.dropdriverid = dropdata[0].driverid;
                        that.dropvehicleid = dropdata[0].vehicleno;
                        that.droppsngrtype = dropdata[0].psngrtype;
                        that.droprtid = dropdata[0].rtid;
                        that.dropPassengerDT = dropdata[0].studentdata;
                        that.dropAttList = dropdata[0].attendantdata;
                        that.isdrop = dropdata[0].isactive;
                    }
                    else {
                        that.dropdriverid = 0;
                        that.dropvehicleid = "";
                        that.droppsngrtype = "bypsngr";
                        that.droprtid = 0;
                        that.dropPassengerDT = [];
                        that.dropAttList = [];
                        that.isdrop = false;

                        that.getPDDate(event);
                    }
                }
                else {
                    that.ispickup = true;
                    that.pickautoid = 0;
                    that.pickdriverid = 0;
                    that.pickvehicleid = "";
                    that.pickpsngrtype = "bypsngr";
                    that.pickrtid = 0;
                    that.pickPassengerDT = [];
                    that.pickAttList = [];

                    that.isdrop = true;
                    that.dropautoid = 0;
                    that.dropdriverid = 0;
                    that.dropvehicleid = "";
                    that.droppsngrtype = "bypsngr";
                    that.droprtid = 0;
                    that.dropPassengerDT = [];
                    that.dropAttList = [];

                    that.getPDDate(event);
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

    // Validation

    isValidationSchedule() {
        var that = this;

        if (that.batchid === 0) {
            that._msg.Show(messageType.error, "Error", "Select Batch");
            $(".batch").focus();
            return false;
        }

        if (that.ispickup) {
            if (that.pickdriverid === 0) {
                that._msg.Show(messageType.error, "Error", "Select Pick Up Driver");
                $(".pdrv").focus();
                return false;
            }
            else if (that.pickvehicleid === "") {
                that._msg.Show(messageType.error, "Error", "Select Pick Up Vehicle No");
                $(".pveh").focus();
                return false;
            }
            else if (that.pickpsngrtype == "byrt") {
                if (that.pickrtid === 0) {
                    that._msg.Show(messageType.error, "Error", "Select Pick Up Route");
                    $(".proute").focus();
                    return false;
                }
            }
            else if (that.pickPassengerDT.length === 0) {
                that._msg.Show(messageType.error, "Error", "Please Fill atleast 1 Pick Up Passenger");
                $(".pickpsngrname input").focus();
                return false;
            }
        }

        if (that.isdrop) {
            if (that.dropdriverid === 0) {
                that._msg.Show(messageType.error, "Error", "Select Drop Driver");
                $(".ddrv").focus();
                return false;
            }
            else if (that.dropvehicleid === "") {
                that._msg.Show(messageType.error, "Error", "Select Drop Vehicle No");
                $(".dveh").focus();
                return false;
            }
            else if (that.droppsngrtype == "byrt") {
                if (that.droprtid === 0) {
                    that._msg.Show(messageType.error, "Error", "Select Drop Route");
                    $(".droute").focus();
                    return false;
                }
            }
            else if (that.dropPassengerDT.length === 0) {
                that._msg.Show(messageType.error, "Error", "Please Fill atleast 1 Drop Passenger");
                $(".droppsngrname input").focus();
                return false;
            }
        }

        if (that.ispickup == false && that.isdrop == false) {
            that._msg.Show(messageType.error, "Error", "Please Select atleast 1 Pick up / Drop Checkbox");
            $(".droppsngrname input").focus();
            return false;
        }

        return true;
    }

    // Save Tracking

    saveTrackingInfo() {
        var that = this;

        var params = {
            "batchid": that.batchid,
            "pdrvid": that.pickdriverid,
            "ddrvid": that.dropdriverid,
            "pvehid": that.pickvehicleid.split('~')[0],
            "dvehid": that.dropvehicleid.split('~')[0],
            "prtid": that.pickrtid,
            "drtid": that.droprtid,
            "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid,
            "cuid": that.loginUser.ucode
        }

        that._pickdropservice.saveTrackingInfo(params).subscribe(data => {
            try {
                var dataResult = data.data[0].funsave_trackinginfo;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {
        });
    }

    // Save Schedule

    savePickDropInfo() {
        var that = this;
        var _isvalid = that.isValidationSchedule();

        if (_isvalid) {
            commonfun.loader();

            var _pickdrop = [];

            var _pickstudDT = [];
            var _dropstudDT = [];

            var _pickattsid: string[] = [];
            var _dropattsid: string[] = [];
            var _pickstudsid: string[] = [];
            var _dropstudsid: string[] = [];

            var savepickdrop = {};

            if (that.pickPassengerDT.length !== 0) {
                for (var i = 0; i < that.pickPassengerDT.length; i++) {
                    _pickstudDT.push({
                        "stdid": that.pickPassengerDT[i].stdid,
                        "stdnm": that.pickPassengerDT[i].stdnm,
                        "stpid": that.pickPassengerDT[i].stpid
                    });
                }

                _pickattsid = Object.keys(that.pickAttList).map(function (k) { return that.pickAttList[k].attid });
                _pickstudsid = Object.keys(_pickstudDT).map(function (k) { return _pickstudDT[k].stdid });

                _pickdrop.push({
                    "autoid": that.pickautoid,
                    "schid": that._enttdetails.enttid,
                    "schnm": that._enttdetails.enttname,
                    "btchid": that.batchid,
                    "drvid": that.pickdriverid,
                    "vhclid": that.pickvehicleid.split('~')[0],
                    "vhclno": that.pickvehicleid.split('~')[1],
                    "rtid": that.pickrtid,
                    "attsid": _pickattsid,
                    "studdt": _pickstudDT,
                    "studsid": _pickstudsid,
                    "uid": that.loginUser.ucode,
                    "inst": that.instrunction,
                    "frmdt": that.pickfromdate,
                    "todt": that.picktodate,
                    "typ": "p",
                    "psngrtype": that.pickpsngrtype,
                    "wsautoid": that._enttdetails.wsautoid,
                    "isactive": that.ispickup
                });
            }

            if (that.dropPassengerDT.length !== 0) {
                for (var i = 0; i < that.dropPassengerDT.length; i++) {
                    _dropstudDT.push({
                        "stdid": that.dropPassengerDT[i].stdid,
                        "stdnm": that.dropPassengerDT[i].stdnm,
                        "stpid": that.dropPassengerDT[i].stpid
                    });
                }

                _dropattsid = Object.keys(that.dropAttList).map(function (k) { return that.dropAttList[k].attid });
                _dropstudsid = Object.keys(_dropstudDT).map(function (k) { return _dropstudDT[k].stdid });

                _pickdrop.push({
                    "autoid": that.dropautoid,
                    "schid": that._enttdetails.enttid,
                    "schnm": that._enttdetails.enttname,
                    "btchid": that.batchid,
                    "drvid": that.dropdriverid == 0 ? that.pickdriverid : that.dropdriverid,
                    "vhclid": that.dropvehicleid.split('~')[0],
                    "vhclno": that.dropvehicleid.split('~')[1],
                    "rtid": that.droprtid,
                    "attsid": _dropattsid,
                    "studdt": _dropstudDT,
                    "studsid": _dropstudsid,
                    "uid": that.loginUser.ucode,
                    "inst": that.instrunction,
                    "frmdt": that.dropfromdate,
                    "todt": that.droptodate,
                    "typ": "d",
                    "psngrtype": that.droppsngrtype,
                    "wsautoid": that._enttdetails.wsautoid,
                    "isactive": that.isdrop
                });
            }

            savepickdrop = {
                "pickdropdata": _pickdrop, "isedit": true
            };

            that._pickdropservice.savePickDropInfo(savepickdrop).subscribe((data) => {
                try {
                    var dataResult = data.data[0].funsave_pickdropinfo;

                    if (dataResult.msgid != "-1") {
                        if (dataResult.msgid == "2") {
                            that._msg.Show(messageType.error, "Error", dataResult.msg);
                        }
                        else {
                            that.saveTrackingInfo();
                            that._msg.Show(messageType.success, "Success", dataResult.msg);
                            that.getPDCalendar();
                        }
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", dataResult.msg);
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

    // Back For View Data

    backViewData() {
        this._router.navigate(['/transport/schedule']);
    }
}

export class MyEvent {
    id: number;
    title: string;
    start: string;
    end: string;
    allDay: boolean = true;
}