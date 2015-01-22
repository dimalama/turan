/**
 * @fileoverview This is Date Time Picker Service
 *
 * @autor Dmitry Lukianenko on 1/4/15.
 *
 * @license
 */

(function () {
    'use strict';

    // Using module Services in order to inject all services at any other module
    var Services = angular.module('Services');

    /**
     * Date Time Picker Service
     * @returns service
     */
    Services.factory('datetimePickerService', function () {

        /**
         * Date Time Picker Service
         * @param {Object} $dateTimePicker - DOM datetime element instance
         * @public
         */
        var dateTimePickerService = function ($dateTimePicker) {

            /**
             * Service scope
             * @type {{$dateTimePicker: Object}}
             * @private
             */
            var scope = {
                $dateTimePicker: $dateTimePicker
            };

            /**
             * Get time and date
             * @param {String} id
             * @returns {string} - date and time
             * @public
             */
            this.getDateTime = function () {

                var value = scope.$dateTimePicker.getAttribute('data-input-value');

                scope.$dateTimePicker.setAttribute('data-clear', false);

                if (value) {

                    //valid
                    return value;

                } else {

                    //show requred errors
                    scope.$dateTimePicker.setAttribute('data-required-error', true);
                }
            };

            /**
             * Clear datetime picker input field
             * @public
             */
            this.clear = function () {
                scope.$dateTimePicker.setAttribute('data-clear', true);
            };

        };

        /**
         * Init Service
         * @param {String} id - id of the datetime picker element
         * @returns {dateTimePickerService}
         */
        var init = function (id) {
            /**
             * We face cases when we have form with two and more datetime-picker elements,
             * so we need to have instance to it's own object for each of these elements.
             * e.g datetimepicker1 = new dateTimePickerService
             * e.g datetimepicker2 = new dateTimePickerService
             * datetimepicker1 has it's own service
             * datetimepicker2 has it's own service
             */
            return new dateTimePickerService(document.getElementById(id));
        };

        return {
            init: init
        };

    });

})();


