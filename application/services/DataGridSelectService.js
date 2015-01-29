/**
 * @fileoverview This is Data grid select service service, which controls arrow up/down
 * row movement and select row by pressing enter
 *
 * @autor Dmitry Lukianenko on 1/2/15.
 *
 * @license
 */

(function () {
    'use strict';

    // Using module Services in order to inject all services at any other module
    var Services = angular.module('Services');

    /**
     * Data grid select service
     * @returns public methods of the service
     */
    Services.factory('dataGridSelectService', function () {

        /**
         * Service scope
         * @type {{row: null, gridApi: null, prevUserSelectDirection: string}}
         * @private
         */
        var _scope = {
            row: null, //current selected row
            gridApi: null, // ui-grid API
            prevUserSelectDirection: 'down' // saves directions of user movements up/down
        };

        /**
         * Init service
         * @param {Object} gridApi - ui-grid API
         * @public
         */
        var initService = function (gridApi) {
            _scope.gridApi = gridApi;
        };

        /**
         * Set the row
         * @param {Object} row - ui-grid row object
         * @public
         */
        var setRow = function (row) {
            _scope.row = row;
        };

        /**
         * Select row
         * @param {Object} row - ui-grid row object
         * @param {Boolean} isSelected - weather to select row or not
         * @param {String} selectDirection - shows user's select directions up/down
         * @returns {Boolean} true - when we need to exit function
         */
        var selectRow = function (row, isSelected, selectDirection) {
            if (!_scope.row) {
                _scope.row = row;
            }

            var _currentRowUid = _scope.row.uid,
                _currentRowIndex = 0,
                _loopIndex = 0,
                _goToRow = 0,
                _selectDirection = selectDirection || _scope.prevUserSelectDirection,
                _isSelected = isSelected || false;

            for (; _loopIndex !== _scope.row.grid.rows.length; _loopIndex++) {
                if (_scope.row.grid.rows[_loopIndex].uid === _currentRowUid) {
                    _currentRowIndex = _loopIndex;
                    break;
                }
            }

            //if we are at the very firs row and want to go up
            if ((_currentRowIndex === 0) && (_selectDirection === 'up')) {
                return true;
            }

            //if we are at the very last row and want to go down
            if ((_currentRowIndex === (_scope.row.grid.options.data.length - 1) ) && (_selectDirection === 'down')) {
                return true;
            }

            switch (_selectDirection) {
                case 'up':
                    _goToRow = _currentRowIndex - 1;
                    break;
                case 'down':
                    _goToRow = _currentRowIndex + 1;
                    break;
            }


            if (!_isSelected) {
                _scope.gridApi.selection.unSelectRow(_scope.gridApi.grid.options.data[_currentRowIndex]);
            }

            _scope.gridApi.selection.selectRow(_scope.gridApi.grid.options.data[_goToRow]);

            _scope.row = _scope.gridApi.grid.rows[_goToRow];
            _scope.prevUserSelectDirection = _selectDirection;
        };

        return {
            initService: initService,
            setRow: setRow,
            selectRow: selectRow
        }

    });
})();
