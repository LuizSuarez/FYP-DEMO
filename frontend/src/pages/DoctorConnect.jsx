import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { UserCheck, Calendar, Video, MessageSquare, Star, Clock, MapPin, Shield } from 'lucide-react';

const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Clinical Genetics',
    hospital: 'IDC Medical Center',
    rating: 4.9,
    experience: '15 years',
    consultations: 847,
    nextAvailable: '2024-01-18',
    location: 'New York, NY',
    languages: ['English', 'Spanish'],
    certifications: ['Board Certified Geneticist', 'ACMG Fellow']
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Genomic Medicine',
    hospital: 'IDC Research Institute',
    rating: 4.8,
    experience: '12 years',
    consultations: 632,
    nextAvailable: '2024-01-19',
    location: 'San Francisco, CA',
    languages: ['English', 'Mandarin'],
    certifications: ['Genomic Medicine Specialist', 'Precision Medicine Expert']
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    specialty: 'Genetic Counseling',
    hospital: 'IDC Family Genetics',
    rating: 5.0,
    experience: '8 years',
    consultations: 423,
    nextAvailable: '2024-01-17',
    location: 'Los Angeles, CA',
    languages: ['English', 'Spanish', 'Portuguese'],
    certifications: ['Licensed Genetic Counselor', 'NSGC Certified']
  }
];

const consultationTypes = [
  {
    id: 'interpretation',
    name: 'Result Interpretation',
    duration: '30 minutes',
    price: '$150',
    description: 'Detailed explanation of genomic analysis results'
  },
  {
    id: 'risk-counseling',
    name: 'Risk Counseling',
    duration: '45 minutes',
    price: '$200',
    description: 'Genetic risk assessment and family planning guidance'
  },
  {
    id: 'follow-up',
    name: 'Follow-up Consultation',
    duration: '20 minutes',
    price: '$100',
    description: 'Review of previous results and next steps'
  }
];

export default function Doctor() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedConsultationType, setSelectedConsultationType] = useState(null);
  const [consultationNotes, setConsultationNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const bookConsultation = () => {
    if (!selectedDoctor || !selectedConsultationType) return;
    
    // Simulate booking process
    alert('Consultation booking request sent! You will receive a confirmation email shortly.');
    setSelectedDoctor(null);
    setSelectedConsultationType(null);
    setConsultationNotes('');
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Doctor Connect</h1>
          <p className="text-gray-600 dark:text-gray-300">Consult with verified genetic specialists about your results</p>
        </div>

        {/* Search and Filter */}
        <Card className="transform transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search doctors by name or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 transition-all duration-300 focus:scale-105"
                />
              </div>
              <Button variant="outline">
                <MapPin className="h-4 w-4 mr-2" />
                Location
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Availability
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Doctors List */}
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredDoctors.map((doctor) => (
            <Card 
              key={doctor.id} 
              className={`transform transition-all duration-300 hover:shadow-xl cursor-pointer ${
                selectedDoctor === doctor.id 
                  ? 'border-blue-500 shadow-lg scale-105' 
                  : 'hover:scale-105'
              }`}
              onClick={() => setSelectedDoctor(selectedDoctor === doctor.id ? null : doctor.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">{doctor.name}</CardTitle>
                    <CardDescription className="text-blue-600 font-medium">{doctor.specialty}</CardDescription>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{doctor.hospital}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{doctor.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">{doctor.consultations} consultations</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Experience</p>
                      <p className="font-medium">{doctor.experience}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Next Available</p>
                      <p className="font-medium text-green-600">{doctor.nextAvailable}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Languages</p>
                    <div className="flex flex-wrap gap-1">
                      {doctor.languages.map((lang, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Certifications</p>
                    <div className="flex flex-wrap gap-1">
                      {doctor.certifications.map((cert, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedDoctor === doctor.id && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg animate-in slide-in-from-top-2">
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1 transform transition-all duration-300 hover:scale-105">
                          <Video className="h-3 w-3 mr-1" />
                          Video Call
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 transform transition-all duration-300 hover:scale-105">
                          <Calendar className="h-3 w-3 mr-1" />
                          Schedule
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 transform transition-all duration-300 hover:scale-105">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Consultation Types */}
        <Card className="transform transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Consultation Types</CardTitle>
            <CardDescription>Select the type of consultation you need</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {consultationTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => setSelectedConsultationType(type.id === selectedConsultationType ? null : type.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-105 ${
                    selectedConsultationType === type.id
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">{type.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{type.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {type.duration}
                      </span>
                      <span className="font-bold text-green-600">{type.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Booking Form */}
        {selectedDoctor && selectedConsultationType && (
          <Card className="transform transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Book Consultation</CardTitle>
              <CardDescription>Provide details for your genetic consultation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white">Selected Doctor</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {doctors.find(d => d.id === selectedDoctor)?.name} - {doctors.find(d => d.id === selectedDoctor)?.specialty}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white">Consultation Type</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {consultationTypes.find(c => c.id === selectedConsultationType)?.name}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <Textarea
                    value={consultationNotes}
                    onChange={(e) => setConsultationNotes(e.target.value)}
                    placeholder="Describe any specific concerns or questions you'd like to discuss..."
                    rows={4}
                    className="transition-all duration-300 focus:scale-105"
                  />
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg border border-yellow-200">
                  <div className="flex items-start space-x-2">
                    <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900 dark:text-white">Data Sharing Notice</p>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Your genomic analysis reports will be securely shared with the selected doctor for consultation purposes only. 
                        No raw genomic data will be transmitted.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    onClick={bookConsultation}
                    className="bg-gradient-to-r from-green-600 to-blue-600 flex-1 transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Consultation
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedDoctor(null);
                      setSelectedConsultationType(null);
                      setConsultationNotes('');
                    }}
                    className="transform transition-all duration-300 hover:scale-105"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}