import serviceIMG from '../../assets/images/services.jpg'

const Services = () => {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 h-fit p-4 md:p-8">
            {/* Image Section */}
            <div className="w-full md:w-1/2 flex items-center mb-6 md:mb-0">
                <img
                    src={serviceIMG}
                    alt="Our Services"
                    className="w-full h-48 md:h-full object-cover rounded-lg shadow-lg"
                />
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/2 flex flex-col gap-6">
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-600">
                    Our Services
                </h2>
                <p className="mb-4 text-gray-700 text-base md:text-lg">
                    Discover the range of services TodoPro offers to help your team stay organized and productive. From task management to real-time collaboration, we have you covered!
                </p>
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Job</th>
                                <th>Favorite Color</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>1</th>
                                <td>Cy Ganderton</td>
                                <td>Quality Control Specialist</td>
                                <td>Blue</td>
                            </tr>
                            <tr>
                                <th>2</th>
                                <td>Hart Hagerty</td>
                                <td>Desktop Support Technician</td>
                                <td>Purple</td>
                            </tr>
                            <tr>
                                <th>3</th>
                                <td>Brice Swyre</td>
                                <td>Tax Accountant</td>
                                <td>Red</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button className="btn btn-primary self-start mt-4">Get Started</button>
            </div>
        </div>
    )
}

export default Services