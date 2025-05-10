package com.ecommerce.order.handler;

import com.amazonaws.services.lambda.runtime.ClientContext;
import com.amazonaws.services.lambda.runtime.CognitoIdentity;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.*;

import static org.junit.jupiter.api.Assertions.*;

class OrderHandlerTest {

    private OrderHandler handler;
    private ObjectMapper mapper;

    @BeforeEach
    void setUp() {
        handler = new OrderHandler();
        mapper = new ObjectMapper();
    }

    /** Minimal stub implementation of AWS Lambda Context */
    private Context createContext() {
        return new Context() {
            @Override
            public String getAwsRequestId() {
                return "test-id";
            }

            @Override
            public String getLogGroupName() {
                return "log-group";
            }

            @Override
            public String getLogStreamName() {
                return "log-stream";
            }

            @Override
            public String getFunctionName() {
                return "OrderHandlerFunction";
            }

            @Override
            public String getFunctionVersion() {
                return "1.0";
            }

            @Override
            public String getInvokedFunctionArn() {
                return "arn:aws:lambda:local";
            }

            @Override
            public CognitoIdentity getIdentity() {
                return null;
            }

            @Override
            public ClientContext getClientContext() {
                return null;
            }

            @Override
            public int getRemainingTimeInMillis() {
                return 300_000;
            }

            @Override
            public int getMemoryLimitInMB() {
                return 512;
            }

            @Override
            public LambdaLogger getLogger() {
                return new LambdaLogger() {
                    @Override
                    public void log(String message) {
                        System.out.println("[LOG] " + message);
                    }

                    @Override
                    public void log(byte[] message) {
                        // simply convert bytes to string
                        System.out.println("[LOG] " + new String(message));
                    }
                };
            }
        };
    }

    @Test
    void testPlaceOrder() throws IOException {
        APIGatewayProxyRequestEvent evt = new APIGatewayProxyRequestEvent()
                .withHttpMethod("POST")
                .withPath("/v1/ui/orders")
                .withBody("{\"userId\":\"u1\",\"productId\":\"p1\",\"quantity\":2,\"address\":\"123 Street\"}");

        ByteArrayOutputStream os = new ByteArrayOutputStream();
        handler.handleRequest(
                new ByteArrayInputStream(mapper.writeValueAsBytes(evt)),
                os,
                createContext());

        APIGatewayProxyResponseEvent resp = mapper.readValue(os.toByteArray(), APIGatewayProxyResponseEvent.class);

        assertEquals(201, resp.getStatusCode());
        assertNotNull(resp.getBody());
        assertTrue(resp.getBody().contains("\"orderId\""));
    }

    APIGatewayProxyResponseEvent resp;

    @Test
    void testGetOrderByIdNotFound() throws IOException {
        APIGatewayProxyRequestEvent evt = new APIGatewayProxyRequestEvent()
                .withHttpMethod("GET")
                .withPath("/v1/ui/orders/nonexistent-id");

        ByteArrayOutputStream os = new ByteArrayOutputStream();
        handler.handleRequest(
                new ByteArrayInputStream(mapper.writeValueAsBytes(evt)),
                os,
                createContext());

        resp = mapper.readValue(os.toByteArray(), APIGatewayProxyResponseEvent.class);

        assertEquals(404, resp.getStatusCode());
        assertEquals("Order not found", resp.getBody());
    }

    @Test
    void testGetOrderById() throws IOException {
        APIGatewayProxyRequestEvent evt = new APIGatewayProxyRequestEvent()
                .withHttpMethod("GET")
                .withPath("/v1/ui/orders/" + resp.getBody().split("\"orderId\":\"")[1].split("\"")[0]);

        ByteArrayOutputStream os = new ByteArrayOutputStream();
        handler.handleRequest(
                new ByteArrayInputStream(mapper.writeValueAsBytes(evt)),
                os,
                createContext());

        APIGatewayProxyResponseEvent resp = mapper.readValue(os.toByteArray(), APIGatewayProxyResponseEvent.class);

        assertEquals(200, resp.getStatusCode());
        assertNotNull(resp.getBody());
        assertTrue(resp.getBody().contains("\"orderId\""));
    }
}
