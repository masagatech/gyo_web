import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { Globals, LoginUserModel } from '@models';
import { PickDropService } from '@services/master';
import { identifierModuleUrl } from '../../../../../../../node_modules/@angular/compiler';

@Component({
    templateUrl: 'addschd.comp.html'
})

export class AddScheduleComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

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
    pickstpid: number = 0;
    pickpsngrdata: any = [];

    droppsngrid: number = 0;
    droppsngrname: string = "";
    dropstpid: number = 0;
    droppsngrdata: any = [];

    pickAttList: any = [];
    dropAttList: any = [];

    pickPassengerDT: any = [];
    dropPassengerDT: any = [];

    batchDT: any = [];
    driverDT: any = [];
    vehicleDT: any = [];

    batchid: number = 0;
    pickautoid: number = 0;
    pickdriverid: number = 0;
    pickvehicleid: number = 0;
    pickpsngrtype: string = "byrt";

    dropautoid: number = 0;
    dropdriverid: number = 0;
    dropvehicleid: number = 0;
    droppsngrtype: string = "byrt";

    instrunction: string = "";

    pickwkdays: string = "";
    pickfromdate: any = "";
    picktodate: any = "";
    
    dropwkdays: string = "";
    dropfromdate: any = "";
    droptodate: any = "";

    routeDT: any = [];
    pickrtid: number = 0;
    droprtid: number = 0;

    ispickup: boolean = true;
    isdrop: boolean = true;

    constructor(private _pickdropservice: PickDropService, private _autoservice: CommonService, private _routeParams: ActivatedRoute,
        private _loginservice: LoginService, private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.viewScheduleDataRights();
    }

    public ngOnInit() {
        this.getPDDate();

        setTimeout(function () {
            $(".enttname input").focus();

            // $(".ui-picklist-buttons").hide();
            // $(".ui-picklist-source-controls").show();
            // $(".ui-picklist-target-controls").show();
        }, 100);
    }

    hideWhenPickData() {
        if (!this.ispickup) {
            if (this.pickautoid == 0) {
                this.pickdriverid = 0;
                this.pickvehicleid = "";
                this.pickpsngrtype = "byrt";
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
        }
        else {
            if (this.dropautoid == 0) {
                this.dropdriverid = 0;
                this.dropvehicleid = "";
                this.droppsngrtype = "byrt";
                this.droprtid = 0;
                this.dropPassengerDT = [];
            }
        }
    }

    public viewScheduleDataRights() {
        var that = this;

        that.fillBatchDropDown();
        that.fillDriverDropDown();
        that.fillVehicleDropDown();
        that.fillRouteDropDown();
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

    getPassengerData(event, pdtype) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": pdtype,
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "ayid": this._enttdetails.ayid,
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "issysadmin": this.loginUser.issysadmin,
            "search": query
        }).subscribe(data => {
            this.passengerDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Get Selected Auto Completed Data

    selectAutoData(event, pdtype) {
        if (pdtype === "pickatt") {
            this.pickattid = event.uid;
            this.pickattname = event.uname;
            this.addPickAttData();
        }
        else if (pdtype === "dropatt") {
            this.dropattid = event.uid;
            this.dropattname = event.uname;
            this.addDropAttData();
        }
        else if (pdtype === "pickstuds") {
            this.pickpsngrid = event.studid;
            this.pickpsngrname = event.studname;
            this.pickstpid = event.stpid;
            this.pickupPassenger();
        }
        else if (pdtype === "dropstuds") {
            this.droppsngrid = event.studid;
            this.droppsngrname = event.studname;
            this.dropstpid = event.stpid;
            this.dropPassenger();
        }
        else {
            this.fillBatchDropDown();
            this.fillDriverDropDown();
            this.fillVehicleDropDown();
            this.fillRouteDropDown();
            this.getPassengerData(event, pdtype);
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
            "flag": "dropdown",
            "group": "driver",
            "id": that._enttdetails.enttid
        }).subscribe((data) => {
            try {
                that.driverDT = data.data;
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
            "flag": "dropdown",
            "group": "vehicle",
            "id": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid
        }).subscribe((data) => {
            try {
                that.vehicleDT = data.data;
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
            "flag": "dropdown",
            "group": "route",
            "id": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid
        }).subscribe((data) => {
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
        this.dropvehicleid = this.pickvehicleid;
    }

    // copy pick route in drop route

    setDropRoute() {
        this.droprtid = this.pickrtid;
    }

    // copy pick type in drop type

    setDropPsngrType() {
        this.pickPassengerDT = [];
        this.dropPassengerDT = [];

        this.droppsngrtype = this.pickpsngrtype;
    }

    resetDropPsngrType() {
        this.dropPassengerDT = [];
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

    // Pick Up Passenger

    pickupPassenger() {
        var that = this;
        var duplicatepassenger = that.isDuplicatePickupPassenger();

        if (!duplicatepassenger) {
            that.pickPassengerDT.push({
                "stdid": that.pickpsngrdata.studid,
                "stdnm": that.pickpsngrdata.studname,
                "stpid": that.pickpsngrdata.stpid
            });

            that.dropPassengerDT.push({
                "stdid": that.pickpsngrdata.studid,
                "stdnm": that.pickpsngrdata.studname,
                "stpid": that.pickpsngrdata.stpid
            });
        }

        that.pickpsngrid = 0;
        that.pickpsngrname = "";
        that.pickstpid = 0;
        that.pickpsngrdata = [];

        that.droppsngrid = 0;
        that.droppsngrname = "";
        that.dropstpid = 0;
        that.droppsngrdata = [];
    }

    // Pick Up Passenger By Route

    pickupPassengerByRoute() {
        var that = this;

        that._pickdropservice.getPickDropDetails({
            "flag": "dropdown",
            "group": "pickpsngr",
            "id": that.pickrtid,
            "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid
        }).subscribe((data) => {
            try {
                that.pickPassengerDT = data.data;
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
        var duplicatepassenger = that.isDuplicateDropPassenger();

        if (!duplicatepassenger) {
            that.dropPassengerDT.push({
                "counter": that.counter++,
                "stdid": that.droppsngrdata.studid,
                "stdnm": that.droppsngrdata.studname,
                "stpid": that.droppsngrdata.stpid
            });
        }

        that.droppsngrid = 0;
        that.droppsngrname = "";
        that.dropstpid = 0;
        that.droppsngrdata = [];
    }

    // Drop Passenger By Route

    dropPassengerByRoute() {
        var that = this;

        that._pickdropservice.getPickDropDetails({
            "flag": "dropdown",
            "group": "droppsngr",
            "id": that.droprtid,
            "enttid": that._enttdetails.enttid,
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
            "attid": that.dropattdata.uid,
            "attnm": that.dropattdata.uname,
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

    getPickDropInfo() {
        commonfun.loader();
        var that = this;

        var pickalldata = [];
        var dropalldata = [];
        var pickdata = [];
        var dropdata = [];

        that._pickdropservice.getPickDropDetails({
            "flag": "view", "mode": "add", "schoolid": that._enttdetails.enttid, "batchid": that.batchid,
            "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                var d = data.data;

                if (d.length !== 0) {
                    pickalldata = d.filter(a => a.typ === "p");
                    dropalldata = d.filter(a => a.typ === "d");

                    if (pickalldata.length !== 0) {
                        that.pickautoid = pickalldata[0].autoid;
                        pickdata = pickalldata.filter(a => a.isactive === true);
                    }
                    else {
                        that.pickautoid = 0;
                        pickdata = [];
                    }

                    if (pickdata.length !== 0) {
                        that.pickwkdays = pickdata[0].wkdays;
                        that.pickfromdate = pickdata[0].frmdt;
                        that.picktodate = pickdata[0].todt;
                        that.pickdriverid = pickdata[0].driverid;
                        that.pickvehicleid = pickdata[0].vehicleid;
                        that.pickpsngrtype = pickdata[0].psngrtype;
                        that.pickrtid = pickdata[0].rtid;
                        that.pickPassengerDT = pickdata[0].studentdata;
                        that.pickAttList = pickdata[0].attendantdata;
                        that.ispickup = pickdata[0].isactive;
                    }
                    else {
                        that.pickwkdays = "";
                        that.pickfromdate = "";
                        that.picktodate = "";
                        that.pickdriverid = 0;
                        that.pickvehicleid = 0;
                        that.pickpsngrtype = "byrt";
                        that.pickrtid = 0;
                        that.pickPassengerDT = [];
                        that.pickAttList = [];
                        that.ispickup = false;
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
                        that.dropwkdays = dropdata[0].wkdays;
                        that.dropfromdate = dropdata[0].frmdt;
                        that.droptodate = dropdata[0].todt;
                        that.dropdriverid = dropdata[0].driverid;
                        that.dropvehicleid = dropdata[0].vehicleid;
                        that.droppsngrtype = dropdata[0].psngrtype;
                        that.droprtid = dropdata[0].rtid;
                        that.dropPassengerDT = dropdata[0].studentdata;
                        that.dropAttList = dropdata[0].attendantdata;
                        that.isdrop = dropdata[0].isactive;
                    }
                    else {
                        that.dropwkdays = "";
                        that.dropfromdate = "";
                        that.droptodate = "";
                        that.dropdriverid = 0;
                        that.dropvehicleid = 0;
                        that.droppsngrtype = "byrt";
                        that.droprtid = 0;
                        that.dropPassengerDT = [];
                        that.dropAttList = [];
                        that.isdrop = false;
                    }
                }
                else {
                    that.ispickup = true;
                    that.pickwkdays = "";
                    that.pickautoid = 0;
                    that.pickdriverid = 0;
                    that.pickvehicleid = 0;
                    that.pickpsngrtype = "byrt";
                    that.pickrtid = 0;
                    that.pickPassengerDT = [];
                    that.pickAttList = [];

                    that.isdrop = true;
                    that.dropwkdays = "";
                    that.dropautoid = 0;
                    that.dropdriverid = 0;
                    that.dropvehicleid = 0;
                    that.droppsngrtype = "byrt";
                    that.droprtid = 0;
                    that.dropPassengerDT = [];
                    that.dropAttList = [];
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
            if (that.pickvehicleid === 0) {
                that._msg.Show(messageType.error, "Error", "Select Pick Up Vehicle No");
                $(".pveh").focus();
                return false;
            }
            if (that.pickpsngrtype == "byrt") {
                if (that.pickrtid === 0) {
                    that._msg.Show(messageType.error, "Error", "Select Pick Up Route");
                    $(".proute").focus();
                    return false;
                }
            }
            if (that.pickPassengerDT.length === 0) {
                that._msg.Show(messageType.error, "Error", "Please Fill atleast 1 Pick Up " + that._enttdetails.psngrtype);
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
            if (that.dropvehicleid === 0) {
                that._msg.Show(messageType.error, "Error", "Select Drop Vehicle No");
                $(".dveh").focus();
                return false;
            }
            if (that.droppsngrtype == "byrt") {
                if (that.droprtid === 0) {
                    that._msg.Show(messageType.error, "Error", "Select Drop Route");
                    $(".droute").focus();
                    return false;
                }
            }
            if (that.dropPassengerDT.length === 0) {
                that._msg.Show(messageType.error, "Error", "Please Fill atleast 1 Drop " + that._enttdetails.psngrtype);
                $(".droppsngrname").focus();
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
            "pvehid": that.pickvehicleid,
            "dvehid": that.dropvehicleid,
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
                    "btchid": that.batchid,
                    "drvid": that.pickdriverid,
                    "vhclid": that.pickvehicleid,
                    "vhclno": $("#pickvehid option:selected").text().trim(),
                    "rtid": that.pickrtid,
                    "attsid": _pickattsid,
                    "studdt": _pickstudDT,
                    "studsid": _pickstudsid,
                    "inst": that.instrunction,
                    "frmdt": that.pickfromdate,
                    "todt": that.picktodate,
                    "typ": "p",
                    "psngrtype": that.pickpsngrtype,
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
                    "btchid": that.batchid,
                    "drvid": that.dropdriverid == 0 ? that.pickdriverid : that.dropdriverid,
                    "vhclid": that.dropvehicleid,
                    "vhclno": $("#pickvehid option:selected").text().trim(),
                    "rtid": that.droprtid,
                    "attsid": _dropattsid,
                    "studdt": _dropstudDT,
                    "studsid": _dropstudsid,
                    "inst": that.instrunction,
                    "frmdt": that.dropfromdate,
                    "todt": that.droptodate,
                    "typ": "d",
                    "psngrtype": that.droppsngrtype,
                    "isactive": that.isdrop
                });
            }

            savepickdrop = {
                "pickdropdata": _pickdrop,
                "enttid": that._enttdetails.enttid,
                "enttname": that._enttdetails.enttname,
                "wsautoid": that._enttdetails.wsautoid,
                "cuid": that.loginUser.ucode,
                "isedit": false
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
                            that.resetPickDropFields();
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

    resetPickDropFields() {
        var that = this;

        that.batchid = 0;

        that.pickautoid = 0;
        that.pickdriverid = 0;
        that.pickvehicleid = 0;
        that.pickpsngrtype = "byrt";
        that.pickrtid = 0;
        that.pickPassengerDT = [];
        that.pickAttList = [];
        that.ispickup = that.pickPassengerDT.length == 0 ? false : true;

        that.dropautoid = 0;
        that.dropdriverid = 0;
        that.dropvehicleid = 0;
        that.droppsngrtype = "byrt";
        that.droprtid = 0;
        that.dropPassengerDT = [];
        that.dropAttList = [];
        that.isdrop = that.dropPassengerDT.length == 0 ? false : true;

        that.instrunction = "";
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