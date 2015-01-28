/**
 * @fileoverview This is Superadministrator Controller
 *
 * @autor Dmitry Lukianenko on 12/19/14.
 *
 * @license
 */

(function () {
    'use strict';

    //create Superadministrator module
    var Superadministrator = angular.module('Superadministrator',
        [
            'Directives',
            'Services',
            'ui.grid',
            'ui.grid.pagination',
            'ui.grid.selection',
            'ui.grid.moveColumns',
            'ui.grid.resizeColumns',
            'ui.grid.pinning',
            'ui.grid.edit',
            'ui.grid.rowEdit'
        ]
    );

    /**
     * Superadministrator constants
     * @const
     */
    Superadministrator.constant('SUPER_ADMIN_EVENTS', {
        menuStateChange: 'menu-state-changed',
        createNewUserSuccess: 'new-user-created-successfully',
        createNewUserError: 'new-user-create-error',
        userRemoveSuccess: 'user-removed-successfully',
        userRemoveError: 'user-remove-error',
        changeStatusSuccess: 'successful-status-change',
        changeStatusError: 'error-status-change',
        addNewOrganSuccess: 'new-organ-created-successfully',
        addNewOrganError: 'new-organ-create-error',
        organRemoveError: 'organ-remove-error',
        organRemoveSuccess: 'organ-removed-successfully',
        taskInterceptInfoRemoveError: 'task-intercept-info-remove-error',
        taskInterceptInfoRemoveSuccess: 'task-intercept-info-removed-successfully',
        addTaskInterceptInfoError: 'task-intercept-info-add-error',
        addTaskInterceptInfoSuccess: 'task-intercept-info-added-successfully',
        getDataError: 'get-initial-data-for-ui-grid-error',
        getDataSuccess: 'get-initial-data-for-ui-grid-success',
        sanctionProcessInfoRemoveError: 'sanction-process-info-remove-error',
        sanctionProcessInfoRemoveSuccess: 'sanction-process-info-removed-successfully',
        addSanctionProcessInfoSuccess: 'process-info-sanction-added-successfully',
        addSanctionProcessInfoError: 'add-sanction-process-info-error',
        addSanctionAccessServiceInfoSuccess: 'sanction-access-service-info-added-successfully',
        addSanctionAccessServiceInfoError: 'add-sanction-access-service-info-error',
        sanctionAccessServiceInfoRemoveSuccess: 'sanction-access-service-info-removed-successfully',
        sanctionAccessServiceInfoRemoveError: 'sanction-access-service-info-remove-error'
    });

    /**
     * Filters for ui-grid
     */
    Superadministrator.filter('mapStatus', function () {
        var statusHash = {
            0: 'Disable',
            1: 'Enable'
        };

        return function (input) {
            if (typeof input === 'undefined') {
                return '';
            } else {
                return statusHash[input];
            }
        };

    }).filter('mapRole', function () {
        var roleHash = {
            1: 'Superadministrator',
            2: 'Administrator',
            3: 'Handler',
            4: 'Supervisor'
        };

        return function (input) {
            if (typeof input === 'undefined') {
                return '';
            } else {
                return roleHash[input];
            }
        };
    }).filter('mapSignGatherData', function () {
        var signGagtherDataHash = {
            0: 'Full',
            1: 'Static'
        };

        return function (input) {
            if (typeof input === 'undefined') {
                return '';
            } else {
                return signGagtherDataHash[input];
            }
        };
    });


    /**
     * Superadministrator Controller
     * @param {!angular.RootScope} $rootScope
     * @param {!angular.Scope} $scope
     * @param {!angular.Http} $http
     * @param {dialogService} dialogService
     * @param {menuService} menuService
     * @param {dataGridPagingService} dataGridPagingService
     * @param {dataGridSelectService} dataGridSelectService
     * @param {datetimePickerService} datetimePickerService
     * @param {!angular.Translate} $translate
     * @param {Constant} SUPER_ADMIN_EVENTS
     * @param {!angular.Interval} $interval
     */
    Superadministrator.controller('SuperadministratorController',
        ['$rootScope', '$scope', '$http', 'dialogService', 'menuService', 'dataGridPagingService', 'dataGridSelectService', 'datetimePickerService', '$translate', 'SUPER_ADMIN_EVENTS', '$interval', 'uiGridConstants', 'browser',
            function ($rootScope, $scope, $http, dialogService, menuService, dataGridPagingService, dataGridSelectService, datetimePickerService, $translate, SUPER_ADMIN_EVENTS, $interval, uiGridConstants, browser) {
                /**
                 * Emulate data for the user's data grid
                 * @type {{name: string, organ: string, role: string, enable_date: string, status: string}[]}
                 * @public
                 */
                $scope.usersData = [
                    {
                        "name": "User One",
                        "organ": "FSB",
                        "role": "1",
                        "enable_date": "12.12.2014",
                        "status": "1"
                    },
                    {
                        "name": "User One",
                        "organ": "FSB",
                        "role": "2",
                        "enable_date": "13.12.2014",
                        "status": "1"
                    },
                    {
                        "name": "User One",
                        "organ": "FSB",
                        "role": "3",
                        "enable_date": "14.12.2014",
                        "status": "1"
                    },
                    {
                        "name": "User One",
                        "organ": "FSB",
                        "role": "4",
                        "enable_date": "15.12.2014",
                        "status": "1"
                    },
                    {
                        "name": "User One",
                        "organ": "FSB",
                        "role": "1",
                        "enable_date": "16.12.2014",
                        "status": "0"
                    },
                    {
                        "name": "User One",
                        "organ": "FSB",
                        "role": "2",
                        "enable_date": "17.12.2014",
                        "status": "1"
                    },
                    {
                        "name": "User One",
                        "organ": "FSB",
                        "role": "3",
                        "enable_date": "18.12.2014",
                        "status": "1"
                    },
                    {
                        "name": "User One",
                        "organ": "FSB",
                        "role": "4",
                        "enable_date": "19.12.2014",
                        "status": "0"
                    },
                    {
                        "name": "User One",
                        "organ": "FSB",
                        "role": "1",
                        "enable_date": "20.12.2014",
                        "status": "0"
                    },
                    {
                        "name": "User One",
                        "organ": "FSB",
                        "role": "2",
                        "enable_date": "21.12.2014",
                        "status": "1"
                    },
                    {
                        "name": "User One",
                        "organ": "FSB",
                        "role": "3",
                        "enable_date": "22.12.2014",
                        "status": "1"
                    },
                    {
                        "name": "User One",
                        "organ": "FSB",
                        "role": "4",
                        "enable_date": "22.12.2014",
                        "status": "1"
                    },
                    {
                        "name": "User One",
                        "organ": "FSB",
                        "role": "1",
                        "enable_date": "22.12.2014",
                        "status": "0"
                    }

                ];

                /**
                 * Emulate data for organ list data grid
                 * @type {{name: string}[]}
                 * @public
                 */
                $scope.ogransData = [
                    {
                        "name": "FSB"
                    },
                    {
                        "name": "LAPD"
                    },
                    {
                        "name": "NYPD"
                    },
                    {
                        "name": "FBI"
                    },
                    {
                        "name": "CIA"
                    },
                    {
                        "name": "KGB"
                    }
                ];

                /**
                 * Emulate data for manage task for intercepted information
                 * @type {{taskNumber: string, targetAlias: string, idType: string, targetId: string, interceptStarts: string, interceptEnds: string, signGatherData: string, comment: string}[]}
                 * @public
                 */
                $scope.manageTaskInterceptedInfoData = [
                    {
                        taskNumber: '31241-PR',
                        targetAlias: 'Target 0001',
                        idType: 'IP',
                        targetId: '192.168.0.1',
                        interceptStarts: 'January-1-2015 3:48 PM',
                        interceptEnds: 'January-7-2015 1:33 PM',
                        signGatherData: '0',
                        comment: 'Task time is expanded!'
                    }
                ];

                /**
                 * Emulate data for sanctions proccessing information
                 * @type {{number: string, handlerId: string, sanctionStarts: string, sanctionEnds: string, organ: string}[]}
                 * @public
                 */
                $scope.manageSanctionProcessInfoData = [
                    {
                        number: '3241-UOFDS',
                        handlerId: 'Ivanov V',
                        sanctionStarts: '21.12.2014',
                        sanctionEnds: '17.01.2015',
                        organ: 'FBI'
                    }
                ];

                /**
                 * Emulate data for sanctions accessing service information
                 * @type {{number: string, handlerId: string, sanctionStarts: string, sanctionEnds: string, organ: string}[]}
                 * @public
                 */
                $scope.manageSanctionAccessingServiceInfoData = [
                    {
                        number: '325431-UDS',
                        handlerId: 'Petrov V',
                        sanctionStarts: '21.12.2014',
                        sanctionEnds: '17.01.2015',
                        organ: 'CIA'
                    }
                ];

                /**
                 * Datetime picker value
                 * @type {object}
                 * @public
                 */
                $scope.datetime = {
                    starts: '',
                    ends: ''
                };

                /**
                 * Save init state of the datetime obj
                 * @type {object}
                 * @public
                 */
                $scope.initialDateTime = angular.copy($scope.datetime);

                /**
                 * Defines the with of the left menu
                 * @type {string}
                 * @public
                 */
                $scope.drawerWidth = '256px';

                if (browser() === 'firefox') {
                    $scope.drawerWidth = '280px';
                }

                /**
                 * ui-grid initialize options
                 * @type {{enableSelectionBatchEvent: boolean, enableRowHeaderSelection: boolean, multiSelect: boolean, modifierKeysToMultiSelect: boolean, rowTemplate: string}}
                 * @public
                 */
                $scope.gridOptions = {
                    enableSelectionBatchEvent: false,
                    enableRowHeaderSelection: false,
                    multiSelect: true,
                    enablePaginationControls: false,
                    paginationPageSize: 10,
                    modifierKeysToMultiSelect: true,
                    enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                    enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
                    // Calling the externalScopes() method will allow you to reach up to the controller scope
                    rowTemplate: '<div  tabindex="1" ' +
                    'ng-click="getExternalScopes().onRowClick(row)" ' +
                    'ng-keyup="getExternalScopes().onRowKeyUp($event, row, index)" ' +
                    'ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" ' +
                    'class="ui-grid-cell" ' +
                    'ui-grid-cell>' +
                    '</div>'
                };

                /**
                 * Access outside scope functions from ui-grid row template
                 * @type {{onRowClick: Function, onRowKeyUp: Function}}
                 * @public
                 */
                $scope.dataGridModel = {

                    /**
                     * Row click handler
                     * @param {Object} row - row entity
                     * @public
                     */
                    onRowClick: function (row) {
                        var _row = row || null;

                        dataGridSelectService.setRow(_row);
                    },

                    /**
                     * Key up handler
                     * @param {Object} event
                     * @param {Object} row - row entity
                     * @public
                     */
                    onRowKeyUp: function ($event, row) {
                        var _$event = $event || null,
                            _row = row;

                        switch (_$event.keyCode) {
                            case 38: //up
                                dataGridSelectService.selectRow(_row, false, 'up');
                                break;
                            case 40: //down
                                dataGridSelectService.selectRow(_row, false, 'down');
                                break;
                            case 13: //enter
                                dataGridSelectService.selectRow(_row, true);
                                break;
                        }

                    }
                };

                /**
                 * To register ui-grid API
                 * @param {Object} gridApi
                 * @public
                 */
                $scope.gridOptions.onRegisterApi = function (gridApi) {

                    $scope.gridApi = gridApi;

                    dataGridSelectService.initService($scope.gridApi);
                    dataGridPagingService.initService($scope.gridApi, $scope.menuId);
                    $scope.pagesArray = dataGridPagingService.getPagesArray();

                    $scope.gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
                };


                $scope.saveRow = function (rowEntity) {
                    console.info('save the row');
                    console.info(rowEntity);

                    var promise = $http.post(
                        '/',
                        {
                            rowData: rowEntity
                        }
                    ).success(function (data) {

                        }).error(function () {

                        });
                    $scope.gridApi.rowEdit.setSavePromise($scope.gridApi.grid, rowEntity, promise);
                };

                /**
                 * Show content on the right work aria
                 * @param {Int} index - index of element menu which has been clicked
                 * @public
                 */
                $scope.showMenuContent = function (index) {

                    /**
                     * Content which we need to show in the right work aria
                     * @type {string}
                     * @public
                     */
                    $scope.content = ( 'content-' + index );

                    switch (index) {

                        case 1: //user list

                            //TODO: create method to get this data from the server
                            $scope.menuId = 'user-list';
                            $scope.gridOptions.columnDefs = [
                                {
                                    name: 'name',
                                    displayName: 'Name',
                                    minWidth: 100,
                                    enableCellEdit: true
                                },
                                {
                                    name: 'organ',
                                    displayName: 'Organ',
                                    minWidth: 100,
                                    enableCellEdit: true
                                },
                                {
                                    name: 'role',
                                    displayName: 'Role',
                                    minWidth: 100,
                                    enableCellEdit: true,
                                    editableCellTemplate: 'ui-grid/dropdownEditor',
                                    cellFilter: 'mapRole',
                                    editDropdownValueLabel: 'role',
                                    editDropdownOptionsArray: [
                                        {id: 1, role: 'Superadministrator'},
                                        {id: 2, role: 'Administrator'},
                                        {id: 3, role: 'Handler'},
                                        {id: 4, role: 'Supervisor'}
                                    ]
                                },
                                {
                                    name: 'enable_date',
                                    displayName: 'Enable Date',
                                    minWidth: 100,
                                    enableCellEdit: true,
                                    type: 'date',
                                    cellFilter: 'date:"dd-MM-yyyy"'
                                },
                                {
                                    name: 'status',
                                    displayName: 'Status',
                                    minWidth: 100,
                                    enableCellEdit: true,
                                    editableCellTemplate: 'ui-grid/dropdownEditor',
                                    cellFilter: 'mapStatus',
                                    editDropdownValueLabel: 'status',
                                    editDropdownOptionsArray: [
                                        {id: 0, status: 'Disable'},
                                        {id: 1, status: 'Enable'}
                                    ]
                                }
                            ];
                            $scope.gridOptions.data = $scope.usersData;
                            break;

                        case 2:// organ list

                            //TODO: create method to get this data from the server
                            $scope.menuId = 'organ-list';
                            $scope.gridOptions.columnDefs = [
                                {
                                    name: 'name',
                                    displayName: 'Name',
                                    minWidth: 100,
                                    enableCellEdit: true
                                }
                            ];
                            $scope.gridOptions.data = $scope.ogransData;
                            break;

                        case 3:// manage task for intercepted information

                            //TODO: create method to get this data from the server
                            $scope.menuId = 'manage-task-intercepted-info';
                            $scope.gridOptions.columnDefs = [
                                {
                                    name: 'taskNumber',
                                    displayName: 'Task Number',
                                    minWidth: 100,
                                    enableCellEdit: true
                                },
                                {
                                    name: 'targetAlias',
                                    displayName: 'Target Alias',
                                    minWidth: 100,
                                    enableCellEdit: true
                                },
                                {
                                    name: 'idType',
                                    displayName: 'ID Type',
                                    minWidth: 100,
                                    enableCellEdit: true
                                },
                                {
                                    name: 'targetId',
                                    displayName: 'Target ID',
                                    minWidth: 100,
                                    enableCellEdit: true
                                },
                                {
                                    name: 'interceptStarts',
                                    displayName: 'Interception Starts',
                                    minWidth: 100,
                                    enableCellEdit: true,
                                    type: 'date',
                                    cellFilter: 'date:"dd-MM-yyyy"'
                                },
                                {
                                    name: 'interceptEnds',
                                    displayName: 'Interception Ends',
                                    minWidth: 100,
                                    enableCellEdit: true,
                                    type: 'date',
                                    cellFilter: 'date:"dd-MM-yyyy"'
                                },
                                {
                                    name: 'signGatherData',
                                    displayName: 'Sign Gather Data',
                                    minWidth: 100,
                                    enableCellEdit: true,
                                    editableCellTemplate: 'ui-grid/dropdownEditor',
                                    cellFilter: 'mapSignGatherData',
                                    editDropdownValueLabel: 'signGatherData',
                                    editDropdownOptionsArray: [
                                        {id: 0, signGatherData: 'Full'},
                                        {id: 1, signGatherData: 'Static'}
                                    ]
                                },
                                {
                                    name: 'comment',
                                    displayName: 'Comment',
                                    minWidth: 100,
                                    enableCellEdit: true
                                }
                            ];
                            $scope.gridOptions.data = $scope.manageTaskInterceptedInfoData;
                            break;
                        case 4:
                            //TODO: create method to get this data from the server
                            $scope.menuId = 'manage-sanctions-process-info';
                            $scope.gridOptions.columnDefs = [
                                {
                                    name: 'number',
                                    displayName: 'Number',
                                    minWidth: 100,
                                    enableCellEdit: true
                                },
                                {
                                    name: 'handlerId',
                                    displayName: 'Handler ID',
                                    minWidth: 100,
                                    enableCellEdit: true
                                },
                                {
                                    name: 'sanctionStarts',
                                    displayName: 'Sanction Starts',
                                    minWidth: 100,
                                    enableCellEdit: true,
                                    type: 'date',
                                    cellFilter: 'date:"dd-MM-yyyy"'
                                },
                                {
                                    name: 'sanctionEnds',
                                    displayName: 'Sanction Ends',
                                    minWidth: 100,
                                    enableCellEdit: true,
                                    type: 'date',
                                    cellFilter: 'date:"dd-MM-yyyy"'
                                },
                                {
                                    name: 'organ',
                                    displayName: 'Organ',
                                    minWidth: 100,
                                    enableCellEdit: true
                                }
                            ];
                            $scope.gridOptions.data = $scope.manageSanctionProcessInfoData;
                            break;
                        case 5:
                            //TODO: create method to get this data from the server
                            $scope.menuId = 'manage-sanctions-accessing-service-info';
                            $scope.gridOptions.columnDefs = [
                                {
                                    name: 'number',
                                    displayName: 'Number',
                                    minWidth: 100,
                                    enableCellEdit: true
                                },
                                {
                                    name: 'handlerId',
                                    displayName: 'Handler ID',
                                    minWidth: 100,
                                    enableCellEdit: true
                                },
                                {
                                    name: 'sanctionStarts',
                                    displayName: 'Sanction Starts',
                                    minWidth: 100,
                                    enableCellEdit: true,
                                    type: 'date',
                                    cellFilter: 'date:"dd-MM-yyyy"'
                                },
                                {
                                    name: 'sanctionEnds',
                                    displayName: 'Sanction Ends',
                                    minWidth: 100,
                                    enableCellEdit: true,
                                    type: 'date',
                                    cellFilter: 'date:"dd-MM-yyyy"'
                                },
                                {
                                    name: 'organ',
                                    displayName: 'Organ',
                                    minWidth: 100,
                                    enableCellEdit: true
                                }
                            ];
                            $scope.gridOptions.data = $scope.manageSanctionAccessingServiceInfoData;
                            break;
                    }

                    //for system menu
                    if ((index === 7) || (index === 8)) {

                        menuService.removeSelectedState('interface');

                    } else {
                        $http.post(
                            '/',
                            {
                                role: '1', //user current role
                                queryFor: index //get data for
                            }
                        ).success(function (data) {

                                var _interval = null,
                                    _data = data || null;

                                if (_data.errors) {// if server returned errors

                                    // show error modal dialog about the errors
                                    // using here interval to make delay
                                    _interval = $interval(function () {
                                        $translate(['DIALOG.GET_DATA.ERROR.TITLE', 'DIALOG.GET_DATA.OK'])
                                            .then(function (translation) {
                                                dialogService.open(
                                                    translation['DIALOG.GET_DATA.ERROR.TITLE'],
                                                    _data.errors,
                                                    translation['DIALOG.GET_DATA.OK'],
                                                    '',
                                                    'error',
                                                    false);
                                                $interval.cancel(_interval);
                                            });
                                    }, 3000);

                                    $rootScope.$broadcast(SUPER_ADMIN_EVENTS.getDataError);

                                } else {

                                    // apply data from the server to ui-grid
                                    //$scope.gridOptions.data = _data;

                                    $rootScope.$broadcast(SUPER_ADMIN_EVENTS.getDataSuccess);
                                }

                            }).error(function () {

                                $rootScope.$broadcast(SUPER_ADMIN_EVENTS.getDataError);
                            });
                    }

                    //broadcast menu state change in order child controller could
                    //subscribe for this even and perform needed actions
                    $scope.$broadcast(SUPER_ADMIN_EVENTS.menuStateChange);

                };

                /**
                 * User Model
                 * @type {{createUser: {openAddNewUser: boolean, dateTimePickerService: null, addNewUserForm: null, isInvalidRoleDropdown: boolean, isInvalidOrganDropdown: boolean, isInvalidStatusDropdown: boolean, user: {name: string, role: string, status: string, organ: string}, dropdownsInitState: boolean, initialUserData: null, save: Function, open: Function, close: Function, roleChange: Function, organChange: Function, statusChange: Function}, removeUser: {remove: Function}}}
                 * @public
                 */
                $scope.userModel = {

                    /**
                     * Create user
                     */
                    createUser: {

                        /**
                         * Create user fields
                         * @public
                         */
                        openAddNewUser: false, // flag to indicate if the open add new user modal window is open
                        dateTimePickerService: null,
                        addNewUserForm: null,
                        isInvalidRoleDropdown: false,
                        isInvalidOrganDropdown: false,
                        isInvalidStatusDropdown: false,

                        // new user information
                        user: {
                            name: '',
                            role: '',
                            status: '',
                            organ: ''
                        },

                        dropdownsInitState: true,

                        initialUserData: null,

                        /**
                         * Save new user
                         * @public
                         */
                        save: function () {

                            var _interval = null,
                                _this = this;

                            if (!_this.addNewUserForm.$valid) {
                                _this.addNewUserForm.name.$dirty = true;
                                _this.addNewUserForm.starts.$dirty = true;
                                _this.isInvalidRoleDropdown = true;
                                _this.isInvalidOrganDropdown = true;
                                _this.isInvalidStatusDropdown = true;
                                return true;
                            }

                            $http.post(
                                '/',
                                {
                                    enableDatetime: $scope.datetime.starts,
                                    name: _this.user.name,
                                    role: _this.user.role,
                                    status: _this.user.status,
                                    organ: _this.user.organ
                                }
                            ).success(function (data) {

                                    //to emulate error from the server
                                    var _data = {
                                        errors: 'Add new user error happened'
                                    };

                                    //errors came from the server
                                    if (_data.errors) {

                                        // show error modal dialog about the errors
                                        // using here interval to make delay
                                        _interval = $interval(function () {
                                            $translate(['DIALOG.ADD_NEW_USER.ERROR.TITLE', 'DIALOG.ADD_NEW_USER.OK'])
                                                .then(function (translation) {
                                                    dialogService.open(
                                                        translation['DIALOG.ADD_NEW_USER.ERROR.TITLE'],
                                                        _data.errors,
                                                        translation['DIALOG.ADD_NEW_USER.OK'],
                                                        '',
                                                        'error',
                                                        false);
                                                    $interval.cancel(_interval);
                                                });
                                        }, 3000);

                                        $rootScope.$broadcast(SUPER_ADMIN_EVENTS.createNewUserError);

                                    } else { //server return success for creation new user

                                        //apply updated data from the server to ui-gird
                                        $scope.gridOptions.data = _data;

                                        $rootScope.$broadcast(SUPER_ADMIN_EVENTS.createNewUserSuccess);
                                    }

                                }).error(function () {

                                    $rootScope.$broadcast(SUPER_ADMIN_EVENTS.createNewUserError);
                                });

                            this.close();
                        },

                        /**
                         * Open add new user modal window
                         * @param {Object} addNewUserForm
                         * @public
                         */
                        open: function (addNewUserForm) {
                            this.dateTimePickerService = datetimePickerService.init('add-new-user-date-time-picker');
                            this.openAddNewUser = true;
                            this.dropdownsInitState = true;
                            this.addNewUserForm = addNewUserForm;
                            this.initialUserData = angular.copy(this.user);
                        },

                        /**
                         * Close add new user modal window
                         * @public
                         */
                        close: function () {
                            this.dateTimePickerService.clear();

                            this.openAddNewUser = false;
                            this.dropdownsInitState = false;
                            this.isInvalidRoleDropdown = false;
                            this.isInvalidOrganDropdown = false;
                            this.isInvalidStatusDropdown = false;

                            this.addNewUserForm.$setPristine();
                            this.addNewUserForm.$setUntouched();

                            this.user = angular.copy(this.initialUserData);
                            $scope.datetime = angular.copy($scope.initialDateTime);

                            menuService.removeSelectedState('role-dropdown');
                            menuService.removeSelectedState('organ-dropdown');
                            menuService.removeSelectedState('status-dropdown');

                        },

                        /**
                         * Role change handler
                         * @param {String} role
                         * @public
                         */
                        roleChange: function (role) {
                            if (role.length) {
                                this.isInvalidRoleDropdown = false;
                                this.user.role = role;
                            }
                        },

                        /**
                         * Organ change handler
                         * @param {String} organ
                         * @public
                         */
                        organChange: function (organ) {
                            if (organ.length) {
                                this.isInvalidOrganDropdown = false;
                                this.user.organ = organ;
                            }

                        },

                        /**
                         * Status change handler
                         * @param {Int} status
                         * @public
                         */
                        statusChange: function (status) {
                            if (status.toString().length) {
                                this.isInvalidStatusDropdown = false;
                                this.user.status = status;
                            }
                        }
                    },

                    /**
                     * Remove user
                     */
                    removeUser: {

                        /**
                         * Remove user
                         * @returns {boolean} - if user has not selected row
                         * @public
                         */
                        remove: function () {

                            if (!$scope.gridApi.selection.getSelectedRows().length) {
                                return true;
                            }

                            /**
                             * Remove request to the server
                             * @private
                             */
                            var _removeRequest = function () {

                                $http.post(
                                    '/',
                                    {
                                        ids: 'ids to remove'
                                    }
                                ).success(function (data) {

                                        var _interval = null;

                                        //emulate delete error from the server
                                        /*var data = {
                                         errors: 'Delete error happened!'
                                         };
                                         */

                                        //emulate success remove users from the server
                                        var _data = [{
                                            "name": "That is dummy server response to test delete",
                                            "organ": "FSB",
                                            "role": "Handler",
                                            "enable_date": "18.12.2014",
                                            "status": "enable"
                                        }];

                                        if (_data.errors) {// if server returned errors

                                            // show error modal dialog about the errors
                                            // using here interval to make delay
                                            _interval = $interval(function () {
                                                $translate(['DIALOG.REMOVE_USER.ERROR.TITLE', 'DIALOG.REMOVE_USER.OK'])
                                                    .then(function (translation) {
                                                        dialogService.open(
                                                            translation['DIALOG.REMOVE_USER.ERROR.TITLE'],
                                                            _data.errors,
                                                            translation['DIALOG.REMOVE_USER.OK'],
                                                            '',
                                                            'error',
                                                            false);
                                                        $interval.cancel(_interval);
                                                    });
                                            }, 3000);

                                            $rootScope.$broadcast(SUPER_ADMIN_EVENTS.userRemoveError);

                                        } else { // if server removed selected users

                                            // apply updated data from the server to ui-grid
                                            $scope.gridOptions.data = _data;

                                            $rootScope.$broadcast(SUPER_ADMIN_EVENTS.userRemoveSuccess);
                                        }

                                    }).error(function () {

                                        $rootScope.$broadcast(SUPER_ADMIN_EVENTS.userRemoveError);
                                    });
                            };

                            // show remove confirmation dialog
                            $translate(['DIALOG.REMOVE_USER.TITLE',
                                'DIALOG.REMOVE_USER.BODY.FIRST_PART',
                                'DIALOG.REMOVE_USER.BODY.SECOND_PART',
                                'DIALOG.REMOVE_USER.OK',
                                'DIALOG.REMOVE_USER.CANCEL'])
                                .then(function (translation) {
                                    dialogService.open(
                                        translation['DIALOG.REMOVE_USER.TITLE'],
                                        translation['DIALOG.REMOVE_USER.BODY.FIRST_PART']
                                        + $scope.gridApi.selection.getSelectedRows().length +
                                        translation['DIALOG.REMOVE_USER.BODY.SECOND_PART'],
                                        translation['DIALOG.REMOVE_USER.OK'],
                                        translation['DIALOG.REMOVE_USER.CANCEL'],
                                        '',
                                        true,
                                        _removeRequest);
                                });
                            //console.log($scope.gridApi.selection.getSelectedGridRows());
                            //console.log($scope.gridApi.selection.getSelectedRows());

                        }
                    },

                    /**
                     * Change user status
                     */
                    changeUserStatus: {

                        /**
                         * Change user status handler
                         * @param {Int} status - 0:disable 1:enable
                         * @returns {boolean} - if user has not selected any row
                         * @public
                         */
                        changeStatus: function (status) {

                            var _status = status || -1;

                            if (!$scope.gridApi.selection.getSelectedRows().length || !_status) {
                                return true;
                            }

                            $http.post(
                                '/',
                                {
                                    ids: 'ids data to change status',
                                    status: _status
                                }
                            ).success(function (data) {

                                    //emulate change status error from the server
                                    var _data = {
                                        errors: 'Change status error happened!'
                                    };

                                    if (_data.errors) {// if server returns error

                                        $translate(['DIALOG.CHANGE_STATUS.ERROR.TITLE', 'DIALOG.CHANGE_STATUS.OK'])
                                            .then(function (translation) {
                                                dialogService.open(
                                                    translation['DIALOG.CHANGE_STATUS.ERROR.TITLE'],
                                                    _data.errors,
                                                    translation['DIALOG.CHANGE_STATUS.OK'],
                                                    '',
                                                    'error',
                                                    false);
                                            });

                                        $rootScope.$broadcast(SUPER_ADMIN_EVENTS.changeStatusError);

                                    } else {// if server has changes selected user's status

                                        //apply updated data from the server to ui-gird
                                        $scope.gridOptions.data = _data;

                                        $rootScope.$broadcast(SUPER_ADMIN_EVENTS.changeStatusSuccess);
                                    }

                                }).error(function () {

                                    $rootScope.$broadcast(SUPER_ADMIN_EVENTS.changeStatusError);
                                });
                        }
                    }
                };

                /**
                 * Organ Model
                 * @type {{createOrgan: {openAddNewOrgan: boolean, organName: string, addNewOrganForm: null, open: Function, close: Function, save: Function}, removeOrgan: {remove: Function}}}
                 * @public
                 */
                $scope.organModel = {

                    /**
                     * Create organ
                     */
                    createOrgan: {

                        /**
                         * Create new organ fields
                         * @public
                         */
                        openAddNewOrgan: false, // flag to indicate if the open add new user modal window is open
                        organName: '',
                        addNewOrganForm: null,

                        /**
                         * Open add new organ modal window
                         * @public
                         */
                        open: function (addNewOrganForm) {
                            this.openAddNewOrgan = true;
                            this.addNewOrganForm = addNewOrganForm;
                        },

                        /**
                         * Close add new organ modal window
                         * @public
                         */
                        close: function () {
                            this.organName = '';
                            this.openAddNewOrgan = false;

                            this.addNewOrganForm.$setPristine();
                            this.addNewOrganForm.$setUntouched();
                        },

                        /**
                         * Save new organ
                         * @param {Object} addNewOrganForm
                         * @public
                         */
                        save: function () {

                            var _this = this;

                            $http.post(
                                '/',
                                {
                                    organName: _this.organName
                                }
                            ).success(function (data) {

                                    var _interval = null;

                                    //emulate change status error from the server
                                    var _data = {
                                        errors: 'Add new organ failed!'
                                    };

                                    if (_data.errors) {// if server returns error

                                        _interval = $interval(function () {
                                            $translate(['DIALOG.ADD_NEW_ORGAN.ERROR.TITLE', 'DIALOG.ADD_NEW_ORGAN.OK'])
                                                .then(function (translation) {
                                                    dialogService.open(
                                                        translation['DIALOG.ADD_NEW_ORGAN.ERROR.TITLE'],
                                                        _data.errors,
                                                        translation['DIALOG.ADD_NEW_ORGAN.OK'],
                                                        '',
                                                        'error',
                                                        false);
                                                    $interval.cancel(_interval);
                                                });
                                        }, 3000);

                                        $rootScope.$broadcast(SUPER_ADMIN_EVENTS.addNewOrganError);

                                    } else {// if server has changes selected user's status

                                        //apply updated data from the server to ui-gird
                                        $scope.gridOptions.data = _data;

                                        $rootScope.$broadcast(SUPER_ADMIN_EVENTS.addNewOrganSuccess);
                                    }

                                }).error(function () {

                                    $rootScope.$broadcast(SUPER_ADMIN_EVENTS.addNewOrganError);
                                });

                            this.close();
                        }
                    },

                    /**
                     * Remove organ
                     */
                    removeOrgan: {
                        /**
                         * Remove organ
                         * @returns {boolean} - if user has not selected row
                         * @public
                         */
                        remove: function () {

                            if (!$scope.gridApi.selection.getSelectedRows().length) {
                                return true;
                            }

                            /**
                             * Remove request to the server
                             * @private
                             */
                            var _removeRequest = function () {

                                $http.post(
                                    '/',
                                    {
                                        ids: 'ids to remove'
                                    }
                                ).success(function (data) {
                                        var _interval = null;

                                        //emulate delete error from the server
                                        var _data = {
                                            errors: 'Delete error happened!'
                                        };

                                        if (_data.errors) {// if server returned errors

                                            // show error modal dialog about the errors
                                            // using here interval to make delay
                                            _interval = $interval(function () {
                                                $translate(['DIALOG.REMOVE_ORGAN.ERROR.TITLE', 'DIALOG.REMOVE_ORGAN.OK'])
                                                    .then(function (translation) {
                                                        dialogService.open(
                                                            translation['DIALOG.REMOVE_ORGAN.ERROR.TITLE'],
                                                            _data.errors,
                                                            translation['DIALOG.REMOVE_ORGAN.OK'],
                                                            '',
                                                            'error',
                                                            false);
                                                        $interval.cancel(_interval);
                                                    });
                                            }, 3000);

                                            $rootScope.$broadcast(SUPER_ADMIN_EVENTS.organRemoveError);

                                        } else { // if server removed selected users

                                            // apply updated data from the server to ui-grid
                                            $scope.gridOptions.data = _data;

                                            $rootScope.$broadcast(SUPER_ADMIN_EVENTS.organRemoveSuccess);
                                        }

                                    }).error(function () {

                                        $rootScope.$broadcast(SUPER_ADMIN_EVENTS.organRemoveError);
                                    });
                            };

                            // show remove confirmation dialog
                            $translate(['DIALOG.REMOVE_ORGAN.TITLE',
                                'DIALOG.REMOVE_ORGAN.BODY.FIRST_PART',
                                'DIALOG.REMOVE_ORGAN.BODY.SECOND_PART',
                                'DIALOG.REMOVE_ORGAN.OK',
                                'DIALOG.REMOVE_ORGAN.CANCEL'])
                                .then(function (translation) {
                                    dialogService.open(
                                        translation['DIALOG.REMOVE_ORGAN.TITLE'],
                                        translation['DIALOG.REMOVE_ORGAN.BODY.FIRST_PART']
                                        + $scope.gridApi.selection.getSelectedRows().length +
                                        translation['DIALOG.REMOVE_ORGAN.BODY.SECOND_PART'],
                                        translation['DIALOG.REMOVE_ORGAN.OK'],
                                        translation['DIALOG.REMOVE_ORGAN.CANCEL'],
                                        '',
                                        true,
                                        _removeRequest);
                                });
                            //console.log($scope.gridApi.selection.getSelectedGridRows());
                            //console.log($scope.gridApi.selection.getSelectedRows());

                        }
                    }

                };


                /**
                 * Intercept Information Model
                 * @type {{createTask: {openAddNewTask: boolean, dropdownsInitState: boolean, isInvalidIdTypeDropdown: boolean, isInvalidSignDropdown: boolean, isInvalidOrganDropdown: boolean, datetimePickerFrameStartService: null, datetimePickerFrameEndService: null, isIdFieldDisable: boolean, task: {number: string, alias: string, idType: string, sign: string, id: string, organ: string, comment: string}, initialTaskData: null, organChange: Function, signChange: Function, idTypeChange: Function, open: Function, close: Function, save: Function}, removeTask: {remove: Function}}}
                 * @public
                 */
                $scope.interceptInformationModel = {

                    /**
                     * Create new task
                     */
                    createTask: {

                        /**
                         * Create task fields
                         * @public
                         */
                        openAddNewTask: false,
                        dropdownsInitState: false,

                        isInvalidIdTypeDropdown: false,
                        isInvalidSignDropdown: false,
                        isInvalidOrganDropdown: false,

                        datetimePickerFrameStartService: null,
                        datetimePickerFrameEndService: null,

                        isIdFieldDisable: true,

                        task: {
                            number: '',
                            alias: '',
                            idType: '',
                            sign: '',
                            id: '',
                            organ: '',
                            comment: ''
                        },

                        initialTaskData: null,

                        /**
                         * Organ handler
                         * @param {String} organ
                         * @public
                         */
                        organChange: function (organ) {
                            if (organ.length) {
                                this.isInvalidOrganDropdown = false;
                                this.task.organ = organ;
                            }
                        },

                        /**
                         * Sign gathering data handler
                         * @param {Int} sign
                         * @public
                         */
                        signChange: function (sign) {
                            if (sign.toString().length) {
                                this.isInvalidSignDropdown = false;
                                this.task.sign = sign;
                            }
                        },

                        /**
                         * Id type handler
                         * @param {Sting} idType
                         */
                        idTypeChange: function (idType) {
                            if (idType.length) {
                                this.isIdFieldDisable = false;
                                this.isInvalidIdTypeDropdown = false;
                                this.task.idType = idType;
                            }
                        },

                        /**
                         * Open add new task form
                         * @param {Object} addNewTaskInterceptInfoForm
                         * @public
                         */
                        open: function (addNewTaskInterceptInfoForm) {
                            this.datetimePickerFrameStartService = datetimePickerService.init('intercept-timeframe-starts');
                            this.datetimePickerFrameEndService = datetimePickerService.init('intercept-timeframe-ends');

                            this.openAddNewTask = true;
                            this.dropdownsInitState = true;

                            this.addNewTaskInterceptInfoForm = addNewTaskInterceptInfoForm;

                            this.initialTaskData = angular.copy(this.task);
                        },

                        /**
                         * Close add new task form
                         * @public
                         */
                        close: function () {

                            this.datetimePickerFrameStartService.clear();
                            this.datetimePickerFrameEndService.clear();

                            this.openAddNewTask = false;
                            this.dropdownsInitState = false;
                            this.isInvalidIdTypeDropdown = false;
                            this.isInvalidSignDropdown = false;
                            this.isInvalidOrganDropdown = false;

                            this.isIdFieldDisable = true;

                            this.addNewTaskInterceptInfoForm.$setPristine();
                            this.addNewTaskInterceptInfoForm.$setUntouched();

                            this.task = angular.copy(this.initialTaskData);
                            $scope.datetime = angular.copy($scope.initialDateTime);

                            menuService.removeSelectedState('intercept-info-organ-dropdown');
                            menuService.removeSelectedState('intercept-info-sign-dropdown');
                            menuService.removeSelectedState('intercept-info-id-type-dropdown');
                        },

                        /**
                         * Save new task
                         * @public
                         */
                        save: function () {

                            var _interval = null,
                                _this = this;

                            if (!_this.addNewTaskInterceptInfoForm.$valid) {
                                _this.addNewTaskInterceptInfoForm.id.$dirty = true;
                                _this.addNewTaskInterceptInfoForm.number.$dirty = true;
                                _this.addNewTaskInterceptInfoForm.starts.$dirty = true;
                                _this.addNewTaskInterceptInfoForm.ends.$dirty = true;
                                _this.addNewTaskInterceptInfoForm.alias.$dirty = true;

                                _this.isInvalidIdTypeDropdown = true;
                                _this.isInvalidSignDropdown = true;
                                _this.isInvalidOrganDropdown = true;
                                return true;
                            }

                            $http.post(
                                '/',
                                {
                                    number: _this.task.number,
                                    alias: _this.task.alias,
                                    timedateStarts: $scope.datetime.starts,
                                    timedateEnds: $scope.datetime.ends,
                                    idType: _this.task.idType,
                                    sign: _this.task.sign,
                                    id: _this.task.id,
                                    organ: _this.task.organ,
                                    comment: _this.task.comment
                                }
                            ).success(function (data) {

                                    //to emulate error from the server
                                    var _data = {
                                        errors: 'Add new task error happened'
                                    };

                                    //errors came from the server
                                    if (_data.errors) {

                                        // show error modal dialog about the errors
                                        // using here interval to make delay
                                        _interval = $interval(function () {
                                            $translate(['DIALOG.ADD_TASK_INTERCEPT_INFO.ERROR.TITLE', 'DIALOG.ADD_TASK_INTERCEPT_INFO.OK'])
                                                .then(function (translation) {
                                                    dialogService.open(
                                                        translation['DIALOG.ADD_TASK_INTERCEPT_INFO.ERROR.TITLE'],
                                                        _data.errors,
                                                        translation['DIALOG.ADD_TASK_INTERCEPT_INFO.OK'],
                                                        '',
                                                        'error',
                                                        false);
                                                    $interval.cancel(_interval);
                                                });
                                        }, 3000);

                                        $rootScope.$broadcast(SUPER_ADMIN_EVENTS.addTaskInterceptInfoError);

                                    } else { //server return success for creation new user

                                        //apply updated data from the server to ui-gird
                                        $scope.gridOptions.data = _data;

                                        $rootScope.$broadcast(SUPER_ADMIN_EVENTS.addTaskInterceptInfoSuccess);
                                    }

                                }).error(function () {

                                    $rootScope.$broadcast(SUPER_ADMIN_EVENTS.addTaskInterceptInfoError);
                                });

                            this.close();
                        }

                    },

                    /**
                     * Remove task
                     */
                    removeTask: {

                        /**
                         * Remove task intercept info
                         * @returns {boolean} - if user has not selected row
                         * @public
                         */
                        remove: function () {

                            if (!$scope.gridApi.selection.getSelectedRows().length) {
                                return true;
                            }

                            /**
                             * Remove request to the server
                             * @private
                             */
                            var _removeRequest = function () {

                                $http.post(
                                    '/',
                                    {
                                        ids: 'ids to remove'
                                    }
                                ).success(function (data) {
                                        var _interval = null;

                                        //emulate delete error from the server
                                        var _data = {
                                            errors: 'Delete error happened!'
                                        };

                                        if (_data.errors) {// if server returned errors

                                            // show error modal dialog about the errors
                                            // using here interval to make delay
                                            _interval = $interval(function () {
                                                $translate(['DIALOG.REMOVE_TASK_INTERCEPT_INFO.ERROR.TITLE', 'DIALOG.REMOVE_TASK_INTERCEPT_INFO.OK'])
                                                    .then(function (translation) {
                                                        dialogService.open(
                                                            translation['DIALOG.REMOVE_TASK_INTERCEPT_INFO.ERROR.TITLE'],
                                                            _data.errors,
                                                            translation['DIALOG.REMOVE_TASK_INTERCEPT_INFO.OK'],
                                                            '',
                                                            'error',
                                                            false);
                                                        $interval.cancel(_interval);
                                                    });
                                            }, 3000);

                                            $rootScope.$broadcast(SUPER_ADMIN_EVENTS.taskInterceptInfoRemoveError);

                                        } else { // if server removed selected users

                                            // apply updated data from the server to ui-grid
                                            $scope.gridOptions.data = _data;

                                            $rootScope.$broadcast(SUPER_ADMIN_EVENTS.taskInterceptInfoRemoveSuccess);
                                        }

                                    }).error(function () {

                                        $rootScope.$broadcast(SUPER_ADMIN_EVENTS.taskInterceptInfoRemoveError);
                                    });
                            };

                            // show remove confirmation dialog
                            $translate(['DIALOG.REMOVE_TASK_INTERCEPT_INFO.TITLE',
                                'DIALOG.REMOVE_TASK_INTERCEPT_INFO.BODY.FIRST_PART',
                                'DIALOG.REMOVE_TASK_INTERCEPT_INFO.BODY.SECOND_PART',
                                'DIALOG.REMOVE_TASK_INTERCEPT_INFO.OK',
                                'DIALOG.REMOVE_TASK_INTERCEPT_INFO.CANCEL'])
                                .then(function (translation) {
                                    dialogService.open(
                                        translation['DIALOG.REMOVE_TASK_INTERCEPT_INFO.TITLE'],
                                        translation['DIALOG.REMOVE_TASK_INTERCEPT_INFO.BODY.FIRST_PART']
                                        + $scope.gridApi.selection.getSelectedRows().length +
                                        translation['DIALOG.REMOVE_TASK_INTERCEPT_INFO.BODY.SECOND_PART'],
                                        translation['DIALOG.REMOVE_TASK_INTERCEPT_INFO.OK'],
                                        translation['DIALOG.REMOVE_TASK_INTERCEPT_INFO.CANCEL'],
                                        '',
                                        true,
                                        _removeRequest);
                                });
                            //console.log($scope.gridApi.selection.getSelectedGridRows());
                            //console.log($scope.gridApi.selection.getSelectedRows());

                        }
                    }

                };

                /**
                 * Process Information Model
                 * @type {{createSanction: {openAddNewProcessInfoSanction: boolean, dropdownsInitState: boolean, isInvalidUserDropdown: boolean, isInvalidOrganDropdown: boolean, processInfoSanctionForm: null, datetimePickerFrameStartService: null, datetimePickerFrameEndService: null, sanction: {number: string, organ: string, user: string}, initialSanctionData: null, open: Function, close: Function, userChange: Function, organChange: Function, save: Function}, removeSanction: {remove: Function}}}
                 * @public
                 */
                $scope.processInformationModel = {

                    /**
                     * Create Sanction
                     */
                    createSanction: {

                        /**
                         * Create sanction fileds
                         * @public
                         */
                        openAddNewProcessInfoSanction: false,
                        dropdownsInitState: false,
                        isInvalidUserDropdown: false,
                        isInvalidOrganDropdown: false,

                        processInfoSanctionForm: null,
                        datetimePickerFrameStartService: null,
                        datetimePickerFrameEndService: null,

                        sanction: {
                            number: '',
                            organ: '',
                            user: ''
                        },

                        initialSanctionData: null,

                        /**
                         * Open window to add new sanction
                         * @param {Object} processInfoSanctionForm
                         * @public
                         */
                        open: function (processInfoSanctionForm) {

                            this.datetimePickerFrameStartService = datetimePickerService.init('sanction-process-info-starts');
                            this.datetimePickerFrameEndService = datetimePickerService.init('sanction-process-info-ends');

                            this.openAddNewProcessInfoSanction = true;
                            this.dropdownsInitState = true;

                            this.processInfoSanctionForm = processInfoSanctionForm;

                            this.initialSanctionData = angular.copy(this.sanction);
                        },

                        /**
                         * Close window add new sanction
                         * @public
                         */
                        close: function () {

                            this.datetimePickerFrameStartService.clear();
                            this.datetimePickerFrameEndService.clear();

                            this.openAddNewProcessInfoSanction = false;
                            this.dropdownsInitState = false;
                            this.isInvalidUserDropdown = false;
                            this.isInvalidOrganDropdown = false;

                            this.processInfoSanctionForm.$setPristine();
                            this.processInfoSanctionForm.$setUntouched();

                            this.sanction = angular.copy(this.initialSanctionData);
                            $scope.datetime = angular.copy($scope.initialDateTime);

                            menuService.removeSelectedState('sanction-process-info-organ-dropdown');
                            menuService.removeSelectedState('sanction-process-info-user-dropdown');

                        },

                        /**
                         * User change handler
                         * @param {String} user
                         * @public
                         */
                        userChange: function (user) {
                            if (user.length) {
                                this.isInvalidUserDropdown = false;
                                this.sanction.user = user;
                            }
                        },

                        /**
                         * Organ change handler
                         * @param {String} organ
                         * @public
                         */
                        organChange: function (organ) {
                            if (organ.length) {
                                this.isInvalidOrganDropdown = false;
                                this.sanction.organ = organ;
                            }
                        },

                        /**
                         * Save newly created sanction for processing info
                         * @public
                         */
                        save: function () {

                            var _interval = null,
                                _this = this;

                            if (!_this.processInfoSanctionForm.$valid) {
                                _this.processInfoSanctionForm.number.$dirty = true;
                                _this.processInfoSanctionForm.starts.$dirty = true;
                                _this.processInfoSanctionForm.ends.$dirty = true;

                                _this.isInvalidUserDropdown = true;
                                _this.isInvalidOrganDropdown = true;
                                return true;
                            }

                            $http.post(
                                '/',
                                {
                                    number: _this.sanction.number,
                                    dateStarts: $scope.datetime.starts,
                                    dateEnds: $scope.datetime.ends,
                                    organ: _this.sanction.organ,
                                    user: _this.sanction.user
                                }
                            ).success(function (data) {

                                    //to emulate error from the server
                                    var _data = {
                                        errors: 'Add new sanction for processing information error happened'
                                    };

                                    //errors came from the server
                                    if (_data.errors) {

                                        // show error modal dialog about the errors
                                        // using here interval to make delay
                                        _interval = $interval(function () {
                                            $translate(['DIALOG.ADD_SANCTION_PROCESS_INFO.ERROR.TITLE', 'DIALOG.ADD_SANCTION_PROCESS_INFO.OK'])
                                                .then(function (translation) {
                                                    dialogService.open(
                                                        translation['DIALOG.ADD_SANCTION_PROCESS_INFO.ERROR.TITLE'],
                                                        _data.errors,
                                                        translation['DIALOG.ADD_SANCTION_PROCESS_INFO.OK'],
                                                        '',
                                                        'error',
                                                        false);
                                                    $interval.cancel(_interval);
                                                });
                                        }, 3000);

                                        $rootScope.$broadcast(SUPER_ADMIN_EVENTS.addSanctionProcessInfoError);

                                    } else { //server return success for creation new user

                                        //apply updated data from the server to ui-gird
                                        $scope.gridOptions.data = _data;

                                        $rootScope.$broadcast(SUPER_ADMIN_EVENTS.addSanctionProcessInfoSuccess);
                                    }

                                }).error(function () {

                                    $rootScope.$broadcast(SUPER_ADMIN_EVENTS.addSanctionProcessInfoError);
                                });

                            this.close();
                        }

                    },

                    /**
                     * Remove sanction
                     */
                    removeSanction: {

                        /**
                         * Remove sanctions for processing information
                         * @returns {boolean} - if user has not selected row
                         * @public
                         */
                        remove: function () {

                            if (!$scope.gridApi.selection.getSelectedRows().length) {
                                return true;
                            }

                            /**
                             * Remove request to the server
                             * @private
                             */
                            var _removeRequest = function () {

                                $http.post(
                                    '/',
                                    {
                                        ids: 'ids to remove'
                                    }
                                ).success(function (data) {
                                        var _interval = null;

                                        //emulate delete error from the server
                                        var _data = {
                                            errors: 'Delete error happened!'
                                        };

                                        if (_data.errors) {// if server returned errors

                                            // show error modal dialog about the errors
                                            // using here interval to make delay
                                            _interval = $interval(function () {
                                                $translate(['DIALOG.REMOVE_SANCTION_PROCESS_INFO.ERROR.TITLE', 'DIALOG.REMOVE_SANCTION_PROCESS_INFO.ERROR.OK'])
                                                    .then(function (translation) {
                                                        dialogService.open(
                                                            translation['DIALOG.REMOVE_SANCTION_PROCESS_INFO.ERROR.TITLE'],
                                                            _data.errors,
                                                            translation['DIALOG.REMOVE_SANCTION_PROCESS_INFO.ERROR.OK'],
                                                            '',
                                                            'error',
                                                            false);
                                                        $interval.cancel(_interval);
                                                    });
                                            }, 3000);

                                            $rootScope.$broadcast(SUPER_ADMIN_EVENTS.sanctionProcessInfoRemoveError);

                                        } else { // if server removed selected users

                                            // apply updated data from the server to ui-grid
                                            $scope.gridOptions.data = _data;

                                            $rootScope.$broadcast(SUPER_ADMIN_EVENTS.sanctionProcessInfoRemoveSuccess);
                                        }

                                    }).error(function () {

                                        $rootScope.$broadcast(SUPER_ADMIN_EVENTS.sanctionProcessInfoRemoveError);
                                    });
                            };

                            // show remove confirmation dialog
                            $translate(['DIALOG.REMOVE_SANCTION_PROCESS_INFO.TITLE',
                                'DIALOG.REMOVE_SANCTION_PROCESS_INFO.BODY.FIRST_PART',
                                'DIALOG.REMOVE_SANCTION_PROCESS_INFO.BODY.SECOND_PART',
                                'DIALOG.REMOVE_SANCTION_PROCESS_INFO.OK',
                                'DIALOG.REMOVE_SANCTION_PROCESS_INFO.CANCEL'])
                                .then(function (translation) {
                                    dialogService.open(
                                        translation['DIALOG.REMOVE_SANCTION_PROCESS_INFO.TITLE'],
                                        translation['DIALOG.REMOVE_SANCTION_PROCESS_INFO.BODY.FIRST_PART']
                                        + $scope.gridApi.selection.getSelectedRows().length +
                                        translation['DIALOG.REMOVE_SANCTION_PROCESS_INFO.BODY.SECOND_PART'],
                                        translation['DIALOG.REMOVE_SANCTION_PROCESS_INFO.OK'],
                                        translation['DIALOG.REMOVE_SANCTION_PROCESS_INFO.CANCEL'],
                                        '',
                                        true,
                                        _removeRequest);
                                });
                            //console.log($scope.gridApi.selection.getSelectedGridRows());
                            //console.log($scope.gridApi.selection.getSelectedRows());

                        }
                    }
                };

                /**
                 * Access Service Information Model
                 * @type {{createSanction: {openAddNewAccessingServiceInfoSanction: boolean, dropdownsInitState: boolean, isInvalidUserDropdown: boolean, isInvalidOrganDropdown: boolean, accessServiceInfoSanctionForm: null, datetimePickerFrameStartService: null, datetimePickerFrameEndService: null, sanction: {number: string, organ: string, user: string}, initialSanctionData: null, open: Function, close: Function, userChange: Function, organChange: Function, save: Function}, removeSanction: {remove: Function}}}
                 * @public
                 */
                $scope.accessServiceInformationModel = {

                    /**
                     * Create sanction
                     */
                    createSanction: {

                        /**
                         * Create sanction fields
                         * @public
                         */
                        openAddNewAccessingServiceInfoSanction: false,
                        dropdownsInitState: false,
                        isInvalidUserDropdown: false,
                        isInvalidOrganDropdown: false,

                        accessServiceInfoSanctionForm: null,
                        datetimePickerFrameStartService: null,
                        datetimePickerFrameEndService: null,

                        sanction: {
                            number: '',
                            organ: '',
                            user: ''
                        },

                        initialSanctionData: null,

                        /**
                         * Open window to add new sanction
                         * @param {Object} accessServiceInfoSanctionForm
                         * @public
                         */
                        open: function (accessServiceInfoSanctionForm) {

                            this.datetimePickerFrameStartService = datetimePickerService.init('sanction-access-service-info-starts');
                            this.datetimePickerFrameEndService = datetimePickerService.init('sanction-access-service-info-ends');

                            this.openAddNewAccessingServiceInfoSanction = true;
                            this.dropdownsInitState = true;

                            this.accessServiceInfoSanctionForm = accessServiceInfoSanctionForm;

                            this.initialSanctionData = angular.copy(this.sanction);
                        },

                        /**
                         * Close window add new sanction
                         * @public
                         */
                        close: function () {
                            this.datetimePickerFrameStartService.clear();
                            this.datetimePickerFrameEndService.clear();

                            this.openAddNewAccessingServiceInfoSanction = false;
                            this.dropdownsInitState = false;
                            this.isInvalidOrganDropdown = false;
                            this.isInvalidUserDropdown = false;

                            this.accessServiceInfoSanctionForm.$setPristine();
                            this.accessServiceInfoSanctionForm.$setUntouched();

                            this.sanction = angular.copy(this.initialSanctionData);
                            $scope.datetime = angular.copy($scope.initialDateTime);

                            menuService.removeSelectedState('sanction-access-service-info-organ-dropdown');
                            menuService.removeSelectedState('sanction-access-service-info-user-dropdown');
                        },

                        /**
                         * User change handler
                         * @param {String} user
                         * @public
                         */
                        userChange: function (user) {
                            if (user.length) {
                                this.isInvalidUserDropdown = false;
                                this.sanction.user = user;
                            }
                        },

                        /**
                         * Organ change handler
                         * @param {String} organ
                         * @public
                         */
                        organChange: function (organ) {
                            if (organ.length) {
                                this.isInvalidOrganDropdown = false;
                                this.sanction.organ = organ;
                            }
                        },

                        /**
                         * Save newly created sanction for accessing service info
                         * @public
                         */
                        save: function () {

                            var _interval = null,
                                _this = this;

                            if (!_this.accessServiceInfoSanctionForm.$valid) {
                                _this.accessServiceInfoSanctionForm.number.$dirty = true;
                                _this.accessServiceInfoSanctionForm.starts.$dirty = true;
                                _this.accessServiceInfoSanctionForm.ends.$dirty = true;

                                _this.isInvalidUserDropdown = true;
                                _this.isInvalidOrganDropdown = true;
                                return true;
                            }

                            $http.post(
                                '/',
                                {
                                    number: _this.sanction.number,
                                    dateStarts: $scope.datetime.starts,
                                    dateEnds: $scope.datetime.ends,
                                    organ: _this.sanction.organ,
                                    user: _this.sanction.user
                                }
                            ).success(function (data) {

                                    //to emulate error from the server
                                    var _data = {
                                        errors: 'Add new sanction for accessing service information error happened'
                                    };

                                    //errors came from the server
                                    if (_data.errors) {

                                        // show error modal dialog about the errors
                                        // using here interval to make delay
                                        _interval = $interval(function () {
                                            $translate(['DIALOG.ADD_SANCTION_ACCESS_SERVICE_INFO.ERROR.TITLE', 'DIALOG.ADD_SANCTION_ACCESS_SERVICE_INFO.OK'])
                                                .then(function (translation) {
                                                    dialogService.open(
                                                        translation['DIALOG.ADD_SANCTION_ACCESS_SERVICE_INFO.ERROR.TITLE'],
                                                        _data.errors,
                                                        translation['DIALOG.ADD_SANCTION_ACCESS_SERVICE_INFO.OK'],
                                                        '',
                                                        'error',
                                                        false);
                                                    $interval.cancel(_interval);
                                                });
                                        }, 3000);

                                        $rootScope.$broadcast(SUPER_ADMIN_EVENTS.addSanctionAccessServiceInfoError);

                                    } else { //server return success for creation new user

                                        //apply updated data from the server to ui-gird
                                        $scope.gridOptions.data = _data;

                                        $rootScope.$broadcast(SUPER_ADMIN_EVENTS.addSanctionAccessServiceInfoSuccess);
                                    }

                                }).error(function () {

                                    $rootScope.$broadcast(SUPER_ADMIN_EVENTS.addSanctionAccessServiceInfoError);
                                });

                            this.close();
                        }
                    },

                    /**
                     * Remove sanction
                     */
                    removeSanction: {
                        /**
                         * Remove sanctions for accessing service information
                         * @returns {boolean} - if user has not selected row
                         * @public
                         */
                        remove: function () {

                            if (!$scope.gridApi.selection.getSelectedRows().length) {
                                return true;
                            }

                            /**
                             * Remove request to the server
                             * @private
                             */
                            var _removeRequest = function () {

                                $http.post(
                                    '/',
                                    {
                                        ids: 'ids to remove'
                                    }
                                ).success(function (data) {
                                        var _interval = null;

                                        //emulate delete error from the server
                                        var _data = {
                                            errors: 'Delete error happened!'
                                        };

                                        if (_data.errors) {// if server returned errors

                                            // show error modal dialog about the errors
                                            // using here interval to make delay
                                            _interval = $interval(function () {
                                                $translate(['DIALOG.REMOVE_SANCTION_ACCESS_SERVICE_INFO.ERROR.TITLE',
                                                    'DIALOG.REMOVE_SANCTION_ACCESS_SERVICE_INFO.ERROR.OK'])
                                                    .then(function (translation) {
                                                        dialogService.open(
                                                            translation['DIALOG.REMOVE_SANCTION_ACCESS_SERVICE_INFO.ERROR.TITLE'],
                                                            _data.errors,
                                                            translation['DIALOG.REMOVE_SANCTION_ACCESS_SERVICE_INFO.ERROR.OK'],
                                                            '',
                                                            'error',
                                                            false);
                                                        $interval.cancel(_interval);
                                                    });
                                            }, 3000);

                                            $rootScope.$broadcast(SUPER_ADMIN_EVENTS.sanctionAccessServiceInfoRemoveError);

                                        } else { // if server removed selected users

                                            // apply updated data from the server to ui-grid
                                            $scope.gridOptions.data = _data;

                                            $rootScope.$broadcast(SUPER_ADMIN_EVENTS.sanctionAccessServiceInfoRemoveSuccess);
                                        }

                                    }).error(function () {

                                        $rootScope.$broadcast(SUPER_ADMIN_EVENTS.sanctionAccessServiceInfoRemoveError);
                                    });
                            };

                            // show remove confirmation dialog
                            $translate(['DIALOG.REMOVE_SANCTION_ACCESS_SERVICE_INFO.TITLE',
                                'DIALOG.REMOVE_SANCTION_ACCESS_SERVICE_INFO.BODY.FIRST_PART',
                                'DIALOG.REMOVE_SANCTION_ACCESS_SERVICE_INFO.BODY.SECOND_PART',
                                'DIALOG.REMOVE_SANCTION_ACCESS_SERVICE_INFO.OK',
                                'DIALOG.REMOVE_SANCTION_ACCESS_SERVICE_INFO.CANCEL'])
                                .then(function (translation) {
                                    dialogService.open(
                                        translation['DIALOG.REMOVE_SANCTION_ACCESS_SERVICE_INFO.TITLE'],
                                        translation['DIALOG.REMOVE_SANCTION_ACCESS_SERVICE_INFO.BODY.FIRST_PART']
                                        + $scope.gridApi.selection.getSelectedRows().length +
                                        translation['DIALOG.REMOVE_SANCTION_ACCESS_SERVICE_INFO.BODY.SECOND_PART'],
                                        translation['DIALOG.REMOVE_SANCTION_ACCESS_SERVICE_INFO.OK'],
                                        translation['DIALOG.REMOVE_SANCTION_ACCESS_SERVICE_INFO.CANCEL'],
                                        '',
                                        true,
                                        _removeRequest);
                                });
                            //console.log($scope.gridApi.selection.getSelectedGridRows());
                            //console.log($scope.gridApi.selection.getSelectedRows());

                        }
                    }

                };

                /**
                 * Go to previous page handler
                 * @public
                 */
                $scope.previousPage = function () {
                    dataGridPagingService.previousPage();
                };

                /**
                 * Go to certain page handler
                 * @param {Int} goToPage
                 * @public
                 */
                $scope.goToPage = function (goToPage) {
                    var _goToPage = goToPage || 1;
                    dataGridPagingService.goToPage(_goToPage);
                };

                /**
                 * Go to next page handler
                 * @public
                 */
                $scope.nextPage = function () {
                    dataGridPagingService.nextPage();
                };

            }
        ])
    ;
})
();