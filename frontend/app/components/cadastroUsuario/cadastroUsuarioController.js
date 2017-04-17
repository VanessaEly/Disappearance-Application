app.controller('CadastroUsuarioController', function($scope, $http, $rootScope) {
    $scope.usuario = {};

    $scope.cadastroUsuarioInit = function() {
        console.log("cadastro usuario init");
    }

    $scope.cadastrar = function() {
        var data = { "username": $scope.usuario.username,
            "password": $scope.usuario.password,
            "email": $scope.usuario.email};
        $scope.errors = [];
        return $http.post('http://localhost:8000/api/users/', data).then(function successCallback(response) {
                console.log(response);
                $scope.goTo("/");
        }, function errorCallback(response) {
            console.log(response);
            if(response.status == 400) {
                for(var prop in response.data){
                    if (response.data.hasOwnProperty(prop)) {
                        $scope.errors.push(response.data[prop][0].toString());

                    }
                }
                $rootScope.$broadcast("toast", {
                    priority: "high",
                    text: "Não foi possível finalizar o cadastro"
                });
            }
        });
    }

    $scope.getUsers  = function() {
        return $http.get('http://localhost:8000/api/users/', {
            headers: {"Authorization": "Token b08289fa5ca8e60944a4875a8289cabe810adb6e"}
        }).success(function(response){
            console.log("get success", response)
        }).error(function(response){
            console.log("get error", response)
        });
    }
});

