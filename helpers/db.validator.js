// Validaciones en relacion a la bd 

import Company from "../src/company/company.model.js"

export const existCompanyName = async (name) => {
    const alreadyCompanyname = await Company.findOne({name: name})
    if(alreadyCompanyname){
        console.error(`Companyname ${name} is already taken`)
        throw new Error(`Companyname ${name} is already taken`)
    }
}