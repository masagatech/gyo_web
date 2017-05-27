import { Component, OnInit, ViewChild } from '@angular/core';
import { PickDropService } from '../../_services/pickdrop/pickdrop-service';
import { CommonService } from '../../_services/common/common-service'; /* add reference for master of master */
import { MessageService, messageType } from '../../_services/messages/message-service';
import { LoginService } from '../../_services/login/login-service';
import { LoginUserModel } from '../../_model/user_model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: 'viewpd.comp.html',
    providers: [PickDropService, CommonService]
})

export class ChangeScheduleComponent implements OnInit {
    loginUser: LoginUserModel;

    events: any[];
    header: any;
    event: MyEvent;
    defaultDate: string = "";

    ownersDT: any = [];
    ownerid: number = 0;
    ownername: string = "";

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

    entityDT: any = [];
    batchDT: any = [];
    driverDT: any = [];
    vehicleDT: any = [];

    entityid: number = 0;
    batchid: number = 0;
    pickautoid: number = 0;
    pickdriverid: number = 0;
    pickvehicleno: string = "";

    dropautoid: number = 0;
    dropdriverid: number = 0;
    dropvehicleno: string = "";

    instrunction: string = "";

    pickfromdate: any = "";
    picktodate: any = "";
    dropfromdate: any = "";
    droptodate: any = "";

    constructor(private _pickdropservice: PickDropService, private _autoservice: CommonService, private _routeParams: ActivatedRoute,
        private _loginservice: LoginService, private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
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

    // Selected Calendar Date

    getPDDate(event) {
        this.pickfromdate = this.formatDate(event.date);
        this.picktodate = this.formatDate(event.date);
        this.dropfromdate = this.formatDate(event.date);
        this.droptodate = this.formatDate(event.date);
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

    // Auto Completed Co-ordinator / Attendent

    getOwnerData(event, otype) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "owner",
            "uid": this.loginUser.uid,
            "typ": this.loginUser.utype,
            "otype": otype,
            "search": query
        }).then(data => {
            this.ownersDT = data;
        });
    }

    // Auto Completed Passenger

    getPassengerData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "passenger",
            "search": query,
            "id": this.entityid
        }).then((data) => {
            this.passengerDT = data;
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
            this.ownerid = event.value;
            this.ownername = event.label;
            this.fillEntityDropDown(this.ownerid);
            this.fillDriverDropDown(this.ownerid);
            this.fillVehicleDropDown(this.ownerid);
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

    // Entity DropDown

    fillEntityDropDown(_ownerid) {
        var that = this;

        that._pickdropservice.getPickDropDetails({ "flag": "dropdown", "group": "entity", "id": _ownerid }).subscribe((data) => {
            try {
                that.entityDT = data.data;
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

    // Batch DropDown

    fillBatchDropDown() {
        var that = this;

        that._pickdropservice.getPickDropDetails({ "flag": "dropdown", "group": "batch", "id": that.entityid }).subscribe((data) => {
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

    fillDriverDropDown(_ownerid) {
        var that = this;

        that._pickdropservice.getPickDropDetails({ "flag": "dropdown", "group": "driver", "id": _ownerid }).subscribe((data) => {
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

    fillVehicleDropDown(_ownerid) {
        var that = this;

        that._pickdropservice.getPickDropDetails({ "flag": "dropdown", "group": "vehicle", "id": _ownerid }).subscribe((data) => {
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

    // copy pick driver in drop driver

    setDropDriver() {
        this.dropdriverid = this.pickdriverid;
    }

    // copy pick vehicle in drop vehicle

    setDropVehicle() {
        this.dropvehicleno = this.pickvehicleno;
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
            "flag": "edit", "ownerid": that.ownerid, "schoolid": that.entityid, "batchid": that.batchid, "frmdt": event.date, "todt": event.date
        }).subscribe(data => {
            try {
                var d = data.data;

                if (d.length !== 0) {
                    var pickdata = d.filter(a => a.typ === "p")[0];

                    if (pickdata.length !== 0) {
                        that.pickautoid = pickdata.autoid;
                        that.pickdriverid = pickdata.driverid;
                        that.pickvehicleno = pickdata.vehicleno;
                        that.pickPassengerDT = pickdata.studentdata;
                        that.pickfromdate = pickdata.frmdt;
                        that.picktodate = pickdata.todt;
                    }
                    else {
                        that.pickautoid = 0;
                        that.pickdriverid = 0;
                        that.pickvehicleno = "";
                        that.pickPassengerDT = [];

                        that.getPDDate(event);
                    }

                    var dropdata = d.filter(a => a.typ === "d")[0];

                    if (dropdata.length !== 0) {
                        that.dropautoid = dropdata.autoid;
                        that.dropdriverid = dropdata.driverid;
                        that.dropvehicleno = dropdata.vehicleno;
                        that.dropPassengerDT = dropdata.studentdata;
                        that.dropfromdate = dropdata.frmdt;
                        that.droptodate = dropdata.todt;
                    }
                    else {
                        that.dropautoid = 0;
                        that.dropdriverid = 0;
                        that.dropvehicleno = "";
                        that.dropPassengerDT = [];

                        that.getPDDate(event);
                    }
                }
                else {
                    that.pickautoid = 0;
                    that.pickdriverid = 0;
                    that.pickvehicleno = "";
                    that.pickPassengerDT = [];

                    that.dropautoid = 0;
                    that.dropdriverid = 0;
                    that.dropvehicleno = "";
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

    // Save

    savePickDropInfo() {
        var that = this;

        if (that.ownername === "") {
            that._msg.Show(messageType.error, "Error", "Enter Owner Name");
            $(".ownername input").focus();
        }
        else if (that.entityid === 0) {
            that._msg.Show(messageType.error, "Error", "Select Entity");
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
                _pickstudsid = Object.keys(_pickstudDT).map(function (k) { return _pickstudDT[k].stdid });
                _dropstudsid = Object.keys(_dropstudDT).map(function (k) { return _dropstudDT[k].stdid });

                _pickdrop.push({
                    "autoid": that.pickautoid,
                    "ownid": that.ownerid,
                    "schid": that.entityid,
                    "schnm": that.entityid,
                    "btchid": that.batchid,
                    "drvid": that.pickdriverid,
                    "vhclno": that.pickvehicleno,
                    "studdt": _pickstudDT,
                    "studsid": _pickstudsid,
                    "uid": "vivek",
                    "inst": that.instrunction,
                    "frmdt": that.pickfromdate,
                    "todt": that.picktodate,
                    "typ": "p"
                });
            }

            if (that.dropPassengerDT.length !== 0) {
                _pickdrop.push({
                    "autoid": that.dropautoid,
                    "ownid": that.ownerid,
                    "schid": that.entityid,
                    "schnm": that.entityid,
                    "btchid": that.batchid,
                    "drvid": that.dropdriverid == 0 ? that.pickdriverid : that.dropdriverid,
                    "vhclno": that.dropvehicleno,
                    "studdt": _dropstudDT,
                    "studsid": _dropstudsid,
                    "uid": "vivek",
                    "inst": that.instrunction,
                    "frmdt": that.dropfromdate,
                    "todt": that.droptodate,
                    "typ": "d"
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