const mongoose = require('mongoose');

const BlogModel = mongoose.Schema(
{
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: false
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Blog", BlogModel);