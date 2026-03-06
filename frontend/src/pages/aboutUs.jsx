import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-amber-600 to-green-600 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-4">Who We Are</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Delivering 100% pure and organic beauty products to the world
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-amber-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-green-700 mb-4">
                At <span className="font-semibold">Viva Cosmetics</span>, our
                mission is to deliver 100% pure and organic Argan oil, along
                with natural wellness products, to customers worldwide.
              </p>
              <p className="text-lg text-green-700 mb-4">
                We are dedicated to high quality, authentic Moroccan care, and
                sustainable beauty trusted in over 100 countries.
              </p>
              <p className="text-lg text-green-700">
                We are committed to maintaining the highest standards of quality
                and authenticity by embracing traditional Moroccan craftsmanship
                and eco-friendly practices.
              </p>
            </div>
            <div className="relative h-96">
              <img
                src="/assets/aboutus1.jpg"
                alt="Our Mission"
                className="w-full h-full object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ethical Commitment */}
      <section className="py-16 bg-green-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 order-2 md:order-1">
              <img
                src="/assets/aboutus2.jpg"
                alt="Ethical Commitment"
                className="w-full h-full object-cover rounded-lg shadow-xl"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-bold text-amber-900 mb-6">
                Our Ethical Commitment
              </h2>
              <p className="text-lg text-green-700 mb-6">
                At Viva cosmetics, our commitment goes beyond beauty, it's about
                responsibility and respect for the planet and people.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-green-700">
                    We ensure that none of our products are ever tested on
                    animals.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-green-700">
                    We formulate our products with pure, certified organic
                    ingredients, free from harmful chemicals, promoting health
                    and wellbeing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wholesale & Export */}
      <section className="py-16 bg-amber-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-amber-900 mb-6">
                Wholesale & Export
              </h2>
              <p className="text-lg text-green-700 mb-4">
                At Viva Cosmetics, we proudly supply 100% pure and organic Argan
                oil in bulk to international partners. From 5L to 1-ton
                containers, we offer flexible packaging and reliable worldwide
                delivery.
              </p>
              <p className="text-lg text-green-700">
                Our experience and commitment to quality make us a trusted
                choice for cosmetic brands, wellness professionals, and
                retailers across the globe.
              </p>
            </div>
            <div className="relative h-96">
              <img
                src="/assets/aboutus4.png"
                alt="Wholesale & Export"
                className="w-full h-full object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amber-900 mb-4">
              Our Values
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-lg shadow-md border border-green-100">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-amber-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-amber-800 mb-3">
                Innovation
              </h3>
              <p className="text-green-700">
                We blend ancestral knowledge with modern techniques to improve
                and evolve our product line.
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-lg shadow-md border border-green-100">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-green-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-amber-800 mb-3">
                Authenticity
              </h3>
              <p className="text-green-700">
                We provide 100% genuine, certified organic products, honoring
                Moroccan tradition with honesty and care.
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-lg shadow-md border border-green-100">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-amber-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-amber-800 mb-3">
                Quality
              </h3>
              <p className="text-green-700">
                We uphold the highest standards with certified organic
                ingredients and full traceability from source to packaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Brands */}
      <section className="py-16 bg-green-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amber-900 mb-4">
              Our Brands
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center hover:shadow-lg transition-shadow"
              >
                <img
                  src={`/assets/brand${num}.png`}
                  alt={`Brand ${num - 6}`}
                  className="max-w-full h-20 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amber-900 mb-4">
              References
            </h2>
            <p className="text-xl text-green-700">
              Reveal your natural beauty with our premium cosmetics, crafted
              with the finest natural ingredients.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md border border-green-100 max-w-6xl w-full">
              <img
                src="/assets/references.png"
                alt="Our References"
                className="w-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
