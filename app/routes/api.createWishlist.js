import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { wishlistModel } from "../db.server"
import { shopModel } from "../db.server"

export const action = async ({ request }) => {

    try {

        const { customerId, productId, shop } = JSON.parse(await request.text());

        const shopData = await shopModel.findOne({ shop })


        const findCustomer = async (customerId) => {
            let customerData = await axios({
                url: `https://${shopData.shop}/admin/api/2023-07/graphql.json`,
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": shopData.accessToken,
                },
                data: {
                    query: `{
                        customer(id: "${customerId}") {
                          email
                          firstName
                          id
                          lastName
                        }
                      }` ,
                },
            });

            return customerData

        }



        wishlistModel.findOne({ customerId: customerId }, async(err, wishlist) => {
            if (err) {
                console.error("Error finding wishlist:", err);
                return json({
                    error: "Something went wrong..."
                }, { status: 400 });
            }

            if (wishlist) {
                // If the wishlist document exists, check if the productId is already in the product array
                if (!wishlist.products.includes(productId)) {
                    // If it's not already in the array, push it
                    wishlist.products.push(productId);
                    wishlist.save((saveErr) => {
                        if (saveErr) {
                            console.error("Error saving wishlist:", saveErr);
                            return json({
                                error: "Something went wrong..."
                            }, { status: 400 });
                        }
                    });
                }
            } else {
                // If the wishlist document doesn't exist, create a new one
                const customerInfo = await findCustomer(customerId)
                const newWishlist = new wishlistModel({
                    customerId: customerId,
                    products: [productId],
                });
                newWishlist.save((saveErr) => {
                    if (saveErr) {
                        console.error("Error creating wishlist:", saveErr);
                        return json({
                            error: "Something went wrong..."
                        }, { status: 400 });
                    }
                });
            }
        });

        return json({
            success: "Wishlist Created Successfully."
        }, { status: 200 });

    } catch (error) {
        console.log("error", error)
        return json({
            error: "Something went wrong..."
        }, { status: 400 });
    }

}