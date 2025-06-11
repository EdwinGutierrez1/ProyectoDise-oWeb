// Importación de módulos necesarios para las pruebas unitarias en Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GaleriaComponent } from './galeria.component';

// Bloque de pruebas unitarias para el componente GaleriaComponent
describe('GaleriaComponent', () => {
  let component: GaleriaComponent; // Variable para almacenar la instancia del componente
  let fixture: ComponentFixture<GaleriaComponent>; // Variable para manejar el componente en pruebas

  // Configuración inicial antes de ejecutar las pruebas
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Configuración del entorno de pruebas importando el componente a testear
      imports: [GaleriaComponent]
    }).compileComponents(); // Compilación del componente antes de iniciar las pruebas

    // Creación del componente y asignación a la variable fixture
    fixture = TestBed.createComponent(GaleriaComponent);
    component = fixture.componentInstance; // Asignación de la instancia del componente
    fixture.detectChanges(); // Aplicación de cambios detectados en la vista
  });

  // Prueba unitaria que verifica si el componente GaleriaComponent se ha creado correctamente
  it('should create', () => {
    expect(component).toBeTruthy(); // Se espera que la instancia del componente exista correctamente
  });
});