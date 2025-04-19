import { Construct } from "constructs";
import { Function } from "aws-cdk-lib/aws-lambda";
import { createEcommerceLambdaRestApiWith } from "./lambda-rest-api/LambdaRestApi";
import { getUsagePlanProperties } from "./usage-plan/UsagePlan";

export function createApiGatewayUsing(scope: Construct, lambdaFunction: Function, deploymentStageName: string) {

    const eCommerceLambdaRestApi = createEcommerceLambdaRestApiWith(scope, lambdaFunction, deploymentStageName);

    const usagePlanProperties = getUsagePlanProperties(deploymentStageName, lambdaFunction, eCommerceLambdaRestApi);

    eCommerceLambdaRestApi.addUsagePlan('UsagePlanPropertiesForEcommerceApi', usagePlanProperties);

    return eCommerceLambdaRestApi;
    
};