const models = require("../models");


// GET /quizzes
exports.index = (req, res, next) => {

    const quizzes = models.quiz.findAll();

    res.render('quizzes/index.ejs', {quizzes});
};


// GET /quizzes/:quizId
exports.show = (req, res, next) => {

    const quizId = Number(req.params.quizId);

    const quiz = models.quiz.findById(quizId);

    if (quiz) {
        res.render('quizzes/show', {quiz});
    } else {
        next(new Error('There is no quiz with id=' + quizId));
    }
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

    let quiz = {
        question: req.body.question,
        answer: req.body.answer
    };

    // Validates that they are no empty
    if (!quiz.question || !quiz.answer) {
        res.render('quizzes/new', {quiz});
        return;
    }

    // Saves the new quiz
    quiz = models.quiz.create(quiz);

    res.redirect('/quizzes/' + quiz.id);
};


// GET /quizzes/:quizId/edit
exports.edit = (req, res, next) => {

    const quizId = Number(req.params.quizId);

    const quiz = models.quiz.findById(quizId);

    if (quiz) {
        res.render('quizzes/edit', {quiz});
    } else {
        next(new Error('There is no quiz with id=' + quizId));
    }
};


// PUT /quizzes/:quizId
exports.update = (req, res, next) => {

    const quizId = Number(req.params.quizId);

    const quiz = models.quiz.findById(quizId);

    if (quiz) {
        quiz.question = req.body.question;
        quiz.answer = req.body.answer;

        models.quiz.update(quiz);

        res.redirect('/quizzes/' + quizId);
    } else {
        next(new Error('There is no quiz with id=' + quizId));
    }
};


// DELETE /quizzes/:quizId
exports.destroy = (req, res, next) => {

    const quizId = Number(req.params.quizId);

    const quiz = models.quiz.findById(quizId);

    if (quiz) {
        models.quiz.destroy(quiz);

        res.redirect('/quizzes');
    } else {
        next(new Error('There is no quiz with id=' + quizId));
    }
};


// GET /quizzes/:quizId/play
exports.play = (req, res, next) => {

    const answer = req.query.answer || '';

    const quizId = Number(req.params.quizId);

    const quiz = models.quiz.findById(quizId);

    if (quiz) {
        res.render('quizzes/play', {
            quiz: quiz,
            answer: answer
        });
    } else {
        next(new Error('There is no quiz with id=' + quizId));
    }
};


// GET /quizzes/:quizId/check
exports.check = (req, res, next) => {

    const answer = req.query.answer || "";

    const quizId = Number(req.params.quizId);

    const quiz = models.quiz.findById(quizId);

    const result = answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim();

    if (quiz) {
        res.render('quizzes/result', {
            quiz: quiz,
            result: result,
            answer: answer
        });
    } else {
        next(new Error('There is no quiz with id=' + quizId));
    }
};
