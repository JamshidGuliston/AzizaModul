import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { StudentService } from '../../core/services/student.service';
import { ModuleService } from '../../core/services/module.service';
import { Module } from '../../core/models/module.model';
import { StudentAuthComponent } from '../student-auth/student-auth.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogModule, TranslatePipe],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  router = inject(Router);
  studentService = inject(StudentService);
  moduleService = inject(ModuleService);
  private dialog = inject(MatDialog);

  isStudentLoggedIn = signal(false);
  isDarkMode = signal(false);
  modules = signal<Module[]>([]);

  ngOnInit() {
    this.isStudentLoggedIn.set(this.studentService.isStudentLoggedIn());

    // Check local storage for theme preference or default to light
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
      this.isDarkMode.set(true);
      document.body.classList.add('dark-theme');
    } else {
      this.isDarkMode.set(false);
      document.body.classList.remove('dark-theme');
    }

    this.moduleService.getAll(environment.teacherId).subscribe(mods => {
      this.modules.set(mods.slice(0, 6));
    });
  }

  toggleTheme() {
    this.isDarkMode.update(v => !v);
    if (this.isDarkMode()) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  scrollToModules() {
    document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' });
  }

  onBoshlash() {
    if (this.studentService.isStudentLoggedIn()) {
      this.router.navigate(['/student/modules']);
    } else {
      this.openAuthDialog();
    }
  }

  openAuthDialog() {
    this.dialog.open(StudentAuthComponent, {
      width: '480px',
      panelClass: 'student-auth-dialog'
    });
  }

  goToStudentModules() {
    this.router.navigate(['/student/modules']);
  }
}
