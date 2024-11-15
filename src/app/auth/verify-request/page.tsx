"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { VerifyRequest } from "@/components/verify-request";

export default function VerifyRequestPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InnerVerifyRequest />
    </Suspense>
  );
}

function InnerVerifyRequest() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return <VerifyRequest email={email} />;
}
