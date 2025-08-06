import { format } from 'date-fns';
import { institutions } from './institutions';

const generateRandomScore = () => Math.floor(Math.random() * 31) + 70;
const generateRandomDate = () => {
  const start = new Date(2024, 0, 1);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// List of first names and last names for generating realistic student names
const firstNames = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'James', 'Isabella', 'Oliver',
  'Charlotte', 'Benjamin', 'Amelia', 'Elijah', 'Mia', 'Lucas', 'Harper', 'Mason', 'Evelyn', 'Logan',
  'Abigail', 'Alexander', 'Emily', 'Ethan', 'Elizabeth', 'Jacob', 'Sofia', 'Michael', 'Avery', 'Daniel',
  'Ella', 'Henry', 'Scarlett', 'Jackson', 'Grace', 'Sebastian', 'Chloe', 'Aiden', 'Victoria', 'Matthew',
  'Riley', 'Samuel', 'Aria', 'David', 'Lily', 'Joseph', 'Aubrey', 'Carter', 'Zoey', 'Owen'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
];

// Generate a random name
const generateRandomName = () => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
};

export const students = Array.from({ length: 100 }, (_, i) => ({
  id: `S${(10045 + i).toString().padStart(5, '0')}`,
  name: generateRandomName(),
  institution: institutions[Math.floor(Math.random() * institutions.length)].name,
  subjects: [
    {
      name: 'Mathematics',
      score: generateRandomScore(),
      date: format(generateRandomDate(), 'MMM dd, yyyy'),
      status: 'Completed'
    },
    {
      name: 'Physics',
      score: generateRandomScore(),
      date: format(generateRandomDate(), 'MMM dd, yyyy'),
      status: 'Completed'
    },
    {
      name: 'Chemistry',
      score: generateRandomScore(),
      date: format(generateRandomDate(), 'MMM dd, yyyy'),
      status: 'Under Review'
    }
  ],
  avatar: `${(i + 1).toString().padStart(2, '0')}`
}));

// Export the list of subjects for filtering
export const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography'];

// Export the list of education levels for filtering
export const educationLevels = ['Primary', 'Secondary', 'Senior Secondary', 'Undergraduate', 'Graduate', 'Postgraduate'];