/**
 * @fileoverview Controls visual states of the menus
 *
 * @autor Dmitry Lukianenko on 12/24/14.
 *
 * @license
 */

(function () {
    'use strict';

    // Create module Services in order to inject all services at any other module
    var Services = angular.module('Services', []);

    /**
     * Menu Service
     */
    Services.factory('menuService', function () {

        /**
         * remove selected state from a menu
         * @param {String} parentId
         * @public
         */
        var removeSelectedState = function (parentId) {

            var _$menu = document.getElementById(parentId),
                _$selectedElementsMenu = _$menu.querySelectorAll('.core-selected');

            if (_$selectedElementsMenu.length) {
                _$selectedElementsMenu[0].classList.remove('core-selected');
                _$selectedElementsMenu[0].removeAttribute('active');
            }

        };

        /**
         * Add select state for dropdown menu item
         * @param {String} parentId
         * @param {Int} itemIndexSelect - index of the dropdown menu core-item element to select
         * @public
         */
        var addSelectedState = function (parentId, itemIndexSelect) {

            var _$menu = document.getElementById(parentId),
                _$selectedItem = _$menu.querySelectorAll('core-item')[itemIndexSelect];

            _$selectedItem.classList.add('core-selected');
        };

        return {
            removeSelectedState: removeSelectedState,
            addSelectedState: addSelectedState
        }

    });

})();
