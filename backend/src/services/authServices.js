const { getUserByEmail, createUser } = require("../models/User");
const bcrypt = require("bcrypt");
const jwtUtils = require("../utils/jwUtils");

const loginUser = async (email, password, role) => {
  // Fetch user from the database
  const user = await getUserByEmail(email);

  // Check if user exists
  if (!user) {
    throw new Error("User not found");
  }

  // Check if the role matches
  if (user.role !== role) {
    throw new Error("Invalid role");
  }

  // Compare the provided password with the hashed password in the database
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // Generate JWT token
  const token = jwtUtils.generateToken(user);
  return { user, token };
};

const registerUser = async (email, password, role, name) => {
  // Check if user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  const user = await createUser(email, hashedPassword, role, name);

  // Generate JWT token
  const token = jwtUtils.generateToken(user);
  return { user, token };
};

module.exports = { loginUser, registerUser };
