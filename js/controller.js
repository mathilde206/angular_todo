angular.module('RouteControllers', [])
    .controller('HomeController', function($scope, $location) {
        $scope.title = "Welcome To Mathilde's Angular Todo!";

        $scope.gotoTodo = function() {
            $location.path("/todo");
        }
    })

    .controller('RegisterController', function($scope, UserAPIService, store, $location) {
 
        $scope.registrationUser = {};
        var URL = "https://morning-castle-91468.herokuapp.com/";
 
        $scope.login = function() {
            UserAPIService.callAPI(URL + "accounts/api-token-auth/", $scope.data).then(function(results) {
                $scope.token = results.data.token;
                store.set("username", $scope.registrationUser.username);
                store.set("authToken", $scope.token);
                store.set("LoggedIn", true);
                $location.path("/todo");
            }).catch(function(err) {
                console.log(err.data);
            });
        };
 
        $scope.submitForm = function() {
            if ($scope.registrationForm.$valid) {
                $scope.registrationUser.username = $scope.user.username;
                $scope.registrationUser.password = $scope.user.password;
 
                UserAPIService.callAPI(URL + "accounts/register/", $scope.registrationUser).then(function(results) {
                    $scope.data = results.data;
                    $scope.login();
                }).catch(function(err) {
                    alert("Oops! Something went wrong!");
                    console.log(err);
                });
            }
        };
    })

    .controller('LoginController', function($scope, UserAPIService, store, $location) {

        $scope.loginUser = {};
        var URL = "https://morning-castle-91468.herokuapp.com/";
 
        $scope.submitForm = function() {
            if ($scope.loginForm.$valid) {
                $scope.loginUser.username = $scope.user.username;
                $scope.loginUser.password = $scope.user.password;
 
                UserAPIService.callAPI(URL + "accounts/api-token-auth/", $scope.loginUser).then(function(results) {
                    $scope.token = results.data.token;
                    store.set("username", $scope.loginUser.username);
                    store.set("authToken", $scope.token);
                    store.set("LoggedIn", true);
                    $location.path("/todo");
                }).catch(function(err) {
                    console.log(err.data);
                });
            }
        };
    })

    .controller('TodoController', function($scope, $location, TodoAPIService, store) {
        $scope.LoggedIn = store.get("LoggedIn");

        if ($scope.LoggedIn === false) {
        $location.path("/accounts/register");
        } else {
        var URL = "https://morning-castle-91468.herokuapp.com/";

         $scope.editTodo = function(id) {
            $location.path("/todo/edit/" + id);
        };
 
        $scope.deleteTodo = function(id) {
            TodoAPIService.deleteTodo(URL + "todo/" + id, $scope.username, $scope.authToken).then(function(results) {
            console.log(results);

            TodoAPIService.getTodos(URL + "todo/", $scope.username, $scope.authToken).then(function(results) {
                $scope.todos = results.data || [];
                console.log($scope.todos);
            }).catch(function(err) {
                console.log(err);
            });
        }).catch(function(err) {
                console.log(err);
        });
    };
    } 
        $scope.authToken = store.get('authToken');
        $scope.username = store.get('username');
 
        $scope.todos = [];
 
        TodoAPIService.getTodos(URL + "todo/", $scope.username, $scope.authToken).then(function(results) {
            $scope.todos = results.data || [];
            console.log($scope.todos);
        }).catch(function(err) {
            console.log(err);
        });

        $scope.submitForm = function() {
            if ($scope.todoForm.$valid) {
                $scope.todo.username = $scope.username;
                $scope.todos.push($scope.todo);
 
                TodoAPIService.createTodo(URL + "todo/", $scope.todo, $scope.authToken).then(function(results) {
                    console.log(results);
                }).catch(function(err) {
                    console.log(err);
                });

                TodoAPIService.getTodos(URL + "todo/", $scope.username, $scope.authToken).then(function(results) {
                    $scope.todos = results.data || [];
                    console.log($scope.todos);
                }).catch(function(err) {
                    console.log(err);
                });

                $("#close").trigger("click");
            }
        };

    })

    .controller('EditTodoController', function($scope, $location, $routeParams, TodoAPIService, store) {
        var id = $routeParams.id;
        var URL = "https://morning-castle-91468.herokuapp.com/";

        TodoAPIService.getTodos(URL + "todo/" + id, $scope.username, store.get('authToken')).then(function(results) {
            $scope.todo = results.data;
        }).catch(function(err) {
            console.log(err);
        });
 
        $scope.submitForm = function() {
            if ($scope.todoForm.$valid) {
                $scope.todo.username = $scope.username;
 
                TodoAPIService.editTodo(URL + "todo/" + id, $scope.todo, store.get('authToken')).then(function(results) {
                    $location.path("/todo");
                }).catch(function(err) {
                    console.log(err);
                });
            }
        };
    })


    .controller('NavBarController', function($scope, store) {
        $scope.name = store.get("username");
        $scope.LoggedIn = store.get("LoggedIn");

        $scope.logout = function() {
            store.remove("authToken");
            store.remove("username");
            store.set("LoggedIn", false);
        };
    });


    

    

