"use client";

import { useState } from "react";

const WHATSAPP_NUMBER = "0481707758"; // Replace with actual number
const MESSENGER_USERNAME = "healthuau"; // Replace with actual username

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-22 right-9 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex flex-col gap-2 items-end">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white rounded-full shadow-lg px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-green-50 transition-colors"
          >
            <span>WhatsApp</span>
            <span className="w-9 h-9 flex items-center justify-center rounded-full bg-[#25D366] text-white shrink-0">
              <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5">
                <path d="M16 2C8.268 2 2 8.268 2 16c0 2.444.654 4.733 1.793 6.707L2 30l7.5-1.766A13.94 13.94 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.46 11.46 0 01-5.86-1.608l-.42-.25-4.453 1.048 1.065-4.334-.273-.445A11.46 11.46 0 014.5 16C4.5 9.648 9.648 4.5 16 4.5S27.5 9.648 27.5 16 22.352 27.5 16 27.5zm6.29-8.46c-.344-.172-2.036-1.004-2.352-1.118-.316-.115-.546-.172-.776.172-.23.344-.892 1.118-1.093 1.348-.2.23-.4.258-.745.086-.344-.172-1.452-.536-2.765-1.707-1.022-.913-1.713-2.04-1.913-2.384-.2-.344-.021-.53.15-.7.155-.154.344-.402.516-.603.172-.2.23-.344.344-.574.115-.23.058-.43-.029-.603-.086-.172-.776-1.872-1.063-2.563-.28-.672-.564-.58-.776-.59-.2-.01-.43-.012-.66-.012s-.603.086-.919.43c-.316.344-1.207 1.18-1.207 2.878s1.236 3.338 1.408 3.568c.172.23 2.432 3.712 5.893 5.207.824.356 1.467.569 1.968.728.827.264 1.58.227 2.175.138.663-.1 2.036-.832 2.323-1.636.287-.804.287-1.493.2-1.636-.086-.143-.316-.23-.66-.402z" />
              </svg>
            </span>
          </a>

          <a
            href={`https://m.me/${MESSENGER_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white rounded-full shadow-lg px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors"
          >
            <span>Messenger</span>
            <span className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0099FF] text-white shrink-0">
              <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5">
                <path d="M16 2C8.268 2 2 7.82 2 15c0 4.144 2.033 7.837 5.21 10.28V30l4.79-2.633C13.2 27.773 14.578 28 16 28c7.732 0 14-5.82 14-13S23.732 2 16 2zm1.39 17.503l-3.565-3.8-6.958 3.8 7.653-8.12 3.652 3.8 6.87-3.8-7.652 8.12z" />
              </svg>
            </span>
          </a>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Contact us"
        className="w-12 h-12 rounded-full bg-primary text-white shadow-xl flex items-center justify-center hover:bg-[#d30101] transition-colors"
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2zm-2 10H6v-2h12v2zm0-4H6V6h12v2z" />
          </svg>
        )}
      </button>
    </div>
  );
}