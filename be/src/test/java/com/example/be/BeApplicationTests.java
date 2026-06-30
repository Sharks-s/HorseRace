package com.example.be;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertTrue;

class BeApplicationTests {

	@Test
	void verifyPasswordHashes() {
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

		// Admin
		assertTrue(encoder.matches("Admin@123", "$2a$10$7QxCOmwKhFfHaBCFpOHuIO/D1tWLNH7pGCpAh.iFvMRJSsBIR2v5m"), "Admin password hash is invalid");

		// Owner
		assertTrue(encoder.matches("Owner@123", "$2a$10$iK3G1bIFzLI9MiJKa.K3QuBvDOnJuQ2PQ1R8bT6VbnMkjLUn5tN02"), "Owner password hash is invalid");

		// Jockey
		assertTrue(encoder.matches("Jockey@123", "$2a$10$8TGdQ1FJJqCMnq0KbApMqe4cRu3Kxl3pIPPp0jGiS0dLIaRAHFvwO"), "Jockey password hash is invalid");

		// Referee
		assertTrue(encoder.matches("Referee@123", "$2a$10$5rRKYvZ0J5/K4B7g2aBaXuyMFmkXfRkxTwIq0m2R81MDr3/6grqyq"), "Referee password hash is invalid");

		// Spectator
		assertTrue(encoder.matches("Spec@123", "$2a$10$U2LVpxNS5AvkxSzXHgvfauh2Lg0.B0IiEy3kK1nNBF7UE8Yz9cAUW"), "Spectator password hash is invalid");

		System.out.println(">>> All BCrypt password hashes in data.sql verified successfully!");
	}
}
