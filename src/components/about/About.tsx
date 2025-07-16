import taskManager from '../../assets/images/tasks-manager.png';
const About = () => {
    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between gap-8 h-fit p-4 md:p-8">
                <div className="w-full md:w-1/2 flex items-center">
                    <img
                        src={taskManager}
                        alt="task-manager"
                        className="w-full h-48 md:h-full object-cover rounded-lg shadow-lg"
                    />
                </div>


                <div className="w-full md:w-1/2 border-2 border-gray-300 rounded-lg p-6 md:p-8 mb-6 md:mb-0">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-600">
                        About TodoPro
                    </h1>
                    <p className="mb-4 text-gray-700 text-base md:text-lg">
                        TodoPro is a powerful task management service designed to enhance team productivity and streamline project workflows.
                    </p>
                    <p className="mb-2 text-gray-700 text-base md:text-lg">
                        With TodoPro, you can easily create, assign, and track tasks, ensuring that your team stays organized and focused on what matters most.
                    </p>
                    <p className="text-gray-700 text-base md:text-lg">
                        Whether you're managing a small project or a large team, TodoPro provides the tools you need to succeed.
                    </p>
                </div>
            </div>

        </div>
    )
}

export default About