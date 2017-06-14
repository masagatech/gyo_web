import { Component, OnInit, ViewChild } from '@angular/core';
import { PickDropService } from '../../_services/pickdrop/pickdrop-service';
import { CommonService } from '../../_services/common/common-service'; /* add reference for master of master */
import { MessageService, messageType } from '../../_services/messages/message-service';
import { MenuService } from '../../_services/menus/menu-service';
import { LoginService } from '../../_services/login/login-service';
import { LoginUserModel } from '../../_model/user_model';
import { EntityService } from '../../_services/entity/entity-service';
import { Router, ActivatedRoute } from '@angular/router';
import { Globals } from '../../_const/globals';

@Component({
    templateUrl: 'viewpd.comp.html',
    providers: [MenuService, PickDropService, EntityService, CommonService]
})

export class ChangeScheduleComponent implements OnInit {
    loginUser: LoginUserModel;

    _wsdetails: any = [];

    events: any[];
    header: any;
    event: MyEvent;
    defaultDate: string = "";
    actviewrights: string = "";

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

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

    constructor(private _pickdropservice: PickDropService, private _autoservice: CommonService, private _routeParams: ActivatedRoute, public _menuservice: MenuService,
        private _loginservice: LoginService, private _entityservice: EntityService, private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this.viewHolidayDataRights();
        this.getDefaultDate();
    }

    public ngOnInit() {
        var that = this;

        setTimeout(function () {
            $(".ui-picklist-buttons").hide();
            $(".ui-picklist-source-controls").show();
            $(".ui-picklist-target-controls").show();

            commonfun.chevronstyle();
        }, 0);

        that.header = {
            left: 'prev,next',
            center: 'title',
            right: 'today'
        };
    }

