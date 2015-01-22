/**
 * @fileoverview This is project entry point
 *
 * @autor Dmitry Lukianenko on 12/15/14.
 *
 * @license
 */
(function () {
    'use strict';

    //create Authentication module
    var Turan = angular.module('Turan',
        ['ngRoute', 'Authentication', 'Superadministrator', 'Handler', 'LocalStorageModule', 'Translate']);

    /**
     * Turan config
     * @param {!angular.RouteProvider} $routeProvider
     * @param {Constant} USER_ROLES
     * @param {localStorageServiceProvider} localStorageServiceProvider
     */
    Turan.config(['$routeProvider', 'USER_ROLES', 'localStorageServiceProvider', function ($routeProvider, USER_ROLES, localStorageServiceProvider) {

        /**
         * Configure localStorageServiceProvider for Authentication module
         * we are going to use sessionStorage
         */
        localStorageServiceProvider
            .setStorageType('sessionStorage');

        /**
         * Define project routes
         */
        $routeProvider
            .when('/', {
                title: 'LogIn',
                controller: 'AuthenticationController',
                templateUrl: 'partials/login.html',
                data: {
                    authorizedRole: USER_ROLES.all
                }
            })
            .when('/login', {
                title: 'LogIn',
                controller: 'AuthenticationController',
                templateUrl: 'partials/login.html',
                data: {
                    authorizedRole: USER_ROLES.all
                }
            })
            .when('/superadministrator', {
                title: 'Superadministrator',
                controller: 'SuperadministratorController',
                templateUrl: 'partials/superadministrator/superadministrator.html',
                data: {
                    authorizedRole: USER_ROLES.superadministrator
                }
            })
            .when('/handler', {
                title: 'Handler',
                controller: 'HandlerController',
                templateUrl: 'partials/handler/handler.html',
                data: {
                    authorizedRole: USER_ROLES.handler
                }
            })
            .otherwise({
                redirectTo: '/login'
            });

    }]).run(['$rootScope', '$window', '$http', '$location', 'USER_ROLES', 'AUTH_EVENTS', 'AuthService', 'Session',
        function ($rootScope, $window, $http, $location, USER_ROLES, AUTH_EVENTS, AuthService, Session) {

            //if user successfully logged
            if (Session.sessionId) {

                //send Authorization header with user's sessionId each time when we send POST request
                //to the server
                $http.defaults.headers.common.Authorization = 'Basic ' + Session.sessionId;
            }

            $rootScope.$on('$routeChangeStart', function (event, next) {

                var authorizedRole = USER_ROLES.all;

                if (typeof next.$$route.data !== 'undefined') {
                    authorizedRole = next.$$route.data.authorizedRole;
                }

                if (!AuthService.isAuthorized(authorizedRole)) {

                    event.preventDefault();

                    if (AuthService.isAuthenticated()) {

                        //user not allowed
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);

                    } else {

                        //user is not logged in
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                    }

                    $location.path('/');
                }
            });
        }]);
})();