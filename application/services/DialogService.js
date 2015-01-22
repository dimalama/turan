/**
 * @fileoverview
 *
 * @autor Dmitry Lukianenko on 12/26/14.
 *
 * @license
 */

(function () {
    'use strict';

    // Using module Services in order to inject all services at any other module
    var Services = angular.module('Services');

    /**
     * Dialog Service
     * @return dialogService
     */
    Services.service('dialogService', function () {

        /**
         * State of the dialog window
         * @type {boolean}
         * @public
         */
        this.opened = false;

        /**
         * Dialog title
         * @type {string}
         * @public
         */
        this.title = '';

        /**
         * Dialog body content
         * @type {string}
         * @public
         */
        this.body = '';

        /**
         * Name of ok butn
         * @type {string}
         * @public
         */
        this.okBtn = '';

        /**
         * Name of cancel btn
         * @type {string}
         */
        this.cancelBtn = '';

        /**
         * Css class for current dialog
         * @type {string}
         * @public
         */
        this.cssClass = '';

        /**
         * Flag to control cancel btn display state
         * @type {boolean}
         * @public
         */
        this.showCancelBtn = false;

        /**
         * Callback function
         * @type {string}
         */
        this.callback = '';

        /**
         * Assign dialog setting param
         * @param {String} title
         * @param {String} body
         * @param {String} okBtn
         * @param {String} cancelBtn
         * @param {String} cssClass
         * @param {Boolean} showCancelBtn
         * @param {Function} callback
         * @public
         */
        this.open = function (title, body, okBtn, cancelBtn, cssClass, showCancelBtn, callback) {
            this.opened = true;
            this.title = title;
            this.body = body;
            this.okBtn = okBtn;
            this.cancelBtn = cancelBtn;
            this.cssClass = cssClass;
            this.showCancelBtn = showCancelBtn || false;
            this.callback = callback;
        };

        /**
         * Execute dialog ok callback function
         * @public
         */
        this.execute = function () {
            if (typeof this.callback === 'function') {
                this.callback();
            }
        };

        /**
         * Assign all dialog setting param to initial state
         */
        this.close = function () {
            this.opened = false;
            this.title = '';
            this.body = '';
            this.cssClass = '';
            this.showCancelBtn = false;
        };

        return this;

    });

})();
