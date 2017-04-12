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
        return $http.post('http://localhost:8000/api/users/', data).success(function (data) {
               console.log("login success", data)
           })
      }

      // $scope.getUsers  = function() {
      //   return $http.get('http://localhost:8000/api/users/').success(function (data) {
      //         console.log("login success", data)
      //     })
      // }
});

