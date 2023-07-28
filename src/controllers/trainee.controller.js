const db = require("../models");
const Trainee = require("../models/trainee");
const moment = require("moment");

exports.create = (req, res) => {
  const { name, id, email, leave } = req.body;
  const newLeave = leave.map((item) => ({
    id: item.id,
    fromDate: moment(item.fromDate, "DD-MM-YYYY").toDate(),
    toDate: moment(item.toDate, "DD-MM-YYYY").toDate(),
    type: item.type,
    reason: item.reason
  }));
  const newTrainee = new Trainee({ name, id, email, leave: newLeave });
  newTrainee.save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      if (err && err.errors) {
        const errors = Object.keys(err.errors)
          .map(key => err.errors[key].message);
        res.status(500).send({
          message: errors.length ? errors : "Some error occurred while creating the Trainee."
        });
      } else {
        res.status(500).send({
          message: err && err.message ? err.message : "Some error occured while creating the trainee."
        });
      }
    });
};

exports.findAll = async (req, res) => {
  Trainee.find().then(data => res.send(data))
    .catch(err => res.status(500).send({
      message: err.message || "Some error occured while retrieving trainees."
    }))
};

exports.findOne = (req, res) => {
  const searchQuery = req.query.search;
  const conditions = {};
  if (searchQuery) {
    conditions.$or = [
      { name: { $regex: searchQuery, $options: "i" } },
      { email: { $regex: searchQuery, $options: "i" } },
    ];
  }
  Trainee.findOne(conditions)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({ message: err.message })
      }
    })
    .catch(err => res.status(500).send({
      message: err.message || "Some error occurred while retrieving the trainees."
    }))
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Trainee.findByIdAndDelete(id)
    .then(data => res.send(`Deleted ${data}`))
    .catch(err => res.status(500).send({
      message: err.message ||
        "Some error occured while deleting the trainee with id."
    }));
};

exports.update = (req, res) => {
  const id = req.params.id;
  const updatedLeave = {
    id: req.body.leave[0].id,
    fromDate: moment(req.body.leave[0].fromDate, "DD-MM'YYYY").toDate(),
    toDate: moment(req.body.leave[0].toDate, "DD-MM'YYYY").toDate(),
    type: req.body.leave[0].type,
    reason: req.body.leave[0].reason
  };
  const updatedTrainee = {
    name: req.body.name,
    id: req.body.id,
    email: req.body.email,
    leave: updatedLeave
  };

  if (!updatedLeave.type || (updatedLeave.type != "full day" && updatedLeave.type != "half day")) {
    return res.status(400).json({ message: "Please provide the valid leave type." });
  }

  if (!updatedLeave.reason) {
    return res.status(400).json({ message: "Reason cannot be empty." });
  }

  Trainee.findByIdAndUpdate(
    { _id: id },
    { $push: { leave: updatedLeave } },
    { new: true })
    .then((trainee) => {
      if (!trainee) {
        return res.status(404).json({ message: "Trainee not found." });
      }
      res.json(trainee);
    })
    .catch(err =>
      res.status(500).json({
        message:
          err.message || "Some error occured while updating the trainee."
      }));
};

module.exports = exports;
