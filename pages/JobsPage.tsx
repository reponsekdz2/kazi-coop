import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, Job } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import RingProgress from '../components/ui/RingProgress';
import { JOBS, APPLICATIONS, USERS } from '../constants';
import { MagnifyingGlassIcon, MapPinIcon, BriefcaseIcon, UserGroupIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';

const SeekerJobsView: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(JOBS[0]);
  const { t } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('All');
  const [jobType, setJobType] = useState('All');
  const [minSalary, setMinSalary] = useState('');

  const locations = ['All', ...new Set(JOBS.map(job => job.location))];
  const jobTypes = ['All', ...new Set(JOBS.map(job => job.type))];

  const filteredJobs = JOBS.filter(job => {
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
              
              <h4 className="font-bold text-dark dark:text-light mb-2">{t('jobs.requiredSkills')}</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                  {selectedJob.skills.map(skill => (
                      <span key={skill} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm dark:bg-gray-700 dark:text-gray-200">{skill}</span>
                  ))}
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

               <Card title={t('jobs.companyInsights')} className="!bg-light !shadow-inner dark:!bg-gray-700/50">
                 <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <BuildingOffice2Icon className="h-8 w-8 mx-auto text-primary mb-1"/>
                        <p className="font-bold text-dark dark:text-light">50-100</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('jobs.employees')}</p>
                    </div>
                     <div>
                        <UserGroupIcon className="h-8 w-8 mx-auto text-primary mb-1"/>
                        <p className="font-bold text-dark dark:text-light">5</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('jobs.kazicoopMembers')}</p>
                    </div>
                     <div>
                        <BriefcaseIcon className="h-8 w-8 mx-auto text-primary mb-1"/>
                        <p className="font-bold text-dark dark:text-light">3 years</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('jobs.avgTenure')}</p>
                    </div>
                 </div>
               </Card>

              <div className="mt-6">
                <Button className="w-full !py-3 !text-base">{t('jobs.applyNow')}</Button>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center dark:bg-dark">
              <p className="text-gray-500 dark:text-gray-400">{t('jobs.selectJob')}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const EmployerJobsView: React.FC = () => {
    const { t } = useAppContext();
    const employerJobs = JOBS; 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    const handleViewApplicants = (job: Job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedJob(null);
    };

    const applicantsForSelectedJob = selectedJob 
        ? APPLICATIONS.filter(app => app.jobId === selectedJob.id)
        : [];
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-3xl font-bold text-dark dark:text-light">{t('jobs.employerTitle')}</h1>
                 <Button>{t('jobs.postNewJob')}</Button>
            </div>
            <Card>
                <div className="space-y-4">
                    {employerJobs.map(job => (
                        <div key={job.id} className="p-4 border dark:border-gray-700 rounded-lg flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-dark dark:text-light">{job.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{job.location} &bull; {job.type}</p>
                            </div>
                            <Button variant="secondary" onClick={() => handleViewApplicants(job)}>
                                <UserGroupIcon className="h-4 w-4 mr-2 inline" />
                                {t('jobs.viewApplicants')} ({APPLICATIONS.filter(a => a.jobId === job.id).length})
                            </Button>
                        </div>
                    ))}
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={`${t('jobs.applicantsFor')} ${selectedJob?.title}`}>
                {applicantsForSelectedJob.length > 0 ? (
                    <div className="space-y-4">
                        {applicantsForSelectedJob.map(app => {
                            const applicant = USERS.find(u => u.id === app.userId);
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
                                    <div className="text-center">
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{t('jobs.matchScore')}</p>
                                        <RingProgress percentage={app.matchScore} size={60} strokeWidth={6} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">{t('jobs.noApplicants')}</p>
                )}
            </Modal>
        </div>
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