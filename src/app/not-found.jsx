import { Link } from "next-view-transitions";

export default function NotFound() {
  return (
    <div className="w-full h-screen center flex-col">
      <h1>404 - Page Not Found</h1>
      <Link href={"/"} className="hover:underline">Go To Home</Link>
    </div>
  );
}
