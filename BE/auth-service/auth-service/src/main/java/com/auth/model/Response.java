package com.auth.model;

public class Response {
    private String token;
    private User user;

    public Response(String token, User user) {
        this.token = token;
        this.user = user;
    }

    @Override
    public String toString() {
        return "Response{" +
                "token='" + token + '\'' +
                ", user=" + user +
                '}';
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
// Getters and setters
}