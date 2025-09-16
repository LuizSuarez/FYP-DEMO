import { 
  Upload, FileText, Activity, Calendar, Dna, Heart, Target, CheckCircle,
  Users, Stethoscope, AlertTriangle, Clock,
  FlaskConical, Database, BarChart3
} from "lucide-react";

export const getDashboardData = (role) => {
  const commonData = {
    patient: {
      title: "Welcome back",
      subtitle: "Your genomic data and health insights",
      stats: [
        {
          title: "Genome Files",
          value: "12",
          description: "+2 from last month",
          icon: FileText
        },
        {
          title: "Analyses Complete",
          value: "24",
          description: "+6 this week",
          icon: Dna
        },
        {
          title: "Risk Assessments",
          value: "8",
          description: "All up to date",
          icon: Activity
        },
        {
          title: "Health Score",
          value: "85",
          description: "+5% from last week",
          icon: Heart,
          descriptionColor: "text-green-600"
        }
      ],
      recentFiles: [
        { name: "sample_genome_001.vcf", status: "Completed", uploadDate: "2024-01-15", fileSize: "2.4 MB" },
        { name: "exome_data_v2.fasta", status: "Processing", uploadDate: "2024-01-14", fileSize: "15.7 MB" },
        { name: "variants_filtered.gff", status: "Completed", uploadDate: "2024-01-12", fileSize: "892 KB" }
      ],
      riskPredictions: [
        { condition: "Type 2 Diabetes", risk: "Low", confidence: 94, color: "success" },
        { condition: "Cardiovascular Disease", risk: "Moderate", confidence: 87, color: "warning" },
        { condition: "Alzheimer's Disease", risk: "Low", confidence: 91, color: "success" }
      ],
      lifestyleStats: [
        { metric: "Weekly Activity", value: "4/7", target: "7 days", progress: 57, icon: Activity },
        { metric: "Sleep Quality", value: "7.2h", target: "8h average", progress: 90, icon: Calendar },
        { metric: "Health Score", value: "85", target: "100 points", progress: 85, icon: Heart }
      ],
      quickActions: [
        { to: "/upload", icon: Upload, label: "Upload Data" },
        { to: "/analysis", icon: Dna, label: "Start Analysis" },
        { to: "/reports", icon: FileText, label: "Generate Report" },
        { to: "/doctor", icon: Activity, label: "Consult Doctor" }
      ]
    },
    clinician: {
      title: "Welcome back,",
      subtitle: "Clinical genomic analysis and patient management",
      stats: [
        {
          title: "Total Patients",
          value: "142",
          description: "+3 new this week",
          icon: Users,
          descriptionColor: "text-green-600"
        },
        {
          title: "Tests Completed",
          value: "89",
          description: "+12 this week",
          icon: Stethoscope
        },
        {
          title: "High Priority",
          value: "5",
          description: "Requires attention",
          icon: AlertTriangle,
          descriptionColor: "text-orange-600"
        },
        {
          title: "Appointments",
          value: "8",
          description: "Today's schedule",
          icon: Calendar
        }
      ],
      patients: [
        {
          name: "Sarah Mitchell",
          id: "P001",
          status: "High Priority",
          lastVisit: "2024-01-15",
          riskLevel: "Moderate"
        },
        {
          name: "James Wilson", 
          id: "P002",
          status: "Routine",
          lastVisit: "2024-01-14",
          riskLevel: "Low"
        },
        {
          name: "Emma Davis",
          id: "P003", 
          status: "Follow-up",
          lastVisit: "2024-01-12",
          riskLevel: "High"
        }
      ],
      clinicalTests: [
        {
          patient: "Sarah Mitchell",
          test: "Pharmacogenomic Panel",
          status: "Complete",
          date: "2024-01-15"
        },
        {
          patient: "James Wilson",
          test: "Cardiac Risk Assessment",
          status: "Processing",
          date: "2024-01-14"
        },
        {
          patient: "Emma Davis", 
          test: "BRCA Gene Analysis",
          status: "Complete",
          date: "2024-01-13"
        }
      ],
      quickActions: [
        { to: "/new-patient", icon: Users, label: "New Patient" },
        { to: "/order-test", icon: Stethoscope, label: "Order Test" },
        { to: "/clinical-reports", icon: FileText, label: "Clinical Reports" },
        { to: "/guidelines", icon: Activity, label: "Guidelines" }
      ]
    },
    researcher: {
      title: "Welcome back,",
      subtitle: "Advanced research tools and dataset management",
      stats: [
        {
          title: "Active Studies",
          value: "7",
          description: "2 pending approval",
          icon: FlaskConical
        },
        {
          title: "Total Participants",
          value: "2,295",
          description: "+127 this month",
          icon: Users,
          descriptionColor: "text-green-600"
        },
        {
          title: "Datasets",
          value: "18",
          description: "3 processing",
          icon: Database
        },
        {
          title: "Publications",
          value: "12",
          description: "+2 this year",
          icon: BarChart3,
          descriptionColor: "text-green-600"
        }
      ],
      researchProjects: [
        {
          name: "Alzheimer's Genetic Markers Study",
          status: "Active",
          progress: 75,
          participants: 1247,
          deadline: "2024-03-15"
        },
        {
          name: "Cancer Mutation Analysis",
          status: "Data Collection", 
          progress: 45,
          participants: 892,
          deadline: "2024-04-20"
        },
        {
          name: "Rare Disease Genomics",
          status: "Analysis",
          progress: 90,
          participants: 156,
          deadline: "2024-02-28"
        }
      ],
      datasets: [
        {
          name: "GWAS_alzheimer_v3.dataset",
          status: "Processing",
          size: "847 MB",
          lastModified: "2024-01-15"
        },
        {
          name: "cancer_mutations_filtered.vcf",
          status: "Complete",
          size: "1.2 GB", 
          lastModified: "2024-01-14"
        },
        {
          name: "rare_variants_cohort.tsv",
          status: "Complete",
          size: "234 MB",
          lastModified: "2024-01-12"
        }
      ],
      quickActions: [
        { to: "/upload", icon: Upload, label: "Upload Dataset" },
        { to: "/analysis", icon: BarChart3, label: "Statistical Analysis" },
        { to: "/collaborate", icon: Users, label: "Collaborate" },
        { to: "/publications", icon: FileText, label: "Publications" }
      ]
    }
  };

  return commonData[role] || commonData.patient;
};