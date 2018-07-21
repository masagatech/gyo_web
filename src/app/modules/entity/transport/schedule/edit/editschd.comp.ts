import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { Globals, LoginUserModel } from '@models';
import { PickDropService, EntityService } from '@services/master';

@Component({
    templateUrl: 'editschd.comp.html'
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
    batchname: string = "";

    pickautoid: number = 0;
    pickdriverid: number = 0;
    pickdrivername: string = "";
    pickvehicleid: number = 0;
    pickvehiclename: string = "";
    pickpsngrtype: string = "byrt";
    pickpsngrtypename: string = "By Route";

    dropautoid: number = 0;
    dropdriverid: number = 0;
    dropdrivername: string = "";
    dropvehicleid: number = 0;
    dropvehiclename: string = "";
    droppsngrtype: string = "byrt";
    droppsngrtypename: string = "By Route";

    instrunction: string = "";

    pickfromdate: any = "";
    picktodate: any = "";
    dropfromdate: any = "";
    droptodate: any = "";

    routeDT: any = [];
    pickrtid: number = 0;
    pickrtname: string = "";
    droprtid: number = 0;
    droprtname: string = "";

    ispickup: boolean = true;
    isdrop: boolean = true;

    scheduleData: any = {};
    oldScheduleData: any = [];
    newScheduleData: any = [];

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
                this.pickdrivername = "";
                this.pickvehicleid = 0;
                this.pickvehiclename = "";
                this.pickpsngrtype = "byrt";
                this.pickrtid = 0;
                this.pickrtname = "";
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
                this.dropdrivername = "";
                this.dropvehicleid = 0;
                this.dropvehiclename = "";
                this.droppsngrtype = "byrt";
                this.droprtid = 0;
                this.droprtname = "";
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
            that._msg.Show(messageType.error, "Error", err);
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
            "flag": "dropdown",
            "group": "pickpsngr",
            "id": that.pickrtid,
            "enttid": that._enttdetails.enttid,
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
                        that.pickdrivername = pickdata[0].drivername;
                        that.pickvehicleid = pickdata[0].vehicleid;
                        that.pickvehiclename = pickdata[0].vehiclename;
                        that.pickpsngrtype = pickdata[0].psngrtype;
                        that.pickrtid = pickdata[0].rtid;
                        that.pickrtname = pickdata[0].rtname;
                        that.pickPassengerDT = pickdata[0].studentdata;
                        that.pickAttList = pickdata[0].attendantdata;
                        that.ispickup = pickdata[0].isactive;
                    }
                    else {
                        that.pickdriverid = 0;
                        that.pickdrivername = "";
                        that.pickvehicleid = 0;
                        that.pickvehiclename = "";
                        that.pickpsngrtype = "byrt";
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
                        that.dropdrivername = dropdata[0].drivername;
                        that.dropvehicleid = dropdata[0].vehicleid;
                        that.dropvehiclename = dropdata[0].vehiclename;
                        that.droppsngrtype = dropdata[0].psngrtype;
                        that.droprtid = dropdata[0].rtid;
                        that.droprtname = dropdata[0].rtname;
                        that.dropPassengerDT = dropdata[0].studentdata;
                        that.dropAttList = dropdata[0].attendantdata;
                        that.isdrop = dropdata[0].isactive;
                    }
                    else {
                        that.dropdriverid = 0;
                        that.dropdrivername = "";
                        that.dropvehicleid = 0;
                        that.dropvehiclename = "";
                        that.droppsngrtype = "byrt";
                        that.droprtid = 0;
                        that.droprtname = "";
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
                    that.pickdrivername = "";
                    that.pickvehicleid = 0;
                    that.pickvehiclename = "";
                    that.pickpsngrtype = "byrt";
                    that.pickrtid = 0;
                    that.pickrtname = "";
                    that.pickPassengerDT = [];
                    that.pickAttList = [];

                    that.isdrop = true;
                    that.dropautoid = 0;
                    that.dropdriverid = 0;
                    that.dropdrivername = "";
                    that.dropvehicleid = 0;
                    that.dropvehiclename = "";
                    that.droppsngrtype = "byrt";
                    that.droprtid = 0;
                    that.droprtname = "";
                    that.dropPassengerDT = [];
                    that.dropAttList = [];

                    that.getPDDate(event);
                }

                that.scheduleData = that.getScheduleParams();
                that.oldScheduleData = that.getAuditData("old");

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

    getScheduleParams() {
        var that = this;

        var _pickdrop = [];

        var _pickstudDT = [];
        var _dropstudDT = [];

        var _pickattsid: string[] = [];
        var _dropattsid: string[] = [];
        var _pickstudsid: string[] = [];
        var _dropstudsid: string[] = [];

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
                "vhclno": $("#dropvehid option:selected").text().trim(),
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

        var params = {
            "pickdropdata": _pickdrop,
            "enttid": that._enttdetails.enttid,
            "enttname": that._enttdetails.enttname,
            "wsautoid": that._enttdetails.wsautoid,
            "cuid": that.loginUser.ucode,
            "isedit": true
        };

        return params;
    }

    // Get Audit Parameter

    getAuditData(ddltype) {
        var that = this;
        var _auditdt = [];

        var _pickdetails = [];

        _pickdetails

        _auditdt = [
            { "key": "Batch Name", "val": ddltype == "old" ? that.batchname : $("#batchid option:selected").text().trim(), "fldname": "batchid", "fldtype": "ddl" },
            { "key": "Instrunction", "val": that.instrunction, "fldname": "instrunction", "fldtype": "text" },

            { "key": "Type", "val": "Pickup", "fldname": "typ", "fldtype": "text" },
            { "key": "Pick From Date", "val": that.pickfromdate, "fldname": "pickfromdate", "fldtype": "date" },
            { "key": "Pick To Date", "val": that.picktodate, "fldname": "picktodate", "fldtype": "date" },
            { "key": "Pick Driver Name", "val": ddltype == "old" ? that.pickdrivername : $("#pickdrvid option:selected").text().trim(), "fldname": "pickdriverid", "fldtype": "ddl" },
            { "key": "Pick Vehicle Name", "val": ddltype == "old" ? that.pickvehiclename : $("#pickvehid option:selected").text().trim(), "fldname": "pickvehicleid", "fldtype": "ddl" },
            { "key": "Pick Route Name", "val": ddltype == "old" ? that.pickrtname : $("#pickrtid option:selected").text().trim(), "fldname": "pickrtid", "fldtype": "text" },
            { "key": "Pick Student", "val": that.pickPassengerDT, "fldname": "studdt", "fldtype": "table" },
            { "key": "Pick Attendant", "val": that.pickAttList, "fldname": "attsid", "fldtype": "table" },
            { "key": "Is Active Pickup", "val": that.ispickup ? "Yes" : "No", "fldname": "isactive", "fldtype": "text" },

            { "key": "Type", "val": "Drop", "fldname": "typ", "fldtype": "text" },
            { "key": "Drop From Date", "val": that.dropfromdate, "fldname": "dropfromdate", "fldtype": "date" },
            { "key": "Drop To Date", "val": that.droptodate, "fldname": "droptodate", "fldtype": "date" },
            { "key": "Drop Driver Name", "val": ddltype == "old" ? that.dropdrivername : $("#dropdrvid option:selected").text().trim(), "fldname": "dropdriverid", "fldtype": "ddl" },
            { "key": "Drop Vehicle Name", "val": ddltype == "old" ? that.dropvehiclename : $("#dropvehid option:selected").text().trim(), "fldname": "dropvehicleid", "fldtype": "ddl" },
            { "key": "Drop Route Name", "val": ddltype == "old" ? that.droprtname : $("#droprtid option:selected").text().trim(), "fldname": "droprtid", "fldtype": "ddl" },
            { "key": "Drop Student", "val": that.dropPassengerDT, "fldname": "studdt", "fldtype": "table" },
            { "key": "Drop Attendant", "val": that.dropAttList, "fldname": "attsid", "fldtype": "table" },
            { "key": "Is Active Drop", "val": that.isdrop ? "Yes" : "No", "fldname": "isactive", "fldtype": "text" },
        ]

        return _auditdt;
    }

    // Audit Log

    saveAuditLog(id, name, oldval, newval) {
        var that = this;

        var _oldvaldt = [];
        var _newvaldt = [];

        for (var i = 0; i < Object.keys(oldval).length; i++) {
            _oldvaldt.push(that.oldScheduleData.filter(a => a.fldname == Object.keys(oldval)[i]));
        }

        for (var i = 0; i < Object.keys(newval).length; i++) {
            _newvaldt.push(that.newScheduleData.filter(a => a.fldname == Object.keys(newval)[i]));
        }

        var dispflds = [{ "key": "Schedule", "val": name }];

        var auditparams = {
            "loginsessionid": that.loginUser.sessiondetails.sessionid, "mdlcode": "schedule", "mdlname": "Schedule",
            "id": id, "dispflds": dispflds, "oldval": _oldvaldt, "newval": _newvaldt, "ayid": that._enttdetails.ayid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "createdby": that.loginUser.ucode
        };

        that._autoservice.saveAuditLog(auditparams);
    }

    // Validation

    isValidationSchedule(newval) {
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
            else if (that.pickvehicleid === 0) {
                that._msg.Show(messageType.error, "Error", "Select Pick Up Vehicle");
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
            else if (that.dropvehicleid === 0) {
                that._msg.Show(messageType.error, "Error", "Select Drop Vehicle");
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
                that._msg.Show(messageType.error, "Error", "Please Fill atleast 1 Drop " + that._enttdetails.psngrtype);
                $(".droppsngrname input").focus();
                return false;
            }
        }

        if (that.ispickup == false && that.isdrop == false) {
            that._msg.Show(messageType.error, "Error", "Please Select atleast 1 Pick up / Drop Checkbox");
            $(".droppsngrname input").focus();
            return false;
        }

        if (JSON.stringify(newval) == "{}") {
            that._msg.Show(messageType.warn, "Warning", "No any Changes");
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

        var params = that.getScheduleParams();
        that.newScheduleData = that.getAuditData("new");

        var newval = that._autoservice.getDiff2Arrays(that.scheduleData, params);
        var oldval = that._autoservice.getDiff2Arrays(params, that.scheduleData);

        var _isvalid = that.isValidationSchedule(newval);

        if (_isvalid) {
            commonfun.loader();

            that._pickdropservice.savePickDropInfo(params).subscribe((data) => {
                try {
                    var dataResult = data.data[0].funsave_pickdropinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        if (dataResult.msgid == "2") {
                            that._msg.Show(messageType.error, "Error", msg);
                        }
                        else {
                            that.saveTrackingInfo();
                            that.saveAuditLog(0, $("#batchid option:selected").text().trim(), oldval, newval);
                            that._msg.Show(messageType.success, "Success", msg);
                            that.getPDCalendar();
                        }
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
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