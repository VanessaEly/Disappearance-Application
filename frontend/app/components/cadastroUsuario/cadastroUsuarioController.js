app.controller('CadastroUsuarioController', function($scope) {
    $scope.usuario = {};
    $scope.cadastroUsuarioInit = function() {
        console.log("cadastro usuario init");
    }

     $scope.cadastrar = function() {
        console.log("cadastrando");
    }
});

