import { describe, expect, it } from "vitest";
import {
  isValidCustomerPhone,
  localDateInput,
  normalizeWhatsApp,
  requestEstimate,
  requestMessage,
  whatsAppLink,
  type LaundryRequest,
  type LaundryService,
} from "./laundrySite";

const service: LaundryService = {
  id: "regular",
  name: "Cuci Setrika Regular",
  category: "wash",
  kilo_price: 6000,
  unit_price: 18000,
  supports_kilo: true,
  supports_unit: true,
  duration_value: 2,
  duration_unit: "days",
};
const request: LaundryRequest = {
  name: "Pelanggan Uji",
  phone: "081234567890",
  address: "Alamat pengujian",
  serviceId: service.id,
  unit: "kilo",
  quantity: "2.5",
  date: "2026-10-05",
  fulfillment: "pickup",
  notes: "Tanpa pewangi",
};

describe("Laundry request pricing and handoff", () => {
  it("keeps the existing per kg and per item prices with fractional kg", () => {
    expect(requestEstimate(service, "kilo", "2.5")).toBe(15000);
    expect(requestEstimate(service, "unit", "2")).toBe(36000);
  });
  it("does not estimate unsupported units, absent prices, or invalid quantities", () => {
    for (const quantity of ["", "0", "-1", "NaN", "Infinity"])
      expect(requestEstimate(service, "kilo", quantity)).toBeNull();
    expect(requestEstimate(service, "unit", "1.5")).toBeNull();
    expect(
      requestEstimate({ ...service, supports_unit: false }, "unit", "1"),
    ).toBeNull();
    expect(
      requestEstimate({ ...service, kilo_price: undefined }, "kilo", "1"),
    ).toBeNull();
  });
  it("includes customer details and explicitly asks for pickup and final price confirmation", () => {
    const message = requestMessage(request, service, "Laundry Mr Andy");
    expect(message).toContain("Perkiraan jumlah: 2.5 kg");
    expect(message).toContain("Tanggal yang diajukan: 05/10/2026");
    expect(message).toContain("mohon konfirmasi area, biaya, dan ketersediaan");
    expect(message).toContain("berat akhir, dan total biaya");
    expect(message).toContain("Catatan: Tanpa pewangi");
    expect(message).not.toContain("Pesanan diterima");
  });
  it("normalizes the owner's contact and safely encodes the message", () => {
    expect(normalizeWhatsApp("+62 821-3194-417")).toBe("628213194417");
    const url = new URL(
      whatsAppLink("+62 821-3194-417", "Kemeja & bed cover\nCatatan: #putih"),
    );
    expect(url.pathname).toBe("/628213194417");
    expect(url.searchParams.get("text")).toBe(
      "Kemeja & bed cover\nCatatan: #putih",
    );
  });
  it("rejects blank and alphabetic customer phone numbers", () => {
    expect(isValidCustomerPhone("                  ")).toBe(false);
    expect(isValidCustomerPhone("abc081234567890")).toBe(false);
    expect(isValidCustomerPhone("081234567890")).toBe(true);
    expect(isValidCustomerPhone("+62 812-3456-7890")).toBe(true);
  });
  it("formats an input date from the local calendar, without a UTC shift", () => {
    expect(localDateInput(new Date(2026, 9, 4, 0, 15))).toBe("2026-10-04");
  });
});
