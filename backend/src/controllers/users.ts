import type { RequestHandler } from "express";
import { UserModel } from "../models/user.js";
import type { UserPublic } from "../types/user.js";
import type { ApiResponse } from "../types/index.js";
import { handleHttpError } from "../utils/http-errors.js";

function toPublic(user: { id: string; email: string; name: string; role: string; image: string | null }): UserPublic {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as UserPublic["role"],
    image: user.image,
  };
}

export class UsersController {
  static getAll: RequestHandler = (req, res, next) => {
    try {
      const users = UserModel.getAll();
      const isAdmin = req.user?.role === "admin";

      const data = isAdmin ? users : users.map(toPublic);

      return res.json({ success: true, data });
    } catch (error) {
      handleHttpError(error, req, res, next);
    }
  };

  static getById: RequestHandler<{ id: string }> = (req, res, next) => {
    try {
      const user = UserModel.getById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "NOT_FOUND",
          message: "User not found",
        });
      }

      const isAdmin = req.user?.role === "admin";
      const data = isAdmin ? user : toPublic(user);

      return res.json({ success: true, data });
    } catch (error) {
      handleHttpError(error, req, res, next);
    }
  };

  static update: RequestHandler<{ id: string }> = (req, res, next) => {
    try {
      const { name, role, avatar, bio, resume, skills } = req.body;

      const updated = UserModel.update(req.params.id, { name, role, avatar, bio, resume, skills });

      if (!updated) {
        return res.status(404).json({
          success: false,
          error: "NOT_FOUND",
          message: "User not found or no fields to update",
        });
      }

      const user = UserModel.getById(req.params.id);

      return res.json({
        success: true,
        message: "User updated successfully",
        data: user,
      });
    } catch (error) {
      handleHttpError(error, req, res, next);
    }
  };

  static partialUpdate: RequestHandler<{ id: string }> = (req, res, next) => {
    try {
      const allowedFields = ["name", "role", "avatar", "bio", "resume", "skills"];
      const fields: Record<string, unknown> = {};

      for (const key of allowedFields) {
        if (req.body[key] !== undefined) {
          fields[key] = req.body[key];
        }
      }

      if (Object.keys(fields).length === 0) {
        return res.status(400).json({
          success: false,
          error: "NO_FIELDS",
          message: "No valid fields provided to update",
        });
      }

      const updated = UserModel.update(req.params.id, fields);

      if (!updated) {
        return res.status(404).json({
          success: false,
          error: "NOT_FOUND",
          message: "User not found",
        });
      }

      const user = UserModel.getById(req.params.id);

      return res.json({
        success: true,
        message: "User updated successfully",
        data: user,
      });
    } catch (error) {
      handleHttpError(error, req, res, next);
    }
  };

  static delete: RequestHandler<{ id: string }> = (req, res, next) => {
    try {
      const deleted = UserModel.delete(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: "NOT_FOUND",
          message: "User not found",
        });
      }

      return res.status(204).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      handleHttpError(error, req, res, next);
    }
  };
}
