describe("FormController", function(){
  var formController, submittedGuest;
  beforeEach(module("shuffling"));

  beforeEach(function(){
    module(function($provide){
      $provide.service("StorageService", [function(){
        var svc = this;
        svc.addGuest = function (guest) {
          submittedGuest = guest;
        };
      }]);
    });
  });

  beforeEach(inject(function($controller){
    formController = $controller("FormController");
  }));

  it("should not submit if a guest name and transition date have not been provided", function(){
    formController.submit();
    expect(submittedGuest).toBeUndefined();
  });
  it("should always set the deleted tag to false", function(){
    formController.guestName = "Jane";
    formController.transitionDate = "11/12/2013";
    formController.submit();
    expect(submittedGuest.deleted).toBe(false);
  });
  it("should submit the guest to StorageService", function(){
    formController.guestName = "Jane";
    formController.transitionDate = "11/12/2013";
    formController.pickupOrDropoff = "pickup";
    formController.pickDropLocation = "123 Main Street";
    var guest = {
      guestName : "Jane",
      transitionDate : "11/12/2013",
      pickupOrDropoff : "pickup",
      pickDropLocation : "123 Main Street",
      deleted : false
    };
    formController.submit();
    expect(submittedGuest).toEqual(guest);
  });
  it("should change the focus to the Guests tab on submit", function(){
    formController.guestName = "Jane";
    formController.transitionDate = "11/12/2013";

    // form element
    var formDiv = document.createElement("div");
    formDiv.id = "form";
    formDiv.className = "active";
    document.body.appendChild(formDiv);

    // formTab element
    var formTabDiv = document.createElement("div");
    formTabDiv.id = "formTab";
    formTabDiv.className = "active";
    document.body.appendChild(formTabDiv);

    // guests element
    var guestsDiv = document.createElement("div");
    guestsDiv.id = "guests";
    guestsDiv.className = "";
    document.body.appendChild(guestsDiv);

    // guestsTab element
    var guestsTabDiv = document.createElement("div");
    guestsTabDiv.id = "guestsTab";
    guestsTabDiv.className = "";
    document.body.appendChild(guestsTabDiv);

    formController.submit();
    expect(formDiv.className).toBe("");
    expect(formTabDiv.className).toBe("");
    expect(guestsDiv.className).toBe("active");
    expect(guestsTabDiv.className).toBe("active");
  });
  it("should reset the form's fields on submit", function(){
    formController.guestName = "Jane";
    formController.transitionDate = "11/12/2013";
    formController.pickupOrDropoff = "pickup";
    formController.pickDropLocation = "123 Main Street";
    formController.submit();
    expect(formController.guestName).toBe("");
    expect(formController.transitionDate).toBe("");
    expect(formController.pickupOrDropoff).toBe(false);
    expect(formController.pickDropLocation).toBe("");
  });
});

describe("TabController", function(){
  var tabController, storageService, guestRemoved, guestsSaved;
  beforeEach(module("shuffling"));

  beforeEach(function(){
    guestRemoved = false;
    guestsSaved = false;
    module(function($provide){
      $provide.service("StorageService", [function(){
        var svc = this;
        svc.removeGuest = function (index) {
          guestRemoved = true;
        };
        svc.saveGuests = function () {
          guestsSaved = true;
        };
        svc.guests = [
          {
            guestName : "Jane",
            transitionDate : "12/12/2015"
          },
          {
            guestName : "Joe",
            transitionDate : "11/18/2015"
          }
        ];
      }]);
    });
  });

  beforeEach(inject(function($injector){
    storageService = $injector.get("StorageService");
  }));

  beforeEach(inject(function($controller){
    tabController = $controller("TabController");
  }));

  it("should match the StorageService guest list in the controller's guest list", function(){
    expect(tabController.guests).toEqual(storageService.guests);
  });
  it("should call StorageService to delete the given index if confirmed", function(){
    // mock window confirm function as though confirmed
    window.confirm = function (message) {
      return true;
    };
    tabController.delete(0);
    expect(guestRemoved).toBe(true);
  });
  it("should not call StorageService to delete the guest index if denied", function(){
    // mock window confirm function as though denied
    window.confirm = function (message) {
      return false;
    };
    tabController.delete(0);
    expect(guestRemoved).toBe(false);
  });
  it("should call StorageService to save guest list", function(){
    tabController.save();
    expect(guestsSaved).toBe(true);
  });
});

describe("StorageService", function(){
  var storageService, defaultGuests;
  beforeEach(module("shuffling"));

  beforeEach(function(){
    localStorage.clear();

    module(function($provide){
      $provide.value("DefaultGuests", [
          {
            guestName : "Jane",
            transitionDate : "12/12/2015",
            pickupOrDropoff : "pickup",
            pickDropLocation : "123 Main Street",
            deleted : "false"
          },
          {
            guestName : "Joe",
            transitionDate : "11/18/2015",
            pickupOrDropoff : "dropoff",
            pickDropLocation : "Metropolis",
            deleted : "false"
          }
        ]);
    });

    inject(function($injector){
      storageService = $injector.get("StorageService");
      defaultGuests = $injector.get("DefaultGuests");
    });
  });

  it("should save guests to localStorage", function(){
    localStorage.clear();
    var guestsLength = storageService.guests.length;
    storageService.saveGuests();
    storageGuestsLength = JSON.parse(localStorage.getItem("guestList")).length;
    expect(guestsLength).toBe(storageGuestsLength);
  });
  it("should get guests from localStorage if present", function(){
    storageService.guests = [];
    expect(storageService.guests.length).toBe(0);
    storageService.getGuests();
    expect(storageService.guests.length).toBe(2);
  });
  it("should get guests from DefaultGuests if localStorage is empty", function(){
    localStorage.clear();
    storageService.getGuests();
    expect(storageService.guests[0].guestName).toBe("Jane");
    expect(storageService.guests[1].guestName).toBe("Joe");
  });
  it("should set each guest's transitionDate as a date object", function(){
    storageService.getGuests();
    expect(storageService.guests[0].transitionDate instanceof Date).toBe(true);
  });
  it("should add a guest to the guest list", function(){
    expect(storageService.guests.length).toBe(2);
    var newGuest = {
      guestName : "Peter",
      transitionDate : "11/21/2015"
    };
    storageService.addGuest(newGuest);
    expect(storageService.guests.length).toBe(3);
  });
  it("should flag a guest as deleted", function(){
    storageService.removeGuest(1);
    expect(storageService.guests[1].deleted).toBe(true);
  });
});

describe("DefaultGuests", function(){
  var defaultGuests;
  beforeEach(module("shuffling"));
  beforeEach(inject(function($injector){
    defaultGuests = $injector.get("DefaultGuests");
  }));

  it("should store transitionDate as a Date object", function(){
    expect(defaultGuests[0].transitionDate instanceof Date).toBe(true);
  });
  it("should store deleted as a boolean", function(){
    expect(typeof(defaultGuests[0].deleted)).toBe("boolean");
  });
});
