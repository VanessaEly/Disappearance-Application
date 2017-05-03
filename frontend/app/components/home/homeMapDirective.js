app.directive('homeMap', function($http) {
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
    var link = function(scope, element, attrs, http) {

        map = new google.maps.Map(element[0], mapOptions);

         // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                map.setCenter(pos);
                setMarker(map, pos, "Você está aqui.", "Esta é a sua localização atual.", infoWindow, markers);
            })
        }
        else {
            setMarker(map, pos, "Você está aqui.", "Esta é a sua localização atual.", infoWindow, markers);
        }
        //fazendo requisicao das ocorrencias cadastradas
        $http.get('http://localhost:8000/api/novaocorrencia/', {
            headers: {"Authorization": "Token 5f7a57e87ebb87798a1cc28b808b9a694970cc99"}
        }).success(function(response){
            scope.ocorrencias = response.results;
            //criando marcadores para todas as ocorrecias encontradas
            for (var i = 0; i < scope.ocorrencias.length; i++) {
                setMarker(map, new google.maps.LatLng(scope.ocorrencias[i].latitude, scope.ocorrencias[i].longitude), scope.ocorrencias[i].titulo, scope.ocorrencias[i].tipo, infoWindow, markers, 'https://maps.google.com/mapfiles/ms/icons/green-dot.png');
            }
        }).error(function(response){
            console.log("get error", response);
        });

        // setMarker(map, new google.maps.LatLng(-22.907325, -43.192986), 'Amsterdam', 'More content', infoWindow, markers, 'https://maps.google.com/mapfiles/ms/icons/green-dot.png');
        // setMarker(map, new google.maps.LatLng(-22.908425, -43.193586), 'Paris', 'Text here', infoWindow, markers, 'https://maps.google.com/mapfiles/ms/icons/green-dot.png');
    };

    // place a marker
    function setMarker(map, position, title, content, infoWindow, markers, icon) {
        var marker;
        var markerOptions = {
            position: position,
            map: map,
            title: title,
            //animation: google.maps.Animation.DROP,
            icon: icon
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