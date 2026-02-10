const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const ApiError = require("../utils/apiError");
const User = require("../models/user.model");
const { createTokenPair } = require("../utils/token");
const { sendEmail, hasSMTP } = require("../utils/email");

const requireEmailVerification =
  String(process.env.REQUIRE_EMAIL_VERIFICATION || "false") === "true";

const signAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

const signRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "30d",
  });

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const setRefreshCookie = (res, refreshToken) => {
  if (String(process.env.USE_COOKIES || "false") !== "true") return;
  const maxAgeMs = 1000 * 60 * 60 * 24 * 30;
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: maxAgeMs,
  });
};

const clearRefreshCookie = (res) => {
  if (String(process.env.USE_COOKIES || "false") !== "true") return;
  res.clearCookie("refreshToken");
};

const buildVerifyEmailLink = (token) => {
  const base = process.env.APP_URL || "http://localhost:5173";
  return `${base}/verify-email?token=${token}`;
};

const buildResetPasswordLink = (token) => {
  const base = process.env.APP_URL || "http://localhost:5173";
  return `${base}/reset-password?token=${token}`;
};

const issueTokens = async (user, res) => {
  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);
  const hashed = hashToken(refreshToken);

  user.refreshTokens = (user.refreshTokens || []).filter(Boolean);
  user.refreshTokens.push({ token: hashed });
  user.refreshTokens = user.refreshTokens.slice(-5);
  await user.save();

  setRefreshCookie(res, refreshToken);
  return { accessToken, refreshToken };
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      throw new ApiError(409, "Email already in use");
    }

    const user = await User.create({ name, email, password });

    const { raw, hashed } = createTokenPair();
    user.emailVerificationToken = hashed;
    user.emailVerificationExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const verifyLink = buildVerifyEmailLink(raw);
    const emailSent = await sendEmail({
      to: email,
      subject: "Verify your email",
      text: `Verify your email: ${verifyLink}`,
    });

    if (requireEmailVerification) {
      return res.status(201).json({
        success: true,
        message: "Registration successful. Please verify your email.",
        ...(process.env.NODE_ENV !== "production" && !emailSent
          ? { verificationToken: raw }
          : {}),
      });
    }

    const tokens = await issueTokens(user, res);
    return res.status(201).json({
      success: true,
      ...tokens,
      ...(process.env.NODE_ENV !== "production" && !emailSent
        ? { verificationToken: raw }
        : {}),
    });
  } catch (err) {
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, "Invalid credentials");
    }

    if (requireEmailVerification && !user.emailVerified) {
      throw new ApiError(403, "Email not verified");
    }

    const tokens = await issueTokens(user, res);
    return res.json({ success: true, ...tokens });
  } catch (err) {
    return next(err);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const refreshToken =
      req.body.refreshToken || req.cookies?.refreshToken || "";
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token required");
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const hashed = hashToken(refreshToken);

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    const exists = user.refreshTokens.some((t) => t.token === hashed);
    if (!exists) {
      throw new ApiError(401, "Invalid refresh token");
    }

    user.refreshTokens = user.refreshTokens.filter((t) => t.token !== hashed);
    await user.save();

    const tokens = await issueTokens(user, res);
    return res.json({ success: true, ...tokens });
  } catch (err) {
    return next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const refreshToken =
      req.body.refreshToken || req.cookies?.refreshToken || "";
    if (refreshToken) {
      const hashed = hashToken(refreshToken);
      const decoded = jwt.decode(refreshToken);
      if (decoded?.id) {
        const user = await User.findById(decoded.id);
        if (user) {
          user.refreshTokens = user.refreshTokens.filter(
            (t) => t.token !== hashed
          );
          await user.save();
        }
      }
    }

    clearRefreshCookie(res);
    return res.json({ success: true });
  } catch (err) {
    return next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    const hashed = hashToken(token);

    const user = await User.findOne({
      emailVerificationToken: hashed,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new ApiError(400, "Invalid or expired token");
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return res.json({ success: true });
  } catch (err) {
    return next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: true });
    }

    const { raw, hashed } = createTokenPair();
    user.passwordResetToken = hashed;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const resetLink = buildResetPasswordLink(raw);
    const emailSent = await sendEmail({
      to: email,
      subject: "Reset your password",
      text: `Reset your password: ${resetLink}`,
    });

    return res.json({
      success: true,
      ...(process.env.NODE_ENV !== "production" && !emailSent
        ? { resetToken: raw }
        : {}),
    });
  } catch (err) {
    return next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const hashed = hashToken(token);

    const user = await User.findOne({
      passwordResetToken: hashed,
      passwordResetExpires: { $gt: new Date() },
    }).select("+password");

    if (!user) {
      throw new ApiError(400, "Invalid or expired token");
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshTokens = [];
    await user.save();

    return res.json({ success: true });
  } catch (err) {
    return next(err);
  }
};
