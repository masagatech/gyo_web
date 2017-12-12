import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService, messageType, AuthenticationService, LoginService } from '@services';
import { UserReq, LoginUserModel, Globals } from '@models';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'login.comp.html',
    providers: [AuthenticationService]
})

export class LoginComponent implements OnInit, OnDestroy {
    public errorMsg = '';
    public btnLoginText = 'Login';

    headertitle: string = "";

    _user = new UserReq("", "");

    constructor(private _router: Router, private _service: AuthenticationService, private _loginservice: LoginService, private _msg: MessageService) {
        var that = this;
        var checks = this._service.checkCredentials();

        if (checks.status) that._router.navigate(['/']);

        if (checks.takefrmdb) {
            that._service.getSession(function (e) {
                if (e == "success")
                    that._router.navigate(['/']);
            }, checks);
        }

        Cookie.deleteAll();

        that.getHeaderTitle();
    }

    getHeaderTitle() {
        if (Globals.weburl == "school.goyo.in") {
            this.headertitle = "School Management System";
        }
        else if (Globals.weburl == "track.goyo.in") {
            this.headertitle = "Vehicle Tracking";
        }
        else {
            this.headertitle = "School Management System";
        }
    }

    login(e) {
        var that = this;
        that.btnLoginText = "Loging..";

        commonfun.loader("#loginloader");

        that._service.login(that._user).subscribe(d => {
            try {
                if (d) {
                    if (d.status) {
                        let usrobj = d.data;
                        let userDetails: LoginUserModel = usrobj[0];

                        if (userDetails.status) {
                            that._loginservice.setUsers(userDetails);

                            if (userDetails.issysadmin) {
                                if (userDetails.utype == "admin") {
                                    that._router.navigate(['/admin/workspace']);
                                }
                                else {
                                    Cookie.set("_schwsdetails_", JSON.stringify(userDetails));
                                    that._router.navigate(['/workspace/entity']);
                                }
                            }
                            else {
                                Cookie.set("_schwsdetails_", JSON.stringify(userDetails));
                                that._router.navigate(['/workspace/entity']);
                                
                                // if (userDetails.isemp) {
                                //     Cookie.set("_schenttdetails_", JSON.stringify(userDetails));
                                //     that._router.navigate(['/']);
                                // }
                                // else {
                                //     Cookie.set("_schwsdetails_", JSON.stringify(userDetails));
                                //     that._router.navigate(['/workspace/entity']);
                                // }
                            }
                        } else {
                            that._msg.Show(messageType.error, "Error", userDetails.errmsg);
                        }
                    }
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#loginloader");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide("#loginloader");
        });

        e.preventDefault();
    }

    ngOnInit() {
        if (Globals.weburl == "school.goyo.in") {
            $('body').addClass('school-bg-img');
        }
        else if (Globals.weburl == "track.goyo.in") {
            $('body').addClass('track-bg-img');
        }
        else {
            $('body').addClass('school-bg-img');
        }
    }

    ngOnDestroy() {
        $('body').removeClass('school-bg-img');
        $('body').removeClass('track-bg-img');
    }
}