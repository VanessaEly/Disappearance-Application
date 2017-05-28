app.directive('homeMap', function($http, StorageService, $window) {
    var map, infoWindow, markers = [], pos = {lat: -22.905125, lng: -43.190786}, pin;

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
        scope.data = { item:[], categoria: [], ocorrencia:[], detalhes:[], imagem:[], date:[]}

        map = new google.maps.Map(element[0], mapOptions);

        var host = StorageService.get("host");

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            var location_timeout = setTimeout("geolocFail()", 10000);
            navigator.geolocation.getCurrentPosition(function (position) {
            clearTimeout(location_timeout);
                pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setMarker(map, pos, "Você está aqui.", "Esta é a sua localização atual.", infoWindow, markers);
            }, function(error) {
                clearTimeout(location_timeout);
                setMarker(map, pos, "Você está aqui.", "Esta é a sua localização atual.", infoWindow, markers);
                console.log("error",error);
            });
        }
        else {
            setMarker(map, pos, "Você está aqui.", "Esta é a sua localização atual.", infoWindow, markers);
        }

        //fazendo requisicao das ocorrencias cadastradas
        $http.get(host + 'api/item/').success(function(response){
            scope.data = response.results;
            console.log(scope.data)
            //scope.data.dataehoraToShow = scope.data.dataehora.toLocaleString('pt-BR');

            //criando marcadores para todas as ocorrecias encontradas
            for (var i = 0; i < scope.data.length; i++) {

                //conteúdo do marker
                var content  =
                    '<div id="pin-content" class="col-md-12 col-sm-12 col-xs-12">'+
                        '<p><strong>'+ scope.data[i].ocorrencia.titulo + '</strong></p>' +
                        '<p>'+ scope.data[i].ocorrencia.tipo + '</p>' +
                        '<p>'+ new Date(scope.data[i].ocorrencia.dataehora).toLocaleString('pt-BR') + '</p>' +
                        '<p><a href=' + $window.location + 'ocorrencia/'+ scope.data[i].id +'>'+
                        'Consultar detalhes</a> </p>'+
                    '</div>';

                //adicionando marker
                setMarker(map, new google.maps.LatLng(scope.data[i].ocorrencia.latitude,
                    scope.data[i].ocorrencia.longitude), scope.data[i].ocorrencia.titulo,
                    content, infoWindow, markers, scope.data[i].pin);
            }
        }).error(function(response){
            console.log("get error", response);
        });
    };

    // place a marker
    function setMarker(map, position, title, content, infoWindow, markers, icon) {
        var marker;
        var markerOptions = {
            position: position,
            map: map,
            title: title,
            //animation: google.maps.Animation.DROP,
            icon: icon,optimized: false,
        };

        marker = new google.maps.Marker(markerOptions);
        markers.push(marker); // add marker to array

        google.maps.event.addListener(marker, 'click', function () {
            // close window if not undefined
            if (infoWindow) {
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