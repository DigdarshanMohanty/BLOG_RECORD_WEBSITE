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
    }
},
{
    timestamp: true
}
);

module.exports = mongoose.model("Blog", BlogModel);