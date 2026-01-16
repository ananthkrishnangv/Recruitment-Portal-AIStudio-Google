import React, { createContext, useContext, useState } from 'react';
import { ApplicationFormState, ApplicationStatus, Category } from '../types';
import { useNotifications } from './NotificationContext';

const MOCK_APPLICATIONS: ApplicationFormState[] = [
  {
    applicationNumber: 'CSIR-54321-062024',
    submittedDate: '2024-06-15',
    postId: '1',
    postTitle: 'Scientist "C"',
    status: ApplicationStatus.UNDER_SCRUTINY,
    personalDetails: {
      fullName: 'Dr. Aruna Sharma',
      dob: '1988-05-20',
      gender: 'Female',
      category: Category.GEN,
      fatherName: 'Mr. Sharma',
      mobile: '9876543211',
      aadhaar: '987654321098',
      address: 'A-123, Science Park, New Delhi',
      nationality: 'Indian'
    },
    education: [{id: 'edu1', level: 'PhD', institution: 'IIT Delhi', board: 'IIT Delhi', year: '2015', percentage: '85'}],
    experience: [],
    documents: { photo: null, signature: null, resume: null, casteCertificate: null },
    statementOfPurpose: 'Eager to contribute to national research infrastructure.',
    customValues: {}
  },
  {
    applicationNumber: 'CSIR-98765-062024',
    submittedDate: '2024-06-18',
    postId: '2',
    postTitle: 'Technical Officer',
    status: ApplicationStatus.SUBMITTED,
    personalDetails: {
      fullName: 'Rohan Verma',
      dob: '1992-11-10',
      gender: 'Male',
      category: Category.OBC,
      fatherName: 'Mr. Verma',
      mobile: '9123456789',
      aadhaar: '123456789012',
      address: 'B-45, Tech Hub, Bangalore',
      nationality: 'Indian'
    },
    education: [{id: 'edu1', level: 'B.Tech', institution: 'NIT Trichy', board: 'Anna University', year: '2014', percentage: '92'}],
    experience: [],
    documents: { photo: null, signature: null, resume: null, casteCertificate: null },
    statementOfPurpose: 'Skilled in managing large-scale IT infrastructure.',
    customValues: {}
  }
];

interface ApplicationContextType {
  applications: ApplicationFormState[];
  submitApplication: (app: ApplicationFormState) => void;
  getUserApplications: (aadhaar: string) => ApplicationFormState[];
  updateApplicationStatus: (appId: string, status: ApplicationStatus, remarks?: string) => void;
  bulkUpdateStatus: (appIds: string[], status: ApplicationStatus, remarks?: string) => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<ApplicationFormState[]>(MOCK_APPLICATIONS);
  const { notifyStatusChange } = useNotifications();

  const submitApplication = (app: ApplicationFormState) => {
    setApplications(prev => [...prev, app]);
  };

  const getUserApplications = (aadhaar: string) => {
    return applications.filter(app => app.personalDetails.aadhaar === aadhaar);
  };

  const updateApplicationStatus = (appId: string, status: ApplicationStatus, remarks?: string) => {
    setApplications(prev => prev.map(app => {
      if (app.applicationNumber === appId) {
        // Trigger notification if status changes
        if (app.status !== status) {
            // Logic to construct a User object from application details for notification
            const tempUser = {
                id: app.personalDetails.aadhaar,
                name: app.personalDetails.fullName,
                email: 'applicant@example.com', // In real app, this comes from User table
                mobile: app.personalDetails.mobile,
                aadhaar: app.personalDetails.aadhaar,
                role: 'APPLICANT' as any
            };
            notifyStatusChange(tempUser, status, app.postTitle || 'Job Post');
        }
        return { ...app, status, remarks };
      }
      return app;
    }));
  };

  const bulkUpdateStatus = (appIds: string[], status: ApplicationStatus, remarks?: string) => {
      setApplications(prev => prev.map(app => {
          if (app.applicationNumber && appIds.includes(app.applicationNumber)) {
             return { ...app, status, remarks };
          }
          return app;
      }));
  };

  return (
    <ApplicationContext.Provider value={{ applications, submitApplication, getUserApplications, updateApplicationStatus, bulkUpdateStatus }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplications must be used within a ApplicationProvider');
  }
  return context;
};