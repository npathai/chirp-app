var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var userModel = mongoose.model('User');
var postModel = mongoose.model('Post');

module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {

        console.log('serializing user:', user._id);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {

        //  userModel.findById(id, function(err, user) {
        //    if (err) {
        //      console.log(err);
        //      done(err, false);
        //    }
         //
        //    if (!user) {
        //      done('user not found', false);
        //    }
         //
        //    done(user, true);
        //  });

        userModel.findById(id, function(err, user) {
          done(err, user);
        });
    });

    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {
            console.log('Login request received for user ' + username);

            userModel.findOne({username: username}, function(err, user){
              if (err) {
                console.log(err);
                return done(err);
              }

              if (!user) {
                console.log('user not found');
                return done(null, false, {message: 'user ' + username + ' not found'});
              }

              if (!isValidPassword(user, password)) {
                console.log('incorrect password');
                return done(null, false, {message: 'incorrect password'});
              }

              console.log('login success');
              return done(null, user);
            });
        }
    ));

    passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            console.log('Signup request received for user ' + username);

            userModel.findOne({username: username}, function(err, user){
              if (err) {
                console.log(err);
                return done(err);
              }

              if (user) {
                console.log('user already exists');
                return done(null, false, {message: 'username already taken'});
              }

              var user = new userModel();
              user.username = username;
              user.password = createHash(password);

              user.save(function(err, user){
                if (err) {
                  return done(err);
                }

                console.log('Successfully signed up user ' + username);

                return done(null, user);
              });
            });
        })
    );

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };
    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

};
