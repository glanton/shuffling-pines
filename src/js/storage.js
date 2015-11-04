// service for updating the localStorage guest list
angular.module("shuffling")
  .service("StorageService", ["DefaultGuests", function(DefaultGuests){

  var svc = this;
  svc.guests = [];

  // function to save all changes to guests
  svc.saveGuests = function () {
    localStorage.setItem("guestList", JSON.stringify(svc.guests));
  };

  // function to return current guest list from localStorage
  svc.getGuests = function () {

    storageGuestList = JSON.parse(localStorage.getItem("guestList"));

    // update guest list; if empty fill storage list with default guests
    if (storageGuestList) {
      // convert date strings into Date objects
      for (var i = 0; i < storageGuestList.length; i++) {
        storageGuestList[i].transitionDate = new Date(storageGuestList[i].transitionDate);
      }
      svc.guests = storageGuestList;
    } else {
      svc.guests = DefaultGuests;
      svc.saveGuests();
    }
  };

  // update the guest list when the application starts
  svc.getGuests();
  console.log(svc.guests);

  // function to add a new guest to localStorage
  svc.addGuest = function (guest) {
    svc.guests.push(guest);
    svc.saveGuests();
  };

  // function to remove a guest from localStorage
  svc.removeGuest = function (index) {
    svc.guests[index].deleted = true;
    svc.saveGuests();
  };
}]);


// data to initialize the guest list with in case it's empty
angular.module("shuffling").value("DefaultGuests", [
  {
    guestName: "Jon Snow",
    transitionDate: new Date("11/14/2015"),
    pickupOrDropoff: "pickup",
    pickDropLocation: "The Wall",
    deleted: false
  },
  {
    guestName: "Tony Stark",
    transitionDate: new Date("11/16/2015"),
    pickupOrDropoff: "dropoff",
    pickDropLocation: "Stark Industries",
    deleted: false
  },
  {
    guestName: "Chani Kynes",
    transitionDate: new Date("11/17/2015"),
    pickupOrDropoff: "pickup",
    pickDropLocation: "Arrakis",
    deleted: false
  }
]);
