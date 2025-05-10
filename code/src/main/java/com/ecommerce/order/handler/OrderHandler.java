package com.ecommerce.order.handler;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.ecommerce.order.controller.OrderController;

public class OrderHandler implements RequestStreamHandler {

    private final OrderController orderController;

    public OrderHandler() {
        this.orderController = new OrderController();
    }

    @Override
    public void handleRequest(InputStream input, OutputStream output, Context context) {
        try {
            orderController.route(input, output);

            System.out.println("Request handled successfully.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}