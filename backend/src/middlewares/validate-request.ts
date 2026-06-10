import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

type RequestSchemas = {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
};

export const validateRequest =
  (schemas: RequestSchemas) =>
  (request: Request, _response: Response, next: NextFunction): void => {
    if (schemas.body) {
      request.body = schemas.body.parse(request.body);
    }

    if (schemas.params) {
      request.params = schemas.params.parse(request.params) as Request["params"];
    }

    if (schemas.query) {
      request.query = schemas.query.parse(request.query) as Request["query"];
    }

    next();
  };
