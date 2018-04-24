import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { NoticeboardService } from '@services/erp';

@Component({
    templateUrl: 'viewnb.comp.html',
    providers: [CommonService]
})

export class ViewNoticeboardComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    noticeboardDT: any = [];
    nbtype: string = "";
    nbtypenm: string = "";

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _nbservice: NoticeboardService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getNoticeboard();
    }

    public ngOnInit() {

    }

    // Noticeboard

    getNoticeboard() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            var _flag = "";

            if (params['psngrtype'] !== undefined) {
                that.nbtype = params['psngrtype'];

                if (that.nbtype == "school") {
                    _flag = "school";
                    that.nbtypenm = 'School';
                }
                else if (that.nbtype == "class") {
                    _flag = "class";
                    that.nbtypenm = 'Class';
                }
                else if (that.nbtype == "teacher") {
                    _flag = "staff";
                    that.nbtypenm = 'Teacher';
                }
                else {
                    _flag = "staff";
                    that.nbtypenm = 'Employee';
                }
            }
            else {
                _flag = "staff";
                that.nbtype = "passenger";
                that.nbtypenm = 'Passenger';
            }

            that._nbservice.getNoticeboard({
                "flag": _flag, "uid": that.loginUser.uid, "utype": that.loginUser.utype, "stafftype": that.nbtype,
                "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
            }).subscribe(data => {
                try {
                    that.noticeboardDT = data.data;
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
        });
    }

    public addNoticeboard() {
        if (this.nbtype == "teacher") {
            this._router.navigate(['/erp/teacher/noticeboard/add']);
        }
        else if (this.nbtype == "employee") {
            this._router.navigate(['/erp/employee/noticeboard/add']);
        }
        else {
            this._router.navigate(['/communication/noticeboard/' + this.nbtype + '/add']);
        }
    }

    public editNoticeboard(row) {
        if (this.nbtype == "teacher") {
            this._router.navigate(['/erp/teacher/noticeboard/edit', row.nbid]);
        }
        else if (this.nbtype == "employee") {
            this._router.navigate(['/erp/employee/noticeboard/edit', row.nbid]);
        }
        else {
            this._router.navigate(['/communication/noticeboard/' + this.nbtype + '/edit', row.nbid]);
        }
    }
}
