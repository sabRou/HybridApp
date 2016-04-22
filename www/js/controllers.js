angular.module('app.controllers', [])

    .controller('pageCtrl', function(Account) {

    })

    .controller('createAccountController', function($http, Account, $state) {
        // this.alertMessage = " Enter you credentials ";

        console.log("rest api to: " + backendServerUrl);
        this.signup = function(email,password) {
            console.log("sign up function called: " + backendServerUrl);
            var params = {
                'email': email,
                'username':email,
                'userPassword':password,
                'passkey':"4mobile!" ,
                'appId':'cordova-ionic-sbr',
                'appType': 'StaytusDev',
                'userType':0,
                'lang' : 'en'
            };
            console.log("output: " + JSON.stringify(params));
            var res = $http.put(backendServerUrl+'/mobile/register',  params
            );
            res.success(function(data){
                this.result = data;
                // this.alertMessage = "You are Signed up!";
                console.log("success register: " + JSON.stringify(data));
                var user =[];
                user.email = email;
                user.password = password;
                user.authToken = data.authToken;
                user.confirmed = data.emailConfirmed;
                user.isLoggedIn = 1;
                if(Account.add(user)) {
                    currentUser = user;
                    $state.go('unlock');

                }

            });
            res.error(function(data, status, headers, config){
                this.alertMessage = "Cannot sign up!";
                console.log(this.alertMessage +" failure register: " + JSON.stringify(data));
                alert("Cannot sign up! "+ data.message);
            });

        }

    })

    .controller('signInController', function($http,$state, Account) {
        console.log("sign in function called: " + backendServerUrl);

        this.signin = function(email,password) {
            var params = {
                'email': email,
                'username':email,
                'userPassword':password,
                'passkey':"4mobile!" ,
                'appId':'cordova-ionic-sbr',
                'appType': 'StaytusDev',
                'userType':0,
                'lang' : 'en'
            };
            console.log("output: " + JSON.stringify(params));
            var res = $http.put(backendServerUrl+'/mobile/authenticate',  params
            );
            res.success(function(data){
                this.result = data;
                // this.alertMessage = "You are Signed up!";
                console.log("success signin: " + JSON.stringify(data));
                var user =[];
                user.email = email;
                user.password = password;
                user.authToken = data.authToken;
                user.confirmed = data.emailConfirmed;
                user.isLoggedIn = 1;
                if(Account.add(user)) {
                    currentUser = user;
                    $state.go('unlock');
                }

            });
            res.error(function(data, status, headers, config){
                this.alertMessage = "Cannot sign in!";
                console.log(this.alertMessage +" failure signin: " + JSON.stringify(data));
                alert("Cannot sign in! "+ data.message);
            });
        }

    })

    .controller('unlockController', function($http,$state, Account, $ionicHistory) {
        console.log("unlock with staytusKey for user: " + currentUser.email +" with authToken: "+ currentUser.authToken);
        this.unlock = function(key){
            var params = {
                'staytusKey': this.unlockKey,
                'authToken': currentUser.authToken
            };

            console.log("output: " + JSON.stringify(params));
            var res = $http.put(backendServerUrl+'/mobile/bind',  params,
                {
                    //headers:{
                    //    'User-Agent': {"appVersion":"0.1", "sysVersion":"undefined", "model":"browser", "lang":"fr","pushEnabled":"false"}
                    //}
                }
            );
            res.success(function(data){
                console.log("update user: " + currentUser.email +" with authToken: "+ currentUser.authToken);
                Account.updateToBound(currentUser,1);
                currentFeed = data;
                currentFeed.lastUpdate = new Date();
                console.log("after unlock, data: "+  JSON.stringify(data));
                $ionicHistory.nextViewOptions({
                    disableBack : true
                });
                $state.go('timely-tips');
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();

            });
            res.error(function(data,status,headers,config){
                console.log(" failure unlock: " + JSON.stringify(data));
                alert("Wrong Staytus Key! "+ data.message);
            });
        }
    })

    .controller('timelyTipsController', function($scope,$ionicLoading, $sce, $ionicSlideBoxDelegate, $http,$state, Account, $ionicHistory){
        this.CMSServerUrl = "https://nextgen.sweetbeam.net";
        var leatestUpdate = new Date();
        console.log("timely tips reloaded");

        leatestUpdate.setMinutes(leatestUpdate.getMinutes() - 10);
            if(!currentFeed || currentFeed.lastUpdate < leatestUpdate) {
                $ionicLoading.show({
                    noBackdrop: true,
                    template: '<p class="">Loading<ion-spinner icon="dots"/></p>'

                });
                var res = $http.get(backendServerUrl + '/mobile/feed',
                    {
                        headers: {
                            'authToken': currentUser.authToken
                        }
                    }
                );
                res.success(function (data) {
                    console.log("update user: " + currentUser.email + " with authToken: " + currentUser.authToken);
                    currentFeed = data;
                    currentFeed.lastUpdate = new Date();
                    this.feed = currentFeed;
                    this.activeTip = currentFeed.cards[0];

                    $ionicLoading.hide();
                    console.log("after get feed");//, data: " + JSON.stringify(data));
                    $state.reload();

                });
                res.error(function (data, status, headers, config) {
                    $ionicLoading.hide();
                    currentFeed = null;
                    $state.go('unlock');
                });
            }
        //}


        if(currentFeed) {
            this.feed = currentFeed;
            this.activeTip = currentFeed.cards[0];
            console.log("current tip: " + this.activeTip.title);
            this.tipColorStyle = {color: this.activeTip.color};
            angular.element(document.querySelector('.slider-pager-page.active')).css('color', this.activeTip.color);
        }
        this.replaceBackline = function (text) {
            var newText = text.split("\\n").join("<br />");
            return $sce.trustAsHtml(newText);
        }

        this.slideChanged = function (index) {
            this.activeTip = currentFeed.cards[index];
            this.tipColorStyle = {color: this.activeTip.color};
            console.log("Active tip: " + this.activeTip.title);
            angular.element(document.querySelector('.slider-pager-page.active')).css('color', this.activeTip.color);

        }
    })