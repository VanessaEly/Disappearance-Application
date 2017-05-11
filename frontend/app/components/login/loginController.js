app.controller('LoginController', function($scope, $http, ToastsService) {
    $scope.loginInit = function() {
        console.log("login init");
    }

    $scope.login = function () {
        $http.post('http://localhost:8000/api-token-auth/', $scope.usuario).then(function successCallback(response) {
                console.log(response);
                ToastsService.makeToast("ok", "Logado com sucesso!", 2000);
                $scope.goTo("/");
        }, function errorCallback(response) {
            console.log(response);
            $scope.errors = [];

            if(response.status == 400) {
                $scope.errors.push("Usuário e senha inválidos");
                ToastsService.makeToast("high", "Usuário e senha inválidos", 2000);

                // for(var prop in response.data){
                //     if (response.data.hasOwnProperty(prop)) {
                //         $scope.errors.push(response.data[prop][0].toString());
                //
                //     }
                // }
                // $rootScope.$broadcast("toast", {
                //     priority: "high",
                //     text: "Não foi possível finalizar o cadastro"
                // });
            }
        });
    }

});

