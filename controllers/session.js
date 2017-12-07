const Sequelize = require("sequelize");
const {models} = require("../models");
const url = require('url');


// This variable contains the maximum inactivity time allowed without 
// making requests.
// If the logged user does not make any new request during this time, 
// then the user's session will be closed.
// The value is in milliseconds.
// 5 minutes.
const maxIdleTime = 5*60*1000;


//
// Middleware used to destroy the user's session if the inactivity time
// has been exceeded.
//
exports.deleteExpiredUserSession = (req, res, next) => {

    if (req.session.user ) { // There exista user's session
        if ( req.session.user.expires < Date.now() ) { // Expired
            delete req.session.user; // Logout
            req.flash('info', 'User session has expired.');
        } else { // Not expired. Reset value.
            req.session.user.expires = Date.now() + maxIdleTime;
        }
    }
    // Continue with the request
    next();
};


/*
 * User authentication: Checks that the user is registered.
 *
 * Return a Promise that searches a user with the given login, and checks that 
 * the password is correct.
 * If the authentication is correct, then the promise is satisfied and returns
 * an object with the User.
 * If the authentication fails, then the promise is also satisfied, but it
 * returns null.
 */
const authenticate = (login, password) => {

    return models.user.findOne({where: {username: login}})
    .then(user => {
        if (user && user.verifyPassword(password)) {
            return user;
        } else {
            return null;
        }
    });
};



// GET /session   -- Login form
exports.new = (req, res, next) => {

    // Page to go/show after login:
    let redir = req.query.redir || url.parse(req.headers.referer || "/").path;

    // Do not go here, i.e. do not shown the login form again.
    if (redir === '/session') {
        redir = "/";
    }

    res.render('session/new', {redir});
};


// POST /session   -- Create the session if the user authenticates successfully
exports.create = (req, res, next) => {

    const redir = req.body.redir || '/'

    const login     = req.body.login;
    const password  = req.body.password;

    authenticate(login, password)
    .then(user => {
        if (user) {
            // Create req.session.user and save id and username fields.
            // The existence of req.session.user indicates that the session exists.
            // I also save the moment when the session will expire due to inactivity.
            req.session.user = {
                id: user.id,
                username: user.username,
                expires: Date.now() + maxIdleTime
            };

            res.redirect(redir); 
        } else {
            req.flash('error', 'Authentication has failed. Retry it again.');
            res.render('session/new', {redir});
        }
    })
    .catch(error => {
        req.flash('error', 'An error has occurred: ' + error);
        next(error);
    });
};


// DELETE /session   --  Close the session
exports.destroy = (req, res, next) => {

    delete req.session.user;

    res.redirect("/session"); // redirect to login gage
};
