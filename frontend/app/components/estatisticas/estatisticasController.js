app.controller('EstatisticasController', function($scope, $http, StorageService) {
    $scope.bo = { labels:["Sim", "Não"], data:[0, 0]};
    $scope.tipo = { labels:["Aparecimento", "Desaparecimento"], data:[0, 0]};
    $scope.solucionado = { labels:["Sim", "Não"], data:[0, 0]};
    $scope.categoria = { labels:["Pessoa", "Animal", "Objeto"], data:[0, 0, 0]};
    $scope.aparecimentoCategoria = { labels:["Pessoa", "Animal", "Objeto"], data:[0, 0, 0]};
    $scope.desaparecimentoCategoria = { labels:["Pessoa", "Animal", "Objeto"], data:[0, 0, 0]};
    $scope.solucionadoCategoria = { labels:["Pessoa", "Animal", "Objeto"], data:[0, 0, 0]};
    $scope.emAbertoCategoria = { labels:["Pessoa", "Animal", "Objeto"], data:[0, 0, 0]};

    $scope.estatisticasInit = function() {
        $scope.host = StorageService.get("host");
        $http.get($scope.host + 'api/ocorrencia/').success(function(response){
            $scope.ocorrecias= response.results;
            for (var i = 0; i < $scope.ocorrecias.length; i++) {
                //boletim de ocorrencia
                $scope.ocorrecias[i].bo === true? $scope.bo.data[0] += 1: $scope.bo.data[1] += 1;
                //tipo de ocorrencia
                if ($scope.ocorrecias[i].tipo === 'Aparecimento') {
                    $scope.tipo.data[0] += 1;
                    //Aparecimentos por Categoria
                    if ($scope.ocorrecias[i].categoria === 1)
                        $scope.aparecimentoCategoria.data[0] += 1;
                    else if ($scope.ocorrecias[i].categoria === 2)
                        $scope.aparecimentoCategoria.data[1] += 1;
                    else
                        $scope.aparecimentoCategoria.data[2] += 1;
                }
                else {
                    $scope.tipo.data[1] += 1;
                    //Desaparecimentos por Categoria
                    if ($scope.ocorrecias[i].categoria === 1)
                        $scope.desaparecimentoCategoria.data[0] += 1;
                    else if ($scope.ocorrecias[i].categoria === 2)
                        $scope.desaparecimentoCategoria.data[1] += 1;
                    else
                        $scope.desaparecimentoCategoria.data[2] += 1;
                }
                //por categoria
                $scope.ocorrecias[i].categoria === 1? $scope.categoria.data[0] += 1:
                    $scope.ocorrecias[i].categoria === 2? $scope.categoria.data[1] += 1 : $scope.categoria.data[2] += 1;

                //solucionado?
                if ($scope.ocorrecias[i].solucionado === true){

                    $scope.solucionado.data[0] += 1;
                    //Solucionados por Categoria
                    if ($scope.ocorrecias[i].categoria === 1)
                        $scope.solucionadoCategoria.data[0] += 1;
                    else if ($scope.ocorrecias[i].categoria === 2)
                        $scope.solucionadoCategoria.data[1] += 1;
                    else
                        $scope.solucionadoCategoria.data[2] += 1;
                }
                else {
                    $scope.solucionado.data[1] += 1;
                    //Em Aberto por Categoria
                    if ($scope.ocorrecias[i].categoria === 1)
                        $scope.emAbertoCategoria.data[0] += 1;
                    else if ($scope.ocorrecias[i].categoria === 2)
                        $scope.emAbertoCategoria.data[1] += 1;
                    else
                        $scope.emAbertoCategoria.data[2] += 1;
                }
            }
        });

        $scope.initCharts();
    }

    $scope.initCharts = function() {
        Chart.defaults.global.colors = ['#222930','#4EB1BA', '#2EA22B']
    }

    $scope.options =  {
        animation: {
            duration: 1000
        },
        legend: {
            display: true,
            labels: {
                boxWidth: 8,
                fontSize: 11,
                padding: 3,
                fontFamily: "HelvNeueMd",
            },
            onClick: function(e, legendItem) {}
        },
        tooltips: {
				mode: 'label',
				callbacks: {
					label: function(tooltipItem, data) {
						var allData = data.datasets[tooltipItem.datasetIndex].data;
						var tooltipLabel = data.labels[tooltipItem.index];
						var tooltipData = allData[tooltipItem.index];
						var total = 0;
						for (var i in allData) {
							total += allData[i];
						}
						var tooltipPercentage = Math.round((tooltipData / total) * 100);
						return tooltipLabel + ': ' + tooltipData + ' (' + tooltipPercentage + '%)';
					}
				}
			},
			showPercentage: true,
    };
    Chart.pluginService.register({
        afterDraw: function (chart, easing) {
            if (chart.config.options.showPercentage || chart.config.options.showLabel) {
                var self = chart.config;
                var ctx = chart.chart.ctx;
                //change style
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 3;
                ctx.font = 'bold 7pt HelvNeueMd';
                ctx.fillStyle = "#fff";
                ctx.textBaseline = "top";
                ctx.textAlign = "center";

                self.data.datasets.forEach(function (dataset, datasetIndex) {
                    var total = 0, //total values to compute fraction
                        labelxy = [],
                        offset = Math.PI / 2, //start sector from top
                        radius,
                        centerx,
                        centery,
                        lastend = 0; //prev arc's end line: starting with 0

                    for (var i = 0; i < dataset.data.length; i++) { total += dataset.data[i]; }

                    var i = 0;
                    var meta = dataset._meta[i];
                    while (!meta) {
                        i++;
                        meta = dataset._meta[i];
                    }

                    var element;
                    for (index = 0; index < meta.data.length; index++) {

                        //define tooltip position
                        element = meta.data[index];
                        radius = 1.1 * element._view.outerRadius - element._view.innerRadius;
                        centerx = element._model.x;
                        centery = element._model.y;
                        var thispart = dataset.data[index],
                            arcsector = Math.PI * (2 * thispart / total);
                        if (element.hasValue() && dataset.data[index] > 0) {
                            labelxy.push(lastend + arcsector / 2 + Math.PI + offset);
                        }
                        else {
                            labelxy.push(-1);
                        }
                        lastend += arcsector;
                    }

                    var lradius = radius * 3 / 4;
                    for (var idx in labelxy) {
                        if (labelxy[idx] === -1) continue;
                        var langle = labelxy[idx],
                            dx = centerx + lradius * Math.cos(langle),
                            dy = centery + lradius * Math.sin(langle),
                            val = Math.round(dataset.data[idx] / total * 100);
                        if (chart.config.options.showPercentage && val > 3) {
                            //tooltop text
                            ctx.strokeText(dataset.data[idx] + " (" + val + "%)", dx, dy);
                            ctx.fillText(dataset.data[idx] + " (" + val + "%)", dx, dy);
                        }
                    }
                    ctx.restore();
                });
            }
        }
    });

});


