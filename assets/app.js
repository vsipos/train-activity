// Initialize Firebase
var config = {
    apiKey: "AIzaSyDnoDdKbs0nGh_otJEZ8K7yM_5c2Nc5VgI",
    authDomain: "traintimer-a8ac8.firebaseapp.com",
    databaseURL: "https://traintimer-a8ac8.firebaseio.com",
    projectId: "traintimer-a8ac8",
    storageBucket: "traintimer-a8ac8.appspot.com",
    messagingSenderId: "67831653971"
  };
  
  firebase.initializeApp(config);
  
  var database = firebase.database();

  // Button for adding the trains
$('#submitButton').on('click', function(){
	// Get user input from HTML
	var trainName = $('#trainNameInput').val().trim();
	var destination = $('#destinationInput').val().trim();
	var firstTime = moment($('#timeInput').val().trim(), "HH:mm").format(""); // MomentJS
    var frequency = $('#frequencyInput').val().trim();
    
    // Creates local object holder for train times - converts known variables to db "holders" - still not sure why
	var newTrains = {
		name: trainName,
		tdestination: destination,
		tFirst: firstTime,
		tfreq: frequency,
	}

	// Uploads the train data to the firebase database
    database.ref().push(newTrains);

    // Logs to the console
	 console.log(newTrains.name);
	 console.log(newTrains.tdestination);
	 console.log(newTrains.tFirst);
	 console.log(newTrains.tfreq);

	// Alert
    alert("Train has been successfully added to the table!");
    
    // Clears all of the text boxes in the HTML
	$('#trainNameInput').val("");
	$('#destinationInput').val("");
	$('#timeInput').val("");
	$('#frequencyInput').val("");

	return false;
});

// When a new item is added (child) do this function 
database.ref().on("child_added", function(childSnapshot, prevChildKey){

	 console.log(childSnapshot.val());

	// Store everything into a variable
	var trainName = childSnapshot.val().name;
	var destination = childSnapshot.val().tdestination;
	var firstTime = childSnapshot.val().tFirst;
    var frequency = childSnapshot.val().tfreq;
    
    // Console Log Train Info
	 console.log(trainName);
	 console.log(destination);
	 console.log(firstTime);
     console.log(frequency);
     
     // Convert first time (push back 1 year to make sure it comes before current time)
	var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years"); // MomentJS
     console.log(firstTimeConverted);
     
     // Current time using MomentJS
	var currentTime = moment(); // MomentJS
     console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm")); // MomentJS
     
     // Difference between the times
	var diffTime = moment().diff(moment(firstTimeConverted), "minutes"); // MomentJS
     console.log("DIFFERENCE IN TIME: " + diffTime);
     
     // Time apart (remainder)
	var tRemainder = diffTime % frequency;
     console.log(tRemainder);
     
     // Minute until train arrives
	var tMinutesTillTrain = frequency - tRemainder;
     console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
     
     // Next train
	var nextTrain = moment().add(tMinutesTillTrain, "minutes"); // MomentJS
	var nextTrainConverted = moment(nextTrain).format("hh:mm a"); // MomentJS
     console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm")); // MomentJS
     
     // Add each trains data into the HTML table
	$("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + "Every " + frequency + " minutes" + "</td><td>" + nextTrainConverted + "</td><td>" + tMinutesTillTrain + "</td></tr>");

});

