const fs = require('fs');
const path = require('path');

const files = [
  'RecordMaintenanceDashboard.jsx',
  'HostelAuthorityDashboard.jsx',
  'EducationFacilitiesDashboard.jsx',
  'ConductionMeetingsDashboard.jsx',
  'FeedbackDashboard.jsx'
];

const dir = '/Users/sohamghadge/Desktop/Projects/work/renext/src/components/dashboard/presentation/';

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace imports
  content = content.replace(/import ColumnComparison from '..\/..\/charts\/ColumnComparison'/g, "import ModernCompareChart from '../shared/ModernCompareChart'");
  content = content.replace(/import HCBarChart from '..\/..\/charts\/HCBarChart'/g, "import ModernFrequencyChart from '../shared/ModernFrequencyChart'");
  content = content.replace(/import HCPieChart from '..\/..\/charts\/HCPieChart'/g, "import ModernPieChart from '../shared/ModernPieChart'");
  
  // Clean up any double imports just in case
  content = content.replace(/import ColumnComparison from '..\/..\/charts\/ColumnComparison';?\n?/g, "");
  content = content.replace(/import HCBarChart from '..\/..\/charts\/HCBarChart';?\n?/g, "");
  content = content.replace(/import HCPieChart from '..\/..\/charts\/HCPieChart';?\n?/g, "");
  
  // Add missing imports if they don't exist
  if (!content.includes('ModernCompareChart') && content.includes('<ColumnComparison')) {
    content = content.replace(/(import .* from '.*'\n)/, "$1import ModernCompareChart from '../shared/ModernCompareChart'\n");
  }
  if (!content.includes('ModernFrequencyChart') && content.includes('<HCBarChart')) {
    content = content.replace(/(import .* from '.*'\n)/, "$1import ModernFrequencyChart from '../shared/ModernFrequencyChart'\n");
  }
  if (!content.includes('ModernPieChart') && content.includes('<HCPieChart')) {
    content = content.replace(/(import .* from '.*'\n)/, "$1import ModernPieChart from '../shared/ModernPieChart'\n");
  }

  // Replace components
  content = content.replace(/<ColumnComparison/g, '<ModernCompareChart');
  content = content.replace(/<HCBarChart/g, '<ModernFrequencyChart');
  content = content.replace(/<HCPieChart/g, '<ModernPieChart');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Ported ${file}`);
});
