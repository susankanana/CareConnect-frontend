import { testimonialsData } from "./testimonialdata"

const Testimonials = () => {
    return (
        <section className="py-12 bg-base-100">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-700 mb-8">
                    What Our Users Say
                </h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {testimonialsData.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center border border-gray-100 hover:shadow-xl transition-shadow"
                        >
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-primary"
                            />
                            <p className="text-gray-600 mb-4 italic">&quot;{testimonial.content}</p>
                            <div>
                                <h3 className="text-gray-600 mb-4 italic">{testimonial.name}</h3>
                                <span className="text-primary text-sm">{testimonial.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Testimonials