package com.learn.filter;

import com.learn.config.CustomUserDetailsService;
import com.learn.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Enumeration;

@Component
public class JwtFilter extends OncePerRequestFilter {
    /**
     * JwtService is used to extract the username and validate the token.
     */

    @Autowired
    private JwtService jwtService;
    /**
     * CustomUserDetailsService is used to load user details based on the username.
     */
    @Autowired
    private CustomUserDetailsService customUserDetailsService;
    /**
     * log is a logger object used to log messages.
     */
    final Logger log = LoggerFactory.getLogger(JwtFilter.class);
    /**
     * doFilterInternal method is the core method of the JwtFilter class.
     * It performs the following operations:
     * <ul>
     *  <li> Extracts the token from the "authorization" header. </li>
     *  <li> Validates the token using the JwtService and CustomUserDetailsService. </li>
     *  <li> If the token is valid, sets the authentication in the SecurityContextHolder. </li>
     * </ul>
     *
     * @param request the HttpServletRequest object
     * @param response the HttpServletResponse object
     * @param filterChain the FilterChain object
     * @throws ServletException if there is an error while processing the request
     * @throws IOException if there is an error while reading or writing data to the request or response
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token=null;
        String username=null;
     
        log.info("Incoming request URL: {}", request.getRequestURI());
        String authHeader = request.getHeader("authorization");
        log.info("auth header {}",authHeader);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            username = jwtService.extractUsername(token);
            log.info("Jwt Token : {} and user :{}",token,username);
        }
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
            if (Boolean.TRUE.equals(jwtService.validateToken(token, userDetails))) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                log.info("security context holder :{}",SecurityContextHolder.getContext());
            }
        }
        filterChain.doFilter(request, response);
    }
}
