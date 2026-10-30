const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const { auth, requireRole } = require("../middleware/auth");

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || "acadexa_jwt_secret_token_key_2026_secure",
    { expiresIn: "7d" }
  );
};

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Status check
    if (user.status === "Inactive") {
      return res.status(403).json({
        message: "Your account is deactivated. Please contact the administrator.",
      });
    }

    // Role check if provided
    if (role && user.role !== role) {
      return res.status(403).json({
        message: `Account is registered as ${user.role}, not ${role}`,
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    // Also fetch associated student or faculty details if available
    let profileData = {};
    if (user.role === "student" && user.rollNo) {
      const student = await Student.findOne({ rollNo: user.rollNo });
      if (student) profileData = student.toObject();
    } else if (user.role === "faculty" && user.employeeId) {
      const faculty = await Faculty.findOne({ employeeId: user.employeeId });
      if (faculty) profileData = faculty.toObject();
    }

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNo: user.rollNo,
        employeeId: user.employeeId,
        department: user.department,
        className: user.className,
        avatar: user.avatar,
        profile: profileData,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, rollNo, employeeId, department, className, designation, course, semester } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    const userRole = role || "student";

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: userRole,
      rollNo: rollNo ? rollNo.trim() : "",
      employeeId: employeeId ? employeeId.trim() : "",
      department: department ? department.trim() : "",
      className: className ? className.trim() : "",
      status: "Active",
    });

    await user.save();

    // Auto-create or sync corresponding Student or Faculty record if applicable
    if (userRole === "student" && user.rollNo) {
      const existingStudent = await Student.findOne({ rollNo: user.rollNo });
      if (!existingStudent) {
        await Student.create({
          name: user.name,
          rollNo: user.rollNo,
          course: course || user.department || "B.Tech CSE",
          className: user.className || "CSE-A",
          semester: Number(semester) || 1,
          email: user.email,
          status: "Active",
        });
      }
    } else if (userRole === "faculty" && user.employeeId) {
      const existingFaculty = await Faculty.findOne({ employeeId: user.employeeId });
      if (!existingFaculty) {
        await Faculty.create({
          name: user.name,
          employeeId: user.employeeId,
          department: user.department || "Computer Science",
          designation: designation || "Assistant Professor",
          email: user.email,
          status: "Active",
        });
      }
    }

    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNo: user.rollNo,
        employeeId: user.employeeId,
        department: user.department,
        className: user.className,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Failed to register user", error: error.message });
  }
});

// GET /api/auth/me
router.get("/me", auth, async (req, res) => {
  try {
    let profileData = {};
    if (req.user.role === "student" && req.user.rollNo) {
      const student = await Student.findOne({ rollNo: req.user.rollNo });
      if (student) profileData = student.toObject();
    } else if (req.user.role === "faculty" && req.user.employeeId) {
      const faculty = await Faculty.findOne({ employeeId: req.user.employeeId });
      if (faculty) profileData = faculty.toObject();
    }

    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        rollNo: req.user.rollNo,
        employeeId: req.user.employeeId,
        department: req.user.department,
        className: req.user.className,
        avatar: req.user.avatar,
        profile: profileData,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user data", error: error.message });
  }
});

// PUT /api/auth/profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, department, className, avatar, phone, address } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (department) user.department = department;
    if (className) user.className = className;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    // If student, update student table as well
    if (user.role === "student" && user.rollNo) {
      await Student.findOneAndUpdate(
        { rollNo: user.rollNo },
        { $set: { name: user.name, phone, address } }
      );
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNo: user.rollNo,
        employeeId: user.employeeId,
        department: user.department,
        className: user.className,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
});

// ==========================================
// ADMIN USER CREDENTIAL MANAGEMENT
// ==========================================

// GET /api/auth/users — Admin gets all stored user accounts & credentials
router.get("/users", auth, requireRole("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
});

// PUT /api/auth/users/:id/status — Admin toggles user status (Active / Inactive)
router.put("/users/:id/status", auth, requireRole("admin"), async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({ message: "Status must be Active or Inactive" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deactivating own admin account
    if (user._id.toString() === req.user._id.toString() && status === "Inactive") {
      return res.status(400).json({ message: "You cannot deactivate your own admin account" });
    }

    user.status = status;
    await user.save();

    // Also sync status with student/faculty record if applicable
    if (user.role === "student" && user.rollNo) {
      await Student.findOneAndUpdate({ rollNo: user.rollNo }, { status });
    } else if (user.role === "faculty" && user.employeeId) {
      await Faculty.findOneAndUpdate({ employeeId: user.employeeId }, { status });
    }

    res.json({ message: `User status changed to ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user status", error: error.message });
  }
});

// DELETE /api/auth/users/:id — Admin removes user credentials
router.delete("/users/:id", auth, requireRole("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot delete your own admin account" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
});

module.exports = router;
