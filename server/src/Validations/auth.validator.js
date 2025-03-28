const User = require('../models/User.Model');


//validate firstName
const validateFirstName = (firstName) =>{
    if(firstName === undefined || firstName === null || firstName === ''){
        return 'First Name is required';
    }
    return null;
}


//validate lastName
const validateLastName = (lastName) =>{
    if(lastName === undefined || lastName === null || lastName === ''){
        return 'Last Name is required';
    }
    return null;
}

//validate email
const validateEmail = async(email) =>{
    if(email === undefined || email === null || email === ''){
        return 'Email is required';
    }
    const existUser = await User.findOne({ email: email });
    if(existUser){
        return 'Email is already taken';
    }
};


//validate password
const validatePassword = (password) =>{
    if(password === undefined || password === null || password === ''){
        return 'Password is required';
    }
    return null;
}

module.exports ={validateFirstName,validateLastName,validateEmail,validatePassword};