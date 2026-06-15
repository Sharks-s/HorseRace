package com.example.be.common.service;

public interface EmailService {

	void sendVerificationEmail(String to, String username, String verifyLink);
}