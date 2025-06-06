import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-galeria',
  standalone: true, // si tu componente es standalone
  imports: [CommonModule],
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.css']
})
export class GaleriaComponent {

  // Estado del modal
  isModalOpen = false;
  currentImageIndex = 0;
  currentImage: any = null;

  // Array con todas las imágenes de la galería
  galleryImages = [
    {
      src: 'decoracion.jpg',
      alt: 'Imagen 1',
      description: 'Decoración para toda ocasión'
    },
    {
      src: 'rio.jpeg',
      alt: 'Imagen 2',
      description: 'Río natural con paisaje impresionante'
    },
    {
      src: 'gamplin2-vertical.jpg',
      alt: 'Imagen 3',
      description: 'Experiencia glamping en la naturaleza'
    },
    {
      src: 'gamplin-v.jpg',
      alt: 'Imagen 4',
      description: 'Glamping con vista panorámica'
    },
    {
      src: 'gamplin2-1.jpg',
      alt: 'Imagen 5',
      description: 'Confort en medio de la naturaleza'
    },
    {
      src: 'gampling2-2.jpg',
      alt: 'Imagen 6',
      description: 'Experiencia única de camping de lujo'
    },
    {
      src: 'vaca.jpg',
      alt: 'Imagen 7',
      description: 'Conexión con la naturaleza'
    },
    {
      src: 'malla.jpg',
      alt: 'Imagen 8',
      description: 'Relajación en familia'
    },
    {
      src: 'Vistas.jpg',
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
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
  }

  // Función para cerrar el modal
  closeModal(): void {
    this.isModalOpen = false;
    this.currentImage = null;
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
  }

  // Función para ir a la imagen anterior
  previousImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else {
      // Si está en la primera imagen, ir a la última
      this.currentImageIndex = this.galleryImages.length - 1;
    }
    this.currentImage = this.galleryImages[this.currentImageIndex];
  }

  // Función para ir a la imagen siguiente
  nextImage(): void {
    if (this.currentImageIndex < this.galleryImages.length - 1) {
      this.currentImageIndex++;
    } else {
      // Si está en la última imagen, ir a la primera
      this.currentImageIndex = 0;
    }
    this.currentImage = this.galleryImages[this.currentImageIndex];
  }

  // Escuchar eventos del teclado para navegación
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

  // Limpiar el overflow del body al destruir el componente
  ngOnDestroy(): void {
    document.body.style.overflow = 'auto';
  }
}