app.service("DBService", function($http) {

    this.addInforme = function(informe) {
		console.log(informe);
		return $http({
			method: 'PUT',
			url: "http://localhost:8000/api/novaocorrencia/",
			data: {
				data: informe
			}
		});
	}

})
