var _ = require('lodash');

import EditableMap from './component/global/map/EditableMap';
import ParamsMap from './component/global/map/ParamsMap';
import Validation from './component/global/validation/Validation';

import ModalDirective from './component/global/modal/ModalDirective';
import CheckboxDirective from './component/global/checkbox/CheckboxDirective';
import DatepickerDirective from './component/global/datepicker/DatepickerDirective';
import FormValidationDirective from './component/global/validation/FormValidationDirective';
import CsvUploadDirective from './component/global/csv/CsvUploadDirective';
import SecurityController from './component/global/security/SecurityController';
import SecurityService from './component/global/security/SecurityService';

import AuthService from './component/global/auth/AuthService';
//admin
import DataService from './component/global/data/DataService';
import TranslationService from './component/global/translations/TranslationService';
import TranslationLoader from './component/global/translations/TranslationLoader';

import RootController from './component/global/root/RootController';
//admin
import StaticPagesController from './component/global/pages/StaticPagesController';
import StaticPagesDirective from './component/global/pages/StaticPagesDirective';
import FileModelDirective from './component/global/filereader/FileModelDirective';
import BoxLoaderDirective from './component/global/boxLoader/BoxLoaderDirective';
import SpinnerLoaderDirective from './component/global/spinnerLoader/SpinnerLoaderDirective';

import DebugController from './component/global/debug/DebugController';

import Filters from './component/global/filters/Filters';

if (!window.OpenLoyaltyConfig.debug) {
    if (!window.console) window.console = {};
    var methods = ["log", "debug", "warn", "info"];
    for (var i = 0; i < methods.length; i++) {
        console[methods[i]] = function () {
        };
    }
}

