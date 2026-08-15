// Importación de módulos necesarios para definir el componente en Angular
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

// Decorador que define el componente Angular
@Component({
  selector: 'app-galeria', // Identificador para referenciar el componente en plantillas HTML
  standalone: true, // Indica que el componente es standalone (no depende de un módulo)
  imports: [CommonModule], // Importa el módulo CommonModule para funcionalidades básicas
  templateUrl: './galeria.component.html', // Archivo de plantilla HTML del componente
  styleUrls: ['./galeria.component.css'] // Archivo de estilos CSS asociado al componente
})
export class GaleriaComponent {

  // Estado del modal: controla si está abierto o cerrado
  isModalOpen = false;
  currentImageIndex = 0; // Índice de la imagen actual en la galería
  currentImage: any = null; // Imagen activa en el modal

  // Array con todas las imágenes de la galería y sus descripciones
  galleryImages = [
    {
      src: 'decoracion.png',
      alt: 'Imagen 1',
      description: 'Decoración para toda ocasión'
    },
    {
      src: 'galeria_rio.jpg',
      alt: 'Imagen 2',
      description: 'Río natural con paisaje impresionante'
    },
    {
      src: 'galeria_glamping_naturaleza.png',
      alt: 'Imagen 3',
      description: 'Experiencia glamping en la naturaleza'
    },
    {
      src: 'GaleriaVistaPanoramica.jpg',
      alt: 'Imagen 4',
      description: 'Glamping con vista panorámica'
    },
    {
      src: 'galeria_confort.png',
      alt: 'Imagen 5',
      description: 'Confort en medio de la naturaleza'
    },
    {
      src: 'galeria_camping_lujo.jpg',
      alt: 'Imagen 6',
      description: 'Experiencia única de camping de lujo'
    },
    {
      src: 'galeria_conexion.png',
      alt: 'Imagen 7',
      description: 'Conexión con la naturaleza'
    },
    {
      src: 'galeria_familia.png',
      alt: 'Imagen 8',
      description: 'Relajación en familia'
    },
    {
      src: 'galeria_ensueño.jpg',
      alt: 'Imagen 9',
      description: 'Paisajes de ensueño'
    }
  ];

  constructor() { }

  // Función para abrir el modal con la imagen seleccionada
  openModal(index: number): void {
    this.currentImageIndex = index;
    this.currentImage = this.galleryImages[index];
    this.isModalOpen = true;
    // Prevenir scroll en el body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
  }

  // Función para cerrar el modal
  closeModal(): void {
    this.isModalOpen = false;
    this.currentImage = null;
    // Restaurar el scroll en el body cuando el modal se cierra
    document.body.style.overflow = 'auto';
  }

  // Función para navegar a la imagen anterior
  previousImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else {
      // Si está en la primera imagen, ir a la última
      this.currentImageIndex = this.galleryImages.length - 1;
    }
    this.currentImage = this.galleryImages[this.currentImageIndex];
  }

  // Función para navegar a la imagen siguiente
  nextImage(): void {
    if (this.currentImageIndex < this.galleryImages.length - 1) {
      this.currentImageIndex++;
    } else {
      // Si está en la última imagen, volver a la primera
      this.currentImageIndex = 0;
    }
    this.currentImage = this.galleryImages[this.currentImageIndex];
  }

  // Escuchar eventos del teclado para navegación en el modal
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.isModalOpen) {
      switch (event.key) {
        case 'Escape':
          this.closeModal();
          break;
        case 'ArrowLeft':
          this.previousImage();
          break;
        case 'ArrowRight':
          this.nextImage();
          break;
      }
    }
  }

  // Restaurar el scroll del body al destruir el componente
  ngOnDestroy(): void {
    document.body.style.overflow = 'auto';
  }
}