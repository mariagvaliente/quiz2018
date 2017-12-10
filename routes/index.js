const express = require('express');
const router = express.Router();

const quizController = require('../controllers/quiz');
const tipController = require('../controllers/tip');
const userController = require('../controllers/user');
const sessionController = require('../controllers/session');

//-----------------------------------------------------------

// autologout
router.all('*',sessionController.deleteExpiredUserSession);

//-----------------------------------------------------------

// History: Restoration routes.

// Redirection to the saved restoration route.
function redirectBack(req, res, next) {
    const url = req.session.backURL || "/";
    delete req.session.backURL;
    res.redirect(url);
}

router.get('/goback', redirectBack);

// Save the route that will be the current restoration route.
function saveBack(req, res, next) {
    req.session.backURL = req.url;
    next();
}

// Restoration routes are GET routes that do not end in:
//   /new, /edit, /play, /check, /session, or /:id.
router.get([
    '/',
    '/author',
    '/users',
    '/users/:id(\\d+)/quizzes',
    '/quizzes'], saveBack);

//-----------------------------------------------------------

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

// Author page.
router.get('/author', (req, res, next) => {
    res.render('author');
});


// Autoload for routes using :quizId
router.param('quizId', quizController.load);
router.param('userId', userController.load);


// Routes for the resource /session
router.get('/session',    sessionController.new);     // login form
router.post('/session',   sessionController.create);  // create sesion
router.delete('/session', sessionController.destroy); // close sesion


// Routes for the resource /users
router.get('/users',                    userController.index);
router.get('/users/:userId(\\d+)',      userController.show);
router.get('/users/new',                userController.new);
router.post('/users',                   userController.create);
router.get('/users/:userId(\\d+)/edit', userController.edit);
router.put('/users/:userId(\\d+)',      userController.update);
router.delete('/users/:userId(\\d+)',   userController.destroy);

router.get('/users/:userId(\\d+)/quizzes', quizController.index);


// Routes for the resource /quizzes
router.get('/quizzes',                     quizController.index);
router.get('/quizzes/:quizId(\\d+)',       quizController.show);
router.get('/quizzes/new',                 quizController.new);
router.post('/quizzes',                    quizController.create);
router.get('/quizzes/:quizId(\\d+)/edit',  quizController.edit);
router.put('/quizzes/:quizId(\\d+)',       quizController.update);
router.delete('/quizzes/:quizId(\\d+)',    quizController.destroy);

router.get('/quizzes/:quizId(\\d+)/play',  quizController.play);
router.get('/quizzes/:quizId(\\d+)/check', quizController.check);


router.post('/quizzes/:quizId(\\d+)/tips',     tipController.create);

module.exports = router;
