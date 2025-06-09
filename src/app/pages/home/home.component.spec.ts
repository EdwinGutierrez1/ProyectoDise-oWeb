// Importación de módulos necesarios para pruebas unitarias en Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';

// Bloque de pruebas para el componente HomeComponent
describe('HomeComponent', () => {
  let component: HomeComponent; // Variable que almacena la instancia del componente
  let fixture: ComponentFixture<HomeComponent>; // Variable que maneja el componente en pruebas

  // Configuración del entorno de pruebas antes de cada test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent] // Importa el componente standalone para pruebas
    }).compileComponents(); // Compila el componente antes de ejecutar los tests

    fixture = TestBed.createComponent(HomeComponent); // Crea una instancia del componente
    component = fixture.componentInstance; // Obtiene el componente para pruebas
    fixture.detectChanges(); // Aplica los cambios y actualiza la vista
  });

  // Test que verifica si el componente HomeComponent se ha creado correctamente
  it('should create', () => {
    expect(component).toBeTruthy(); // Se espera que la instancia del componente exista correctamente
  });
});