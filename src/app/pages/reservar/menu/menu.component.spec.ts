// Importaciones necesarias para testing con Angular Testing Utilities
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';

// Suite de pruebas para el componente MenuComponent
describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  // Configuración que se ejecuta antes de cada test
  beforeEach(async () => {
    // Configuración del módulo de testing
    await TestBed.configureTestingModule({
      imports: [MenuComponent] // Importamos el componente standalone
    })
    .compileComponents(); // Compilamos los componentes

    // Creamos una instancia del componente para testing
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    
    // Ejecutamos el ciclo de detección de cambios inicial
    fixture.detectChanges();
  });

  // Test básico para verificar que el componente se crea correctamente
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});