
//email validation
const validateEmail =(email)=>{
    if(!email){
        return "Email is required"
    }
    if(!/\S+@\S+\.\S+/.test(email)){
        return "Email is invalid"
    }
    return null;
}

//password validation
const validatePassword =(password)=>{
    if(!password){
        return "Password is required"
    }
    if(password.length<8){
        return "Password must be at least 8 characters"
    }
    if(!/[A-Z]/.test(password)){
        return "Password must contain at least one uppercase letter"
    }
    if(!/[a-z]/.test(password)){
        return "Password must contain at least one lowercase letter"
    }
    if(!/[@$!%*?&#]/.test(password)){
        return "Password must contain at least one special character"
    }
    return null;
    
}


//userFirstName Validation
const validateFirstName = (firstName) =>{
    if(!firstName){
        return "First Name is required"
    }
    return null;
}

//userLastName Validation
const validateLastName = (lastName) =>{
    if(!lastName){
        return "Last Name is required"
    }
    return null;
}


//userImage Validation
const validatePhoto = (imagePath) =>{
    if(!imagePath){
        return "Add your Profile Image"
    }
    const allowedTypes = ['image/jpeg', 'image/png'];

        if(!allowedTypes.includes(imagePath.type)){

            return 'Invalid file type! Please enter a valid image (JPEG or PNG)';
        }
        return null;
}

//confirmPassword validation
const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
        return "Confirm Password is required";
    }
    if (password !== confirmPassword) {
        return "Passwords do not match";
    }
    return null;
}


//terms and conditions validation
 const validateTermsAcceptance = (acceptTerms) => {
    if (!acceptTerms) {
      return "Please accept the terms and conditions.";
    }
    return null; 
  };

export {
    validateEmail,
    validatePassword,
    validateFirstName,
    validateLastName,
    validatePhoto,
    validateConfirmPassword,
    validateTermsAcceptance
};