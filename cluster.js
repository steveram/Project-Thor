var Cluster = exports;
var sys = require('sys');
var OFFSET = 268435456;
var RADIUS = 85445659.4471;
    
function lonToX(lon) {
    return Math.round(OFFSET + RADIUS * lon * Math.PI / 180);        
}

function latToY(lat) {
    return Math.round(OFFSET - RADIUS * 
                Math.log((1 + Math.sin(lat * Math.PI / 180)) / 
                (1 - Math.sin(lat * Math.PI / 180))) / 2);
}

function pixelDistance(lat1, lon1, lat2, lon2, zoom) {
    x1 = lonToX(lon1);
    y1 = latToY(lat1);
    x2 = lonToX(lon2);
    y2 = latToY(lat2);
        
    return Math.sqrt(Math.pow((x1-x2),2) + Math.pow((y1-y2),2)) >> (21 - zoom);
}

/**
 * Return an array of clusters based on an array of markers
 *
 * @function cluster
 * @param {Array} markers {Number} distance {Number} zoom
 * @return {Array}
 */
Cluster.cluster = function(markers, distance, zoom) {
    clustered = []
    while (markers.length > 0) {
        marker  = markers.pop();
        cluster = [];
        /* Compare against all markers which are left. */
        markers.forEach(function(element, index, array){
            pixels = pixelDistance(marker.loc.lat, marker.loc.long, element.loc.lat, marker.loc.long, zoom);

            if (distance > pixels) {
                array.splice(index, 1);
                cluster.push(element);
            }
        });

        /* If a marker has been added to cluster, add also the one  */
        /* we were comparing to and remove the original from array. */
        if (cluster.length > 0) {
            cluster.push(marker);
            clustered.push(cluster);
        } else {
            clustered.push(marker);
        }
    }
    return clustered;
}


Cluster.getClusters = function(markers, zoom){
	return Cluster.cluster(markers, 50, zoom);
	
}