app.controller('CadastroUsuarioController', function($scope, $http) {
    // Sends this header with any AJAX request
    $scope.usuario = {};
    $scope.cadastroUsuarioInit = function() {
        console.log("cadastro usuario init");
    }

    $scope.cadastrar = function() {
        var data = { "username": $scope.usuario.username,
            "password": $scope.usuario.password,
            "email": $scope.usuario.email};
        return $http.post('http://localhost:8000/api/users/', data).then(function(response){
            console.log("login response", response.data);
        })
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

