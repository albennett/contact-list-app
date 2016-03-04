var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {

//set 'this' to the variable self
  var self = this;
  //is set to true when editing a contact
  self.editModeActive = false;


  //get data from server
  $http.get("/contactList")
  .then(function(dataResponse){
    console.log("GOT THE DATA FROM MY OWN API YAYAYAYAYAA");
    console.log("dataResponse ", dataResponse);
    self.contactList = dataResponse.data;
  });

  //post request
  self.addNewContact = function(){
    console.log("contact is requested - ", self.contact)

    //send the contact object to the server
    $http.post('/contactList', self.contact)
    .success(function(response){
        console.log("response ", response);

        //push new contact into array
        self.contactList.push(response);

        //clear inputs
        self.contact = "";
    });
  }

  // delete request
  self.removeContact = function(id){
    console.log("id ", id);
    //delete request
    $http.delete('/contactList/'+id)
    .success(function(response){
      console.log("delete response ", response);
      //remove the deleted contact from array
        var updatedArray = []

        self.contactList.map(function(item){
          if(item._id === id){
            console.log("thats it");
          } else {
            updatedArray.push(item)
          }
        })

        self.contactList = updatedArray;

          //make this more efficient with splice method or sumn

    });
  }

  //update existing people in db
  self.updateContact = function(contact){
    console.log("contact to update is ", contact);

    console.log("contact id is ", contact.id);

    //send contact object in put request
    $http.put("/contactList/"+contact.id, contact)
    .success(function(response){
      //on success log response, clear inputs, and replace item in array
      self.contact="";

      //splice out the old one and put in the new
      self.contactList.map(function(item,index){
        if(item._id === response._id){
          self.contactList.splice(index, 1, response);
        }
      });

      //turn off edit mode
      self.editModeActive = false;


    });

  }

  //switch contact to edit mode
  self.editContact = function(contact){
      console.log("contact ", contact);

      self.editModeActive = true;

    self.contact = {
      name : contact.name,
      email : contact.email,
      phone : contact.phone,
      id : contact._id
    }
  }


}]);
