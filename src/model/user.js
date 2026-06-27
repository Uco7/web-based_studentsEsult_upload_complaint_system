const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please fill a valid email address',
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 8, // Minimum password length
  },
  lname: {
    type: String,
    required: true,
  },
  phone_no: {
    type: String,
    required: true,
    match: [
      /^\+?\d{1,4}[-\s]?\d{1,15}$/,
      'Please fill a valid phone number',
    ],
  },
  address: {
    type: String,
    required: true,
  },
  date_of_birth: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        const today = new Date();
        const birthDate = new Date(value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age >= 18;
      },
      message: 'User must be at least 18 years old',
    },
  },
  state: {
    type: String,
    required: true,
  },
  LGA: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other'], // Ensure gender is one of the specified values
  },
  middle_name: {
    type: String,
  },
  department: {
    type: String,
    required: true,
  },
  matric: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\d{4}\/[A-Z]+\/\d+$/,
      'Please fill a valid matric number',
    ],
  },
  role: {
    type: String,
    required: true,
    enum: ['student', 'admin'], // Ensure role is one of the specified values
  },
  profileImage: {
    type: String,
    required: true // Storing the image as a base64 string
  },
  imageType: {
    type: String,
    required: true 
  }
});

// 1. Fixed Pre-save Hook: Removed 'next' callback parameter since this is async
userSchema.pre("save", async function() {
    // Only hash the password if it is new or being explicitly updated
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// 2. Fixed Login Static Method: Standardized response messages for security
userSchema.statics.login = async function(matric, password) {
    const userExist = await this.findOne({ matric });
    
    if (userExist) {
        const isPswMatch = await bcrypt.compare(password, userExist.password);
        if (isPswMatch) {
            return userExist;
        } 
    }
    
    // Unified generic message prevents attackers from mapping valid matriculations
    throw new Error("Invalid matric number or password.");
};

const User = mongoose.model('User', userSchema);

module.exports = User;
