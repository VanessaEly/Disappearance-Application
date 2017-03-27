app.controller('NovaOcorrenciaController', function($scope) {

    $scope.ocorrencia = {};
    var imageLoader = document.getElementById('filePhoto');
    imageLoader.addEventListener('change', handleImage, false);

    function handleImage(e) {
        var reader = new FileReader();
        reader.onload = function (event) {
            $('#uploader img').attr('src',event.target.result);
        }
        reader.readAsDataURL(e.target.files[0]);
        document.getElementById('uploader').style.backgroundImage = "none";
        document.getElementById('uploader-text').style.display = "none";
    }
    $scope.save = function() {
        console.log("saved");
    }

    $scope.$watch($scope.coordinates, function() {
   });

    $scope.novaOcorrenciaInit = function() {
        $('#datetimepicker1').datetimepicker();
        console.log("nova ocorrencia init");
    }
});

