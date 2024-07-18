// routes/student.routes.js

module.exports = app => {
    const studentController = require("../controllers/student.controller.js");

    const router = require("express").Router();

    //http://localhost:4040/api/students/addStudent
    router.post('/addStudent', studentController.addStudent);

     //http://localhost:4040/api/students/getstudents
     router.get('/getstudents', studentController.getAllStudents);

      //http://localhost:4040/api/students/updateStudent/:studentId
     router.put('/updateStudent/:studentId', studentController.updateStudent);

     //http://localhost:4040/api/students/deleteStudent/:studentId
     router.delete('/deleteStudent/:studentId', studentController.deleteStudent);

    app.use('/api/students', router);
};
