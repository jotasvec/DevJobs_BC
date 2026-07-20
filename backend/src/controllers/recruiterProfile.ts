import type { RequestHandler } from "express";
import { RecruiterProfileModel } from "../models/recruiterProfile.js";
import { handleHttpError } from "../utils/http-errors.js";
import { HTTP_STATUS, MESSAGES } from "../constants.js";

export class RecruiterProfileController {
  static getOwn: RequestHandler = (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Authentication required",
        });
      }

      const profile = RecruiterProfileModel.getByUserId(userId);

      return res.json({ success: true, data: profile });
    } catch (error) {
      handleHttpError(error, req, res, next);
    }
  };

  static updateOwn: RequestHandler = (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Authentication required",
        });
      }

      RecruiterProfileModel.upsert(userId, req.body);

      const profile = RecruiterProfileModel.getByUserId(userId);

      return res.json({
        success: true,
        message: MESSAGES.PROFILE_UPDATED,
        data: profile,
      });
    } catch (error) {
      handleHttpError(error, req, res, next);
    }
  };

  static getByUserId: RequestHandler<{ userId: string }> = (req, res, next) => {
    try {
      const profile = RecruiterProfileModel.getByUserId(req.params.userId);

      if (!profile) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: "Recruiter profile not found",
        });
      }

      return res.json({ success: true, data: profile });
    } catch (error) {
      handleHttpError(error, req, res, next);
    }
  };
}
