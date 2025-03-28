const cloudinary = require('cloudinary').v2

cloudinary.config({ 
    cloud_name: 'dlnsggxob', 
    api_key: '821436114627769', 
    api_secret: 'cslnW4A_eZLowDIxN1YpffdLkuc' 
  });

    module.exports = cloudinary;