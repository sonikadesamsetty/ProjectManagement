package com.auth.controller;

import com.auth.service.UserService;
import com.auth.model.Response;
import com.auth.model.User;
import com.auth.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.List;

@RestController
//@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class UserController {

    @Autowired
    UserRepo userRepo;

    @Autowired
    UserService userService;

    @RequestMapping(value = "/login", produces = {"application/json"}, method = RequestMethod.POST)
    public Response loginUser(@RequestBody User user) throws NoSuchAlgorithmException {
        System.out.println("33333333333");
        System.out.println(user);
        Response resp = userService.verify(user);
        System.out.println(resp);
        return resp;
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        System.out.println(user);
        User resp = userService.register(user);
         return ResponseEntity.ok(resp);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return userService.getAllUsers();
    }
}
