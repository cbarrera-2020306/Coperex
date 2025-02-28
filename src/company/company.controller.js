import Company from './company.model.js';

// Test 
export const test = (req, res) => {
    console.log('Company test is running');
    return res.send({ message: 'Company test is running' });
};

// Obtener todas las empresas con filtros y ordenamiento
export const getCompanies = async (req, res) => {
    try {
        const { category, yearsOfExperience, sort } = req.query;
        let filter = {};

        if (category) filter.category = category;
        if (yearsOfExperience) filter.yearsOfExperience = Number(yearsOfExperience);

        let sortOptions = {};
        if (sort === 'A-Z') sortOptions.name = 1;
        if (sort === 'Z-A') sortOptions.name = -1;
        if (sort === 'yearsAsc') sortOptions.yearsOfExperience = 1;
        if (sort === 'yearsDesc') sortOptions.yearsOfExperience = -1;

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
