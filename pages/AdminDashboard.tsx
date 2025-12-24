import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, FileText, CheckCircle, Clock, Settings, Mail, Save, LayoutTemplate } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

const data = [
  { name: 'Scientist', applications: 120, vacancies: 4 },
  { name: 'Tech Officer', applications: 85, vacancies: 2 },
  { name: 'Technician', applications: 450, vacancies: 15 },
  { name: 'Tech Asst', applications: 230, vacancies: 10 },
];

const categoryData = [
  { name: 'General', value: 400 },
  { name: 'OBC', value: 300 },
  { name: 'SC', value: 150 },
  { name: 'ST', value: 50 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        {React.cloneElement(icon as React.ReactElement, { className: `w-6 h-6 ${color.replace('bg-', 'text-')}` })}
      </div>
    </div>
  </div>
);

export const AdminDashboard: React.FC = () => {
  const { config, updateConfig } = useSiteConfig();
  const [localConfig, setLocalConfig] = useState(config);
  const [saveStatus, setSaveStatus] = useState('');

  const handleConfigChange = (section: 'header' | 'footer', field: string, value: string) => {
    setLocalConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const saveConfiguration = () => {
    updateConfig(localConfig);
    setSaveStatus('Saved successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Recruitment Dashboard</h1>
        <div className="flex space-x-2">
            <button className="px-4 py-2 bg-white border rounded shadow-sm text-sm hover:bg-slate-50">Download Report</button>
            <button className="px-4 py-2 bg-csir-blue text-white rounded shadow-sm text-sm hover:bg-blue-800">New Post</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Applications" value="885" icon={<FileText />} color="text-blue-600" />
        <StatCard title="Under Scrutiny" value="124" icon={<Clock />} color="text-yellow-600" />
        <StatCard title="Eligible Candidates" value="450" icon={<CheckCircle />} color="text-green-600" />
        <StatCard title="Interviews Scheduled" value="45" icon={<Users />} color="text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-6 text-slate-700">Applications vs Vacancies</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="#003366" name="Applications" radius={[4, 4, 0, 0]} />
                <Bar dataKey="vacancies" fill="#f59e0b" name="Vacancies" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-6 text-slate-700">Category Distribution</h3>
          <div className="h-80 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Site Configuration Editor */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
           <div className="flex items-center">
              <LayoutTemplate className="text-slate-500 mr-2" size={20}/>
              <h3 className="font-bold text-slate-700">Site Header & Footer Settings</h3>
           </div>
           {saveStatus && <span className="text-green-600 text-sm font-bold animate-pulse">{saveStatus}</span>}
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Header Config */}
           <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Header Configuration</h4>
              <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Ministry Text</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded text-sm focus:border-csir-blue outline-none" 
                      value={localConfig.header.ministryText}
                      onChange={(e) => handleConfigChange('header', 'ministryText', e.target.value)}
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Organization Name (Logo Text)</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded text-sm focus:border-csir-blue outline-none" 
                      value={localConfig.header.organizationName}
                      onChange={(e) => handleConfigChange('header', 'organizationName', e.target.value)}
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Organization Subtitle</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded text-sm focus:border-csir-blue outline-none" 
                      value={localConfig.header.organizationSubtitle}
                      onChange={(e) => handleConfigChange('header', 'organizationSubtitle', e.target.value)}
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Parent Organization</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded text-sm focus:border-csir-blue outline-none" 
                      value={localConfig.header.parentOrganization}
                      onChange={(e) => handleConfigChange('header', 'parentOrganization', e.target.value)}
                    />
                 </div>
              </div>
           </div>

           {/* Footer Config */}
           <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Footer Configuration</h4>
              <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">About Text</label>
                    <textarea 
                      className="w-full p-2 border rounded text-sm focus:border-csir-blue outline-none" 
                      rows={3}
                      value={localConfig.footer.aboutText}
                      onChange={(e) => handleConfigChange('footer', 'aboutText', e.target.value)}
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Address</label>
                    <textarea 
                      className="w-full p-2 border rounded text-sm focus:border-csir-blue outline-none" 
                      rows={3}
                      value={localConfig.footer.address}
                      onChange={(e) => handleConfigChange('footer', 'address', e.target.value)}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Contact Email</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded text-sm focus:border-csir-blue outline-none" 
                        value={localConfig.footer.contactEmail}
                        onChange={(e) => handleConfigChange('footer', 'contactEmail', e.target.value)}
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Copyright Text</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded text-sm focus:border-csir-blue outline-none" 
                        value={localConfig.footer.copyrightText}
                        onChange={(e) => handleConfigChange('footer', 'copyrightText', e.target.value)}
                      />
                   </div>
                 </div>
              </div>
           </div>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t flex justify-end">
           <button onClick={saveConfiguration} className="px-6 py-2 bg-csir-blue text-white rounded shadow hover:bg-blue-900 transition-colors flex items-center">
             <Save size={16} className="mr-2" /> Save Site Settings
           </button>
        </div>
      </div>

      {/* SMTP Configuration Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center">
          <Settings className="text-slate-500 mr-2" size={20}/>
          <h3 className="font-bold text-slate-700">System Configuration</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-slate-800 mb-4 flex items-center"><Mail size={16} className="mr-2"/> SMTP Mail Settings</h4>
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-600">SMTP Host</label>
                  <input type="text" className="mt-1 w-full p-2 border rounded text-sm" defaultValue="smtp.office365.com" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-600">Port</label>
                    <input type="text" className="mt-1 w-full p-2 border rounded text-sm" defaultValue="587" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-600">Encryption</label>
                    <select className="mt-1 w-full p-2 border rounded text-sm">
                      <option>TLS</option>
                      <option>SSL</option>
                    </select>
                 </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-600">Username</label>
                  <input type="text" className="mt-1 w-full p-2 border rounded text-sm" defaultValue="notifications@serc.res.in" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-600">Password</label>
                  <input type="password" className="mt-1 w-full p-2 border rounded text-sm" defaultValue="********" />
               </div>
               <button className="px-4 py-2 bg-slate-800 text-white rounded text-sm flex items-center hover:bg-slate-700">
                  <Save size={14} className="mr-2" /> Save Configuration
               </button>
            </div>
          </div>
          <div>
             <h4 className="font-semibold text-slate-800 mb-4">Telegram Bot Integration</h4>
             <div className="p-4 bg-slate-50 rounded border border-slate-200">
                <p className="text-sm text-slate-600 mb-4">Configure the bot to send real-time notifications to administrators.</p>
                <div>
                  <label className="block text-sm font-medium text-slate-600">Bot Token</label>
                  <input type="password" className="mt-1 w-full p-2 border rounded text-sm mb-4" defaultValue="****************" />
                </div>
                 <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm flex items-center hover:bg-blue-700">
                  Test Connection
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};