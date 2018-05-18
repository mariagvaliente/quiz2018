

const Browser = require("zombie");


describe("User visits the home page.", () => {

    const browser = new Browser();

    before(() => browser.visit("http://localhost:5000") );

    it("should be successful.", () => {
        browser.assert.success();
    });

    it("should see home page.", () => {
        browser.assert.url({pathname: "/"});
    });
});


describe("User visits the quizzes index page.", function() {

    const browser = new Browser();

    before(() => browser.visit("http://localhost:5000/quizzes") );

    it("should be successful.", () => {
        browser.assert.success();
    });

    it("should see the quizzes index page.", () => {
        browser.assert.url({pathname: "/quizzes"});
    });
});


describe("No logged user must login to create a new quiz.", function() {

    const browser = new Browser();

    before(() => browser.visit("http://localhost:5000/quizzes/new") );

    it("should be successful.", () => {
        browser.assert.success();
    });

    it("should see the login page.", () => {
        browser.assert.url({pathname: "/session"});
    });
});


describe("No logged user tries to create a new quiz.", () => {

    const browser = new Browser();

    before(() => browser.visit("http://localhost:5000/quizzes/new") );

    it("should be successful.", () => {
        browser.assert.success();
    });

    it("should see the login page.", () => {
        browser.assert.url({pathname: "/session"});
    });

    it("submit login form.", () => {
            browser.fill('login', 'pepe');
            browser.fill('password', '5678');
            return browser.pressButton("Login");
    });

    it("should be successful.", () => {
        browser.assert.success();
    });

    it("should see the page with the form to create a new quiz.", () => {
        browser.assert.url({pathname: "/quizzes/new"});
    });

    describe("submit the create new quiz form.", () => {

        before(() => {
            browser.fill("question","Testing question");
            browser.fill("answer","Testing answer");
            return browser.pressButton("");

        });

        it("should be successful.", () => {
            browser.assert.success();
        });

        it("should see the show quiz page with the created quiz.", () => {
            browser.assert.url({pathname: /^\/quizzes\/\d+$/})
        });

    });
});
