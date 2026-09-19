const cache = new Map();

/**
 * Caches the result of an asynchronous function in memory.
 * 
 * @param {string} key - The unique cache key for the query
 * @param {number} ttlSeconds - Time-to-live in seconds
 * @param {Function} fetchFunction - The async function that fetches the data if it's not cached
 * @returns {Promise<any>} - The cached or freshly fetched data
 */
const withCache = async (key, ttlSeconds, fetchFunction) => {
    const now = Date.now();
    const cachedItem = cache.get(key);

    if (cachedItem && cachedItem.expiry > now) {
        return cachedItem.data;
    }

    // Cache miss or expired, fetch new data
    const data = await fetchFunction();
    
    // Store in cache
    cache.set(key, {
        data,
        expiry: now + (ttlSeconds * 1000)
    });

    return data;
};

/**
 * Warm up cache for products, orders, categories, and banners.
 * @param {any} db - The MongoDB Database instance
 */
const warmUpCache = async (db) => {
    if (!db) return;
    console.log("Warming up cache for products, orders, categories, and banners...");

    // 1. Warm up Banners
    try {
        const bannersCollection = db.collection("banners");
        await withCache("banners", 15, async () => {
            return await bannersCollection.find({}).sort({ createdAt: -1 }).toArray();
        });
    } catch (err) {
        console.warn("Banners cache warmup skipped due to network delay:", err.message);
    }

    // 2. Warm up Categories
    try {
        const categoriesCollection = db.collection("categories");
        const productsCollection = db.collection("products");

        await withCache("categories_null_null_", 120, async () => {
            return await categoriesCollection.find({}).sort({ createdAt: -1 }).toArray();
        });

        await withCache("categoriesWithCounts", 120, async () => {
            const categories = await categoriesCollection.find().sort({ createdAt: -1 }).toArray();
            const countResult = await productsCollection.aggregate([
                { $group: { _id: "$category", count: { $sum: 1 } } }
            ]).toArray();
            const countMap = new Map(countResult.map(r => [r._id, r.count]));
            return categories.map(parent => {
                let totalCount = 0;
                for (const child of parent.children ?? []) {
                    for (const catSlug of child.categories ?? []) {
                        totalCount += countMap.get(catSlug) ?? 0;
                    }
                }
                return { ...parent, productCount: totalCount };
            });
        });
    } catch (err) {
        console.warn("Categories cache warmup skipped due to network delay:", err.message);
    }

    // 3. Warm up Orders
    try {
        const ordersCollection = db.collection("orders");
        await withCache("orders_null_null_", 15, async () => {
            const orders = await ordersCollection.find({})
                .project({
                    orderStatus: 1,
                    paymentMethod: 1,
                    paymentStatus: 1,
                    totalPrice: 1,
                    totalItems: 1,
                    deliveryArea: 1,
                    shippingAddress: {
                        fullName: 1,
                        phone: 1,
                        address: 1
                    },
                    createdAt: 1,
                    updatedAt: 1,
                    items: {
                        $map: {
                            input: { $ifNull: ["$items", []] },
                            as: "item",
                            in: {
                                title: "$$item.title",
                                thumbnail: "$$item.thumbnail",
                                quantity: "$$item.quantity",
                                price: "$$item.price",
                                subtotal: "$$item.subtotal"
                            }
                        }
                    }
                })
                .sort({ createdAt: -1 })
                .limit(100)
                .toArray();
            return {
                totalOrders: orders.length,
                orders
            };
        });
    } catch (err) {
        console.warn("Orders cache warmup skipped due to network delay:", err.message);
    }

    // 4. Warm up Products
    try {
        const productsCollection = db.collection("products");
        await withCache("products_null_null____", 15, async () => {
            const products = await productsCollection.find({})
                .project({ 
                    description: 0, 
                    dimensions: 0, 
                    reviews: 0, 
                    images: 0, 
                    warrantyInformation: 0, 
                    shippingInformation: 0, 
                    returnPolicy: 0, 
                    tags: 0,
                    sku: 0,
                    weight: 0,
                    availabilityStatus: 0,
                    minimumOrderQuantity: 0
                })
                .sort({ _id: -1 })
                .limit(200)
                .toArray();
            return {
                totalProducts: products.length,
                products
            };
        });
    } catch (err) {
        console.warn("Products cache warmup skipped due to network delay:", err.message);
    }

    console.log("Cache warming completed.");
};

/**
 * Clears a specific cache key or all cache if no key provided.
 * @param {string} [key] 
 */
const clearCache = (key) => {
    if (key) {
        cache.delete(key);
    } else {
        cache.clear();
    }
};

module.exports = {
    withCache,
    clearCache,
    warmUpCache
};
