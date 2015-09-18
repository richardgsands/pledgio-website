Signups = new Mongo.Collection("signups");

if (Meteor.isClient) {

  Session.set('currentIndex', 0);

  var screens = [

    {
      image: '9_main.png',
      caption: 'Make a weekly pledg, track it automatically, and donate to charity whenever you slip up...',
      colour: '#FF0000',
      textColour: 'white'
    },
    {
      image: '4_activity.png',
      caption: 'You can walk, run or cycle',
      colour: '#000088',
      textColour: 'white'
    },
    {
      image: '5_distance.png',
      caption: 'Choose how far you want to aim for each week',
      colour: '#e1e1e1',
      textColour: 'black'
    },
    {
      image: '6_donation.png',
      caption: 'Choose how much you want to donate whenever you fail to meet your Pledg',
      colour: '#FF0000',
      textColour: 'white'
    },
    {
      image: '7_charities.png',
      caption: 'Choose where you want to donate',
      colour: '#000088',
      textColour: 'white'
    },
    {
      image: '8_connect.png',
      caption: 'Enter payment details, link to your favourite apps and everything happens automatically!',
      colour: '#e1e1e1',
      textColour: 'black'
    }

  ];

  Template.main.rendered = function() {
    $('#fullpage').fullpage({
      onLeave: function(index, nextIndex, direction) {
        Session.set('currentIndex', nextIndex-1);
      }
    });
  }

  Template.main.helpers({
    screens: function() {
      return screens;
    },
    currentIndex: function() {
      Session.get('currentIndex');
    },
    currentImageUrl: function() {
      var currentIndex = Session.get('currentIndex');
      return 'screens/' + screens[currentIndex].image;
    }
  })

  Template.signup.helpers({
    result: function() {
      return Session.get('result');
    }
  })

  Template.signup.events({
    'submit .signup' : function(event) {
      event.preventDefault();

      if (!event.target.email.value) return;

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
