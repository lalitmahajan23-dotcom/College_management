import React, { useState } from "react";
import {
  User,
  StudentData,
  TeacherData,
  ExamRoom,
  DepartmentStats,
} from "../../types";
import {
  Settings,
  LogOut,
  Users,
  GraduationCap,
  School,
  BarChart3,
  PlusCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    class: "",
    email: "",
    rollNumber: "",
  });
  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    capacity: "",
    floor: "",
    building: "",
  });

  // State for managing students, teachers, and exam rooms
  const [students, setStudents] = useState<StudentData[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      class: "X-A",
      rollNumber: "2024001",
      attendance: 92,
      performanceData: [
        { subject: "Mathematics", score: 85 },
        { subject: "Physics", score: 78 },
        { subject: "Chemistry", score: 92 },
      ],
    },
  ]);

  const [teachers] = useState<TeacherData[]>([
    {
      id: "1",
      name: "Dr. Sarah Wilson",
      email: "sarah@example.com",
      department: "Mathematics",
      subjects: ["Calculus", "Linear Algebra"],
      joinDate: "2022-08-15",
    },
  ]);

  const [examRooms, setExamRooms] = useState<ExamRoom[]>([
    {
      id: "1",
      roomNumber: "101",
      capacity: 40,
      floor: "1st",
      building: "Main Block",
      status: "available",
    },
  ]);

  const departmentStats: DepartmentStats[] = [
    {
      name: "Mathematics",
      studentCount: 150,
      teacherCount: 8,
      averagePerformance: 82,
    },
    {
      name: "Physics",
      studentCount: 120,
      teacherCount: 6,
      averagePerformance: 78,
    },
    {
      name: "Chemistry",
      studentCount: 130,
      teacherCount: 7,
      averagePerformance: 85,
    },
  ];

  // Add Student handler
  const handleAddStudent = () => {
    const newStudentData: StudentData = {
      id: (students.length + 1).toString(),
      name: newStudent.name,
      email: newStudent.email,
      class: newStudent.class,
      rollNumber: newStudent.rollNumber,
      attendance: Math.floor(Math.random() * 30) + 70,
      performanceData: [
        { subject: "Mathematics", score: Math.floor(Math.random() * 30) + 70 },
        { subject: "Physics", score: Math.floor(Math.random() * 30) + 70 },
        { subject: "Chemistry", score: Math.floor(Math.random() * 30) + 70 },
      ],
    };
    setStudents([...students, newStudentData]);
    setShowStudentModal(false);
    setNewStudent({ name: "", class: "", email: "", rollNumber: "" });
  };

  // Add Room handler
  const handleAddRoom = () => {
    const newRoomData: ExamRoom = {
      id: (examRooms.length + 1).toString(),
      roomNumber: newRoom.roomNumber,
      capacity: parseInt(newRoom.capacity),
      floor: newRoom.floor,
      building: newRoom.building,
      status: "available",
    };
    setExamRooms([...examRooms, newRoomData]);
    setShowRoomModal(false);
    setNewRoom({ roomNumber: "", capacity: "", floor: "", building: "" });
  };

  // Render functions for tabs
  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#03045E]">
            Department Performance
          </h3>
          <BarChart3 className="h-6 w-6 text-[#03045E]" />
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#90E0EF" />
              <XAxis dataKey="name" stroke="#03045E" />
              <YAxis stroke="#03045E" />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="averagePerformance"
                fill="#0077B6"
                name="Avg. Performance"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#03045E]">
            Student Distribution
          </h3>
          <Users className="h-6 w-6 text-[#03045E]" />
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#90E0EF" />
              <XAxis dataKey="name" stroke="#03045E" />
              <YAxis stroke="#03045E" />
              <Tooltip />
              <Bar dataKey="studentCount" fill="#03045E" name="Students" />
              <Bar dataKey="teacherCount" fill="#90E0EF" name="Teachers" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#03045E]">
            Quick Actions
          </h3>
          <Settings className="h-6 w-6 text-[#03045E]" />
        </div>
        <div className="space-y-4">
          <button
            onClick={() => setShowStudentModal(true)}
            className="w-full flex items-center justify-between p-3 bg-[#90E0EF] rounded-md hover:bg-[#0077B6] transition-colors text-[#03045E] hover:text-white"
          >
            <span className="flex items-center">
              <PlusCircle className="h-5 w-5 mr-2" />
              Add New Student
            </span>
          </button>
          <button
            onClick={() => setShowRoomModal(true)}
            className="w-full flex items-center justify-between p-3 bg-[#90E0EF] rounded-md hover:bg-[#0077B6] transition-colors text-[#03045E] hover:text-white"
          >
            <span className="flex items-center">
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Room
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#03045E]">
          Student Management
        </h2>
        <button
          onClick={() => setShowStudentModal(true)}
          className="px-4 py-2 bg-[#03045E] text-white rounded-md hover:bg-[#0077B6] transition-colors flex items-center"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Student
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-[#03045E]">
          <thead className="bg-[#90E0EF]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#03045E] uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#03045E] uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#03045E] uppercase tracking-wider">
                Roll Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#03045E] uppercase tracking-wider">
                Attendance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#03045E] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#03045E]">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-[#03045E]">
                        {student.name}
                      </div>
                      <div className="text-sm text-[#0077B6]">
                        {student.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#03045E]">
                  {student.class}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#03045E]">
                  {student.rollNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm text-[#03045E]">
                      {student.attendance}%
                    </span>
                    <div className="ml-2 w-16 bg-[#90E0EF] rounded-full h-2">
                      <div
                        className="bg-[#0077B6] rounded-full h-2"
                        style={{ width: `${student.attendance}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-[#03045E] hover:text-[#0077B6] mr-3">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTeachers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#03045E]">
          Teacher Management
        </h2>
        <button
          onClick={() => setShowStudentModal(true)}
          className="px-4 py-2 bg-[#03045E] text-white rounded-md hover:bg-[#0077B6] transition-colors flex items-center"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Teacher
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-[#03045E]">
          <thead className="bg-[#90E0EF]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#03045E] uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#03045E] uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#03045E] uppercase tracking-wider">
                Subjects
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#03045E] uppercase tracking-wider">
                Join Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#03045E] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#03045E]">
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-[#03045E]">
                        {teacher.name}
                      </div>
                      <div className="text-sm text-[#0077B6]">
                        {teacher.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#03045E]">
                  {teacher.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#03045E]">
                  {teacher.subjects.join(", ")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#03045E]">
                  {format(new Date(teacher.joinDate), "MMM dd, yyyy")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-[#03045E] hover:text-[#0077B6] mr-3">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderExamRooms = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#03045E]">
          Exam Room Management
        </h2>
        <button
          onClick={() => setShowRoomModal(true)}
          className="px-4 py-2 bg-[#03045E] text-white rounded-md hover:bg-[#0077B6] transition-colors flex items-center"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Room
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examRooms.map((room) => (
          <div key={room.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-[#03045E]">
                  Room {room.roomNumber}
                </h3>
                <p className="text-sm text-[#0077B6]">
                  {room.building} - {room.floor} Floor
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  room.status === "available"
                    ? "bg-green-100 text-green-800"
                    : room.status === "occupied"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {room.status}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-[#03045E]">
                Capacity: {room.capacity} students
              </p>
            </div>
            <div className="mt-4 flex space-x-4">
              <button className="flex-1 px-3 py-2 bg-[#90E0EF] text-[#03045E] rounded-md hover:bg-[#0077B6] hover:text-white transition-colors">
                Schedule
              </button>
              <button className="flex-1 px-3 py-2 bg-[#90E0EF] text-[#03045E] rounded-md hover:bg-[#0077B6] hover:text-white transition-colors">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "students":
        return renderStudents();
      case "teachers":
        return renderTeachers();
      case "examRooms":
        return renderExamRooms();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#03045E] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-[#90E0EF]" />
              <div className="ml-4">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-[#90E0EF]">Welcome, {user.name}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center text-[#90E0EF] hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Vertical Navbar */}
        <nav className="bg-[#03045E] shadow-sm w-64 min-h-screen py-6">
          <div className="space-y-3">
            {[
              { id: "overview", icon: BarChart3, label: "Overview" },
              { id: "students", icon: GraduationCap, label: "Students" },
              { id: "teachers", icon: Users, label: "Teachers" },
              { id: "examRooms", icon: School, label: "Exam Rooms" },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center w-full px-6 py-3 text-sm font-medium ${
                  activeTab === id
                    ? "text-white bg-[#0077B6] border-l-4 border-[#00B4D8]"
                    : "text-[#90E0EF] hover:text-white hover:bg-[#0077B6] hover:border-l-4 hover:border-[#00B4D8]"
                } transition-colors`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {label}
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>
      </div>

      {/* Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-[#03045E] mb-4">
              Add New Student
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={newStudent.name}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, name: e.target.value })
                }
                className="w-full p-2 border-2 border-[#03045E] rounded focus:outline-none focus:ring-2 focus:ring-[#90E0EF]"
              />
              <input
                type="text"
                placeholder="Class"
                value={newStudent.class}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, class: e.target.value })
                }
                className="w-full p-2 border-2 border-[#03045E] rounded focus:outline-none focus:ring-2 focus:ring-[#90E0EF]"
              />
              <input
                type="email"
                placeholder="Email"
                value={newStudent.email}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, email: e.target.value })
                }
                className="w-full p-2 border-2 border-[#03045E] rounded focus:outline-none focus:ring-2 focus:ring-[#90E0EF]"
              />
              <input
                type="text"
                placeholder="Roll Number"
                value={newStudent.rollNumber}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, rollNumber: e.target.value })
                }
                className="w-full p-2 border-2 border-[#03045E] rounded focus:outline-none focus:ring-2 focus:ring-[#90E0EF]"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowStudentModal(false)}
                  className="px-4 py-2 border border-[#03045E] text-[#03045E] rounded hover:bg-[#90E0EF] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStudent}
                  className="px-4 py-2 bg-[#03045E] text-white rounded hover:bg-[#0077B6] transition-colors"
                >
                  Add Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Room Modal */}
      {showRoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-[#03045E] mb-4">
              Add New Room
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Room Number"
                value={newRoom.roomNumber}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, roomNumber: e.target.value })
                }
                className="w-full p-2 border-2 border-[#03045E] rounded focus:outline-none focus:ring-2 focus:ring-[#90E0EF]"
              />
              <input
                type="text"
                placeholder="Capacity"
                value={newRoom.capacity}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, capacity: e.target.value })
                }
                className="w-full p-2 border-2 border-[#03045E] rounded focus:outline-none focus:ring-2 focus:ring-[#90E0EF]"
              />
              <input
                type="text"
                placeholder="Floor"
                value={newRoom.floor}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, floor: e.target.value })
                }
                className="w-full p-2 border-2 border-[#03045E] rounded focus:outline-none focus:ring-2 focus:ring-[#90E0EF]"
              />
              <input
                type="text"
                placeholder="Building"
                value={newRoom.building}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, building: e.target.value })
                }
                className="w-full p-2 border-2 border-[#03045E] rounded focus:outline-none focus:ring-2 focus:ring-[#90E0EF]"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRoomModal(false)}
                  className="px-4 py-2 border border-[#03045E] text-[#03045E] rounded hover:bg-[#90E0EF] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRoom}
                  className="px-4 py-2 bg-[#03045E] text-white rounded hover:bg-[#0077B6] transition-colors"
                >
                  Add Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
