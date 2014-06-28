// Copyright (c) 2014 Christopher Kaster
//
// This file is part of nyaa-explorer <https://github.com/kasoki/nyaa-explorer>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
var gui = require("nw.gui");
var http = require("http");
var fs = require("fs");
var path = require("path");

var DOWNLOAD_LIST_IDENT = "NYAA_DOWNLOAD_LIST_IDENT";

var search_options = {
    base_url: URL_NYAA,
    query: undefined
};

$("#search-field").keydown(function(e) {
    if(e.keyCode == 13) {
        e.preventDefault();
        $("#search-btn").click();
        return true;
    }
});

$("#search-btn").click(function() {
    var raw_tags = $("#search-field").val();

    var tags = raw_tags.split(' ');

    search_options.query = tags;

    refresh();
});

function refresh() {
    nyaa_fetch(0, search_options, function(items) {
        $("#tlist").empty();
        items.forEach(insert_list_item);
    });
}

function insert_list_item(item) {
    var item_mod = "";

    if(item.aplus) {
        item_mod = " list-group-item-info";
    } else if(item.remake) {
        item_mod = " list-group-item-warning";
    } else if(item.trusted) {
        item_mod = " list-group-item-success";
    }

    if(item.seeds == 0) {
        item_mod = " list-group-item-danger";
    }

    $("#tlist").append("<a class='dl-item list-group-item" + item_mod + "' onclick='download_item(\"" +
        item.title + "\", \"" + item.download_link + "\");'>" + item.title + "<div class='pull-right dl-info'>" +
        "<span class='glyphicon glyphicon-arrow-up'></span> " + pad(item.seeds, 4) +
        " <span class='glyphicon glyphicon-arrow-down'></span> " + pad(item.leech, 4) +
        " <span class='glyphicon glyphicon-hdd'></span> " + item.size +
        "</div></a>");
}

function download_item(name, url) {
    var download_path = path.join(get_home_dir(), "Downloads", "nyaa-explorer");

    fs.mkdir(download_path, function() {
        var filename_without_ext = name.split(' ').join('_');

        var filename = filename_without_ext + ".torrent";

        var file_path = path.join(download_path, filename);

        var file = fs.createWriteStream(file_path);

        var request = http.get(url, function(response) {
            response.pipe(file);

            response.on("end", function() {
                add_to_download_list({
                    name: filename,
                    path: file_path,
                    date: new Date()
                });
            });
        });
    });
}

function get_download_list() {
    var download_list_json = __get_valid_download_list();

    return JSON.parse(download_list_json);
}

function __get_valid_download_list() {
    var list_json = window.localStorage.getItem(DOWNLOAD_LIST_IDENT);

    var list = JSON.parse(list_json);

    var wrong_entries = [];

    if(!list) {
        return JSON.stringify([]);
    } else {
        list.forEach(function(item) {
            if(!fs.existsSync(item.path)) {
                wrong_entries.push(item);
            }
        });

        wrong_entries.forEach(function(item) {
            remove(list, item);
        });

        return JSON.stringify(list);
    }
}

function add_to_download_list(item) {
    var download_list = get_download_list();

    var already_downloaded = false;

    download_list.forEach(function(element) {
        if(item.name == element.name) {
            console.log("item already downloaded, push date");
            item.date = new Date();

            already_downloaded = true;
        }
    });

    if(!already_downloaded) {
        console.log("new item in download list:\n" + JSON.stringify(item, 4));

        download_list.push(item);
    }

    window.localStorage.setItem(DOWNLOAD_LIST_IDENT, JSON.stringify(download_list));

    refresh_download_list();
}

function clear_downloads() {
    var downloads_list = get_download_list();

    window.localStorage.setItem(DOWNLOAD_LIST_IDENT, JSON.stringify([]));

    downloads_list.forEach(function(item) {
        fs.unlinkSync(item.path);
    });

    refresh_download_list();
}

function refresh_download_list() {
    var download_list = get_download_list();

    $(".download-badge").html(download_list.length);
}

function show_download_window() {
    var pkg = require('./package.json');

    var dl_window = gui.Window.open('ui/download_manager.html', {
        position: "center",
        toolbar: pkg.window.toolbar,
        focus: true,
        width: 800,
        height: 600
    });

    dl_window.on("close", function() {
        refresh_download_list();

        this.close(true);
    });
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function remove(array, item) {
    var i;

    while((i = array.indexOf(item)) != -1) {
        array.splice(i, 1);
    }
}

function get_home_dir() {
    return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}
