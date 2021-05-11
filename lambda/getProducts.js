var AWS = require("aws-sdk");
AWS.config.update({region: 'us-east-1', endpoint: "https://dynamodb.us-east-1.amazonaws.com"});
exports.handler = async function (event) {
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
        TableName: "ProductCatalogingApiStack-Products229621C6-6GC9Y83RGNC9",
        Key: {
            'id': parseInt(event.queryStringParameters["productid"])
        }
    };
    const data = await docClient.get(params).promise()
    let result
    if (Object.keys(data).length === 0)
        result = "no data was found"
    else
        result = JSON.stringify(data)
    return {
        statusCode: 200,
        headers: {"Content-Type": "text/plain"},
        body: result
    };
}



