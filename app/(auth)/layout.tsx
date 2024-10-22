export default function AuthLayout(props: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center min-h-screen flex-col w-full bg-muted/40">
      {props.children}
    </div>
  );
}
