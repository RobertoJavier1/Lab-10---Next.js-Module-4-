# Lab 10 - EventPass

## Parte 1: Event Filters with URL State

Se realizó el manejo de filtros basado en URL utilizando `searchParams` de Next.js. Los filtros se persisten en la URL permitiendo compartir y guardar búsquedas, y se aplican directamente en el servidor sin necesidad de lógica en el cliente.

**Video explicación:** https://youtu.be/CTm-9VyBEK4

### Definition of Done

| Criterio | Descripción | Estado |
|----------|-------------|--------|
| URL updates | Selecting filter changes URL (`?category=music`) | ✅ |
| Filters persist | Refreshing page keeps filters | ✅ |
| Server filtering | Filters applied on server, not client | ✅ |
| Active state | Selected filters visually highlighted | ✅ |
| Reset button | "Clear all" resets to no filters | ✅ |
| Combined filters | Multiple filters work together | ✅ |
| Empty state | "No events found" message when empty | ✅ |

---

## Parte 2: Optimistic Event Registration

Se implementó el uso optimista de eventos utilizando el hook `useOptimistic` de React 19. El contador de registrados se actualiza de forma inmediata al hacer clic, brindando retroalimentación instantánea al usuario sin esperar la confirmación del servidor.

**Video explicación:** https://youtu.be/_pkrjY4FUPs

### Definition of Done

| Criterio | Descripción | Estado |
|----------|-------------|--------|
| Instant feedback | Count increases immediately on click | ✅ |
| useOptimistic used | Implements React 19 `useOptimistic` hook | ✅ |
| Button disabled | Cannot click while registering | ✅ |
| Error handling | Reverts count if server fails | ✅ |
| Success message | Shows confirmation after success | ✅ |
| Capacity check | Cannot register if event is full | ✅ |
| Loading indicator | Shows spinner during action | ✅ |
