import { Layers } from "lucide-react";
import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen flex justify-center items-center flex-col gap-8">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-violet-400 flex items-center justify-center">
          <Layers className=" text-white size-5" />
        </div>
        <h1 className=" text-2xl font-semibold tracking-tight">PROJECTS BACKOFFICE</h1>
      </div>
      <Outlet />
    </div>
  );
}