const Student = require("../Model/UserModel"); // Your Mongoose model

async function CreateStudent(req, res) {
  try {
    const { firstname, surname, dateofbirth, standard, rollno, grno, subject } = req.body;

    if (
      !firstname ||
      !surname ||
      !dateofbirth ||
      !standard ||
      !rollno ||
      !grno ||
      !subject ||                // Must exist
      !Array.isArray(subject) || // Must be an array
      subject.length === 0       // Must not be empty
    ) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    // Check for duplicate roll number
    const existingRollno = await Student.findOne({ rollno });
    if (existingRollno) {
      return res.status(400).json({ error: "Roll Number already exists!" });
    }

    // Check for duplicate GR number
    const existingGrno = await Student.findOne({ grno });
    if (existingGrno) {
      return res.status(400).json({ error: "GR Number already exists!" });
    }

    // Create new student document
    const newStudent = new Student({
      firstname,
      surname,
      dateofbirth,
      standard,
      rollno,
      grno,
      subject,
    });

    await newStudent.save();

    return res.status(201).json({
      message: "Student created successfully!",
      student: newStudent,
    });
  } catch (error) {
    console.error("Error creating student:", error);

    if (error.code === 11000) {
      const dupField = Object.keys(error.keyValue)[0];
      return res.status(400).json({ error: `${dupField} already exists!` });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }

}

async function GetStudents(req, res) {
  try {
    const students = await Student.find();
    return res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function DeleteStudents(req, res) {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    return res.status(200).json({ status: "Success", message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function Entermarks(req, res) {
  const { marks } = req.body;

  if (!Array.isArray(marks)) {
    return res.status(400).json({ message: "Invalid marks format." });
  }

  try {
    for (const entry of marks) {
      const { studentId, subject, score } = entry;

      if (!studentId || !subject || isNaN(score)) continue;

      const student = await Student.findById(studentId);
      if (!student) continue;

      // Check if mark for subject already exists
      const existingIndex = student.marks.findIndex((m) => m.subject === subject);

      if (existingIndex !== -1) {
        // Update existing mark
        student.marks[existingIndex].score = score;
        student.marks[existingIndex].date = new Date();
      } else {
        // Add new mark
        student.marks.push({ subject, score });
      }

      await student.save();
    }

    res.status(200).json({ message: "Marks updated successfully" });
  } catch (error) {
    console.error("Error saving marks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function GetEntermarks(req, res) {
  try {
    const entermarks = await Student.find()
    return res.status(200).json(entermarks)
  } catch (error) {
    console.log("api databade serrr", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { CreateStudent, GetStudents, DeleteStudents, Entermarks, GetEntermarks };




