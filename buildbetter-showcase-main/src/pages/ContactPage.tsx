import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";

const ContactPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <Contact />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;


