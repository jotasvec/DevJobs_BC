import type { RequestHandler } from "express";
import { UserModel } from "../models/user.js";
import type { UserPublic } from "../types/user.js";
import { handleHttpError } from "../utils/http-errors.js";
import { UserRow } from "@/schemas/users.js";
import { HTTP_STATUS, ERROR_CODES, ROLES, MESSAGES } from "../constants.js";

function toPublic(user: UserRow): UserPublic {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    lastName: user.lastName,
    role: user.role as UserPublic["role"],
    image: user.image,
  };
};

function toRecruiterSafe(user: UserRow) {
  return {
    email: user.email,
    name: user.name,
    lastName: user.lastName,
    role: user.role as UserPublic["role"],
    image: user.image,
    bio: user.bio,
  };
};

export class UsersController {
  static getAll: RequestHandler = (req, res, next) => {
    try {
      const users = UserModel.getAll();

      const currentUserRole = req.user?.role
      let userData;

      if (currentUserRole === ROLES.ADMIN){
        userData = users;
      }else if (currentUserRole === ROLES.RECRUITER){
        userData = users.map(toRecruiterSafe)
      }else {
        userData = users.map(toPublic); 
      }
      

      return res.json({ success: true, data: userData });
    } catch (error) {
      handleHttpError(error, req, res, next);
    }
  };

  static getById: RequestHandler<{ id: string }> = (req, res, next) => {
    try {
      const user = UserModel.getById(req.params.id);

      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: ERROR_CODES.NOT_FOUND,
          message: "User not found",
        });
      }

      const isAdmin = req.user?.role === ROLES.ADMIN;
      const isSelf = req.user?.id === user.id

      const data = (isAdmin || isSelf) ? user : toRecruiterSafe(user);

      return res.json({ success: true, data });
    } catch (error) {
      handleHttpError(error, req, res, next);
    }
  };

  static update: RequestHandler<{ id: string }> = (req, res, next) => {
    try {
      const { name, lastName, role, image, bio } = req.body;
      const user = UserModel.getById(req.params.id);
      
      let updated 
      if(user?.id === req.user?.id){
        updated = UserModel.update(req.params.id, { name, lastName, bio, image });
      }else{
        updated = UserModel.update(req.params.id, { name, lastName, role, bio, image });
      }

      if (!updated) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: ERROR_CODES.NOT_FOUND,
          message: "User not found or no fields to update",
        });
      }


      return res.json({
        success: true,
        message: MESSAGES.USER_UPDATED,
        data: user,
      });
    } catch (error) {
      handleHttpError(error, req, res, next);
    }
  };


  static partialUpdate: RequestHandler<{ id: string }> = (req, res, next) => {
    try {
      const fields: Record<string, unknown> = {};
      console.log('entered')
      const user = UserModel.getById(req.params.id);
     
      const isSelf = user?.id === req.user?.id
      const isAdmin = req.user?.role === ROLES.ADMIN;
      if(!isSelf && !isAdmin) return res.status(403).json({ error: "Cannot edit other users" })

      const allowedFields = isSelf 
        ? ["name", "lastName", "image", "bio"]
        : ["name", "lastName", "role", "image", "bio"]

      for (const key of allowedFields) {
        if (req.body[key] !== undefined) {
          fields[key] = req.body[key];
        }
      }

      if (Object.keys(fields).length === 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: ERROR_CODES.NO_FIELDS_PROVIDED,
          message: MESSAGES.NO_VALID_FIELDS,
        });
      }
     
      const updated = UserModel.update(req.params.id, fields);
      const updatedUser = UserModel.getById(req.params.id);

     
      if (!updated) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: ERROR_CODES.NOT_FOUND,
          message: "User not found",
        });
      }

      return res.json({
        success: true,
        message: MESSAGES.USER_UPDATED,
        data: updatedUser,
      });
    } catch (error) {
      handleHttpError(error, req, res, next);
    }
  };

  static delete: RequestHandler<{ id: string }> = (req, res, next) => {
    try {
      const deleted = UserModel.delete(req.params.id);

      if (!deleted) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: ERROR_CODES.NOT_FOUND,
          message: "User not found",
        });
      }

      return res.status(HTTP_STATUS.NO_CONTENT).json({
        success: true,
        message: MESSAGES.USER_DELETED,
      });
    } catch (error) {
      handleHttpError(error, req, res, next);
    }
  };
}
