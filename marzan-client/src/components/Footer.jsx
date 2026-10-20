const Footer = () => {
  return (
    <div className="border-t border-slate-200 bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 text-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-bold">BulldogEx Shop</p>
          <p className="mt-1 text-sm text-slate-600">Campus essentials, simple ordering.</p>
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
          Products | Cart | Pickup
        </p>
      </div>
    </div>
  )
}

export default Footer
