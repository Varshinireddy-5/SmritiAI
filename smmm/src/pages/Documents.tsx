import { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import {
  FileText,
  Upload,
  Scan,
  Download,
  Trash2,
  Eye,
  Search,
  Filter,
  CreditCard,
  File,
  FileCheck,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner@2.0.3';
import { localStore, Document } from '../utils/localStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

export function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [newDoc, setNewDoc] = useState({
    name: '',
    type: 'other' as const,
    extractedText: '',
  });

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = () => {
    const allDocs = localStore.getDocuments();
    setDocuments(allDocs);
  };

  const addDocument = () => {
    if (!newDoc.name) {
      toast.error('Please enter document name');
      return;
    }

    localStore.addDocument({
      userId: 'demo_user',
      name: newDoc.name,
      type: newDoc.type,
      extractedText: newDoc.extractedText,
    });

    toast.success('Document added successfully');
    setShowAddDialog(false);
    setNewDoc({
      name: '',
      type: 'other',
      extractedText: '',
    });
    loadDocuments();
  };

  const deleteDocument = (id: string) => {
    localStore.deleteDocument(id);
    toast.success('Document deleted');
    loadDocuments();
  };

  const handleScan = () => {
    toast.info('Scanning document...');
    setTimeout(() => {
      const mockText = 'Government of India\\nAadhaar Card\\nName: John Doe\\nNumber: XXXX XXXX 1234\\nAddress: 123 Main Street, City';
      localStore.addDocument({
        userId: 'demo_user',
        name: 'Scanned Aadhaar Card',
        type: 'aadhaar',
        extractedText: mockText,
      });
      toast.success('Document scanned and OCR processed!');
      loadDocuments();
    }, 2000);
  };

  const viewDocument = (doc: Document) => {
    setSelectedDoc(doc);
    setShowViewDialog(true);
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesFilter = filter === 'all' || doc.type === filter;
    const matchesSearch = searchQuery === '' || 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.extractedText?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getDocIcon = (type: string) => {
    switch (type) {
      case 'aadhaar':
      case 'pan':
      case 'ration':
        return CreditCard;
      case 'medical':
      case 'legal':
        return FileCheck;
      default:
        return File;
    }
  };

  const docTypes = ['all', 'aadhaar', 'pan', 'ration', 'medical', 'financial', 'legal', 'other'];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Documents</h1>
        <p className="text-[#b8b8c8]">Scan, organize, and search your important documents</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={handleScan}
          className="py-6 bg-[#87ceeb] text-[#0a1628] hover:bg-[#a0d8f5]"
          style={{ boxShadow: '0 0 20px rgba(135,206,235,0.4)' }}
        >
          <Scan className="w-5 h-5 mr-2" />
          Scan Document (OCR)
        </Button>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="py-6 bg-[#87ceeb] text-[#0a1628] hover:bg-[#a0d8f5]"
          style={{ boxShadow: '0 0 20px rgba(135,206,235,0.4)' }}
        >
          <Upload className="w-5 h-5 mr-2" />
          Add Document
        </Button>
        <Button
          onClick={() => toast.info('Exporting all documents...')}
          className="py-6 bg-[#87ceeb] text-[#0a1628] hover:bg-[#a0d8f5]"
          style={{ boxShadow: '0 0 20px rgba(135,206,235,0.4)' }}
        >
          <Download className="w-5 h-5 mr-2" />
          Export All
        </Button>
      </div>

      {/* Search */}
      <GlassCard className="p-4" neonColor="purple">
        <div className="flex items-center gap-3 mb-3">
          <Search className="w-5 h-5 text-[#d4a5ff]" />
          <h3 className="text-lg font-semibold text-white">Search Documents</h3>
        </div>
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or content"
          className="w-full"
        />
      </GlassCard>

      {/* Filters */}
      <GlassCard className="p-4" neonColor="purple">
        <div className="flex items-center gap-3 mb-3">
          <Filter className="w-5 h-5 text-[#d4a5ff]" />
          <h3 className="text-lg font-semibold text-white">Filter by Type</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {docTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg transition-all capitalize ${
                filter === type
                  ? 'bg-[rgba(135,206,235,0.2)] border border-[#87ceeb]'
                  : 'bg-[rgba(30,50,80,0.5)] border border-transparent hover:border-[rgba(135,206,235,0.3)]'
              }`}
              style={filter === type ? { boxShadow: '0 0 15px rgba(135,206,235,0.4)' } : {}}
            >
              <span className="text-white text-sm">{type}</span>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Documents Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Your Documents ({filteredDocs.length})</h2>
        {filteredDocs.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <FileText className="w-12 h-12 text-[#b8b8c8] mx-auto mb-3" />
            <p className="text-white mb-2">No documents found</p>
            <p className="text-[#b8b8c8] text-sm">Start by scanning or adding your first document</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs.map((doc) => {
              const Icon = getDocIcon(doc.type);
              return (
                <GlassCard key={doc.id} className="p-6" neonColor="cyan">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 rounded-lg bg-[rgba(135,206,235,0.1)]">
                        <Icon className="w-6 h-6 text-[#87ceeb]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-1">{doc.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-[#b8b8c8] mb-2">
                          <span className="px-2 py-1 rounded bg-[rgba(135,206,235,0.1)] text-[#87ceeb] text-xs capitalize">
                            {doc.type}
                          </span>
                          <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                        </div>
                        {doc.extractedText && (
                          <p className="text-sm text-[#b8b8c8] line-clamp-2">
                            {doc.extractedText}
                          </p>
                        )}
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => viewDocument(doc)}
                            className="text-[#87ceeb] hover:bg-[rgba(135,206,235,0.1)]"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toast.success('Document downloaded')}
                            className="text-[#87ceeb] hover:bg-[rgba(135,206,235,0.1)]"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteDocument(doc.id)}
                      className="text-[#ff6b9d] hover:bg-[rgba(255,107,157,0.1)]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Document Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-[rgba(15,30,50,0.95)] border border-[rgba(135,206,235,0.3)] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Add Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white mb-2 block">Document Name</label>
              <Input
                value={newDoc.name}
                onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                placeholder="e.g., Passport Copy"
                className="bg-[rgba(30,50,80,0.8)] border-[rgba(135,206,235,0.3)] text-white"
              />
            </div>
            <div>
              <label className="text-sm text-white mb-2 block">Document Type</label>
              <select
                value={newDoc.type}
                onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg bg-[rgba(30,50,80,0.8)] border border-[rgba(135,206,235,0.3)] text-white"
              >
                <option value="aadhaar">Aadhaar</option>
                <option value="pan">PAN Card</option>
                <option value="ration">Ration Card</option>
                <option value="medical">Medical</option>
                <option value="financial">Financial</option>
                <option value="legal">Legal</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-white mb-2 block">Extracted Text (Optional)</label>
              <textarea
                value={newDoc.extractedText}
                onChange={(e) => setNewDoc({ ...newDoc, extractedText: e.target.value })}
                placeholder="Enter any text from the document"
                className="w-full px-3 py-2 rounded-lg bg-[rgba(30,50,80,0.8)] border border-[rgba(135,206,235,0.3)] text-white min-h-[100px]"
              />
            </div>
            <Button
              onClick={addDocument}
              className="w-full bg-[#87ceeb] text-[#0a1628] hover:bg-[#a0d8f5]"
              style={{ boxShadow: '0 0 20px rgba(135,206,235,0.4)' }}
            >
              Add Document
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Document Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="bg-[rgba(15,30,50,0.95)] border border-[rgba(135,206,235,0.3)] text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">{selectedDoc?.name}</DialogTitle>
          </DialogHeader>
          {selectedDoc && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#b8b8c8] mb-1">Type</p>
                <p className="text-white capitalize">{selectedDoc.type}</p>
              </div>
              <div>
                <p className="text-sm text-[#b8b8c8] mb-1">Upload Date</p>
                <p className="text-white">{new Date(selectedDoc.uploadDate).toLocaleDateString()}</p>
              </div>
              {selectedDoc.extractedText && (
                <div>
                  <p className="text-sm text-[#b8b8c8] mb-2">Extracted Content</p>
                  <div className="p-4 rounded-lg bg-[rgba(30,50,80,0.5)] border border-[rgba(135,206,235,0.2)]">
                    <p className="text-white whitespace-pre-wrap">{selectedDoc.extractedText}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
