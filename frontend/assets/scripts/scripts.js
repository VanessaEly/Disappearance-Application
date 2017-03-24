function geocodePosition(pos) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode
    ({
            latLng: pos
        },
        function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                document.getElementById('cont').value(results[0].formatted_address);
            }
        }
    );
}

// google.maps.event.addListener(marker, 'dragend', function () {
//     geocodePosition(marker.getPosition());
//      var marker = new google.maps.Marker({
//         position: marker.getPosition(),
//         draggable: true,
//         animation: google.maps.Animation.DROP,
//         map: map
//     });
// });