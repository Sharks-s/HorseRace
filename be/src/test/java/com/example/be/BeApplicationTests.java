package com.example.be;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertTrue;

class BeApplicationTests {

	@Test
	void verifyPasswordHashes() {
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

		// Admin
		assertTrue(encoder.matches("Admin@123", "$2a$10$SSJA316TyAC5H/fqi1lMxOshQ5zcEkvPvtNF9my2ZHtbP7uHJy2i."), "Admin password hash is invalid");

		// Owner
		assertTrue(encoder.matches("Owner@123", "$2a$10$q/TwkEI66GBe.WN1wgidb.M3MX4Npz0QQYPr1S5iu0IPbJSxIYZLW"), "Owner password hash is invalid");

		// Jockey
		assertTrue(encoder.matches("Jockey@123", "$2a$10$uyvnlS8XX2DpjZt62URx9eud0Izy9H4J2II9a65MW6iDdBel.WJQO"), "Jockey password hash is invalid");

		// Referee
		assertTrue(encoder.matches("Referee@123", "$2a$10$isD2kQCFV2/F7MpayF/eyOowTj3osbhH8CMcsoEraPIbxmMF0gJ0a"), "Referee password hash is invalid");

		// Spectator
		assertTrue(encoder.matches("Spec@123", "$2a$10$M.vdZNxRQU17RTI1IOvOzuml/4u74nEnWwQWicaO1LdCu3bBfin7O"), "Spectator password hash is invalid");

		System.out.println(">>> All BCrypt password hashes in data.sql verified successfully!");
	}
}
