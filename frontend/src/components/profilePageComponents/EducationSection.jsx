import { School, X } from "lucide-react";
import { useState } from "react";

const EducationSection = ({ userData, isOwnProfile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [educations, setEducations] = useState(userData.education || []);
  const [newEducation, setNewEducation] = useState({
    school: "",
    fieldOfStudy: "",
    startYear: "",
    endDate: "",
    cgpa: "",
  });

  const handleAddEducation = () => {
    if (
      newEducation.school &&
      newEducation.fieldOfStudy &&
      newEducation.startYear
    ) {
      setEducations([...educations, newEducation]);
      setNewEducation({
        school: "",
        fieldOfStudy: "",
        startYear: "",
        endDate: "",
        cgpa: "",
      });
    }
  };

  const handleDeleteEducation = (id) => {
    setEducations(educations.filter((edu) => edu._id !== id));
  };

  const handleSave = () => {
    onSave({ education: educations });
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-900 text-gray-100 shadow rounded-lg p-6 mb-6 transition-colors duration-300">
      <h2 className="text-xl font-semibold mb-4 text-primary">Education</h2>

      {educations.map((edu) => (
        <div
          key={edu._id || edu.school}
          className="mb-4 flex justify-between items-start"
        >
          <div className="flex items-start">
            <School size={20} className="mr-2 mt-1 text-primary" />
            <div>
              <h3 className="font-semibold text-gray-100">
                {edu.fieldOfStudy}
              </h3>
              <p className="text-gray-400">{edu.school}</p>
              <p className="text-gray-500 text-sm">
                {edu.startYear} - {edu.endDate || "Present"}
              </p>
              {edu.cgpa && (
                <p className="text-gray-300 text-sm font-medium">
                  CGPA: {edu.cgpa}
                </p>
              )}
            </div>
          </div>
          {isEditing && (
            <button
              onClick={() => handleDeleteEducation(edu._id)}
              className="text-red-500 hover:text-red-600 transition duration-300"
            >
              <X size={20} />
            </button>
          )}
        </div>
      ))}

      {isEditing && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="School"
            value={newEducation.school}
            onChange={(e) =>
              setNewEducation({ ...newEducation, school: e.target.value })
            }
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100 mb-2 focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Field of Study"
            value={newEducation.fieldOfStudy}
            onChange={(e) =>
              setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })
            }
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100 mb-2 focus:ring-2 focus:ring-primary"
          />
          <input
            type="number"
            placeholder="Start Year"
            value={newEducation.startYear}
            onChange={(e) =>
              setNewEducation({ ...newEducation, startYear: e.target.value })
            }
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100 mb-2 focus:ring-2 focus:ring-primary"
          />
          <input
            type="number"
            placeholder="End Year"
            value={newEducation.endDate}
            onChange={(e) =>
              setNewEducation({ ...newEducation, endDate: e.target.value })
            }
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100 mb-2 focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="CGPA"
            value={newEducation.cgpa}
            onChange={(e) =>
              setNewEducation({ ...newEducation, cgpa: e.target.value })
            }
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100 mb-2 focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleAddEducation}
            className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300"
          >
            Add Education
          </button>
        </div>
      )}

      {isOwnProfile && (
        <>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="mt-4 bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 text-primary hover:text-primary-dark transition duration-300"
            >
              Edit Education
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default EducationSection;
