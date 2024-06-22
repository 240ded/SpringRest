package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.configs.WebSecurityConfig;
import ru.kata.spring.boot_security.demo.entity.User;
import ru.kata.spring.boot_security.demo.entity.Role;
import ru.kata.spring.boot_security.demo.repositories.UserRepository;

import java.util.*;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        return user;
    }

    public User findUserById(Long userId) {
        Optional<User> userFromDb = userRepository.findById(userId);
        return userFromDb.orElse(new User());
    }

    public List<User> allUsers() {
        return userRepository.findAll();
    }

    public boolean saveUser(User user, String selectedRoleFromView) {
        User userFromDB = userRepository.findByUsername(user.getUsername());

        if (userFromDB != null) {
            return false;
        }

        if (selectedRoleFromView.equals("2")) {
            selectedRoleAdmin(user);
        } else if (selectedRoleFromView.equals("1")) {
            long userRoleId = 2;

            Role userRole = new Role();
            userRole.setId(userRoleId);

            user.setRoles(Collections.singleton(userRole));
        }

        String encodedPassword = "{bcrypt}" + WebSecurityConfig.bCryptPasswordEncoder().encode(user.getPassword());
        user.setPassword(encodedPassword);
        userRepository.save(user);
        return true;
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    public void updateNewUser(Long id, String firstName, String lastName, int age, String email, String password, String selectedRoleFromView) {
        User user = userRepository.getById(id);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setAge(age);
        user.setUsername(email);
        user.setPassword(password);
        if (selectedRoleFromView.equals("2")) {
            selectedRoleAdmin(user);
        } else if (selectedRoleFromView.equals("1")) {
            Set<Role> roles = user.getRoles();
            while (roles.size() != 1) {
                roles.remove(roles.iterator().next());
            }
        }
        userRepository.save(user);
    }

    private void selectedRoleAdmin(User user) {
        long roleId = 1;

        Role userRole1 = new Role();
        userRole1.setId(roleId);

        Role userRole2 = new Role();
        userRole2.setId(2L);

        Set<Role> roles = new HashSet<>();
        roles.add(userRole1);
        roles.add(userRole2);

        user.setRoles(roles);
    }
}