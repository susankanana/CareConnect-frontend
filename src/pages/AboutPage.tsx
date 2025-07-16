import About from "../components/about/About"
import Testimonials from "../components/about/Testimonials"
import Footer from "../components/footer/Footer"
import Navbar from "../components/nav/Navbar"


const AboutPage = () => {
  return (
    <div>
      <Navbar />
      <About />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default AboutPage