import { User } from "../models/user.model.js"
import { ApiError } from '../utils/api-errors.js'
import { ApiResponse } from "../utils/api-response.js"
import { asyncHandler } from '../utils/asyncHandler.js'
import { emailVerification, sendEmail } from "../utils/mail.js"

/**
 * Generates access and refresh tokens for a user and saves the refresh token in the database.
 * @param {String} userId - The ID of the user.
 * @returns {Object} - Object containing accessToken and refreshtoken.
 */
const generateAccessandRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshtoken = user.generateRefreshToken();

        // Save the refresh token to the user document
        user.refreshToken = refreshtoken
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshtoken }
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating token")
    }
}

/**
 * Registers a new user.
 * - Checks if the username or email already exists.
 * - Creates a new user and generates a temporary email verification token.
 * - Sends a verification email to the user.
 * - Returns the created user (excluding sensitive fields).
 */
const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    // Check if user with the same username or email already exists
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existingUser) throw new ApiError(409, "Username Already Exist", [])

    // Create new user (email verification set to true for now)
    const user = await User.create({
        email, password, username, isEmailVerified: true
    })

    // Generate temporary email verification token
    const { unHasehedToken, hasedToken, TokenExpiry } = user.generateTemproryToken();

    user.emailVerificationToken = hasedToken
    user.emailVerificationExpiry = TokenExpiry

    // Save user with verification token
    await user.save({ validateBeforeSave: false })

    // Send verification email to the user
    await sendEmail({
        email: user?.email,
        subject: "verify ur email",
        mailgenContent: emailVerification(user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHasehedToken}`
        )
    })

    // Fetch the created user, excluding sensitive fields
    const createduser = await User.findById(user._id).select(
        "-Password -refreshToken -emailVerificationExpiry -emailVerificationToken"
    )
    if (!createduser) throw new ApiError(500, "something went wrong while regestrign the user")

    // Send success response
    return res.status(201)
        .json(new ApiResponse(200, { user: createduser },
            "user registered successfully"
        ))
})

export { registerUser }