import axios from 'axios';

const BASEURL ='http://localhost:3030/api';

//register method
export const register = async (firstName,lastName,email,password) => {
    try {
        const response = await axios.post(`${BASEURL}/register`, { firstName,lastName,email,password });
        return response.data;
    } catch (error) {
        // throw new Error(error.response.data.message || 'Something went wrong');
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Something went wrong');
        }
    }
}


//login method
export const signIn = async (email, password) => {
    try {
        const response = await axios.post(`${BASEURL}/login`, { email, password });
        return response.data;
    } catch (error) {
        // throw new Error(error.response.data.message || 'Something went wrong');
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Something went wrong');
        }
    }
}

//logout method
export const logout = async () => {
    try {
        const response = await axios.get(`${BASEURL}/logout`);
        return response.data;
    } catch (error) {
        // throw new Error(error.response.data.message || 'Something went wrong');
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Something went wrong');
        }
    }
}



//forgot password method
export const forgotPwReq = async (email) => {
    try {
        const response = await axios.post(`${BASEURL}/forgot`, { email });
        return response.data;
    } catch (error) {
        // throw new Error(error.response.data.message || 'Something went wrong');
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Something went wrong');
        }
    }
};

//reset password method
export const resetPassword = async (token, password) => {
    try {
        const response = await axios.post(`${BASEURL}/reset/${token}`, { password });
        return response.data;
    } catch (error) {
        // throw new Error(error.response.data.message || 'Something went wrong');
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Something went wrong');
        }
    }
}

//update user Details
export const updateUser = async (user) => {
    try {
        const response = await axios.put(`${BASEURL}/update`, user);
        return response.data;
    } catch (error) {
        // throw new Error(error.response.data.message || 'Something went wrong');
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Something went wrong');
        }
    }
}

//get user details by id
export const getUser = async (userId) => {
    try {
        const response = await axios.get(`${BASEURL}/user/${userId}`);
        return response.data;
    } catch (error) {
        // throw new Error(error.response.data.message || 'Something went wrong');
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Something went wrong');
        }
    }
}

//delete User by id
export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`${BASEURL}/user/${userId}`);
        return response.data;
    } catch (error) {
        // throw new Error(error.response.data.message || 'Something went wrong');
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Something went wrong');
        }
    }
}

//update user data by id
export const updateUserById = async (userId, formData) => {
    try {
        const response = await axios.put(`${BASEURL}/user/${userId}/update`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Set content type to multipart form data
            },
        });

        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Something went wrong');
        }
    }
};
