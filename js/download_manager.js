var gui = require("nw.gui");

function refresh_download_list() {
    var download_list = get_download_list();

    $("#dl-list").empty();

    if(download_list.length > 0) {
        download_list.sort(function(item_a, item_b) {
            return item_b.date > item_a.date;
        })

        download_list.forEach(function(item) {
            $("#dl-list").append("<a class='dl-item list-group-item' onclick='run_item(\"" +
                item.name + "\", \"" + item.path + "\");'>" + item.name + "</a>");
        });
    } else {
        $("#dl-list").append("<a class='list-group-item list-group-item-warning'>No downloads found.</a>");
    }
}

function run_item(name, path) {
    gui.Shell.openItem(path);
}
