

// Model
const quizzes = [
    {   id: 1,
        question: "Capital of Italy",
        answer: "Rome"
    },
    {   id: 2,
        question: "Capital of France",
        answer: "Paris"
    },
    {   id: 3,
        question: "Capital of Spain",
        answer: "Madrid"
    },
    {   id: 4,
        question: "Capital of Portugal",
        answer: "Lisbon"
    }];


// Next value for id
let nextId = quizzes.length + 1;

// Creates a new quiz with the values passed into the quiz parameter.
exports.create = quiz => {

    const newQuiz = {
        id: nextId++,
        question: (quiz.question || "").trim(),
        answer: (quiz.answer || "").trim()
    };

    quizzes.push(newQuiz);

    return newQuiz;
};

// Updates the given quiz (passed into the parameter).
exports.update = (quiz) => {

    const index = quizzes.findIndex(q => quiz.id === q.id);

    if (index >= 0) {
        quizzes[index] = {
            id: quiz.id,
            question: (quiz.question || "").trim(),
            answer: (quiz.answer || "").trim()
        };
    }
};

// Returns all the quizzes.
exports.findAll = () => quizzes;

// Find a quiz by its id.
exports.findById = (id) => {

    return quizzes.find(quiz => quiz.id === id);
};

// Remove the given quiz.
exports.destroy = (quiz) => {

    const index = quizzes.findIndex(q => quiz.id === q.id);

    if (index >= 0) {
        quizzes.splice(index,1);
    }
};
