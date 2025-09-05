"use client";

import { ChartBarIcon } from "lucide-react";
import * as React from "react";
import { DASHBOARD } from "@/constants";

export default function InitialBackground() {
  return (
    <section className="flex flex-col items-center justify-center h-[calc(100vh-72px)] px-6 py-12 text-center">
      <div className="max-w-4xl">
        <div className="mb-6">
          <ChartBarIcon className="h-24 w-24 text-primary/80 mx-auto" />
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-bold text-white mb-2">
              {DASHBOARD.EMPTY_TITLE}
            </h1>
          </div>

          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {DASHBOARD.EMPTY_DESCRIPTION}
          </p>
        </div>
      </div>
    </section>
  );
}
