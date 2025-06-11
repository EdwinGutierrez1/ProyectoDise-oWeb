// Importación de módulos necesarios para las pruebas unitarias en Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormularioComponent } from './formulario.component';

// Definición del bloque de pruebas para el componente FormularioComponent
describe('FormularioComponent', () => {
  let component: FormularioComponent; // Variable que almacena la instancia del componente
  let fixture: ComponentFixture<FormularioComponent>; // Variable que maneja el entorno de pruebas

  // Configuración inicial antes de ejecutar cada prueba
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioComponent] // Importación del componente standalone para pruebas
    }).compileComponents(); // Compilación del componente antes de iniciar los tests

    fixture = TestBed.createComponent(FormularioComponent); // Crea una instancia del componente
    component = fixture.componentInstance; // Asigna la instancia del componente a la variable
    fixture.detectChanges(); // Aplica los cambios en la vista después de la inicialización
  });

  // Prueba unitaria que verifica si el componente FormularioComponent se ha creado correctamente
  it('should create', () => {
    expect(component).toBeTruthy(); // Se espera que la instancia del componente exista correctamente
  });
});