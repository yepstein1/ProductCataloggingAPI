import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

import * as lambda from '@aws-cdk/aws-lambda';


export class ProductCatalogingApiStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // The code that defines your stack goes here


        const table = new dynamodb.Table(this, 'Products', {
            partitionKey: {name: 'id', type: dynamodb.AttributeType.NUMBER}

        });


        const fn = new lambda.Function(this, 'InsertIntoProducts', {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'insertIntoProducts.handler',
            code: lambda.Code.fromAsset('lambda'),
        });


        const retrieveFn = new lambda.Function(this, 'GetProducts', {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'getProducts.handler',
            code: lambda.Code.fromAsset('lambda'),
        });

        const searchByTagsFn = new lambda.Function(this, 'GetProductsByTags', {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'getProductsByTags.handler',
            code: lambda.Code.fromAsset('lambda'),
        });
    }
}
