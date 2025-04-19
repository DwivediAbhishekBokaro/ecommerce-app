import { LambdaRestApi, Method } from "aws-cdk-lib/aws-apigateway";
import { Function } from "aws-cdk-lib/aws-lambda";
import { addHttpMethodsTo } from "./methods/Methods";

export function getUsagePlanProperties(deploymentStageName: string, lambdaFunction: Function, eCommerceLambdaRestApi: LambdaRestApi){

    const eCommerceMethods = addHttpMethodsTo(eCommerceLambdaRestApi, lambdaFunction);

    return getUsagePlanPropertiesWithReadyApiFor(eCommerceMethods, eCommerceLambdaRestApi, deploymentStageName);

}

export function getUsagePlanPropertiesWithReadyApiFor(eCommerceMethods: Array<any>, eCommerceLambdaRestApi: LambdaRestApi, deploymentStageName: string) {
    return {
       name: `EcommerceApiUsagePlan-${deploymentStageName}`,
       description: `Usage plan for the Ecommerce API - ${deploymentStageName}`,  
       apiKey: eCommerceLambdaRestApi.addApiKey('EcommerceApiKey', {
            apiKeyName: `EcommerceApiKey-${deploymentStageName}`,
        }),
        apiStages: [{
        stage: eCommerceLambdaRestApi.deploymentStage,
        throttle: throttleMethodsPerMethodFor(eCommerceMethods)
        }],

        throttle: {
            burstLimit: 100,
            rateLimit: 50,
        }
    };
}

const throttleMethodsPerMethodFor = (eCommerceMethods: Array<Method>) => {
    return eCommerceMethods.map((apiMethod => buildThrottleFor(apiMethod)));
}

const buildThrottleFor = (apiMethod: Method) => {
    return {
        method: apiMethod,
        throttle: {
            burstLimit: 100,
            rateLimit: 50,
        },
    };
}