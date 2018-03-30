import { Cookie } from 'ng2-cookies/ng2-cookies';

export class Globals {
    static erproute: string = "erp/";
    photoid: number = 29;
    xlsid: number = 24;

<<<<<<< HEAD
    // static weburl: string = "school.goyo.in"; 
    //static weburl: string = "track.goyo.in";
=======
    // static weburl: string = "school.goyo.in";
    // static weburl: string = "track.goyo.in";

>>>>>>> origin/master
    static weburl: string = window.location.hostname;
    static port: string = "8082";

    serviceurl: string = "http://" + Globals.weburl + ":" + Globals.port + "/goyoapi/";
    uploadurl: string = "http://" + Globals.weburl + ":" + Globals.port + "/images/";
    
    static socketurl: string = "http://" + Globals.weburl + ":" + Globals.port + "/";

    static reporturl: string = "http://" + Globals.weburl + ":8085/";

    filepath: string = "www\\uploads\\";
    xlsfilepath: string = "www\\exceluploads\\";

    // filepath: string = "www/uploads/";
    // xlsfilepath: string = "www/uploads/bulkupload/";

    static trkserv :string = "127.0.0.1"
    //static trkserv :string = "35.154.114.229"

    static socketurl_trk: string = "http://"+ Globals.trkserv+":6979/";
    trackurl_trk: string = "http://"+ Globals.trkserv+":6979/goyoapi/";

    otherurl: string = "http://35.154.27.42:8081/goyoapi/";

    // Functions

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