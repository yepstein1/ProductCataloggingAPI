var AWS = require("aws-sdk");
exports.handler = async function (event, context) {
    AWS.config.update({region: 'us-east-1', endpoint: "https://dynamodb.us-east-1.amazonaws.com"});
    const docClient = new AWS.DynamoDB.DocumentClient();
    let tags = event.queryStringParameters['tags']
    tags = tags.split(',')
    let filterx = "contains(#tag,:tag1) ";
    let y = 2
    let expressionValue = {":tag1": tags[0]}
    for (let i = 1; i < tags.length; i++) {
        filterx += `and contains(#tag,:tag${y}) `
        expressionValue = {...expressionValue, [`:tag${y}`]: tags[i]}
        y++
    }
    const params = {
        TableName: 'ProductCatalogingApiStack-Products229621C6-6GC9Y83RGNC9',
        FilterExpression: filterx,
        ExpressionAttributeNames: {
            "#tag": "tags"
        },
        ExpressionAttributeValues: expressionValue
    }
    const data = await docClient.scan(params).promise().catch(err => console.log(err))
    let result
    if (data.Count === 0)
        result = "no data was found"
    else
        result = JSON.stringify(data)

    return {
        statusCode: 200,
        headers: {"Content-Type": "text/plain"},
        body: result
    };
}

