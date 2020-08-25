import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Task } from 'src/app/task';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent implements OnInit {
  @Input() task$: Task = null;
  @Output() notifyParentOfChange: EventEmitter<string> = new EventEmitter<string>();
  newTitle$: string = '';
  updated$: boolean = false;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.newTitle$ = this.task$.title;
  }

  updateTask() {
    if (this.task$.title === this.newTitle$) {
      return;
    }

    this.task$.title = this.newTitle$;
    this.taskService.updateTask(this.task$).subscribe(() => {
      this.updated$ = true;
      console.log("Task updated successfully.");
    },
      err => {
        console.log(err);
      });
  }

  toggleComplete() {
    if (this.task$.completed) {
      this.markUncomplete();
    } else {
      this.markComplete();
    }
  }

  markComplete() {
    this.taskService.patchTask(this.task$.id).subscribe(() => {
      this.notifyParentOfChange.emit('Marking Task Complete');
      console.log("Task marked completed successfully.");
    },
      err => {
        console.log(err);
      });
  }

  markUncomplete() {
    this.task$.completed = !this.task$.completed;
    this.taskService.updateTask(this.task$).subscribe(() => {
      this.notifyParentOfChange.emit('Marking Task Uncomplete');
      console.log("Task marked uncompleted successfully.");
    },
      err => {
        console.log(err);
      });
  }

  deleteTask() {
    this.taskService.deleteTask(this.task$.id).subscribe(() => {
      this.notifyParentOfChange.emit('Deleting Task');
      console.log("Task deleted successfully.");
    },
      err => {
        console.log(err);
      });
  }
}
