app.controller("MainController", function($q, $scope, $location, $rootScope, LoginService, StorageService, $location) {


	$scope.mainInit = function() {
		if ($location.$$host === 'localhost')
			StorageService.set("host", 'http://localhost:8000/');
		else
			StorageService.set("host", '/');

		var lista = {
			racas: {
				Gato:["Abissínio","Angorá","Balinês","Bengal","Bobtail americano","Bobtail japonês","Bombay",
					"Burmês","Burmês vermelho","Chartreux","Colorpoint de Pêlo Curto","Cornish Rex","Curl Americano",
					"Devon Rex","Himalaio","Jaguatirica","Javanês","Korat","LaPerm","Maine Coon","Manx","Cymric",
					"Mau Egípcio","Mist Australiano","Munchkin","Norueguês da Floresta","Pelo curto americano",
					"Pelo curto brasileiro","Pelo curto europeu","Pelo curto inglês","Persa","Pixie-bob","Ragdoll",
					"Ocicat","Russo Azul","Sagrado da Birmânia","Savannah","Scottish Fold","Selkirk Rex","Siamês",
					"Siberiano","Singapura","Somali","Sphynx","Thai","Tonquinês","Toyger","Usuri", "Outro"],
				Pássaro:["Agapornis", "Calopsita","Canário", "Periquito Australiano", "Outra"],
				Cachorro:["Alano Espanhol", "Airedale Terrier", "American Bully", "American Staffordshire Terrier",
					"American Pitbull Terrier", "Basset", "Basset Hound", "Beagle", "Bearded Collie",
					"Bichon Maltês", "Bobtail", "Border Collie", "Boston Terrier", "Boxer", "Bull Terrier",
					"Bullmastiff", "Bulldog", "Caniche", "Chihuahua", "Chow Chow", "Cocker Spaniel", "Dálmata", "Dobermann",
					"Dogue Alemão", "Dogue Argentino", "Golden Retriever", "Husky Siberiano", "Laika", "Labrador Retriever",
					"Malamute-do-Alasca", "Mastin", "Pastor Alemão", "Pastor Belga", "Pequinês", "Pug", "Rottweiler",
					"Samoiedo", "São Bernardo", "Scottish Terrier", "Shar-Pei", "Shiba Inu", "Staffordshire Bull Terrier",
					"Terra-nova", "Yorkshire Terrier", "Outra"]},
			cores: ["Amarelo","Azul","Branco","Bronze","Bege","Castanho","Cinza","Dourado","Laranja","Marrom",
				"Prata","Preto","Rosa","Roxo","Verde","Vermelho","Outra"],
			objetos: ["Bicicleta","Carteira","Celular","Cartão","Documento","Mochila ou Bolsa","Notebook","Relógio",
				 "Outros"],
			sexos: ["Feminino", "Masculino", "Indeterminado"],
			etnias: ["Branco", "Indígena", "Pardo", "Mulato", "Negro", "Outro"]
		}
		StorageService.set("lista", lista)
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