import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack>
      {/* Telas existentes */}
      <Stack.Screen 
        name="seguranca" 
        options={{ title: 'Segurança Cotia' }} 
      />
      <Stack.Screen 
        name="cadastrar-alerta" 
        options={{ title: 'Registrar Alerta' }} 
      />
      
      <Stack.Screen 
        name="editar-alerta" 
        options={{ title: 'Editar Alerta' }} 
      />
      <Stack.Screen 
        name="educacao" 
        options={{ title: 'Educação - Cursos' }} 
      />
      
    </Stack>
  );
}