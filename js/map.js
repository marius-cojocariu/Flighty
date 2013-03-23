(function($, window, undefined) {
    var Map, 
        MapOptions = {
            center: new google.maps.LatLng(-34.397, 150.644),
            zoom: 2,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }, 
        From = "Iasi", 
        To = "Bucuresti", 
        LocationsLoaded = 0, 
        DestPoints = [];
    
    function initialize() {
        return new google.maps.Map(document.getElementById("flightly-map"), MapOptions);
    }
    
    function geocodeApiResult(address, onSuccess) {
        $.ajax({
            "url": "http://maps.googleapis.com/maps/api/geocode/json?sensor=false&address="+address, 
            "method": "POST", 
            "dataType": "json", 
            "success": function(data) {
                if(data && data.results && data.results.length && data.results[0].geometry.location) {
                    var dest = DestPoints[DestPoints.length] = {
                        "lat": data.results[0].geometry.location.lat, 
                        "lng": data.results[0].geometry.location.lng, 
                        "formatted_address": data.results[0].formatted_address
                    };
                    onSuccess(dest);
                    
                    LocationsLoaded++;
                    if(LocationsLoaded === 2) {
                        finishDraw();
                    }
                }
            }, 
            "error": function() {
                alert('error');
            }
        });
    }
    
    function addMarkerToMap(data) {
        var image = 'beachflag.png';
        var marker_latlng = new google.maps.LatLng(data.lat, data.lng);

        var marker = new google.maps.Marker({
            "position": marker_latlng,
            "map": Map,
            "title":data.formatted_address, 
            //"icon": image
        });
    }
    
    function finishDraw() {
        var flightPlanCoordinates = [
            new google.maps.LatLng(DestPoints[0].lat, DestPoints[0].lng),
            new google.maps.LatLng(DestPoints[1].lat, DestPoints[1].lng)
        ];
        var flightPath = new google.maps.Polyline({
            path: flightPlanCoordinates,
            strokeColor: "#3d85c1",
            strokeOpacity: 0.8,
            strokeWeight: 3
        });
        flightPath.setMap(Map);
    }
    
    $(function() {
        Map = initialize();
        geocodeApiResult("Iasi", addMarkerToMap);
        geocodeApiResult("Bucuresti", addMarkerToMap);
    });
})(jQuery, this);