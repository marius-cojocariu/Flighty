(function($, window, undefined) {
    var Map, 
        MapOptions = {
            center: new google.maps.LatLng(0, 0),
            zoom: 7,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        },
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
    
    function addMarkerToMap(data, current_location_marker) {
        var image = 'img/flighty-location-pin.png';
        
        if(current_location_marker === true) {
            image = 'img/flighty-current-location-pin.png';
        }
        
        var marker_latlng = new google.maps.LatLng(data.lat, data.lng);

        var marker = new google.maps.Marker({
            "position": marker_latlng,
            "map": Map,
            "title":data.formatted_address, 
            "icon": image
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
    
    function initUI() {
        $('input[name=from]').bind("focus", function() {
            var _this = $(this);
            if(_this.val() === 'from') {
                _this.val('');
            }
        }).bind("blur", function() {
            var _this = $(this);
            if(_this.val() === '') {
                _this.val('from');
            }
        });
        
        $('input[name=to]').bind("focus", function() {
            var _this = $(this);
            if(_this.val() === 'to') {
                _this.val('');
            }
        }).bind("blur", function() {
            var _this = $(this);
            if(_this.val() === '') {
                _this.val('to');
            }
        });
        
        $('li.back').find('a').bind('click', function() {
            changeToQuery();
        });
    }
    
    function changeToQuery() {
        $('#flightly-map').hide();
        $('#traveling').find('fieldset').show().end().css({
            "margin-top": 65, 
            "padding-left": 20
        });
        $('header').addClass('home').removeClass('map');
        
        $('input[name=from]').val('from');
        $('input[name=to]').val('to');
        
        LocationsLoaded = 0;
        DestPoints = [];
    }
    
    function changeToMap() {
        $('#traveling').find('fieldset').hide().end().css({
            "margin-top": 0, 
            "padding-left": 0
        });
        $('#flightly-map').show();
        $('header').removeClass('home').addClass('map');
        
        if(!Map)
            Map = initialize();
        
        detectLocation();
        geocodeApiResult($('input[name=from]').val(), addMarkerToMap);
        geocodeApiResult($('input[name=to]').val(), addMarkerToMap);
    }
    
    function detectLocation() {
        var initialLocation;
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
              Map.setCenter(initialLocation);
              addMarkerToMap({
                    "lat": position.coords.latitude, 
                    "lng": position.coords.longitude, 
                    "formatted_address": "Current location"
              }, true);
            }, function() {
            });
        }
    }
    
    $(function() {
        initUI();
        
        $('#traveling').find('input[type=button]').bind('click', function() {
            changeToMap();
            return false;
        });
    });
})(jQuery, this);