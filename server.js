
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let students = [
  {
    id: 1,
    name: "Asif",
    course: "Computer Science"
  },
  {
    id: 2,
    name: "Akmal",
    course: "Information Technology"
  }
];

app.get("/", (req, res) => {
  res.json({
    message: "Student Backend is Running!",
    technology: "Node.js and Express"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    message: "Application is healthy"
  });
});

app.get("/students", (req, res) => {
  res.json(students);
});

app.get("/students/:id", (req, res) => {
  const student = students.find(
    s => s.id === Number(req.params.id)
  );

  if (!student) {
    return res.status(404).json({
      message: "Student not found"
    });
  }

  res.json(student);
});

app.post("/students", (req, res) => {
  const { name, age, course } = req.body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    !Number.isInteger(age) ||
    age <= 0 ||
    typeof course !== "string" ||
    !course.trim()
  ) {
    return res.status(400).json({
      message: "Valid name, age and course are required"
    });
  }

  const newStudent = {
    id: Math.max(0, ...students.map(s => s.id)) + 1,
    name: name.trim(),
    age,
    course: course.trim()
  };

  students.push(newStudent);

  res.status(201).json({
    message: "Student added successfully",
    student: newStudent
  });
});

app.put("/students/:id", (req, res) => {
  const student = students.find(
    s => s.id === Number(req.params.id)
  );

  if (!student) {
    return res.status(404).json({
      message: "Student not found"
    });
  }

  const { name, age, course } = req.body;

  if (
    (name !== undefined &&
      (typeof name !== "string" || !name.trim())) ||
    (age !== undefined &&
      (!Number.isInteger(age) || age <= 0)) ||
    (course !== undefined &&
      (typeof course !== "string" || !course.trim()))
  ) {
    return res.status(400).json({
      message: "Invalid student details"
    });
  }

  if (name !== undefined) student.name = name.trim();
  if (age !== undefined) student.age = age;
  if (course !== undefined) student.course = course.trim();

  res.json({
    message: "Student updated successfully",
    student
  });
});

app.delete("/students/:id", (req, res) => {
  const index = students.findIndex(
    s => s.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Student not found"
    });
  }

  students.splice(index, 1);

  res.json({
    message: "Student deleted successfully"
  });
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}
