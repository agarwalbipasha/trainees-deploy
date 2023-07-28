const mongoose = require("mongoose");
const moment = require("moment");

const fromdateValidator = {
    validator: function (date) {
      return moment(date, "DD-MM-YYYY", true).isValid();
    },
    message: (props) => `${props.value} is not a valid date`,
  };

const toDateValidator = {
  validator: function (value) {
    const fromDate = this.fromDate;
    return moment(value, "DD-MM-YYYY")
    .isSameOrAfter(moment(fromDate, "DD-MM-YYYY"));
  },
  message: "ToDate should not be before FromDate."
};
 

const validateEmail = {
  validator: function (email) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  },
  message: "Please enter a valid email ID.",
};

const leaveSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    trim: true,
    min: 1,
    message: "ID should be a valid number."
  },
  fromDate: {
    type: Date,
    required: true,
    validate: [fromdateValidator],
  },
  toDate: {
    type: Date,
    required: true,
    validate: [toDateValidator]
},
  type: {
    type: String,
    required: true,
    trim: true,
    enum: ['full day', 'half day'],
    message: "Type can be either full day/half day."
  },
  reason: {
      type: String,
      required: true,
      trim: true,
      message: "Reason cannot be empty."
    }
});

leaveSchema.set("toJSON", { 
  getters: true,
  transform: function (doc, ret, options) {
    ret.fromDate = moment(ret.fromDate).format("DD MMMM YYYY");
    ret.toDate = moment(ret.toDate).format("DD MMMM YYYY");
    return ret;
  }
 });

const traineeSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    trim: true,
    min: 1,
    message: "ID should be a valid number."
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
    match: /^[a-zA-Z ]+$/,
    message: "Please provide a valid name",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validateEmail],
  },
  leave: [leaveSchema]
  
});

traineeSchema.pre("save", async function (next) {
  const trainee = this;
  try {
    const model = mongoose.model("Trainee");
    const idCount = await model.countDocuments({ id: trainee.id });
    if (idCount > 0) {
      throw new Error("Trainee with the same id already exists");
    }

    const emailCount = await model.countDocuments({ email: trainee.email});
    if (emailCount > 0) {
      throw new Error("Trainee with the same email already exists")
    }
    next();
  } catch (error) {
    next(error);
  }
})

const Trainee = mongoose.model("Trainee", traineeSchema);

module.exports = Trainee;
