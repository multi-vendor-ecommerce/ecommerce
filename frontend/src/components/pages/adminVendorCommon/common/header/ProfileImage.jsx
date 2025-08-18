import { FiUser } from 'react-icons/fi';
import { capitalize } from '../../../../../utils/capitalize';

const ProfileImage = ({ person }) => {
  return (
    <>
      {person?.profileImage ? (
        <img
          src={person.profileImage}
          alt={person.name}
          title={`${capitalize(person.role)}'s profile image`}
          className="w-10 h-10 rounded-full object-cover hover:scale-110 transition duration-300"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center" title={`${capitalize(person.role)}'s profile image`}>
          <FiUser className="text-gray-600" />
        </div>
      )}
    </>
  )
}

export default ProfileImage;