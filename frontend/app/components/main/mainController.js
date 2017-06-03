app.controller("MainController", function($q, $scope, $location, $rootScope, LoginService, StorageService) {


	$scope.mainInit = function() {
		StorageService.set("host", 'http://localhost:8000/');
		//if(StorageService.get("lista") === undefined){
			var lista = {
				racas: {Gato:["Persa"], Pássaro:["Canário"], Cachorro:["Pitbull"]},
				cores: ["Amarelo","Azul","Branco","Bronze","Bege","Castanho","Cinza","Dourado","Laranja","Marrom",
					"Prata","Preto","Rosa","Roxo","Verde","Vermelho","Outra"],
				objetos: ["Bicicleta","Carteira","Celular","Cartão","Documento","Mochila ou Bolsa","Notebook","Relógio",
					 "Outros"],
				sexos: ["Feminino", "Masculino", "Indeterminado"],
				etnias: ["Branco", "Indígena", "Pardo", "Mulato", "Negro", "Outro"]
			}
			StorageService.set("lista", lista)
		//}

	}

	$scope.$watch(function() {
		return LoginService.loginInfo.isLogged;
	}, function() {
		if (LoginService.loginInfo.isLogged == false) {
			LoginService.revokeLogin();
		}
	});

	$rootScope.goTo = function(aRouteParams) {
		if (aRouteParams) {
            $location.path(aRouteParams);
        }
		else{
			console.log("Go to /");
		}

	}

	$rootScope.toggleId = function(id){
        var e = document.getElementById(id);
        if(e.style.display == 'block')
           e.style.display = 'none';
        else
           e.style.display = 'block';
    };
});