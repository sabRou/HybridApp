angular.module('app.routes', [])

    .config(function($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            .state('page', {
                url: '/page1',
                templateUrl: 'templates/page.html',
                controller: 'pageCtrl'
            })

            .state('createAccount', {
                url: '/page2',
                templateUrl: 'templates/cREATEACCOUNT.html',
                controller: 'createAccountController as createAccountCtrl'
            })

            .state('signInAccount', {
                url: '/page3',
                templateUrl: 'templates/sIGNINTOACCOUNT.html',
                controller: 'signInController as signInCtrl'
            })

            .state('unlock', {
                url: '/page4',
                templateUrl: 'templates/unlock.html',
                controller: 'unlockController as unlockCtrl'
            })

            .state('timely-tips', {
                url: '/page5',
                templateUrl: 'templates/timely-tips.html',
                controller: 'timelyTipsController as tipsCtrl',
                cache: false
            })

        $urlRouterProvider.otherwise('/page1')



    });