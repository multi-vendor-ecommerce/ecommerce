// components/TabBar.jsx
import React from "react";
import Button from "./Button";

/**
 * Generic TabBar Component
 * @param {Array} tabs - Array of tab objects: [{ key: "KEY", label: "Label" }]
 * @param {string} activeTab - Key of currently active tab
 * @param {function} onChange - Callback when a tab is clicked, receives tab.key
 * @param {string} className - Optional extra class for container
 */
const TabBar = ({ tabs = [], activeTab, onChange, className = "" }) => {
  return (
    <div className={`flex gap-2 md:gap-4 flex-wrap ${className}`}>
      {tabs.map(tab => (
        <Button
          key={tab.key}
          text={tab.label}
          onClick={() => onChange(tab.key)}
          active={activeTab === tab.key}
          className="py-2"
        />     
      ))}
    </div>
  );
};

export default TabBar;