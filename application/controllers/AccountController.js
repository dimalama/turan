/**
 * @fileoverview This is Account Controller
 *
 * @autor Dmitry Lukianenko on 12/28/14.
 *
 * @license
 */

(function () {
    'use strict';

    var Turan = angular.module('Turan');

    /**
     * Turan constants
     * @const
     */
    Turan.constant('ACCOUNT_EVENTS', {
        editAccountFailed: 'edit-account-failed',
        editAccountSuccess: 'edit-account-successful',
        menuStateChange: 'menu-state-changed'
    });

    /**
     * Account Controller
     * @param {!angular.RootScope} $rootScope
     * @param {!angular.Scope} $scope
     * @param {!angular.Http} $http
     * @param {menuService} menuService
     * @param {dialogService} dialogService
     * @param {localStorageService} localStorageService
     * @param {Constant} ACCOUNT_EVENTS
     * @param {translate} $translate
     */
    Turan.controller('AccountController', ['$rootScope', '$scope', '$http', 'dialogService', 'menuService', 'localStorageService', 'ACCOUNT_EVENTS', '$translate',
        function ($rootScope, $scope, $http, dialogService, menuService, localStorageService, ACCOUNT_EVENTS, $translate) {

            /**
             * Edit Account Scope
             *
             * Edit Account credentials
             * @type {{credentials: {accountName: *, oldPassword: string, newPassword: string, repeatNewPassword: string}}}
             * @public
             */
            $scope.editAccount = {
                credentials: {
                    accountName: localStorageService.get('accountName'),
                    oldPassword: '',
                    newPassword: '',
                    repeatNewPassword: ''
                }
            };

            /**
             * Don't show error on first form load
             * @type {boolean}
             * @public
             */
            $scope.$parent.passwordsMismatch = false;

            /**
             * To save initial state of credentials for future use
             * @type {XMLList|XML|*}
             * @private
             */
            var _initialCredentials = angular.copy($scope.editAccount.credentials);

            /**
             * Submit account edit form to the server and process success save of it, or
             * save errors
             * @param {Object} editAccountForm - account edit for object
             * @public
             */
            $scope.submitEditAccount = function (editAccountForm) {

                var _editAccountForm = editAccountForm || null;

                $http.post(
                    '/',
                    {
                        accountName: $scope.editAccount.credentials.accountName,
                        oldPassword: $scope.editAccount.credentials.oldPassword,
                        newPassword: $scope.editAccount.credentials.newPassword,
                        repeatNewPassword: $scope.editAccount.credentials.repeatNewPassword
                    }
                ).success(function (data) {

                        var _data = data;

                        //To emulate error from the server
                        /*var data = {
                         errors: {
                         oldPasswordError: true,
                         accountNameError: false
                         }
                         };*/

                        if (_data.errors) { // server returns error

                            $scope.editAccount.errors = _data.errors;

                            if ($scope.editAccount.errors.oldPasswordError) {
                                _editAccountForm.editAccount.oldPassword.$invalid = true;
                            }

                            if ($scope.editAccount.errors.accountNameError) {
                                _editAccountForm.editAccount.accountName.$invalid = true;
                            }

                            $rootScope.$broadcast(ACCOUNT_EVENTS.editAccountFailed);

                        } else { //user account settings has been successfully changed

                            $rootScope.$broadcast(ACCOUNT_EVENTS.editAccountSuccess);

                            //move to initial state of interface changing the scope of
                            //the parent Superadministrator controller
                            $scope.$parent.$parent.content = 'content-0';

                            menuService.removeSelectedState('system-settings-menu');

                            $translate(['DIALOG.EDIT_ACCOUNT.TITLE', 'DIALOG.EDIT_ACCOUNT.BODY', 'DIALOG.EDIT_ACCOUNT.OK'])
                                .then(function (translation) {
                                    dialogService.open(
                                        translation['DIALOG.EDIT_ACCOUNT.TITLE'],
                                        translation['DIALOG.EDIT_ACCOUNT.BODY'],
                                        translation['DIALOG.EDIT_ACCOUNT.OK']);
                                });
                        }

                    }).error(function () {

                        $rootScope.$broadcast(ACCOUNT_EVENTS.editAccountFailed);
                    });

            };

            /**
             * In order to not save information in the input fields of the form
             * after we perform cancel action we need to reset form to initial state
             * that is method here for.
             * @param {Object} editAccountForm
             * @public
             */
            $scope.cancelEditAccount = function (editAccountForm) {

                var _editAccountForm = editAccountForm || null;

                if (_editAccountForm) {

                    _editAccountForm.$setPristine();
                    _editAccountForm.$setUntouched();

                    //move to initial state of interface changing the scope of
                    //the parent Superadministrator controller
                    $scope.$parent.$parent.content = 'content-0';
                }

                menuService.removeSelectedState('system-settings-menu');

                $scope.editAccount.credentials = angular.copy(_initialCredentials);
            };

            /**
             * Subscribe for superadministrator menu change event
             */
            $scope.$on(ACCOUNT_EVENTS.menuStateChange, function () {
                $scope.cancelEditAccount();
            });


        }]);

})();