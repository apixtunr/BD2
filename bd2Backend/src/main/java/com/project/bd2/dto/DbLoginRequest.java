package com.project.bd2.dto;

import lombok.Data;

@Data
public class DbLoginRequest {
    private String host;
    private String port;
    private String username;
    private String password;

}
