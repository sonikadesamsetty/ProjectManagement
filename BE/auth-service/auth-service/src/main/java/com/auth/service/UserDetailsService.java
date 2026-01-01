package com.auth.service;

import com.auth.entity.UserEntity;
import com.auth.model.User;
import com.auth.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {


    @Autowired
    private UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity user = userRepo.findByEmail(email);
        User user1 = new User();
        user1.setUsername(user.getName());
        user1.setPassword(user.getPassword());
        user1.setEmail(user.getEmail());
        if(user == null)
        {
            System.out.println("User not found");
            throw new UsernameNotFoundException("User not found");
        }
        return new com.auth.model.UserDetails(user1);
    }
}
