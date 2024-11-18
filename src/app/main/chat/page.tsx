// app/chat/page.tsx

import ChatWindow from "@/components/Chat/Chat";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div>
      <ChatWindow />
    </div>
  );
}
