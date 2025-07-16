'use client';

import React from 'react';
import Dropdown from './CDropdown';

const options = [
  { label: 'A', value: 'a' },
  { label: 'B', value: 'b' },
];

export default function DropdownWrapper() {
  const handleSelect = (option: { label: string; value: string }) => {
    console.log('Selected:', option);
  };

  return (
    <Dropdown options={options} onSelect={handleSelect} placeholder="Choose" />
  );
}
