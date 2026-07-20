import type { RequestHandler } from "express";
import { CompanyModel } from "../models/company.js";
import { handleHttpError } from "../utils/http-errors.js";
import { HTTP_STATUS, ERROR_CODES, MESSAGES, ROLES } from "../constants.js";

export class CompanyController {
  static getAll: RequestHandler = (req, res, next) => {
    try {
      const companies = CompanyModel.getAll();
      return res.json({ success: true, data: companies });
    } catch (error) {
      handleHttpError(error, req, res, next);
    }
  };

  static getById: RequestHandler<{ id: string }> = (req, res, next) => {
    try {
      const company = CompanyModel.getById(req.params.id);

      if (!company) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: ERROR_CODES.NOT_FOUND,
          message: "Company not found",
        });
      }

      return res.json({ success: true, data: company });
    } catch (error) {
      handleHttpError(error, req, res, next);
    }
  };

  static create: RequestHandler = (req, res, next) => {
    try {
      const existing = CompanyModel.getByName(req.body.name);
      if (existing) {
        return res.status(HTTP_STATUS.CONFLICT).json({
          success: false,
          error: "COMPANY_EXISTS",
          message: `Company "${req.body.name}" already exists`,
        });
      }

      const company = CompanyModel.create(req.body);

      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: MESSAGES.COMPANY_CREATED,
        data: company,
      });
    } catch (error) {
      handleHttpError(error, req, res, next);
    }
  };

  static update: RequestHandler<{ id: string }> = (req, res, next) => {
    try {
      const existing = CompanyModel.getById(req.params.id);
      if (!existing) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: ERROR_CODES.NOT_FOUND,
          message: "Company not found",
        });
      }

      CompanyModel.update(req.params.id, req.body);

      const company = CompanyModel.getById(req.params.id);

      return res.json({
        success: true,
        message: MESSAGES.COMPANY_UPDATED,
        data: company,
      });
    } catch (error) {
      handleHttpError(error, req, res, next);
    }
  };

  static delete: RequestHandler<{ id: string }> = (req, res, next) => {
    try {
      const deleted = CompanyModel.delete(req.params.id);

      if (!deleted) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: ERROR_CODES.NOT_FOUND,
          message: "Company not found",
        });
      }

      return res.status(HTTP_STATUS.NO_CONTENT).json({
        success: true,
        message: MESSAGES.COMPANY_DELETED,
      });
    } catch (error) {
      handleHttpError(error, req, res, next);
    }
  };
}
