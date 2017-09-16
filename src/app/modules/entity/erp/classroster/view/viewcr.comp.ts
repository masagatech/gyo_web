import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ClassRosterService } from '@services/erp';

@Component({
    templateUrl: 'viewcr.comp.html',
    providers: [CommonService]
})

export class ViewClassRosterComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    clsrstid: number = 0;

    ayDT: any = [];
    ayid: number = 0;

    classDT: any = [];
    classid: number = 0;

    events: any = [];
    header: any;
    event: MyEvent;
    dialogVisible: boolean = false;
    idGen: number = 100;
    defaultDate: string = "";

    subjectDT: any = [];
    classRosterDT: any = [];

    id: number = 0;
    subid: number = 0;
    strtm: any = "";
    endtm: any = "";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private cd: ChangeDetectorRef,
        private _loginservice: LoginService, private _autoservice: CommonService, private _clsrstservice: ClassRosterService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getDefaultDate();
    }

    public ngOnInit() {
        var that = this;

        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();

            $(".ui-picklist-buttons").hide();
            $(".ui-picklist-source-controls").show();
            $(".ui-picklist-target-controls").show();
        }, 100);

        that.header = {
            left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay'
        };

        that.refreshButtons();
    }

    refreshButtons() {
        setTimeout(function () {
            commonfun.chevronstyle();
        }, 0);
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

    // Fill Class Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._clsrstservice.getClassRoster({
            "flag": "dropdown", "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");
                that.classDT = data.data.filter(a => a.group == "class");
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

    // Fill Subject Drop Down

    fillSubjectDropDown() {
        var that = this;
        commonfun.loader();

        that._clsrstservice.getClassRoster({
            "flag": "subjectddl", "classid": that.classid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.subjectDT = data.data;
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

    // Get Class Roster

    getClassRoster() {
        var that = this;
        commonfun.loader();

        that._clsrstservice.getClassRoster({
            "flag": "calendar", "ayid": that.ayid, "classid": that.classid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.classRosterDT = data.data;
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

    handleDayClick(event) {
        this.id = 0;
        this.subid = 0;
        this.strtm = "";
        this.endtm = "";

        this.dialogVisible = true;
    }
    
    handleEventClick(e) {
        this.id = e.calEvent.id;
        this.subid = e.calEvent.subid;
        this.strtm = e.calEvent.strtm;
        this.endtm = e.calEvent.endtm;

        this.dialogVisible = true;
    }
    
    saveEvent() {
        //update
        if(this.event.subid) {
            let index: number = this.findEventIndexById(this.event.subid);
            if(index >= 0) {
                this.events[index] = this.event;
            }
        }

        //new
        else {
            this.event.subid = this.idGen++;
            this.events.push(this.event);
            this.event = null;
        }
        
        this.dialogVisible = false;
    }
    
    findEventIndexById(id: number) {
        let index = -1;

        for(let i = 0; i < this.events.length; i++) {
            if(id == this.events[i].id) {
                index = i;
                break;
            }
        }
        
        return index;
    }
    
    deleteEvent() {
        let index: number = this.findEventIndexById(this.event.subid);
        if(index >= 0) {
            this.events.splice(index, 1);
        }
        this.dialogVisible = false;
    }

    addNewClassRoster() {
        this._router.navigate(['/erp/classroster/add']);
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}

export class MyEvent {
    id: number;
    subid: number;
    title: string;
    start: string;
    end: string;
    strtm: string;
    endtm: string;
}