import { sideBarOptions } from '../components/sidebar/sideBarOptions'; 

//Pruebas para evaluar las opciones de la barra lateral.
describe('Estructura y contenido de sideBarOptions', () => {
    // Prueba específica para validar la estructura y tipos de datos de las opciones de la barra lateral.
    it('contiene la estructura correcta y los tipos para cada opción', () => {
      // Recorre cada opción de la barra lateral para hacer las siguientes validaciones:
      sideBarOptions.forEach(option => {
        // Comprueba la presencia y tipos correctos de las propiedades básicas: 'icon' y 'text'.
        expect(option).toHaveProperty('icon');
        expect(option).toHaveProperty('text');
        expect(typeof option.text).toBe('string');
  
        // Si existe 'href', verifica que sea una cadena de texto.
        if (option.href) {
          expect(typeof option.href).toBe('string');
        }
  
        // Verifica la presencia y tipo correcto de 'isActive', si existe.
        if (option.hasOwnProperty('isActive')) {
          expect(typeof option.isActive).toBe('boolean');
        }
  
        // Para opciones con subenlaces, se realizan verificaciones similares en cada subenlace.
        if (option.sublinks) {
          expect(Array.isArray(option.sublinks)).toBeTruthy();
          option.sublinks.forEach(sublink => {
            // Asegura que cada subenlace tenga las propiedades esperadas y con los tipos correctos.
            expect(sublink).toHaveProperty('href');
            expect(typeof sublink.href).toBe('string');
            expect(sublink).toHaveProperty('text');
            expect(typeof sublink.text).toBe('string');
            expect(sublink).toHaveProperty('icon');
            expect(sublink).toHaveProperty('isActive');
            expect(typeof sublink.isActive).toBe('boolean');
          });
        }
      });
    });
  });
