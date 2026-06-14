/*
 * Developed by brnpro
 */
package com.brnpro.furniturerentals.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class JwtUtil {
    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);
    private static final String SECRET = "HomieFurnitureRentalsSuperSecretProductionJWTKey2026";
    private static final ObjectMapper mapper = new ObjectMapper();

    public static String generateToken(String userId, String role, String phone) {
        try {
            // Header
            Map<String, String> header = new HashMap<>();
            header.put("alg", "HS256");
            header.put("typ", "JWT");
            String headerJson = mapper.writeValueAsString(header);
            String headerBase64 = base64UrlEncode(headerJson.getBytes(StandardCharsets.UTF_8));

            // Payload
            Map<String, Object> payload = new HashMap<>();
            payload.put("id", userId);
            payload.put("role", role);
            payload.put("phone", phone);
            // Expire in 10 days
            payload.put("exp", System.currentTimeMillis() + 10L * 24 * 60 * 60 * 1000);
            String payloadJson = mapper.writeValueAsString(payload);
            String payloadBase64 = base64UrlEncode(payloadJson.getBytes(StandardCharsets.UTF_8));

            // Sign
            String dataToSign = headerBase64 + "." + payloadBase64;
            String signature = hmacSha256(dataToSign, SECRET);

            return dataToSign + "." + signature;
        } catch (Exception e) {
            log.error("Failed to generate JWT token", e);
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    public static boolean validateToken(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) return false;

            String dataToSign = parts[0] + "." + parts[1];
            String signature = hmacSha256(dataToSign, SECRET);

            if (!signature.equals(parts[2])) return false;

            // Check expiration
            String payloadJson = new String(base64UrlDecode(parts[1]), StandardCharsets.UTF_8);
            Map<String, Object> payload = mapper.readValue(payloadJson, Map.class);
            long exp = ((Number) payload.get("exp")).longValue();
            return System.currentTimeMillis() < exp;
        } catch (Exception e) {
            log.error("Failed to validate JWT token", e);
            return false;
        }
    }

    @SuppressWarnings("unchecked")
    public static Map<String, Object> getClaims(String token) {
        if (token == null || token.trim().isEmpty()) {
            return null;
        }
        // Handle Bearer prefix if sent by the client
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) return null;

            String dataToSign = parts[0] + "." + parts[1];
            String signature = hmacSha256(dataToSign, SECRET);

            if (!signature.equals(parts[2])) return null;

            String payloadJson = new String(base64UrlDecode(parts[1]), StandardCharsets.UTF_8);
            Map<String, Object> payload = mapper.readValue(payloadJson, Map.class);
            long exp = ((Number) payload.get("exp")).longValue();
            if (System.currentTimeMillis() >= exp) {
                return null;
            }
            return payload;
        } catch (Exception e) {
            log.error("Failed to parse claims from JWT token", e);
            return null;
        }
    }

    private static String base64UrlEncode(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private static byte[] base64UrlDecode(String base64Str) {
        return Base64.getUrlDecoder().decode(base64Str);
    }

    private static String hmacSha256(String data, String key) throws Exception {
        Mac sha256 = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256.init(secretKey);
        byte[] hash = sha256.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return base64UrlEncode(hash);
    }
}
