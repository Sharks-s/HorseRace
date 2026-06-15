package com.example.be.common.service.impl;

import com.example.be.common.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

	private final ObjectProvider<JavaMailSender> mailSenderProvider;

	@Override
	public void sendVerificationEmail(String to, String username, String verifyLink) {
		JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
		if (mailSender == null) {
			log.info("Verification email for {} ({}) -> {}", username, to, verifyLink);
			return;
		}

		try {
			SimpleMailMessage message = new SimpleMailMessage();
			message.setTo(to);
			message.setSubject("Xác nhận tài khoản HorseRace");
			message.setText("Chào " + username + ",\n\nVui lòng xác nhận tài khoản bằng cách nhấn vào link sau:\n" + verifyLink);
			mailSender.send(message);
		} catch (Exception ex) {
			log.warn("Unable to send verification email to {}. Falling back to log link. Reason: {}", to, ex.getMessage());
			log.info("Verification link for {} -> {}", to, verifyLink);
		}
	}
}