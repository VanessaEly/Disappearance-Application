app.directive('informeMap', ['$parse', function($parse) {
    var map, infoWindow, markers = [], pos = {lat: -22.905125, lng: -43.190786};
    var mapOptions = {
        center: pos,
        styles: [{"stylers": [{"saturation": -100}, {"gamma": 1}]},
            {"elementType": "labels.text.stroke", "stylers": [{"visibility": "off"}]},
            {"featureType": "poi.business", "elementType": "labels.text", "stylers": [{"visibility": "off"}]},
            {"featureType": "poi.business", "elementType": "labels.icon", "stylers": [{"visibility": "off"}]},
            {"featureType": "poi.place_of_worship", "elementType": "labels.text", "stylers": [{"visibility": "off"}]},
            {"featureType": "poi.place_of_worship", "elementType": "labels.icon", "stylers": [{"visibility": "off"}]},
            {"featureType": "road", "elementType": "geometry", "stylers": [{"visibility": "simplified"}]},
            {"featureType": "water", "stylers": [{"visibility": "on"}, {"saturation": 50}, {"gamma": 0}, {"hue": "#50a5d1"}]},
            {"featureType": "administrative.neighborhood", "elementType": "labels.text.fill", "stylers": [{"color": "#333333"}]},
            {"featureType": "road.local", "elementType": "labels.text", "stylers": [{"weight": 0.5}, {"color": "#333333"}]},
            {"featureType": "transit.station", "elementType": "labels.icon", "stylers": [{"gamma": 1}, {"saturation": 50}]}
        ],
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: true
    };

    // directive link function
    var link = function(scope, element, attrs) {
        geocoder = new google.maps.Geocoder();

        map = new google.maps.Map(element[0], mapOptions);

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                map.setCenter(pos);


            })
        }

        var marker = new google.maps.Marker({
            position: pos,
            draggable: true,
            animation: google.maps.Animation.BOUNCE,
            map: map
        });

        //Call function to get formatted address based os pos lat/lng
        //return it as coordinates scope variable
        address_to_coordinates(pos, function (pos) {
            scope.coordinates = pos;
            scope.$apply();
        });

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
            searchBox.setBounds(map.getBounds());
        });

        var markers = [];

        //Dragend Listener
        google.maps.event.addListener(marker, 'dragend', function() {
            pos = marker.getPosition();

            //Call function to get formatted address based os pos lat/lng
            //return it as coordinates scope variable
            address_to_coordinates(pos, function (pos) {
                scope.coordinates = pos;
                scope.$apply();
            });

        });

        //Get Formatted address based os pos lat/lng
        function address_to_coordinates(address_text, callback) {
            var address = address_text;
            geocoder.geocode( { 'latLng': pos }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    callback(results[0]);

                } else {
                    alert("Geocode was not successful for the following reason: " + status);
                }
            });
        }

        // [START region_getplaces]
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }

            // Clear out the old markers.
            markers.forEach(function(marker) {
                marker.setMap(null);
            });
            markers = [];

            // For each place, get the name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {

                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                    map: map,
                    draggable: true,
                    animation: google.maps.Animation.DROP,
                    title: place.name,
                    position: place.geometry.location
                }));
                map.setCenter(place.geometry.location);
                pos = place.geometry.location;

                //Call function to get formatted address based os pos lat/lng
                //return it as coordinates scope variable
                address_to_coordinates(pos, function (pos) {
                    scope.coordinates = pos;
                    scope.$apply();
                });

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            map.fitBounds(bounds);
        });


    };

    return {
        restrict: 'AC',
        template: '<div id="informe-map"></div>',
        replace: true,
        link: link
    };
}]);