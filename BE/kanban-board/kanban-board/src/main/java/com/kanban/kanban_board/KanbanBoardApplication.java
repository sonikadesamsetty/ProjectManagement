package com.kanban.kanban_board;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@ComponentScan({"com.common.security", "com.kanban.kanban_board"})
@SpringBootApplication
public class KanbanBoardApplication {

	public static void main(String[] args) {
		SpringApplication.run(KanbanBoardApplication.class, args);
	}

}
