export const laundrySite = {
  name: import.meta.env.VITE_LAUNDRY_NAME || "Laundry Mr Andy",
  whatsapp: import.meta.env.VITE_LAUNDRY_WHATSAPP || "+62 821-3194-417",
  address: import.meta.env.VITE_LAUNDRY_ADDRESS || "",
  email: import.meta.env.VITE_LAUNDRY_EMAIL || "",
  hours: import.meta.env.VITE_LAUNDRY_HOURS || "",
  instagram: import.meta.env.VITE_LAUNDRY_INSTAGRAM || "",
  storeId: import.meta.env.VITE_PUBLIC_STORE_ID || "",
};

export interface LaundryService {
  id: string;
  name: string;
  description?: string;
  category: string;
  kilo_price?: number;
  unit_price?: number;
  supports_kilo: boolean;
  supports_unit: boolean;
  duration_value: number;
  duration_unit: "hours" | "days";
}

export const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

export const serviceDuration = (service: LaundryService) =>
  `${service.duration_value} ${service.duration_unit === "days" ? "hari" : "jam"}`;

export function normalizeWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `62${digits}`;
  return digits;
}

export function isValidCustomerPhone(phone: string): boolean {
  return (
    /^[+\d ()-]+$/.test(phone) &&
    /^[1-9]\d{9,14}$/.test(normalizeWhatsApp(phone))
  );
}

export function whatsAppLink(phone: string, message: string): string {
  return `https://wa.me/${normalizeWhatsApp(phone)}?text=${encodeURIComponent(message)}`;
}

export interface LaundryRequest {
  name: string;
  phone: string;
  address: string;
  serviceId: string;
  unit: "kilo" | "unit";
  quantity: string;
  date: string;
  fulfillment: "outlet" | "pickup";
  notes: string;
}

export function requestEstimate(
  service: LaundryService,
  unit: LaundryRequest["unit"],
  quantity: string,
) {
  const value = Number(quantity);
  const supported =
    unit === "kilo" ? service.supports_kilo : service.supports_unit;
  const price = unit === "kilo" ? service.kilo_price : service.unit_price;
  if (
    !supported ||
    price == null ||
    !Number.isFinite(price) ||
    !Number.isFinite(value) ||
    value <= 0
  )
    return null;
  if (unit === "unit" && !Number.isInteger(value)) return null;
  return price * value;
}

export function requestMessage(
  request: LaundryRequest,
  service: LaundryService,
  brand: string,
) {
  const estimate = requestEstimate(service, request.unit, request.quantity);
  const [year, month, day] = request.date.split("-");
  return [
    `Halo ${brand}, saya ingin memesan laundry.`,
    "",
    `Nama: ${request.name.trim()}`,
    `WhatsApp: ${request.phone.trim()}`,
    `Alamat: ${request.address.trim() || "Saya antar ke outlet"}`,
    `Layanan: ${service.name}`,
    `Perkiraan jumlah: ${request.quantity} ${request.unit === "kilo" ? "kg" : "item"}`,
    `Estimasi biaya: ${estimate == null ? "Mohon konfirmasi" : formatRupiah(estimate)}`,
    `Estimasi pengerjaan: ${serviceDuration(service)}`,
    `Tanggal yang diajukan: ${day}/${month}/${year}`,
    `Pengantaran: ${request.fulfillment === "pickup" ? "Ajukan antar jemput (mohon konfirmasi area, biaya, dan ketersediaan)" : "Saya antar ke outlet"}`,
    `Catatan: ${request.notes.trim() || "-"}`,
    "",
    "Mohon konfirmasi ketersediaan layanan, jadwal, berat akhir, dan total biaya. Terima kasih.",
  ].join("\n");
}

export function localDateInput(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
