import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: "Signup successful" });

  } catch (error) {
    console.error("Signup error:", error); // 👈 IMPORTANT
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
  
    
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    // compare password
    const isMatch = await bcrypt.compare(password, user.password);        
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  } 
}
