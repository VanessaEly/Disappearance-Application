app.controller('NovaOcorrenciaController', function($scope, DBService) {

    $scope.ocorrencia = {}, $scope.pessoa = {}, $scope.animal = {}, $scope.objeto = {}, $scope.pa = {};
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
        if($scope.ocorrencia.categoria === "Pessoa") {
            $scope.pessoa.nome = $scope.pa.nome;
            $scope.pessoa.idade = $scope.pa.idade;
            $scope.pessoa.sexo = $scope.pa.sexo;
            $scope.ocorrencia.item = $scope.pessoa;
        } else if ($scope.ocorrencia.categoria === "Animal") {
            $scope.animal.nome = $scope.pa.nome;
            $scope.animal.idade = $scope.pa.idade;
            $scope.animal.sexo = $scope.pa.sexo;
            $scope.ocorrencia.item = $scope.animal;
        } else {
            $scope.ocorrencia.item = $scope.objeto;
        }
        console.log($scope.ocorrencia);

        DBService.addInforme($scope.ocorrencia)
  		.success(function(data, status) {
            console.log("sucesso", data);
  		})
  		.error(function (response, status) {
            console.log("erro", response, status);
  		});

        //service
        // this.addInforme = function(project) {
		// console.log(project);
		// return $http({
		// 	method: 'PUT',
		// 	url: "http://localhost:8000/api/novaocorrencia/",
		// 	headers: {'Authorization': "Bearer " + $cookies.get("token")},
		// 	data: {
		// 		data: project
		// 	}
		// });

        //app
        //var routes = require('./routes/routes');
        //app.put('/api/addproject', routes.addProject);
    }

    $scope.$watch($scope.coordinates, function() {
   });

    $scope.novaOcorrenciaInit = function() {
        $('#datetimepicker1').datetimepicker();
        console.log("nova ocorrencia init");
    }
});

