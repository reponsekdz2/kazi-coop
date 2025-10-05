import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, Job, SubmittedDocument, RequiredDocument, UserDocument } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import RingProgress from '../components/ui/RingProgress';
import { MagnifyingGlassIcon, MapPinIcon, BriefcaseIcon, UserGroupIcon, BuildingOffice2Icon, PlusIcon, DocumentTextIcon, DocumentCheckIcon, PaperClipIcon, AcademicCapIcon, StarIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useAppContext } from '../contexts/AppContext';
import { useJobs } from '../contexts/JobContext';
import { useApplications } from '../contexts/ApplicationContext';

const SeekerJobsView: React.FC = () => {
  const { jobs } = useJobs();
  const [selectedJob, setSelectedJob] = useState<Job | null>(jobs.length > 0 ? jobs[0] : null);
  const { t } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('All');
  const [jobType, setJobType] = useState('All');
  const [minSalary, setMinSalary] = useState('');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const locations = ['All', ...new Set(jobs.map(job => job.location))];
  const jobTypes = ['All', ...new Set(jobs.map(job => job.type))];

  const filteredJobs = jobs.filter(job => {
      const searchMatch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const locationMatch = location === 'All' || job.location === location;
      const typeMatch = jobType === 'All' || job.type === jobType;
      const salaryMatch = !minSalary || job.salaryMin >= Number(minSalary);

      return searchMatch && locationMatch && typeMatch && salaryMatch;
  });
  
  const marketAvg = (selectedJob?.salaryMin || 0 + (selectedJob?.salaryMax || 0)) * 0.9; // Mock average

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark dark:text-light mb-6">{t('jobs.title')}</h1>
      <Card className="mb-6 dark:bg-dark">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="md:col-span-3 lg:col-span-2">
                <label htmlFor="search-term" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('jobs.searchKeyword')}</label>
                <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
                    <input 
                        id="search-term"
                        type="text" 
                        placeholder="Title, company, or skill..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('jobs.location')}</label>
                <select id="location-filter" value={location} onChange={e => setLocation(e.target.value)} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('jobs.jobType')}</label>
                <select id="type-filter" value={jobType} onChange={e => setJobType(e.target.value)} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {jobTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
            </div>
            <div className="md:col-span-3 lg:col-span-4">
                <label htmlFor="salary-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('jobs.minSalary')}</label>
                <input 
                    id="salary-filter"
                    type="number" 
                    placeholder="e.g., 1000000"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                    className="w-full md:w-1/3 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-[calc(100vh-350px)] overflow-y-auto pr-2">
          <div className="space-y-4">
            {filteredJobs.length > 0 ? filteredJobs.map(job => (
              <div key={job.id} onClick={() => setSelectedJob(job)} className={`p-4 rounded-lg cursor-pointer border-2 ${selectedJob?.id === job.id ? 'border-primary bg-blue-50 dark:bg-blue-900/20' : 'bg-white border-transparent hover:border-gray-200 dark:bg-dark dark:hover:border-gray-700'}`}>
                <h3 className="font-bold text-dark dark:text-light">{job.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{job.location} &bull; {job.type}</p>
              </div>
            )) : <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t('jobs.noJobsFound')}</p>}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedJob ? (
            <Card className="h-full overflow-y-auto">
              <h2 className="text-2xl font-bold text-dark dark:text-light">{selectedJob.title}</h2>
              <p className="text-lg text-primary font-semibold mb-4">{selectedJob.company}</p>
              
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm space-x-4 mb-6">
                  <span className="flex items-center"><MapPinIcon className="h-4 w-4 mr-1"/> {selectedJob.location}</span>
                  <span className="flex items-center"><BriefcaseIcon className="h-4 w-4 mr-1"/> {selectedJob.type}</span>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-6">{selectedJob.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <h4 className="font-bold text-dark dark:text-light mb-2">{t('jobs.requiredSkills')}</h4>
                    <div className="flex flex-wrap gap-2">
                        {selectedJob.skills.map(skill => (
                            <span key={skill} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm dark:bg-gray-700 dark:text-gray-200">{skill}</span>
                        ))}
                    </div>
                </div>
                <div>
                     <h4 className="font-bold text-dark dark:text-light mb-2">{t('jobs.requirements')}</h4>
                     <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <li className="flex items-center gap-2"><AcademicCapIcon className="h-4 w-4 text-primary"/>{selectedJob.requiredEducation}</li>
                        <li className="flex items-center gap-2"><StarIcon className="h-4 w-4 text-primary"/>{selectedJob.requiredExperience}+ years experience</li>
                     </ul>
                </div>
              </div>

              <Card title={t('jobs.salaryBenchmark')} className="!bg-light !shadow-inner mb-6 dark:!bg-gray-700/50">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('jobs.offeredSalary')}</p>
                        <p className="font-bold text-2xl text-dark dark:text-light">{selectedJob.salary}</p>
                    </div>
                    <div className="w-1/2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-1">{t('jobs.marketComparison')}</p>
                        <div className="relative h-6 bg-gray-200 dark:bg-gray-600 rounded-full">
                            <div className="absolute h-6 bg-gradient-to-r from-green-300 to-green-500 rounded-full" style={{ width: `90%` }} title={`Market Average: RWF ${marketAvg.toLocaleString()}`}></div>
                            <div className="absolute h-6 bg-gradient-to-r from-blue-400 to-primary rounded-full" style={{ width: `100%` }} title={`This Job's Range: ${selectedJob.salary}`}></div>
                        </div>
                    </div>
                </div>
              </Card>

              <div className="mt-6">
                <Button onClick={() => setIsApplyModalOpen(true)} className="w-full !py-3 !text-base">{t('jobs.applyNow')}</Button>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center dark:bg-dark">
              <p className="text-gray-500 dark:text-gray-400">{t('jobs.selectJob')}</p>
            </Card>
          )}
        </div>
      </div>
      {selectedJob && <ApplyModal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} job={selectedJob} />}
    </div>
  );
};

const EmployerJobsView: React.FC = () => {
    const { t } = useAppContext();
    const { jobs } = useJobs();
    const { applications, users } = useApplications();
    const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
    const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isViewDocsModalOpen, setIsViewDocsModalOpen] = useState(false);
    const [docsToView, setDocsToView] = useState<SubmittedDocument[]>([]);

    const handleViewApplicants = (job: Job) => {
        setSelectedJob(job);
        setIsApplicantsModalOpen(true);
    };

    const applicantsForSelectedJob = selectedJob 
        ? applications.filter(app => app.jobId === selectedJob.id)
        : [];
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-3xl font-bold text-dark dark:text-light">{t('jobs.employerTitle')}</h1>
                 <Button onClick={() => setIsPostJobModalOpen(true)}><PlusIcon className="h-4 w-4 mr-2 inline" />{t('jobs.postNewJob')}</Button>
            </div>
            <Card>
                <div className="space-y-4">
                    {jobs.map(job => (
                        <div key={job.id} className="p-4 border dark:border-gray-700 rounded-lg flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-dark dark:text-light">{job.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{job.location} &bull; {job.type}</p>
                            </div>
                            <Button variant="secondary" onClick={() => handleViewApplicants(job)}>
                                <UserGroupIcon className="h-4 w-4 mr-2 inline" />
                                {t('jobs.viewApplicants')} ({applications.filter(a => a.jobId === job.id).length})
                            </Button>
                        </div>
                    ))}
                </div>
            </Card>

            <Modal isOpen={isApplicantsModalOpen} onClose={() => setIsApplicantsModalOpen(false)} title={`${t('jobs.applicantsFor')} ${selectedJob?.title}`}>
                {applicantsForSelectedJob.length > 0 ? (
                    <div className="space-y-4">
                        {applicantsForSelectedJob.map(app => {
                            const applicant = users.find(u => u.id === app.userId);
                            if (!applicant) return null;
                            return (
                                <div key={app.id} className="flex items-center justify-between p-3 rounded-md bg-light hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
                                    <div className="flex items-center">
                                        <img src={applicant.avatarUrl} alt={applicant.name} className="h-12 w-12 rounded-full mr-4" />
                                        <div>
                                            <p className="font-bold text-dark dark:text-light">{applicant.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('jobs.status')}: {app.status}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {app.submittedDocuments.length > 0 && (
                                            <Button variant="secondary" onClick={() => { setDocsToView(app.submittedDocuments); setIsViewDocsModalOpen(true); }}>{t('jobs.viewDocuments')}</Button>
                                        )}
                                        <div className="text-center">
                                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{t('jobs.matchScore')}</p>
                                            <RingProgress percentage={app.matchScore} size={60} strokeWidth={6} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">{t('jobs.noApplicants')}</p>
                )}
            </Modal>
            
            <PostJobModal isOpen={isPostJobModalOpen} onClose={() => setIsPostJobModalOpen(false)} />

            <Modal isOpen={isViewDocsModalOpen} onClose={() => setIsViewDocsModalOpen(false)} title={t('jobs.submittedDocs')}>
                <ul className="space-y-2">
                    {docsToView.map(doc => (
                        <li key={doc.name} className="flex items-center gap-2 p-2 bg-light dark:bg-gray-700 rounded">
                            <DocumentTextIcon className="h-5 w-5 text-primary" />
                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{doc.name}</a>
                        </li>
                    ))}
                </ul>
            </Modal>

        </div>
    );
};

const ApplyModal: React.FC<{isOpen: boolean, onClose: () => void, job: Job}> = ({isOpen, onClose, job}) => {
    const { t } = useAppContext();
    const { user } = useAuth();
    const { applyForJob } = useApplications();
    const [selectedDocs, setSelectedDocs] = useState<UserDocument[]>([]);

    const toggleDocSelection = (doc: UserDocument) => {
        setSelectedDocs(prev => 
            prev.find(d => d.id === doc.id) 
                ? prev.filter(d => d.id !== doc.id)
                : [...prev, doc]
        );
    };

    const allRequiredDocsSelected = job.requiredDocuments
        .filter(rd => rd.required)
        .every(rd => selectedDocs.some(sd => sd.name.includes(rd.name.split(' ')[0])));

    const handleSubmit = () => {
        const submittedDocs: SubmittedDocument[] = selectedDocs.map(d => ({ name: d.name, fileUrl: d.fileUrl }));
        applyForJob(job.id, submittedDocs);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${t('jobs.applyFor')} ${job.title}`}>
            <div>
                <h3 className="font-bold text-lg mb-4">{t('jobs.applicationChecklist')}</h3>
                <div className="space-y-3 mb-6">
                    {job.requiredDocuments.map(doc => (
                        <div key={doc.name}>
                            <p className="font-semibold text-dark dark:text-light">{doc.name} {doc.required && <span className="text-red-500">*</span>}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('jobs.attachDocPrompt')}</p>
                            <div className="mt-2 space-y-2">
                                {user?.documents?.filter(ud => ud.name.includes(doc.name.split(' ')[0])).map(userDoc => (
                                    <label key={userDoc.id} className="flex items-center gap-3 p-3 bg-light dark:bg-gray-700 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
                                        <input type="checkbox" className="h-4 w-4 rounded text-primary focus:ring-primary" checked={selectedDocs.some(d => d.id === userDoc.id)} onChange={() => toggleDocSelection(userDoc)} />
                                        <PaperClipIcon className="h-5 w-5 text-gray-500" />
                                        <span className="text-dark dark:text-light">{userDoc.name}</span>
                                    </label>
                                ))}
                                {user?.documents?.filter(ud => ud.name.includes(doc.name.split(' ')[0])).length === 0 && (
                                    <p className="text-xs text-red-500">{t('jobs.noDocFound').replace('{docName}', doc.name)}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="flex justify-end gap-2 pt-4 border-t dark:border-gray-700">
                    <Button type="button" variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
                    <Button type="button" onClick={handleSubmit} disabled={!allRequiredDocsSelected}>
                        <DocumentCheckIcon className="h-5 w-5 mr-2 inline" />
                        {t('jobs.submitApplication')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

const PostJobModal: React.FC<{isOpen: boolean, onClose: () => void}> = ({isOpen, onClose}) => {
    const { t } = useAppContext();
    const { addJob } = useJobs();
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('Kigali, Rwanda');
    const [type, setType] = useState('Full-time');
    const [salaryMin, setSalaryMin] = useState('');
    const [salaryMax, setSalaryMax] = useState('');
    const [description, setDescription] = useState('');
    const [requiredEducation, setRequiredEducation] = useState('');
    const [requiredExperience, setRequiredExperience] = useState('');
    const [requiredDocs, setRequiredDocs] = useState<RequiredDocument[]>([{ name: 'CV', required: true }]);

    const handleAddDoc = () => setRequiredDocs(prev => [...prev, {name: '', required: false}]);
    const handleDocChange = (index: number, field: 'name' | 'required', value: string | boolean) => {
        const newDocs = [...requiredDocs];
        // @ts-ignore
        newDocs[index][field] = value;
        setRequiredDocs(newDocs);
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addJob({
            title, location, type, description,
            salaryMin: Number(salaryMin),
            salaryMax: Number(salaryMax),
            requiredEducation,
            requiredExperience: Number(requiredExperience),
            requiredDocuments: requiredDocs.filter(d => d.name),
            skills: ['New Skill'], // Dummy data
            salary: `RWF ${Number(salaryMin)/1000000}M - ${Number(salaryMax)/1000000}M`,
            company: 'My Company', // From user context in real app
        });
        onClose();
    };
    
    const commonInputStyles = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white";

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('jobs.postNewJob')}>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div>
                    <label className="block text-sm font-medium">{t('jobs.jobTitle')}</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className={commonInputStyles} required />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium">{t('jobs.location')}</label>
                        <input type="text" value={location} onChange={e => setLocation(e.target.value)} className={commonInputStyles} required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">{t('jobs.jobType')}</label>
                        <select value={type} onChange={e => setType(e.target.value)} className={commonInputStyles}><option>Full-time</option><option>Part-time</option><option>Contract</option></select>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium">{t('jobs.salaryMin')}</label>
                        <input type="number" value={salaryMin} onChange={e => setSalaryMin(e.target.value)} className={commonInputStyles} required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">{t('jobs.salaryMax')}</label>
                        <input type="number" value={salaryMax} onChange={e => setSalaryMax(e.target.value)} className={commonInputStyles} required />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium">{t('jobs.jobDescription')}</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} className={commonInputStyles} rows={4} required />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium">{t('jobs.educationReq')}</label>
                        <input type="text" value={requiredEducation} onChange={e => setRequiredEducation(e.target.value)} className={commonInputStyles} required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">{t('jobs.experienceReq')}</label>
                        <input type="number" value={requiredExperience} onChange={e => setRequiredExperience(e.target.value)} className={commonInputStyles} required />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">{t('jobs.requiredDocuments')}</label>
                    <div className="space-y-2">
                        {requiredDocs.map((doc, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input type="text" placeholder="Document name, e.g. Portfolio" value={doc.name} onChange={e => handleDocChange(index, 'name', e.target.value)} className={`${commonInputStyles} flex-grow`} />
                                <label className="flex items-center gap-1 text-sm"><input type="checkbox" checked={doc.required} onChange={e => handleDocChange(index, 'required', e.target.checked)} /> {t('jobs.required')}</label>
                            </div>
                        ))}
                    </div>
                    <Button type="button" variant="secondary" size="sm" onClick={handleAddDoc} className="mt-2">{t('jobs.addDocument')}</Button>
                 </div>
                 <div className="flex justify-end gap-2 pt-4 border-t dark:border-gray-700">
                    <Button type="button" variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
                    <Button type="submit">{t('jobs.postJob')}</Button>
                </div>
            </form>
        </Modal>
    );
};


const JobsPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      {user.role === UserRole.SEEKER && <SeekerJobsView />}
      {user.role === UserRole.EMPLOYER && <EmployerJobsView />}
    </>
  );
};

export default JobsPage;