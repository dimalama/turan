/**
 * @fileoverview The logic related to authentication and authorization (access control)
 *
 * @autor Dmitry Lukianenko on 12/19/14.
 *
 * @license
 */


(function () {
    'use strict';

    var Authentication = angular.module('Authentication');

    /**
     * Authentication Service
     * @param {!angular.Http} $http
     * @param {Session} Session - Session service
     */
    Authentication.factory('AuthService', ['$http', 'Session', function ($http, Session) {

        /**
         * Send post query to the server and get information from the server
         * @param {JSON} credentials - password and login
         * @returns {*} Promise
         * @public
         */
        var login = function (credentials) {

            var _credentials = credentials || null;

            //send post to the server and return promise
            return $http.post(
                '/',
                {
                    username: _credentials.username,
                    password: _credentials.password
                }
            ).then(function (response) {
                    var _response = response;
                    //emulate error response from the server
                    /*response.data = {
                        errors: {
                            usernameError: true, // wrong user's name
                            passwordError: false // if true wrong user's password
                        }
                    };*/
                    //emulate successful response from the server
                    _response.data = {
                        id: 'd2VudHdvcnRobWFuOkNoYW5nZV9tZQ==',
                        user: {
                            name: 'Dimon',
                            role: 1, //superadministrator
                            organ: 'FSB'
                        }
                    };

                    if(_response.data.errors){
                        return _response.data;
                    }

                    //if everything is ok, create session using session service
                    Session.create(_response.data.id, _response.data.user, _credentials.username);

                    //return response from the server to Authentication Controller
                    return _response.data;
                });
        };

        /**
         * Checks if user is authenticated
         * @returns {boolean}
         * @public
         */
        var isAuthenticated = function () {
            return !!Session.user;
        };

        /**
         * Checks if user authorized
         * @param authorizedRole
         * @returns {boolean}
         * @public
         */
        var isAuthorized = function (authorizedRole) {
            var _authorizedRole = authorizedRole || 0;
            return (isAuthenticated() && _authorizedRole === Session.user.role);
        };

        return {
            login: login,
            isAuthenticated: isAuthenticated,
            isAuthorized: isAuthorized
        };

    }]);

})();