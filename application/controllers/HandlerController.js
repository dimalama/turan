/**
 * @fileoverview
 *
 * @autor Dmitry Lukianenko on 1/12/15.
 *
 * @license
 */


(function () {
    'use strict';

    //create Handler module
    var Handler = angular.module('Handler',
        [
            'Directives',
            'Services',
            'treeControl',
            'ui.grid',
            'ui.grid.pagination',
            'ui.grid.selection',
            'ui.grid.moveColumns',
            'ui.grid.resizeColumns',
            'ui.grid.pinning',
            'ngSanitize',
            'com.2fdevs.videogular',
            'com.2fdevs.videogular.plugins.controls',
            'com.2fdevs.videogular.plugins.overlayplay',
            'com.2fdevs.videogular.plugins.poster'
        ]
    );


    /**
     * Handler constants
     * @const
     */
    Handler.constant('HANDLER_EVENTS', {
        menuStateChange: 'handler-menu-state-changed',
        accessServiceInfoQueryCancelError: 'access-service-info-query-cancelling-error',
        accessServiceInfoQueryCancelSuccess: 'access-service-info-query-canceled-successfully',
        accessServiceInfoQueryResultsError: 'access-service-info-query-resulting-error',
        accessServiceInfoQueryResultsSuccess: 'access-service-info-query-result-success',
        createQueryAccessServiceInfoError: 'creating-query-access-service-info-error',
        createQueryAccessServiceInfoSuccess: 'query-access-service-info-created-successfully',
        filterQueryError: 'filter-query-error',
        filterQuerySuccess: 'filter-query-success'
    }).constant('HANDLER_CATEGORY_TYPE', {
        authorizedTaskIntercept: 1,
        accessServiceInfo: 2
    }).constant('HANDLER_MENU_TYPE', {
        empty: 0,
        authorizedTaskInterceptResult: 1,
        accessServiceInfoQueryInfo: 2,
        btnCreateQuery: 3,
        accessServiceInfoQueryResult: 4,
        editAccount: 7,
        editSettings: 8
    });

    Handler.controller('HandlerController',
        [
            '$rootScope',
            '$scope',
            '$http',
            'menuService',
            'dialogService',
            'dataGridPagingService',
            'dataGridSelectService',
            'datetimePickerService',
            'HANDLER_EVENTS',
            'HANDLER_CATEGORY_TYPE',
            'HANDLER_MENU_TYPE',
            'uiGridConstants',
            '$translate',
            '$interval',
            '$sce',
            function ($rootScope,
                      $scope,
                      $http,
                      menuService,
                      dialogService,
                      dataGridPagingService,
                      dataGridSelectService,
                      datetimePickerService,
                      HANDLER_EVENTS,
                      HANDLER_CATEGORY_TYPE,
                      HANDLER_MENU_TYPE,
                      uiGridConstants,
                      $translate,
                      $interval,
                      $sce) {

                /**
                 * Controls display state for audio player
                 * @type {boolean}
                 * @public
                 */
                $scope.showAudioPlayer = false;

                /**
                 * Controls filters display state
                 * @type {boolean}
                 * @public
                 */
                $scope.showFilters = false;

                /**
                 * Controls Wav file download display state
                 * @type {boolean}
                 * @public
                 */
                $scope.showDownloadWavFile = false;

                /**
                 * Controls Pcap file download display state
                 * @type {boolean}
                 * @public
                 */
                $scope.showDownloadPcapFile = false;

                /**
                 * Link to download Wav file
                 * @type {string}
                 * @public
                 */
                $scope.linkWavFile = '';

                /**
                 * Link to download Pcap file
                 * @type {string}
                 * @public
                 */
                $scope.linkPcapFile = '';

                /**
                 * Controls display of the show access service info query results btn
                 * @type {boolean}
                 * @public
                 */
                $scope.showQueryResultsBtn = false;

                /**
                 * Controls display of the cancel query btn
                 * @type {boolean}
                 * @public
                 */
                $scope.showCancelQueryBtn = false;

                /**
                 * Save current contral tree root
                 * 1 - List of authorized task to intercept
                 * 2 - Access service information
                 * @type {number}
                 * @public
                 */
                $scope.controlTreeRootCategoryType = 0;

                /**
                 * Current active access service info task
                 * @type {string}
                 * @public
                 */
                $scope.currentTask = '';

                /**
                 * Current active access service info query
                 * @type {string}
                 * @public
                 */
                $scope.currentQuery = '';

                /**
                 * angular tree control initialize options
                 * @type {{nodeChildren: string, dirSelectable: boolean, injectClasses: {ul: string, li: string, liSelected: string, iExpanded: string, iCollapsed: string, iLeaf: string, label: string, labelSelected: string}}}
                 * @public
                 */
                $scope.treeOptions = {
                    nodeChildren: "children",
                    dirSelectable: false,
                    injectClasses: {
                        ul: "a1",
                        li: "a2",
                        liSelected: "a7",
                        iExpanded: "a3",
                        iCollapsed: "a4",
                        iLeaf: "a5",
                        label: "a6",
                        labelSelected: "a8"
                    }
                };

                /**
                 * ui-grid initialize options
                 * @type {{enableSelectionBatchEvent: boolean, enableRowHeaderSelection: boolean, multiSelect: boolean, modifierKeysToMultiSelect: boolean, rowTemplate: string}}
                 * @public
                 */
                $scope.gridOptions = {
                    enableSelectionBatchEvent: false,
                    enableRowHeaderSelection: false,
                    multiSelect: false,
                    modifierKeysToMultiSelect: true,
                    enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                    enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
                    minimumColumnSize: 100,
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
                 * ui-grid initialize options
                 * @type {{enableSelectionBatchEvent: boolean, enableRowHeaderSelection: boolean, multiSelect: boolean}}
                 * @public
                 */
                $scope.queryGridOptions = {
                    enableSelectionBatchEvent: false,
                    enableRowHeaderSelection: false,
                    multiSelect: false,
                    columnDefs: [
                        {field: 'number', displayName: 'Assignment Number', minWidth: 100},
                        {field: 'idType', displayName: 'ID Type', minWidth: 100},
                        {field: 'id', displayName: 'ID', minWidth: 100},
                        {field: 'datetimeStarts', displayName: 'Date & Time Starts', minWidth: 100},
                        {field: 'datetimeEnds', displayName: 'Date & Time Ends', minWidth: 100},
                        {field: 'complete', displayName: 'Complete', minWidth: 100}
                    ]
                };

                /**
                 * Videogular config
                 * @type {{sources: {src: *, type: string}[], tracks: {src: string, kind: string, srclang: string, label: string, default: string}[], theme: string, plugins: {poster: string}}}
                 * @public
                 */
                $scope.audioPlayerConfig = {
                    sources: [
                        {
                            src: 'assets/audio/about_time.wav',
                            type: 'audio/x-wav'
                        }
                    ],
                    theme: '/../styles/libs/videogular-themes-default/videogular.css',
                    plugins: {
                        /*poster: 'http://www.videogular.com/assets/images/videogular.png'*/
                    }
                };

                /**
                 * Emulate data for tree
                 * @type {{category: string, tasksAmount: string, children: {taskName: string, protocolsAmount: string, children: {protocolName: string, recordsAmount: string}[]}[]}[]}
                 * @public
                 */
                $scope.handlerData = [
                    {
                        category: 'List of authorized task to intercept',
                        categoryType: 1,
                        tasksAmount: '(1)',
                        children: [
                            {
                                taskName: 'QEW-1234',
                                categoryType: 1,
                                protocolsAmount: '(2)',
                                children: [
                                    {
                                        protocolName: 'SIP',
                                        categoryType: 1,
                                        recordsAmount: '(10)'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        category: 'Access service information',
                        categoryType: 2,
                        tasksAmount: '(1)',
                        children: [
                            {
                                taskName: 'QEW-123324',
                                categoryType: 2,
                                queriesAmount: '(2)',
                                children: [
                                    {
                                        queryName: 'Query 1',
                                        categoryType: 2,
                                        recordsAmount: '(10)'
                                    },
                                    {
                                        queryName: 'Query 2',
                                        categoryType: 2,
                                        recordsAmount: '(7)'
                                    }
                                ]
                            }
                        ]
                    }
                ];

                /**
                 * Emulate table data
                 * @type {{collectedTime: string, sourceIP: string, sourcePort: string, distIP: string, distPort: string, protocolType: string, radiusUser: string, locationInfo: string, from: string, to: string, callId: string, responseCode: string, srcAudioPort: string, srcVideoPort: string, dstAudioPort: string, dstVideoPort: string, srcAudioConnection: string, dstAudioConnection: string, action: string}[]}
                 * @public
                 */
                $scope.sipData = [
                    {
                        callID: '12345',
                        callDate: '12.12.2014',
                        calledTo: '354614',
                        calledFrom: '432343',
                        duration: '3414',
                        connectDuration: '45354',
                        responseCode: '200',
                        srcAudioPort: '2434',
                        srcVideoPort: '3243',
                        dstAudioPort: '2424',
                        dstVideoPort: '3243',
                        srcAudioConnection: '',
                        dstAudioConnection: '',
                        srcVideoConnection: '',
                        dstVideoConnection: '',
                        action: 'transmition',
                        linkWavFile: 'assets/audio/about_time.wav',
                        linkPcapFile: ''
                    },
                    {
                        callID: '123456',
                        callDate: '12.12.2014',
                        calledTo: '354614',
                        calledFrom: '432343',
                        duration: '3414',
                        connectDuration: '45354',
                        responseCode: '200',
                        srcAudioPort: '2434',
                        srcVideoPort: '3243',
                        dstAudioPort: '2424',
                        dstVideoPort: '3243',
                        srcAudioConnection: '',
                        dstAudioConnection: '',
                        srcVideoConnection: '',
                        dstVideoConnection: '',
                        action: 'transmition',
                        linkWavFile: 'assets/audio/activity_unproductive.wav',
                        linkPcapFile: ''
                    },
                    {
                        callID: '1234567',
                        callDate: '12.12.2014',
                        calledTo: '354614',
                        calledFrom: '432343',
                        duration: '3414',
                        connectDuration: '45354',
                        responseCode: '200',
                        srcAudioPort: '2434',
                        srcVideoPort: '3243',
                        dstAudioPort: '2424',
                        dstVideoPort: '3243',
                        srcAudioConnection: '',
                        dstAudioConnection: '',
                        srcVideoConnection: '',
                        dstVideoConnection: '',
                        action: 'transmition',
                        linkWavFile: 'assets/audio/edison.wav',
                        linkPcapFile: ''
                    }

                ];

                /**
                 * emulate complete query data for accessing service information
                 * @type {{number: string, idType: string, id: string, datetimeStarts: string, datetimeEnds: string, complete: string}[]}
                 * @public
                 */
                $scope.queryCompleteData = [
                    {
                        number: '4242-IEF',
                        idType: 'Phone',
                        id: '242343',
                        datetimeStarts: '12.12.13 1.00PM',
                        datetimeEnds: '12.12.13 1.00PM',
                        complete: '100%'
                    }
                ];

                /**
                 * emulate not complete query data for accessing service information
                 * @type {{number: string, idType: string, id: string, datetimeStarts: string, datetimeEnds: string, complete: string}[]}
                 * @public
                 */
                $scope.queryNotCompleteData = [
                    {
                        number: '43452-HFD',
                        idType: 'Phone',
                        id: '245443',
                        datetimeStarts: '31.12.13 1.00PM',
                        datetimeEnds: '23.11.13 2.00PM',
                        complete: '80%'
                    }
                ];

                /**
                 * emulate audio file from the server with mapping id's
                 * @type {{12345: {src: string, type: string}, 123456: {src: string, type: string}, 1234567: {src: string, type: string}}}
                 * @public
                 */
                $scope.audio = {
                    12345: {
                        sources: [
                            {
                                src: 'assets/audio/about_time.wav',
                                type: 'audio/x-wav'
                            }
                        ]
                    },
                    123456: {
                        sources: [
                            {
                                src: 'assets/audio/activity_unproductive.wav',
                                type: 'audio/x-wav'
                            }
                        ]
                    },
                    1234567: {
                        sources: [
                            {
                                src: 'assets/audio/edison.wav',
                                type: 'audio/x-wav'
                            }
                        ]
                    }
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
                        }

                    }
                };

                /**
                 * Get videogular api
                 * @param {Object} audioPlayerApi
                 * @public
                 */
                $scope.onPlayerReady = function (audioPlayerApi) {
                    $scope.audioPlayerApi = audioPlayerApi;
                };

                /**
                 * Click handler for control tree node which has child nodes
                 * @param {Object} $event - click event
                 * @param {Int} categoryType - 1: list of authorized task to intercept; 2: access service information
                 * @public
                 */
                $scope.nodeClick = function ($event, categoryType) {
                    $scope.controlTreeRootCategoryType = categoryType;
                };

                /**
                 * Click handler for task number node, to show btn create query
                 * @param {Object} $event
                 * @param {Object} node
                 * @public
                 */
                $scope.taskClick = function ($event, node) {

                    //if it is access service information
                    if (node.categoryType === HANDLER_CATEGORY_TYPE.accessServiceInfo) {
                        $scope.showMenuContent(HANDLER_MENU_TYPE.btnCreateQuery); // show content only with btn create query
                        $scope.currentTask = node.taskName;
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

                    gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                        var _row = row;

                        if (_row.isSelected) {
                            if (_row.entity.linkWavFile.length) {
                                $scope.showAudioPlayer = true;
                                $scope.showDownloadWavFile = true;

                                $scope.audioPlayerApi.stop();
                                $scope.audioPlayerConfig.sources = [
                                    {
                                        src: _row.entity.linkWavFile,
                                        type: 'audio/x-wav'
                                    }
                                ];
                                $scope.linkWavFile = _row.entity.linkWavFile;
                            }
                            if (_row.entity.linkPcapFile.length) {
                                $scope.showDownloadPcapFile = true;
                                $scope.linkPcapFile = _row.entity.linkPcapFile;
                            }
                        } else {
                            $scope.audioPlayerApi.stop();
                            $scope.showAudioPlayer = false;
                            $scope.showDownloadWavFile = false;
                            $scope.showDownloadPcapFile = false;
                        }
                    });
                };


                /**
                 * Select tree node handler
                 * @param {Object} node
                 * @public
                 */
                $scope.showSelected = function (node) {

                    if (typeof node === 'undefined') {
                        $scope.showMenuContent(HANDLER_MENU_TYPE.empty);
                        return true;
                    }

                    //if it is access service information
                    if (node.categoryType === HANDLER_CATEGORY_TYPE.accessServiceInfo) {

                        $scope.currentQuery = node.queryName;

                        switch (node.queryName) {
                            case 'Query 1':
                                $scope.showQueryResultsBtn = true;
                                $scope.showCancelQueryBtn = false;
                                $scope.queryGridOptions.data = $scope.queryCompleteData;
                                break;
                            case 'Query 2':
                                $scope.showQueryResultsBtn = false;
                                $scope.showCancelQueryBtn = true;
                                $scope.queryGridOptions.data = $scope.queryNotCompleteData;
                                break;
                        }

                    }

                    switch (node.protocolName) {
                        case 'SIP':
                            $scope.gridOptions.columnDefs = [
                                {field: 'callID', displayName: 'Call ID', minWidth: 100},
                                {field: 'callDate', displayName: 'Call Date', minWidth: 100},
                                {field: 'calledTo', displayName: 'Called/To', minWidth: 100},
                                {field: 'calledFrom', displayName: 'Called/From', minWidth: 100},
                                {field: 'duration', displayName: 'Duration', minWidth: 100},
                                {field: 'connectDuration', displayName: 'Connect Duration', minWidth: 100},
                                {field: 'responseCode', displayName: 'Response Code', minWidth: 100},
                                {field: 'srcAudioPort', displayName: 'Src Audio Port', minWidth: 100},
                                {field: 'srcVideoPort', displayName: 'Src Video Port', minWidth: 100},
                                {field: 'dstAudioPort', displayName: 'Dst Audio Port', minWidth: 100},
                                {field: 'dstVideoPort', displayName: 'Dst Video Port', minWidth: 100},
                                {field: 'srcAudioConnection', displayName: 'Src Audio Connection', minWidth: 100},
                                {field: 'dstAudioConnection', displayName: 'Dst Audio Connection', minWidth: 100},
                                {field: 'srcVideoConnection', displayName: 'Src Video Connection', minWidth: 100},
                                {field: 'DstVideoConnection', displayName: 'Dst Video Connection', minWidth: 100},
                                {field: 'action', displayName: 'Action', minWidth: 100}
                            ];
                            $scope.gridOptions.data = $scope.sipData;
                            break;
                    }
                    $scope.showMenuContent($scope.controlTreeRootCategoryType);
                };

                /**
                 * Unselect selected node
                 * @public
                 */
                $scope.clearSelectedNode = function () {
                    $scope.selectedNode = undefined;
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

                    //for system menu
                    if ((index === HANDLER_MENU_TYPE.editAccount) || (index === HANDLER_MENU_TYPE.editSettings)) {

                        $scope.clearSelectedNode();
                    }

                    menuService.removeSelectedState('system-settings-menu');

                    $scope.showFilters = false;

                    //broadcast menu state change in order child controller could
                    //subscribe for this even and perform needed actions
                    $scope.$broadcast(HANDLER_EVENTS.menuStateChange);

                };

                /**
                 * Access service info model
                 * @type {{showResults: Function, createQuery: {openCreateNewQuery: boolean, dropdownsInitState: boolean, datetimePickerFrameStartService: null, datetimePickerFrameEndService: null, query: {id: string, number: string, idType: string}, initialQueryData: null, open: Function, close: Function, idTypeChange: Function, save: Function}, cancelQuery: Function}}
                 * @public
                 */
                $scope.accessServiceInfoModel = {

                    /**
                     * Displays access service info query results
                     * @public
                     */
                    showResults: function () {

                        $http.post(
                            '/',
                            {
                                taskName: $scope.currentTask,
                                queryName: $scope.currentQuery
                            }
                        ).success(function (data) {

                                var _interval = null,
                                    _data = data;

                                //emulate delete error from the server
                                /* var _data = {
                                 errors: 'Show results error happened!'
                                 };*/

                                if (_data.errors) {// if server returned errors

                                    // show error modal dialog about the errors
                                    // using here interval to make delay
                                    _interval = $interval(function () {
                                        $translate(['DIALOG.SHOW_RESULTS_SERVICE_INFO_QUERY.ERROR.TITLE', 'DIALOG.SHOW_RESULTS_SERVICE_INFO_QUERY.ERROR.OK'])
                                            .then(function (translation) {
                                                dialogService.open(
                                                    translation['DIALOG.SHOW_RESULTS_SERVICE_INFO_QUERY.ERROR.TITLE'],
                                                    _data.errors,
                                                    translation['DIALOG.SHOW_RESULTS_SERVICE_INFO_QUERY.ERROR.OK'],
                                                    '',
                                                    'error',
                                                    false);
                                                $interval.cancel(_interval);
                                            });
                                    }, 3000);

                                    $rootScope.$broadcast(HANDLER_EVENTS.accessServiceInfoQueryResultsError);

                                } else { // if server canceled query


                                    //to emulate response
                                    $scope.gridOptions.data = $scope.sipData;

                                    $scope.showMenuContent(HANDLER_MENU_TYPE.accessServiceInfoQueryResult);

                                    $rootScope.$broadcast(HANDLER_EVENTS.accessServiceInfoQueryResultsSuccess);
                                }

                            }).error(function () {

                                $rootScope.$broadcast(HANDLER_EVENTS.accessServiceInfoQueryResultsError);
                            });
                    },

                    /**
                     * Create query
                     * @public
                     */
                    createQuery: {

                        openCreateNewQuery: false,
                        dropdownsInitState: false,

                        datetimePickerFrameStartService: null,
                        datetimePickerFrameEndService: null,

                        query: {
                            id: '',
                            number: '',
                            idType: ''
                        },

                        initialQueryData: null,

                        /**
                         * Open modal window to create query
                         * @param {Object} addNewQueryAccessServiceInfoForm
                         * @public
                         */
                        open: function (addNewQueryAccessServiceInfoForm) {
                            this.datetimePickerFrameStartService = datetimePickerService.init('timeframe-starts');
                            this.datetimePickerFrameEndService = datetimePickerService.init('timeframe-ends');

                            this.dropdownsInitState = true;
                            this.openCreateNewQuery = true;

                            this.addNewQueryAccessServiceInfoForm = addNewQueryAccessServiceInfoForm;

                            this.initialQueryData = angular.copy(this.query);
                        },

                        /**
                         * Close modal window of creating query
                         * @public
                         */
                        close: function () {
                            this.datetimePickerFrameStartService.clear();
                            this.datetimePickerFrameEndService.clear();

                            this.openCreateNewQuery = false;
                            this.dropdownsInitState = false;

                            this.addNewQueryAccessServiceInfoForm.$setPristine();
                            this.addNewQueryAccessServiceInfoForm.$setUntouched();

                            this.query = angular.copy(this.initialQueryData);

                            menuService.removeSelectedState('id-type-dropdown');
                        },

                        /**
                         * Id type change handler
                         * @param {String} type
                         * @public
                         */
                        idTypeChange: function (type) {
                            this.query.idType = type;
                        },

                        /**
                         * Save query
                         * @public
                         */
                        save: function () {

                            var _interval = null,
                                _this = this;

                            $http.post(
                                '/',
                                {
                                    number: _this.query.number,
                                    timeFrameStarts: _this.datetimePickerFrameStartService.getDateTime(),
                                    timeFrameEnds: _this.datetimePickerFrameEndService.getDateTime(),
                                    idType: _this.query.idType,
                                    id: _this.query.id
                                }
                            ).success(function (data) {

                                    //to emulate error from the server
                                    var _data = {
                                        errors: 'Add new query error happened'
                                    };

                                    //errors came from the server
                                    if (_data.errors) {

                                        // show error modal dialog about the errors
                                        // using here interval to make delay
                                        _interval = $interval(function () {
                                            $translate(['DIALOG.CREATE_QUERY_ACCESS_SERVICE_INFO.ERROR.TITLE', 'DIALOG.CREATE_QUERY_ACCESS_SERVICE_INFO.OK'])
                                                .then(function (translation) {
                                                    dialogService.open(
                                                        translation['DIALOG.CREATE_QUERY_ACCESS_SERVICE_INFO.ERROR.TITLE'],
                                                        _data.errors,
                                                        translation['DIALOG.CREATE_QUERY_ACCESS_SERVICE_INFO.OK'],
                                                        '',
                                                        'error',
                                                        false);
                                                    $interval.cancel(_interval);
                                                });
                                        }, 3000);

                                        $rootScope.$broadcast(HANDLER_EVENTS.createQueryAccessServiceInfoError);

                                    } else { //server return success for creation new query to access service info

                                        $scope.handlerData[1].children.forEach(function (arrElement, index) {
                                            if (arrElement.taskName === $scope.currentTask) {
                                                $scope.handlerData[1].children[index].children.push(_data.result);
                                                return true;
                                            }
                                        });

                                        $rootScope.$broadcast(HANDLER_EVENTS.createQueryAccessServiceInfoSuccess);
                                    }

                                }).error(function () {

                                    $rootScope.$broadcast(HANDLER_EVENTS.createQueryAccessServiceInfoError);
                                });

                            this.close();

                        }

                    },

                    /**
                     * Cancel query for access service information
                     * @public
                     */
                    cancelQuery: function () {
                        /**
                         * Remove request to the server
                         * @private
                         */
                        var _removeRequest = function () {

                            $http.post(
                                '/',
                                {
                                    taskName: $scope.currentTask,
                                    queryName: $scope.currentQuery
                                }
                            ).success(function (data) {

                                    var _interval = null,
                                        _data = data;

                                    //emulate delete error from the server
                                    /* var _data = {
                                     errors: 'Cancel query error happened!'
                                     };*/

                                    if (_data.errors) {// if server returned errors

                                        // show error modal dialog about the errors
                                        // using here interval to make delay
                                        _interval = $interval(function () {
                                            $translate(['DIALOG.CANCEL_SERVICE_INFO_QUERY.ERROR.TITLE', 'DIALOG.CANCEL_SERVICE_INFO_QUERY.ERROR.OK'])
                                                .then(function (translation) {
                                                    dialogService.open(
                                                        translation['DIALOG.CANCEL_SERVICE_INFO_QUERY.ERROR.TITLE'],
                                                        _data.errors,
                                                        translation['DIALOG.CANCEL_SERVICE_INFO_QUERY.ERROR.OK'],
                                                        '',
                                                        'error',
                                                        false);
                                                    $interval.cancel(_interval);
                                                });
                                        }, 3000);

                                        $rootScope.$broadcast(HANDLER_EVENTS.accessServiceInfoQueryCancelError);

                                    } else { // if server canceled query

                                        var _index = 0;
                                        $scope.handlerData[1].children.forEach(function (arrElement, index) {
                                            if (arrElement.taskName === $scope.currentTask) {
                                                _index = index;
                                                $scope.handlerData[1].children[index].children.forEach(function (arrElement, index) {
                                                    if (arrElement.queryName === $scope.currentQuery) {
                                                        $scope.handlerData[1].children[_index].children.splice(index, 1);
                                                        return true;
                                                    }
                                                });
                                                return true;
                                            }
                                        });

                                        $scope.showMenuContent(HANDLER_MENU_TYPE.empty);

                                        $rootScope.$broadcast(HANDLER_EVENTS.accessServiceInfoQueryCancelSuccess);
                                    }

                                }).error(function () {

                                    $rootScope.$broadcast(HANDLER_EVENTS.accessServiceInfoQueryCancelError);
                                });
                        };

                        // show remove confirmation dialog
                        $translate(['DIALOG.CANCEL_SERVICE_INFO_QUERY.TITLE',
                            'DIALOG.CANCEL_SERVICE_INFO_QUERY.BODY',
                            'DIALOG.CANCEL_SERVICE_INFO_QUERY.OK',
                            'DIALOG.CANCEL_SERVICE_INFO_QUERY.CANCEL'])
                            .then(function (translation) {
                                dialogService.open(
                                    translation['DIALOG.CANCEL_SERVICE_INFO_QUERY.TITLE'],
                                    translation['DIALOG.CANCEL_SERVICE_INFO_QUERY.BODY'],
                                    translation['DIALOG.CANCEL_SERVICE_INFO_QUERY.OK'],
                                    translation['DIALOG.CANCEL_SERVICE_INFO_QUERY.CANCEL'],
                                    '',
                                    true,
                                    _removeRequest);
                            });
                    }

                };

                /**
                 * Toggle filters state
                 * @public
                 */
                $scope.toggleFilters = function () {
                    $scope.showFilters = $scope.showFilters ? false : true;
                };


                $scope.filterModel = {

                    filter: {},
                    filterInitState: angular.copy(this.filter),

                    /**
                     * Send query to filter dataset
                     * @param {Int} filterFor
                     * @public
                     */
                    applyFilters: function (filterFor) {
                        var _this = this,
                            _filterFor = filterFor || 0;

                        $http.post(
                            '/',
                            {
                                filter: _this.filter,
                                filterFor: _filterFor
                            }
                        ).success(function (data) {

                                var _interval = null,
                                    _data = data;

                                //emulate error from the server
                                /* var _data = {
                                 errors: 'Filter query error happened!'
                                 };*/

                                if (_data.errors) {// if server returned errors

                                    // show error modal dialog about the errors
                                    // using here interval to make delay
                                    _interval = $interval(function () {
                                        $translate(['DIALOG.FILTER_QUERY.ERROR.TITLE', 'DIALOG.FILTER_QUERY.ERROR.OK'])
                                            .then(function (translation) {
                                                dialogService.open(
                                                    translation['DIALOG.FILTER_QUERY.ERROR.TITLE'],
                                                    _data.errors,
                                                    translation['DIALOG.FILTER_QUERY.ERROR.OK'],
                                                    '',
                                                    'error',
                                                    false);
                                                $interval.cancel(_interval);
                                            });
                                    }, 3000);

                                    $rootScope.$broadcast(HANDLER_EVENTS.filterQueryError);

                                } else { // if server return filtered data

                                    switch (filterFor) {
                                        case HANDLER_CATEGORY_TYPE.authorizedTaskIntercept:
                                            $scope.gridOptions.data = _data;
                                            break;
                                        case HANDLER_CATEGORY_TYPE.accessServiceInfo:
                                            $scope.queryGridOptions.data = _data;
                                            break;
                                    }

                                    $rootScope.$broadcast(HANDLER_EVENTS.filterQuerySuccess);
                                }

                            }).error(function () {

                                $rootScope.$broadcast(HANDLER_EVENTS.filterQueryError);
                            });
                    },

                    /**
                     * Reset to initial state of the filters
                     * @public
                     */
                    resetFilters: function () {
                        this.filter = angular.copy(this.filterInitState);
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