// =============================================================================
// COMPONENTE EVENT FILTERS FORM - Module 4: Event Pass
// =============================================================================
// Formulario de filtros mejorado con interactividad.
//
// ## Client Component
// Lo hemos convertido a 'use client' para permitir:
// 1. Auto-submit al cambiar selectores (UX más fluida)
// 2. Mantener la URL sincronizada sin recargas completas
// 3. Búsqueda con debounce para escribir y filtrar automáticamente
//
// ## Progressive Enhancement
// Aunque usamos JS para mejorar la UX, el formulario sigue usando 
// method="GET" y action="/events", por lo que es robusto y estándar.
// =============================================================================

'use client';

import { Search, X} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EVENT_CATEGORIES, CATEGORY_LABELS, EVENT_STATUSES, STATUS_LABELS, type EventCategory, type EventStatus } from '@/types/event';
import { useRef, useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

//Helper: construye la URL omitiendo los campos vacios
//Ejemplo: events?search=rock&category=music&priceMax=50
function buildUrl(filters: Partial<EventFiltersFormProps['currentFilters']>): string{
  const params = new URLSearchParams();

  if (filters.search)    params.set('search',   filters.search);
  if (filters.category)  params.set('category', filters.category);
  if (filters.status)    params.set('status',   filters.status);
  if (filters.priceMax !== undefined) params.set('priceMax', String(filters.priceMax));

  const qs = params.toString();
  return qs ? `/events?${qs}` : '/events';
}

//Helper: etiqueta legible para el filtro de precio
function getPriceLabel(priceMax: number): string {
  if (priceMax === 0) return 'Gratis';
  return `Hasta $${priceMax}`;
}

//badge/pill de un filtro activo
function FilterBadge({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20 transition-colors hover:bg-primary/20"
    >
      {label}
      <X className="h-3 w-3" />
    </Link>
  );
}


interface EventFiltersFormProps {
  currentFilters: {
    search?: string;
    category?: EventCategory;
    status?: string;
    priceMax?: number;
  };
}

/**
 * Formulario de filtros de eventos (Client Component).
 */
export function EventFiltersForm({ currentFilters }: EventFiltersFormProps): React.ReactElement {
  const formRef = useRef<HTMLFormElement>(null);

  // Estado local para el input de búsqueda
  const [searchTerm, setSearchTerm] = useState(currentFilters.search ?? '');

  // Valor debounced (retrasado 500ms)
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Ref para evitar bucle infinito en primer render
  const isFirstRender = useRef(true);

  const hasFilters =
    currentFilters.search || currentFilters.category || currentFilters.priceMax || currentFilters.status;

  // Efecto para auto-submit cuando cambia el texto debounced
  useEffect(() => {
    // Saltamos el primer render para evitar submit al cargar la página
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Enviamos el formulario programáticamente
    formRef.current?.requestSubmit();
  }, [debouncedSearch]);

  // Handler para auto-submit de selects
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.currentTarget.form?.requestSubmit(); // Usamos evento directo para select
  };

  // Handler para input de búsqueda (actualiza estado local)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      {/* Formulario con method GET */}
      <form ref={formRef} method="GET" action="/events" className="space-y-4">
        {/* Búsqueda */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-9"
            />
          </div>
          {/* Botón de búsqueda (opcional pero bueno para accesibilidad) */}
          <Button type="submit">Buscar</Button>
        </div>

        {/* Filtros adicionales */}
        <div className="flex flex-wrap gap-4">
          {/* Categoría */}
          <select
            name="category"
            defaultValue={currentFilters.category ?? ''}
            onChange={handleFilterChange}
            className="h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="">Todas las categorías</option>
            {EVENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            name="status"
            defaultValue={currentFilters.status ?? ''}
            onChange={handleFilterChange}
            className="h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="">Todos los estados</option>
            {EVENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>

          {/* Precio maximo */}
          <select
            name="priceMax"
            defaultValue={currentFilters.priceMax?.toString() ?? ''}
            onChange={handleFilterChange}
            className="h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="">Cualquier precio</option>
            <option value="0">Gratis</option>
            <option value="25">Hasta $25</option>
            <option value="50">Hasta $50</option>
            <option value="100">Hasta $100</option>
            <option value="200">Hasta $200</option>
          </select>

          {/* Botón limpiar */}
          {hasFilters && (
            <Link href="/events">
              <Button type="button" variant="ghost" className="gap-2">
                Limpiar filtros
              </Button>
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}
