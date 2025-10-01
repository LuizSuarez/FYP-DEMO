// import { useEffect, useState } from "react";
// import { Layout } from "../components/Layout";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
// import { Button } from "../components/ui/button";
// import { Badge } from "../components/ui/badge";
// import { Upload, FileText, Activity, Users, Stethoscope, AlertTriangle, CheckCircle, LogOut, Calendar, Clock } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";

// const patients = [
//   {
//     name: "Sarah Mitchell",
//     id: "P001",
//     status: "High Priority",
//     lastVisit: "2024-01-15",
//     riskLevel: "Moderate"
//   },
//   {
//     name: "James Wilson", 
//     id: "P002",
//     status: "Routine",
//     lastVisit: "2024-01-14",
//     riskLevel: "Low"
//   },
//   {
//     name: "Emma Davis",
//     id: "P003", 
//     status: "Follow-up",
//     lastVisit: "2024-01-12",
//     riskLevel: "High"
//   }
// ];

// const clinicalTests = [
//   {
//     patient: "Sarah Mitchell",
//     test: "Pharmacogenomic Panel",
//     status: "Complete",
//     date: "2024-01-15"
//   },
//   {
//     patient: "James Wilson",
//     test: "Cardiac Risk Assessment",
//     status: "Processing",
//     date: "2024-01-14"
//   },
//   {
//     patient: "Emma Davis", 
//     test: "BRCA Gene Analysis",
//     status: "Complete",
//     date: "2024-01-13"
//   }
// ];

// export default function ClinicianDashboard() {
//   const [userData, setUserData] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUserData = localStorage.getItem('userData');
//     if (storedUserData) {
//       setUserData(JSON.parse(storedUserData));
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('userData');
//     navigate('/login');
//   };

//   return (
//     <Layout>
//       <div className="flex-1 space-y-6 p-6 max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Welcome back, Dr. {userData?.firstName || "Doctor"}</h1>
//             <p className="text-gray-600">
//               Clinical genomic analysis and patient management
//               {userData?.license && ` • License: ${userData.license}`}
//             </p>
//           </div>
//           <div className="flex items-center space-x-3">
//             <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95" asChild>
//               <Link to="/upload">
//                 <Upload className="h-4 w-4 mr-2" />
//                 Upload Patient Data
//               </Link>
//             </Button>
//             <Button 
//               variant="outline" 
//               onClick={handleLogout}
//               className="transform transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 hover:bg-red-50 hover:border-red-300"
//             >
//               <LogOut className="h-4 w-4 mr-2" />
//               Logout
//             </Button>
//           </div>
//         </div>

//         {/* Stats Overview */}
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
//               <Users className="h-4 w-4 text-gray-500" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">142</div>
//               <p className="text-xs text-green-600">+3 new this week</p>
//             </CardContent>
//           </Card>

//           <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
//               <Stethoscope className="h-4 w-4 text-gray-500" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">89</div>
//               <p className="text-xs text-gray-600">+12 this week</p>
//             </CardContent>
//           </Card>

//           <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">High Priority</CardTitle>
//               <AlertTriangle className="h-4 w-4 text-orange-500" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">5</div>
//               <p className="text-xs text-orange-600">Requires attention</p>
//             </CardContent>
//           </Card>

//           <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Appointments</CardTitle>
//               <Calendar className="h-4 w-4 text-gray-500" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">8</div>
//               <p className="text-xs text-gray-600">Today's schedule</p>
//             </CardContent>
//           </Card>
//         </div>

