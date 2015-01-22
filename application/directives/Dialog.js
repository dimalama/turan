/**
 * @fileoverview Dialog modal window
 *
 * @autor Dmitry Lukianenko on 12/26/14.
 *
 * @license
 */

(function () {
    'use strict';

    //using Directives module
    angular.module('Directives')

        .directive('dialog', ['dialogService', function (dialogService) {
            return {
                restrict: 'E',
                scope: {
                    dialog: '='
                },
                templateUrl: 'partials/dialog.html',

                /**
                 * Directive function
                 * @param scope -  is an Angular scope object
                 * @param element -  is the element that this directive matches
                 */
                link: function (scope, element) {
                    scope.dialog = {
                        open: dialogService.opened
                    };

                    // Watch for changes in the dialogService
                    scope.$watch(function () {
                        return dialogService.opened;

                    }, function (newVal) {

                        if (newVal) {
                            scope.dialog = {
                                open: dialogService.opened,
                                title: dialogService.title,
                                body: dialogService.body,
                                okBtn: dialogService.okBtn,
                                cancelBtn: dialogService.cancelBtn,
                                cssClass: dialogService.cssClass,
                                showCancelBtn: dialogService.showCancelBtn
                            };
                        }
                    });

                    /**
                     * close dialog
                     * @private
                     */
                    var closeDialog = function () {
                        dialogService.close();
                        scope.dialog.open = dialogService.opened;
                    };

                    element[0].querySelector('#dialog-ok').addEventListener('click', function () {
                        closeDialog();
                        dialogService.execute();

                    });
                    element[0].querySelector('#dialog-cancel').addEventListener('click', function () {
                        closeDialog();
                    });
                }
            };
        }]);
})();
