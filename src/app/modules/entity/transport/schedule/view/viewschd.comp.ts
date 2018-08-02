import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { Globals, LoginUserModel } from '@models';
import { PickDropService } from '@services/master';

@Component({
    templateUrl: 'viewschd.comp.html'
})

export class ViewScheduleComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    scheduleDT: any = [];

    pickAttList: any = [];
    dropAttList: any = [];

    pickPassengerDT: any = [];
    dropPassengerDT: any = [];

    batchDT: any = [];

    batchid: number = 0;
    pickautoid: number = 0;
    pickdrvid: number = 0;
    pickdrvname: string = "";
    pickvehname: string = "";

    dropautoid: number = 0;
    dropdrvid: number = 0;
    dropdrvname: string = "";
    dropvehname: string = "";
    drpvehname: string = "";

    instrunction: string = "";

    pickwkdays: string = "";
    pickfromdate: any = "";
    picktodate: any = "";

    dropwkdays: string = "";
    dropfromdate: any = "";
    droptodate: any = "";

    routeDT: any = [];
    pickrtid: number = 0;
    pickrtname: string = "";
    droprtid: number = 0;
    droprtname: string = "";

    ispickup: boolean = true;
    isdrop: boolean = true;

    constructor(private _pickdropservice: PickDropService, private _routeParams: ActivatedRoute,
        private _loginservice: LoginService, private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillBatchDropDown();
    }

    public ngOnInit() {

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

    // Read

    getPickDropInfo() {
        commonfun.loader();
        var that = this;

        var pickalldata = [];
        var dropalldata = [];
        var pickdata = [];
        var dropdata = [];

        this._pickdropservice.getPickDropDetails({
            "flag": "view", "mode": "add", "batchid": that.batchid, "schoolid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.scheduleDT = data.data;

                if (that.scheduleDT.length !== 0) {
                    pickalldata = that.scheduleDT.filter(a => a.typ === "p");
                    dropalldata = that.scheduleDT.filter(a => a.typ === "d");

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
                        that.pickfromdate = pickdata[0].getfrmdt;
                        that.picktodate = pickdata[0].gettodt;
                        that.pickdrvid = pickdata[0].driverid;
                        that.pickdrvname = pickdata[0].drivername;
                        that.pickvehname = pickdata[0].vehicleno;
                        that.pickrtid = pickdata[0].rtid;
                        that.pickrtname = pickdata[0].rtname;
                        that.pickPassengerDT = pickdata[0].studentdata;
                        that.pickAttList = pickdata[0].attendantdata;
                        that.ispickup = pickdata[0].isactive;
                    }
                    else {
                        that.pickwkdays = "";
                        that.pickfromdate = "";
                        that.picktodate = "";
                        that.pickdrvid = 0;
                        that.pickdrvname = "";
                        that.pickvehname = "";
                        that.pickrtid = 0;
                        that.pickrtname = "";
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
                        that.dropfromdate = pickdata[0].getfrmdt;
                        that.droptodate = pickdata[0].gettodt;
                        that.dropdrvid = dropdata[0].driverid;
                        that.dropdrvname = dropdata[0].drivername;
                        that.dropvehname = dropdata[0].vehicleno;
                        that.droprtid = dropdata[0].rtid;
                        that.droprtname = dropdata[0].rtname;
                        that.dropPassengerDT = dropdata[0].studentdata;
                        that.dropAttList = dropdata[0].attendantdata;
                        that.isdrop = dropdata[0].isactive;
                    }
                    else {
                        that.dropwkdays = "";
                        that.dropfromdate = "";
                        that.droptodate = "";
                        that.dropdrvid = 0;
                        that.dropdrvname = "";
                        that.dropvehname = "";
                        that.droprtid = 0;
                        that.droprtname = "";
                        that.dropPassengerDT = [];
                        that.dropAttList = [];
                        that.isdrop = false;
                    }
                }
                else {
                    that.ispickup = true;
                    that.pickwkdays = "";
                    that.pickautoid = 0;
                    that.pickfromdate = "";
                    that.picktodate = "";
                    that.pickdrvid = 0;
                    that.pickdrvname = "";
                    that.pickvehname = "";
                    that.pickrtid = 0;
                    that.pickrtname = "";
                    that.pickPassengerDT = [];
                    that.pickAttList = [];

                    that.isdrop = true;
                    that.dropwkdays = "";
                    that.dropautoid = 0;
                    that.dropfromdate = "";
                    that.droptodate = "";
                    that.dropdrvid = 0;
                    that.dropdrvname = "";
                    that.dropvehname = "";
                    that.droprtid = 0;
                    that.droprtname = "";
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

    public addPickDropInfo() {
        this._router.navigate(['/transport/schedule/add']);
    }

    public editPickDropInfo() {
        if (this.batchid == 0) {
            this._router.navigate(['/transport/schedule/edit']);
        }
        else {
            this._router.navigate(['/transport/schedule/edit', this.batchid]);
        }
    }
}