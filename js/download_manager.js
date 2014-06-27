var gui = require("nw.gui");

function refresh_download_list() {
    var download_list = get_download_list();

    $("#dl-list").empty();

    download_list.forEach(function(item) {
        $("#dl-list").append("<a class='dl-item list-group-item' onclick='run_item(\"" +
            item.name + "\", \"" + item.path + "\");'>" + item.name + "</a>");
    });
}

function run_item(name, path) {
    gui.Shell.openItem(path);
}
