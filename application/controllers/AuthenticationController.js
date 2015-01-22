/**
 * @fileoverview This is Authorization controller
 *
 * @autor Dmitry Lukianenko on 12/15/14.
 *
 * @license
 */
(function () {
    'use strict';

    //create Authentication module
    var Authentication = angular.module('Authentication', ['LocalStorageModule']);

    /**
     * Authentication constants
     * @const
     */
    Authentication.constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    }).constant('USER_ROLES', {
        all: 0,
        superadministrator: 1,
        administrator: 2,
        handler: 3,
        supervisor: 4
    });

    /**
     * Configure localStorageServiceProvider for Authentication module
     * we are going to use sessionStorage
     * @param {localStorageServiceProvider} localStorageServiceProvider
     */
    Authentication.config(['localStorageServiceProvider', function (localStorageServiceProvider) {
        localStorageServiceProvider
            .setStorageType('sessionStorage');
    }]);

    /**
     * Authentication Controller
     * @param {!angular.Window} $window
     * @param {!angular.Scope} $scope
     * @param {!angular.RootScope} $rootScope
     * @param {!angular.Location} $location
     * @param {Constant} USER_ROLES
     * @param {Constant} AUTH_EVENTS
     * @param {AuthService} AuthService
     * @param {Session} Session
     */
    Authentication.controller('AuthenticationController',
        ['$window', '$scope', '$rootScope', '$location', 'USER_ROLES', 'AUTH_EVENTS', 'AuthService', 'Session',
            function ($window, $scope, $rootScope, $location, USER_ROLES, AUTH_EVENTS, AuthService, Session) {

                /**
                 * init user's credentials
                 * @type {{username: string, password: string}}
                 * @public
                 */
                $scope.credentials = {
                    username: '',
                    password: ''
                };

                /**
                 * controls overlay DOM element state
                 * @type {boolean}
                 * @public
                 */
                $scope.overlayState = true;

                /**
                 * Login method handler for the form
                 * @param {Object} authenticationForm
                 * @public
                 */
                $scope.logIn = function (authenticationForm) {

                    var _authenticationForm = authenticationForm || null;

                    $scope.showSpinner = true;

                    AuthService.login($scope.credentials).then(function (data) {

                        if (data.errors) { // if server returned errors

                            $scope.errors = data.errors;

                            if ($scope.errors.usernameError) {
                                _authenticationForm.username.$invalid = true;
                            }

                            if ($scope.errors.passwordError) {
                                _authenticationForm.password.$invalid = true;

                            }

                            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);

                        } else { //if log in successful

                            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

                            //redirect user according his role
                            switch (data.user.role) {
                                case USER_ROLES.all:
                                    $location.path('/login');
                                    break;
                                case USER_ROLES.superadministrator:
                                    $location.path('/superadministrator');
                                    $scope.overlayState = false;
                                    break;
                                case USER_ROLES.administrator:
                                    $location.path('/administrator');
                                    break;
                                case USER_ROLES.handler:
                                    $location.path('/handler');
                                    break;
                                case USER_ROLES.supervisor:
                                    $location.path('/supervisor');
                                    break;
                                default :
                                    $location.path('/');
                            }
                        }
                    }, function () { //promise reject
                        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);

                    }).finally(function () { //executes no mater of what
                        $scope.showSpinner = false;
                    });
                };

                /**
                 * Log out user from the system
                 * @public
                 */
                $scope.logOut = function () {

                    Session.destroy();
                    $window.location.href = '/';
                };
            }]);
})();