import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

@Component({
  imports: [FormsModule],
  selector: 'app-login',
  styleUrl: 'login.css',
  templateUrl: 'login.html',
})
export class Login implements AfterViewInit, OnDestroy {

  @ViewChild('particleCanvas')
  particleCanvas!: ElementRef<HTMLCanvasElement>;

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly changeDetector = inject(ChangeDetectorRef);

  usuario = '';
  password = '';
  mensajeError = '';

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private animationFrame = 0;

  private particles: Particle[] = [];

  private mouse = {
    x: -1000,
    y: -1000,
    active: false
  };

  ngAfterViewInit(): void {
    this.iniciarParticulas();
  }

  private iniciarParticulas(): void {

    this.canvas = this.particleCanvas.nativeElement;

    const contexto = this.canvas.getContext('2d');

    if (!contexto) {
      return;
    }

    this.ctx = contexto;

    this.ajustarCanvas();

    this.crearParticulas();

    window.addEventListener('resize', this.ajustarCanvas);

    this.canvas.addEventListener(
      'mousemove',
      this.moverMouse
    );

    this.canvas.addEventListener(
      'mouseleave',
      this.salirMouse
    );

    this.animarParticulas();
  }

  private ajustarCanvas = (): void => {

    if (!this.canvas) {
      return;
    }

    const escala = window.devicePixelRatio || 1;

    this.canvas.width = window.innerWidth * escala;
    this.canvas.height = window.innerHeight * escala;

    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;

    this.ctx.setTransform(
      escala,
      0,
      0,
      escala,
      0,
      0
    );

    this.crearParticulas();
  };

