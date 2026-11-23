import React from 'react';
import './Tabs.css';

export default function Tabs({
  tabs = [],
  activeTab,
  onChange,
  className = '',
}) {
  return (
    <div className={`cf-ui-tabs ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            className={`cf-ui-tab-btn ${isActive ? 'is-active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {Icon && <Icon size={15} />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="cf-ui-tab-count">{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
