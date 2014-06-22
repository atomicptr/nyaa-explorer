URL_NYAA = "http://www.nyaa.se/?page=rss";
URL_NYAA_SUKEBEI = "http://sukebei.nyaa.se/?page=rss";

function nyaa_fetch(page, search_info, callback) {
	var url = _nyaa_create_url(page, search_info);
	
	$.get(url, function(data) {
		var xml = $(data);
		
		var items = [];
		
		$(xml).find("item").each(function() {
			var item = {
				title: $(this).find("title").text(),
				category: $(this).find("category").text(),
				download_link: $(this).find("link").text(),
				page_link: $(this).find("guid").text(),
				description: $(this).find("description").text()
			};
			
			items.push(item);
		});
		
		callback(items);
	});
}

function _nyaa_create_url(page, search_info) {
	if(!search_info) {
		search_info = {};
	}

	var url = search_info.base_url ? search_info.base_url : URL_NYAA;
	
	url += page ? "&offset=" + page : "";
	
	// TODO: add category, filter, sort and order options
	
	url += search_info.query ? "&term=" + search_info.query.join("+") : "";
	
	return url;
}