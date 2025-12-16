import usermodel from '../models/user.js';
import bodyParser from 'body-parser';
export const signup = async(req, res) => {
    // Registration logic here4
    try {
      const {name,email,password}=req.body;
      const user = await usermodel.findone({email})
        if(user){
            return res.status(400).json({error:"User already exists"})
        }
        const usermodel = new usermodel({name ,email,password});
        usermodel.password = await bycrypt.hasj(password,10);
        await usermodel.save();
        res.status(201).json({message:"signup successfull"});


      
    } catch (error) {
        res.status(500).json({error:"Internal server error"});
    }
};

export default {
    signup
};