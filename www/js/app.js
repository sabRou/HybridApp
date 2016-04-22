// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

// Database instance
var db;
var backendServerUrl = "https://staytusdev.sweetbeam.net";
var passkey = "4mobile!";
var appId = "staytus";
var currentUser, currentFeed;

angular.module('app', ['ionic', 'ngCordova', 'app.controllers', 'app.routes', 'app.services', 'app.directives'])

    .run(function($ionicPlatform, $cordovaSQLite, Account,$state) {

        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                if (ionic.Platform.isAndroid()) {
                    StatusBar.backgroundColorByHexString("#000000");
                } else if(ionic.Platform.isIOS()) {
                    StatusBar.styleLightContent();
                } else {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }
            }

            cordova.plugins.certificates.trustUnsecureCerts(true);

            // Important!!
            //
            // Instantiate database file/connection after ionic platform is ready.
            //
            if (window.cordova) {
                db = $cordovaSQLite.openDB({ name: "staytus.db", location:'default' }); //device
            }else{
                db = window.openDatabase("staytus.db", '1', 'staytus', 1024 * 1024 * 100); // browser
            }
            //db = $cordovaSQLite.openDB("staytus.db");

            //$cordovaSQLite.execute(db, 'DELETE FROM account');
            //$cordovaSQLite.execute(db, "DELETE FROM SQLITE_SEQUENCE WHERE name ='account'");

            $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS UserAccount (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, authToken TEXT, confirmed INTEGER, isBound INTEGER, isLoggedIn INTEGER)');

            $cordovaSQLite.execute(db, 'SELECT * FROM UserAccount')
                .then(function(result) {
                    if(result.rows.length > 0) {
                        res = result.rows.item(0);
                        console.log("res: " + res.email);
                        currentUser = res;
                        if(currentUser.isBound){
                            $state.go("timely-tips");
                        }
                        else if(currentUser.isLoggedIn){
                            console.log("user token" + currentUser.authToken);
                            $state.go("unlock");
                        }
                    }
                }
            )

        });
    })