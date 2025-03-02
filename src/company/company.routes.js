import { Router } from "express";
import { test, getCompanies, createCompany, updateCompany,generateReport } from "./company.controller.js";
import { validateJwt, validateAdmin } from "../../middlewares/validate.jwt.js";
import { CompanyValidator, CompanyValidatorU } from "../../helpers/validators.js";

const api = Router();

// Rutas protegidas con validación JWT
api.get('/test', [validateJwt,validateAdmin], test);
api.get('/', [validateJwt,validateAdmin], getCompanies);
api.post('/register', [validateJwt,validateAdmin, CompanyValidator], createCompany);
api.put('/:id', [validateJwt,validateAdmin,CompanyValidatorU], updateCompany);
api.get("/generate-report", [validateJwt, validateAdmin], generateReport);

export default api;
