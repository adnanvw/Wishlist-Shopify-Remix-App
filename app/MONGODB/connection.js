
import mongoose from "mongoose"
const mongoConnect = () => { 
    mongoose.connect("mongodb://127.0.0.1:27017/wishlistDB").then(() => { console.log("mongoDB connection successful...") }).catch((error) => { console.log(error) })
}

export default mongoConnect