var app = angular.module('shuffling', []);

// controller for form submission
app.controller('FormController', ["StorageService", function(StorageService){

  var vm = this;

  // function on form submission to add the guest to list and switch tabs
  vm.submit = function(){

    // confirm that a name and transition date have been provided
    if (vm.guestName && vm.transitionDate) {

      // create a guest object to be loaded into localStorage
      var guest = {
        guestName : vm.guestName,
        transitionDate : vm.transitionDate,
        pickupOrDropoff : vm.pickupOrDropoff,
        pickDropLocation : vm.pickDropLocation,
        deleted : false
      };

      // update local storage with new guest
      StorageService.addGuest(guest);

      // after submission switch to the guest tab
      $("#form").removeClass("active");
      $("#formTab").removeClass("active");
      $("#guests").addClass("active");
      $("#guestsTab").addClass("active");

      // reset form
      vm.guestName = "";
      vm.transitionDate = "";
      vm.pickupOrDropoff = false;
      vm.pickDropLocation = "";

    // else for when a guest name and transition date have not been provided
    } else {
      alert("Please provide the guest's name and transition date.");
    }
  };
}]);


// controller for modifying and deleting current guests
app.controller('TabController', ["StorageService", function(StorageService){

  var vm = this;
  vm.guests = StorageService.guests;

  // function to flag a guest as deleted (deleted guests are not displayed)
  vm.delete = function (index) {
    deleteConfirmed = confirm("Are you sure you would like to remove " + vm.guests[index].guestName + " from the guest list?");
    if (deleteConfirmed) {
      StorageService.removeGuest(index);
    }
  };

  // function to save all changes to the guest list
  vm.save = function () {
    StorageService.saveGuests();
    $("#saveChanges").blur();
  };
}]);
