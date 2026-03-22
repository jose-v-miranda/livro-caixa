package com.caixa.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/login", "/css/**", "/js/**").permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .defaultSuccessUrl("/", true)
                )
                .logout(logout -> logout
                        .logoutSuccessUrl("/login")
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService users(PasswordEncoder encoder) {
        return new InMemoryUserDetailsManager(

                User.withUsername("jose")
                        .password(encoder.encode("JV231"))
                        .roles("USER")
                        .build(),

                User.withUsername("andre")
                        .password(encoder.encode("2pudim"))
                        .roles("USER")
                        .build(),

                User.withUsername("vinicius")
                        .password(encoder.encode("1000011"))
                        .roles("USER")
                        .build(),

                User.withUsername("victor")
                        .password(encoder.encode("victorvector"))
                        .roles("USER")
                        .build(),

                User.withUsername("vitor")
                        .password(encoder.encode("apaixonado8"))
                        .roles("USER")
                        .build(),

                User.withUsername("yan")
                        .password(encoder.encode("Mr.Danone"))
                        .roles("USER")
                        .build()
        );
    }
}
