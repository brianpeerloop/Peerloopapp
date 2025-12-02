import PropTypes from 'prop-types';

// User prop types
export const UserPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired
});

// Course prop types
export const CoursePropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  instructorId: PropTypes.number.isRequired,
  duration: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  rating: PropTypes.number,
  students: PropTypes.number,
  category: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  thumbnail: PropTypes.string.isRequired,
  curriculum: PropTypes.array,
  learningObjectives: PropTypes.arrayOf(PropTypes.string)
});

// Instructor prop types
export const InstructorPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  bio: PropTypes.string.isRequired,
  qualifications: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    sentence: PropTypes.string.isRequired
  })),
  website: PropTypes.string,
  expertise: PropTypes.arrayOf(PropTypes.string),
  stats: PropTypes.shape({
    studentsTaught: PropTypes.number,
    coursesCreated: PropTypes.number,
    averageRating: PropTypes.number,
    totalReviews: PropTypes.number
  }),
  courses: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object
  ]))
});

// Community prop types
export const CommunityPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  topic: PropTypes.string.isRequired,
  members: PropTypes.number.isRequired,
  posts: PropTypes.number.isRequired,
  lastActivity: PropTypes.string.isRequired,
  instructor: PropTypes.string.isRequired,
  instructorAvatar: PropTypes.string.isRequired,
  topicImage: PropTypes.string.isRequired,
  description: PropTypes.string,
  courseId: PropTypes.number,
  isCourseSpecific: PropTypes.bool
});

// Post prop types
export const PostPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  communityId: PropTypes.number,
  courseId: PropTypes.number,
  author: PropTypes.string.isRequired,
  authorAvatar: PropTypes.string.isRequired,
  authorHandle: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
  replies: PropTypes.number.isRequired,
  community: PropTypes.string.isRequired,
  communityColor: PropTypes.string.isRequired
}); 