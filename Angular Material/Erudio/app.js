"use strict";

var app = angular.module("moduloCargo", ["ngMaterial", "ngRoute"]);

app.run;

app.config(function($httpProvider, $routeProvider, $locationProvider) {
    $httpProvider.interceptors.push("httpConfigurarToken");

    const urlPadrao = "/";

    $routeProvider
        .when(`${urlPadrao}cargosAtualizar`, {
            templateUrl: "cargosAtualizar.html"
        })
        .when(`${urlPadrao}cargosCadastro`, {
            template: "<h1>Cadastro de Cargos</h1>"
        })
        .when(`${urlPadrao}cargosCadastrados`, {
            template: "<h1>Cargos Cadastrados</h1>"
        });

    $locationProvider.html5Mode(true);
});

app.service("httpConfigurarToken", function() {
    let JWT_TOKEN =
        "eyJhbGciOiJSUzI1NiJ9.eyJyb2xlcyI6WyJST0xFX1NVUEVSX0FETUlOIl0sInVzZXJuYW1lIjoiMTAyOTk4MjU5NzMiLCJpYXQiOjE1MDIzMDUwMjMsImV4cCI6MTUwMjMwODYyM30.WW9fu8YJa3NRWq_jp54ThYpkRdHxkC_uJnhs_MxOtRidcd_s_kbl_a6-8g0S3GJrL1OekLqY9dAHmPXeaK1XK6yUTxkOs9xq7uzjhXgRR7f5yaHgkSNkpjaJJurvd9Q2uQS8Bgd6A1gC2Mz0QyZ1yCdvNCsuE535fL3kQx8B02MDP8tkqz9CFay1UR1POCKAtv2NiS2DjYR5wPGC15sm_nhsOfHViTeUyrRz7QJaHGPCcAYLzIcSFAjkOkZp7uUD5779_SpdFEullTaqtGVpjNeblBFjJhx0T2hR6gS4zn6UiNpbyhPdvDHuzQQox6rp9blBCUySJDZdHAd8h4NuARbK9bRrOOnr4sbPDntMJz5O68aKJeghcgjnaNHrJ323no53e8h-QFO8GCWapiTweb_Ydp5HxxlT03nmCuJjcxDgX3J7IwqXe4987o_RJxKKQrSr8yLH19U_bDvX_LaBulFW2HJPPswD4ehy-HPPPjM4YlQy5hQ3McW3N82qOlnCxUTypN2GXutaLaC_MmkKrSXyss_irmKhScZ2i8qPy9z7YAoo6nL9kz68zB6yQsC4KNULkEGlbHjn8om9pdzZXuIENr6GFoeiOyVvLJrLP8V-t7DRVLma5ayMU_j-8kYQhYbAPKvyAewTPfu-OR98LhZErGfQHI78cM3O6jzhQ7U";
    return {
        request: function(config) {
            config.headers["JWT-Authorization"] = `Bearer ${JWT_TOKEN}`;
            return config;
        }
    };
});

class RestService {
    constructor(http) {
        this.http = http;
        this.servidorUrl = "http://10.100.1.134/erudio/erudio-server/web/app.php/api";
    }

    gruposLista() {
        const gruposUrl = `${this.servidorUrl}/grupos`;
        return this.http
            .get(gruposUrl)
            .then(
                retorno => Promise.resolve(retorno.data),
                erro => erroDebug(erro.statusText, erro.status)
            );
    }

    cargosLista() {
        const cargosUrl = `${this.servidorUrl}/cargos`;
        return this.http
            .get(cargosUrl)
            .then(
                retorno => Promise.resolve(retorno.data),
                erro => erroDebug(erro.statusText, erro.status)
            );
    }

    cargoInserir(cargoNome, cargoProfessor, cargoGrupoId) {
        const cargoInserirUrl = `${this.servidorUrl}/cargos`;
        let cargoInserirDados = {
            nome: cargoNome,
            professor: cargoProfessor,
            grupo: {
                id: cargoGrupoId
            }
        };
        return this.http
            .post(cargoInserirUrl, cargoInserirDados)
            .then(
                success => Promise.resolve(success.data),
                erro => erroDebug(erro.statusText, erro.status)
            );
    }

    cargoIdBuscarInformacao(idBuscar) {
        const cargosIdUrl = `${this.servidorUrl}/cargos/${idBuscar}`;
        return this.http.get(cargosIdUrl).then(
            retorno => Promise.resolve(retorno.data),
            erro => {
                erroDebug(erro.statusText, erro.status);
                Promise.resolve(erro.data);
            }
        );
    }

    cargoAtualizar(cargoId, cargoNome, cargoProfessor, cargoGrupoId) {
        const cargoAtualizarUrl = `${this.servidorUrl}/cargos/${cargoId}`;

        let cargoAtualizarDados = {
            nome: cargoNome,
            professor: cargoProfessor,
            grupo: {
                id: cargoGrupoId
            }
        };

        return this.http
            .put(cargoAtualizarUrl, cargoAtualizarDados)
            .then(
                success => Promise.resolve(success.data),
                erro => erroDebug(erro.statusText, erro.status)
            );
    }
}

RestService.$inject = ["$http"];
app.service("restService", RestService);

app.controller("cargoController", function($scope, restService) {
    self = this;

    self.$onInit = () => {
        $scope.navAtual = "pagina1";
        self.cargosLista = {};
        self.carregarLista();
    };

    self.carregarLista = () => {
        const valorPadrao = "-";
        return restService.cargosLista().then(cargos => {
            self.cargosLista = cargos.map(cargo => (
                {
                    id: cargo.id.toString(),
                    nome: cargo.nome,
                    professor: cargo.professor.toString(),
                    grupo: cargo.grupo
                        ? {
                              id: cargo.grupo.id,
                              nome: cargo.grupo.nome
                          }
                        : {
                              id: valorPadrao,
                              nome: valorPadrao
                          }
                }
            ));
            return Promise.resolve(cargos);
        });
    };

    self.demo = () => {
        console.log("TESTE");
    };
});

const erroDebug = (statusText, status) => console.log(`${statusText} ${status}`);
