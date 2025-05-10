package com.ecommerce.order.service;

import org.springframework.stereotype.Service;

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.ecommerce.order.model.Order;
import com.ecommerce.order.repository.OrderRepository;
import com.ecommerce.order.request.OrderRequest;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ObjectMapper objectMapper;

    public OrderService(OrderRepository orderRepository, ObjectMapper objectMapper) {
        this.orderRepository = orderRepository;
        this.objectMapper = objectMapper;
    }

    public APIGatewayProxyResponseEvent placeOrder(APIGatewayProxyRequestEvent request) {
        try {
            System.out.println("Request body inside try: " + request.getBody());

            OrderRequest orderRequest = objectMapper.readValue(request.getBody(), OrderRequest.class);

            System.out.println("Order Request: " + orderRequest.getAddress());

            Order order = orderRepository.saveOrder(new Order(
                    orderRequest.getUserId(),
                    orderRequest.getProductId(),
                    orderRequest.getQuantity(),
                    orderRequest.getAddress()));

            return new APIGatewayProxyResponseEvent().withStatusCode(201)
                    .withBody(objectMapper.writeValueAsString(order));

        } catch (Exception e) {
            return new APIGatewayProxyResponseEvent().withStatusCode(500)
                    .withBody("Error processing order: " + e.getMessage());
        }
    }

    public APIGatewayProxyResponseEvent getOrder(String orderId) {
        try {
            Order order = orderRepository.findOrderByOrderId(orderId);
            if (order == null) {
                return new APIGatewayProxyResponseEvent().withStatusCode(404)
                        .withBody("Order not found");
            }
            return new APIGatewayProxyResponseEvent().withStatusCode(200)
                    .withBody(objectMapper.writeValueAsString(order));
        } catch (Exception e) {
            return new APIGatewayProxyResponseEvent().withStatusCode(500)
                    .withBody("Error retrieving order: " + e.getMessage());
        }
    }
};