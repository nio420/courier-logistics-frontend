import CreateShipmentForm from "@/components/shipment/create-shipment-form";

export default function CreateShipmentPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">CUSTOMER PORTAL</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Create a shipment
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Enter the sender and receiver details, select your shipping route, and
          describe the package you want to send.
        </p>
      </div>

      <CreateShipmentForm />
    </main>
  );
}
