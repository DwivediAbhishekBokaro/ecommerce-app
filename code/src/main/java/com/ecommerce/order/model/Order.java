package com.ecommerce.order.model;

import java.util.UUID;

import org.joda.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    private String orderId;

    private String userId;

    private String productId;

    private int quantity;

    private String address;

    @Enumerated(EnumType.STRING)
    private OrderStatus status; // e.g., "PLACED", "CANCELLED", "SHIPPED"

    private LocalDateTime orderDate;

    public Order() {
        this.orderId = UUID.randomUUID().toString(); // Auto-generate orderId
        this.orderDate = LocalDateTime.now(); // Default time of creation
        this.status = OrderStatus.PLACED;
    }

    // Constructor with fields (excluding auto-generated ones)
    public Order(String userId, String productId, int quantity, String address) {
        this();
        this.userId = userId;
        this.productId = productId;
        this.quantity = quantity;
        this.address = address;
    }

    // Getters and Setters

    public String getOrderId() {
        return orderId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }
}
