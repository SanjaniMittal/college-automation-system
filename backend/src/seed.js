const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Student = require("./models/Student");
const Faculty = require("./models/Faculty");
const Course = require("./models/Course");
const Attendance = require("./models/Attendance");
const Assignment = require("./models/Assignment");
const Submission = require("./models/Submission");
const Notice = require("./models/Notice");
const Timetable = require("./models/Timetable");

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/acadexa";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Student.deleteMany({}),
      Faculty.deleteMany({}),
      Course.deleteMany({}),
      Attendance.deleteMany({}),
      Assignment.deleteMany({}),
      Submission.deleteMany({}),
      Notice.deleteMany({}),
      Timetable.deleteMany({}),
    ]);
    console.log("Cleared existing database collections.");

    // 1. Seed Users (passwords will be hashed via userSchema pre-save)
    const users = await User.create([
      {
        name: "College Administrator",
        email: "admin@acadexa.com",
        password: "admin123",
        role: "admin",
        department: "Administration",
      },
      {
        name: "Dr. Neha Kapoor",
        email: "faculty@acadexa.com",
        password: "faculty123",
        role: "faculty",
        employeeId: "FAC001",
        department: "Computer Science",
      },
      {
        name: "Aarav Sharma",
        email: "student@acadexa.com",
        password: "student123",
        role: "student",
        rollNo: "CSE001",
        className: "CSE-A",
        department: "Computer Science & Engineering",
      },
      {
        name: "Dr. Rahul Sharma",
        email: "rahul.sharma@acadexa.com",
        password: "faculty123",
        role: "faculty",
        employeeId: "FAC002",
        department: "Computer Science",
      },
    ]);
    console.log(`Seeded ${users.length} user accounts.`);

    // 2. Seed Students
    const students = await Student.create([
      {
        name: "Aarav Sharma",
        rollNo: "CSE001",
        course: "B.Tech CSE",
        className: "CSE-A",
        semester: 6,
        email: "student@acadexa.com",
        status: "Active",
      },
      {
        name: "Priya Patel",
        rollNo: "CSE002",
        course: "B.Tech CSE",
        className: "CSE-A",
        semester: 6,
        email: "priya.patel@acadexa.com",
        status: "Active",
      },
      {
        name: "Rohan Gupta",
        rollNo: "CSE003",
        course: "B.Tech CSE",
        className: "CSE-A",
        semester: 6,
        email: "rohan.gupta@acadexa.com",
        status: "Active",
      },
      {
        name: "Ananya Iyer",
        rollNo: "CSE004",
        course: "B.Tech CSE",
        className: "CSE-B",
        semester: 6,
        email: "ananya.iyer@acadexa.com",
        status: "Active",
      },
      {
        name: "Vikram Singh",
        rollNo: "CSE005",
        course: "B.Tech CSE",
        className: "CSE-B",
        semester: 6,
        email: "vikram.singh@acadexa.com",
        status: "Active",
      },
      {
        name: "Sneha Reddy",
        rollNo: "CSE006",
        course: "B.Tech CSE",
        className: "CSE-A",
        semester: 6,
        email: "sneha.reddy@acadexa.com",
        status: "Active",
      },
    ]);
    console.log(`Seeded ${students.length} students.`);

    // 3. Seed Faculty
    const faculty = await Faculty.create([
      {
        name: "Dr. Neha Kapoor",
        employeeId: "FAC001",
        department: "Computer Science",
        designation: "Professor",
        email: "faculty@acadexa.com",
        status: "Active",
      },
      {
        name: "Dr. Rahul Sharma",
        employeeId: "FAC002",
        department: "Computer Science",
        designation: "Associate Professor",
        email: "rahul.sharma@acadexa.com",
        status: "Active",
      },
      {
        name: "Prof. Amit Kumar",
        employeeId: "FAC003",
        department: "Computer Science",
        designation: "Assistant Professor",
        email: "amit.kumar@acadexa.com",
        status: "Active",
      },
      {
        name: "Prof. Priya Singh",
        employeeId: "FAC004",
        department: "Information Technology",
        designation: "Assistant Professor",
        email: "priya.singh@acadexa.com",
        status: "Active",
      },
    ]);
    console.log(`Seeded ${faculty.length} faculty members.`);

    // 4. Seed Courses
    const courses = await Course.create([
      {
        code: "BCS501",
        name: "Data Structures",
        department: "Computer Science",
        semester: 6,
        faculty: "Dr. Rahul Sharma",
        credits: 4,
      },
      {
        code: "BCS502",
        name: "Database Management",
        department: "Computer Science",
        semester: 6,
        faculty: "Dr. Neha Kapoor",
        credits: 4,
      },
      {
        code: "BCS503",
        name: "Computer Networks",
        department: "Computer Science",
        semester: 6,
        faculty: "Prof. Amit Kumar",
        credits: 3,
      },
      {
        code: "BCS504",
        name: "Operating Systems",
        department: "Computer Science",
        semester: 6,
        faculty: "Prof. Priya Singh",
        credits: 4,
      },
      {
        code: "BCS505",
        name: "Software Engineering",
        department: "Computer Science",
        semester: 6,
        faculty: "Dr. Rahul Sharma",
        credits: 3,
      },
    ]);
    console.log(`Seeded ${courses.length} courses.`);

    // 5. Seed Attendance Records (across multiple recent dates)
    const today = new Date();
    const attendanceRecords = [];
    const subjects = ["Data Structures", "Database Management", "Computer Networks", "Operating Systems", "Software Engineering"];

    for (let dayOffset = 0; dayOffset < 10; dayOffset++) {
      const recordDate = new Date(today);
      recordDate.setDate(today.getDate() - dayOffset);
      const isoDate = recordDate.toISOString().split("T")[0];

      for (const student of students) {
        for (const subject of subjects) {
          // Mostly present, occasional absent
          const isPresent = (student.rollNo === "CSE001" && dayOffset === 2 && subject === "Database Management") ? false : Math.random() > 0.12;
          attendanceRecords.push({
            studentName: student.name,
            rollNo: student.rollNo,
            course: subject,
            date: new Date(isoDate),
            status: isPresent ? "Present" : "Absent",
          });
        }
      }
    }

    await Attendance.insertMany(attendanceRecords);
    console.log(`Seeded ${attendanceRecords.length} attendance records.`);

    // 6. Seed Assignments
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(today.getDate() + 7);

    const fourDaysFromNow = new Date();
    fourDaysFromNow.setDate(today.getDate() + 4);

    const assignments = await Assignment.create([
      {
        title: "Implement Red-Black Tree in C++",
        subject: "Data Structures",
        className: "CSE-A",
        dueDate: oneWeekFromNow,
        description: "Implement insertion and balancing cases for Red-Black tree with visualization in console.",
        createdBy: "Dr. Rahul Sharma",
      },
      {
        title: "Database Normalization and BCNF Proof",
        subject: "Database Management",
        className: "CSE-A",
        dueDate: fourDaysFromNow,
        description: "Decompose the provided relation R(A, B, C, D, E) with given functional dependencies into 3NF and BCNF.",
        createdBy: "Dr. Neha Kapoor",
      },
      {
        title: "Socket Programming: Multi-client Chat Server",
        subject: "Computer Networks",
        className: "CSE-A",
        dueDate: oneWeekFromNow,
        description: "Create a TCP socket multi-threaded server in Node.js or Python that broadcasts messages among connected clients.",
        createdBy: "Prof. Amit Kumar",
      },
      {
        title: "Banker's Algorithm for Deadlock Avoidance",
        subject: "Operating Systems",
        className: "CSE-A",
        dueDate: oneWeekFromNow,
        description: "Simulate resource allocation and safety checks using Banker's Algorithm.",
        createdBy: "Prof. Priya Singh",
      },
    ]);
    console.log(`Seeded ${assignments.length} assignments.`);

    // 7. Seed Submissions
    const dbmsAssignment = assignments[1];
    const submission = await Submission.create({
      assignmentId: dbmsAssignment._id,
      studentName: "Aarav Sharma",
      rollNo: "CSE001",
      answer: "Normalized relation into 3NF: R1(A, B, C) with CK A->B, and R2(A, D, E) with CK A->D. Both relations satisfy BCNF because each determinant is a super key.",
      submittedAt: new Date(),
      status: "Graded",
      marks: 95,
      feedback: "Excellent work! Clear explanation and correct derivation of candidate keys.",
    });
    console.log("Seeded sample student assignment submission.");

    // 8. Seed Notices
    const notices = await Notice.create([
      {
        title: "Mid-Semester Examination Schedule Announced",
        content: "The mid-semester examinations for the 6th semester B.Tech will commence from next month. Check the detailed schedule on the examination portal.",
        category: "Examination",
        date: new Date(),
        audience: "All Students",
        author: "Examination Cell",
        status: "Published",
      },
      {
        title: "Annual Tech Fest 'Innovate 2026' Registrations Open",
        content: "Registrations are now open for Hackathons, Robotics, Coding Challenges, and Paper Presentations. Grand prizes up to ₹2,00,000.",
        category: "Event",
        date: new Date(),
        audience: "All Students & Faculty",
        author: "Student Affairs",
        status: "Published",
      },
      {
        title: "Guest Lecture on Generative AI and LLMs in Industry",
        content: "Distinguished engineering leaders from top AI labs will conduct an interactive masterclass this Friday in Auditorium Hall A.",
        category: "Academic",
        date: new Date(),
        audience: "CSE Students",
        author: "Dept of Computer Science",
        status: "Published",
      },
      {
        title: "Library Extended Hours for Exam Preparation",
        content: "The central library will remain open 24x7 during the upcoming exam period with Wi-Fi and study rooms available.",
        category: "General",
        date: new Date(),
        audience: "All Students",
        author: "Chief Librarian",
        status: "Published",
      },
    ]);
    console.log(`Seeded ${notices.length} notices.`);

    // 9. Seed Timetable
    const timetable = await Timetable.create([
      {
        day: "Monday",
        className: "CSE-A",
        subject: "Data Structures",
        faculty: "Dr. Rahul Sharma",
        time: "09:00 AM - 10:00 AM",
        room: "Room 201",
      },
      {
        day: "Monday",
        className: "CSE-A",
        subject: "Database Management",
        faculty: "Dr. Neha Kapoor",
        time: "11:00 AM - 12:00 PM",
        room: "Lab 102",
      },
      {
        day: "Monday",
        className: "CSE-A",
        subject: "Computer Networks",
        faculty: "Prof. Amit Kumar",
        time: "02:00 PM - 03:00 PM",
        room: "Room 305",
      },
      {
        day: "Tuesday",
        className: "CSE-A",
        subject: "Operating Systems",
        faculty: "Prof. Priya Singh",
        time: "09:00 AM - 10:00 AM",
        room: "Room 202",
      },
      {
        day: "Tuesday",
        className: "CSE-A",
        subject: "Software Engineering",
        faculty: "Dr. Rahul Sharma",
        time: "11:00 AM - 12:00 PM",
        room: "Room 301",
      },
      {
        day: "Wednesday",
        className: "CSE-A",
        subject: "Data Structures Lab",
        faculty: "Dr. Rahul Sharma",
        time: "10:00 AM - 12:00 PM",
        room: "Lab 101",
      },
      {
        day: "Wednesday",
        className: "CSE-A",
        subject: "Database Management Lab",
        faculty: "Dr. Neha Kapoor",
        time: "01:00 PM - 03:00 PM",
        room: "Lab 102",
      },
      {
        day: "Thursday",
        className: "CSE-A",
        subject: "Computer Networks",
        faculty: "Prof. Amit Kumar",
        time: "09:00 AM - 10:00 AM",
        room: "Room 305",
      },
      {
        day: "Thursday",
        className: "CSE-A",
        subject: "Operating Systems",
        faculty: "Prof. Priya Singh",
        time: "11:00 AM - 12:00 PM",
        room: "Room 202",
      },
      {
        day: "Friday",
        className: "CSE-A",
        subject: "Software Engineering",
        faculty: "Dr. Rahul Sharma",
        time: "10:00 AM - 11:00 AM",
        room: "Room 301",
      },
      {
        day: "Friday",
        className: "CSE-A",
        subject: "Computer Networks Lab",
        faculty: "Prof. Amit Kumar",
        time: "12:00 PM - 02:00 PM",
        room: "Lab 104",
      },
    ]);
    console.log(`Seeded ${timetable.length} timetable sessions.`);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Database seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();
