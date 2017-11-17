import { Cookie } from 'ng2-cookies/ng2-cookies';

export class Globals {
    static erproute: string = "erp/";
    photoid: number = 29;
    xlsid: number = 24;

    static weburl: string = window.location.hostname;

    serviceurl: string = "http://" + Globals.weburl + ":8082/goyoapi/";
    uploadurl: string = "http://" + Globals.weburl + ":8082/images/";
    static socketurl: string = "http://" + Globals.weburl + ":8082/";
    
    // filepath: string = "www\\uploads\\";
    // xlsfilepath: string = "www\\uploads\\exceluploads\\";
    
    filepath: string = "www/uploads/";
    xlsfilepath: string = "www/uploads/exceluploads/";

    static socketurl_trk: string = "http://35.154.114.229:6979/";
    trackurl_trk: string = "http://35.154.114.229:6979/goyoapi/";

    otherurl: string = "http://35.154.27.42:8081/goyoapi/";

    // serviceurl: string = "http://localhost:8082/goyoapi/";
    // uploadurl: string = "http://localhost:8082/images/";
    // static socketurl: string = "http://localhost:8082/";

    // serviceurl: string = "http://school.goyo.in:8082/goyoapi/";
    // uploadurl: string = "http://school.goyo.in:8082/images/";
    // static socketurl: string = "http://school.goyo.in:8082/";

    public static getWSDetails() {
        let _wsdetails = Cookie.get("_schwsdetails_");

        if (_wsdetails !== null) {
            return JSON.parse(_wsdetails);
        }
        else {
            return {};
        }
    }

    public static getEntityDetails() {
        let _enttdetails = Cookie.get("_schenttdetails_");

        if (_enttdetails !== null) {
            return JSON.parse(_enttdetails);
        }
        else {
            return {};
        }
    }
}