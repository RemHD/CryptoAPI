const  mongoose = require('mongoose');

mongoose.connect('mongodb://localhost', {
    user: "root",
    pass: "password",
    dbName: "SampleCollections",
    useNewUrlParser: true
}).catch(e => console.log(e));

module.exports = mongoose.connection;