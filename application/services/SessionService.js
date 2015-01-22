/**
 * @fileoverview Keeps the user’s session information
 *
 * @autor Dmitry Lukianenko on 12/19/14.
 *
 * @license
 */

(function () {
    'use strict';

    var Authentication = angular.module('Authentication');

    /**
     * Authentication service which is part of Authentication module
     * @param {localStorageService} localStorageService
     * @return Session
     */
    Authentication.service('Session', ['localStorageService', function (localStorageService) {

        /**
         * default user
         * min initial information about user which system needs
         * @type {{name: string, role: number, organ: string}}
         * @private
         */
        var _defaultUser = {
            name: 'anonymous',
            role: 0,
            organ: ''
        };

        /**
         * SessionId
         * @type {*|string}
         * @public
         */
        this.sessionId = localStorageService.get('sessionId') || '';

        /**
         * User
         * @type {*|{name: string, role: number, organ: string}}
         * @public
         */
        this.user = localStorageService.get('user') || _defaultUser;

        /**
         * User's account name
         * @type {*|string}
         * @public
         */
        this.accountName = localStorageService.get('accountName') || '';

        /**
         * Create user's session
         * @param {String} sessionId
         * @param {Object} userData
         * @public
         */
        this.create = function (sessionId, userData, accountName) {
            this.sessionId = sessionId;
            this.user = userData;
            this.accountName = accountName;
            localStorageService.set('sessionId', sessionId);
            localStorageService.set('user', userData);
            localStorageService.set('accountName', accountName);
        };

        /**
         * Destroy user's session
         * @public
         */
        this.destroy = function () {
            this.sessionId = '';
            this.user = _defaultUser;
            this.accountName = '';
            localStorageService.remove('sessionId');
            localStorageService.set('user', _defaultUser);
            localStorageService.remove('accountName');
        };

        return this;
    }]);
})();
