import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  // Configura el entorno de pruebas antes de cada test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent] // Importa el componente standalone para pruebas
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent); // Crea una instancia del componente
    component = fixture.componentInstance; // Obtiene el componente para pruebas
    fixture.detectChanges(); // Aplica los cambios para renderizar la vista
  });

  // Test que verifica que el componente se cree correctamente
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
