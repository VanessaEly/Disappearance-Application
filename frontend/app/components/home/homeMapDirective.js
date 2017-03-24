app.directive('homeMap', function() {
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
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // directive link function
    var link = function(scope, element, attrs) {


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
            animation: google.maps.Animation.DROP,
            map: map
        });

        setMarker(map, new google.maps.LatLng(-22.906225, -43.191886), 'London', 'Just some content', infoWindow, markers);
        setMarker(map, new google.maps.LatLng(-22.907325, -43.192986), 'Amsterdam', 'More content', infoWindow, markers);
        setMarker(map, new google.maps.LatLng(-22.908425, -43.193586), 'Paris', 'Text here', infoWindow, markers);
    };

    // place a marker
    function setMarker(map, position, title, content, infoWindow, markers) {
        var marker;
        var markerOptions = {
            position: position,
            map: map,
            title: title,
            icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
        };

        marker = new google.maps.Marker(markerOptions);
        markers.push(marker); // add marker to array

        google.maps.event.addListener(marker, 'click', function () {
            // close window if not undefined
            if (infoWindow !== void 0) {
                infoWindow.close();
            }
            // create new window
            var infoWindowOptions = {
                content: content
            };
            infoWindow = new google.maps.InfoWindow(infoWindowOptions);
            infoWindow.open(map, marker);
        });
    }

    return {
        restrict: 'A',
        template: '<div id="home-map"></div>',
        replace: true,
        link: link
    };
});