const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormat: ['jpeg', 'png', 'jpg']
    }
    
})

module.exports = {
    cloudinary,
    storage
}

//5xRRSmQSGxhoJAa9-pass
//MHas2UHucLEd9vqU

//mongodb+srv://admin:<password>@cluster0.s8tzvfe.mongodb.net/?retryWrites=true&w=majority