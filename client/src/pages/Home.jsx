import { Link } from 'react-router-dom'
import Hero from '../components/home/Hero'
import FeaturedItems from '../components/home/FeaturedItems'
import CategoryShowcase from '../components/home/CategoryShowcase'

function Home() {
    return (
        <div className="flex flex-col gap-16 pb-16">
            <section
                className="relative left-1/2 right-1/2 w-screen -translate-x-1/2"
                aria-labelledby="home-hero"
            >
                <Hero />
            </section>

            <section id="featured" className="scroll-mt-28" aria-labelledby="featured-heading">
                <div className="space-y-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                                Popular picks
                            </p>
                            <h2
                                id="featured-heading"
                                className="text-2xl font-semibold text-gray-900 sm:text-3xl"
                            >
                                Featured items
                            </h2>
                        </div>
                        <Link
                            to="/menu"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-500"
                        >
                            View full menu
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                    <FeaturedItems />
                </div>
            </section>

            <section id="categories" className="scroll-mt-28" aria-labelledby="categories-heading">
                <div className="space-y-8">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                            Quick navigation
                        </p>
                        <h2
                            id="categories-heading"
                            className="text-2xl font-semibold text-gray-900 sm:text-3xl"
                        >
                            Browse by category
                        </h2>
                    </div>
                    <CategoryShowcase />
                </div>
            </section>

            <section id="about" className="scroll-mt-28" aria-labelledby="about-heading">
                <div className="rounded-3xl bg-white p-8 shadow-sm md:p-12">
                    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                        <div className="space-y-4">
                            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                                About us
                            </p>
                            <h2 id="about-heading" className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                                Crafted with love, delivered with care
                            </h2>
                            <p className="text-sm text-gray-600 sm:text-base">
                                Kamuko is a modern takeaway kitchen blending local flavors with bold global
                                inspirations. Every dish is prepared fresh to order, using premium ingredients and
                                chef-tested recipes.
                            </p>
                            <div className="grid gap-4 text-sm text-gray-600 sm:grid-cols-2">
                                <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
                                    <p className="text-base font-semibold text-gray-900">Flavourful Meals</p>
                                    <p className="mt-1">Fresh meals in under 40 minutes.</p>
                                </div>
                                <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
                                    <p className="text-base font-semibold text-gray-900">Quality assured</p>
                                    <p className="mt-1">Chef-prepared dishes with locally sourced produce.</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-100 via-amber-50 to-white p-6">
                            <div className="rounded-2xl bg-white p-5 shadow-sm">
                                <p className="text-sm font-semibold text-gray-900">Today&apos;s hours</p>
                                <p className="mt-2 text-2xl font-semibold text-orange-600">10:00 AM - 10:30 PM</p>
                                <p className="mt-2 text-sm text-gray-600">takeaway available.</p>
                            </div>
                            <div className="flex flex-col gap-3 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white">
                                        ✓
                                    </span>
                                    <span>Easy reordering for your favourites.</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white">
                                        ✓
                                    </span>
                                    <span>No taxes or hidden fees.</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white">
                                        ✓
                                    </span>
                                    <span>Cash on pick-up payment</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
