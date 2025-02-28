// Validar campos en las rutas
import { body } from "express-validator";  //Capturar todo el body de la solicitud
import { validateErrors} from "./validate-error.js";
import { existCompanyName } from "./db.validator.js";

export const LoginValidator = [
    body('username', 'Username cannot by empty ').notEmpty().toLowerCase(),
    body('password', 'Password cannot by empty').notEmpty().isStrongPassword().isLength({min: 8}),
    validateErrors
]

export const CompanyValidator = [
    body('name', 'Name cannot be empty').notEmpty().custom(existCompanyName),
    body('impactLevel', 'Impact level cannot be empty').notEmpty()
        .isIn(["Alto", "Medio", "Bajo"]).withMessage("Impact level must be 'Alto', 'Medio' or 'Bajo'"),
    body('yearsOfExperience', 'Years of experience must be a positive number')
        .notEmpty().isInt({ min: 0 }),
    body('category', 'Category cannot be empty').notEmpty(),
    body('email', 'Invalid email format').optional().isEmail(),
    body('phone', 'Invalid phone number').optional().isMobilePhone(),

    validateErrors
];

export const CompanyValidatorU = [
    body('name', 'Name cannot be empty').optional().custom(existCompanyName),
    body('impactLevel', 'Impact level cannot be empty').optional()
        .isIn(["Alto", "Medio", "Bajo"]).withMessage("Impact level must be 'Alto', 'Medio' or 'Bajo'"),
    body('yearsOfExperience', 'Years of experience must be a positive number')
        .optional().isInt({ min: 0 }),
    body('category', 'Category cannot be empty').optional(),
    body('email', 'Invalid email format').optional().isEmail(),
    body('phone', 'Invalid phone number').optional().isMobilePhone(),

    validateErrors
];
