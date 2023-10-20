import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
},{
    timestamps: true,
    strict: false 
})

const wishlistModel = mongoose.model("wishlist", wishlistSchema);

export default wishlistModel;




