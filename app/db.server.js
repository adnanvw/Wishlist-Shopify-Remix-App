
import mongoConnect from "./MONGODB/connection";

import shopModel from "./MONGODB/models/ShopModel";
import wishlistModel from "./MONGODB/models/WishlistModel"

mongoConnect()
export {
   shopModel,wishlistModel
}
