// Logica de autenticacioin 
import User from '../user/user.model.js'
import { checkPassword, encrypt } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'

// Test 
export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

// Login 
export const login = async (req, res) => {
    try {
        //Capturar los datops (body)
        let { username, password} = req.body
        //Validar que el usuario exista
        let user = await User.findOne({username})  //findOne({username}) = ({username: username})
        //Verificar que la contraseña coincida
        if(user && await checkPassword(user.password, password)){
            let loggedUser = {  //No puede ir data sencible
                uid: user._id,
                name: user.name,
                username: user.username,
                role: user.role
            }
            //PENDIENTE: generar el Token
            let token = await generateJwt(loggedUser)
            //responder al usuario
            return res.send(
                {
                    message: `Welcome ${user.name}`,
                    loggedUser,
                    token
                }
            )
        }
        return res.status(400).send({message: 'Wrong email or password'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'General error with login fuction'})
    }
}
