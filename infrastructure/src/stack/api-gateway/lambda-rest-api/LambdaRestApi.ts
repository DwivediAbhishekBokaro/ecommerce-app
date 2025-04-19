import { AccessLogFormat, ApiKeySourceType, Cors, LambdaRestApi, LogGroupLogDestination, MethodLoggingLevel } from "aws-cdk-lib/aws-apigateway";
import { Function } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { createLogGroupForApiGateway } from "../log-group/LogGroup";


const defaultCorsPreflightOptions = {
    allowOrigins: Cors.ALL_ORIGINS,
    allowMethods: Cors.ALL_METHODS, // Allow all methods by default
    allowHeaders: Cors.DEFAULT_HEADERS,
    exposeHeaders: ['Access-Control-Allow-Origin'],
    allowCredenitials: true,
};

export function createEcommerceLambdaRestApiWith(scope: Construct, eCommercelambda: Function, deploymentStageName: string) : LambdaRestApi
{
    const logGroupForApiGateway = createLogGroupForApiGateway(scope, deploymentStageName);

    const eCommerceLambdaRestApi = new LambdaRestApi(scope, 'EcommerceLambdaRestApiGateway',{
        restApiName: `EcoomerceApiGateway- ${deploymentStageName}`,
        description: 'API Gateway for E-commerce API', 
        handler: eCommercelambda,
        cloudWatchRole: true,
        deployOptions: {
            stageName: deploymentStageName,
            loggingLevel: MethodLoggingLevel.INFO,
            dataTraceEnabled: true,
            metricsEnabled: true,
            tracingEnabled: true,
            accessLogDestination: new LogGroupLogDestination(logGroupForApiGateway),
            accessLogFormat: AccessLogFormat.clf(),
        },
        defaultMethodOptions:{
            apiKeyRequired: true, // Set to true if you want to require an API key for all methods
        },
        apiKeySourceType: ApiKeySourceType.HEADER,
        defaultCorsPreflightOptions : defaultCorsPreflightOptions, 
        proxy: false
    });
    
    return eCommerceLambdaRestApi;
};
