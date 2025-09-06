import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-errors.js";

export const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) return next();

    const expectedErrors = []
    errors.array().map((err) =>
        expectedErrors.push({
            [err.path]: err.msg
        }));

    throw new ApiError(422, "data is not valid", expectedErrors)
}