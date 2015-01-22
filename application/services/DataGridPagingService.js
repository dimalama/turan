/**
 * @fileoverview This is Data grid paging service, used for controlling our custom paging for ui-grid
 *
 * @autor Dmitry Lukianenko on 12/31/14.
 *
 * @license
 */

(function () {
    'use strict';

    var Services = angular.module('Services');

    /**
     * Data grid paging Service
     * @returns public methods of the service
     */
    Services.factory('dataGridPagingService', function () {

        /**
         * Service scope
         * @type {{gridApi: null, totalPages: number, $parent: null}}
         * @private
         */
        var _scope = {
            gridApi: null, //ui-grid API
            totalPages: 0, //total number of pages for ui-grid
            $parent: null  //parent element for ui-grid
        };

        /**
         * Init service
         * @param {Object} gridApi - ui-grid API
         * @param {String} parentId - id of parent element for ui-grid
         * @public
         */
        var initService = function (gridApi, parentId) {

            var _rowsPerPage = gridApi.grid.options.rowsPerPage,
                _dataLength = gridApi.grid.options.data.length,
                _parentId = parentId || '';

            _scope.gridApi = gridApi;
            _scope.$parent = document.getElementById(_parentId);

            if ((_dataLength % _rowsPerPage) === 0) {
                _scope.totalPages = _dataLength / _rowsPerPage;
            } else {
                _scope.totalPages = Math.floor(_dataLength / _rowsPerPage) + 1;
            }
        };

        /**
         * Toggle page element select state
         * @param {Array} pagesToggle - array of indexes pages which state should be toggled
         * @private
         */
        var togglePageSelect = function (pagesToggle) {

            //get paging's single page elements
            var $pages = _scope.$parent.querySelectorAll('.number'),
                _pagesToggle = pagesToggle || [];

            _pagesToggle.forEach(function (elem) {
                $pages[elem].classList.toggle('colored');
            });
        };

        /**
         * Get array of the amount pages for angular to create
         * single page element
         * @returns {Array} - of the amount pages to create
         * @public
         */
        var getPagesArray = function () {

            var _pagesToBuild = 0,
                _loopIndex = 1,
                _pagesArray = [];

            if (_scope.totalPages > 10) {
                _pagesToBuild = 10;
            } else {
                _pagesToBuild = _scope.totalPages;
            }

            for (; _loopIndex <= _pagesToBuild; _loopIndex++) {
                _pagesArray.push(_loopIndex);
            }

            return _pagesArray;

        };

        /**
         * Previous page handler
         * @returns {boolean}
         * @public
         */
        var previousPage = function () {

            //if there is not pages to go, exit function
            if (_scope.gridApi.grid.pagination.page === 1) {
                return true;
            }

            _scope.gridApi.pagination.previousPage();

            //array of page element indexes which we need to toggle color,
            //considering that page ui-grid counts pages starting form 1 and
            //querySelectAll returns array of elements matching selector which starts from 0,
            //we need make adjustment by subtracting 1 from ui-grid page
            var _pagesToggle = [
                _scope.gridApi.grid.pagination.page - 1,
                _scope.gridApi.grid.pagination.page
            ];

            togglePageSelect(_pagesToggle);

        };

        /**
         * Go to certain page handler
         * @param {Int} goToPage - index of the page to go
         * @public
         */
        var goToPage = function (goToPage) {

            var _goToPage = goToPage || 1;

            //array of page element indexes which we need to toggle color,
            //considering that page ui-grid counts pages starting form 1 and
            //querySelectAll returns array of elements matching selector which starts from 0,
            //we need make adjustment by subtracting 1 from ui-grid page
            var _pagesToggle = [
                _scope.gridApi.grid.pagination.page - 1, //current page
                _goToPage - 1 //page to go
            ];

            _scope.gridApi.grid.pagination.page = _goToPage;
            _scope.gridApi.core.refresh();

            togglePageSelect(_pagesToggle);

        };

        /**
         * Next page handler
         * @returns {boolean}
         * @public
         */
        var nextPage = function () {

            //if there is not pages to go, exit function
            if (_scope.gridApi.grid.pagination.page === _scope.totalPages) {
                return true;
            }

            //array of page element indexes which we need to toggle color,
            //considering that page ui-grid counts pages starting form 1 and
            //querySelectAll returns array of elements matching selector which starts from 0,
            //we need make adjustment by subtracting 1 from ui-grid page
            var _pagesToggle = [
                _scope.gridApi.grid.pagination.page - 1,
                _scope.gridApi.grid.pagination.page
            ];

            _scope.gridApi.pagination.nextPage();

            togglePageSelect(_pagesToggle);

        };

        return {
            initService: initService,
            getPagesArray: getPagesArray,
            previousPage: previousPage,
            goToPage: goToPage,
            nextPage: nextPage
        }

    });


})();
