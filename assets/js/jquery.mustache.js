(function($) {
	$.mustache = function(template, view, partials) {
    	return Mustache.to_html(template, view, partials);
  	};
})(jQuery);