/**
 * @fileoverview Checks if password matching
 *
 * @autor Dmitry Lukianenko on 12/24/14.
 *
 * @license
 */

(function () {
    'use strict';

    // Create module Directives in order to inject all directives at any other module
    angular.module('Directives', ['Services'])

        .directive('pwCheck', [function () {

            return {

                require: 'ngModel',

                /**
                 * @param scope - superadministrator scope
                 * @param elem - new password DOM element
                 * @param attrs - attributes
                 */
                link: function (scope, elem, attrs) {

                    var _repeatPasswordFieldId = attrs.pwCheck,
                        _$repeatPasswordField = document.getElementById(_repeatPasswordFieldId),
                        _$newPasswordField = elem[0];

                    _$repeatPasswordField.addEventListener('keyup', function () {

                        var _this = this;

                        scope.$apply(function () {

                            //if new password and repeat new password fields are the same
                            if (elem[0].value === _this.value) {
                                scope.passwordsMismatch = false; // remove mismatch error

                            } else {
                                scope.passwordsMismatch = true;
                            }

                        });
                    }, false);

                    /**
                     * add event listener for blur event on repeat password input field
                     * in order to remove mismatch error if both fields new password and
                     * repeat password are empty
                     */
                    _$repeatPasswordField.addEventListener('blur', function () {
                        if (!elem[0].value.length && !this.value.length) {
                            scope.passwordsMismatch = false; // remove mismatch error
                            scope.$apply();
                        }
                    }, false);

                    /**
                     * add event listener for blur event on new password input field
                     * in order to remove mismatch error if both fields new password and
                     * repeat password are empty
                     */
                    _$newPasswordField.addEventListener('blur', function () {
                        if (!this.value.length && !_$repeatPasswordField.value.length) {
                            scope.passwordsMismatch = false; // remove mismatch error
                            scope.$apply();
                        }
                    }, false);
                }
            }
        }]);
})();