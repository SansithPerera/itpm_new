import User from '../models/user.js';
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password, Gender} = req.body;

 

  const newUser = new User({
    username,
    email,
    password,
    Gender
  });

  try {
    await newUser.save();
    res.json("Signup succes");
  } catch (error) {
    next(error);
  }
};

export const signgin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return res.status(404).json({ message: "user Not found" });
    }

    const token = jwt.sign(
      { id: validUser._id },
      process.env.JWT_SECRET
    );
    const { password: pass, ...rest } = validUser._doc;
    res
      .status(200)
      .cookie("access_token", token, {
        httponly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};



//user update
export const updateUser = async (req, res, next) => {
  
 

 
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          Gender: req.body.Gender,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
          
          
          


        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }

};




// User account deletion
export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId; // Get userId from the URL parameter

    // Find and delete the user by their ID
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with a success message
    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    next(error);
  }
};


export const singOut = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(error);
  }
};



// Read All Inventory Items
export const getAllnote = async (req, res) => {
  try {
    const userall = await User.find();
    res.status(200).json(userall);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
