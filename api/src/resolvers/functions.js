import { parseResolveInfo } from 'graphql-parse-resolve-info';
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';

// Initialize the S3 client
const s3Client = new S3Client();

export const getProjectionExpression = (info, child = null) => {
    if (child) {
        return Object.keys(parseResolveInfo(info).fieldsByTypeName[child]).join(', ');
    } else {
        return Object.keys(Object.keys(parseResolveInfo(info).fieldsByTypeName)[0]).join(', ');
    }
}

export const generateFilterExpression = (userId, labelArray, operand = "OR") => {
    const filterExpressions = [];
    const ExpressionAttributeValues = { ":userId": userId };
    const ExpressionAttributeNames = { "#labels": "labels", "#userId": "userId" };

    labelArray.forEach((value, index) => {
        filterExpressions.push(`contains(#labels, :value${index})`);
        ExpressionAttributeValues[`:value${index}`] = value;
    });

    const FilterExpression = `#userId = :userId AND ` + filterExpressions.join(` ${operand} `);
    return {
        FilterExpression,
        ExpressionAttributeValues,
        ExpressionAttributeNames
    };

}