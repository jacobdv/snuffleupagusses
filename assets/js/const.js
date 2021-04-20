// SVG and Chart Dimensions
const svgHeight = 500;
const svgWidth = 960;
const margin = { top:20, right:40, bottom:80, left:100 };
const chartHeight = svgHeight - (margin.top + margin.bottom);
const chartWidth = svgWidth - (margin.left + margin.right);

// Transition
const duration = 1500;

// Adding elements to HTML page.
// SVG
const svg = d3.select('#vis-one')
    .append('svg')
    .attr('height', svgHeight)
    .attr('width', svgWidth);
// ChartGroup
const chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);