(function($, window, undefined) {
    var Map, 
        MapOptions = {
            center: new google.maps.LatLng(-34.397, 150.644),
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }, 
        From = "Iasi", 
        To = "Bucuresti";
    
    function initialize() {
        return new google.maps.Map(document.getElementById("flightly-map"), MapOptions);
    }
    
    $(function() {
        Map = initialize();
    });
})(jQuery, this);