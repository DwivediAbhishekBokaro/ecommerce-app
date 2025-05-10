package com.ecommerce.order.request;

public class OrderRequest {

    private String userId;
    private String productId;
    private int quantity;
    private String address;

    // Constructors
    public OrderRequest() {
    }

    public OrderRequest(String userId, String productId, int quantity, String address) {
        this.userId = userId;
        this.productId = productId;
        this.quantity = quantity;
        this.address = address;
    }

    // Getters and setters
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
}
