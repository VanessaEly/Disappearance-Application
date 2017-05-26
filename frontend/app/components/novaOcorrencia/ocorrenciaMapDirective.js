app.directive('ocorrenciaMap', ['$parse', function($parse) {
    var map,marker, pos = {lat: -22.905125, lng: -43.190786};
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
        minZoom: 1,
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
                setMarker(map, pos, "You're here");
            })
        }
        else {
            setMarker(map, pos, "You're here");
        }

        // place a marker
        function setMarker(map, position, title) {
            map.setCenter(pos);
            var markerOptions = {
                position: position,
                map: map,
                title: title,
                animation: google.maps.Animation.DROP,
                draggable: true,
            };

            marker = new google.maps.Marker(markerOptions);
            //Get market position and set scope coordinates with its value
            google.maps.event.addListener(marker, 'dragend', function() {
                pos = marker.getPosition();
                address_to_coordinates(pos, function (pos) {
                    scope.coordinates = pos;
                    scope.$apply();
                });

            });
        }

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

        //Get Formatted address based os pos lat/lng
        function address_to_coordinates(address_text, callback) {
            var address = address_text;

            geocoder.geocode( { 'latLng': pos }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    scope.ocorrencia.latitude = results[0].geometry.location.lat();
                    scope.ocorrencia.longitude = results[0].geometry.location.lng();
                        for (j = 0; j < results[0].address_components.length; ++j) {
                            var super_var2 = results[0].address_components[j].types;

                            for (k = 0; k < super_var2.length; ++k) {
                                //find city
                                if (super_var2[k] == "locality")
                                    scope.ocorrencia.cidade = results[0].address_components[j].long_name;

                                //find State
                                if (super_var2[k] == "administrative_area_level_1")
                                    scope.ocorrencia.estado = results[0].address_components[j].short_name;

                                //find county
                                if (super_var2[k] == "country")
                                    scope.ocorrencia.pais = results[0].address_components[j].long_name;
                            }
                        }
                    callback(results[0]);
                }
            });
        }

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
            searchBox.setBounds(map.getBounds());
        });



        // [START region_getplaces]
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }

            // Clear out the old marker.
            marker.setMap(null);

            // For each place, get the name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {

                // Create a marker for each place.
                marker = new google.maps.Marker({
                    map: map,
                    draggable: true,
                    animation: google.maps.Animation.BOUNCE,
                    title: place.name,
                    position: place.geometry.location
                });
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
            google.maps.event.addListener(marker, 'dragend', function() {
                pos = marker.getPosition();
                address_to_coordinates(pos, function (pos) {
                    scope.coordinates = pos;
                    scope.$apply();
                });

            });
        });
    };

    return {
        restrict: 'AC',
        template: '<div id="ocorrencia-map"></div>',
        replace: true,
        link: link
    };
}]);