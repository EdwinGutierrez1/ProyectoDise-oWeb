import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadesComponent } from './actividades.component';

// Suite de pruebas para el componente de actividades
describe('ActividadesComponent', () => {
  let component: ActividadesComponent;
  let fixture: ComponentFixture<ActividadesComponent>;

  // Configuración que se ejecuta antes de cada prueba
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadesComponent] // Importamos el componente standalone
    })
    .compileComponents(); // Compilamos el módulo de prueba

    // Creamos una instancia del componente para las pruebas
    fixture = TestBed.createComponent(ActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Ejecutamos el ciclo de detección de cambios
  });

  // Prueba básica para verificar que el componente se crea correctamente
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});