import Link from 'next/link';
import Navbar from '@/components/ui/navbar';
import { Fragment } from 'react/jsx-runtime';
import { MdMyLocation } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { RiMotorbikeFill } from "react-icons/ri";
import { BsCarFrontFill } from "react-icons/bs";
import { IoCarSport } from "react-icons/io5";
import { HiCursorArrowRipple } from "react-icons/hi2";
import { MdRoute } from "react-icons/md";
import { MdPayments } from "react-icons/md";
import { FaRegCircleCheck } from "react-icons/fa6";
import Footer from '@/components/ui/footer';

export default function HomePage() {
  return (
    <Fragment>
      <header>
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="grow w-full max-w-[1280px] mx-auto px-4 md:px-8 lg:px-16 flex flex-col gap-[64px] pt-8 md:pt-12">
        {/* 1. Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl md:text-[48px] leading-[1.2] tracking-[-0.02em] font-bold text-base-content">Book Your Ride in Seconds</h1>
            <p className="text-[18px] leading-[1.6] text-base-content/80 max-w-lg">
              Experience seamless travel across the city. Choose your vehicle, set your destination, and relax while we handle the rest. Reliable, fast, and secure.
            </p>
            <div className="bg-base-100 rounded-xl shadow-[0_20px_40px_rgba(37,99,235,0.05)] p-6 border border-base-200 mt-4">
              <form className="flex flex-col gap-4">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral"><MdMyLocation /></span>
                  <input className="w-full pl-12 pr-4 py-3 bg-base-200/50 border border-base-300 rounded-lg text-[16px] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Pickup location" type="text" />
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral"><IoLocationOutline /></span>
                  <input className="w-full pl-12 pr-4 py-3 bg-base-200/50 border border-base-300 rounded-lg text-[16px] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Drop-off destination" type="text" />
                </div>

                <div className="grid grid-cols-3 gap-3 mt-2">
                  <label className="cursor-pointer relative">
                    <input className="peer sr-only" name="ride_type" type="radio" value="bike" />
                    <div className="flex flex-col items-center justify-center py-3 border border-base-300 rounded-lg peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary hover:bg-base-200 transition-colors">
                      <span className="material-symbols-outlined mb-1"><RiMotorbikeFill /></span>
                      <span className="font-semibold text-[12px] text-center">Bike</span>
                    </div>
                  </label>
                  <label className="cursor-pointer relative">
                    <input defaultChecked className="peer sr-only" name="ride_type" type="radio" value="economy" />
                    <div className="flex flex-col items-center justify-center py-3 border border-base-300 rounded-lg peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary hover:bg-base-200 transition-colors">
                      <span className="material-symbols-outlined mb-1"><BsCarFrontFill /></span>
                      <span className="font-semibold text-[12px] text-center">Economy</span>
                    </div>
                  </label>
                  <label className="cursor-pointer relative">
                    <input className="peer sr-only" name="ride_type" type="radio" value="comfort" />
                    <div className="flex flex-col items-center justify-center py-3 border border-base-300 rounded-lg peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary hover:bg-base-200 transition-colors">
                      <span className="material-symbols-outlined mb-1"><IoCarSport /></span>
                      <span className="font-semibold text-[12px] text-center">Comfort</span>
                    </div>
                  </label>
                </div>
                <button className="w-full mt-4 bg-primary text-primary-content py-4 rounded-lg font-bold text-[14px] shadow-md hover:shadow-lg hover:brightness-110 transition-all active:scale-[0.98]" type="button">
                  Find Ride
                </button>
              </form>
            </div>
          </div>
          <div className="hidden lg:block relative h-[600px] w-full rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(37,99,235,0.08)] bg-base-200">
            <img alt="Aerial view of a modern city street" className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNNn4w8hTZrXSdS79ApzoUefXwYhvuJQ2VkjX3nbppoAHvaUI_R4uDm_VyXumzMP2WsVgdKr1QbFUZBLlxQ4TZcp--L-um6Dl_1DuDyTZn9gIdWhdFuBepVB3V1CWTnJHSiws8249nFHNm7UoLiLkbZbR1snn8zLDtuqWcbh9O0ViqHSu244_GdSlTm4G48N6q0e_708j4utMTGBE8Oev4ODW3fnFhBkv375gFRcasKjQG9j0XlR4DHrfczHIwgAThLoTD97FY1NQ" />
            <div className="absolute inset-0 bg-linear-to-t from-base-100/80 to-transparent"></div>
          </div>
        </section>

        {/* 3. How It Works */}
        <section className="flex flex-col gap-8 items-center text-center">
          <h2 className="text-[32px] font-semibold text-base-content">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {/* Step 1 */}
            <div className="bg-base-100 p-8 rounded-xl shadow-[0_10px_30px_rgba(37,99,235,0.03)] border border-base-200 flex flex-col items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center text-primary mb-2">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}><HiCursorArrowRipple /></span>
              </div>
              <h3 className="text-[24px] font-semibold text-base-content">Book</h3>
              <p className="text-[16px] text-base-content/80 text-center">Enter your destination and choose the perfect ride for your needs.</p>
            </div>
            {/* Step 2 */}
            <div className="bg-base-100 p-8 rounded-xl shadow-[0_10px_30px_rgba(37,99,235,0.03)] border border-base-200 flex flex-col items-center gap-4 hover:-translate-y-1 transition-transform duration-300 relative">
              <div className="hidden md:block absolute top-1/2 -left-4 w-8 h-px bg-base-300"></div>
              <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center text-primary mb-2">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}><MdRoute /></span>
              </div>
              <h3 className="text-[24px] font-semibold text-base-content">Track</h3>
              <p className="text-[16px] text-base-content/80 text-center">Follow your driver in real-time on the map as they arrive.</p>
            </div>
            {/* Step 3 */}
            <div className="bg-base-100 p-8 rounded-xl shadow-[0_10px_30px_rgba(37,99,235,0.03)] border border-base-200 flex flex-col items-center gap-4 hover:-translate-y-1 transition-transform duration-300 relative">
              <div className="hidden md:block absolute top-1/2 -left-4 w-8 h-px bg-base-300"></div>
              <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center text-primary mb-2">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}><MdPayments /></span>
              </div>
              <h3 className="text-[24px] font-semibold text-base-content">Pay</h3>
              <p className="text-[16px] text-base-content/80 text-center">Seamless cashless payments automatically processed at drop-off.</p>
            </div>
          </div>
        </section>

        {/* 4. Ride Categories */}
        <section className="flex flex-col gap-8">
          <h2 className="text-[32px] font-semibold text-base-content text-center">Ride Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Economy */}
            <div className="bg-base-100 rounded-xl shadow-[0_20px_40px_rgba(37,99,235,0.05)] overflow-hidden border border-base-200 flex flex-col">
              <div className="h-48 bg-base-200 relative">
                <img alt="Economy car" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbrZLNaYhOE2Q8Zj3ikASmEVwG-zLuDkvplhNn79UWnJqOlZSvEclQ7-5u9AHulR52ScKnkC4UROQDNBPh_m7YYhgfNOZVmHN9KIgufHlO4zFq0lma9nDbe4iEJVyjkkrc1jmXiElu6_3NVN1ehpmv-aTQ9XcdSdprm2tsb5QNZylR0RHP-2LUpQpMIoo9UHuOPSbyVITrkhzTHgTbnyCQu-90v3WRt_8nHBEdpXWyX9tON-6Sr7bTLZ0rjdhxtk9zVrAFhpe_Gec" />
              </div>
              <div className="p-6 flex flex-col grow gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-[24px] font-semibold text-base-content">Economy</h3>
                  <span className="bg-base-200 text-base-content/80 px-3 py-1 rounded-full text-[12px] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">person</span> 1-4
                  </span>
                </div>
                <p className="text-[16px] text-base-content/80 grow">Affordable everyday rides. Perfect for getting around the city quickly and comfortably.</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="material-symbols-outlined text-primary text-sm"><FaRegCircleCheck /></span>
                  <span className="text-[12px] font-medium text-base-content/80">Standard Legroom</span>
                </div>
              </div>
            </div>

            {/* Comfort */}
            <div className="bg-base-100 rounded-xl shadow-[0_20px_40px_rgba(37,99,235,0.08)] overflow-hidden border border-primary/20 flex flex-col relative scale-[1.02] z-10">
              <div className="absolute top-4 right-4 bg-primary text-primary-content px-3 py-1 rounded-full text-[12px] font-medium shadow-md z-20">Popular</div>
              <div className="h-48 bg-base-200 relative">
                <img alt="Comfort car" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTBe9MwKiXe1BRktKWcXxgWkhzkdGfh6s_I6JuWWHhb60O3P1ZmWgw99hMxZhFH_ZdP88zGyGXVEFlAgWIH5-VG2-PRZTO-PwZ6Sn7S7IocOMCltXlIJIDpYb38tn7OZbyuiZrYuT9NyA5EA4cJmd-JHekB2So_GIKMe2XCXY_Q6Eu73fGubToatGskT7w72ZT5-PJ7_78IYIqEq8YnVR5bxLTmpFr-QuLKPLMFZDdYnsJPcmOK9YrNFDsVXIGqqbT3XP8yt1pgIM" />
              </div>
              <div className="p-6 flex flex-col grow gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-[24px] font-semibold text-base-content">Comfort</h3>
                  <span className="bg-base-200 text-base-content/80 px-3 py-1 rounded-full text-[12px] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">person</span> 1-4
                  </span>
                </div>
                <p className="text-[16px] text-base-content/80 grow">Newer cars with extra legroom. Ideal for business travel or when you just want to relax.</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="material-symbols-outlined text-primary text-sm"><FaRegCircleCheck /></span>
                  <span className="text-[12px] font-medium text-base-content/80">Extra Legroom & Top Drivers</span>
                </div>
              </div>
            </div>

            {/* Bike */}
            <div className="bg-base-100 rounded-xl shadow-[0_20px_40px_rgba(37,99,235,0.05)] overflow-hidden border border-base-200 flex flex-col">
              <div className="h-48 bg-base-200 relative">
                <img alt="Bike" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9p7FkPTSLIkjFvcWqcbGSM9TMrfJS2wYmNSLxBI6H17m_Zw01ltjHkmiale_MTMonv7I3zVaQcxtgm9VQMQCXSU3ZKBPahtoW73lK_MU2qffKxG1iyPpRAfYbPXHPOzJqgt4zQ1S3LJN_gKwqVf4IZlQWaXM_eQMnmTDbtIYMvryLjuVYUg39eQaq0BRJ06-H_G7V0wE9U9cUbnHiinz0sz-xkbID_2CYXGp8lxVnfkB24PICLSSvL3w2fdBkMUv2JtFDWAhYzow" />
              </div>
              <div className="p-6 flex flex-col grow gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-[24px] font-semibold text-base-content">Bike</h3>
                  <span className="bg-base-200 text-base-content/80 px-3 py-1 rounded-full text-[12px] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">person</span> 1
                  </span>
                </div>
                <p className="text-[16px] text-base-content/80 grow">Beat the traffic. The fastest way to navigate through congested city streets.</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="material-symbols-outlined text-primary text-sm"><FaRegCircleCheck /></span>
                  <span className="text-[12px] font-medium text-base-content/80">Helmets Provided</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. CTA Banner */}
        <section className="bg-base-200 rounded-2xl p-12 text-center flex flex-col items-center gap-6 shadow-inner my-8">
          <h2 className="text-[32px] font-semibold text-base-content">Ready to Ride?</h2>
          <p className="text-[18px] text-base-content/80 max-w-2xl">Join thousands of daily commuters who trust TransportHub for their daily journeys.</p>
          <button className="bg-primary text-primary-content px-8 py-4 rounded-full font-bold text-[16px] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all mt-2">
            Book Now
          </button>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </Fragment>
  );
}