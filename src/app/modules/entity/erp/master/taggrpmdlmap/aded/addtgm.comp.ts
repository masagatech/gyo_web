import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { TagService } from '@services/erp';

declare var google: any;

@Component({
    templateUrl: 'addtgm.comp.html',
    providers: [CommonService]
})

export class AddTagGroupModuleMapComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    tgmid: number = 0;
    moduleDT: any = [];
    mdlcode: string = "";

    tagGroupDT: any = [];

    private subscribeParameters: any;

    constructor(private _tagservice: TagService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
    }

    public ngOnInit() {
        this.getTagGroupModuleMap();

        setTimeout(function () {
            $(".grpname").focus();
        }, 200);
    }

    // Clear Fields

    resetTagGroupModuleMapFields() {
        var that = this;

        that.mdlcode = "";
    }

    // Fill Group Drop Down and Checkbox List For Standard

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._tagservice.getTagGroupModuleMap({
            "flag": "dropdown",
            "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.moduleDT = data.data.filter(a => a.group == "module");
                that.tagGroupDT = data.data.filter(a => a.group == "taggroup");
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

    // Get Tag Group Rights

    getTagGroupRights() {
        var that = this;
        var tagitem = null;

        var actrights = "";
        var tagights = {};

        for (var i = 0; i <= that.tagGroupDT.length - 1; i++) {
            tagitem = null;
            tagitem = that.tagGroupDT[i];

            if (tagitem !== null) {
                $("#tag" + tagitem.id).find("input[type=checkbox]").each(function () {
                    actrights += (this.checked ? $(this).val() + "," : "");
                });

                if (actrights != "") {
                    tagights = actrights.slice(0, -1);
                }
            }
        }

        return tagights;
    }

    private selectAndDeselectAllCheckboxes() {
        if ($("#selectall").is(':checked')) {
            $(".allcheckboxes input[type=checkbox]").prop('checked', true);
        }
        else {
            $(".allcheckboxes input[type=checkbox]").prop('checked', false);
        }
    }

    private clearcheckboxes(): void {
        $(".allcheckboxes input[type=checkbox]").prop('checked', false);
    }

    // Save Tag Group Module Map

    saveTagGroupModuleMap() {
        var that = this;
        var _taggrprights = null;

        _taggrprights = that.getTagGroupRights();

        if (that.mdlcode == "") {
            that._msg.Show(messageType.error, "Error", "Select Module");
            $(".mdlname").focus();
        }
        else {
            commonfun.loader();

            var savetgm = {
                "tgmid": that.tgmid,
                "mdlcode": that.mdlcode,
                "taggrpid": "{" + _taggrprights + "}",
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid
            }

            this._tagservice.saveTagGroupModuleMap(savetgm).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_taggrpmdlmap;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetTagGroupModuleMapFields();
                        }
                        else {
                            that.backViewData();
                        }
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
                    }

                    commonfun.loaderhide();
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
    }

    // Get Tag Group Module Map

    getTagGroupModuleMap() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.tgmid = params['id'];

                that._tagservice.getTagGroupModuleMap({
                    "flag": "edit", "tgmid": that.tgmid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
                }).subscribe(data => {
                    try {
                        var viewtgm = data.data;

                        that.tgmid = viewtgm[0].tgmid;
                        that.mdlcode = viewtgm[0].mdlcode;

                        var _tagrights = null;
                        var _tagitem = null;

                        if (viewtgm[0] != null) {
                            _tagrights = null;
                            _tagrights = viewtgm[0].taggrpid;

                            if (_tagrights != null) {
                                for (var i = 0; i < _tagrights.length; i++) {
                                    _tagitem = null;
                                    _tagitem = _tagrights[i];

                                    if (_tagitem != null) {
                                        $("#selectall").prop('checked', true);
                                        $("#tag" + _tagitem).find("#" + _tagitem).prop('checked', true);
                                    }
                                    else {
                                        $("#selectall").prop('checked', false);
                                    }
                                }
                            }
                            else {
                                $("#selectall").prop('checked', false);
                            }
                        }
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
                that.resetTagGroupModuleMapFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/erp/master/taggroupmodulemap']);
    }
}
