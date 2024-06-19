package ru.kata.spring.boot_security.demo.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import ru.kata.spring.boot_security.demo.entity.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.validation.Valid;


@Controller
public class AdminController {

    private UserService userService;

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(value = "/admin", method = RequestMethod.GET)
    public String showAllUsers(Model model) {
        model.addAttribute("users", userService.allUsers());
        return "admin_view";
    }

    @RequestMapping(value = "/admin/addNewUser")
    public String addNewUser(Model model) {
        User user = new User();
        model.addAttribute("user", user);
        return "admin_view_adduser";
    }

    @RequestMapping(value = "/admin/saveUser")
    public String saveUser(@ModelAttribute("user") @Valid User user,
                           BindingResult bindingResult, Model model,
                           @RequestParam("selectRole") String role) {
        if (!userService.saveUser(user, role)){
            bindingResult.addError(new FieldError("user", "username", "User with this username already exists"));
            model.addAttribute("errors", bindingResult);
        }
        if (bindingResult.hasErrors())
            return "user-info";
        userService.saveUser(user, role);
        return "redirect:/admin";
    }

    @RequestMapping(value = "/admin/updateUser")
    public String updateUser(@RequestParam("userId") long id, Model model) {
        User user = userService.findUserById(id);
        model.addAttribute("user", user);
        return "user-info";
    }

    @RequestMapping(value = "/admin/deleteUser")
    public String deleteUser(@RequestParam("userId") long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }

    @RequestMapping(value = "/userForAdmin", method = RequestMethod.GET)
    public String showUserProfile(Model model) {
        model.addAttribute("users", userService.allUsers());
        return "user_view_for_admin";
    }
}
