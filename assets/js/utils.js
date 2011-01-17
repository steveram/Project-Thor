var Utils = function(){

  return({
    relativeTime: function(str) {
		var d = new Date(str),
			seconds = d.getTime() / 1000,
			now = (new Date().getTime()) / 1000,
			diff = Math.floor(now - seconds);
		if (diff < 60){
 			return diff + " seconds ago";
		}else if (diff < 3600){
 			return Math.floor(diff / 60) + " minutes ago";
		}else if (diff < 86400){
 			return Math.floor(diff / 3600) + " hours ago";
		}else if (diff < 2505600){
 			return Math.floor(diff / 86400) + " days ago";
		}else if (diff < 30067200){
 			return Math.floor(diff / 2505600) + " months ago";
		} else if (diff < 300672000){
 			return Math.floor(diff / 30067200) + " years ago";
		} else if (diff < 6013440000){
 			return Math.floor(diff / 300672000) + " decades ago";
		}
    }
  });
}();