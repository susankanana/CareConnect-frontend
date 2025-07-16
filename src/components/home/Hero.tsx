import homeIMG from '../../assets/images/home-image.png'

export const Hero = () => {

    return (
        <div className="flex flex-col md:flex-row justify-between gap-8 h-fit p-4 md:p-8">
            <div className="w-full md:w-1/2 border-2 border-gray-300 rounded-lg p-6 md:p-8 mb-6 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-600">
                    Welcome to TodoPro!
                </h1>
                <p className="mb-4 text-gray-700 text-base md:text-lg">
                    Supercharge your team's productivity with <span className="font-semibold text-blue-600">TodoPro</span> — the ultimate task management service for modern teams.
                </p>
                <p className="mb-2 text-gray-700 text-base md:text-lg">
                    Effortlessly assign tasks, track progress, and collaborate in real-time. Whether you're managing a small project or a large team, TodoPro makes delegation and follow-up a breeze.
                </p>
                <p className="text-gray-700 text-base md:text-lg">
                    Get started today and experience seamless teamwork like never before!
                </p>
            </div>

            <div className="w-full md:w-1/2 flex items-center">
                <img
                    src={homeIMG}
                    alt="home-image"
                    className="w-full h-48 md:h-full object-cover rounded-lg shadow-lg"
                />
            </div>
        </div>
    );
}
