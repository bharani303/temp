/*
 * Developed by brnpro
 */
package com.brnpro.furniturerentals.configuration;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Enumeration;

@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

    private final SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Wrap request and response so we can read body/payload without consuming the stream permanently
        ContentCachingRequestWrapper requestWrapper = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(response);

        long startTime = System.currentTimeMillis();
        String timeStr = formatter.format(new Date());
        String method = requestWrapper.getMethod();
        String uri = requestWrapper.getRequestURI();
        String queryString = requestWrapper.getQueryString();
        String clientIp = requestWrapper.getRemoteAddr();

        try {
            filterChain.doFilter(requestWrapper, responseWrapper);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            int status = responseWrapper.getStatus();

            // Print incoming request details in a beautiful developer-friendly format
            System.out.println("\n┌─────────────────── [HTTP REQUEST LOG] ───────────────────");
            System.out.println("│ Time        : " + timeStr);
            System.out.println("│ Client IP   : " + clientIp);
            System.out.println("│ Method      : " + method);
            System.out.println("│ URI         : " + uri);
            if (queryString != null) {
                System.out.println("│ Query Params: " + queryString);
            }
            System.out.println("│ Headers     : " + getHeadersAsString(requestWrapper));

            // Log Request Payload / Body (highly valuable for POST/PUT)
            String requestBody = getRequestBody(requestWrapper);
            if (requestBody != null && !requestBody.trim().isEmpty()) {
                System.out.println("│ Request Body: " + requestBody.trim());
            }

            System.out.println("├─────────────────── [HTTP RESPONSE LOG] ──────────────────");
            System.out.println("│ Status      : " + status);
            System.out.println("│ Time Taken  : " + duration + " ms");

            // Log Response Content / Body (highly valuable for GET/POST results)
            String responseBody = getResponseBody(responseWrapper);
            if (responseBody != null && !responseBody.trim().isEmpty()) {
                System.out.println("│ Response Body: " + responseBody.trim());
            }
            System.out.println("└──────────────────────────────────────────────────────────\n");

            // IMPORTANT: Copy back the response body buffer to the real client response stream so the client gets it
            responseWrapper.copyBodyToResponse();
        }
    }

    private String getRequestBody(ContentCachingRequestWrapper request) {
        byte[] buf = request.getContentAsByteArray();
        if (buf.length > 0) {
            try {
                String encoding = request.getCharacterEncoding();
                return new String(buf, 0, buf.length, encoding != null ? encoding : "UTF-8");
            } catch (UnsupportedEncodingException e) {
                return "[Unsupported Encoding]";
            }
        }
        return null;
    }

    private String getResponseBody(ContentCachingResponseWrapper response) {
        byte[] buf = response.getContentAsByteArray();
        if (buf.length > 0) {
            try {
                String encoding = response.getCharacterEncoding();
                return new String(buf, 0, buf.length, encoding != null ? encoding : "UTF-8");
            } catch (UnsupportedEncodingException e) {
                return "[Unsupported Encoding]";
            }
        }
        return null;
    }

    private String getHeadersAsString(HttpServletRequest request) {
        StringBuilder headers = new StringBuilder();
        Enumeration<String> headerNames = request.getHeaderNames();
        if (headerNames != null) {
            while (headerNames.hasMoreElements()) {
                String headerName = headerNames.nextElement();
                headers.append(headerName).append("=").append(request.getHeader(headerName)).append("; ");
            }
        }
        return headers.toString();
    }
}