angular.module('OpenLoyalty', [
    'ui.router',
    'ace.angular',
    'angular-jwt',
    'restangular',
    'ngFlash',
    'angularMoment',
    'ngTable',
    'ui.select',
    'ngSanitize',
    'ng-sortable',
    'pascalprecht.translate',
    'selectize',
    'chart.js',
    'ng.jsoneditor',
    'angular-loading-bar',
    'ngAnimate',
    'admin.campaign',
    'admin.customers',
    'admin.dashboard',
    'admin.data',
    'admin.earning-rules',
    'admin.levels',
    'admin.login',
    'admin.partials',
    'admin.pos',
    'admin.segment',
    'admin.seller',
    'admin.settings',
    'admin.transactions',
    'admin.transfers',
    'admin.translations',
    'admin.users',
    'admin.emails',
    'admin.logs'
])
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, jwtInterceptorProvider, RestangularProvider, $translateProvider, $locationProvider, cfpLoadingBarProvider) {
        let config = window.OpenLoyaltyConfig;

        cfpLoadingBarProvider.includeSpinner = false;
        $translateProvider.useLoader('TranslationLoader');
        $locationProvider.hashPrefix('!');
        $translateProvider.preferredLanguage('en');

        RestangularProvider.setBaseUrl(config.apiUrl);

        RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, $state) {
            var extractedData = data;

            if (extractedData.customers) {
                for (let i in data.customers) {
                    if (extractedData.customers[i].customerId) {
                        extractedData.customers[i].id = extractedData.customers[i].customerId
                    }
                }
            }
            if (extractedData.customerId) {
                extractedData.id = extractedData.customerId
            }
            if (extractedData.campaignId) {
                extractedData.id = extractedData.campaignId
            }

            if (operation === "getList") {
                let keys = Object.keys(data);
                extractedData = data[keys[0]];
                extractedData.total = data.total;
                extractedData.additional = data.additional;
            }

            return extractedData;
        });

        jwtInterceptorProvider.tokenGetter = ['AuthService', 'jwtHelper', 'config', '$state', function (AuthService, jwtHelper, config, $state) {
            if (config.url.indexOf('login_check') !== -1 || config.url.indexOf('token/refresh') !== -1) {
                return null;
            }

            let idToken = AuthService.getStoredToken();

            if (idToken && jwtHelper.isTokenExpired(idToken) && AuthService.isRememberMe()) {
                return AuthService.getRefreshToken()
                    .then(
                        res => {
                            let id_token = res.token;
                            let refresh_token = res.refresh_token;

                            AuthService.setStoredRefreshToken(refresh_token);
                            AuthService.setStoredToken(id_token);

                            return id_token;
                        },
                        res => {
                            AuthService.logout();
                        }
                    );
            } else if (idToken && !jwtHelper.isTokenExpired(idToken)) {
                return idToken;
            } else {
                return null
            }
        }];

        $httpProvider.interceptors.push('jwtInterceptor');

        $urlRouterProvider
            .otherwise("/");
        $stateProvider
            .state('admin-login', {
                url: "/",
                templateUrl: './templates/login.html',
                controller: 'LoginController',
                controllerAs: 'LoginCtrl'
            })
            .state('forgot-password-request-admin', {
                url: "/admin/password/request",
                templateUrl: './templates/password-request.html',
                controller: 'SecurityController',
                controllerAs: 'SecurityCtrl'
            })
            .state('forgot-password-reset-admin', {
                url: "/password/reset/:token",
                templateUrl: './templates/password-reset.html',
                controller: 'SecurityController',
                controllerAs: 'SecurityCtrl'
            })
            .state('admin.static', {
                url: "/page/:pageName",
                views: {
                    '@': {
                        templateUrl: './templates/static-pages.html',
                        controller: 'StaticPagesController',
                        controllerAs: 'StaticPagesCtrl'
                    }
                }
            })

        if (window.OpenLoyaltyConfig.debug) {
            $stateProvider.state('debug', {
                url: "/debug",
                views: {
                    '@': {
                        templateUrl: './templates/debug.html',
                        controller: 'DebugController',
                        controllerAs: 'DebugCtrl'
                    }
                }
            });
        }
    })

    .run(['Restangular', '$state', 'AuthService', '$rootScope', '$templateCache', function (Restangular, $state, AuthService, $rootScope, $templateCache) {
        $rootScope.pendingRequests = _.isNumber($rootScope.pendingRequests) ? $rootScope.pendingRequests : 0;
        Restangular.setErrorInterceptor(function (response) {
            //console.log('ErrorInterceptor', response);
            $rootScope.pendingRequests -= 1;
            if (response.data.message && response.data.message === 'Bad credentials') {
                return true;
            }
            if (response.status === 401) {
                AuthService.logout();
                return false;
            }
            return true;
        });
        Restangular.addResponseInterceptor(res => {
            //console.log('ResponseInterceptor', res, res.reqParams);
            if ($rootScope.pendingRequests > 0) {
                $rootScope.pendingRequests -= 1;
            }
            //console.log('pending request', $rootScope.pendingRequests)

            return res;
        });
        Restangular.addFullRequestInterceptor((element, operation, what, url, headers, params) => {
            //filter[silenceQuery]: true
            //console.log('requestInterceptor', element, operation, what, url, headers, params);
            console.log('pendingRequest', $rootScope.pendingRequests)
            if (!params.silenceQuery) {
                $rootScope.pendingRequests += 1;
            }
            //console.log('pending request', $rootScope.pendingRequests)

            return element;
        });
        $templateCache.put('ng-table/filters/text.html', '<input type="text" name="{{name}}" ng-disabled="$filterRow.disabled" ng-model="params.filter()[name]" class="input-filter form-control" placeholder="{{getFilterPlaceholderValue(filter, name)}}" ng-model-options="{debounce: 1500}" /> ');
        $templateCache.put('ng-table/filters/number.html', '<input type="number" name="{{name}}" ng-disabled="$filterRow.disabled" ng-model="params.filter()[name]" class="input-filter form-control" placeholder="{{getFilterPlaceholderValue(filter, name)}}" ng-model-options="{debounce: 1500}" /> ');

    }])

    .filter('commaToDot', () => new Filters.CommaToDecimal())
    .filter('percent', () => new Filters.Percent())
    .filter('propsFilter', () => new Filters.PropsFilter())
    .filter('isEmpty', () => new Filters.IsEmptyFilter())

    .directive('modal', () => new ModalDirective())
    .directive('datepicker', () => new DatepickerDirective())
    .directive('formValidation', () => new FormValidationDirective())
    .directive('csvUpload', () => new CsvUploadDirective())
    .directive('checkbox', () => new CheckboxDirective())
    .directive('staticPage', () => new StaticPagesDirective())
    .directive('fileModel', FileModelDirective.create)
    .directive('boxLoader', BoxLoaderDirective.create)
    .directive('spinnerLoader', SpinnerLoaderDirective.create)


    .service('EditableMap', EditableMap)
    .service('ParamsMap', ParamsMap)
    .service('Validation', Validation)
    .service('AuthService', AuthService)
    .service('DataService', DataService)
    .service('SecurityService', SecurityService)
    .service('TranslationService', TranslationService)
    .factory('TranslationLoader', ['TranslationService', (TranslationService) => new TranslationLoader(TranslationService)])

    .controller('RootController', RootController)
    .controller('SecurityController', SecurityController)
    .controller('StaticPagesController', StaticPagesController)
    .controller('DebugController', DebugController)