//         <div className="grid gap-6 md:grid-cols-2">
//           {/* Patient List */}
//           <Card className="transform transition-all duration-300 hover:shadow-lg">
//             <CardHeader>
//               <CardTitle>Recent Patients</CardTitle>
//               <CardDescription>Patients requiring attention</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {patients.map((patient, index) => (
//                   <div key={index} className="flex items-center justify-between p-4 border rounded-lg transition-all duration-300 hover:shadow-md hover:scale-102">
//                     <div className="flex items-center space-x-3">
//                       <Users className="h-8 w-8 text-blue-600" />
//                       <div>
//                         <p className="font-medium">{patient.name}</p>
//                         <p className="text-sm text-gray-600">
//                           {patient.id} • Last visit: {patient.lastVisit}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="text-right space-y-1">
//                       <Badge 
//                         variant="secondary"
//                         className={`transition-all duration-300 hover:scale-110 ${
//                           patient.status === "High Priority" ? "bg-orange-100 text-orange-700" :
//                           patient.status === "Follow-up" ? "bg-blue-100 text-blue-700" :
//                           "bg-gray-100 text-gray-700"
//                         }`}
//                       >
//                         {patient.status}
//                       </Badge>
//                       <p className="text-xs text-gray-600">
//                         Risk: {patient.riskLevel}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//                 <Button 
//                   variant="outline" 
//                   className="w-full transform transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95" 
//                   asChild
//                 >
//                   <Link to="/patients">View All Patients</Link>
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Clinical Tests */}
//           <Card className="transform transition-all duration-300 hover:shadow-lg">
//             <CardHeader>
//               <CardTitle>Recent Tests</CardTitle>
//               <CardDescription>Latest genomic test results</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {clinicalTests.map((test, index) => (
//                   <div key={index} className="space-y-2 p-4 border rounded-lg transition-all duration-300 hover:shadow-md hover:scale-102">
//                     <div className="flex items-center justify-between">
//                       <span className="font-medium">{test.test}</span>
//                       <Badge 
//                         variant={test.status === "Complete" ? "default" : "secondary"}
//                         className={`transition-all duration-300 hover:scale-110 ${
//                           test.status === "Complete" ? "bg-green-500 text-white" : "bg-orange-100 text-orange-700"
//                         }`}
//                       >
//                         {test.status === "Complete" ? (
//                           <CheckCircle className="h-3 w-3 mr-1" />
//                         ) : (
//                           <Clock className="h-3 w-3 mr-1 animate-pulse" />
//                         )}
//                         {test.status}
//                       </Badge>
//                     </div>
//                     <p className="text-sm text-gray-600">
//                       Patient: {test.patient} • {test.date}
//                     </p>
//                   </div>
//                 ))}
//                 <Button 
//                   variant="outline" 
//                   className="w-full transform transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95" 
//                   asChild
//                 >
//                   <Link to="/tests">View All Tests</Link>
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Quick Actions */}
//         <Card className="transform transition-all duration-300 hover:shadow-lg">
//           <CardHeader>
//             <CardTitle>Clinical Tools</CardTitle>
//             <CardDescription>Patient care and analysis tools</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//               <Button 
//                 variant="outline" 
//                 className="h-auto p-6 flex flex-col items-center space-y-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 hover:-translate-y-1" 
//                 asChild
//               >
//                 <Link to="/new-patient">
//                   <Users className="h-8 w-8" />
//                   <span>New Patient</span>
//                 </Link>
//               </Button>
              
//               <Button 
//                 variant="outline" 
//                 className="h-auto p-6 flex flex-col items-center space-y-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 hover:-translate-y-1" 
//                 asChild
//               >
//                 <Link to="/order-test">
//                   <Stethoscope className="h-8 w-8" />
//                   <span>Order Test</span>
//                 </Link>
//               </Button>
              
//               <Button 
//                 variant="outline" 
//                 className="h-auto p-6 flex flex-col items-center space-y-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 hover:-translate-y-1" 
//                 asChild
//               >
//                 <Link to="/clinical-reports">
//                   <FileText className="h-8 w-8" />
//                   <span>Clinical Reports</span>
//                 </Link>
//               </Button>
              
//               <Button 
//                 variant="outline" 
//                 className="h-auto p-6 flex flex-col items-center space-y-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 hover:-translate-y-1" 
//                 asChild
//               >
//                 <Link to="/guidelines">
//                   <Activity className="h-8 w-8" />
//                   <span>Guidelines</span>
//                 </Link>
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </Layout>
//   );
// }