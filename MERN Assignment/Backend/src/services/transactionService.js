import transactionModel from "../models/transactionSchema.js";

export const allTrasactionsData = async (page = 1, perPage = 10, search = '') => {
    let query = {};

    // console.log(query);
    // console.log(search);

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { price: { $regex: String(search), $options: 'i' } }
        ];
    }

    try {
        if (Object.keys(query).length === 0) {
            query = {};
        }

        const totalCount = await transactionModel.countDocuments(query);
        const totalPages = Math.ceil(totalCount / perPage);
        // console.log(query, "Query")
        const transactions = await transactionModel.find(query)
            .skip((page - 1) * perPage)
            .limit(perPage);

        return {
            totalPages,
            currentPage: page,
            transactions
        };
    } catch (err) {
        console.error(err);
        throw new Error('Internal Server Error');
    }
};

export const trasactionsStatisticsData = async (selectedMonth) => {
    try {
        const month = Number(selectedMonth);

        const statistics = await transactionModel.aggregate([
            {
                $addFields: {
                    monthOfSale: { $month: '$dateOfSale' }
                }
            },
            {
                $match: {
                    $expr: {
                        $eq: [month, '$monthOfSale']
                    }
                }
            },
            {
                $group: {
                    _id: null, // Group all documents together
                    totalSaleAmount: { $sum: '$price' }, // Calculate total sale amount
                    totalSoldItems: { $sum: 1 }, // Count total number of sold items
                    totalNotSoldItems: { $sum: { $cond: [{ $eq: ['$sold', false] }, 1, 0] } } // Count total number of not sold items
                }
            }
        ]);

        if (statistics.length === 0) {
            return {
                totalSaleAmount: 0,
                totalSoldItems: 0,
                totalNotSoldItems: 0
            };
        }


        return statistics[0];
    } catch (err) {
        console.error(err);
        throw new Error('Internal Server Error');
    }
}

export const barChartData = async (selectedMonth) => {
    try {

        const month = Number(selectedMonth);

        const priceRanges = [
            { range: '0 - 100', min: 0, max: 100 },
            { range: '101 - 200', min: 101, max: 200 },
            { range: '201 - 300', min: 201, max: 300 },
            { range: '301 - 400', min: 301, max: 400 },
            { range: '401 - 500', min: 401, max: 500 },
            { range: '501 - 600', min: 501, max: 600 },
            { range: '601 - 700', min: 601, max: 700 },
            { range: '701 - 800', min: 701, max: 800 },
            { range: '801 - 900', min: 801, max: 900 },
            { range: '901 - above', min: 901, max: Infinity }
        ];

        const aggregateData = await transactionModel.aggregate([
            {
                $addFields: {
                    monthOfSale: { $month: '$dateOfSale' }
                }
            },
            {
                $match: {
                    $expr: {
                        $eq: [month, '$monthOfSale']
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    prices: { $push: '$price' }
                }
            }
        ]);

        const prices = aggregateData.length > 0 ? aggregateData[0].prices : [];

        const priceRangeCounts = priceRanges.map(({ range }) => ({ range, count: 0 }));

        prices.forEach(price => {
            for (const { range, min, max } of priceRanges) {
                if (price >= min && price <= max) {
                    priceRangeCounts.find(({ range: r }) => r === range).count++;
                    break;
                }
            }
        });

        return priceRangeCounts;
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const pieChartData = async (selectedMonth) => {
    try {
        const month = Number(selectedMonth);

        const aggregateData = await transactionModel.aggregate([
            {
                $addFields: {
                    monthOfSale: { $month: '$dateOfSale' }
                }
            },
            {
                $match: {
                    $expr: {
                        $eq: [month, '$monthOfSale']
                    }
                }
            },
            {
                $group: {
                    _id: '$category',
                    category: { $first: '$category' },
                    itemCount: { $sum: 1 }
                }
            }
        ]);

        const allCategories = await transactionModel.distinct('category');

        const mergedData = allCategories.map(category => {
            const existingItem = aggregateData.find(item => item._id === category);
            return {
                category: category,
                itemCount: existingItem ? existingItem.itemCount : 0
            };
        });

        return mergedData;
    } catch (error) {
        console.error(error);
        throw new Error('Internal Server Error');
    }
}