import { redirect } from "next/navigation";

export default function Home() {
  // Until we add server-side session reading,
  // always redirect to login
  redirect("/login");
}
