// Importación de módulos necesarios para las pruebas unitarias en Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarouselComponent } from './carousel.component';

// Bloque de pruebas para el componente CarouselComponent
describe('CarouselComponent', () => {
  let component: CarouselComponent; // Variable para almacenar la instancia del componente
  let fixture: ComponentFixture<CarouselComponent>; // Variable para manipular el componente en pruebas

  // Configuración antes de ejecutar las pruebas
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Configuración del entorno de pruebas con los módulos requeridos
      imports: [CarouselComponent] 
    }).compileComponents(); // Compilación del componente antes de iniciar pruebas

    // Creación del componente y asignación a la variable fixture
    fixture = TestBed.createComponent(CarouselComponent);
    component = fixture.componentInstance; // Instancia del componente
    fixture.detectChanges(); // Aplicación de cambios detectados
  });

  // Prueba unitaria que verifica si el componente se ha creado correctamente
  it('should create', () => {
    expect(component).toBeTruthy(); // Se espera que la instancia del componente sea verdadera
  });
});