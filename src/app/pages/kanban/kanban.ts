import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Task } from '../../models/task';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-kanban',
  imports: [DragDropModule, MatCardModule, MatIconModule, MatButtonModule, DatePipe],
  templateUrl: './kanban.html',
  styleUrl: './kanban.css',
})
export class Kanban implements OnInit {
  pendientes: Task[] = [];
  enProceso: Task[] = [];
  finalizadas: Task[] = [];

  constructor(private taskService: TaskService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarTareas();
  }

  cargarTareas() {
    this.taskService.obtenerTareas().subscribe({
      next: (todas) => {
        this.pendientes = todas.filter((t) => t.estado === 'Pendiente');
        this.enProceso = todas.filter((t) => t.estado === 'En proceso');
        this.finalizadas = todas.filter((t) => t.estado === 'Finalizada');
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error al cargar tareas', err),
    });
  }

  drop(event: CdkDragDrop<Task[]>, nuevoEstado: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const tarea = event.container.data[event.currentIndex];
      tarea.estado = nuevoEstado;
      this.taskService.actualizarTarea(tarea).subscribe({
        error: (err) => console.error('Error al actualizar tarea', err),
      });
    }
  }

  eliminarTarea(id: string) {
    if (!confirm('¿Está seguro de eliminar la tarea?')) return;
    this.taskService.eliminarTarea(id).subscribe({
      next: () => this.cargarTareas(),
      error: (err) => console.error('Error al eliminar tarea', err),
    });
  }

  clasePrioridad(prioridad: string): string {
    if (prioridad === 'Alta') return 'prioridad-alta';
    if (prioridad === 'Media') return 'prioridad-media';
    return 'prioridad-baja';
  }
}
