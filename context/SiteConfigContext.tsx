import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SiteConfig {
  header: {
    ministryText: string;
    organizationName: string;
    organizationSubtitle: string;
    parentOrganization: string;
  };
  footer: {
    aboutText: string;
    address: string;
    copyrightText: string;
    contactEmail: string;
  };
}

const DEFAULT_CONFIG: SiteConfig = {
  header: {
    ministryText: "MINISTRY OF SCIENCE & TECHNOLOGY",
    organizationName: "CSIR-SERC",
    organizationSubtitle: "Structural Engineering Research Centre",
    parentOrganization: "Council of Scientific & Industrial Research"
  },
  footer: {
    aboutText: "Council of Scientific & Industrial Research - Structural Engineering Research Centre, Chennai. Pioneering advanced structural engineering solutions for the nation.",
    address: "CSIR Road, Taramani,\nChennai - 600 113\nIndia.",
    copyrightText: "© 2024 CSIR-SERC. All Rights Reserved. | Compliance to GIGW 3.0 | Noto Sans Font",
    contactEmail: "recruit@serc.res.in"
  }
};

interface SiteConfigContextType {
  config: SiteConfig;
  updateConfig: (newConfig: SiteConfig) => void;
  resetConfig: () => void;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    const saved = localStorage.getItem('siteConfig');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse site config", e);
      }
    }
  }, []);

  const updateConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig);
    localStorage.setItem('siteConfig', JSON.stringify(newConfig));
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
    localStorage.removeItem('siteConfig');
  };

  return (
    <SiteConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
};