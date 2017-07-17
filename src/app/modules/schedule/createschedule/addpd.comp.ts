import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, MenuService, CommonService } from '@services';
import { Globals, LoginUserModel } from '@models';
import { PickDropService, EntityService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'addpd.comp.html',
    providers: [MenuService, CommonService]
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
    vehicleDT: any = [];

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
        public _menuservice: MenuService, private _loginservice: LoginService, private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this.viewScheduleDataRights();
    }

    public ngOnInit() {
        this.getPDDate();

        setTimeout(function () {
            $(".enttname input").focus();

            $(".ui-picklist-buttons").hide();
            $(".ui-picklist-source-controls").show();
            $(".ui-picklist-target-controls").show();
        }, 100);
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
        var that = this;

        if (Cookie.get('_enttnm_') != null) {
            this.enttid = parseInt(Cookie.get('_enttid_'));
            this.enttname = Cookie.get('_enttnm_');

            this.fillBatchDropDown();
            this.fillDriverDropDown();
            this.fillVehicleDropDown();
            this.fillRouteDropDown();
        }
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
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "issysadmin": this.loginUser.issysadmin,
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
            "flag": "attd",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._wsdetails.wsautoid,
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
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._wsdetails.wsautoid,
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
            this.pickattid = event.uid;
            this.pickattname = event.uname;
            this.addPickAttData();
        }
        else if (type === "dropatt") {
            this.dropattid = event.uid;
            this.dropattname = event.uname;
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
            "flag": "dropdown",
            "group": "driver",
            "id": that.enttid,
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
            "flag": "dropdown",
            "group": "vehicle",
            "id": that.enttid,
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
            "flag": "dropdown",
            "group": "route",
            "id": that.enttid,
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

        that._pickdropservice.getPickDropDetails({
            "flag": "dropdown",
            "group": "pickpsngr",
            "id": that.pickrtid,
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

        that._pickdropservice.getPickDropDetails({
            "flag": "dropdown",
            "group": "droppsngr",
            "id": that.droprtid,
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

        // that.dropPassengerDT = that.reverseArr(that.pickPassengerDT);
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

    getPickDropInfo() {
        commonfun.loader();
        var that = this;

        var pickalldata = [];
        var dropalldata = [];
        var pickdata = [];
        var dropdata = [];

        this._pickdropservice.getPickDropDetails({
            "flag": "view", "mode": "add", "schoolid": that.enttid, "batchid": that.batchid, "wsautoid": that._wsdetails.wsautoid
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
                        that.pickdriverid = pickdata[0].driverid;
                        that.pickvehicleid = pickdata[0].vehicleno;
                        that.pickpsngrtype = pickdata[0].psngrtype;
                        that.pickrtid = pickdata[0].rtid;
                        that.pickPassengerDT = pickdata[0].studentdata;
                        that.pickAttList = pickdata[0].attendantdata;
                        console.log(pickdata);
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
            that._msg.Show(messageType.error, "Error", "Enter Entity");
            $(".enttname input").focus();
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
            $(".pickpassengername").focus();
            return false;
        }
        /*else if (that.dropdriverid === 0) {
            that._msg.Show(messageType.error, "Error", "Select Drop Driver");
            $(".ddrv").focus();
            return false;
        }
        else if (that.dropvehicleid === "") {
            that._msg.Show(messageType.error, "Error", "Select Drop Vehicle No");
            $(".dveh").focus();
            return false;
        }
        else if (that.dropPassengerDT.length === 0) {
            that._msg.Show(messageType.error, "Error", "Please Fill atleast 1 Drop Passenger");
            $(".droppassengername").focus();
            return false;
        }
        else if (that.droprtid === 0) {
            that._msg.Show(messageType.error, "Error", "Select Drop Route");
            $(".droute").focus();
            return false;
        }*/
        else if (that.ispickup == false && that.isdrop == false) {
            that._msg.Show(messageType.error, "Error", "Please Select atleast 1 Pick up / Drop Checkbox");
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
                    "schid": that.enttid,
                    "schnm": that.enttname,
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
                    "wsautoid": that._wsdetails.wsautoid,
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
                    "schid": that.enttid,
                    "schnm": that.enttname,
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
                    "wsautoid": that._wsdetails.wsautoid,
                    "isactive": that.isdrop
                });
            }

            savepickdrop = { "pickdropdata": _pickdrop };

            that._pickdropservice.savePickDropInfo(savepickdrop).subscribe((data) => {
                try {
                    var dataResult = data.data;

                    if (dataResult[0].funsave_pickdropinfo.msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", dataResult[0].funsave_pickdropinfo.msg);
                        that.resetPickDropFields();
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

    resetPickDropFields() {
        var that = this;

        that.batchid = 0;

        that.pickautoid = 0;
        that.pickdriverid = 0;
        that.pickvehicleid = "";
        that.pickpsngrtype = "bypsngr";
        that.pickrtid = 0;
        that.pickPassengerDT = [];
        that.pickAttList = [];
        that.ispickup = that.pickPassengerDT.length == 0 ? false : true;

        that.dropautoid = 0;
        that.dropdriverid = 0;
        that.dropvehicleid = "";
        that.droppsngrtype = "bypsngr";
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
}