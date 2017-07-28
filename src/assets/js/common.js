$(function () {
    $(".ui-radiobutton-box").find('span').hide();
});

var commonfun = {};

function findJSON(obj, key, val, brek) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(findJSON(obj[i], key, val));
        } else if (i == key && obj[key] == val) {

            objects.push(obj);
            if (brek !== undefined) {
                break;
            }
        }
    }

    return objects;
}

commonfun.addrequire = function addrequire() {
    $("[validate]").each(function () {
        $(this).siblings("label").remove("span").append("&nbsp;<span class='require'>*</span>");
    });
}

commonfun.validate = function validate() {
    var valisValid = true;
    var result = [];
    var msglist = "";
    $("[validate]").each(function () {
        if ($(this).is("input") || $(this).is("textarea")) {
            if ($(this).val().trim() === "") {
                valisValid = false;
                msglist += $(this).siblings("label").text() + " is required. ";
                result.push({ "input": $(this), "label": $(this).siblings("label").text() });
            }
        } else if ($(this).is("select")) {
            if ($(this).val().trim() === $(this).attr("validate")) {
                valisValid = false;
                msglist += $(this).siblings("label").text() + " is required. ";
                result.push({ "input": $(this), "label": $(this).siblings("label").text() });
            }
        }
    });

    return { "status": valisValid, "data": result, "msglist": msglist };
}

commonfun.loader = function (name, effects, text) {
    if (!name) name = '.maincontent';
    if (!effects) effects = 'bounce';
    if (!text) text = '';

    $(name).waitMe({
        effect: effects,
        text: text,
        bg: 'rgba(255, 255, 255, 0.7)',
        color: '#000',
        maxSize: '',
        textPos: 'vertical',
        fontSize: '',
        source: ''
    });
}

commonfun.loaderhide = function (name) {
    if (!name) name = '.maincontent';
    $(name).waitMe('hide');
}

commonfun.openurl = function (url, target, options) {
    window.open(url, target, options);
    //"https://www.w3schools.com", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400"
}

commonfun.navistyle = function () {
    $(".ui-paginator-first").addClass('btn-theme');
    $(".ui-paginator-prev").addClass('btn-theme');
    $(".ui-paginator-next").addClass('btn-theme');
    $(".ui-paginator-last").addClass('btn-theme');

    // $(".ui-paginator-first").addClass('btn-navigate').find('span').addClass('btn btn-sm material-icons').text("first_page");
    // $(".ui-paginator-prev").addClass('btn-navigate').find('span').addClass('btn btn-sm material-icons').text("navigate_before");
    // $(".ui-paginator-next").addClass('btn-navigate').find('span').addClass('btn btn-sm material-icons').text("navigate_next");
    // $(".ui-paginator-last").addClass('btn-navigate').find('span').addClass('btn btn-sm material-icons').text("last_page");
}

commonfun.chevronstyle = function () {
    $(".fc-prev-button").addClass('btn btn-theme btn-xs').find('span').removeAttr('class').addClass('material-icons').text("chevron_left");
    $(".fc-next-button").addClass('btn btn-theme btn-xs').find('span').removeAttr('class').addClass('material-icons').text("chevron_right");
}

commonfun.orderstyle = function () {
    $(".ui-orderlist").find('.ui-grid-col-2').removeAttr('class').addClass('ui-grid-col-1');
    $(".ui-orderlist").find('.ui-grid-col-10').removeAttr('class').addClass('ui-grid-col-11');
}

commonfun.rdbtnstyle = function () {
    $(".ui-radiobutton-box").find('span').hide();
}

commonfun.setAdvanceControl = function () {
    var $demoMaskedInput = $('.demo-masked-input');

    $demoMaskedInput.find('.date').inputmask('dd/mm/yyyy', { placeholder: '__/__/____' });
    $demoMaskedInput.find('.time12').inputmask('hh:mm t', { placeholder: '__:__ _m', alias: 'time12', hourFormat: '12' });
    $demoMaskedInput.find('.email').inputmask({ alias: "email" });
    $demoMaskedInput.find('.mobile-number').inputmask('+99 (999) 999-99-99', { placeholder: '+__ (___) ___-__-__' });
}

commonfun.randomColor = function (brightness) {
    function randomChannel(brightness) {
        var r = 255 - brightness;
        var n = 0 | ((Math.random() * r) + brightness);
        var s = n.toString(16);
        return (s.length == 1) ? '0' + s : s;
    }
    return '#' + randomChannel(brightness) + randomChannel(brightness) + randomChannel(brightness);
}

function onSelection(me) {
    $(".def-box").removeClass("selection");
    $(me).addClass("selection");
}

var browserConf = {};
browserConf.setTitle = function (title) {
    document.title = title;
}

commonfun.chatinit = function () {
    $('.chat_body').slideToggle('slow');

    $('.chat_head').click(function () {
        $('.chat_body').slideToggle('slow');
    });

    $('.close').click(function () {
        $('.msg_box').hide();
    });
}

commonfun.getbearing = function (bearing) {
    if (bearing === undefined) {
        return 0;
    }
    if (bearing == 0) {
        return 0;
    } else if (bearing > 0 && bearing <= 45) {
        return 1;
    } else if (bearing > 45 && bearing <= 90) {
        return 2;
    } else if (bearing > 90 && bearing <= 135) {
        return 3;
    } else if (bearing > 135 && bearing <= 180) {
        return 4;
    } else if (bearing < 0 && bearing >= -45) {
        return 7;
    } else if (bearing < -45 && bearing >= -90) {
        return 6;
    } else if (bearing < -90 && bearing >= -135) {
        return 5;
    } else if (bearing < -135 && bearing >= -180) {
        return 0;
    } else {
        return 0;
    }
}

commonfun.map = {
    /**
     * Calculate the bearing between two positions as a value from 0-360
     *
     * @param lat1 - The latitude of the first position
     * @param lng1 - The longitude of the first position
     * @param lat2 - The latitude of the second position
     * @param lng2 - The longitude of the second position
     *
     * @return int - The bearing between 0 and 360
     */
    bearing: function (lat1, lng1, lat2, lng2) {
        var dLon = (lng2 - lng1);
        var y = Math.sin(dLon) * Math.cos(lat2);
        var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
        var brng = this._toDeg(Math.atan2(y, x));
        return 360 - ((brng + 360) % 360);
    },

    /**
     * Since not all browsers implement this we have our own utility that will
     * convert from degrees into radians
     *
     * @param deg - The degrees to be converted into radians
     * @return radians
     */
    _toRad: function (deg) {
        return deg * Math.PI / 180;
    },

    /**
     * Since not all browsers implement this we have our own utility that will
     * convert from radians into degrees
     *
     * @param rad - The radians to be converted into degrees
     * @return degrees
     */
    _toDeg: function (rad) {
        return rad * 180 / Math.PI;
    }
}