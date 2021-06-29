// All files.
const cityLink = 'http://127.0.0.1:5000/api/cities/'
const stateLink = 'http://127.0.0.1:5000/api/states/'

// Map.
const mapCenter = [39.8283, -98.5795];
// Scatterplot.
const svgH = 500;
const svgW = 800;
const margin = { top:20, right:40, bottom:120, left:100 };
const chartH = svgH - (margin.top + margin.bottom);
const chartW = svgW - (margin.left + margin.right);
const duration = 1500;
const aDuration = duration - 800;