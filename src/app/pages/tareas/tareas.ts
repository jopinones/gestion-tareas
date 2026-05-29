import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { Task } from '../../models/task';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-tareas',
  imports: [
    FormsModule,
    DatePipe,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  templateUrl: './tareas.html',
  styleUrl: './tareas.css',
})
export class Tareas implements OnInit {
  tareas: Task[] = [];
  fechaSeleccionada: Date | null = null;

  columnas: string[] = ['id', 'titulo', 'estado', 'prioridad', 'fecha', 'descripcion', 'acciones'];

  nuevaTarea: Task = {
    id: 0,
    titulo: '',
    estado: '',
    prioridad: '',
    fechaCreacion: '',
    descripcion: '',
  };

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.cargarTareas();
  }

  cargarTareas() {
    this.tareas = this.taskService.obtenerTareas();
  }

  agregarTarea() {
    if (
      !this.nuevaTarea.titulo ||
      !this.nuevaTarea.estado ||
      !this.nuevaTarea.prioridad ||
      !this.fechaSeleccionada ||
      !this.nuevaTarea.descripcion
    ) {
      alert('Debe completar todos los campos');
      return;
    }

    const tarea: Task = {
      id: Date.now(),
      titulo: this.nuevaTarea.titulo,
      estado: this.nuevaTarea.estado,
      prioridad: this.nuevaTarea.prioridad,
      fechaCreacion: this.fechaSeleccionada.toISOString().split('T')[0],
      descripcion: this.nuevaTarea.descripcion,
    };

    this.taskService.agregarTarea(tarea);
    this.cargarTareas();
    this.limpiarFormulario();
  }

  eliminarTarea(id: number) {
    const confirmar = confirm('¿Está seguro de eliminar la tarea?');
    if (!confirmar) return;
    this.taskService.eliminarTarea(id);
    this.cargarTareas();
  }

  cambiarEstado(tarea: Task) {
    if (tarea.estado === 'Pendiente') {
      tarea.estado = 'En proceso';
    } else if (tarea.estado === 'En proceso') {
      tarea.estado = 'Finalizada';
    } else {
      tarea.estado = 'Pendiente';
    }
    this.taskService.actualizarTareas(tarea);
    this.cargarTareas();
  }

  limpiarFormulario() {
    this.nuevaTarea = {
      id: 0,
      titulo: '',
      estado: '',
      prioridad: '',
      fechaCreacion: '',
      descripcion: '',
    };
    this.fechaSeleccionada = null;
  }

  obtenerClaseEstado(estado: string): string {
    if (estado === 'Pendiente') return 'estado-pendiente';
    if (estado === 'En proceso') return 'estado-proceso';
    return 'estado-finalizada';
  }

  obtenerClasePrioridad(prioridad: string): string {
    if (prioridad === 'Alta') return 'prioridad-alta';
    if (prioridad === 'Media') return 'prioridad-media';
    return 'prioridad-baja';
  }
}
