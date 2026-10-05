interface GattCharacteristic {
  uuid: string;
  properties: { write: boolean; writeWithoutResponse: boolean };
  writeValueWithResponse(value: DataView): Promise<void>;
  writeValueWithoutResponse(value: DataView): Promise<void>;
}

interface GattService {
  uuid: string;
  getCharacteristics(): Promise<GattCharacteristic[]>;
  getCharacteristic(uuid: string): Promise<GattCharacteristic>;
}

interface BluetoothDevice extends EventTarget {
  id: string;
  name?: string;
  gatt: {
    connected: boolean;
    connect(): Promise<unknown>;
    disconnect(): void;
    getPrimaryServices(): Promise<GattService[]>;
    getPrimaryService(uuid: string): Promise<GattService>;
  };
}

export interface BleService {
  uuid: string;
  characteristics: Pick<GattCharacteristic, "uuid" | "properties">[];
}

const devices = new Map<string, BluetoothDevice>();
const disconnectListeners = new Map<string, EventListener>();

function getDevice(deviceId: string) {
  const device = devices.get(deviceId);
  if (!device)
    throw new Error("Printer tidak terhubung. Silakan hubungkan kembali.");
  return device;
}

async function getCharacteristic(
  deviceId: string,
  serviceUuid: string,
  characteristicUuid: string,
) {
  const service = await getDevice(deviceId).gatt.getPrimaryService(serviceUuid);
  return service.getCharacteristic(characteristicUuid);
}

// Keep the receipt encoder independent of browser device discovery.
export const BleClient = {
  async initialize() {
    if (!window.isSecureContext || !("bluetooth" in navigator)) {
      throw new Error(
        "Web Bluetooth memerlukan HTTPS dan browser yang mendukung Bluetooth. Gunakan cetak browser atau PDF jika tidak tersedia.",
      );
    }
  },
  async requestDevice(options: { optionalServices: string[] }) {
    const bluetooth = (
      navigator as Navigator & {
        bluetooth: {
          requestDevice(options: {
            acceptAllDevices: boolean;
            optionalServices: string[];
          }): Promise<BluetoothDevice>;
        };
      }
    ).bluetooth;
    const device = await bluetooth.requestDevice({
      acceptAllDevices: true,
      ...options,
    });
    devices.set(device.id, device);
    return { deviceId: device.id, name: device.name };
  },
  async connect(deviceId: string, onDisconnect: (id: string) => void) {
    const device = getDevice(deviceId);
    const previous = disconnectListeners.get(deviceId);
    if (previous)
      device.removeEventListener("gattserverdisconnected", previous);
    const listener = () => onDisconnect(deviceId);
    device.addEventListener("gattserverdisconnected", listener);
    disconnectListeners.set(deviceId, listener);
    await device.gatt.connect();
  },
  async getServices(deviceId: string): Promise<BleService[]> {
    const services = await getDevice(deviceId).gatt.getPrimaryServices();
    return Promise.all(
      services.map(async (service) => ({
        uuid: service.uuid,
        characteristics: await service.getCharacteristics(),
      })),
    );
  },
  async disconnect(deviceId: string) {
    const device = getDevice(deviceId);
    const listener = disconnectListeners.get(deviceId);
    if (listener)
      device.removeEventListener("gattserverdisconnected", listener);
    device.gatt.disconnect();
    disconnectListeners.delete(deviceId);
    devices.delete(deviceId);
  },
  async write(
    deviceId: string,
    serviceUuid: string,
    characteristicUuid: string,
    value: DataView,
  ) {
    const characteristic = await getCharacteristic(
      deviceId,
      serviceUuid,
      characteristicUuid,
    );
    await characteristic.writeValueWithResponse(value);
  },
  async writeWithoutResponse(
    deviceId: string,
    serviceUuid: string,
    characteristicUuid: string,
    value: DataView,
  ) {
    const characteristic = await getCharacteristic(
      deviceId,
      serviceUuid,
      characteristicUuid,
    );
    await characteristic.writeValueWithoutResponse(value);
  },
};
