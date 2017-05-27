/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyBSj2AYyQKihCXBNHm1rqxG9U_T5pShk-8",
    authDomain: "trainscheduler-dbc8c.firebaseapp.com",
    databaseURL: "https://trainscheduler-dbc8c.firebaseio.com",
    projectId: "trainscheduler-dbc8c",
    storageBucket: "trainscheduler-dbc8c.appspot.com",
    messagingSenderId: "681407381839"
};

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var tName = $("#train-name-input").val().trim();
  var tDest = $("#destination-input").val().trim();
  var tTime = moment($("#firstTime-input").val().trim(), "HH:mm a").format("X");
  var tFreq = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding employee data
  var newTrain = {
    name: tName,
    dest: tDest,
    time: tTime,
    freq: tFreq
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.dest);
  console.log(newTrain.time);
  console.log(newTrain.freq);

  // Alert
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#firstTime-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var tName = childSnapshot.val().name;
  var tDest = childSnapshot.val().dest;
  var tTime = childSnapshot.val().time;
  var tFreq = childSnapshot.val().freq;

  // Train Info
  console.log(tName);
  console.log(tDest);
  console.log(tTime);
  console.log(tFreq);

  
  // Calculate the next train from time now
  // To calculate the time
  var trainStartPretty = moment.unix(tTime).format("HH:mm");
  
  var tTimeConv = moment(tTime, "X").subtract(1, "years");
  
  //current time
  var currentTime = moment();
  console.log("current time: " + moment(currentTime).format("HH:mm"));
  
  //difference between times
  var diffT = moment().diff(moment(tTimeConv), "minutes");
  console.log("difference in time: " + diffT);

  //time apart
  var tRemainder = diffT % tFreq;
  console.log(tRemainder);

  //minutes till next train
  var minAway = tFreq - tRemainder;
  console.log("minutes till next train: " + minAway);

  //next train
  var nextTrain = moment().add(minAway, "minutes");
  console.log("arrival time: " + moment(nextTrain).format("HH:mm a"));


  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDest + "</td><td>" +
  tFreq + "</td><td>" + nextTrain + "</td><td>" + minAway + "</td></tr>");
});