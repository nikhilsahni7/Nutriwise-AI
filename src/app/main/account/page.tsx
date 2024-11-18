// app/account/page.tsx
import UserAccount from "@/components/Account/UserAccount";
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div>
      <UserAccount />
    </div>
  );
}
