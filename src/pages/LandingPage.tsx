import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  ShoppingBag,
  Building,
  Check,
  Play,
  MessageCircle,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/layouts/Navbar";
import { Footer } from "@/layouts/Footer";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function LandingPage() {
  const navigate = useNavigate();

  const handleExploreBrands = () => navigate("/login");
  const handleBrandRegister = () => navigate("/brand/register");

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="relative bg-linear-to-b from-indigo-50/50 via-white to-white py-16 sm:py-24 lg:py-32 overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-violet-200/15 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight tracking-tight"
            >
              Discover Local D2C Brands in India.
              <br />
              <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Connect Instantly
              </span>{" "}
              with Verified Sellers.
            </motion.h1>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            >
              <Button
                onClick={handleExploreBrands}
                size="lg"
                className="bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all text-base px-8 py-6 cursor-pointer"
              >
                Explore Brands
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={handleBrandRegister}
                variant="outline"
                size="lg"
                className="border-gray-300 text-gray-900 hover:bg-gray-50 text-base px-8 py-6 cursor-pointer"
              >
                List Your Brand
              </Button>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-500 leading-relaxed mb-16 max-w-2xl mx-auto"
            >
              Vividly helps shoppers discover verified direct-to-consumer brands
              across Indian cities through short product videos and stories.
              Explore by category, watch brand content, and connect directly
              with sellers on WhatsApp—no middlemen, no noise.
            </motion.p>

            <motion.div
              variants={scaleIn}
              className="bg-linear-to-br from-gray-50 to-indigo-50/30 rounded-2xl border border-gray-200/60 p-6 sm:p-10 shadow-sm"
            >
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="aspect-square bg-white rounded-xl border border-gray-200/80 p-3 sm:p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-indigo-50 to-violet-50 rounded-xl mb-2 sm:mb-3 flex items-center justify-center">
                      <Package className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full mb-1.5" />
                    <div className="w-3/4 h-2 bg-gray-50 rounded-full" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Why Choose Vividly? ── */}
      <section className="py-16 sm:py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Vividly?
            </h2>
            <p className="text-lg text-gray-500">
              Everything you need to discover and connect with brands
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {/* Video-First Discovery */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-gray-200/60 p-8 shadow-sm hover:shadow-md transition-all text-center"
            >
              <div className="w-14 h-14 bg-violet-600 rounded-2xl flex items-center justify-center mb-5 mx-auto shadow-lg shadow-violet-200">
                <Play className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Video-First Discovery
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Watch product stories and brand showcases. See before you buy.
              </p>
            </motion.div>

            {/* Local Brand Visibility */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-gray-200/60 p-8 shadow-sm hover:shadow-md transition-all text-center"
            >
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-5 mx-auto shadow-lg shadow-emerald-200">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Local Brand Visibility
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Discover brands in your city. Support local businesses.
              </p>
            </motion.div>

            {/* Instant WhatsApp Contact */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-gray-200/60 p-8 shadow-sm hover:shadow-md transition-all text-center"
            >
              <div className="w-14 h-14 bg-pink-500 rounded-2xl flex items-center justify-center mb-5 mx-auto shadow-lg shadow-pink-200">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Instant WhatsApp Contact
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Message brands directly. No forms, no wait. Just tap and chat.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── For Shoppers / For Brands ── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto"
          >
            {/* For Shoppers */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              className="relative bg-gray-50 rounded-2xl border border-gray-200/60 p-8 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {/* Decorative gradient shape */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-bl from-emerald-200/40 to-teal-100/20 rounded-bl-full pointer-events-none" />

              <div className="relative">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-5 shadow-md shadow-emerald-200">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  For Shoppers
                </h3>
                <p className="text-gray-500 mb-6">
                  Explore curated D2C brands, watch product stories, and connect
                  instantly via WhatsApp.
                </p>
                <ul className="space-y-3.5 mb-8">
                  {[
                    "Discover brands by category and city",
                    "Watch product videos and stories",
                    "Message brands on WhatsApp instantly",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={handleExploreBrands}
                  className="w-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md shadow-emerald-200 py-6 cursor-pointer"
                >
                  Start Exploring
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>

            {/* For Brands */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              className="relative bg-gray-50 rounded-2xl border border-gray-200/60 p-8 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {/* Decorative gradient shape */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-bl from-violet-200/40 to-purple-100/20 rounded-bl-full pointer-events-none" />

              <div className="relative">
                <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center mb-5 shadow-md shadow-violet-200">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  For Brands
                </h3>
                <p className="text-gray-500 mb-6">
                  Showcase your products, capture inquiries, and boost
                  visibility with powerful tools.
                </p>
                <ul className="space-y-3.5 mb-8">
                  {[
                    "Post content and product catalogs",
                    "Capture WhatsApp inquiries directly",
                    "Boost visibility with sponsored posts",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={handleBrandRegister}
                  className="w-full bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md shadow-violet-200 py-6 cursor-pointer"
                >
                  List Your Brand
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 sm:py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-500">
              Get started in three simple steps
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              {
                step: "1",
                title: "Choose Category & City",
                description:
                  "Select what you're looking for and your location to see relevant brands.",
                color: "bg-violet-600",
                shadow: "shadow-violet-200",
                dotColor: "bg-violet-300",
              },
              {
                step: "2",
                title: "Watch Stories & Shortlist",
                description:
                  "Browse video content and save brands you're interested in exploring.",
                color: "bg-pink-500",
                shadow: "shadow-pink-200",
                dotColor: "bg-pink-300",
              },
              {
                step: "3",
                title: "Contact Instantly",
                description:
                  "Tap to message brands directly on WhatsApp. No forms or waiting.",
                color: "bg-emerald-500",
                shadow: "shadow-emerald-200",
                dotColor: "bg-emerald-300",
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                variants={fadeInUp}
                className="text-center relative"
              >
                {/* Decorative dot */}
                <div
                  className={`absolute -top-2 right-1/4 w-3 h-3 ${item.dotColor} rounded-full opacity-60`}
                />
                <div
                  className={`w-16 h-16 ${item.color} text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg ${item.shadow}`}
                >
                  <span className="text-xl font-bold">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SEO Content — A Better Way to Discover ── */}
      <section className="py-16 sm:py-24 bg-gray-900 text-gray-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
              A Better Way to Discover Local D2C Brands
            </h2>

            <div className="space-y-6 leading-relaxed">
              <p>
                Vividly is India's first city-based D2C brand discovery platform
                that connects shoppers with verified direct-to-consumer brands
                in their local area. Whether you're looking for handcrafted
                jewelry in Mumbai, organic skincare in Bangalore, or artisanal
                food products in Delhi, Vividly helps you find exactly what you
                need from brands that matter.
              </p>
              <p>
                Unlike traditional e-commerce marketplaces, Vividly focuses on
                authentic brand stories and direct communication. Browse brands
                by category, watch video content showcasing their products, and
                connect instantly via WhatsApp — no intermediaries, no
                complicated checkout processes. Just direct, meaningful
                connections with the brands you want to support.
              </p>
              <p>
                For D2C brands across India, Vividly offers a powerful way to
                reach local customers actively searching for their products.
                Brands can create rich profiles, post product catalogs, share
                video stories, and capture customer inquiries directly through
                WhatsApp. With city-based visibility and category filters, your
                brand reaches the right audience at the right time.
              </p>
              <p>
                The platform is designed to be simple and accessible. Shoppers
                can browse without downloading an app, brands can list their
                products for free, and every interaction is transparent and
                direct. Whether you're discovering new brands or showcasing your
                products, Vividly makes the process effortless and authentic.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Pricing Section ── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Choose the plan that fits your brand's needs. Start free, scale as
              you grow.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {/* Free Plan */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border-2 border-gray-200 p-8 hover:shadow-lg transition-all"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Free</h3>
                <p className="text-sm text-gray-500">
                  Perfect for getting started
                </p>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold text-gray-900">₹0</div>
                <div className="text-sm text-gray-500">Forever free</div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Create brand profile",
                  "Post product catalogs",
                  "City-based visibility",
                  "WhatsApp inquiry capture",
                  "Basic analytics",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={handleBrandRegister}
                className="w-full bg-gray-900 text-white hover:bg-gray-800 py-5 cursor-pointer"
              >
                Get Started
              </Button>
            </motion.div>

            {/* Growth Plan — Most Popular */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              className="relative bg-linear-to-br from-violet-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl shadow-violet-200 hover:shadow-2xl transition-all"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full shadow-md">
                Most Popular
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">Growth</h3>
                <p className="text-sm text-violet-200">Boost your visibility</p>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold">₹999</div>
                <div className="text-sm text-violet-200">Per month</div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Everything in Free",
                  "Priority listing in search",
                  "Featured badge on profile",
                  "Advanced analytics dashboard",
                  "Multi-location support",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-violet-100">{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={handleBrandRegister}
                className="w-full bg-white/20 border border-white/30 text-white hover:bg-white/30 py-5 cursor-pointer"
              >
                Start Growing
              </Button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border-2 border-gray-200 p-8 hover:shadow-lg transition-all"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Pro</h3>
                <p className="text-sm text-gray-500">
                  Maximum visibility & reach
                </p>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold text-gray-900">₹2,499</div>
                <div className="text-sm text-gray-500">Per month</div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Everything in Growth",
                  "Sponsored post boosting",
                  "Homepage featured placement",
                  "Premium customer insights",
                  "Dedicated account manager",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={handleBrandRegister}
                className="w-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-200 py-5 cursor-pointer"
              >
                Go Premium
              </Button>
            </motion.div>
          </motion.div>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center text-sm text-gray-500 mt-8"
          >
            All plans include KYC verification, secure brand profiles, and
            direct customer connections.
          </motion.p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 sm:py-28 bg-linear-to-b from-white to-indigo-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            >
              Ready to Discover Brands Differently?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto"
            >
              Join verified D2C brands and shoppers discovering better ways to
              connect.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={handleExploreBrands}
                size="lg"
                className="bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-200 px-8 py-6 text-base cursor-pointer"
              >
                Explore Brands
              </Button>
              <Button
                onClick={handleBrandRegister}
                variant="outline"
                size="lg"
                className="border-gray-300 text-gray-900 hover:bg-gray-50 px-8 py-6 text-base cursor-pointer"
              >
                List Your Brand
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
