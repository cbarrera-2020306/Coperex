// Rutas de funciones de usuario
import { Router } from "express"
import { login, test } from "./user.controller.js"
import { validateJwt} from '../../middlewares/validate.jwt.js'
import {  LoginValidator } from "../../helpers/validators.js"


const api = Router()

api.post('/login',[LoginValidator], login)

//Rutas privadas
                //Middleware
api.get('/test', validateJwt, test)

export default api