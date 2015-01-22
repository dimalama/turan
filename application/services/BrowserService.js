/**
 * @fileoverview This is browser service to detect user's browser
 *
 * @autor Dmitry Lukianenko on 1/20/15.
 *
 * @license
 */

(function () {
    'use strict';

    var Services = angular.module('Services');

    /**
     * Service to detect browser
     * @returns {Function}
     * @param {!angular.Window} $window
     */
    Services.service('browser', ['$window', function ($window) {

        return function () {

            var userAgent = $window.navigator.userAgent,
                browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};

            for (var key in browsers) {
                if (browsers[key].test(userAgent)) {
                    return key;
                }
            }
            return 'unknown';
        }

    }]);
})();
