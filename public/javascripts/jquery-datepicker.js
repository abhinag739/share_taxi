/**
 * jquery-simple-datetimepicker (jquery.simple-dtpicker.js)
 * (c) Masanori Ohgita - 2013.
 * https://github.com/mugifly/jquery-simple-datetimepicker
 */

(function($) {
  var lang = {
    en: {
      days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      months: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
      sep: '-',
      format: 'YYYY-MM-DD hh:mm',
      prevMonth: 'Previous month',
      nextMonth: 'Next month',
      today: 'Today'
    },
    ja: {
      days: ['日', '月', '火', '水', '木', '金', '土'],
      months: [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ],
      sep: '/',
      format: 'YYYY/MM/DD hh:mm'
    },
    ru: {
      days: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      months: [ "Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек" ],
      format: 'DD.MM.YYYY hh:mm'
    },
    br: {
      days: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      months: [ "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" ],
      format: 'DD/MM/YYYY hh:mm'
    },
    pt: {
      days: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
      months: [ "janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro" ]
    },
    cn: {
      days: ['日', '一', '二', '三', '四', '五', '六'],
      months: [ "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月" ]
    },
    de: {
      days: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
      months: [ "Jan", "Feb", "März", "Apr", "Mai", "Juni", "Juli", "Aug", "Sept", "Okt", "Nov", "Dez" ],
      format: 'DD.MM.YYYY hh:mm'
    },
    sv: {
      days: ['Sö', 'Må', 'Ti', 'On', 'To', 'Fr', 'Lö'],
      months: [ "Jan", "Feb", "Mar", "Apr", "Maj", "Juni", "Juli", "Aug", "Sept", "Okt", "Nov", "Dec" ]
    },
    id: {
      days: ['Min','Sen','Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
      months: [ "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des" ]
    },
    it: {
      days: ['Dom','Lun','Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
      months: [ "Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic" ],
      format: 'DD/MM/YYYY hh:mm'
    },
    tr: {
      days: ['Pz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cu', 'Cts'],
      months: [ "Ock", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Agu", "Eyl", "Ekm", "Kas", "Arlk" ]
    },
    es: {
      days: ['dom', 'lun', 'mar', 'miér', 'jue', 'vié', 'sáb'],
      months: [ "ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic" ],
      format: 'DD/MM/YYYY hh:mm'
    },
    ko: {
      days: ['일', '월', '화', '수', '목', '금', '토'],
      months: [ "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월" ]
    },
    nl: {
      days: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
      months: [ "jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec" ],
      format: 'DD-MM-YYYY hh:mm'
    },
    cz: {
      days: ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'],
      months: [ "Led", "Úno", "Bře", "Dub", "Kvě", "Čer", "Čvc", "Srp", "Zář", "Říj", "Lis", "Pro" ],
      format: 'DD.MM.YYYY hh:mm'
    },
    fr: {
      days: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
      months: [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre" ],
      format: 'DD-MM-YYYY hh:mm'
    }
  };

  var PickerObjects = [];
  var InputObjects = [];
  var ActivePickerId = -1;

  var getParentPickerObject = function(obj) {
    return $(obj).closest('.datepicker');
  };

  var getPickersInputObject = function($obj) {
    var $picker = getParentPickerObject($obj);
    if ($picker.data("inputObjectId") != null) {
      return $(InputObjects[$picker.data("inputObjectId")]);
    }
    return null;
  }

  var setToNow = function($obj) {
    var $picker = getParentPickerObject($obj);
    var date = new Date();
    draw($picker, {
      "isAnim": true,
      "isOutputToInputObject": true
    }, date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
  };

  var beforeMonth = function($obj) {
    var $picker = getParentPickerObject($obj);
    var date = getPickedDate($picker);
    var targetMonth_lastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    if (targetMonth_lastDay < date.getDate()) {
      date.setDate(targetMonth_lastDay);
    }
    draw($picker, {
      "isAnim": true,
      "isOutputToInputObject": true
    }, date.getFullYear(), date.getMonth() - 1, date.getDate(), date.getHours(), date.getMinutes());

    var todayDate = new Date();
    var isCurrentYear = todayDate.getFullYear() == date.getFullYear();
    var isCurrentMonth = isCurrentYear && todayDate.getMonth() == date.getMonth();

    if (!isCurrentMonth || !$picker.data("futureOnly")) {
      if (targetMonth_lastDay < date.getDate()) {
        date.setDate(targetMonth_lastDay);
      }
      draw($picker, {
        "isAnim": true,
        "isOutputToInputObject": true
      }, date.getFullYear(), date.getMonth() - 1, date.getDate(), date.getHours(), date.getMinutes());
    }
  };

  var nextMonth = function($obj) {
    var $picker = getParentPickerObject($obj);
    var date = getPickedDate($picker);
    var targetMonth_lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    if (targetMonth_lastDay < date.getDate()) {
      date.setDate(targetMonth_lastDay);
    }
    draw($picker, {
      "isAnim": true,
      "isOutputToInputObject": true
    }, date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes());
  };

  var getDateFormat = function(format, locale, is_date_only) {
    if (format == "default"){
      // Default format
      format = translate(locale,'format');
      if (is_date_only) {
        // Convert the format to date-only (ex: YYYY/MM/DD)
        format = format.substring(0, format.search(' '));
      }
    }
    return format; // Return date-format
  };

  var normalizeYear = function (year) {
    if (year < 99) { // change year for 4 digits
      var date = new Date();
      return parseInt(year) + parseInt(date.getFullYear().toString().substr(0, 2) + "00");
    }
    return year;
  };

  var parseDate = function (str, opt_date_format) {
    if(opt_date_format != null){
      // Parse date & time with date-format

      // Match a string with date format
      var df = opt_date_format.replace(/(-|\/)/g, '[-\/]')
        .replace(/YYYY/gi, '(\\d{2,4})')
        .replace(/(YY|MM|DD|hh|mm)/g, '(\\d{1,2})')
        .replace(/(M|D|h|m)/g, '(\\d{1,2})');
      var re = new RegExp(df);
      var m = re.exec(str);
      if( m != null){

        // Generate the formats array (convert-table)
        var formats = new Array();
        var format_buf = '';
        var format_before_c = '';
        var df = opt_date_format;
        while (df != null && 0 < df.length) {
          var format_c = df.substring(0, 1); df = df.substring(1, df.length);
          if (format_before_c != format_c) {
            if(/(YYYY|YY|MM|DD|mm|dd|M|D|h|m)/.test(format_buf)){
              formats.push( format_buf );
              format_buf = '';
            } else {
              format_buf = '';
            }
          }
          format_buf += format_c;
          format_before_c = format_c;
        }
        if (format_buf != '' && /(YYYY|YY|MM|DD|mm|dd|M|D|h|m)/.test(format_buf)){
          formats.push( format_buf );
        }

        // Convert a string (with convert-table) to a date object
        var date = new Date();
        var is_successful = false;
        for(var i = 0; i < formats.length; i++){
          if(m.length < i){
            break;
          }

          var f = formats[i];
          var d = m[i+1]; // Matched part of date

          if(f == 'YYYY'){
            date.setFullYear(normalizeYear(d));
            is_successful = true;
          } else if(f == 'YY'){
            date.setYear(d);
            is_successful = true;
          } else if(f == 'MM' || f == 'M'){
            date.setMonth(parseInt(d) - 1);
            is_successful = true;
          } else if(f == 'DD' || f == 'D'){
            date.setDate(d);
            is_successful = true;
          } else if(f == 'hh' || f == 'h'){
            date.setHours(d);
            is_successful = true;
          } else if(f == 'mm' || f == 'm'){
            date.setMinutes(d);
            is_successful = true;
          }
        }

        if(is_successful == true && isNaN(date) == false && isNaN(date.getDate()) == false){ // Parse successful
          return date;
        }
      }
    }

    // Parse date & time with common format
    var re = /^(\d{2,4})[-\/](\d{1,2})[-\/](\d{1,2}) (\d{1,2}):(\d{1,2})$/;
    var m = re.exec(str);
    if (m !== null) {
      m[1] = normalizeYear(m[1]);
      date = new Date(m[1], m[2] - 1, m[3], m[4], m[5]);
    } else {
      // Parse for date-only
      re = /^(\d{2,4})[-\/](\d{1,2})[-\/](\d{1,2})$/;
      m = re.exec(str);
      if(m !== null) {
        m[1] = normalizeYear(m[1]);
        date = new Date(m[1], m[2] - 1, m[3]);
      }
    }

    if(isNaN(date) == false && isNaN(date.getDate()) == false){ // Parse successful
      return date;
    }
    return false;
  };

  var getFormattedDate = function(date, date_format) {
    if(date == null){
      date = new Date();
    }

    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var hou = date.getHours();
    var min = date.getMinutes();

    var date_format = date_format.replace(/YYYY/gi, y)
      .replace(/YY/g, y - 2000)/* century */
      .replace(/MM/g, zpadding(m))
      .replace(/M/g, m)
      .replace(/DD/g, zpadding(d))
      .replace(/D/g, d)
      .replace(/hh/g, zpadding(hou))
      .replace(/h/g, hou)
      .replace(/mm/g, zpadding(min))
      .replace(/m/g, min);
    return date_format;
  };

  var outputToInputObject = function($picker) {
    var $inp = getPickersInputObject($picker);
    if ($inp == null) {
      return;
    }
    var date = getPickedDate($picker);
    var locale = $picker.data("locale");
    var format = getDateFormat($picker.data("dateFormat"), locale, $picker.data('dateOnly'));

    $inp.val( getFormattedDate(date, format) );
  };

  var getPickedDate = function($obj) {
    var $picker = getParentPickerObject($obj);
    return $picker.data("pickedDate");
  };

  var zpadding = function(num) {
    num = ("0" + num).slice(-2);
    return num;
  };

  var draw_date = function($picker, option, date) {
    draw($picker, option, date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
  };
  var translate = function(locale, s) {
    if (typeof lang[locale][s] !== "undefined"){
      return lang[locale][s];
    }
    return lang.en[s];
  };
  var draw = function($picker, option, year, month, day, hour, min) {
    var date = new Date();

    if (hour != null) {
      date = new Date(year, month, day, hour, min, 0);
    } else if (year != null) {
      date = new Date(year, month, day);
    } else {
      date = new Date();
    }
    //console.log("dtpicker - draw()..." + year + "," + month + "," + day + " " + hour + ":" + min + " -> " + date);

    /* Read options */
    var isTodayButton = $picker.data("todayButton");
    var isScroll = option.isAnim; /* It same with isAnim */
    if($picker.data("timelistScroll") == false) {// If disabled by user option.
      isScroll = false;
    }

    var isAnim = option.isAnim;
    if($picker.data("animation") == false){ // If disabled by user option.
      isAnim = false;
    }

    var isFutureOnly = $picker.data("futureOnly");

    var isOutputToInputObject = option.isOutputToInputObject;

    var minuteInterval = $picker.data("minuteInterval");
    var firstDayOfWeek = $picker.data("firstDayOfWeek");

    /* Read locale option */
    var locale = $picker.data("locale");
    if (!lang.hasOwnProperty(locale)) {
      locale = 'en';
    }

    /* Calculate dates */
    var todayDate = new Date();
    var firstWday = new Date(date.getFullYear(), date.getMonth(), 1).getDay() - firstDayOfWeek;
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    var beforeMonthLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    var dateBeforeMonth = new Date(date.getFullYear(), date.getMonth(), 0);
    var dateNextMonth = new Date(date.getFullYear(), date.getMonth() + 2, 0);
    var isCurrentYear = todayDate.getFullYear() == date.getFullYear();
    var isCurrentMonth = isCurrentYear && todayDate.getMonth() == date.getMonth();
    var isCurrentDay = isCurrentMonth && todayDate.getDate() == date.getDate();

    /* Collect each part */
    var $header = $picker.children('.datepicker_header');
    var $inner = $picker.children('.datepicker_inner_container');
    var $calendar = $picker.children('.datepicker_inner_container').children('.datepicker_calendar');
    var $table = $calendar.children('.datepicker_table');
    var $timelist = $picker.children('.datepicker_inner_container').children('.datepicker_timelist');

    /* Grasp a point that will be changed */
    var changePoint = "";
    var oldDate = getPickedDate($picker);
    if(oldDate != null){
      if(oldDate.getMonth() != date.getMonth() || oldDate.getDate() != date.getDate()){
        changePoint = "calendar";
      } else if (oldDate.getHours() != date.getHours() || oldDate.getMinutes() != date.getMinutes()){
        if(date.getMinutes() == 0 || date.getMinutes() % minuteInterval == 0){
          changePoint = "timelist";
        }
      }
    }

    /* Save newly date to Picker data */
    $($picker).data("pickedDate", date);

    /* Fade-out animation */
    if (isAnim == true) {
      if(changePoint == "calendar"){
        $calendar.stop().queue([]);
        $calendar.fadeTo("fast", 0.8);
      }else if(changePoint == "timelist"){
        $timelist.stop().queue([]);
        $timelist.fadeTo("fast", 0.8);
      }
    }
    /* Remind timelist scroll state */
    var drawBefore_timeList_scrollTop = $timelist.scrollTop();

    /* New timelist  */
    var timelist_activeTimeCell_offsetTop = -1;

    /* Header ----- */
    $header.children().remove();

    if (!isFutureOnly || !isCurrentMonth) {
      var $link_before_month = $('<a>');
      $link_before_month.text('<');
      $link_before_month.prop('alt', translate(locale,'prevMonth'));
      $link_before_month.prop('title', translate(locale,'prevMonth') );
      $link_before_month.click(function() {
        beforeMonth($picker);
      });
    }

    var $now_month = $('<span>');
    $now_month.text(date.getFullYear() + " " + translate(locale, 'sep') + " " + translate(locale, 'months')[date.getMonth()]);

    var $link_next_month = $('<a>');
    $link_next_month.text('>');
    $link_next_month.prop('alt', translate(locale,'nextMonth'));
    $link_next_month.prop('title', translate(locale,'nextMonth'));
    $link_next_month.click(function() {
      nextMonth($picker);
    });

    if (isTodayButton) {
      var $link_today = $('<a/>');
      /*
       This icon resource from a part of "FontAwesome" by Dave Gandy - http://fontawesome.io".
       http://fortawesome.github.io/Font-Awesome/license/
       Thankyou.
       */
      $link_today.html( decodeURIComponent('%3c%3fxml%20version%3d%221%2e0%22%20encoding%3d%22UTF%2d8%22%20standalone%3d%22no%22%3f%3e%3csvg%20%20xmlns%3adc%3d%22http%3a%2f%2fpurl%2eorg%2fdc%2felements%2f1%2e1%2f%22%20%20xmlns%3acc%3d%22http%3a%2f%2fcreativecommons%2eorg%2fns%23%22%20xmlns%3ardf%3d%22http%3a%2f%2fwww%2ew3%2eorg%2f1999%2f02%2f22%2drdf%2dsyntax%2dns%23%22%20%20xmlns%3asvg%3d%22http%3a%2f%2fwww%2ew3%2eorg%2f2000%2fsvg%22%20xmlns%3d%22http%3a%2f%2fwww%2ew3%2eorg%2f2000%2fsvg%22%20%20version%3d%221%2e1%22%20%20width%3d%22100%25%22%20%20height%3d%22100%25%22%20viewBox%3d%220%200%2010%2010%22%3e%3cg%20transform%3d%22translate%28%2d5%2e5772299%2c%2d26%2e54581%29%22%3e%3cpath%20d%3d%22m%2014%2e149807%2c31%2e130932%20c%200%2c%2d0%2e01241%200%2c%2d0%2e02481%20%2d0%2e0062%2c%2d0%2e03721%20L%2010%2e57723%2c28%2e153784%207%2e0108528%2c31%2e093719%20c%200%2c0%2e01241%20%2d0%2e0062%2c0%2e02481%20%2d0%2e0062%2c0%2e03721%20l%200%2c2%2e97715%20c%200%2c0%2e217084%200%2e1798696%2c0%2e396953%200%2e3969534%2c0%2e396953%20l%202%2e3817196%2c0%200%2c%2d2%2e38172%201%2e5878132%2c0%200%2c2%2e38172%202%2e381719%2c0%20c%200%2e217084%2c0%200%2e396953%2c%2d0%2e179869%200%2e396953%2c%2d0%2e396953%20l%200%2c%2d2%2e97715%20m%201%2e383134%2c%2d0%2e427964%20c%200%2e06823%2c%2d0%2e08063%200%2e05582%2c%2d0%2e210882%20%2d0%2e02481%2c%2d0%2e279108%20l%20%2d1%2e358324%2c%2d1%2e128837%200%2c%2d2%2e530576%20c%200%2c%2d0%2e111643%20%2d0%2e08683%2c%2d0%2e198477%20%2d0%2e198477%2c%2d0%2e198477%20l%20%2d1%2e190859%2c0%20c%20%2d0%2e111643%2c0%20%2d0%2e198477%2c0%2e08683%20%2d0%2e198477%2c0%2e198477%20l%200%2c1%2e209467%20%2d1%2e513384%2c%2d1%2e265289%20c%20%2d0%2e2605%2c%2d0%2e217083%20%2d0%2e682264%2c%2d0%2e217083%20%2d0%2e942764%2c0%20L%205%2e6463253%2c30%2e42386%20c%20%2d0%2e080631%2c0%2e06823%20%2d0%2e093036%2c0%2e198476%20%2d0%2e024809%2c0%2e279108%20l%200%2e3845485%2c0%2e458976%20c%200%2e031012%2c0%2e03721%200%2e080631%2c0%2e06203%200%2e1302503%2c0%2e06823%200%2e055821%2c0%2e0062%200%2e1054407%2c%2d0%2e01241%200%2e1488574%2c%2d0%2e04342%20l%204%2e2920565%2c%2d3%2e578782%204%2e292058%2c3%2e578782%20c%200%2e03721%2c0%2e03101%200%2e08063%2c0%2e04342%200%2e13025%2c0%2e04342%200%2e0062%2c0%200%2e01241%2c0%200%2e01861%2c0%200%2e04962%2c%2d0%2e0062%200%2e09924%2c%2d0%2e03101%200%2e130251%2c%2d0%2e06823%20l%200%2e384549%2c%2d0%2e458976%22%20%2f%3e%3c%2fg%3e%3c%2fsvg%3e') );
      $link_today.addClass('icon-home');
      $link_today.prop('alt', translate(locale,'today'));
      $link_today.prop('title', translate(locale,'today'));
      $link_today.click(function() {
        setToNow($picker);
      });
      $header.append($link_today);
    }

    $header.append($link_before_month);
    $header.append($now_month);
    $header.append($link_next_month);

    /* Calendar > Table ----- */
    $table.children().remove();
    var $tr = $('<tr>');
    $table.append($tr);

    /* Output wday cells */
    var firstDayDiff = 7 + firstDayOfWeek;
    var daysOfWeek = translate(locale,'days');
    for (var i = 0; i < 7; i++) {
      var $td = $('<th>');
      $td.text(daysOfWeek[((i + firstDayDiff) % 7)]);
      $tr.append($td);
    }

    /* Output day cells */
    var cellNum = Math.ceil((firstWday + lastDay) / 7) * 7;
    var i = 0;
    if(firstWday < 0){
      i = -7;
    }
    for (var zz = 0; i < cellNum; i++) {
      var realDay = i + 1 - firstWday;
      var isPast = isCurrentMonth && realDay < todayDate.getDate();

      if (i % 7 == 0) {
        $tr = $('<tr>');
        $table.append($tr);
      }

      var $td = $('<td>');
      $td.data("day", realDay);

      $tr.append($td);

      if (firstWday > i) {/* Before months day */
        $td.text(beforeMonthLastDay + realDay);
        $td.addClass('day_another_month');
        $td.data("dateStr", dateBeforeMonth.getFullYear() + "/" + (dateBeforeMonth.getMonth() + 1) + "/" + (beforeMonthLastDay + realDay));
      } else if (i < firstWday + lastDay) {/* Now months day */
        $td.text(realDay);
        $td.data("dateStr", (date.getFullYear()) + "/" + (date.getMonth() + 1) + "/" + realDay);
      } else {/* Next months day */
        $td.text(realDay - lastDay);
        $td.addClass('day_another_month');
        $td.data("dateStr", dateNextMonth.getFullYear() + "/" + (dateNextMonth.getMonth() + 1) + "/" + (realDay - lastDay));
      }

      if (((i + firstDayDiff) % 7) == 0) {/* Sunday */
        $td.addClass('wday_sun');
      } else if (((i + firstDayDiff) % 7) == 6) {/* Saturday */
        $td.addClass('wday_sat');
      }

      if (realDay == date.getDate()) {/* selected day */
        $td.addClass('active');
      }

      if (isCurrentMonth && realDay == todayDate.getDate()) {/* today */
        $td.addClass('today');
      }

      /* Set event-handler to day cell */

      if (isFutureOnly && isPast) {
        $td.addClass('day_in_past');
      } else {
        $td.click(function() {
          if ($(this).hasClass('hover')) {
            $(this).removeClass('hover');
          }
          $(this).addClass('active');

          var $picker = getParentPickerObject($(this));
          var targetDate = new Date($(this).data("dateStr"));
          var selectedDate = getPickedDate($picker);
          draw($picker, {
            "isAnim": false,
            "isOutputToInputObject": true
          }, targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), selectedDate.getHours(), selectedDate.getMinutes());
          if ($picker.data("dateOnly") == true && $picker.data("isInline") == false && $picker.data("closeOnSelected")){
            // Close a picker
            ActivePickerId = -1;
            $picker.hide();
          }
        });


        $td.hover(function() {
          if (! $(this).hasClass('active')) {
            $(this).addClass('hover');
          }
        }, function() {
          if ($(this).hasClass('hover')) {
            $(this).removeClass('hover');
          }
        });
      }
    }

    if ($picker.data("dateOnly") == true) {
      /* dateOnly mode */
      $timelist.css("display", "none");
    } else {
      /* Timelist ----- */
      $timelist.children().remove();

      /* Set height to Timelist (Calendar innerHeight - Calendar padding) */
      $timelist.css("height", $calendar.innerHeight() - 10 + 'px');

      /* Output time cells */
      for (var hour = 0; hour < 24; hour++) {
        for (var min = 0; min < 60; min += minuteInterval) {
          var $o = $('<div>');
          var isPastTime = hour < todayDate.getHours() || (hour == todayDate.getHours() && min < todayDate.getMinutes());
          var isPast = isCurrentDay && isPastTime;

          $o.addClass('timelist_item');
          $o.text(zpadding(hour) + ":" + zpadding(min));

          $o.data("hour", hour);
          $o.data("min", min);

          $timelist.append($o);

          if (hour == date.getHours() && min == date.getMinutes()) {/* selected time */
            $o.addClass('active');
            timelist_activeTimeCell_offsetTop = $o.offset().top;
          }

          /* Set event handler to time cell */

          if (isFutureOnly && isPast) {
            $o.addClass('time_in_past');
          } else {
            $o.click(function() {
              if ($(this).hasClass('hover')) {
                $(this).removeClass('hover');
              }
              $(this).addClass('active');

              var $picker = getParentPickerObject($(this));
              var date = getPickedDate($picker);
              var hour = $(this).data("hour");
              var min = $(this).data("min");
              draw($picker, {
                "isAnim": false,
                "isOutputToInputObject": true
              }, date.getFullYear(), date.getMonth(), date.getDate(), hour, min);

              if ($picker.data("isInline") == false && $picker.data("closeOnSelected")){
                // Close a picker
                ActivePickerId = -1;
                $picker.hide();
              }
            });

            $o.hover(function() {
              if (! $(this).hasClass('active')) {
                $(this).addClass('hover');
              }
            }, function() {
              if ($(this).hasClass('hover')) {
                $(this).removeClass('hover');
              }
            });
          }
        }
      }

      /* Scroll the timelist */
      if(isScroll == true){
        /* Scroll to new active time-cell position */
        $timelist.scrollTop(timelist_activeTimeCell_offsetTop - $timelist.offset().top);
      }else{
        /* Scroll to position that before redraw. */
        $timelist.scrollTop(drawBefore_timeList_scrollTop);
      }
    }

    /* Fade-in animation */
    if (isAnim == true) {
      if(changePoint == "calendar"){
        $calendar.fadeTo("fast", 1.0);
      }else if(changePoint == "timelist"){
        $timelist.fadeTo("fast", 1.0);
      }
    }

    /* Output to InputForm */
    if (isOutputToInputObject == true) {
      outputToInputObject($picker);
    }
  };

  var init = function($obj, opt) {
    /* Container */
    var $picker = $('<div>');
    $picker.addClass('datepicker');
    $obj.append($picker);

    /* Set current date */
    if(!opt.current) {
      opt.current = new Date();
    } else {
      var format = getDateFormat(opt.dateFormat, opt.locale, opt.dateOnly);
      var date = parseDate(opt.current, format);
      if (date) {
        opt.current = date;
      } else {
        opt.current = new Date();
      }
    }

    /* Set options data to container object  */
    if (opt.inputObjectId != null) {
      $picker.data("inputObjectId", opt.inputObjectId);
    }
    $picker.data("dateOnly", opt.dateOnly);
    $picker.data("pickerId", PickerObjects.length);
    $picker.data("dateFormat", opt.dateFormat);
    $picker.data("locale", opt.locale);
    $picker.data("firstDayOfWeek", opt.firstDayOfWeek);
    $picker.data("animation", opt.animation);
    $picker.data("closeOnSelected", opt.closeOnSelected);
    $picker.data("timelistScroll", opt.timelistScroll);
    $picker.data("calendarMouseScroll", opt.calendarMouseScroll);
    $picker.data("todayButton", opt.todayButton);
    $picker.data('futureOnly', opt.futureOnly);

    $picker.data("state", 0);

    if( 5 <= opt.minuteInterval && opt.minuteInterval <= 30 ){
      $picker.data("minuteInterval", opt.minuteInterval);
    } else {
      $picker.data("minuteInterval", 30);
    }

    /* Header */
    var $header = $('<div>');
    $header.addClass('datepicker_header');
    $picker.append($header);
    /* InnerContainer*/
    var $inner = $('<div>');
    $inner.addClass('datepicker_inner_container');
    $picker.append($inner);
    /* Calendar */
    var $calendar = $('<div>');
    $calendar.addClass('datepicker_calendar');
    var $table = $('<table>');
    $table.addClass('datepicker_table');
    $calendar.append($table);
    $inner.append($calendar);
    /* Timelist */
    var $timelist = $('<div>');
    $timelist.addClass('datepicker_timelist');
    $inner.append($timelist);

    /* Set event handler to picker */
    $picker.hover(
      function(){
        ActivePickerId = $(this).data("pickerId");
      },
      function(){
        ActivePickerId = -1;
      }
    );

    /* Set event-handler to calendar */
    if (opt.calendarMouseScroll) {
      if (window.sidebar) { // Mozilla Firefox
        $calendar.bind('DOMMouseScroll', function(e){ // Change a month with mouse wheel scroll for Fx
          var $picker = getParentPickerObject($(this));

          // up,left [delta < 0] down,right [delta > 0]
          var delta = e.originalEvent.detail;
          /*
           // this code need to be commented - it's seems to be unnecessary
           // normalization (/3) is not needed as we move one month back or forth
           if(e.originalEvent.axis !== undefined && e.originalEvent.axis == e.originalEvent.HORIZONTAL_AXIS){
           e.deltaX = delta;
           e.deltaY = 0;
           } else {
           e.deltaX = 0;
           e.deltaY = delta;
           }
           e.deltaX /= 3;
           e.deltaY /= 3;
           */
          if(delta > 0) {
            nextMonth($picker);
          } else {
            beforeMonth($picker);
          }
          return false;
        });
      } else { // Other browsers
        $calendar.bind('mousewheel', function(e){ // Change a month with mouse wheel scroll
          var $picker = getParentPickerObject($(this));
          // up [delta > 0] down [delta < 0]
          if(e.originalEvent.wheelDelta /120 > 0) {
            beforeMonth($picker);
          } else {
            nextMonth($picker);
          }
          return false;
        });
      }
    }

    PickerObjects.push($picker);

    draw_date($picker, {
      "isAnim": true,
      "isOutputToInputObject": opt.autodateOnStart
    }, opt.current);
  };

  var getDefaults = function() {
    return {
      "current": null,
      "dateFormat": "default",
      "locale": "en",
      "animation": true,
      "minuteInterval": 30,
      "firstDayOfWeek": 0,
      "closeOnSelected": false,
      "timelistScroll": true,
      "calendarMouseScroll": true,
      "todayButton": true,
      "dateOnly": false,
      "futureOnly": false,
      "autodateOnStart": true
    };
  };

  /**
   * Initialize dtpicker
   */
  $.fn.dtpicker = function(config) {
    var date = new Date();
    var defaults = getDefaults();

    defaults.inputObjectId = undefined;
    var options = $.extend(defaults, config);

    return this.each(function(i) {
      init($(this), options);
    });
  };

  /**
   * Initialize dtpicker, append to Text input field
   * */
  $.fn.appendDtpicker = function(config) {
    var date = new Date();
    var defaults = getDefaults();

    defaults.inline = false;
    var options = $.extend(defaults, config);

    return this.each(function(i) {

      /* Add input-field with inputsObjects array */
      var input = this;
      var inputObjectId = InputObjects.length;
      InputObjects.push(input);

      options.inputObjectId = inputObjectId;

      /* Current date */
      var date, strDate, strTime;
      if($(input).val() != null && $(input).val() != ""){
        options.current = $(input).val();
      }

      /* Make parent-div for picker */
      var $d = $('<div>');
      if(options.inline == false){
        /* float mode */
        $d.css("position","absolute");
      }
      $d.insertAfter(input);

      /* Initialize picker */

      var pickerId = PickerObjects.length;

      var $picker_parent = $($d).dtpicker(options); // call dtpicker() method

      var $picker = $picker_parent.children('.datepicker');

      /* Link input-field with picker*/
      $(input).data('pickerId', pickerId);

      /* Set event handler to input-field */

      $(input).keyup(function() {
        var $input = $(this);
        var $picker = $(PickerObjects[$input.data('pickerId')]);
        if ($input.val() != null && (
          $input.data('beforeVal') == null ||
            ( $input.data('beforeVal') != null && $input.data('beforeVal') != $input.val())	)
          ) { /* beforeValue == null || beforeValue != nowValue  */
          var format = getDateFormat($picker.data('dateFormat'), $picker.data('locale'), $picker.data('dateOnly'));
          var date = parseDate($input.val(), format);
          if (date) {
            draw_date($picker, {
              "isAnim":true,
              "isOutputToInputObject":false
            }, date);
          }
        }
        $input.data('beforeVal',$input.val())
      });

      $(input).change(function(){
        $(this).trigger('keyup');
      });

      if(options.inline == true){
        /* inline mode */
        $picker.data('isInline',true);
      }else{
        /* float mode */
        $picker.data('isInline',false);
        $picker_parent.css({
          "zIndex": 100
        });
        $picker.css("width","auto");

        /* Hide this picker */
        $picker.hide();

        /* Set onClick event handler for input-field */
        $(input).click(function(){
          var $input = $(this);
          var $picker = $(PickerObjects[$input.data('pickerId')]);
          ActivePickerId = $input.data('pickerId');
          $picker.show();
          var _position = $(input).parent().css('position');
          if(_position === 'relative' || _position === 'absolute'){
            $picker.parent().css("top", $input.outerHeight() + 2 + "px");
          }
          else{
            $picker.parent().css("top", $input.position().top + $input.outerHeight() + 2 + "px");
            $picker.parent().css("left", $input.position().left + "px");
          }
        });
      }
    });
  };

  /* Set event handler to Body element, for hide a floated-picker */
  $(function(){
    $('body').click(function(){
      for(var i=0;i<PickerObjects.length;i++){
        var $picker = $(PickerObjects[i]);
        if(ActivePickerId != i){	/* if not-active picker */
          if($picker.data("inputObjectId") != null && $picker.data("isInline") == false){
            /* if append input-field && float picker */
            $picker.hide();
          }
        }
      }
    });
  });

})(jQuery);
