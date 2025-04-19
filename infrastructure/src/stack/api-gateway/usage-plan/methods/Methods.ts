import { HttpMethod } from "aws-cdk-lib/aws-events";
import { LambdaIntegration, LambdaRestApi, Method } from "aws-cdk-lib/aws-apigateway";
import { Function } from "aws-cdk-lib/aws-lambda";

const ROOT_PATH_PART_VALUE = 'v1';

export function addHttpMethodsTo(eCommerceLambdaRestApi: LambdaRestApi, lambdaFunction: Function) : Array<Method> {
    const lambdaIntegration = new LambdaIntegration(lambdaFunction);
    const rootPath = eCommerceLambdaRestApi.root.addResource(ROOT_PATH_PART_VALUE);
    const uiPath = rootPath.addResource('ui');
    const ordersPath = uiPath.addResource('orders');
    const methods: Method[] = [];

    // /v1/ui/orders
    const placeOrderMethod = ordersPath.addMethod(HttpMethod.POST, lambdaIntegration); // place order
    methods.push(placeOrderMethod);

    const getAllOrdersMethod = ordersPath.addMethod(HttpMethod.GET, lambdaIntegration);  // get all orders (optional)
    methods.push(getAllOrdersMethod);

    // /v1/ui/orders/{orderId}
    const orderById = ordersPath.addResource('{orderId}');
    const getOrderByIdMethod = orderById.addMethod(HttpMethod.GET, lambdaIntegration); // get order by ID
    methods.push(getOrderByIdMethod);

    // /v1/ui/orders/{orderId}/cancel
    const cancelOrder = orderById.addResource('cancel');
    const cancelOrderMethod = cancelOrder.addMethod(HttpMethod.POST, lambdaIntegration); // cancel order
    methods.push(cancelOrderMethod);

    // /v1/ui/orders/status/{orderId}
    const statusByOrder = ordersPath.addResource('status').addResource('{orderId}');
    const getOrderStatusMethod = statusByOrder.addMethod(HttpMethod.GET, lambdaIntegration); // get order status
    methods.push(getOrderStatusMethod);

    // /v1/ui/orders/history
    const orderHistory = ordersPath.addResource('history');
    const getUserOrderHistoryMethod = orderHistory.addMethod(HttpMethod.GET, lambdaIntegration); // user’s order history
    methods.push(getUserOrderHistoryMethod);

    // /v1/ui/orders/history/{userId}
    const orderHistoryByUser = orderHistory.addResource('{userId}');
    const getUserOrderHistoryByIdMethod = orderHistoryByUser.addMethod(HttpMethod.GET, lambdaIntegration); // admin view of a user’s history
    methods.push(getUserOrderHistoryByIdMethod);

    return methods;
}
