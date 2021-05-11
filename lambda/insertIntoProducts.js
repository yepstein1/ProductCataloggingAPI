const AWS = require("aws-sdk");

function generateRandomNumber(max, min) {
    return Math.random() * (max - min) + min;
}

function checkForEmptyTags(tags, errorArray) {
    const isEmpty = tags.includes("")
    if (isEmpty)
        errorArray.push({"error": true, errorMessage: "cannot have empty tags"})
}

let checkLengthOfName = (name, errorArray) => {
    if (name.length > 40)
        errorArray.push({"error": true, errorMessage: "name cannnot be more than 40 char"})

}
let checkForNegativePrice = (price, errorArray) => {
    if (price < 0) {
        errorArray.push({"error": true, errorMessage: "price cannot be negative"})
    }
}
exports.handler = async function (event) {
    let result = {}
    let statusCode;
    const productId = Math.round(generateRandomNumber(1, 1000))
    let tags = event.headers.producttags
    let errorArray = []
    if (typeof tags === 'string') {
        tags = tags.split(",")
        checkForEmptyTags(tags, errorArray)
    }
    const productName = event.headers.productname
    const productPrice = event.headers.productprice
    checkLengthOfName(productName, errorArray)
    checkForNegativePrice(productPrice, errorArray)
    if (errorArray.length > 0) {
        result = errorArray
        statusCode = 400
    } else {
        AWS.config.update({region: 'us-east-1', endpoint: "https://dynamodb.us-east-1.amazonaws.com"});
        const docClient = new AWS.DynamoDB.DocumentClient();
        let params = {
            TableName: 'ProductCatalogingApiStack-Products229621C6-6GC9Y83RGNC9',
            Item: {
                "id": productId,
                "name": productName,
                "price": productPrice,
                "tags": tags
            }
        };
        try {
            result = await docClient.put(params).promise()
            statusCode = 200
        } catch (err) {
            console.log(err)

        }
    }
    return {
        statusCode: statusCode,
        headers: {"Content-Type": "text/plain"},
        body: JSON.stringify(result)

    };
};







