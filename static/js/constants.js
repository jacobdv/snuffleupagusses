// All files.
const cityLink = 'https://high-speed-internet.herokuapp.com/api/cities/'
const stateLink = 'https://high-speed-internet.herokuapp.com/api/states/'

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