var gui = require("nw.gui");

function refresh_download_list() {
    var download_list = get_download_list();

    $("#dl-list").empty();

    if(download_list.length > 0) {
        download_list.sort(function(item_a, item_b) {
            return new Date(item_b.date) > new Date(item_a.date);
        });

        var groups = [];

        download_list.forEach(function(item) {
            var date_group = download_list.filter(function(element) {
                return is_same_day(new Date(element.date), new Date(item.date));
            });

            var key = "";

            if(date_group instanceof Array) {
                date_group.forEach(function(e) {
                    key += e.name;
                });
            } else {
                key += date_group.name;
            }

            date_group.key = key;

            if(!element_of(groups, date_group)) {
                groups.push(date_group);
            }
        });

        groups.forEach(function(date_group) {
            var first = new Date(date_group[0].date);

            $("#dl-list").append("<h4 class='dl-heading'>" + get_date_name(first) + "</h4>");
            $("#dl-list").append("<div class='list-group'>");

            date_group.forEach(function(item) {
                $("#dl-list").append("<a class='dl-item list-group-item' onclick='run_item(\"" +
                    item.name + "\", \"" + item.path + "\");'>" + item.name + "</a>");
            });

            $("#dl-list").append("</div>");
        });

        /*download_list.forEach(function(item) {
            $("#dl-list").append("<a class='dl-item list-group-item' onclick='run_item(\"" +
                item.name + "\", \"" + item.path + "\");'>" + item.name + "</a>");
        });*/
    } else {
        $("#dl-list").append("<div class='list-group'><a class='list-group-item list-group-item-warning'>No downloads found.</a></div>");
    }
}

function element_of(array, obj) {
    var is_element_of = false;

    array.forEach(function(e) {
        if(e.key == obj.key) {
            is_element_of = true;
        }
    });

    return is_element_of;
}

function run_item(name, path) {
    gui.Shell.openItem(path);
}

function btn_start_all() {
    var download_list = get_download_list();

    download_list.forEach(function(item) {
        run_item(item.name, item.path);
    });
}

function btn_clear() {
    clear_downloads();
}
