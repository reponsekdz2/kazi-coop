
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';
// FIX: Import mock data from the new constants file.
import { ACTIVITY_LOG, USERS, cooperativeFinancialsData, JOBS, COOPERATIVES } from '../constants';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell, ComposedChart, Area, Line 
} from 'recharts';
import { UserPlusIcon, BriefcaseIcon, BanknotesIcon, ArrowTrendingUpIcon, SparklesIcon, UserGroupIcon } from '@heroicons/react/24/outline';
// Correct import for GoogleGenAI
import { GoogleGenAI } from '@google/genai';
import { useToast } from '../contexts/ToastContext';
import RingProgress from '../components/layout/RingProgress';
import { Job } from '../types';

const userGrowthData = [
  { name: 'Jan', users: 40, jobs: 24 },
  { name: 'Feb', users: 30, jobs: 13 },
  { name: 'Mar', users: 20, jobs: 98 },
  { name: 'Apr', users: 27, jobs: 39 },
  { name: 'May', users: 18, jobs: 48 },
  { name: 'Jun', users: 23, jobs: 38 },
  { name: 'Jul', users: 34, jobs: 43 },
];

const memberRoleData = USERS.reduce((acc, user) => {
    const role = user.role;
    const existing = acc.find(item => item.name === role);
    if(existing) {
        existing.value += 1;
    } else {
        acc.push({ name: role, value: 1 });
    }
    return acc;
}, [] as {name: string, value: number}[]);

const jobTypeData = JOBS.reduce((acc, job) => {
    const type = job.type;
    const existing = acc.find(item => item.name === type);
    if(existing) {
        existing.value += 1;
    } else {
        acc.push({ name: type, value: 1 });
    }
    return acc;
}, [] as {name: string, value: number}[]);


const COLORS = ['#005A9C', '#10B981', '#5E96C3'];

