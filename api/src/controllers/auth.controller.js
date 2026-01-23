const {
    registerUser,
    loginUser,
    generateToken,
  } = require("../services/auth.service");
  
  async function register(req, res) {
    try {
      const user = await registerUser(req.body);
      const token = generateToken(user);
  
      res.status(201).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
  
  async function login(req, res) {
    try {
      const user = await loginUser(req.body.email, req.body.password);
      const token = generateToken(user);
  
      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }
  
  module.exports = { register, login };  