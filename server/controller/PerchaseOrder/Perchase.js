const OrderItem = require('../../models/Purchase');
const path = require('path');
const { deleteFile } = require('../../utils/deletefile');
exports.perchaseItem = async (req, res) => {
    try {
        const { date, description } = req.body;
        const file = req.files.file;
        const ext = path.extname(file.name); // e.g., ".jpg"

        const filename = `${Date.now()}${ext}`;

        const uploadPath = path.join(__dirname, '../../media', filename); // one level up from controller to reach media
        console.log('Upload path:', uploadPath);
        const orderItem=await OrderItem.create({
            date,
            filename: filename,
            ext: ext,
            description,
            image:"http://localhost:4000/media/" + filename
        })

        // Move the file
        file.mv(uploadPath, (err) => {
            if (err) {
                console.error('File upload error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'File upload failed',
                    error: err,
                });
            }
            res.json({
                success: true,
                message: 'File successfully stored',
                data:orderItem,
            });
        });
    } catch (error) {
        console.log(error)
    }
}
exports.getAllPerchaseItem = async (req, res) => {
    try {
        const perchaseItems = await OrderItem.find();
        res.status(200).json({
            success: true,
            data: perchaseItems,
        });
    } catch (error) {
        console.error('Error fetching perchase items:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch perchase items',
            error: error.message,
        });
    }
};
exports.deletePerchaseItem = async (req, res) => {
    try {
        const { id } = req.body;
        const filename = await OrderItem.findById(id);
        const filePath = path.join(__dirname, '../../media', filename.filename); // one level up from controller to reach media
        // Delete the file from the server
        deleteFile(filePath)
        const perchaseItem = await OrderItem.findByIdAndDelete(id);
        if (!perchaseItem) {
            return res.status(404).json({
                success: false,
                message: 'Perchase item not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Perchase item deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting perchase item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete perchase item',
            error: error.message,
        });
    }
};

exports.updatePerchaseItem = async (req, res) => {
    try {
        const { id, date, description } = req.body;
        const file = req.files.file;
        const ext = path.extname(file.name); // e.g., ".jpg"
        const filename1 = await OrderItem.findById(id);
        const filePath = path.join(__dirname, '../../media', filename1.filename); // one level up from controller to reach media
        // Delete the file from the server
        deleteFile(filePath)

        const filename = `${Date.now()}${ext}`;

        const uploadPath = path.join(__dirname, '../../media', filename); // one level up from controller to reach media


        const updatedItem = await OrderItem.findByIdAndUpdate(
            id,
            {
                date,
                description,
                filename: filename,
                ext: ext,
                image: "http://localhost:4000/media/" + filename
            },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: 'Perchase item not found',
            });
        }

        file.mv(uploadPath, (err) => {
            if (err) {
                console.error('File upload error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'File upload failed',
                    error: err,
                });
            }
            res.json({
                success: true,
                message: 'Perchase item updated successfully',
                data: updatedItem,
            });
        });
    } catch (error) {
        console.error('Error updating perchase item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update perchase item',
            error: error.message,
        });
    }
};