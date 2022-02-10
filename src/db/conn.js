const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/userRegisteration')
.then(()=>console.log('Database has been connected'))
.catch(e => console.log(e));
