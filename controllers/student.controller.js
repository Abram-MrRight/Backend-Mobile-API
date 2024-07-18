// controllers/student.controller.js
const db = require('../models');
const Student = db.Student;
const Payment = db.Payment;
const Finance = db.Finance;

//getStudent details
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        { model: Payment, as: 'Payments' },
        { model: Finance, as: 'Finance' }
      ]
    });
      
    //status for each student
    const studentsStatus = students.map(student => {
      const paidAmount = student.Payments.reduce((sum, payment) => sum + payment.amount, 0);
      const outstandingBalance = student.Finance.expected_fees - paidAmount;
      

      return {
        student_id: student.id,
        first_name: student.first_name,
        gender: student.gender,
        age: student.age,
        class: student.class,
        physical_address: student.physical_address,
        parent_phone_number: student.parent_phone_number,
        payments: student.Payments.map(payment => ({
          amount: payment.amount,
          date: payment.payment_date
        })),
        status: {
          expected_fees: student.Finance.expected_fees,
          paid_amount: paidAmount,
          outstanding_balance: outstandingBalance
        }
      };
    });
       //total outstanding balance 
    const totalOutstandingBalances = studentsStatus.reduce((total, student) => total + student.status.outstanding_balance, 0);
    //total payment for all students
    const totalPayments = students.reduce((total, student) => 
      total + student.Payments.reduce((sum, payment) => sum + payment.amount, 0), 0
    );

    //total expected_fees 
    const totalExpectedFees = students.reduce((total, student) => total + student.Finance.expected_fees, 0);
    res.json({
      status: "Success",
      status_code: 1000,
      message: "Students successfully retrieved",
      number_of_students: students.length,
      studentsStatus: studentsStatus,
      totalOutstandingBalances: totalOutstandingBalances,
      totalPayments: totalPayments,
      totalExpectedFees: totalExpectedFees
    });
  } catch (error) {
    res.status(500).json({ error: `${error}` });
  }
};
//add student
exports.addStudent = async (req, res) => {
  try {
    const { first_name, gender, age, class: studentClass, physical_address, parent_phone_number, expected_fees } = req.body;

    const newStudent = await Student.create({
      first_name,
      gender,
      age,
      class: studentClass,
      physical_address,
      parent_phone_number
    });

    await Finance.create({
      student_id: newStudent.id,
      expected_fees
    });

    res.json({
      status: "Success",
      status_code: 1001,
      message: "Student successfully added",
      student: newStudent
    });
  } catch (error) {
    res.status(500).json({ error: `${error}` });
  }
};

//update student
exports.updateStudent = async (req, res) => {
  const studentId = req.params.studentId; // Get the studentId from the URL parameters
  const { first_name, gender, age, class: studentClass, physical_address, parent_phone_number, expected_fees } = req.body;

  try {
    // Log the received data
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);

    // Find the student by primary key
    const student = await Student.findByPk(studentId);
    if (!student) {
      console.log(`Student with ID ${studentId} not found.`);
      return res.status(404).json({ error: "Student not found" });
    }

    // Update student details
    student.first_name = first_name || student.first_name;
    student.gender = gender || student.gender;
    student.age = age || student.age;
    student.class = studentClass || student.class;
    student.physical_address = physical_address || student.physical_address;
    student.parent_phone_number = parent_phone_number || student.parent_phone_number;

    await student.save();

    // Update related finance records if `expected_fees` is provided
    if (expected_fees !== undefined) {
      const financeRecord = await Finance.findOne({ where: { student_id: studentId } });
      if (financeRecord) {
        financeRecord.expected_fees = expected_fees;
        await financeRecord.save();
      } else {
        // Create a new finance record if it doesn't exist
        await Finance.create({
          student_id: studentId,
          expected_fees
        });
      }
    }

    console.log(`Student with ID ${studentId} successfully updated.`);

    res.json({
      status: "Success",
      status_code: 1002,
      message: "Student successfully updated",
      student
    });
  } catch (error) {
    console.error(`Error updating student with ID ${studentId}: ${error}`);
    res.status(500).json({ error: `${error}` });
  }
};

//delete student
exports.deleteStudent = async (req, res) => {
  const studentId = req.params.studentId; // Declare studentId here to make it accessible in both try and catch blocks

  try {
    // Log the entire req.params object
    console.log('Request params:', req.params);

    // Log the received studentId to ensure it's correct
    console.log(`Received studentId: ${studentId}`);

    const student = await Student.findByPk(studentId);
    if (!student) {
      console.log(`Student with ID ${studentId} not found.`);
      return res.status(404).json({ error: "Student not found" });
    }

    // Delete related payments records first
    await Payment.destroy({ where: { student_id: studentId } });

    // Delete related finance records next
    await Finance.destroy({ where: { student_id: studentId } });

    // Now delete the student
    await student.destroy();
    console.log(`Student with ID ${studentId} successfully deleted.`);

    res.json({
      status: "Success",
      status_code: 1003,
      message: "Student successfully deleted"
    });
  } catch (error) {
    console.error(`Error deleting student with ID ${studentId}: ${error}`);
    res.status(500).json({ error: `${error}` });
  }
};
