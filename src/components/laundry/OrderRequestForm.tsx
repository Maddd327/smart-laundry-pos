import { useEffect, useRef, useState } from "react";
import { Check, ClipboardList, MessageCircle } from "lucide-react";
import {
  formatRupiah,
  isValidCustomerPhone,
  localDateInput,
  requestEstimate,
  requestMessage,
  serviceDuration,
  whatsAppLink,
  type LaundryRequest,
  type LaundryService,
} from "@/lib/laundrySite";

interface Props {
  services: LaundryService[];
  selectedServiceId: string;
  onServiceChange: (id: string) => void;
  brand: string;
  phone: string;
  usingReference: boolean;
}

export function OrderRequestForm({
  services,
  selectedServiceId,
  onServiceChange,
  brand,
  phone,
  usingReference,
}: Props) {
  const [unit, setUnit] = useState<"kilo" | "unit">("kilo");
  const [quantity, setQuantity] = useState("");
  const [fulfillment, setFulfillment] = useState<"outlet" | "pickup">("outlet");
  const [message, setMessage] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const summaryRef = useRef<HTMLDivElement>(null);
  const service =
    services.find((item) => item.id === selectedServiceId) || services[0];
  const estimate = service ? requestEstimate(service, unit, quantity) : null;

  useEffect(() => {
    if (service) setUnit(service.supports_kilo ? "kilo" : "unit");
    setMessage("");
  }, [service]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!service) return;
    const data = new FormData(event.currentTarget);
    const phoneInput = event.currentTarget.elements.namedItem(
      "phone",
    ) as HTMLInputElement;
    const nameInput = event.currentTarget.elements.namedItem(
      "name",
    ) as HTMLInputElement;
    phoneInput.setCustomValidity(
      isValidCustomerPhone(String(data.get("phone") || ""))
        ? ""
        : "Isi nomor WhatsApp yang valid, minimal 10 digit setelah kode negara.",
    );
    nameInput.setCustomValidity(
      String(data.get("name") || "").trim().length >= 2
        ? ""
        : "Isi nama Anda, minimal dua karakter.",
    );
    if (!event.currentTarget.reportValidity()) return;
    const request: LaundryRequest = {
      name: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
      address: String(data.get("address") || ""),
      serviceId: service.id,
      unit,
      quantity,
      date: String(data.get("date") || ""),
      fulfillment,
      notes: String(data.get("notes") || ""),
    };
    setMessage(requestMessage(request, service, brand));
    setCopyState("idle");
    requestAnimationFrame(() => summaryRef.current?.focus());
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  if (!service) {
    return (
      <div className="laundry-empty">
        <ClipboardList aria-hidden="true" />
        <h3>Katalog belum tersedia</h3>
        <p>Hubungi outlet untuk menanyakan layanan dan harga.</p>
        <a
          className="laundry-button"
          href={whatsAppLink(
            phone,
            `Halo ${brand}, saya ingin menanyakan layanan laundry.`,
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          Tanya layanan di WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form
      className="laundry-order-form"
      onSubmit={submit}
      onChange={(event) => {
        if (message) setMessage("");
        if (event.target instanceof HTMLInputElement)
          event.target.setCustomValidity("");
      }}
    >
      <div className="laundry-form-heading">
        <span className="laundry-step-label">Rencana laundry Anda</span>
        <h3>Mulai dari sini.</h3>
        <p>Isi detailnya, lalu kirim ke outlet melalui WhatsApp.</p>
      </div>
      <div className="laundry-form-grid">
        <div className="laundry-field">
          <label htmlFor="order-name">Nama lengkap</label>
          <input
            id="order-name"
            name="name"
            autoComplete="name"
            placeholder="Nama Anda"
            required
            minLength={2}
            maxLength={100}
          />
        </div>
        <div className="laundry-field">
          <label htmlFor="order-phone">Nomor WhatsApp</label>
          <input
            id="order-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="08xxxxxxxxxx"
            required
            pattern={"\\+?[0-9\\s\\(\\)\\-]{10,20}"}
            title="Isi nomor WhatsApp 10 sampai 15 digit, boleh memakai +62."
            maxLength={20}
          />
        </div>
        <div className="laundry-field laundry-field-full">
          <label htmlFor="order-service">Pilih layanan</label>
          <select
            id="order-service"
            name="service"
            value={service.id}
            onChange={(event) => onServiceChange(event.target.value)}
          >
            {services.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({serviceDuration(item)})
              </option>
            ))}
          </select>
        </div>
        <div className="laundry-field">
          <label htmlFor="order-unit">Perhitungan</label>
          <select
            id="order-unit"
            value={unit}
            onChange={(event) => {
              setUnit(event.target.value as "kilo" | "unit");
              setQuantity("");
            }}
          >
            {service.supports_kilo && (
              <option value="kilo">Per kilogram</option>
            )}
            {service.supports_unit && <option value="unit">Per item</option>}
          </select>
        </div>
        <div className="laundry-field">
          <label htmlFor="order-quantity">
            Perkiraan {unit === "kilo" ? "berat (kg)" : "jumlah (item)"}
          </label>
          <input
            id="order-quantity"
            name="quantity"
            type="number"
            inputMode="decimal"
            min={unit === "kilo" ? "0.1" : "1"}
            max="1000"
            step={unit === "kilo" ? "0.1" : "1"}
            placeholder={unit === "kilo" ? "Contoh: 3" : "Contoh: 2"}
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            required
          />
        </div>
        <div className="laundry-field">
          <label htmlFor="order-fulfillment">Cara pengantaran</label>
          <select
            id="order-fulfillment"
            value={fulfillment}
            onChange={(event) =>
              setFulfillment(event.target.value as "outlet" | "pickup")
            }
          >
            <option value="outlet">Saya antar ke outlet</option>
            <option value="pickup">Ajukan antar jemput</option>
          </select>
        </div>
        <div className="laundry-field">
          <label htmlFor="order-date">Tanggal yang diinginkan</label>
          <input
            id="order-date"
            type="date"
            name="date"
            min={localDateInput()}
            required
          />
        </div>
        <div className="laundry-field laundry-field-full">
          <label htmlFor="order-address">
            Alamat {fulfillment === "pickup" ? "penjemputan" : "(opsional)"}
          </label>
          <textarea
            id="order-address"
            name="address"
            autoComplete="street-address"
            rows={2}
            placeholder="Jalan, nomor rumah, dan patokan"
            required={fulfillment === "pickup"}
            maxLength={500}
          />
          {fulfillment === "pickup" && (
            <p className="laundry-field-hint">
              Antar jemput merupakan permintaan. Area, biaya, dan jadwal harus
              dikonfirmasi oleh outlet.
            </p>
          )}
        </div>
        <div className="laundry-field laundry-field-full">
          <label htmlFor="order-notes">
            Catatan khusus <span>(opsional)</span>
          </label>
          <textarea
            id="order-notes"
            name="notes"
            rows={2}
            placeholder="Misalnya, pisahkan pakaian putih atau tanpa pewangi."
            maxLength={1000}
          />
        </div>
      </div>
      <div className="laundry-estimate" aria-live="polite">
        <div>
          <span>Estimasi biaya{usingReference ? " acuan" : ""}</span>
          <strong>
            {estimate == null ? "Isi jumlah dulu" : formatRupiah(estimate)}
          </strong>
        </div>
        <span>
          Perkiraan selesai
          <br />
          <b>{serviceDuration(service)}</b>
        </span>
      </div>
      <p className="laundry-form-note">
        Total akhir mengikuti hasil timbang dan konfirmasi outlet.
        {usingReference
          ? " Harga acuan berasal dari katalog awal; harga outlet perlu dikonfirmasi."
          : ""}
      </p>
      <button className="laundry-button laundry-button-full" type="submit">
        <ClipboardList size={19} aria-hidden="true" />
        Siapkan Pesanan
      </button>
      <p className="laundry-form-privacy">
        Detail digunakan untuk permintaan laundry Anda. Form ini belum mencatat
        transaksi atau pembayaran.
      </p>
      {message && (
        <div className="laundry-request-ready" tabIndex={-1} ref={summaryRef}>
          <h4>
            <Check size={20} aria-hidden="true" />
            Rincian pesanan siap
          </h4>
          <p>
            Klik tombol di bawah, lalu kirim pesannya di WhatsApp. Pesanan
            berlaku setelah outlet mengonfirmasi.
          </p>
          <pre className="laundry-message-preview">{message}</pre>
          <a
            className="laundry-button laundry-button-full"
            href={whatsAppLink(phone, message)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={19} aria-hidden="true" />
            Buka WhatsApp
          </a>
          <button
            className="laundry-text-button"
            type="button"
            onClick={copyMessage}
          >
            Salin rincian pesanan
          </button>
          <p role="status">
            {copyState === "copied"
              ? "Rincian berhasil disalin."
              : copyState === "error"
                ? "Browser tidak mengizinkan penyalinan. Pilih teks rincian di atas untuk menyalin secara manual."
                : ""}
          </p>
        </div>
      )}
    </form>
  );
}
