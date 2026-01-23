import { Link } from 'react-router-dom'

function Hero() {
    return (
        <div className="relative overflow-hidden bg-gray-900">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "linear-gradient(120deg, rgba(15, 23, 42, 0.85), rgba(234, 88, 12, 0.3)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80')",
                }}
                aria-hidden="true"
            />
            <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 sm:py-20 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl space-y-6 text-white">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-100">
                        Fresh • Fast • Flavorful
                    </span>
                    <h1 id="home-hero" className="text-4xl font-semibold leading-tight sm:text-5xl">
                        Crave-worthy meals prepared in minutes to pickup.
                    </h1>
                    <p className="text-sm text-orange-50/90 sm:text-base">
                        Kamuko brings chef-crafted favourites, signature bowls, and comforting classics to
                        busy schedules. Order ahead or schedule delivery with ease.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            to="/menu"
                            className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-400"
                        >
                            Order now
                        </Link>
                        <a
                            href="#featured"
                            className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                        >
                            See featured items
                        </a>
                    </div>
                </div>

                <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-6 text-white shadow-xl backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-100">
                        Opening hours
                    </p>
                    <p className="mt-3 text-2xl font-semibold">10:00 AM - 10:00 PM</p>
                    <p className="mt-2 text-sm text-orange-50/80">Everyday • Takeaway</p>
                    <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm">
                        <p className="font-semibold">Order hotline</p>
                        <p className="mt-1 text-orange-100">+94 11 234 5678</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero
