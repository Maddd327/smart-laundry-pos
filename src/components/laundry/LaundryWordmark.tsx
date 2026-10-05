export function LaundryWordmark({ name }: { name: string }) {
  const [first, ...rest] = name.split(" ");
  return (
    <>
      <span>{first}</span>
      <strong>
        {rest.join(" ") || first}
        <span className="laundry-brand-dot">.</span>
      </strong>
    </>
  );
}