    public viewHolidayDataRights() {
        var that = this;
        var viewRights = [];

        that._menuservice.getMenuDetails({
            "flag": "actrights", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "mcode": "hld", "utype": that.loginUser.utype
        }).subscribe(data => {
            viewRights = data.data.filter(a => a.mrights === "view");
            that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
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

    // Selected Calendar Date

    getPDDate(event) {
        this.pickfromdate = this.formatDate(event.date);
        this.picktodate = this.formatDate(event.date);
        this.dropfromdate = this.formatDate(event.date);
        this.droptodate = this.formatDate(event.date);
    }

    getHolidayCalendar() {
        var that = this;

        //if (that.actviewrights === "view") {
        commonfun.loader();

        that._entityservice.getEntityDetails({ "flag": "holiday", "id": that.enttid }).subscribe(data => {
            try {
                that.events = data.data;
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
        //}
    }

    // Auto Completed Entity

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
            this.pickpassengerid = event.value;
            this.pickpassengername = event.label;
            this.pickupPassenger();
        }
        else if (type === "dropstuds") {
            this.droppassengerid = event.value;
            this.droppassengername = event.label;
            this.dropPassenger();
        }
        else {
            this.enttid = event.value;
            this.enttname = event.label;
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
            "id": that.enttid,
            "wsautoid": that._wsdetails.wsautoid
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
            "flag": "dropdown", "group": "driver", "id": that.enttid,
            "wsautoid": that._wsdetails.wsautoid
        }).subscribe((data) => {
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

    fillVehicleDropDown() {
        var that = this;

        that._pickdropservice.getPickDropDetails({
            "flag": "dropdown", "group": "vehicle", "id": that.enttid,
            "wsautoid": that._wsdetails.wsautoid
        }).subscribe((data) => {
            try {
                that.vehicleDT = data.data;
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

        that._pickdropservice.getPickDropDetails({
            "flag": "dropdown", "group": "route", "id": that.enttid,
            "wsautoid": that._wsdetails.wsautoid
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

    // Auto Completed Passenger

    getPassengerData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "passenger",
            "uid": this.loginUser.uid,
            "utype": this.loginUser.utype,
            "issysadmin": this._wsdetails.issysadmin,
            "wsautoid": this._wsdetails.wsautoid,
            "search": query,
            "id": this.enttid
        }).subscribe((data) => {
            this.passengerDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
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

    // Pickup Passenger

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

        that._pickdropservice.getPickDropDetails({
            "flag": "dropdown", "group": "pickpsngr", "id": that.pickrtid,
            "wsautoid": that._wsdetails.wsautoid
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
        var duplicatepassenger = that.isDuplicatePickupPassenger();

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

        that._pickdropservice.getPickDropDetails({
            "flag": "dropdown", "group": "droppsngr", "id": that.droprtid,
            "wsautoid": that._wsdetails.wsautoid
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

        this._pickdropservice.getPickDropDetails({
            "flag": "edit", "schoolid": that.enttid, "batchid": that.batchid, "frmdt": event.date, "todt": event.date
        }).subscribe(data => {
            try {
                var d = data.data;

                if (d.length !== 0) {
                    var pickdata = d.filter(a => a.typ === "p")[0];

                    if (pickdata.length !== 0) {
                        that.pickautoid = pickdata.autoid;
                        that.pickdriverid = pickdata.driverid;
                        that.pickvehicleid = pickdata.vehicleno;
                        that.pickPassengerDT = pickdata.studentdata;
                        that.pickfromdate = pickdata.frmdt;
                        that.picktodate = pickdata.todt;
                    }
                    else {
                        that.pickautoid = 0;
                        that.pickdriverid = 0;
                        that.pickvehicleid = "";
                        that.pickPassengerDT = [];

                        that.getPDDate(event);
                    }

                    var dropdata = d.filter(a => a.typ === "d")[0];

                    if (dropdata.length !== 0) {
                        that.dropautoid = dropdata.autoid;
                        that.dropdriverid = dropdata.driverid;
                        that.dropvehicleid = dropdata.vehicleno;
                        that.dropPassengerDT = dropdata.studentdata;
                        that.dropfromdate = dropdata.frmdt;
                        that.droptodate = dropdata.todt;
                    }
                    else {
                        that.dropautoid = 0;
                        that.dropdriverid = 0;
                        that.dropvehicleid = "";
                        that.dropPassengerDT = [];

                        that.getPDDate(event);
                    }
                }
                else {
                    that.pickautoid = 0;
                    that.pickdriverid = 0;
                    that.pickvehicleid = "";
                    that.pickPassengerDT = [];

                    that.dropautoid = 0;
                    that.dropdriverid = 0;
                    that.dropvehicleid = "";
                    that.dropPassengerDT = [];

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

        if (that.enttid === 0) {
            that._msg.Show(messageType.error, "Error", "Select Entity");
            $(".enttname").focus();
            return false;
        }
        else if (that.batchid === 0) {
            that._msg.Show(messageType.error, "Error", "Select Batch");
            $(".batch").focus();
            return false;
        }
        else if (that.pickdriverid === 0) {
            that._msg.Show(messageType.error, "Error", "Select Pick Up Driver");
            $(".pdrv").focus();
            return false;
        }
        else if (that.dropdriverid === 0) {
            that._msg.Show(messageType.error, "Error", "Select Drop Driver");
            $(".ddrv").focus();
            return false;
        }
        else if (that.pickvehicleid === "") {
            that._msg.Show(messageType.error, "Error", "Select Pick Up Vehicle No");
            $(".pveh").focus();
            return false;
        }
        else if (that.dropvehicleid === "") {
            that._msg.Show(messageType.error, "Error", "Select Drop Vehicle No");
            $(".dveh").focus();
            return false;
        }
        else if (that.pickpsngrtype == "byrt") {
            if (that.pickrtid === 0) {
                that._msg.Show(messageType.error, "Error", "Select Pick Up Route");
                $(".proute").focus();
                return false;
            }
            else if (that.droprtid === 0) {
                that._msg.Show(messageType.error, "Error", "Select Drop Route");
                $(".droute").focus();
                return false;
            }
        }
        else if (that.pickPassengerDT.length === 0) {
            that._msg.Show(messageType.error, "Error", "Please Fill atleast 1 Pick Up Passenger");
            $(".pickpassengername").focus();
            return false;
        }
        else if (that.dropPassengerDT.length === 0) {
            that._msg.Show(messageType.error, "Error", "Please Fill atleast 1 Drop Passenger");
            $(".droppassengername").focus();
            return false;
        }

        return true;
    }
    // Save

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
                _pickstudsid = Object.keys(_pickstudDT).map(function (k) { return _pickstudDT[k].stdid });
                _dropstudsid = Object.keys(_dropstudDT).map(function (k) { return _dropstudDT[k].stdid });

                _pickdrop.push({
                    "autoid": that.pickautoid,
                    "schid": that.enttid,
                    "schnm": that.enttname,
                    "btchid": that.batchid,
                    "drvid": that.pickdriverid,
                    "vhclid": that.pickvehicleid.split('~')[0],
                    "vhclno": that.pickvehicleid.split('~')[1],
                    "rtid": that.pickrtid,
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
                _pickdrop.push({
                    "autoid": that.dropautoid,
                    "schid": that.enttid,
                    "schnm": that.enttname,
                    "btchid": that.batchid,
                    "drvid": that.dropdriverid == 0 ? that.pickdriverid : that.dropdriverid,
                    "vhclid": that.dropvehicleid.split('~')[0],
                    "vhclno": that.dropvehicleid.split('~')[1],
                    "rtid": that.droprtid,
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
                        that._router.navigate(['/changeschedule']);
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

export class MyEvent {
    id: number;
    title: string;
    start: string;
    end: string;
    allDay: boolean = true;
}