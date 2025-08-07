import { FiSettings, FiUser } from 'react-icons/fi';

const ProfileImage = ({ person }) => {
  return (
    <>
      {person?.profileImage ? (
        <img
          src={person.profileImage}
          alt={person.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <FiUser className="text-gray-600" />
        </div>
      )}
    </>
  )
}

export default ProfileImage;