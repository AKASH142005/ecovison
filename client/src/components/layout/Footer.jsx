import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950 py-8 text-center text-xs text-slate-500 dark:text-slate-500 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 space-y-2">
        <p className="font-semibold text-slate-700 dark:text-slate-400">
          EcoVision Chennai • Greater Chennai Corporation (GCC) & TNPCB Circular Resource Management
        </p>
        <p>
          Role-Based Authentication (Customer, Dealer, Factory, Admin) • Fastify & Mongoose API • OpenStreetMap Chennai Grid
        </p>
      </div>
    </footer>
  );
}
