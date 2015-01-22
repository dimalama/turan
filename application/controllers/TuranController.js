/**
 * @fileoverview This is Turan Controller
 *
 * @autor Dmitry Lukianenko on 12/19/14.
 *
 * @license
 */

(function () {
    'use strict';

    var Turan = angular.module('Turan');

    /**
     * Turan Controller contains common logic of the project
     * @param {!angular.RootScope} $rootScope
     * @param {!angular.Scope} $scope
     * @param {Constant} AUTH_EVENTS
     * @param {Constant} USER_ROLES
     * @param {AuthService} AuthService
     * @param {localStorageService} localStorageService
     */
    Turan.controller('TuranController',
        ['$rootScope', '$scope', 'AUTH_EVENTS', 'USER_ROLES', 'AuthService', 'localStorageService', 'browser',
            function ($rootScope, $scope, AUTH_EVENTS, USER_ROLES, AuthService, localStorageService, browser) {

                /**
                 * init currentUser
                 * @type {null}
                 * @public
                 */
                $scope.currentUser = null;

                /**
                 * init userRoles
                 * @public
                 */
                $scope.userRoles = USER_ROLES;

                /**
                 * init isAuthorized flag
                 * @type {boolean}
                 * @public
                 */
                $scope.isAuthorized = false;

                /**
                 * User login name
                 * @type {string}
                 * @public
                 */
                $scope.accountName = '';

                /**
                 * add class firefox if it is firefox browser, this is made because
                 * firefox displays font different then other browsers
                 */
                if (browser() === 'firefox') {
                    document.getElementsByTagName('body')[0].classList.add('firefox');
                }

                /**
                 * Set readable user role name
                 * @private
                 */
                var setRoleName = function () {
                    switch ($scope.currentUser.role) {
                        case USER_ROLES.superadministrator:
                            $scope.currentUser.roleName = 'Superadministrator';
                            break;
                        case USER_ROLES.administrator:
                            $scope.currentUser.roleName = 'Administrator';
                            break;
                        case USER_ROLES.handler:
                            $scope.currentUser.roleName = 'Handler';
                            break;
                        case USER_ROLES.supervisor:
                            $scope.currentUser.roleName = 'Supervisor';
                            break;
                    }
                };

                /**
                 * Update/set controller fields
                 * @private
                 */
                var update = function () {
                    $scope.currentUser = localStorageService.get('user');
                    $scope.accountName = localStorageService.get('accountName');
                    $scope.isAuthorized = AuthService.isAuthorized;
                    if ($scope.currentUser) {
                        setRoleName();
                    }
                };

                /**
                 * Disable arrow up/down scroll
                 * @private
                 */
                var disableArrowScroll = function () {
                    var keyCodes = new Array(38, 40);
                    document.addEventListener('keydown', function (event) {
                        var key = event.which;
                        if (keyCodes.indexOf(key) > -1) {
                            event.preventDefault();
                            return false;
                        }
                        return true;
                    }, false);
                };

                update();
                disableArrowScroll();

                //subscribe for loginSuccess broadcast event and update controller fields when
                //it happens
                $rootScope.$on(AUTH_EVENTS.loginSuccess, update);

            }]);
})();