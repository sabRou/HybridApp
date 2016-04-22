angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}])


.factory('DBA', function($cordovaSQLite, $q, $ionicPlatform) {
    var self = this;

    // Handle query's and potential errors
    self.query = function (query, parameters) {
        parameters = parameters || [];
        var q = $q.defer();

        $ionicPlatform.ready(function () {
            $cordovaSQLite.execute(db, query, parameters)
                .then(function (result) {
                    q.resolve(result);
                }, function (error) {
                    console.warn('I found an error');
                    console.warn(error);
                    q.reject(error);
                });
        });
        return q.promise;
    }

    // Proces a result set
    self.getAll = function(result) {
        var output = [];

        for (var i = 0; i < result.rows.length; i++) {
            console.log("retrieved row: "+ result.rows.item(i));
            output.push(result.rows.item(i));
        }
        return output;
    }

    // Proces a single result
    self.getById = function(result) {
        var output = null;
        output = angular.copy(result.rows.item(0));
        return output;
    }

    return self;
})

.factory('Account', function($cordovaSQLite, DBA) {
        var self = this;

        self.all = function() {
            return DBA.query("SELECT * FROM UserAccount")
                .then(function(result){
                    return DBA.getAll(result);
                });
        }

        self.get = function(userId) {
            var parameters = [userId];
            return DBA.query("SELECT id, email FROM account WHERE id = (?)", parameters)
                .then(function(result) {
                    return DBA.getById(result);
                });
        }

        self.getByEmail = function(userId) {
            var parameters = [userId];
            return DBA.query("SELECT id, email FROM account WHERE id = (?)", parameters)
                .then(function(result) {
                    return DBA.getById(result);
                });
        }

        self.add = function(user) {
            var parameters = [user.email, user.password , user.authToken, user.confirmed];
            return DBA.query("INSERT INTO UserAccount (email,password, authToken, confirmed, isLoggedIn, isBound) VALUES (?,?,?,?,1,0)", parameters);
        }

        self.remove = function(account) {
            var parameters = [account.id];
            return DBA.query("DELETE FROM account WHERE id = (?)", parameters);
        }

        self.update = function(origMember, editMember) {
            var parameters = [editMember.id, editMember.email, origMember.id];
            return DBA.query("UPDATE account SET id = (?), email = (?) WHERE id = (?)", parameters);
        }
        self.updateToBound = function(origMember, bound) {
            var parameters = [bound, origMember.email];
            return DBA.query("UPDATE UserAccount SET isBound = (?) WHERE email = (?)", parameters);
        }

        return self;

    })


