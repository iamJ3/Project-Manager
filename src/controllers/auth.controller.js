import { User } from "../models/user.model.js"
import { ApiError } from '../utils/api-errors.js'
import { ApiResponse } from "../utils/api-response.js"
import { asyncHandler } from '../utils/asyncHandler.js'
import { emailVerification, sendEmail } from "../utils/mail.js"
import jwt from "jsonwebtoken"

//  * Generates access and refresh tokens for a user and saves the refresh token in the database.
const generateAccessandRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshtoken = user.generateRefreshToken();

        // Save the refresh token to the user document
        user.refreshToken = refreshtoken
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshtoken };

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating token")
    }
};

// Registers a new user.
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
});

const login = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;
    const user = await User.findOne({ email });

    if (!email) throw new ApiError(400, "Username or email is required");

    if (!user) throw new ApiError(400, "User Doesnt Exist")

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) throw new ApiError("Error wrong password");

    const { accessToken, refreshtoken } = await generateAccessandRefreshToken(user._id);
    const loggedinUser = await User.findById(user._id).select(
        "-Password -refreshToken -emailVerificationExpiry -emailVerificationToken"
    )

    const options = {
        httpOnly: true,
        secure: true,

    }

    return res.status(200).cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshtoken, options).json(new ApiResponse(200, {
            user: loggedinUser,
            accessToken,
            refreshtoken
        },
            "User logged in succesfuly"
        ))

});

const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: "",
        },
    },
        {
            new: true,
        },
    );
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"))
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200)
        .json(new ApiResponse(200,
            req.user,
            "current user fetched succesfully"))
});

const verifyEmail = asyncHandler(async (req, res) => {
    const { verificationToken } = req.params;
    if (!verificationToken) throw new ApiError(400, "Email verification token is missing")

    let hasehedToken = crypto.createHash('sha256')
        .update(verificationToken)
        .digest('hex')

    const user = await User.findOne({
        emailVerificationToken: hasehedToken,
        emailVerificationExpiry: { $gt: Date.now() }

    })
    if (!user) throw new ApiError(400, "token verification failed");

    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;

    user.isEmailVerified = true;
    await user.save({ validateBeforeSave: false });

    return res.status(200)
        .json(
            new ApiResponse(
                200, {
                isEmailVerified
            },
                "email is verified"
            )
        )
});

const resendEmailVerification = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id);
    if (!user) throw new ApiError(404, "user dosnt exist");

    if (user.isEmailVerified) throw new ApiError(409, "Email is alrady verified");

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

    return res.status(200)
        .json(new ApiResponse(200, {}, "mail has been sent to ur emial id"))
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) throw new ApiError(401, "unathorized access");

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id)

        if (!user) throw new ApiError(401, "invalid refresh Token");
        if (incomingRefreshToken !== user?.refreshToken) throw new ApiError(401, "refresh Token has expired");

        const options = {
            httpOnly: true,
            secure: true,
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessandRefreshToken(user._id);

        user.refreshToken = newRefreshToken;
        await user.save();
        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(200,
                { accessToken, refreshToken: newRefreshToken },
                "Access token refreshed"
            ));

    } catch (error) {
        console.log(error);
        throw new ApiError(401, "invalid refresh Token");
    }

})
// const getCurrentUser = asyncHandler(async(req,res)=>{

// })



export {
    registerUser,
    login,
    logOutUser,
    getCurrentUser,
    verifyEmail,
    resendEmailVerification,
    refreshAccessToken
};