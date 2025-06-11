// Importación de módulos necesarios para pruebas unitarias en Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConocenosComponent } from './conocenos.component';

// Definición del bloque de pruebas para el componente ConocenosComponent
describe('ConocenosComponent', () => {
  let component: ConocenosComponent; // Variable para almacenar la instancia del componente
  let fixture: ComponentFixture<ConocenosComponent>; // Variable para manipular el componente en el entorno de pruebas

  // Configuración antes de ejecutar las pruebas
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Configuración del entorno de pruebas, importando el componente a testear
      imports: [ConocenosComponent] 
    }).compileComponents(); // Compilación del componente antes de iniciar pruebas

    // Creación del componente y asignación a la variable fixture
    fixture = TestBed.createComponent(ConocenosComponent);
    component = fixture.componentInstance; // Asignación de la instancia del componente
    fixture.detectChanges(); // Aplicación de cambios detectados en la vista
  });

  // Prueba unitaria que verifica si el componente se ha creado correctamente
  it('should create', () => {
    expect(component).toBeTruthy(); // Se espera que la instancia del componente sea verdadera (exista correctamente)
  });
});