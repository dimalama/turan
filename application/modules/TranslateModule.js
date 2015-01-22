/**
 * @fileoverview This is Translate module
 *
 * @autor Dmitry Lukianenko on 12/28/14.
 *
 * @license
 */

(function () {
    'use strict';

    /**
     * Translate module
     * @type {module}
     * injection {ngCookies}
     * injection {pascalprecht.translate}
     */
    var Translate = angular.module('Translate', ['ngCookies', 'pascalprecht.translate']);

    Translate.config(function ($translateProvider) {

        $translateProvider
            .useLocalStorage()
            .useStaticFilesLoader({
                prefix: '/languages/',
                suffix: '.json'
            })
            .fallbackLanguage('ru_RU')
            .determinePreferredLanguage();

    });

})();