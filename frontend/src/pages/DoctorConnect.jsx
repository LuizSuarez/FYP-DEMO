import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { UserCheck, Calendar, Video, MessageSquare, Star, Clock, MapPin, Shield } from "lucide-react";
import { getDoctors, bookAppointment } from "../services/doctorService";

export default function Doctor() {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [consultationNotes, setConsultationNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (err) {
        console.error("Error fetching doctors", err);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBook = async () => {
    if (!selectedDoctor) return;
    try {
      setLoading(true);
      // Example payload — adapt as needed
      await bookAppointment(localStorage.getItem("token"), {
        doctorId: selectedDoctor._id,
        scheduledAt: new Date(Date.now() + 86400000), // tomorrow
        reason: consultationNotes,
        patientContact: user.email,
      });
      alert("✅ Appointment booked successfully");
      setSelectedDoctor(null);
      setConsultationNotes("");
    } catch (err) {
      alert("❌ Booking failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Doctor Connect</h1>

        {/* Search */}
        <Card>
          <CardContent className="p-4 flex gap-4">
            <div className="flex-1 relative">
              <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Doctor list */}
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredDoctors.map((doctor) => (
            <Card
              key={doctor._id}
              className={`cursor-pointer ${selectedDoctor?._id === doctor._id ? "border-blue-500" : ""}`}
              onClick={() => setSelectedDoctor(doctor)}
            >
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>{doctor.name}</CardTitle>
                    <CardDescription>{doctor.specialty}</CardDescription>
                    <p className="text-sm text-gray-600">{doctor.hospital}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span>{doctor.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">{doctor.consultations} consultations</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Languages: {doctor.languages?.join(", ")}</p>
                <p className="text-sm">Certifications: {doctor.certifications?.join(", ")}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Booking form */}
        {selectedDoctor && (
          <Card>
            <CardHeader>
              <CardTitle>Book Appointment with {selectedDoctor.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={consultationNotes}
                onChange={(e) => setConsultationNotes(e.target.value)}
                placeholder="Reason for consultation"
              />
              <Button onClick={handleBook} disabled={loading}>
                {loading ? "Booking..." : "Book Appointment"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