  private crearParticulas(): void {

    if (!this.canvas) {
      return;
    }

    const cantidad = Math.min(
      70,
      Math.max(
        35,
        Math.floor(window.innerWidth / 22)
      )
    );

    this.particles = [];

    for (let i = 0; i < cantidad; i++) {

      const angulo =
        Math.random() * Math.PI * 2;

      const velocidad =
        0.18 + Math.random() * 0.35;

      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,

        vx:
          Math.cos(angulo) *
          velocidad,

        vy:
          Math.sin(angulo) *
          velocidad,

        radius:
          2 + Math.random() * 3.5,

        opacity:
          0.25 + Math.random() * 0.45
      });
    }
  }

  private moverMouse = (evento: MouseEvent): void => {

    this.mouse.x = evento.clientX;
    this.mouse.y = evento.clientY;
    this.mouse.active = true;
  };

  private salirMouse = (): void => {

    this.mouse.active = false;

    this.mouse.x = -1000;
    this.mouse.y = -1000;
  };

  private animarParticulas = (): void => {

    if (!this.ctx) {
      return;
    }

    const ancho = window.innerWidth;
    const alto = window.innerHeight;

    this.ctx.clearRect(
      0,
      0,
      ancho,
      alto
    );

    this.actualizarParticulas(
      ancho,
      alto
    );

    this.dibujarConexiones();

    this.dibujarParticulas();

    this.animationFrame =
      requestAnimationFrame(
        this.animarParticulas
      );
  };

  private actualizarParticulas(
    ancho: number,
    alto: number
  ): void {

    for (const particle of this.particles) {

      particle.x += particle.vx;
      particle.y += particle.vy;

      /*
       * Movimiento suave alrededor
       * de los bordes.
       */

      if (particle.x < -20) {
        particle.x = ancho + 20;
      }

      if (particle.x > ancho + 20) {
        particle.x = -20;
      }

      if (particle.y < -20) {
        particle.y = alto + 20;
      }

      if (particle.y > alto + 20) {
        particle.y = -20;
      }

      /*
       * Interacción con el mouse.
       */

      if (this.mouse.active) {

        const dx =
          this.mouse.x - particle.x;

        const dy =
          this.mouse.y - particle.y;

        const distancia =
          Math.sqrt(
            dx * dx +
            dy * dy
          );

        const radioInteraccion = 170;

        if (
          distancia < radioInteraccion &&
          distancia > 0
        ) {

          const fuerza =
            (radioInteraccion - distancia) /
            radioInteraccion;

          /*
           * Las partículas se acercan
           * ligeramente al cursor.
           */

          particle.vx +=
            (dx / distancia) *
            fuerza *
            0.018;

          particle.vy +=
            (dy / distancia) *
            fuerza *
            0.018;
        }
      }

      /*
       * Evitamos que las partículas
       * aceleren demasiado.
       */

      const velocidadActual =
        Math.sqrt(
          particle.vx * particle.vx +
          particle.vy * particle.vy
        );

      const velocidadMaxima = 0.9;

      if (
        velocidadActual >
        velocidadMaxima
      ) {

        particle.vx =
          (particle.vx /
            velocidadActual) *
          velocidadMaxima;

        particle.vy =
          (particle.vy /
            velocidadActual) *
          velocidadMaxima;
      }
    }
  }

  private dibujarParticulas(): void {

    for (const particle of this.particles) {

      let alpha =
        particle.opacity;

      if (this.mouse.active) {

        const dx =
          this.mouse.x - particle.x;

        const dy =
          this.mouse.y - particle.y;

        const distancia =
          Math.sqrt(
            dx * dx +
            dy * dy
          );

        if (distancia < 170) {

          alpha =
            Math.min(
              0.9,
              alpha +
              (170 - distancia) /
              170 *
              0.45
            );
        }
      }

      this.ctx.beginPath();

      this.ctx.arc(
        particle.x,
        particle.y,
        particle.radius,
        0,
        Math.PI * 2
      );

      this.ctx.fillStyle =
        `rgba(34, 127, 152, ${alpha})`;

      this.ctx.shadowBlur = 10;

      this.ctx.shadowColor =
        'rgba(34, 127, 152, 0.25)';

      this.ctx.fill();

      this.ctx.shadowBlur = 0;
    }
  }

  private dibujarConexiones(): void {

    const distanciaMaxima = 145;

    /*
     * Conexiones normales entre partículas.
     */

    for (
      let i = 0;
      i < this.particles.length;
      i++
    ) {

      for (
        let j = i + 1;
        j < this.particles.length;
        j++
      ) {

        const a =
          this.particles[i];

        const b =
          this.particles[j];

        const dx =
          a.x - b.x;

        const dy =
          a.y - b.y;

        const distancia =
          Math.sqrt(
            dx * dx +
            dy * dy
          );

        if (
          distancia <
          distanciaMaxima
        ) {

          const alpha =
            (1 -
              distancia /
              distanciaMaxima) *
            0.20;

          this.ctx.beginPath();

          this.ctx.moveTo(
            a.x,
            a.y
          );

          this.ctx.lineTo(
            b.x,
            b.y
          );

          this.ctx.strokeStyle =
            `rgba(34, 127, 152, ${alpha})`;

          this.ctx.lineWidth = 0.7;

          this.ctx.stroke();
        }
      }
    }

    /*
     * Conexiones especiales
     * alrededor del mouse.
     */

    if (!this.mouse.active) {
      return;
    }

    const radioMouse = 190;

    for (const particle of this.particles) {

      const dx =
        this.mouse.x - particle.x;

      const dy =
        this.mouse.y - particle.y;

      const distancia =
        Math.sqrt(
          dx * dx +
          dy * dy
        );

      if (
        distancia <
        radioMouse
      ) {

        const alpha =
          (1 -
            distancia /
            radioMouse) *
          0.55;

        this.ctx.beginPath();

        this.ctx.moveTo(
          particle.x,
          particle.y
        );

        this.ctx.lineTo(
          this.mouse.x,
          this.mouse.y
        );

        this.ctx.strokeStyle =
          `rgba(34, 127, 152, ${alpha})`;

        this.ctx.lineWidth = 1;

        this.ctx.stroke();
      }
    }
  }

  iniciarSesion(): void {

    this.mensajeError = '';

    if (
      !this.usuario.trim() ||
      !this.password.trim()
    ) {

      this.mensajeError =
        'Ingrese su usuario y contraseña.';

      this.changeDetector.detectChanges();

      return;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');

    const datosLogin = {
      username:
        this.usuario.trim(),

      password:
        this.password
    };

    this.http.post<any>(
      'http://localhost:8080/api/auth/login',
      datosLogin
    ).subscribe({

      next: (respuesta) => {

        console.log(
          'Login exitoso:',
          respuesta
        );

        const rol =
          respuesta.role ??
          respuesta.rol ??
          '';

        localStorage.setItem(
          'token',
          respuesta.token
        );

        localStorage.setItem(
          'username',
          respuesta.username
        );

        localStorage.setItem(
          'role',
          rol
        );

        console.log(
          'Usuario:',
          respuesta.username
        );

        console.log(
          'Rol:',
          rol
        );

        this.router.navigate([
          '/dashboard'
        ]);
      },

      error: (error) => {

        console.error(
          'Error de inicio de sesión:',
          error
        );

        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');

        this.mensajeError =
          'Usuario o contraseña incorrectos.';

        this.changeDetector.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {

    cancelAnimationFrame(
      this.animationFrame
    );

    window.removeEventListener(
      'resize',
      this.ajustarCanvas
    );

    if (this.canvas) {

      this.canvas.removeEventListener(
        'mousemove',
        this.moverMouse
      );

      this.canvas.removeEventListener(
        'mouseleave',
        this.salirMouse
      );
    }
  }
}
