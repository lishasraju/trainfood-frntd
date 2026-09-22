import { db, verifyPassword, createToken } from '../config/database.js';

/**
 * Handle User & Admin Login
 */
export async function login(req, res) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email address and password.'
      });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials.'
      });
    }

    const isValid = verifyPassword(password, user.salt, user.password_hash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials.'
      });
    }

    // Role-specific enforcement if specified in the login flow
    if (role && role === 'admin' && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: This account does not possess IRCTC Station Admin or Pantry privileges. Please use the Passenger login tab.'
      });
    }

    if (role && role === 'user' && user.role === 'admin') {
      // Allow admin to also login or notify
    }

    const token = createToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    const { salt, password_hash, ...safeUser } = user;

    res.json({
      success: true,
      message: user.role === 'admin' 
        ? `Welcome back, Station Pantry Officer ${user.name}!` 
        : `Welcome back, ${user.name}!`,
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'An unexpected server error occurred during login. Please try again.'
    });
  }
}

/**
 * Handle Passenger or Admin Registration
 */
export async function register(req, res) {
  try {
    const { name, email, phone, password, role = 'user', admin_secret, pnr, coach, berth } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your name, email address, and a secure password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Check if role is admin and validate admin secret key
    let assignedRole = 'user';
    if (role === 'admin') {
      if (admin_secret !== 'IRCTC-ADMIN-2026' && admin_secret !== 'admin123') {
        return res.status(403).json({
          success: false,
          message: 'Invalid IRCTC Station Admin Authorization Key. Please contact system dispatch.'
        });
      }
      assignedRole = 'admin';
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in.'
      });
    }

    const newUser = db.createUser({
      name,
      email,
      phone,
      password,
      role: assignedRole,
      pnr,
      coach,
      berth
    });

    const token = createToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name
    });

    res.status(201).json({
      success: true,
      message: assignedRole === 'admin'
        ? 'Station Pantry Admin account registered successfully!'
        : 'Passenger account created successfully! Welcome to RailBite.',
      token,
      user: newUser
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'An error occurred while creating your account.'
    });
  }
}

/**
 * Get current authenticated user profile
 */
export async function getMe(req, res) {
  try {
    const user = db.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.'
      });
    }

    const { salt, password_hash, ...safeUser } = user;
    const userOrders = db.getOrdersByUser(user.id, user.email, user.phone);

    res.json({
      success: true,
      user: safeUser,
      orders_count: userOrders.length,
      recent_orders: userOrders.slice(0, 5)
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile.'
    });
  }
}

/**
 * Update user profile details
 */
export async function updateProfile(req, res) {
  try {
    const { name, phone, coach, berth, pnr, password } = req.body;
    const updatedUser = db.updateUser(req.user.id, {
      name,
      phone,
      coach,
      berth,
      pnr,
      password
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile.'
    });
  }
}

/**
 * Get all orders placed by the current user
 */
export async function getMyOrders(req, res) {
  try {
    const orders = db.getOrdersByUser(req.user.id, req.user.email, req.user.phone);
    res.json({
      success: true,
      data: orders
    });
  } catch (err) {
    console.error('Get user orders error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user orders.'
    });
  }
}

/**
 * Logout
 */
export async function logout(req, res) {
  res.json({
    success: true,
    message: 'Logged out successfully.'
  });
}
