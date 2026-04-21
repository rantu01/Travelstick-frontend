import React from 'react';

const TravelHero = () => {
    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url('https://hips.hearstapps.com/hmg-prod/images/alpe-di-siusi-sunrise-with-sassolungo-or-langkofel-royalty-free-image-1623254127.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Dark overlay to make text pop */}
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl">
                <p className="text-[#C5A059] uppercase tracking-[0.3em] text-sm font-semibold mb-4">
                    The Premier Travel Experience
                </p>

                <h1 className="text-white text-5xl md:text-7xl font-bold leading-tight mb-8">
                    Your Journey,<br />Our Passion
                </h1>

                <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md border border-white/30 px-6 py-3 rounded-lg shadow-lg">
                    <span className="text-[#C5A059] text-xl">★</span>
                    <span className="text-white font-medium text-sm md:text-base">
                        Crafting memories since 2004
                    </span>
                </div>
            </div>
        </section>
    );
};

export default TravelHero;