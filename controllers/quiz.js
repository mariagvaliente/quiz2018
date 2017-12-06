const models = require("../models");


// Autoload el quiz asociado a :quizId
exports.load = (req, res, next, quizId) => {

    const quiz = models.quiz.findById(Number(quizId));

    if (quiz) {
        req.quiz = quiz;
        next();
    } else {
        throw new Error('There is no quiz with  id=' + quizId);
    }
};


// GET /quizzes
exports.index = (req, res, next) => {

    const quizzes = models.quiz.findAll();

    res.render('quizzes/index.ejs', {quizzes});
};


// GET /quizzes/:quizId
exports.show = (req, res, next) => {

    const {quiz} = req;

    res.render('quizzes/show', {quiz});

};


// GET /quizzes/new
exports.new = (req, res, next) => {

    const quiz = {
        question: "", 
        answer: ""
    };

    res.render('quizzes/new', {quiz});
};

// POST /quizzes/create
exports.create = (req, res, next) => {

    const {question, answer} = req.body;

    let quiz = {
        question,
        answer
    };

    // Validates that they are no empty
    if (!question || !answer) {
        res.render('quizzes/new', {quiz});
        return;
    }

    // Saves the new quiz
    quiz = models.quiz.create(quiz);

    res.redirect('/quizzes/' + quiz.id);
};


// GET /quizzes/:quizId/edit
exports.edit = (req, res, next) => {

    const {quiz} = req;

    res.render('quizzes/edit', {quiz});
};


// PUT /quizzes/:quizId
exports.update = (req, res, next) => {

    let {quiz, body} = req;

    quiz.question = body.question;
    quiz.answer = body.answer;

    models.quiz.update(quiz);

    res.redirect('/quizzes/' + quiz.id);
};


// DELETE /quizzes/:quizId
exports.destroy = (req, res, next) => {

    models.quiz.destroy(req.quiz);

    res.redirect('/quizzes');
};


// GET /quizzes/:quizId/play
exports.play = (req, res, next) => {

    const {quiz, query} = req;

    const answer = query.answer || '';

    res.render('quizzes/play', {
        quiz,
        answer
    });
};


// GET /quizzes/:quizId/check
exports.check = (req, res, next) => {

    const {quiz, query} = req;

    const answer = query.answer || "";

    const result = answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim();

    res.render('quizzes/result', {
        quiz,
        result,
        answer
    });
};
