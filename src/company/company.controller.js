import Company from './company.model.js'
import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

// Test 
export const test = (req, res) => {
    console.log('Company test is running');
    return res.send({ message: 'Company test is running' });
};

// Obtener todas las empresas con filtros y ordenamiento
export const getCompanies = async (req, res) => {
    try {
        const { category, yearsOfExperience, sortAZ, sortZA, sortYAsc, sortYDesc } = req.query;
        let filter = {};

        // Usamos una búsqueda insensible a mayúsculas y minúsculas para el filtro de categoría
        if (category) {
            filter.category = { $regex: new RegExp(category, 'i') }; // 'i' hace que la búsqueda sea insensible a mayúsculas/minúsculas
        }

        if (yearsOfExperience) filter.yearsOfExperience = Number(yearsOfExperience);

        // Configuración de las opciones de ordenamiento
        let sortOptions = {};
        if (sortAZ === 'A-Z') sortOptions.name = 1;
        if (sortZA === 'Z-A') sortOptions.name = -1;
        if (sortYAsc === 'yearsAsc') sortOptions.yearsOfExperience = 1;
        if (sortYDesc === 'yearsDesc') sortOptions.yearsOfExperience = -1;

        // Realizamos la consulta con los filtros y el ordenamiento
        const companies = await Company.find(filter).sort(sortOptions);
        return res.send(companies);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'General error retrieving companies' });
    }
};


// Crear una nueva empresa
export const createCompany = async (req, res) => {
    try {
        const { name, impactLevel, yearsOfExperience, category, address, phone, email } = req.body;

        // Validar datos obligatorios
        if (!name || !impactLevel || !yearsOfExperience || !category) {
            return res.status(400).send({ message: 'Missing required fields' });
        }

        const newCompany = new Company({
            name,
            impactLevel,
            yearsOfExperience,
            category,
            address,
            phone,
            email
        });

        await newCompany.save();
        return res.status(201).send({ message: 'Company created successfully', newCompany });
    } catch (err) {
        console.error(err);

        // Si el error es de validación, devolver un mensaje más detallado
        if (err.name === "ValidationError") {
            return res.status(400).send({
                message: "Validation error",
                errors: err.errors
            });
        }

        return res.status(500).send({ message: "Internal server error" });
    }
};

// Actualizar una empresa
export const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedCompany = await Company.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedCompany) {
            return res.status(404).send({ message: 'Company not found' });
        }

        return res.send({ message: 'Company updated successfully', updatedCompany });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'General error updating company' });
    }
};

const generateReport = async (req, res) => {
    try {
        const companies = await Company.find(); // Obtener empresas de la BD

        if (!companies.length) {
            return res.status(404).send({ message: "No hay empresas registradas." });
        }

        // Definir ruta de la carpeta y archivo
        const reportsDir = path.join(process.cwd(), 'reports');
        const filePath = path.join(reportsDir, 'empresas.xlsx');

        // Crear carpeta 'reports' si no existe
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        // Crear hoja de cálculo
        const worksheet = XLSX.utils.json_to_sheet(companies.map(c => ({
            Nombre: c.name,
            Impacto: c.impactLevel,
            AñosDeExperiencia: c.yearsOfExperience,
            Categoría: c.category,
            Dirección: c.address,
            Contacto: c.phone,
            email: c.email
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Empresas");

        // Guardar archivo
        XLSX.writeFile(workbook, filePath);

        return res.download(filePath);
    } catch (error) {
        console.error("Error generando el reporte:", error);
        return res.status(500).send({ message: "Error al generar el reporte." });
    }
};

export { generateReport };