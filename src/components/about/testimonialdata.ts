import story1 from '../../assets/images/story1.webp';
import story2 from '../../assets/images/story2.webp'

type Testimonial = {
    id: number;
    name: string;
    role: string;
    image: string;
    content: string;
};

export const testimonialsData: Testimonial[] = [
    {
        id: 1,
        name: 'John Doe',
        role: 'Project Manager',
        image: story1,
        content: 'TodoPro has transformed the way our team collaborates. The intuitive interface and powerful features make task management a breeze.',
    },
    {
        id: 2,
        name: 'Jane Smith',
        role: 'Software Engineer',
        image: story2,
        content: 'With TodoPro, I can easily track my tasks and deadlines. It has significantly improved my productivity and helped me stay organized.',
    },
    {
        id: 3,
        name: 'Michael Brown',
        role: 'UI/UX Designer',
        image: story1,
        content: 'The clean design and user-friendly experience of TodoPro make it my go-to tool for managing creative projects.',
    },
    {
        id: 4,
        name: 'Emily Davis',
        role: 'QA Analyst',
        image: story2,
        content: 'TodoPro helps me keep track of testing cycles and bug reports efficiently. Highly recommended for any QA team!',
    },
    {
        id: 5,
        name: 'David Wilson',
        role: 'DevOps Engineer',
        image: story1,
        content: 'Integrating TodoPro into our workflow has streamlined our deployment process and improved team communication.',
    },
    {
        id: 6,
        name: 'Sophia Lee',
        role: 'Product Owner',
        image: story2,
        content: 'TodoPro gives me a clear overview of project progress and helps prioritize tasks for the team.',
    },
    {
        id: 7,
        name: 'Chris Martin',
        role: 'Frontend Developer',
        image: story1,
        content: 'I love how TodoPro keeps all my tasks organized and accessible from anywhere.',
    },
    {
        id: 8,
        name: 'Olivia Taylor',
        role: 'Backend Developer',
        image: story2,
        content: 'TodoPro’s collaboration features have made working with my team seamless and efficient.',
    },
];