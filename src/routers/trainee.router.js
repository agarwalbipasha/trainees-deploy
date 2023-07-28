module.exports = app => {
    const trainee = require("../controllers/trainee.controller");

    var router = require("express").Router();

    router.post("/", trainee.create);

    router.get("/", trainee.findAll);

    router.get("/trainees", trainee.findOne);

    router.delete("/:id", trainee.delete);

    router.patch("/:id", trainee.update);

    app.use("/api", router)
}