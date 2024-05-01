const Joi = require("joi");
const express = require("express"); // this returns a function
const app = express(); // creates an express application stored as app

app.use(express.json());

let students = [
  { id: 1, name: "Veektoria" },
  { id: 2, name: "Emmanuel" },
  { id: 3, name: "Nkechi" },
];

// app has several useful methods lncluding get(), post(), delete() and put()

// A get request. It takes two arguments, the path and a callback function which has two
// arguments the (req, res) i.e the request and renponse arguments

// A route to the root folder
app.get("/", (req, res) => {
  res.send("hello! Welcome to school!"); // a response to the request
});

// A route to get the list of students
app.get("/api/students", (req, res) => {
  const studentNames = students.map((student) => student.name);
  res.send(studentNames);
});

// A route to get a particular student. This will need a parameter to identify the student. we use :ID
app.get("/api/students/:id", (req, res) => {
  const student = students.find((student) => student.id === parseInt(req.params.id)
  );
  // validating input
  if (!student)
    return res
      .status(404)
      .send(`The student with ID ${req.params.id} was not found`);
  res.send(student.name);
});

// Route to add a student
app.post("/api/students", (req, res) => {
  // validate the request
  const { error } = validateStudent(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // add new student
  const student = {
    id: students.length + 1,
    name: req.body.name,
  };
  students.push(student);

  // return the added student object to the user
  res.send(student);
});

// route to update course
app.put("/api/students/:id", (req, res) => {
  // find the student or return 404 if not found
  const student = students.find(
    (student) => student.id === parseInt(req.params.id)
  );
  if (!student)
    return res.status(404).send(`The student with ID ${req.params.id} was not found`);

  // validate the request
  const { error } = validateStudent(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // update student details
  student.name = req.body.name;
  // respond to the user with the updated student details
  res.send(student);
});

// route to handle delete request
app.delete("/api/students/:id", (req, res) => {
  // looking up the student ID and returning a 404 error if student is not found
    const student = students.find((student) => student.id === parseInt(req.params.id)
    );

    if (!student)
      return res
        .status(404)
        .send(`The student with ID ${req.params.id} was not found`);
    res.send(student.name);

    // Get the index of student to delete
    const index = students.indexOf(student);

    // delete the student using splice
    students.splice(index, 1);

    // return deleted student object
    res.send(student);
});

// validator function

function validateStudent(student) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(student);
}

// your app needs to listen on a given port. For the port number, avoid hardcoded number by using environment
// variables like PORT through the process object
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
