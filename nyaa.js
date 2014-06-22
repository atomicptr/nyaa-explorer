URL_NYAA = "http://www.nyaa.se/?page=rss";
URL_NYAA_SUKEBEI = "http://sukebei.nyaa.se/?page=rss";

function nyaa_fetch(page, search_info, callback) {
	var url = _nyaa_create_url(page, search_info);
	
	$.get(url, function(data) {
		var xml = $(data);
		
		var items = [];
		
		$(xml).find("item").each(function() {
			// looks like this: x leecher(s), y seeder(s), z download(s) - SIZE - Trusted
			var description = $(this).find("description").text();
		
			// split it open to get leechers, seeders and download + more in 3 entries
			var desc_raw = description.split(", ");

			// retrieve seeds and leecher info
			var seeds = desc_raw[0].split(' ')[0];
			var leech = desc_raw[1].split(' ')[0];
			
			// split downloads + more info
			var tmp = desc_raw[2].split(' - ');
			
			var downloads = tmp[0].split(' ')[0];
			var size = tmp[1];
			
			var trusted = false;
			var aplus = false;
			var remake = false;
			
			// A+ - Trusted
			if(tmp.length > 2) {
				var mods = tmp.slice(2);
				
				trusted = mods.indexOf("Trusted") > -1;
				aplus = mods.indexOf("A+") > -1;
				remake = mods.indexOf("Remake") > -1;
			}
		
			var item = {
				title: $(this).find("title").text(),
				category: $(this).find("category").text(),
				download_link: $(this).find("link").text(),
				page_link: $(this).find("guid").text(),
				seeds: seeds,
				leech: leech,
				downloads: downloads,
				size: size,
				trusted: trusted,
				aplus: aplus,
				remake: remake
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