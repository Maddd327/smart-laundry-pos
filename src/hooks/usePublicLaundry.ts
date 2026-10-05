import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_SERVICES } from "./useServices";
import { laundrySite, type LaundryService } from "@/lib/laundrySite";

export const referenceServices: LaundryService[] = DEFAULT_SERVICES.map(
  (service, index) => ({
    ...service,
    id: `reference-${index}`,
  }),
);

export function usePublicLaundry() {
  const query = useQuery({
    queryKey: ["public-laundry", laundrySite.storeId],
    enabled: Boolean(laundrySite.storeId),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      // Only fetch the configured outlet's public fields. Never list other tenants.
      const { data: store, error: storeError } = await supabase
        .from("stores")
        .select("id, name, description, address, phone, email")
        .eq("id", laundrySite.storeId)
        .eq("is_active", true)
        .single();
      if (storeError) throw storeError;
      const { data: services, error } = await supabase
        .from("services")
        .select(
          "id, name, description, category, kilo_price, unit_price, supports_kilo, supports_unit, duration_value, duration_unit",
        )
        .eq("store_id", store.id)
        .eq("is_active", true)
        .eq("item_type", "service")
        .order("name");
      if (error) throw error;
      return { store, services: (services || []) as LaundryService[] };
    },
  });

  const store = query.data?.store;
  const usingReference = !laundrySite.storeId;
  return {
    ...query,
    usingReference,
    services: usingReference ? referenceServices : query.data?.services || [],
    name: laundrySite.name,
    description: store?.description || "",
    phone: store?.phone || laundrySite.whatsapp,
    address: store?.address || laundrySite.address,
    email: store?.email || laundrySite.email,
  };
}