const AnalyticsPage: React.FC = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [summary, setSummary] = useState('');
    const { addToast } = useToast();

    const handleGenerateSummary = async () => {
        setIsGenerating(true);
        setSummary('');
        try {
            // Correct initialization of GoogleGenAI
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
            
            const prompt = `
You are a senior business analyst for KaziCoop, a platform in Rwanda that connects job seekers with employers and facilitates community savings cooperatives (Ikimina).

Analyze the following platform metrics and generate a concise, insightful summary (2-3 paragraphs) for a management meeting. Highlight key trends, potential strengths, and areas for concern. The summary should be easy to understand for non-technical stakeholders. Format the output as markdown, starting with a clear headline.

**Platform Data Snapshot:**

**Key Metrics:**
- Total Users: ${USERS.length}
- Active Jobs: ${JOBS.filter(j => j.status === 'Open').length}
- Total Cooperatives: ${COOPERATIVES.length}
- Total Cooperative Savings: RWF ${cooperativeFinancialsData.reduce((acc, item) => acc + item["Total Savings"], 0)}M
- Monthly User Growth: 5.2%

**Cooperative Financials (YTD, in Millions RWF):**
${JSON.stringify(cooperativeFinancialsData, null, 2)}

**User Growth vs. Job Postings (Monthly):**
${JSON.stringify(userGrowthData, null, 2)}

**Member Demographics:**
${JSON.stringify(memberRoleData, null, 2)}

**Recent Platform Activity:**
${ACTIVITY_LOG.slice(0, 4).map(log => `- ${log.description}`).join('\n')}
`;
            
            // FIX: Correct API call to generateContent using gemini-2.5-flash model
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            // FIX: Correct way to extract text from response
            setSummary(response.text);

        } catch (error) {
            console.error("Error generating AI summary:", error);
            addToast("Failed to generate AI summary. Please try again.", "error");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const totalLoans = COOPERATIVES.flatMap(c => c.loans).length;
    const approvedLoans = COOPERATIVES.flatMap(c => c.loans).filter(l => l.status === 'Approved').length;
    const loanApprovalRate = totalLoans > 0 ? Math.round((approvedLoans / totalLoans) * 100) : 0;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-dark dark:text-light">Platform Intelligence Dashboard</h1>
        <Button onClick={handleGenerateSummary} disabled={isGenerating}>
            <SparklesIcon className={`h-5 w-5 mr-2 inline ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Analyzing Data...' : 'Generate AI Summary'}
        </Button>
      </div>

      {(isGenerating || summary) && (
          <Card title="AI-Powered Analysis" className="mb-6">
              {isGenerating ? (
                   <div className="flex items-center justify-center py-8">
                       <div className="animate-pulse flex flex-col items-center space-y-2">
                           <SparklesIcon className="h-8 w-8 text-primary"/>
                           <p className="text-gray-500">Generating insights from platform data...</p>
                       </div>
                   </div>
              ) : (
                <div className="prose prose-blue dark:prose-invert max-w-none">
                    {summary.split('\n').map((paragraph, index) => {
                         if (paragraph.startsWith('#')) {
                            const level = paragraph.match(/^#+/)?.[0].length || 1;
                            const text = paragraph.replace(/^#+\s*/, '');
                            return React.createElement(`h${level > 6 ? 6 : level}`, { key: index, className: 'font-bold' }, text);
                         }
                         return <p key={index}>{paragraph}</p>;
                    })}
                </div>
              )}
          </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard icon={UserPlusIcon} title="Total Users" value={USERS.length} trend={5} data={[15,18,20,22,25,26]}/>
        <StatCard icon={BriefcaseIcon} title="Active Jobs" value={JOBS.filter(j => j.status === 'Open').length} trend={-1} data={[5,5,4,3,4,4]}/>
        <StatCard icon={UserGroupIcon} title="Total Cooperatives" value={COOPERATIVES.length} trend={3} data={[1,1,2,2,3,3]}/>
        <StatCard icon={BanknotesIcon} title="Total Savings (RWF)" value="78.4M" trend={8} data={[40.1, 45.3, 52.5, 58.8, 65.2, 71.9, 78.4]}/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card title="Cooperative Financial Health (YTD, in Millions RWF)">
                <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={cooperativeFinancialsData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => `RWF ${value}M`} />
                        <Legend />
                        <Area type="monotone" dataKey="Total Savings" fill="#5E96C3" fillOpacity={0.6} stroke="#5E96C3" />
                        <Line type="monotone" dataKey="Loans Disbursed" stroke="#10B981" strokeWidth={2} />
                    </ComposedChart>
                </ResponsiveContainer>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Job Category Distribution">
                     <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={jobTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                {jobTypeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
                 <Card title="Cooperative Loan Approval Rate" className="flex flex-col items-center justify-center">
                    <RingProgress percentage={loanApprovalRate} size={150} strokeWidth={12} progressColorClassName="text-accent" />
                    <p className="mt-4 font-semibold text-dark dark:text-light">{approvedLoans} of {totalLoans} loans approved</p>
                 </Card>
            </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
            <Card title="Member Demographics">
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie data={memberRoleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                             {memberRoleData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                         <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Card>
            <Card title="Platform Activity Feed" className="flex-grow flex flex-col">
                <div className="space-y-4 flex-1 h-[420px] overflow-y-auto pr-2">
                    {ACTIVITY_LOG.map(log => (
                        <div key={log.id} className="flex items-start">
                            <div className="bg-light dark:bg-gray-700/50 p-2 rounded-full mr-3 mt-1">
                                {log.type === 'NEW_MEMBER' && <UserPlusIcon className="h-5 w-5 text-primary"/>}
                                {log.type === 'NEW_JOB' && <BriefcaseIcon className="h-5 w-5 text-primary"/>}
                                {log.type === 'SAVINGS_GOAL' && <ArrowTrendingUpIcon className="h-5 w-5 text-accent"/>}
                                {log.type === 'LARGE_DEPOSIT' && <BanknotesIcon className="h-5 w-5 text-green-500"/>}
                            </div>
                            <div>
                                <p className="text-sm text-dark dark:text-light">{log.description}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
