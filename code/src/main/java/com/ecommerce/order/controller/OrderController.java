package com.ecommerce.order.controller;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import org.springframework.web.bind.annotation.RestController;

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.ecommerce.order.repository.OrderRepository;
import com.ecommerce.order.service.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.joda.JodaModule;

@RestController
public class OrderController {
    private final ObjectMapper objectMapper;
    private final OrderService orderService;

    public OrderController() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JodaModule());

        this.orderService = new OrderService(new OrderRepository(), objectMapper);
    }

    public void route(InputStream inputStream, OutputStream outputSteam)
            throws IOException {

        APIGatewayProxyResponseEvent response;

        try {
            APIGatewayProxyRequestEvent request = objectMapper.readValue(inputStream,
                    APIGatewayProxyRequestEvent.class);

            String httpMethod = request.getHttpMethod();
            String path = request.getPath();

            System.out.println("Path: " + path);

            if ("POST".equalsIgnoreCase(httpMethod) && "/v1/ui/orders".equals(path)) {
                System.out.println("Creating order...");
                System.out.println("Request body: " + request.getBody());
                response = orderService.placeOrder(request);

                System.out.println("Response after save: " + response.getBody());
                System.out.println("Response status code: " + response.getStatusCode());

            } else if ("GET".equalsIgnoreCase(httpMethod) && path.startsWith("/v1/ui/orders/")) {
                System.out.println("Fetching order...");
                System.out.println("Request path: " + path);

                String orderId = path.substring("/v1/ui/orders/".length());
                response = orderService.getOrder(orderId);
            } else {
                response = new APIGatewayProxyResponseEvent().withStatusCode(404).withBody("Not Found");
            }
        } catch (Exception e) {
            response = new APIGatewayProxyResponseEvent().withStatusCode(500).withBody("Internal Server Error");
        }

        objectMapper.writeValue(outputSteam, response);
    }
}
