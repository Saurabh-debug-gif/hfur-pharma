package com.unitidepharma.backend.controller;

import com.unitidepharma.backend.dto.CreateMrRequest;
import com.unitidepharma.backend.entity.User;
import com.unitidepharma.backend.service.MrService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/mr")
@RequiredArgsConstructor
public class AdminMrController {

    private final MrService mrService;

    @PostMapping("/create")
    public String createMr(@RequestBody CreateMrRequest request) {
        return mrService.createMr(request);
    }


    @GetMapping
    public List<User> getMRs(){

        return mrService.getAllMRs();

    }
}