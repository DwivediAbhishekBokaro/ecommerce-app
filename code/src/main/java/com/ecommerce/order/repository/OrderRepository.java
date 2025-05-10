package com.ecommerce.order.repository;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.ecommerce.order.model.Order;

@Repository
public class OrderRepository {

    private final Map<String, Order> orderMap = new HashMap<>();
    // orderMap.put("existing-Id", new Order("existing-Id", "existing-ProductId", 1,
    // "existing-Address"));

    public Order saveOrder(Order order) {

        System.out.println("Saving order: " + order.getOrderId());

        orderMap.put(order.getOrderId(), order);

        System.out.println("Order saved: " + order.getOrderId() + " with details: " + order.getOrderDate() + " "
                + order.getUserId() + " " + order.getProductId() + " " + order.getQuantity() + " "
                + order.getAddress());

        return order;
    }

    public Order findOrderByOrderId(String orderId) {
        return orderMap.get(orderId);
    }
}
