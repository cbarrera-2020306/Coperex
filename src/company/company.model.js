import mongoose, {Schema, model} from "mongoose"
import { CompanyCategories } from "../../utils/companyCategories.js";

const CompanySchema = Schema(
    {
    name: { 
        type: String, 
        required: true 
    },
    impactLevel: { 
        type: String, 
        required: true, 
        enum: ['Alto', 'Medio', 'Bajo'] 
    },
    yearsOfExperience: { 
        type: Number, 
        required: true, 
        min: 0 },
    category: { 
        type: String, 
        required: true,
        enum:{
            values: Object.values(CompanyCategories),
            message: '{VALUE} is not a valid category. Please use one valida category.'
        },
        set: (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    },
    address: { 
        type: String, 
        required: false 
    },
    phone: { 
        type: String, 
        required: false,
        maxLength: [13, `Can't be overcome 8 numbers`],
        minLength: [8, `Phone must be 8 numbers`]
    },
    email: { 
        type: String, 
        required: false, 
        match: /\S+@\S+\.\S+/ }
    }, 
    { timestamps: true }
);

export default model('Company', CompanySchema);
