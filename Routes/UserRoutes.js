const express = require("express");
const { CreateStudent, GetStudents, DeleteStudents,Entermarks,GetEntermarks } = require("../Controller/UserController");
const router = express.Router();

router.post("/students", CreateStudent);
router.get("/students", GetStudents);
router.delete("/students/:id", DeleteStudents);
router.post("/entermarks", Entermarks);
router.get("/entermarks", GetEntermarks);


module.exports = router;
