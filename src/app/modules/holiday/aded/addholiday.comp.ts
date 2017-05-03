import { Component, OnInit } from '@angular/core';
import { HolidayService } from '../../../_services/holiday/holiday-service';
import { CommonService } from '../../../_services/common/common-service'; /* add reference for master of master */
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { Router, ActivatedRoute } from '@angular/router';
import { Globals } from '../../../_const/globals';
import { LazyLoadEvent } from 'primeng/primeng';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addholiday.comp.html',
    providers: [HolidayService, CommonService]
})

export class AddHolidayComponent implements OnInit {
    hldid: number = 0;
    frmdt: any = "";
    todt: any = "";

    hldcd: string = "";
    hldnm: string = "";
    hlddesc: string = "";

    schoolDT: any = [];
    schoolList: any = [];
    schid: number = 0;
    schoolname: string = "";

    private subscribeParameters: any;

    constructor(private _holidayervice: HolidayService, private _autoservice: CommonService, private _routeParams: ActivatedRoute,
        private _router: Router, private _msg: MessageService) {

    }

    public ngOnInit() {
        var that = this;
        this.getHolidayDetails();
    }

    // Auto Completed School

    getSchoolData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "school",
            "search": query
        }).then((data) => {
            this.schoolDT = data;
        });
    }

    // Selected Owners

    selectSchoolData(event) {
        this.schid = event.value;
        this.schoolname = event.label;

        this.addSchoolList();
        $(".schoolname input").focus();
    }

    // Read Get School

    addSchoolList() {
        var that = this;

        that.schoolList.push({
            "schid": that.schid, "schnm": that.schoolname
        });

        that.schid = 0;
        that.schoolname = "";
    }

    deleteSchool(row) {
        this.schoolList.splice(this.schoolList.indexOf(row), 1);
    }

    // Save Data

    saveHolidayInfo() {
        var that = this;
        commonfun.loader();

        var _schlist: string[] = [];

        _schlist = Object.keys(that.schoolList).map(function (k) { return that.schoolList[k].schid });

        var saveholiday = {
            "hldid": that.hldid,
            "hldcd": that.hldcd,
            "hldnm": that.hldnm,
            "hlddesc": that.hlddesc,
            "school": _schlist,
            "frmdt": that.frmdt,
            "todt": that.todt,
            "uid": "vivek"
        }

        this._holidayervice.saveHoliday(saveholiday).subscribe(data => {
            try {
                var dataResult = data.data;

                if (dataResult[0].funsave_holiday.msgid != "-1") {
                    this._msg.Show(messageType.success, "Success", dataResult[0].funsave_holiday.msg);
                    commonfun.loaderhide();
                }
                else {
                    var msg = dataResult[0].funsave_holiday.msg;
                    this._msg.Show(messageType.error, "Error", dataResult[0].funsave_holiday.msg);
                    commonfun.loaderhide();
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {
            // console.log("Complete");
        });
    }

    // Get Holiday Data

    getHolidayDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.hldid = params['id'];

                that._holidayervice.getHoliday({ "flag": "edit", "id": that.hldid }).subscribe(data => {
                    try {
                        that.hldid = data.data[0].hldid;
                        that.hldcd = data.data[0].hldcd;
                        that.hldnm = data.data[0].hldnm;
                        that.hlddesc = data.data[0].hlddesc;
                        that.frmdt = data.data[0].frmdt;
                        that.todt = data.data[0].todt;
                        that.schoolList = data.data[0].school !== null ? data.data[0].school : [];
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
            else {
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/holiday']);
    }
}