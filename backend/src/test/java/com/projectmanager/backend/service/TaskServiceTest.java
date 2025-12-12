package com.projectmanager.backend.service;

import com.projectmanager.backend.dto.request.TaskRequest;
import com.projectmanager.backend.dto.response.TaskResponse;
import com.projectmanager.backend.mapper.TaskMapper;
import com.projectmanager.backend.model.Project;
import com.projectmanager.backend.model.Task;
import com.projectmanager.backend.model.User;
import com.projectmanager.backend.repository.ProjectRepository;
import com.projectmanager.backend.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private TaskMapper taskMapper;

    @InjectMocks
    private TaskService taskService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createTask_ShouldSuccess_WhenValidData() {
        // Arrange
        UUID projectId = UUID.randomUUID();
        String email = "test@test.com";

        User user = new User();
        user.setEmail(email);

        Project project = new Project();
        project.setId(projectId);
        project.setUser(user);

        TaskRequest request = new TaskRequest();
        request.setTitle("Unit Test Task");
        request.setDescription("Testing");
        request.setDueDate(LocalDate.now().plusDays(1));

        Task task = new Task();
        task.setId(UUID.randomUUID());

        TaskResponse response = new TaskResponse();
        response.setTitle("Unit Test Task");

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(taskMapper.toEntity(request)).thenReturn(task);
        when(taskRepository.save(any(Task.class))).thenReturn(task);
        when(taskMapper.toResponse(task)).thenReturn(response);

        TaskResponse result = taskService.createTask(projectId, request, email);

        assertNotNull(result);
        assertEquals("Unit Test Task", result.getTitle());
        verify(taskRepository, times(1)).save(any(Task.class));
    }
}