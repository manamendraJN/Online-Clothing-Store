const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//hash password
exports.hashPassword = async (password) =>{
    return new Promise((resolve, reject) =>{
        //generate the salt around 10
        bcrypt.genSalt(10,(err,salt)=>{
            if(err)
                reject('error creating salt');

            //hash password 
            bcrypt.hash(password,salt,(err,hash)=>{
                if(err)
                    reject('error hashing password');
                resolve(hash);
            })
        })
    })
};


//compare password with hashed password
exports.comparePassword = async(password,hashed)=>{
    try{
        return await bcrypt.compare(password,hashed);
    } catch(err){
        throw new Error(`Error comparing passwords:${error.message}`);
    }
};



// generate token
exports.generateToken = async (user) =>{
    try {
        //sign user details with token
        return await jwt.sign(
            { _id: user._id,email: user.email,password: user.password,role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        );
    } catch (error) {
        throw new Error(`error generating token: ${error.message}`);
    }
};


// verify token
exports.verifyToken = async (token) =>{
    try {
        return await jwt.verify(token,process.env.JWT_SECRET);
    } catch (error) {
        throw new Error(`error verifying token: ${error.message}`);
    }
};