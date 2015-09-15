Signups = new Mongo.Collection("signups");

if (Meteor.isClient) {

  Template.main.rendered = function() {
    $('#fullpage').fullpage();
  }

  Template.signup.helpers({
    result: function() {
      return Session.get('result');
    }
  })

  Template.signup.events({
    'submit .signup' : function(event) {
      event.preventDefault();

      // TODO: validate email
      var signup = {
        email: event.target.email.value
      };

      Meteor.call('submitSignup', signup, function (error, result) {

        if (result.insertedId) {
          // new email was inserted
          Session.set('result', "Thanks, we'll be in touch soon!");

        } else if (result.numberAffected > 0) {
          // email already present
          Session.set('result', "You've already signed up!");
        }

      });

    }
  })

}

if (Meteor.isServer) {
  Meteor.startup(function () {

  });

  Meteor.methods({
    submitSignup: function(signup, callback) {

      return Signups.upsert({
        email: signup.email
      }, {
        $set: {email: signup.email}
      });

    }
  })
}
