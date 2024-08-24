const mongooose = require('mongoose')

const supportSchema = mongooose.Schema({
    userId: {type: String, required: true},
    message: {type: String, required: true}
},{timestamps: true})

const Support = mongooose.model('support', supportSchema);

module.exports = Support