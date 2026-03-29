import { User } from "../models/User.js";
import { loginUser, registerUser } from "../services/auth.service.js";

export async function register(req, res) {
  const email = String(req.body?.email || "")
    .trim()
    .toLowerCase();
  const password = String(req.body?.password || "");

  if (!email || !password || password.length < 6) {
    return res.status(400).json({
      error: "Valid email and password (min 6 chars) required",
    });
  }

  try {
    const { user, token } = await registerUser({ email, password });

    return res.status(201).json({
      user: { id: user._id.toString(), email: user.email },
      token,
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      error: error.message || "Registeration failed",
    });
  }
}

export async function login(req, res) {
  const email = String(req.body?.email || "")
    .trim()
    .toLowerCase();
  const password = String(req.body?.password || "");

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required",
    });
  }

  try {
    const { user, token } = await loginUser({ email, password });

    return res.json({
      user: { id: user._id.toString(), email: user.email },
      token,
    });
  } catch (error) {
    const status = error.statusCode || 500;

    return res.status(status).json({
      error: error.message || "Login failed",
    });
  }
}

// curl -s -X POST http://localhost:3000/api/auth/login \
//   -H 'Content-Type: application/json' \
//   -d '{"email":"a@test.com","password":"secret12"}' | jq

export async function me(req, res) {
  try {
    const user = await User.findById(req, userId).select("email").lean();
    if (!user)
      return res.status(404).json({
        error: "User not found",
      });

    return res.json({
      user: { id: user._id.toString(), email: user.email },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to load the user",
    });
  }
}


// TOKEN="paste-from-login-response"
// curl -s http://localhost:3000/api/auth/me \
//   -H "Authorization: Bearer $TOKEN" | jq

export async function logout() {}
