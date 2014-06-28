function is_same_day(date1, date2) {
    return date1.getYear() == date2.getYear() && date1.getMonth() == date2.getMonth() &&
        date1.getDate() == date2.getDate();
}

function is_today(date) {
    var now = new Date();
    return is_same_day(date, now);
}

function get_date_name(date) {
    if(is_today(date)) {
        return "Today";
    } else {
        return "" + date.getDate() + ". " + get_month_name(date);
    }
}

function get_month_name(date) {
    switch(date.getMonth()) {
        case 0:
            return "January";
        case 1:
            return "February";
        case 2:
            return "March";
        case 3:
            return "April";
        case 4:
            return "May";
        case 5:
            return "Juni";
        case 6:
            return "July";
        case 7:
            return "August";
        case 8:
            return "September";
        case 9:
            return "October";
        case 10:
            return "November";
        case 11:
            return "December";
    }

    return undefined;
}
