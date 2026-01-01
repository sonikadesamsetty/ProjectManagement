package com.auth.service;

import com.auth.entity.UserEntity;
import com.auth.model.Response;
import com.auth.model.User;
import com.auth.repository.UserRepo;
import com.common.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import com.common.security.JwtFilter;


@Service
public class UserService {

    @Autowired
    AuthenticationManager  authenticationManager;

    @Autowired
    JwtUtil jwtServicebk;

    @Autowired
    UserRepo userRepo;

    public Response verify(User user) throws NoSuchAlgorithmException {

        Authentication  authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(),user.getPassword()));
        System.out.println("sonika");
        System.out.println(authentication.isAuthenticated());
        if(authentication.isAuthenticated())
        {
            String token = jwtServicebk.generateToken(user.getEmail(), user.getEmail());
            System.out.println(token);
            return new Response(token, user);
        }
        return new Response(null,null);
    }

    public User register(User user) {
        UserEntity  userEntity = new UserEntity();
        userEntity.setName(user.getUsername());
        userEntity.setEmail(user.getEmail());
        userEntity.setPassword(user.getPassword());
        userRepo.save(userEntity);
        return user;
    }

    public ResponseEntity<List<User>> getAllUsers() {
        List<UserEntity> users = userRepo.findAll();
        List<User> userList = new ArrayList<>();
        users.forEach(userEntity -> {
            User user = new User();
            user.setUserId(userEntity.getUserId());
            user.setEmail(userEntity.getEmail());
            userList.add(user);
        });
        return ResponseEntity.ok(userList);
    }
}
