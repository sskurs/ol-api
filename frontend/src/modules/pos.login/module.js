import SellerLoginController from './SellerLoginController';

const MODULE_NAME = 'pos.login';

angular.module(MODULE_NAME, [])
    .config($stateProvider => {
        $stateProvider
            .state('forgot-password-request-seller', {
                url: "/seller/password/request",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/password-request-extend-top.html',
                        controller: 'SecurityController',
                        controllerAs: 'SecurityCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/password-request.html',
                        controller: 'SecurityController',
                        controllerAs: 'SecurityCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/password-request-extend-bottom.html',
                        controller: 'SecurityController',
                        controllerAs: 'SecurityCtrl'
                    }
                }
            })
            .state('forgot-password-reset-seller', {
                url: "/password/reset/:token",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/password-reset-extend-top.html',
                        controller: 'SecurityController',
                        controllerAs: 'SecurityCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/password-reset.html',
                        controller: 'SecurityController',
                        controllerAs: 'SecurityCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/password-reset-extend-bottom.html',
                        controller: 'SecurityController',
                        controllerAs: 'SecurityCtrl'
                    }
                }
            })
            .state('seller-login', {
                url: "/",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/seller-login-extend-top.html',
                        controller: 'SellerLoginController',
                        controllerAs: 'SellerLoginCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/seller-login.html',
                        controller: 'SellerLoginController',
                        controllerAs: 'SellerLoginCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/seller-login-extend-bottom.html',
                        controller: 'SellerLoginController',
                        controllerAs: 'SellerLoginCtrl'
                    }
                }
            });
    })
    .run(($templateCache, $http) => {
        let catchErrorTemplate = () => {
            throw MODULE_NAME + ' has missing template';
        };

        $templateCache.put('./templates/password-request-extend-top.html', '');
        $templateCache.put('./templates/password-request-extend-bottom.html', '');

        $templateCache.put('./templates/password-reset-extend-top.html', '');
        $templateCache.put('./templates/password-reset-extend-bottom.html', '');

        $templateCache.put('./templates/seller-login-extend-top.html', '');
        $templateCache.put('./templates/seller-login-extend-bottom.html', '');

        $http.get('./build/' + MODULE_NAME + '/templates/seller-login.html')
            .then(
                response => {
                    $templateCache.put('./templates/seller-login.html', response.data);
                }
            )
            .catch(catchErrorTemplate);

        $http.get('./build/' + MODULE_NAME + '/templates/password-request.html')
            .then(
                response => {
                    $templateCache.put('./templates/password-request.html', response.data);
                }
            )
            .catch(catchErrorTemplate);

        $http.get('./build/' + MODULE_NAME + '/templates/password-reset.html')
            .then(
                response => {
                    $templateCache.put('./templates/password-reset.html', response.data);
                }
            )
            .catch(catchErrorTemplate);
    })
    .controller('SellerLoginController', SellerLoginController);

try {
    window.OpenLoyaltyConfig.modules.push(MODULE_NAME);
} catch (err) {
    throw MODULE_NAME + ' will not be registered';
}