import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabanasComponent } from './cabanas.component';

// Suite de pruebas para el componente CabanasComponent
describe('CabanasComponent', () => {
  let component: CabanasComponent;
  let fixture: ComponentFixture<CabanasComponent>;

  // Configuración que se ejecuta antes de cada prueba
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabanasComponent] // Importamos el componente standalone
    })
    .compileComponents();

    // Creamos una instancia del componente para las pruebas
    fixture = TestBed.createComponent(CabanasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Ejecuta el ciclo de detección de cambios inicial
  });

  // Prueba básica para verificar que el componente se crea correctamente
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});