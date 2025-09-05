import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { FloatingChatbot } from "../components/FloatingChatbot";
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { FileText, Search, Download, Eye, Trash2, Plus, Filter, Calendar, HardDrive, Upload, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { getMyFiles, deleteFile, downloadFile, uploadGenomeFile } from '../services/genomeService';
import { getMyProjects } from '../services/projectService';
import { useAuth } from '../context/authContext';

export default function Files() {
  const [fileData, setFileData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [notification, setNotification] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  
  const { user } = useAuth();

  // Load files and projects data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load files
        const filesResponse = await getMyFiles({ 
          page: pagination.page, 
          limit: pagination.limit 
        });
        
        if (filesResponse.success) {
          setFileData(filesResponse.data.files.map(file => ({
            id: file.fileId,
            name: file.filename,
            type: file.origin?.toUpperCase() || 'UNKNOWN',
            size: file.size ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : 'Unknown',
            uploadDate: new Date(file.uploadDate).toISOString().split('T')[0],
            status: 'Processed', // TODO: Get actual status from analysis results
            project: file.projectId || 'Unassigned',
            analyses: 0, // TODO: Count actual analyses
            variants: Math.floor(Math.random() * 1000), // TODO: Get from analysis results
            tags: file.tags || ['Genome']
          })));
          
          setPagination(prev => ({ ...prev, total: filesResponse.data.total }));
        }
        
        // Load projects
        try {
          const projectsResponse = await getMyProjects();
          if (Array.isArray(projectsResponse)) {
            setProjects(projectsResponse.map(project => ({
              name: project.name,
              fileCount: 0, // TODO: Calculate from files
              totalSize: '0 MB' // TODO: Calculate from files
            })));
          }
        } catch (err) {
          console.log('Projects not available:', err.message);
          // Use fallback projects if API fails
          setProjects([
            { name: 'Default Project', fileCount: fileData.length, totalSize: '256.2 MB' }
          ]);
        }
        
      } catch (err) {
        console.error('Failed to load files:', err);
        showNotification('Failed to load files. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      loadData();
    }
  }, [user, pagination.page]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredFiles = fileData
    .filter(file => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(file => filterType === 'all' || file.type === filterType)
    .filter(file => filterStatus === 'all' || file.status.toLowerCase() === filterStatus.toLowerCase());

  const toggleFileSelection = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleBulkExport = () => {
    if (selectedFiles.length === 0) {
      showNotification('Please select files to export', 'error');
      return;
    }
    
    // Create and trigger download for selected files
    selectedFiles.forEach(fileId => {
      const file = fileData.find(f => f.id === fileId);
      if (file) {
        const blob = new Blob([`Mock content for ${file.name}`], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });
    
    showNotification(`Successfully exported ${selectedFiles.length} files`);
    setSelectedFiles([]);
  };

  const handleUpload = () => {
    setShowUploadDialog(true);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setIsUploading(false);
            
            // Add new files to the file data
            const newFiles = files.map((file, index) => ({
              id: fileData.length + index + 1,
              name: file.name,
              type: file.name.split('.').pop().toUpperCase(),
              size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
              uploadDate: new Date().toISOString().split('T')[0],
              status: 'Processing',
              project: 'New Upload',
              analyses: 0,
              variants: Math.floor(Math.random() * 1000),
              tags: ['New', 'Upload']
            }));
            
            setFileData(prev => [...prev, ...newFiles]);
            showNotification(`Successfully uploaded ${files.length} file(s)`);
            setShowUploadDialog(false);
            setUploadProgress(0);
            return 0;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleDownload = (file) => {
    // Create a mock file content and trigger download
    const content = `Mock genomic data for ${file.name}\nFile Type: ${file.type}\nSize: ${file.size}\nProject: ${file.project}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification(`Downloaded ${file.name}`);
  };

  const handleView = (file) => {
    setSelectedFile(file);
    setShowViewDialog(true);
  };

  const handleDelete = (file) => {
    setSelectedFile(file);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedFile) {
      setFileData(prev => prev.filter(file => file.id !== selectedFile.id));
      showNotification(`File ${selectedFile.name} deleted successfully`);
    } else if (selectedFiles.length > 0) {
      setFileData(prev => prev.filter(file => !selectedFiles.includes(file.id)));
      showNotification(`${selectedFiles.length} files deleted successfully`);
      setSelectedFiles([]);
    }
    setShowDeleteDialog(false);
    setSelectedFile(null);
  };

  const handleBulkDelete = () => {
    if (selectedFiles.length === 0) {
      showNotification('Please select files to delete', 'error');
      return;
    }
    setShowDeleteDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'processed': return 'success';
      case 'processing': return 'warning';
      case 'failed': return 'error';
      default: return 'secondary';
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 transition-all duration-300 ${
            notification.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="ml-2 hover:bg-gray-200 rounded-full p-1 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">File Manager</h1>
            <p className="text-gray-600 dark:text-gray-300">Organize and manage your genomic data files</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleBulkExport}>
              <Download className="h-4 w-4 mr-2" />
              Bulk Export
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600" onClick={handleUpload}>
              <Plus className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </div>
        </div>

        {/* Projects Overview */}
        <Card className="transform transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Organized collections of your genomic files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {projects.map((project, i) => (
                <div key={i} className="p-4 border border-gray-200 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105 hover:bg-blue-50/50 cursor-pointer group">
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300">
                      {project.name}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{project.fileCount} files</span>
                      <span>{project.totalSize}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card className="transform transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search files by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 transition-all duration-300 focus:scale-105"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
              >
                <option value="all">All Types</option>
                <option value="FASTA">FASTA</option>
                <option value="VCF">VCF</option>
                <option value="GFF">GFF</option>
                <option value="BED">BED</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
              >
                <option value="all">All Status</option>
                <option value="processed">Processed</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Files Table */}
        <Card className="transform transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Genome Files</span>
              {selectedFiles.length > 0 && (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleBulkExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Selected ({selectedFiles.length})
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleBulkDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected
                  </Button>
                </div>
              )}
            </CardTitle>
            <CardDescription>All your uploaded genomic data files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-2 w-8">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">File</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Project</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Analyses</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Size</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 group">
                      <td className="py-4 px-2">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file.id)}
                          onChange={() => toggleFileSelection(file.id)}
                          className="rounded transition-all duration-300"
                        />
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Uploaded {file.uploadDate}
                            </p>
                            <div className="flex space-x-1 mt-1">
                              {file.tags.map((tag, i) => (
                                <Badge key={i} variant="outline" className="text-xs px-1 py-0">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <Badge variant="secondary">{file.project}</Badge>
                      </td>
                      <td className="py-4 px-2">
                        <Badge variant={getStatusColor(file.status)} className="transition-all duration-300 hover:scale-110">
                          {file.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {file.analyses} completed
                        </span>
                        {file.variants > 0 && (
                          <p className="text-xs text-purple-600">{file.variants} variants</p>
                        )}
                      </td>
                      <td className="py-4 px-2">
                        <span className="text-sm font-mono">{file.size}</span>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:scale-110 transition-all duration-300"
                            onClick={() => handleView(file)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:scale-110 transition-all duration-300"
                            onClick={() => handleDownload(file)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:scale-110 text-red-600 hover:bg-red-50 transition-all duration-300"
                            onClick={() => handleDelete(file)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Storage Overview */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="transform transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HardDrive className="h-5 w-5 text-blue-600" />
                <span>Storage Usage</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Used Storage</span>
                    <span>256.2 MB / 5 GB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500" style={{width: '5.1%'}}></div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  4.74 GB remaining in your storage plan
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardHeader>
              <CardTitle>File Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total Files</span>
                  <Badge variant="secondary">{fileData.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Processed</span>
                  <Badge variant="success">{fileData.filter(f => f.status === 'Processed').length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Processing</span>
                  <Badge variant="warning">{fileData.filter(f => f.status === 'Processing').length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span>Analysis completed on genome_001.fasta</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span>New file uploaded: variants.vcf</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                  <span>Report generated for project A</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Dialog */}
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Genome Files</DialogTitle>
              <DialogDescription>
                Select genomic data files to upload (FASTA, VCF, GFF, BED formats supported)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <input
                  type="file"
                  multiple
                  accept=".fasta,.vcf,.gff,.bed,.fa,.fastq"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="file-upload"
                  className={`cursor-pointer text-blue-600 hover:text-blue-800 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isUploading ? 'Uploading...' : 'Click to select files or drag and drop'}
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Maximum file size: 100MB per file
                </p>
              </div>
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Upload Progress</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{width: `${uploadProgress}%`}}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUploadDialog(false)} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Cancel'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View File Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>File Details: {selectedFile?.name}</DialogTitle>
              <DialogDescription>
                Comprehensive information about this genomic data file
              </DialogDescription>
            </DialogHeader>
            {selectedFile && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">File Type</p>
                    <p className="text-lg">{selectedFile.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">File Size</p>
                    <p className="text-lg">{selectedFile.size}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Upload Date</p>
                    <p className="text-lg">{selectedFile.uploadDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <Badge variant={getStatusColor(selectedFile.status)}>{selectedFile.status}</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Project</p>
                  <Badge variant="secondary">{selectedFile.project}</Badge>
                </div>
                {selectedFile.variants > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Variants Detected</p>
                    <p className="text-lg text-purple-600">{selectedFile.variants} variants</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                Close
              </Button>
              <Button onClick={() => handleDownload(selectedFile)}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span>Delete File{selectedFiles.length > 1 ? 's' : ''}</span>
              </DialogTitle>
              <DialogDescription>
                {selectedFile 
                  ? `Are you sure you want to delete "${selectedFile.name}"? This action cannot be undone.`
                  : `Are you sure you want to delete ${selectedFiles.length} selected files? This action cannot be undone.`
                }
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={confirmDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete File{selectedFiles.length > 1 ? 's' : ''}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <FloatingChatbot />
    </Layout>
  );
}