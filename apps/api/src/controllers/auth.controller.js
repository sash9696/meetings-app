import { registerUser } from "../services/auth.service.js";



export async function register(req, res){

    const email  = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');

    if(!email || !password || password.length < 6){
        return res.status(400).json({
            error: 'Valid email and password (min 6 chars) required'
        })
    };

    try {
        const {user, token}  = await registerUser({email, password});

        return res.status(201).json(
            {
                user:{id: user._id.toString(), email:user.email}
            }
        )
    } catch (error) {
        const status = error.statusCode || 500;
        return res.status(status).json({
            error: error.message || 'Registeration failed'
        })
    }
}

export async function login(){

}


export async function me(){

}


export async function logout(){

}