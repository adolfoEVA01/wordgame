gameApp.controller("guessGameController", function($scope)
	{
	$scope.appTitle = "WELCOME TO THE GUESS GAME!";
		$scope.gameTitle = "The Guess Game"; //Title for that describre it for the pages
	});

//Game Control
gameApp.controller('wordController', function($scope, $http)
{
	$scope.guess = '';
	$scope.guesses = [];
	$scope.guessed= '';
	$scope.allowed = 6;
	$scope.wordToGuess = "Just";
	$scope.guestGuess = "";
	$scope.scoreData = {};
	$scope.userName ="";
    $scope.success = "";
	// Angular set up to run the game
	$scope.pushGuess = function () {
		$scope.guesses.push($scope.guestGuess);
		$scope.guessed = $scope.guesses.length;
		$scope.resetGuess();
		$scope.$apply(); //Pushes angular to reset the guess window
	};

	// Reset the guess window
	$scope.resetGuess = function() {
		$scope.guestGuess = '';
	};

	$scope.addGuess = function()
	{
		// Checks if the text window is empty
		if ($scope.guestGuess === null || $scope.guestGuess === '')
		{
			$("input[type=text]").ready(function () { $("#guessEntry").addClass("has-error"); });
			$("#guessStatus").removeClass("glyphicon glyphicon-thumbs-down form-control-feedback");
			$("#guessStatus").addClass("glyphicon glyphicon-remove form-control-feedback");
			$scope.result = "   Please enter a guess\n\nDon't leave the box empty.";
			alert($scope.result);
		}

		// If the guess is correct
		else if ($scope.guestGuess.toLowerCase() == $scope.wordToGuess.toLowerCase())
		{
			$("input[type=text]").ready(function () { $("#guessEntry").removeClass("has-warning").removeClass("has-error").addClass("has-success has-feedback"); });
			$("#guessStatus").removeClass("glyphicon glyphicon-thumbs-down form-control-feedback").removeClass("glyphicon glyphicon-remove form-control-feedback");
			$("#guessStatus").addClass("glyphicon glyphicon-thumbs-up form-control-feedback");
			$scope.pushGuess(guestGuess);
			$scope.result = "You have guessed the correct word. Way to go!\n\n\t\t       The word was: ";
            $scope.success = "true";
			alert($scope.result + $scope.wordToGuess);
			$scope.resetGuess();
		}	

		// If the guess s incorrect and the user still have guesses left
		else if ($scope.guestGuess != $scope.wordToGuess & ($scope.allowed - $scope.guessed) > 1)
		{
			$("input[type=text]").ready(function () { $("#guessEntry").removeClass("has-error").addClass("has-warning"); });
			$("#guessStatus").removeClass("glyphicon glyphicon-remove form-control-feedback").addClass("glyphicon glyphicon-thumbs-down form-control-feedback");
			$scope.pushGuess(guestGuess);
			$scope.result = "Please try again!";	
			alert($scope.result);
		}

		// If the guess is incorrect and the user has run put of guesses
		else if (($scope.allowed - $scope.guessed) <= 1)
		{
			$("input[type=text]").ready(function () { $("#guessEntry").removeClass("has-warning").addClass("has-error"); });
			$("#guessStatus").removeClass("glyphicon glyphicon-thumbs-down form-control-feedback");
			$("#guessStatus").addClass("glyphicon glyphicon-remove form-control-feedback");
			$scope.guesses.push($scope.guestGuess);
			$scope.guessed = $scope.guesses.length;
            $scope.success = "false";
			$scope.result = "Game over! The word was: ";	
			alert($scope.result + $scope.wordToGuess);
		}
		
		$scope.guess = '';
	};

	// SERVICE: Angular set up to see, save and delete scores
	// GET =====================================================================
	// when landing on the page, get all SCORES and show them
	// use the service to get all the scores
    $scope.getScores = function ()
    {
		$http.get('/api/scores')
		.success(function (goodData) {
			console.log("Getting Scores");

			$scope.scores = goodData;
            console.log(goodData);
        })
	
		.error(function (guessed) {
			console.log('Error: ' + guessed);
		});
	}
	
	// CREATE SCORES ==================================================================
	// When submitting the add form, send the text to the node API
	$scope.createScore = function() 
	{
        $scope.scoreData.attempts = $scope.guessed;
        $scope.scoreData.guessed = $scope.success;
//        console.log($scope.scoreData);
		$http.post('/api/scores', $scope.scoreData)
		.success(function(goodData)
		{
			$scope.scoreData = {}; // clear the form so our user is ready to enter another
			$scope.scores = "User " + $scope.scoreData.userName + " took " + $scope.guessed + " guess(es) to guess the word " + $scope.wordToGuess;
			//$scope.scores = goodData;
			//goodData = "User " + $scope.userName + " took " + $scope.allowed + " to guess the word" + $scope.wordToGuess;
//			console.log(goodData);
		})
		
		.error(function(guessed)
		{
			console.log('Error: ' + guessed);
		});
	};
	
	// DELETE SCORES ==================================================================
	// delete a score after checking it	
	$scope.deleteScore = function(id)
	{
		$http.delete('/api/scores/' + id)
		.success(function(goodData)
		{
			console.log("Deleting Score");
			$scope.scores = goodData;
			console.log(goodData);
		})

		.error(function(guessed)
		{
			console.log('Error: ' + guessed);
		});
	};
});

gameApp.directive('customButton', function () 
{ 
	return { 
		restrict: 'E',
		replace: true,
		transclude: true,
		templateUrl: 'customTemplate.html',
		link: function (scope, element, attrs)
 	  	{
			element.bind("click", scope.addGuess);
		}
	};
});

// Routing functionality
gameApp.config(function($stateProvider, $urlRouterProvider)
{
	$urlRouterProvider.otherwise('play'); //If gibberish or nothing enter after the intial '/ ' then the play page will be displayed.

    $stateProvider
	//Home States in Nested Views
	.state('play', {
		url: '/play',
		templateUrl: 'game.html',
	})
	.state('scores', {
		url: '/scores',
		templateUrl: 'scores.html'
	})
	.state('about', {
		url: '/about',
		templateUrl: 'about.html'
	});
});