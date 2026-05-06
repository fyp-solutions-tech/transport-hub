import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  MdHome,
  MdWork,
  MdAdd,
  MdAddLocation,
  MdFitnessCenter,
  MdLocalCafe,
  MdFavorite,
  MdShoppingBasket,
  MdMyLocation,
  MdInfo,
  MdDirectionsCar,
} from "react-icons/md";

export const metadata = { title: "Saved Places | Skyline Hub" };

export default async function SavedPlacesPage() {
  const { session } = await requireRole("USER");

  const places = await prisma.savedPlace.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const home = places.find((p: any) => p.type === "HOME");
  const work = places.find((p: any) => p.type === "WORK");
  const others = places.filter((p: any) => p.type === "OTHER");

  return (
    <div className="space-y-8 pb-12">

      {/* Quick Access */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[24px] font-semibold text-[#111c2d]">Quick Access</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Home */}
          <div className="bg-white rounded-xl p-6 shadow-[0_20px_40px_rgba(37,99,235,0.05)] hover:shadow-[0_10px_30px_rgba(37,99,235,0.1)] hover:-translate-y-0.5 transition-all duration-300 flex items-start justify-between group">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <MdHome className="text-xl" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-[#111c2d]">Home</h3>
                <p className="text-sm text-slate-500 mt-1">{home?.address || "Add your home address"}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
              <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>
          </div>

          {/* Work */}
          <div className="bg-white rounded-xl p-6 shadow-[0_20px_40px_rgba(37,99,235,0.05)] hover:shadow-[0_10px_30px_rgba(37,99,235,0.1)] hover:-translate-y-0.5 transition-all duration-300 flex items-start justify-between group">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <MdWork className="text-xl" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-[#111c2d]">Work</h3>
                <p className="text-sm text-slate-500 mt-1">{work?.address || "Add your work address"}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
              <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>
          </div>

          {/* Add New */}
          <div className="bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-xl p-6 flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-all duration-300 group">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <MdAdd className="text-xl" />
              </div>
              <span className="text-[14px] font-semibold text-blue-600">Add New Place</span>
            </div>
          </div>
        </div>
      </section>

      {/* Collection + Form */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Saved Places Grid */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-[24px] font-semibold text-[#111c2d]">Your Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: MdFitnessCenter, name: "Equinox Gym", address: "DHA Phase 6, Lahore" },
              { icon: MdLocalCafe, name: "Coffee Collective", address: "MM Alam Road, Gulberg" },
              { icon: MdFavorite, name: "Parents' House", address: "Model Town, Lahore" },
              { icon: MdShoppingBasket, name: "Hyperstar", address: "Packages Mall, Lahore" },
            ].map(({ icon: Icon, name, address }) => (
              <div key={name} className="bg-white rounded-xl p-6 shadow-[0_20px_40px_rgba(37,99,235,0.05)] hover:shadow-[0_10px_30px_rgba(37,99,235,0.1)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col group">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-surface-container text-blue-600 flex items-center justify-center">
                    <Icon className="text-lg" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-all"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                    <button className="p-2 text-slate-400 hover:text-red-600 transition-all"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-[14px] font-semibold text-[#111c2d]">{name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Place Form */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl p-8 shadow-[0_20px_40px_rgba(37,99,235,0.05)] sticky top-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <MdAddLocation className="text-xl" />
              </div>
              <h2 className="text-[24px] font-semibold text-[#111c2d]">New Place</h2>
            </div>
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Place Name</label>
                <input type="text" placeholder="e.g. Grandma's House, Library" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all outline-none text-[16px]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Address</label>
                <div className="relative">
                  <MdMyLocation className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Start typing address..." className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all outline-none text-[16px]" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Select Icon</label>
                <div className="grid grid-cols-4 gap-3">
                  {[MdHome, MdFavorite, MdWork, MdShoppingBasket].map((Icon, i) => (
                    <button key={i} type="button" className="p-3 border border-slate-100 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center bg-slate-50">
                      <Icon className="text-xl text-slate-500" />
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg">save</span>
                Save Place
              </button>
            </form>

            <div className="mt-8 p-4 bg-surface-container rounded-lg">
              <div className="flex gap-3">
                <MdInfo className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-on-secondary-container leading-relaxed">
                  Saved places help our smart algorithm predict your travel needs and offer faster booking options during rush hour.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Preview */}
      <section>
        <div className="bg-white rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(37,99,235,0.05)] h-64 relative">
          <div className="absolute inset-0 bg-linear-to-br from-blue-100 to-slate-100 flex items-center justify-center">
            <div className="text-center space-y-2">
              <MdDirectionsCar className="text-5xl text-blue-200 mx-auto" />
              <p className="text-slate-400 text-sm font-medium">Map preview will appear here</p>
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-100 flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-700">Real-time Traffic Sync Active</span>
            </div>
            <button className="bg-white p-3 rounded-full shadow-lg text-blue-600 hover:scale-110 transition-transform">
              <MdMyLocation className="text-xl" />
            </button>
          </div>
        </div>
      </section>

      {/* FAB */}
      <div className="fixed bottom-8 right-8 z-50 hidden md:block">
        <Link href="/book" className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-2xl shadow-blue-600/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
          <MdDirectionsCar className="text-2xl" />
        </Link>
      </div>
    </div>
  );
}
