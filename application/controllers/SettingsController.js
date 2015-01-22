/**
 * @fileoverview This is Settings Controller
 *
 * @autor Dmitry Lukianenko on 12/28/14.
 *
 * @license
 */

(function () {
    'use strict';

    var Turan = angular.module('Turan');

    /**
     * Settings Controller
     * @param {!angular.Scope} $scope
     * @param {translate} $translate
     * @param {menuService} menuService
     */
    Turan.controller('SettingsController', ['$scope', '$translate', 'menuService',
        function ($scope, $translate, menuService) {

            /**
             * get current system language
             * @type {string}
             * @public
             */
            $scope.language = $translate.use();

            //set selected language for dropdown language menu
            switch ($scope.language) {
                case 'en_US':
                    menuService.addSelectedState('language-menu', 0);
                    break;
                case 'ru_RU':
                    menuService.addSelectedState('language-menu', 1);
                    break;
                case 'kz_KZ':
                    menuService.addSelectedState('language-menu', 2);
                    break;
            }

            //get translation for dropdown label
            $translate('SYSTEM_SETTINGS.DROPDOWN_MENU.LABEL')
                .then(function (translation) {

                    $scope.languageName = translation;
                });

            /**
             * Change the language
             * @param {String} language
             * @public
             */
            $scope.setLanguage = function (language) {

                $scope.language = language;
            };

            /**
             * Save language settings
             * @public
             */
            $scope.save = function () {

                if ($scope.language.length && ($scope.language !== $translate.use())) {

                    $translate.use($scope.language);

                }

                $scope.cancel();
            };

            /**
             * Close settings menu
             * @public
             */
            $scope.cancel = function () {

                //move to initial state of interface changing the scope of
                //the parent Superadministrator controller
                $scope.$parent.$parent.content = 'content-0';

                menuService.removeSelectedState('system-settings-menu');
            };
        }]);
})();
